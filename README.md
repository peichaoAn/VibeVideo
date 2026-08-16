# VibeVideo

AI-powered video generation studio. Turn your imagination into stunning video — on the web, desktop and mobile.

## Tech Stack

- **Framework**: React 18 + Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Desktop**: Electron + electron-builder
- **Design**: Dark, modern, glassmorphism — Western/US premium aesthetic

## Getting Started

### Prerequisites

- Node.js 18.18+ (or 20+)
- npm

### Install

```bash
npm install
```

### Run the web app (development)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build the static site (production)

```bash
npm run build
```

The static export is written to `out/`.

## Mobile App (Capacitor)

The web app can be wrapped as a native Android app via Capacitor (`webDir: out`). First build the static site, then sync:

```bash
npm run build
npx cap sync android
```

Open the `android/` folder in Android Studio to build and run.

## Desktop App (Electron)

### Run in development (with hot reload)

```bash
npm run electron:dev
```

This compiles the Electron main/preload scripts, starts the Next dev server, and launches the Electron window pointing at it.

### Build the desktop installer

```bash
npm run electron:build
```

This builds the static site and packages a distributable (NSIS installer on Windows, DMG on macOS, AppImage on Linux) into `dist-release/`.

### Build for Windows only

```bash
npm run electron:build:win
```

Builds and packages a Windows NSIS installer (and a portable `win-unpacked/` folder) into `dist-release/`, using a China mirror for the electron-builder binaries.

> **Windows users**: you can also simply double-click `build-win.bat` in the project root. It checks Node.js/npm, installs dependencies if needed, then runs the Windows build and reports the output paths.

## Project Structure

```
VibeVideo/
├── electron/           # Electron main process & preload
├── android/            # Capacitor Android project
├── src/
│   ├── app/            # App Router pages (landing, generate, library)
│   ├── components/     # UI components (layout, landing, generate, library, ui)
│   ├── hooks/          # Custom hooks (use-generate)
│   └── lib/            # Utilities, types, mock data
├── next.config.mjs     # Next.js config (static export)
├── capacitor.config.ts # Capacitor config
├── tailwind.config.ts  # Tailwind theme & animations
└── components.json     # shadcn/ui config
```

## Pages

- **Home (`/`)** — Hero + feature highlights
- **Generate (`/generate`)** — Prompt input, style/ratio/duration params, generation flow
- **Library (`/library`)** — Responsive grid of generated works with filtering

## Next Steps

The AI generation pipeline is currently a **placeholder**. To wire up real generation:

1. Add your AI video generation API credentials via environment variables.
2. Replace the simulated logic in `src/hooks/use-generate.ts` with a real API call (or a Next.js Route Handler acting as a proxy).
3. Replace the mock works in `src/lib/works.ts` with data fetched from your backend.

## License

Private project.
