import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "hacksus-track-timers";
// PASTE YOUR GOOGLE APPS SCRIPT URL HERE
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD4d0iFGtXe0UAOqYJReovTf5Srbj3jJMDZuCqCUyZFxV1o1fBtW3FClcMHuYlTCyUxg/exec";

interface TrackTimerState {
    [trackName: string]: { startedAt: string };
}

interface Elapsed {
    hours: number;
    minutes: number;
    seconds: number;
}

function getStoredTimers(): TrackTimerState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function setStoredTimers(state: TrackTimerState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useTrackTimer(trackName: string) {
    const [startedAt, setStartedAt] = useState<string | null>(() => {
        const timers = getStoredTimers();
        return timers[trackName]?.startedAt ?? null;
    });

    const [elapsed, setElapsed] = useState<Elapsed>({ hours: 0, minutes: 0, seconds: 0 });
    const [remaining, setRemaining] = useState<Elapsed>({ hours: 42, minutes: 0, seconds: 0 });
    const [isLoading, setIsLoading] = useState(false);

    // Initial fetch to sync with Google Sheets
    useEffect(() => {
        if (!APPS_SCRIPT_URL) return;

        const syncWithSheets = async () => {
            try {
                const response = await fetch(APPS_SCRIPT_URL);
                const remoteTimers: TrackTimerState = await response.json();

                if (remoteTimers[trackName]?.startedAt) {
                    const localTimers = getStoredTimers();
                    localTimers[trackName] = remoteTimers[trackName];
                    setStoredTimers(localTimers);
                    setStartedAt(remoteTimers[trackName].startedAt);
                }
            } catch (error) {
                console.error("Failed to sync timers:", error);
            }
        };

        syncWithSheets();
    }, [trackName]);

    const startTimer = useCallback(async () => {
        const now = new Date().toISOString();

        // 1. Update Local
        const timers = getStoredTimers();
        timers[trackName] = { startedAt: now };
        setStoredTimers(timers);
        setStartedAt(now);

        // 2. Update Remote (Fire and forget or handle loading)
        if (APPS_SCRIPT_URL) {
            try {
                await fetch(APPS_SCRIPT_URL, {
                    method: "POST",
                    body: JSON.stringify({ trackName, startedAt: now, action: "start" }),
                });
            } catch (error) {
                console.error("Failed to update remote timer:", error);
            }
        }
    }, [trackName]);

    const resetTimer = useCallback(async () => {
        // 1. Update Local
        const timers = getStoredTimers();
        delete timers[trackName];
        setStoredTimers(timers);
        setStartedAt(null);

        // 2. Update Remote
        if (APPS_SCRIPT_URL) {
            try {
                await fetch(APPS_SCRIPT_URL, {
                    method: "POST",
                    body: JSON.stringify({ trackName, action: "reset" }),
                });
            } catch (error) {
                console.error("Failed to reset remote timer:", error);
            }
        }
    }, [trackName]);

    useEffect(() => {
        if (!startedAt) return;

        const TOTAL_MS = 42 * 60 * 60 * 1000; // 42 hours

        const compute = () => {
            const diff = Date.now() - new Date(startedAt).getTime();
            if (diff < 0) return;
            setElapsed({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
            const left = Math.max(TOTAL_MS - diff, 0);
            setRemaining({
                hours: Math.floor(left / (1000 * 60 * 60)),
                minutes: Math.floor((left % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((left % (1000 * 60)) / 1000),
            });
        };

        compute();
        const interval = setInterval(compute, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    return {
        startedAt,
        elapsed,
        remaining,
        startTimer,
        resetTimer,
        isStarted: startedAt !== null,
        isLoading
    };
}
