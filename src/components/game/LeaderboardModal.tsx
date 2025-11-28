'use client';

import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function LeaderboardModal() {
    const players = useGameStore((state) => state.players);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-border hover:bg-accent" aria-label="Open Leaderboard">
                    <Trophy className="w-6 h-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-border bg-zinc-900 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
                        <Trophy className="w-6 h-6 text-primary" aria-hidden="true" /> Leaderboard
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-2" role="list">
                    {players
                        .sort((a, b) => {
                            if (b.score !== a.score) return b.score - a.score;
                            return a.totalTime - b.totalTime;
                        })
                        .map((player, index) => (
                            <div
                                key={player.id}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border",
                                    player.score > 0 && "bg-green-500/10 border-green-500/20 text-green-500",
                                    player.score < 0 && "bg-red-500/10 border-red-500/20 text-red-500",
                                    player.score === 0 && "bg-secondary border-border"
                                )}
                                role="listitem"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm border aspect-square",
                                        index === 0 ? 'bg-primary text-primary-foreground border-primary' :
                                            'bg-muted text-muted-foreground border-border'
                                    )}>
                                        {index + 1}
                                    </span>
                                    <span className="font-bold text-lg text-foreground">{player.name}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-bold">{player.score}</span>
                                    <span className="text-xs font-mono opacity-70">{(player.totalTime / 1000).toFixed(2)}s</span>
                                </div>
                            </div>
                        ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
