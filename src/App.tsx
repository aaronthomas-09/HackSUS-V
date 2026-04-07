import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Dithering } from "@paper-design/shaders-react";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AstraX = lazy(() => import("./pages/AstraX"));
const CarbonX = lazy(() => import("./pages/CarbonX"));
const SyncConX = lazy(() => import("./pages/SyncConX"));
const HeliX = lazy(() => import("./pages/HeliX"));
const ScreenX = lazy(() => import("./pages/ScreenX"));
const UnmuteX = lazy(() => import("./pages/UnmuteX"));
const Kruisex = lazy(() => import("./pages/Kruizex"));
const MuLearn = lazy(() => import("./pages/MuLearn"));

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const showGlobalDithering = location.pathname !== "/carbonx";

  return (
    <>
      {showGlobalDithering ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            pointerEvents: "none",
            overflow: "hidden",
            opacity: 0.08,
          }}
        >
          <Dithering
            width={typeof window !== "undefined" ? window.innerWidth : 1280}
            height={typeof window !== "undefined" ? window.innerHeight : 720}
            colorBack="#00000000"
            colorFront="#e71818"
            shape="warp"
            type="random"
            size={1}
            speed={0.1}
            scale={0.68}
            offsetX={0.28}
            offsetY={-0.3}
          />
        </div>
      ) : null}

      <div style={{ position: "relative", zIndex: 1, pointerEvents: "auto" }}>
        <Toaster />
        <Sonner />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/astraX" element={<AstraX />} />
            <Route path="/carbonx" element={<CarbonX />} />
            <Route path="/syncconx" element={<SyncConX />} />
            <Route path="/helix" element={<HeliX />} />
            <Route path="/screenx" element={<ScreenX />} />
            <Route path="/unmutex" element={<UnmuteX />} />
            <Route path="/kruizex" element={<Kruisex />} />
            <Route path="/mulearn" element={<MuLearn />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
