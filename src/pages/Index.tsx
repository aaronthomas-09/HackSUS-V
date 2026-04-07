import { useState, useEffect } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DetailsSection from "@/components/DetailsSection";
import TracksSection from "@/components/TracksSection";
import WorkshopsSection from "@/components/WorkshopsSection";
import CommunityPartnersSection from "@/components/CommunityPartnersSection";
import ClubCollaboratorsSection from "@/components/ClubCollaboratorsSection";
import PreEventsTimeline from "@/components/PreEventsTimeline";
import ScheduleSection from "@/components/ScheduleSection";
import SponsorsSection from "@/components/SponsorsSection";
import FAQSection from "@/components/FAQSection";
import CountdownTimer from "@/components/CountdownTimer";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isKruizeXOpen, setIsKruizeXOpen] = useState(false);
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  useEffect(() => {
    const popupSeenKey = "hacksus:kruizex-popup-seen";
    const scrollKey = "hacksus:index-scroll-y";

    // Restore scroll position when user returns with browser history navigation.
    if (navigationType === "POP") {
      const savedScrollY = sessionStorage.getItem(scrollKey);
      if (savedScrollY) {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: Number(savedScrollY), behavior: "auto" });
        });
      }
    } else {
      // Fresh entry to the page should start from the top.
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    // Show popup only once per tab/session to avoid repeated interruptions.
    const hasSeenPopup = sessionStorage.getItem(popupSeenKey) === "1";
    if (!hasSeenPopup) {
      setIsKruizeXOpen(true);
      sessionStorage.setItem(popupSeenKey, "1");
    }

    return () => {
      sessionStorage.setItem(scrollKey, String(window.scrollY));
    };
  }, [navigationType]);

  return (
    <>
      <main className="text-foreground overflow-x-hidden">
        {/* <Navbar /> */}
        <HeroSection />
        <AboutSection />
        <DetailsSection />
        <TracksSection />
        <WorkshopsSection />
        <SponsorsSection />
        <CommunityPartnersSection />
        <ClubCollaboratorsSection />
        <PreEventsTimeline />
        {/* <ScheduleSection /> */}
        <CountdownTimer />
        {/* <FAQSection /> */}
        <Footer />
      </main>

      {/* KruizeX Event Pop-up */}
      {/* <Dialog open={isKruizeXOpen} onOpenChange={setIsKruizeXOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg mx-auto">
          <DialogHeader>
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/images/hacksus_logo.webp" alt="Water Metro" className="h-20 w-auto" />
              <span className="text-4xl text-primary font-bold ml-2">×</span>
              <img src="/images/waterMetro.webp" alt="HackSUS" className="h-20 w-auto" />
            </div>
            <DialogTitle className="text-7xl text-[#2563eb] text-center tracking-widest">Kruize<span className="ml-2">X</span></DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-foreground mt-2">
              Participate in this exclusive Problathon on the <span className="text-[#2563eb]">Kochi Water Metro</span> as part of the <span className="text-red-600 font-semibold">HackS'US Edition V Pre-Event</span>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-3">
            <Button
              onClick={() => {
                navigate("/kruizex");
              }}
              className="flex-1 bg-[#2563eb] hover:bg-[#2563eb] !focus:ring-[#2563eb] !focus:ring-offset-0 !ring-[#2563eb]"
            >
              VISIT PAGE
            </Button>
          </DialogFooter>
        </DialogContent >
      </Dialog > */}
    </>
  );
};

export default Index;
