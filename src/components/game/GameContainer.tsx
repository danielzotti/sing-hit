'use client';

import { useGameStore } from '@/store/game';
import { SetupScreen } from './SetupScreen';
import { GameBoard } from './GameBoard';
import { GameOverScreen } from './GameOverScreen';

export function GameContainer() {
    const currentPhase = useGameStore((state) => state.currentPhase);

    if (currentPhase === 'SETUP') {
        return <SetupScreen />;
    }

    if (currentPhase === 'GAME_OVER') {
        return <GameOverScreen />;
    }

    // ACTIVE, VERIFY, ROUND_END
    return <GameBoard />;
}
