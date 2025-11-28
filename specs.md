# Project Specifications: Sing(h)it

## Overview

**Sing(h)it!** is a web-based party game where players must sing a song containing a specific word. It features a "First-Come-First-Served" mechanic where players buzz in to answer. The game supports multiple languages (Italian, English, Mixed), tracks scores and time, and includes PWA support for offline play.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: Zustand (with persistence)
- **Icons**: Lucide React
- **PWA**: `next-pwa` (Webpack-based)
- **Package Manager**: npm

## Folder Structure

```plaintext
/
├── public/                 # Static assets (icons, manifest, logo)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout with metadata & fonts
│   │   ├── page.tsx        # Entry point (GameContainer)
│   │   └── globals.css     # Global styles & Tailwind directives
│   ├── components/
│   │   ├── game/           # Game-specific components
│   │   │   ├── ConfigModal.tsx      # Game settings (rounds, language)
│   │   │   ├── GameBoard.tsx        # Main game interface
│   │   │   ├── GameContainer.tsx    # State-based view switcher
│   │   │   ├── GameOverScreen.tsx   # Final results view
│   │   │   ├── LeaderboardModal.tsx # Current standings
│   │   │   ├── SetupScreen.tsx      # Player entry & initial setup
│   │   │   └── VerifyModal.tsx      # Answer verification
│   │   └── ui/             # Reusable UI components (Shadcn)
│   ├── data/
│   │   └── words.ts        # Word lists (Italian, English)
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn helper)
│   ├── store/
│   │   └── game.ts         # Global game state & logic
│   └── types/
│       └── game.ts         # TypeScript definitions
├── next.config.ts          # Next.js & PWA configuration
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

## Core Patterns & Architecture

### State Management (Zustand)

- **Centralized Logic**: All game logic resides in `src/store/game.ts`. Components trigger actions, and the store updates the state.
- **Persistence**: The store uses `persist` middleware to save state to `localStorage`, allowing game recovery on reload.
- **Phases**: The game flow is controlled by `currentPhase` (`SETUP` -> `ACTIVE` -> `VERIFY` -> `ROUND_END` -> `GAME_OVER`).

### Game Logic

- **Timer**: A custom timer implementation tracks elapsed time. It supports pausing (buzzing), resuming (mistake), and toggling (manual click).
- **Scoring**:
  - +1 point for correct answers.
  - -1 point for incorrect answers.
  - **Tie-Breaker**: Players are ranked by Score (descending), then by Total Time (ascending).
- **Word Queue**: Words are shuffled and managed in a queue. The "Change Word" feature allows skipping the current word without advancing the round.

### UI/UX

- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Dark Mode**: Default dark theme with vibrant accents.
- **Accessibility**: `aria-labels` and semantic HTML used throughout.
- **PWA**: Configured for installation and offline use. Note: Uses Webpack for build due to `next-pwa` incompatibility with Turbopack.

## Best Practices

1. **Strict TypeScript**: All types are defined in `src/types/game.ts`. No `any` types.
2. **Component Modularity**: Components are small, focused, and located in `src/components/game`.
3. **Separation of Concerns**: Logic is in the store; UI is in components.
4. **Tailwind v4**: Uses the latest Tailwind features and variables for theming.
5. **English Codebase**: All code, comments, and internal identifiers are in English.

## Key Features

- **Dynamic Word Lists**: Supports IT, EN, and MIX modes with hundreds of words.
- **Motion Detection**: (Experimental) Stops timer on device motion.
- **Offline Capable**: Full PWA support.
- **Leaderboards**: Real-time ranking with time-based tie-breaking.

## Configuration

- **Build**: `npm run build` (uses `--webpack` for PWA support).
- **Dev**: `npm run dev` (uses `--turbopack` for speed).
