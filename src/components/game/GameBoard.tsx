'use client';

import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VerifyModal } from './VerifyModal';
import { ConfigModal } from './ConfigModal';
import { LeaderboardModal } from './LeaderboardModal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

export function GameBoard() {
    const {
        players,
        currentWord,
        buzzPlayer,
        currentPhase,
        nextRound,
        currentRound,
        totalRounds,
        startTime,
        elapsedTime,
        isTimerRunning,
        stopTimer,
        toggleTimer,
        skipWord,
        showUpsideDown
    } = useGameStore();

    const [localElapsed, setLocalElapsed] = useState(0);

    // Timer effect
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isTimerRunning && startTime) {
            // Update immediately to avoid lag
            setLocalElapsed(Date.now() - startTime);

            intervalId = setInterval(() => {
                setLocalElapsed(Date.now() - startTime);
            }, 37); // ~27fps, good enough for text updates
        } else if (!isTimerRunning && elapsedTime !== null) {
            setLocalElapsed(elapsedTime);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isTimerRunning, startTime, elapsedTime]);

    // Motion detection effect
    useEffect(() => {
        if (!isTimerRunning) return;

        const handleMotion = (event: DeviceMotionEvent) => {
            if (!event.acceleration) return;

            const { x, y, z } = event.acceleration;
            const totalAccel = Math.sqrt(
                (x || 0) ** 2 +
                (y || 0) ** 2 +
                (z || 0) ** 2
            );

            // Threshold for "picking up" or moving the device
            // 1.5 m/s^2 is a reasonable threshold for deliberate movement
            // while filtering out minor jitter
            if (totalAccel > 1.5) {
                stopTimer();
            }
        };

        // Request permission for iOS 13+ if needed (though usually needs user interaction)
        // For now we just add the listener and hope for the best or that it's already granted/not needed
        window.addEventListener('devicemotion', handleMotion);

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [isTimerRunning, stopTimer]);

    const isRoundEnd = currentPhase === 'ROUND_END';

    // Sort players alphabetically for display
    const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex flex-col h-dvh bg-background p-4 relative overflow-y-auto overflow-x-hidden">

            {!isRoundEnd && (<>
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6" role="banner">
                    <div className="px-4 py-2 rounded-full bg-secondary border border-border">
                        <span className="text-sm font-bold uppercase tracking-wider text-secondary-foreground">
                            {totalRounds ? `Round ${currentRound} / ${totalRounds}` : `Round ${currentRound}`}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <ConfigModal />
                        <LeaderboardModal />
                    </div>
                </div>
                {/* Word Display */}
                <div className="flex-1 flex flex-col items-center justify-center mb-8">
                    <Card
                        className="w-full max-w-lg aspect-video flex items-center justify-center border-4 border-primary bg-card shadow-xl shadow-primary/10 cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={toggleTimer}
                    >
                        <div className="flex flex-col items-center gap-4 p-6 text-center w-full">
                            {showUpsideDown && (
                                <h1 className="text-5xl md:text-7xl font-black tracking-tight break-words text-primary w-full leading-tight drop-shadow-sm rotate-180 select-none pointer-events-none">
                                    {currentWord}
                                </h1>
                            )}
                            <h1 className="text-5xl md:text-7xl font-black tracking-tight break-words text-primary w-full leading-tight drop-shadow-sm">
                                {currentWord}
                            </h1>
                            <div className="px-3 py-1 rounded bg-primary/10 text-xs font-bold uppercase tracking-[0.2em] text-primary border border-primary/20 min-w-[120px] flex items-center justify-center gap-2">
                                {isTimerRunning ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                {isTimerRunning ? (
                                    <span className="font-mono text-lg">
                                        {(localElapsed / 1000).toFixed(2)}s
                                    </span>
                                ) : (
                                    <span className="font-mono text-lg">
                                        {((elapsedTime || 0) / 1000).toFixed(2)}s
                                    </span>
                                )}
                            </div>
                        </div>
                    </Card>

                    <button
                        onClick={skipWord}
                        className="mt-4 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Change Word
                    </button>
                </div>
                {/* Players Grid */}
                <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" role="grid" aria-label="Player Buttons">
                    {sortedPlayers.map((player) => (
                        <Button
                            key={player.id}
                            variant="outline"
                            className="h-24 md:h-32 flex flex-col items-top justify-center gap-2 border-2 border-border hover:border-primary hover:bg-accent active:bg-primary/10 active:border-primary transition-all"
                            onClick={() => buzzPlayer(player.id)}
                            disabled={currentPhase !== 'ACTIVE'}
                            aria-label={`Buzz ${player.name}, current score ${player.score}`}
                        >
                            <span className="truncate w-full text-center text-lg md:text-xl font-bold text-foreground">
                                {player.name}
                            </span>
                            <div
                                className={cn(
                                    "px-3 py-1 rounded-full border text-xs font-bold",
                                    player.score > 0 && "bg-green-500/10 border-green-500/20 text-green-500",
                                    player.score < 0 && "bg-red-500/10 border-red-500/20 text-red-500",
                                    player.score === 0 && "bg-secondary border-border text-secondary-foreground"
                                )}
                                hidden={player.score === 0}
                            >
                                {player.score} pt
                            </div>
                        </Button>
                    ))}
                </div></>
            )}

            {isRoundEnd && (
                <div className="mx-auto w-full max-w-xl h-full min-h-[600px]" role="dialog" aria-modal="true" aria-label="Round Over">
                    <Card className="w-full h-full p-6 space-y-6 border-2 border-border bg-zinc-900 flex flex-col items-stretch justify-stretch">
                        <div className="text-center space-y-2">
                            <Image className="mx-auto" src="/sing-hit-logo.png" alt="Sing(h)it logo" width={456 / 3} height={382 / 3} />
                            <h2 className="text-3xl font-bold text-foreground">Round Over</h2>
                            <p className="text-muted-foreground font-medium">Current Standings</p>
                        </div>

                        <div className="flex-1 space-y-3 max-h-[100%] overflow-y-auto pr-2" role="list">
                            {[...players].sort((a, b) => {
                                if (b.score !== a.score) return b.score - a.score;
                                return a.totalTime - b.totalTime;
                            }).map((p, i) => (
                                <div
                                    key={p.id}
                                    className={cn(
                                        "flex justify-between items-center p-3 rounded-lg border",
                                        p.score > 0 && "bg-green-500/10 border-green-500/20 text-green-500",
                                        p.score < 0 && "bg-red-500/10 border-red-500/20 text-red-500",
                                        p.score === 0 && "bg-secondary border-border"
                                    )}
                                    role="listitem"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border aspect-square",
                                            i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                                        )}>
                                            {i + 1}
                                        </span>
                                        <span className="font-bold text-lg text-foreground">{p.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-xl">{p.score}</span>
                                        <span className="text-xs font-mono opacity-70">{(p.totalTime / 1000).toFixed(2)}s</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="w-full h-14 text-lg font-bold border-2 border-primary" onClick={nextRound}>
                            Next Word
                        </Button>
                    </Card>
                </div>
            )}

            <VerifyModal />
        </div>
    );
}
