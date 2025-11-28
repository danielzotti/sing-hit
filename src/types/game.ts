export type Player = {
  id: string;
  name: string;
  score: number;
  totalTime: number; // Total time spent answering correctly (in ms)
  firstCorrectAnswerAt?: number; // Timestamp of the first correct answer
};

export type GamePhase = 'SETUP' | 'ACTIVE' | 'VERIFY' | 'ROUND_END' | 'GAME_OVER';

export type GameState = {
  players: Player[];
  currentPhase: GamePhase;
  currentWord: string | null;
  currentSingerId: string | null; // ID of the player who pressed the button
  totalRounds: number | null; // null means infinite
  currentRound: number;
  language: 'IT' | 'EN' | 'MIX';
  wordsQueue: string[];
  startTime: number | null;
  elapsedTime: number | null;
  isTimerRunning: boolean;
  showUpsideDown: boolean;
};
