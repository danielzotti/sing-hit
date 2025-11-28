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
import { Settings, RotateCcw, Trash2, Flag, ArrowDownUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Image from 'next/image';

export function ConfigModal() {
    const { resetGame, restartGameWithSamePlayers, endGameEarly, showUpsideDown, toggleShowUpsideDown } = useGameStore();
    const [open, setOpen] = useState(false);

    const handleReset = () => {
        resetGame();
        setOpen(false);
    };

    const handleRestart = () => {
        restartGameWithSamePlayers();
        setOpen(false);
    };

    const handleEndGame = () => {
        endGameEarly();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-border hover:bg-accent" aria-label="Open Settings">
                    <Settings className="w-6 h-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-border bg-zinc-900 shadow-2xl">
                <DialogHeader>
                    <Image className="mx-auto" src="/sing-hit-logo.png" alt="Sing(h)it logo" width={456 / 3} height={382 / 3} />
                    <DialogTitle className="text-2xl text-center font-bold text-foreground">Game Options</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                        <Switch
                            id="upside-down-mode"
                            checked={showUpsideDown}
                            onCheckedChange={toggleShowUpsideDown}
                        />
                        <div className="flex flex-col">
                            <Label htmlFor="upside-down-mode" className="font-bold text-foreground text-lg">Upside Down Mode</Label>
                            <span className="text-xs text-muted-foreground">Show word for opponent too</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleEndGame}
                        className="flex items-center justify-start gap-4 h-20 rounded-xl border-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary active:bg-primary/20 transition-colors"
                    >
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                            <Flag className="w-6 h-6 text-primary" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-bold text-lg text-primary">End Game</span>
                            <span className="text-xs text-muted-foreground font-medium">End now and see the winner</span>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleRestart}
                        className="flex items-center justify-start gap-4 h-20 rounded-xl border-2 border-border hover:bg-accent active:bg-accent transition-colors"
                    >
                        <div className="p-3 rounded-full bg-secondary border border-border">
                            <RotateCcw className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-bold text-lg text-foreground">Same Players</span>
                            <span className="text-xs text-muted-foreground font-medium">Restart keeping names</span>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        className="flex items-center justify-start gap-4 h-20 rounded-xl border-2 border-border hover:bg-accent active:bg-accent transition-colors"
                    >
                        <div className="p-3 rounded-full bg-secondary border border-border">
                            <Trash2 className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-bold text-lg text-foreground">New Game</span>
                            <span className="text-xs text-muted-foreground font-medium">Reset all and return home</span>
                        </div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
