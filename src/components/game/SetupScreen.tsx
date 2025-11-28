'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Play, Mic2, Users, Settings2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { italianWords, englishWords } from '@/data/words';

export function SetupScreen() {
    const {
        players,
        addPlayer,
        removePlayer,
        setTotalRounds,
        setLanguage,
        startGame,
        totalRounds,
        language
    } = useGameStore();
    const [newPlayerName, setNewPlayerName] = useState('');
    const [isInfinite, setIsInfinite] = useState(totalRounds === null);
    const [error, setError] = useState<string | null>(null);

    const handleAddPlayer = () => {
        const trimmedName = newPlayerName.trim();
        if (trimmedName) {
            if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
                setError('Player already exists');
                return;
            }
            addPlayer(trimmedName);
            setNewPlayerName('');
            setError(null);
        }
    };

    const handleInfiniteChange = (checked: boolean) => {
        setIsInfinite(checked);
        setTotalRounds(checked ? null : 10);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh p-4 bg-background">
            <Card className="w-full max-w-md border-2 border-border bg-card shadow-sm">
                <CardHeader className="text-center pb-6 border-b border-border/50">
                    <Image src="/sing-hit-logo-name.png" alt="Sing(h)it logo" width={456} height={382} />
                    <CardDescription className="text-foreground font-bold text-2xl">
                        The H is silent. U are not.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">
                    {/* Players Section */}
                    <div className="space-y-4" role="region" aria-label="Player Management">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                            <Users className="w-4 h-4" aria-hidden="true" />
                            <h3>Players {players.length > 0 && <span className="text-muted-foreground">({players.length})</span>}</h3>
                        </div>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Player name..."
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                                className="h-12 text-lg border-2 border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label="New player name"
                            />
                            <Button
                                onClick={handleAddPlayer}
                                size="icon"
                                className="h-12 w-12 shrink-0 border-2 border-primary"
                                aria-label="Add player"
                            >
                                <Plus className="w-6 h-6" />
                            </Button>
                        </div>
                        {error && (
                            <p className="text-destructive text-sm font-bold animate-in fade-in slide-in-from-top-1">
                                {error}
                            </p>
                        )}

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1" role="list">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border" role="listitem">
                                    <span className="font-medium text-lg text-secondary-foreground">{player.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive"
                                        onClick={() => removePlayer(player.id)}
                                        aria-label={`Remove ${player.name}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                            {players.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg bg-muted/10">
                                    <p className="text-muted-foreground font-medium">Add at least 2 players</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-4 pt-4 border-t-2 border-border" role="region" aria-label="Game Settings">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                            <Settings2 className="w-4 h-4" aria-hidden="true" />
                            <h3>Settings</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border bg-card hover:bg-accent/50 transition-colors">
                                <label htmlFor="infinite-switch" className="text-base font-bold cursor-pointer flex-1">Infinite Rounds</label>
                                <Switch
                                    id="infinite-switch"
                                    checked={isInfinite}
                                    onCheckedChange={handleInfiniteChange}
                                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-700 border-2 border-zinc-600"
                                />
                            </div>

                            <div className={cn("space-y-2 transition-opacity duration-200", isInfinite ? "opacity-50" : "opacity-100")}>
                                <label htmlFor="rounds-input" className="text-sm font-bold text-foreground">Number of Rounds</label>
                                <Input
                                    id="rounds-input"
                                    type="number"
                                    min={1}
                                    value={totalRounds || ''}
                                    onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                                    className="h-12 text-lg border-2 border-input disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={isInfinite}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground block">Language</label>
                                <div className="grid grid-cols-3 gap-3" role="group" aria-label="Language Selection">
                                    {(['IT', 'EN', 'MIX'] as const).map((lang) => {
                                        const count = lang === 'IT' ? italianWords.length :
                                            lang === 'EN' ? englishWords.length :
                                                italianWords.length + englishWords.length;

                                        return (
                                            <Button
                                                key={lang}
                                                variant="outline"
                                                onClick={() => setLanguage(lang)}
                                                className={cn(
                                                    "h-14 font-bold border-2 transition-colors flex flex-col items-center justify-center gap-0.5",
                                                    language === lang
                                                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90 hover:text-primary-foreground/90"
                                                        : "bg-transparent border-input hover:bg-accent"
                                                )}
                                                aria-pressed={language === lang}
                                            >
                                                <span className="text-lg leading-none">{lang}</span>
                                                <span className={cn(
                                                    "text-[10px] font-medium opacity-80",
                                                    language === lang ? "text-primary-foreground/80" : "text-muted-foreground"
                                                )}>
                                                    {count} words
                                                </span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 text-lg font-bold border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                        onClick={startGame}
                        disabled={players.length < 2}
                    >
                        <Play className="w-5 h-5 mr-2 fill-current" aria-hidden="true" /> Start Game
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
