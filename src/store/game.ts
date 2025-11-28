import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Player, GamePhase } from '@/types/game';
import { italianWords, englishWords } from '@/data/words';

interface GameActions {
    addPlayer: (name: string) => void;
    removePlayer: (id: string) => void;
    setTotalRounds: (rounds: number | null) => void;
    setLanguage: (lang: 'IT' | 'EN' | 'MIX') => void;
    startGame: () => void;
    nextRound: () => void;
    buzzPlayer: (playerId: string) => void;
    verifyAnswer: (correct: boolean) => void;
    cancelVerify: () => void;
    resetGame: () => void;
    restartGameWithSamePlayers: () => void;
    endGameEarly: () => void;
    stopTimer: () => void;
    toggleTimer: () => void;
    skipWord: () => void;
    toggleShowUpsideDown: () => void;
}

type GameStore = GameState & GameActions;

const INITIAL_STATE: GameState = {
    players: [],
    currentPhase: 'SETUP',
    currentWord: null,
    currentSingerId: null,
    totalRounds: 10,
    currentRound: 1,
    language: 'MIX',
    wordsQueue: [],
    startTime: null,
    elapsedTime: null,
    isTimerRunning: false,
    showUpsideDown: true,
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            addPlayer: (name) =>
                set((state) => {
                    if (state.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                        return state;
                    }
                    const newPlayers = [
                        ...state.players,
                        { id: crypto.randomUUID(), name, score: 0, totalTime: 0 },
                    ];
                    // Sort alphabetically
                    return {
                        players: newPlayers.sort((a, b) => a.name.localeCompare(b.name)),
                    };
                }),

            removePlayer: (id) =>
                set((state) => ({
                    players: state.players.filter((p) => p.id !== id),
                })),

            setTotalRounds: (rounds) => set({ totalRounds: rounds }),

            setLanguage: (lang) => set({ language: lang }),

            startGame: () => {
                const { language, players } = get();
                if (players.length === 0) return;

                // Generate words queue
                let words: string[] = [];
                if (language === 'IT') words = [...italianWords];
                else if (language === 'EN') words = [...englishWords];
                else {
                    words = [...italianWords, ...englishWords];
                }

                // Shuffle words
                words = words.sort(() => 0.5 - Math.random());

                set({
                    currentPhase: 'ACTIVE',
                    wordsQueue: words,
                    currentWord: words[0],
                    currentRound: 1,
                    players: players.map(p => ({ ...p, score: 0, totalTime: 0, firstCorrectAnswerAt: undefined })), // Reset scores, times and timestamps
                    startTime: Date.now(),
                    elapsedTime: 0,
                    isTimerRunning: true,
                });
            },

            nextRound: () => {
                const { wordsQueue, totalRounds, currentRound } = get();

                // Check round limit
                if (totalRounds !== null && currentRound >= totalRounds) {
                    set({ currentPhase: 'GAME_OVER' });
                    return;
                }

                const nextWords = [...wordsQueue];
                nextWords.shift(); // Remove current word

                // If we run out of words, replenish
                if (nextWords.length === 0) {
                    const { language } = get();
                    let newWords: string[] = [];
                    if (language === 'IT') newWords = [...italianWords];
                    else if (language === 'EN') newWords = [...englishWords];
                    else newWords = [...italianWords, ...englishWords];

                    nextWords.push(...newWords.sort(() => 0.5 - Math.random()));
                }

                set({
                    currentPhase: 'ACTIVE',
                    currentWord: nextWords[0],
                    wordsQueue: nextWords,
                    currentSingerId: null,
                    currentRound: currentRound + 1,
                    startTime: Date.now(),
                    elapsedTime: 0,
                    isTimerRunning: true,
                });
            },

            buzzPlayer: (playerId) => {
                const { currentPhase, isTimerRunning, startTime, elapsedTime } = get();
                if (currentPhase !== 'ACTIVE') return;

                set({
                    currentPhase: 'VERIFY',
                    currentSingerId: playerId,
                    isTimerRunning: false,
                    elapsedTime: isTimerRunning && startTime ? Date.now() - startTime : (elapsedTime || 0),
                });
            },

            verifyAnswer: (correct) => {
                const { players, currentSingerId, totalRounds, currentRound, elapsedTime, startTime, isTimerRunning } = get();
                if (!currentSingerId) return;

                // Calculate current elapsed time if timer is running, otherwise use stored elapsed
                const currentElapsed = isTimerRunning && startTime ? Date.now() - startTime : (elapsedTime || 0);

                const updatedPlayers = players.map((p) => {
                    if (p.id === currentSingerId) {
                        const isFirstCorrect = correct && !p.firstCorrectAnswerAt;
                        return {
                            ...p,
                            score: p.score + (correct ? 1 : -1),
                            totalTime: correct ? p.totalTime + currentElapsed : p.totalTime,
                            firstCorrectAnswerAt: isFirstCorrect ? Date.now() : p.firstCorrectAnswerAt,
                        };
                    }
                    return p;
                });

                // Check if this was the last round (logic moved to nextRound usually, but here we check if we should end NOW?)
                // Requirement says: "Turno x di y". Usually game ends after round X is completed.
                // But "First-Come-First-Served" implies one person sings per round.
                // So after verification, the round is effectively over.
                // If we want to show scores before next round, we go to ROUND_END.
                // If it was the last round, should we go to GAME_OVER directly?
                // Let's go to ROUND_END, and nextRound will handle the transition to GAME_OVER if limit reached.
                // Wait, if currentRound == totalRounds, nextRound will increment to totalRounds + 1 and THEN check?
                // Let's check here if we want to end immediately after verification or let user see scores.
                // Let's let user see scores in ROUND_END.

                const isLastRound = totalRounds !== null && currentRound >= totalRounds;

                set({
                    players: updatedPlayers,
                    currentPhase: isLastRound ? 'GAME_OVER' : 'ROUND_END',
                });
            },

            cancelVerify: () => {
                const { elapsedTime } = get();
                set({
                    currentPhase: 'ACTIVE',
                    currentSingerId: null,
                    isTimerRunning: true,
                    startTime: Date.now() - (elapsedTime || 0),
                });
            },

            resetGame: () => {
                set({
                    ...INITIAL_STATE,
                    players: [],
                    currentPhase: 'SETUP',
                });
            },

            restartGameWithSamePlayers: () => {
                const { players } = get();
                set({
                    ...INITIAL_STATE,
                    ...INITIAL_STATE,
                    players: players.map(p => ({ ...p, score: 0, totalTime: 0, firstCorrectAnswerAt: undefined })),
                    currentPhase: 'SETUP',
                });
            },

            endGameEarly: () => {
                set({ currentPhase: 'GAME_OVER', isTimerRunning: false });
            },

            stopTimer: () => {
                const { isTimerRunning, startTime } = get();
                if (!isTimerRunning || !startTime) return;

                set({
                    isTimerRunning: false,
                    elapsedTime: Date.now() - startTime,
                });
            },

            toggleTimer: () => {
                const { isTimerRunning, startTime, elapsedTime } = get();
                if (isTimerRunning) {
                    // Stop
                    set({
                        isTimerRunning: false,
                        elapsedTime: startTime ? Date.now() - startTime : (elapsedTime || 0),
                    });
                } else {
                    // Start
                    set({
                        isTimerRunning: true,
                        startTime: Date.now() - (elapsedTime || 0),
                    });
                }
            },

            skipWord: () => {
                const { wordsQueue, currentPhase } = get();
                if (currentPhase !== 'ACTIVE') return;

                const nextWords = [...wordsQueue];
                nextWords.shift(); // Remove current word

                // If we run out of words, replenish
                if (nextWords.length === 0) {
                    const { language } = get();
                    let newWords: string[] = [];
                    if (language === 'IT') newWords = [...italianWords];
                    else if (language === 'EN') newWords = [...englishWords];
                    else newWords = [...italianWords, ...englishWords];

                    nextWords.push(...newWords.sort(() => 0.5 - Math.random()));
                }

                set({
                    currentWord: nextWords[0],
                    wordsQueue: nextWords,
                    startTime: Date.now(),
                    elapsedTime: 0,
                    isTimerRunning: true,
                });
            },

            toggleShowUpsideDown: () => set((state) => ({ showUpsideDown: !state.showUpsideDown })),
        }),
        {
            name: 'canta-parola-storage',
            partialize: (state) => ({
                players: state.players,
                currentPhase: state.currentPhase,
                currentWord: state.currentWord,
                currentSingerId: state.currentSingerId,
                totalRounds: state.totalRounds,
                currentRound: state.currentRound,
                language: state.language,
                wordsQueue: state.wordsQueue,
                startTime: state.startTime,
                elapsedTime: state.elapsedTime,
                isTimerRunning: state.isTimerRunning,
                showUpsideDown: state.showUpsideDown,
            }),
        }
    )
);
