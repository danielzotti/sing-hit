# Sing(h)it! 🎤

> The H is silent. U are not!

[Sing(h)it!](https://sing-hit.vercel.app) is an engaging party game designed to test your musical knowledge and quick thinking! Gather your friends, challenge them to sing songs containing specific words, and see who can reach the top of the leaderboard.

> The code is almost totally written by [Google Antigravity](https://antigravity.google/). I did just about 10-20 interactions and some manual adjustments!

## 🎮 How to Play

1. **Setup**:
    * Add players (minimum 2).
    * Choose the number of rounds or toggle "Infinite Mode" for endless fun.
    * Select your preferred language for words: Italian (IT), English (EN), or Mixed (MIX).

2. **The Challenge**:
    * A random word appears on the screen.
    * Players race to think of a song that contains that word.

3. **Buzz In**:
    * The first player to tap their name button (or to grap the smartphone) "buzzes" in.
    * They must immediately sing the snippet of the song containing the word.

4. **Verification**:
    * The group decides if the song is valid.
    * **Correct**: The player earns **+1 point**.
    * **Incorrect**: The player loses **-1 point**.

5. **Winning**:
    * The game ends when the set number of rounds is reached (or manually in Infinite Mode).
    * The player with the highest score is crowned the champion! 🏆

## 🛠️ Technologies Used

This project is built with a modern, robust tech stack ensuring performance, accessibility, and a great user experience:

* **[Next.js 16](https://nextjs.org/)**: The React framework for the web.
* **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
* **[Shadcn UI](https://ui.shadcn.com/)**: Reusable components built with Radix UI and Tailwind CSS.
* **[Zustand](https://github.com/pmndrs/zustand)**: A small, fast, and scalable bearbones state-management solution.
* **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
* **[React DOM Confetti](https://github.com/daniel-lundin/react-dom-confetti)**: For that extra celebration effect!

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start the game.

## 📱 Mobile First

The interface is designed with a **Mobile-First** approach, ensuring a seamless experience on smartphones and tablets. It features:

* **Dark Theme**: High contrast for better visibility in low-light party settings.
* **Large Touch Targets**: Easy-to-tap buttons for frantic gameplay.
* **No Hover Dependencies**: Fully optimized for touch interactions.

Enjoy the game! 🎵

## 📲 Progressive Web App (PWA)

This application is a fully functional **Progressive Web App**! This means you can:

* **Install it**: Add it to your home screen for a native app-like experience.
* **Play Offline**: Once installed (or visited once), the game works completely without an internet connection. Perfect for parties with spotty Wi-Fi!
* **Auto-Updates**: The app automatically checks for updates in the background.

## FUTURE IMPROVEMENTS

* Desktop mode
* Auto set upside down mode based on device
* Tests
* New languages / words
* Multiplayer mode with bluetooth or internet (each player has their own device)
* Use turbopack instead of webpack
