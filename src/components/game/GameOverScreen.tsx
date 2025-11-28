'use client';

import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw, Trash2 } from 'lucide-react';
import Confetti from 'react-dom-confetti';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function GameOverScreen() {
    const { players, resetGame, restartGameWithSamePlayers } = useGameStore();
    const [showConfetti, setShowConfetti] = useState(false);

    const sortedPlayers = [...players].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        // Tie-breaker: less total time wins
        return a.totalTime - b.totalTime;
    });

    const winner = sortedPlayers[0];
    const hasWinner = winner && winner.score > 0;

    useEffect(() => {
        if (hasWinner) {
            setShowConfetti(true);
        }
    }, [hasWinner]);

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 45,
        elementCount: 100,
        dragFriction: 0.1,
        duration: 5000,
        stagger: 3,
        width: "12px",
        height: "12px",
        perspective: "500px",
        colors: ["#ffffff", "#000000", "#e4e4e7"]
    };

    return (
        <div className="bg-background overflow-hidden h-dvh relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Confetti active={showConfetti} config={confettiConfig} />
            </div>
            <div className="h-full overflow-auto p-4">
                <Card className="flex flex-col items-stretch justify-stretch w-full max-w-xl h-full min-h-[800px] mx-auto border-2 border-border bg-card shadow-xl overflow-hidden">
                    <CardHeader className="text-center">
                        <Image className="mx-auto" src="/sing-hit-logo-name.png" alt="Sing(h)it logo" width={456 / 2} height={382 / 2} />
                        {!hasWinner && <CardTitle className="text-4xl font-black tracking-tight text-foreground">
                            GAME OVER
                        </CardTitle>}
                    </CardHeader>
                    <CardContent className="space-y-8 flex-1 min-h-[200px] overflow-hidden max-h-full flex flex-col">
                        <div className="text-center space-y-2">
                            {hasWinner ? (
                                <>
                                    <h2 className="text-lg text-muted-foreground font-bold uppercase tracking-widest">The champion is</h2>
                                    <p className="text-5xl font-black text-foreground">{winner?.name}</p>
                                    <div className="inline-block px-6 py-2 rounded-full bg-secondary border-2 border-border text-secondary-foreground font-bold text-2xl">
                                        {winner?.score} Points
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-lg text-muted-foreground font-bold uppercase tracking-widest">No Winner</h2>
                                    <p className="text-xl font-medium text-muted-foreground">No one scored positive points.</p>
                                </>
                            )}
                        </div>

                        <div className="flex-1 space-y-3 max-h-[100%] overflow-y-auto rounded-lg bg-secondary/20 border border-border pr-2">
                            <div className="p-4 space-y-2" role="list">
                                {sortedPlayers.map((player, index) => (
                                    <div
                                        key={player.id}
                                        className={cn(
                                            "flex justify-between items-center p-3 rounded-lg border",
                                            player.score > 0 && "bg-green-500/10 border-green-500/20 text-green-500",
                                            player.score < 0 && "bg-red-500/10 border-red-500/20 text-red-500",
                                            player.score === 0 && "bg-secondary border-border"
                                        )}
                                        role="listitem"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border aspect-square",
                                                index === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {index + 1}
                                            </span>
                                            <span className="font-bold text-lg text-foreground">{player.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={cn(
                                                "font-bold text-xl",
                                                player.score > 0 && "text-green-500",
                                                player.score < 0 && "text-red-500",
                                                player.score === 0 && "text-foreground"
                                            )}>{player.score}</span>
                                            <span className="text-xs font-mono text-muted-foreground">{(player.totalTime / 1000).toFixed(2)}s</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button size="lg" className="w-full h-14 text-lg font-bold border-2 border-primary" onClick={restartGameWithSamePlayers}>
                                <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" /> Same Players
                            </Button>
                            <Button size="lg" variant="outline" className="w-full h-14 text-muted-foreground font-bold border-2 border-border" onClick={resetGame}>
                                <Trash2 className="w-5 h-5 mr-2" aria-hidden="true" /> New Game
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
