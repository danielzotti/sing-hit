'use client';

import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Check, X, Undo2, Mic2 } from 'lucide-react';
import Image from 'next/image';

export function VerifyModal() {
    const { currentPhase, currentSingerId, players, verifyAnswer, cancelVerify } = useGameStore();

    const isOpen = currentPhase === 'VERIFY';
    const singer = players.find((p) => p.id === currentSingerId);

    if (!isOpen || !singer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && cancelVerify()}>
            <DialogContent className="sm:max-w-md border-2 border-border bg-zinc-900 shadow-2xl">
                <DialogHeader className="space-y-4 overflow-x-hidden">
                    <Image className="mx-auto" src="/sing-hit-logo.png" alt="Sing(h)it logo" width={456 / 3} height={382 / 3} />
                    <DialogDescription className="text-center text-lg text-muted-foreground font-medium flex-wrap flex items-end justify-center gap-2 overflow-x-hidden">
                        Singing <span className="font-black text-foreground text-2xl break-words overflow-x-hidden">{singer.name}</span>
                    </DialogDescription>
                    <DialogTitle className="text-center text-2xl font-bold text-foreground">
                        Did they get it right?
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button
                        variant="outline"
                        className="h-32 flex flex-col gap-3 border-2 border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive active:bg-destructive/20 active:border-destructive active:text-destructive transition-colors"
                        onClick={() => verifyAnswer(false)}
                        aria-label="Wrong Answer"
                    >
                        <X className="w-12 h-12" aria-hidden="true" />
                        <span className="text-xl font-bold uppercase">No</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-32 flex flex-col gap-3 border-2 border-border hover:bg-green-500/10 hover:border-green-500 hover:text-green-500 active:bg-green-500/20 active:border-green-500 active:text-green-500 transition-colors"
                        onClick={() => verifyAnswer(true)}
                        aria-label="Correct Answer"
                    >
                        <Check className="w-12 h-12" aria-hidden="true" />
                        <span className="text-xl font-bold uppercase">Yes</span>
                    </Button>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button variant="ghost" onClick={cancelVerify} className="w-full h-12 font-medium text-muted-foreground hover:text-foreground">
                        <Undo2 className="w-5 h-5 mr-2" aria-hidden="true" /> Cancel (Mistake)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
