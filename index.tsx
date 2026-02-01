import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';

const AppState = {
    INITIAL: 'INITIAL',
    PERSUADING: 'PERSUADING'
};

const HeartBackground = () => {
    const elements = useMemo(() => {
        const hearts = Array.from({ length: 18 }).map((_, i) => ({
            id: `h-${i}`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * (45 - 20) + 20}px`,
            duration: `${Math.random() * (12 - 7) + 7}s`,
            delay: `${Math.random() * 10}s`,
        }));
        const sparkles = Array.from({ length: 15 }).map((_, i) => ({
            id: `s-${i}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * (12 - 6) + 6}px`,
            delay: `${Math.random() * 5}s`,
        }));
        return { hearts, sparkles };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {elements.hearts.map((h) => (
                <div
                    key={h.id}
                    className="heart-float text-pink-300"
                    style={{
                        left: h.left,
                        fontSize: h.size,
                        animationDuration: h.duration,
                        animationDelay: h.delay,
                    }}
                >
                    ❤️
                </div>
            ))}
            {elements.sparkles.map((s) => (
                <div
                    key={s.id}
                    className="absolute shimmer text-yellow-300"
                    style={{
                        left: s.left,
                        top: s.top,
                        fontSize: s.size,
                        animationDelay: s.delay,
                    }}
                >
                    ✨
                </div>
            ))}
        </div>
    );
};

const App = () => {
    const [state, setState] = useState(AppState.INITIAL);
    const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
    const [isNoHovered, setIsNoHovered] = useState(false);
    const [cutenessLevel, setCutenessLevel] = useState(70);
    const [hasAcceptedOnce, setHasAcceptedOnce] = useState(false);
    
    const handleYes = () => {
        setState(AppState.INITIAL);
        setHasAcceptedOnce(true);
        setCutenessLevel(100);
        
        const duration = 6 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ 
                ...defaults, 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#fb7185', '#f43f5e', '#ec4899']
            });
            confetti({ 
                ...defaults, 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#fb7185', '#f43f5e', '#ec4899']
            });
        }, 250);
    };

    const handleNo = () => {
        if (hasAcceptedOnce) return;
        setState(AppState.PERSUADING);
        setCutenessLevel(20);
    };

    const handleNoHover = () => {
        if (state !== AppState.INITIAL || hasAcceptedOnce) return;
        setIsNoHovered(true);
        const randomX = (Math.random() - 0.5) * 250;
        const randomY = (Math.random() - 0.5) * 150;
        setNoButtonStyle({
            transform: `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 20 - 10}deg)`,
        });
        setCutenessLevel((prev) => Math.max(30, prev - 3));
    };

    const getAvatar = () => {
        if (state === AppState.PERSUADING) return '😢';
        if (hasAcceptedOnce) return '🥰';
        if (isNoHovered) return '😲';
        if (cutenessLevel < 50) return '🥺';
        return '🧸';
    };

    // Helper for image fallback
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
        const target = e.currentTarget;
        if (target.src.toLowerCase().endsWith('.jpeg')) {
            target.src = target.src.slice(0, -5) + '.jpg';
        } else {
            target.onerror = null;
            target.src = `https://placehold.co/400x600/fff1f2/e11d48?text=Beautiful+Smriti+${index}`;
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 py-12 relative overflow-hidden">
            <HeartBackground />

            <div className={`
                relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[3.5rem] 
                shadow-[0_25px_60px_rgba(255,150,170,0.4)] border border-white/70 animate-float transition-all duration-700 my-8
                ${state === AppState.PERSUADING ? 'scale-105 border-rose-200' : 'scale-100'}
            `}>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1.5 px-1">
                        <span>{hasAcceptedOnce ? "Eternal Love" : "Love Power"}</span>
                        <span>{hasAcceptedOnce ? "∞" : `${cutenessLevel}%`}</span>
                    </div>
                    <div className="h-2.5 w-full bg-rose-100/50 rounded-full overflow-hidden border border-rose-200/50">
                        <div 
                            className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 transition-all duration-1000 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                            style={{ width: `${hasAcceptedOnce ? 100 : cutenessLevel}%` }}
                        />
                    </div>
                </div>

                <div className="text-center space-y-6 mt-6">
                    {!hasAcceptedOnce && (
                        <div className="text-8xl mb-4 transition-all duration-500 transform hover:scale-125 cursor-default drop-shadow-2xl inline-block">
                            {getAvatar()}
                        </div>
                    )}

                    {state === AppState.INITIAL && !hasAcceptedOnce && (
                        <div className="transition-all duration-500 transform animate-in fade-in zoom-in slide-in-from-bottom-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-rose-600 leading-tight mb-3">
                                Will you be my Valentine, <span className="text-pink-500 drop-shadow-sm">Smriti</span>? 💖
                            </h1>
                            <p className="text-rose-400/90 text-lg font-medium italic">
                                {isNoHovered ? "Wait! You can't escape my love! 😲" : "I've been thinking of asking you for a while... ✨"}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 min-h-[160px] relative">
                                <button
                                    onClick={handleYes}
                                    className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full text-2xl shadow-xl shadow-emerald-200/50 transform active:scale-90 hover:-translate-y-1.5 transition-all hover:shadow-2xl hover:from-emerald-500 hover:to-teal-600"
                                >
                                    YES! 💘
                                </button>
                                <button
                                    onMouseEnter={handleNoHover}
                                    onMouseLeave={() => setIsNoHovered(false)}
                                    onClick={handleNo}
                                    style={noButtonStyle}
                                    className="w-full sm:w-auto px-10 py-5 bg-rose-400 text-white font-bold rounded-full text-xl shadow-xl shadow-rose-200/50 active:scale-95 no-button-transition hover:bg-rose-500"
                                >
                                    NO 💔
                                </button>
                            </div>
                        </div>
                    )}

                    {hasAcceptedOnce && (
                        <div className="animate-in fade-in zoom-in slide-in-from-bottom-10 space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-rose-600 drop-shadow-sm">Yay! I Love You, Smriti! ❤️</h1>
                            <p className="text-pink-500 text-xl font-medium italic animate-pulse">You just made me the happiest teddy bear alive! 💍💘</p>

                            <div className="grid grid-cols-2 gap-3 mt-6 p-2">
                                {/* Photo 1 Container */}
                                <div className="bg-white p-2 pb-6 shadow-xl border border-rose-100 transform transition-transform hover:scale-110 hover:z-20 -rotate-3">
                                    <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-sm">
                                        <img 
                                            src="./Photo1.jpg" 
                                            alt="Smriti 1" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => handleImageError(e, 1)}
                                        />
                                    </div>
                                    <div className="pt-2 text-[10px] text-rose-300 font-bold uppercase tracking-tighter italic text-center">Valentine ✨</div>
                                </div>

                                {/* Photo 2 Container */}
                                <div className="bg-white p-2 pb-6 shadow-xl border border-rose-100 transform transition-transform hover:scale-110 hover:z-20 rotate-2">
                                    <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-sm">
                                        <img 
                                            src="./Photo2.jpg" 
                                            alt="Smriti 2" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => handleImageError(e, 2)}
                                        />
                                    </div>
                                    <div className="pt-2 text-[10px] text-rose-300 font-bold uppercase tracking-tighter italic text-center">Beautiful ✨</div>
                                </div>

                                {/* Photo 3 Container */}
                                <div className="bg-white p-2 pb-6 shadow-xl border border-rose-100 transform transition-transform hover:scale-110 hover:z-20 rotate-3">
                                    <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-sm">
                                        <img 
                                            src="./Photo3.jpg" 
                                            alt="Smriti 3" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => handleImageError(e, 3)}
                                        />
                                    </div>
                                    <div className="pt-2 text-[10px] text-rose-300 font-bold uppercase tracking-tighter italic text-center">Perfect ✨</div>
                                </div>

                                {/* Photo 4 Container */}
                                <div className="bg-white p-2 pb-6 shadow-xl border border-rose-100 transform transition-transform hover:scale-110 hover:z-20 -rotate-2">
                                    <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-sm">
                                        <img 
                                            src="./Photo4.jpg" 
                                            alt="Smriti 4" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => handleImageError(e, 4)}
                                        />
                                    </div>
                                    <div className="pt-2 text-[10px] text-rose-300 font-bold uppercase tracking-tighter italic text-center">My Love ✨</div>
                                </div>
                            </div>

                            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 mt-4 shadow-inner">
                                <p className="text-rose-600 text-lg italic leading-relaxed">
                                    "You're the most incredible person I know. Every moment with you is like a dream come true. I love you to the moon and back!"
                                </p>
                            </div>
                            <div className="flex justify-center gap-3 text-4xl pt-4">
                                <span className="animate-bounce">🌹</span>
                                <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🧸</span>
                                <span className="animate-bounce" style={{animationDelay: '0.4s'}}>💍</span>
                                <span className="animate-bounce" style={{animationDelay: '0.6s'}}>✨</span>
                            </div>
                        </div>
                    )}

                    {state === AppState.PERSUADING && !hasAcceptedOnce && (
                        <div className="space-y-6 animate-in fade-in zoom-in slide-in-from-bottom-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-rose-600 px-4 leading-tight">
                                Wait... I don't allow you to say no, <span className="text-pink-500">Smriti</span>! 🧸
                            </h2>
                            <p className="text-rose-500 text-xl font-medium italic animate-pulse">I removed the No button for your own safety! 😤💕</p>
                            <div className="pt-8 px-4">
                                <button 
                                    onClick={handleYes} 
                                    className="w-full py-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full text-3xl shadow-2xl animate-pulse hover:scale-105 active:scale-95 transition-transform"
                                >
                                    YES 💘
                                </button>
                            </div>
                            <p className="text-rose-400 text-sm font-medium">Clicking yes is currently the only valid option. 😉</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-rose-400/40 font-bold pointer-events-none text-[10px] tracking-[0.2em] px-4 uppercase text-center w-full">
                Smriti's Secret Valentine • Made with ❤️
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
