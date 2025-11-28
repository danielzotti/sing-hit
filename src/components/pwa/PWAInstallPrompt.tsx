'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstall, setShowInstall] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        // Install Prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Update Prompt
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) {
                    setRegistration(reg);
                    if (reg.waiting) {
                        setShowUpdate(true);
                    }

                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    setShowUpdate(true);
                                }
                            });
                        }
                    });
                }
            });
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstall(false);
        }
    };

    const handleUpdate = () => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    };

    if (!showInstall && !showUpdate) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2">
            {showInstall && (
                <div className="bg-secondary text-secondary-foreground p-4 rounded-lg shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-5 fade-in duration-300 border-primary border">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary-foreground/20 p-2 rounded-full">
                            <Download className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Install App</span>
                            <span className="text-xs opacity-90">Install for offline play</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="default" size="sm" onClick={handleInstall} className="h-8 text-xs font-bold">
                            Install
                        </Button>
                        <button onClick={() => setShowInstall(false)} className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {showUpdate && (
                <div className="bg-secondary text-secondary-foreground p-4 rounded-lg shadow-lg flex items-center justify-between border border-border animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary-foreground/10 p-2 rounded-full">
                            <RefreshCw className="w-5 h-5 animate-spin-slow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Update Available</span>
                            <span className="text-xs opacity-90">New version ready</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="default" size="sm" onClick={handleUpdate} className="h-8 text-xs font-bold">
                            Update
                        </Button>
                        <button onClick={() => setShowUpdate(false)} className="p-1 hover:bg-secondary-foreground/10 rounded-full transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
