# HackS'US Edition V

## Project Overview
**HackS'US Edition V** is a premiere hackathon organized by the **IEDC** and **IIC** of Rajagiri School of Engineering & Technology (RSET). The project is a multi-track hackathon platform featuring distinct visual identities for each track (Side X).

## File Structure

```text
HackSUS-V/
├── docs/                 # Documentation and Problem Statements (PDFs)
├── public/               # Static assets (images, logos, videos, fonts)
├── src/
│   ├── components/       # Shared UI components (Navbar, Footer, Section layouts)
│   ├── pages/            # Main page components for each event track
│   │   ├── Index.tsx     # Landing page for HackS'US Edition V
│   │   ├── AstraX.tsx    # Tech/Software track
│   │   ├── CarbonX.tsx   # Sustainability/Eco track
│   │   ├── HeliX.tsx     # Aerospace track
│   │   ├── Kruizex.tsx   # Kochi Water Metro - Problathon
│   │   ├── ScreenX.tsx   # Media/Entertainment track
│   │   ├── SyncConX.tsx  # Hardware/IoT track
│   │   └── UnmuteX.tsx   # Music/Sonic tech track
│   ├── App.tsx           # Main application entry and routing
│   └── main.tsx          # React mount point
└── vercel.json           # Vercel deployment configuration
```

## Event Tracks & Aesthetics

Each track has a unique design language tailored to its theme:

- **Index (Main)**: The central hub featuring a clean, dark-themed dashboard look with high-energy red accents.
- **Astra X (Software)**: Futuristic and data-driven, featuring holographic cards and network graph visualizations.
- **Carbon X (Electrical & Electronics)**: The flagship hardware-centric track by the ECE department. It features two specialized lanes:
    - **Vegathon**: Focused on systems-level builds using the indigenous VEGA processor lineage.
    - **Electrothon**: Focused on EDA-based workflows (Design, Simulate, Validate).
    - **Aesthetics**: High-tech "circuit board" design with magnetic particle effects and deep-tech elements.
- **Heli X (Civil Engineering)**: Industrial blueprint aesthetic where "AI meets Modern Civil Engineering." It features technical dimension lines, crosshair cursors, structural equations, and a drafting-table background.
- **Kruize X (KMRL Problathon Pre-Event)**: Theme inspired by the Kochi Water Metro, featuring deep blue gradients and water-inspired aesthetics.
- **Unmute X (Music)**: Audio-centric design featuring a revolving vinyl record header and "Now Playing" navigation bars.
- **Screen X (Film & Creator Tech)**: Cinematic aesthetic "Where AI meets the art of filmmaking." It features a film-reel background, production pipeline carousels (storyboarding, editing, etc.), and a vintage movie-theatre vibe.
- **SyncCon X (Electrical & Instrumentation)**: Industrial systems focus, featuring components like "Industrial Oscilloscopes" and instrumentation-themed layouts.

## Technologies Used

This project is built with:

- **React & Vite**: Fast development and optimized production builds.
- **TypeScript**: Type-safe development.
- **Framer Motion**: Smooth, high-performance animations and transitions.
- **Tailwind CSS**: Modern utility-first styling.
- **Lucide React**: Comprehensive icon system.
- **shadcn/ui**: High-quality pre-built accessible components.
