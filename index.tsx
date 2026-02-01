import React, { useState, useMemo, useRef } from 'https://esm.sh/react@19';
import { createRoot } from 'https://esm.sh/react-dom@19/client';
import confetti from 'https://esm.sh/canvas-confetti';

// App State constants
const AppState = {
    INITIAL: 'INITIAL',
    PERSUADING: 'PERSUADING'
};

const HeartBackground = () => {
    const elements = useMemo(() => {
        const hearts = Array.from({ length: 15 }).map((_, i) => ({
            id: `h-${i}`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * (40 - 15) + 15}px`,
            duration: `${Math.random() * (15 - 8) + 8}s`,
            delay: `${Math.random() * 10}s`,
        }));
        const sparkles = Array.from({ length: 12 }).map((_, i) => ({
            id: `s-${i}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * (10 - 5) + 5}px`,
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
    const [noButtonStyle, setNoButtonStyle] = useState({});
    const [isNoHovered, setIsNoHovered] = useState(false);
    const [cutenessLevel, setCutenessLevel] = useState(70);
    const [hasAcceptedOnce, setHasAcceptedOnce] = useState(false);
    
    const handleYes = () => {
        setState(AppState.INITIAL);
        setHasAcceptedOnce(true);
        setCutenessLevel(100);
        
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
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
        const randomX = (Math.random() - 0.5) * 200;
        const randomY = (Math.random() - 0.5) * 100;
        setNoButtonStyle({
            transform: `translate(${randomX}px, ${randomY}px) scale(0.8)`,
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
        setCutenessLevel((prev) => Math.max(30, prev - 2));
    };

    const getAvatar = () => {
        if (state === AppState.PERSUADING) return '😢';
        if (hasAcceptedOnce) return '💖';
        if (isNoHovered) return '😲';
        if (cutenessLevel < 50) return '🥺';
        return '🧸';
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 py-12 relative overflow-hidden bg-mesh">
            <HeartBackground />

            <div className={`
                relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[3.5rem] 
                shadow-[0_25px_60px_rgba(255,150,170,0.4)] border border-white/70 animate-float transition-all duration-700 my-8
                ${state === AppState.PERSUADING ? 'scale-105 border-rose-200' : 'scale-100'}
            `}>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1.5 px-1">
                        <span>{hasAcceptedOnce ? "Infinite Love" : "Love Level"}</span>
                        <span>{hasAcceptedOnce ? "∞" : `${cutenessLevel}%`}</span>
                    </div>
                    <div className="h-2.5 w-full bg-rose-100/50 rounded-full overflow-hidden border border-rose-200/50">
                        <div 
                            className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 transition-all duration-1000"
                            style={{ width: `${hasAcceptedOnce ? 100 : cutenessLevel}%` }}
                        />
                    </div>
                </div>

                <div className="text-center space-y-6 mt-6">
                    {!hasAcceptedOnce && (
                        <div className="text-8xl mb-4 transition-all duration-500 transform hover:scale-110 cursor-default drop-shadow-xl inline-block">
                            {getAvatar()}
                        </div>
                    )}

                    {state === AppState.INITIAL && !hasAcceptedOnce && (
                        <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 transition-all">
                            <h1 className="text-3xl md:text-4xl font-bold text-rose-600 leading-tight mb-3">
                                Will you be my Valentine, <span className="text-pink-500">Smriti</span>? 💖
                            </h1>
                            <p className="text-rose-400/90 text-lg font-medium italic">
                                {isNoHovered ? "Wait! You can't escape my love! 😲" : "You're the marshmallows to my hot cocoa! ☕☁️"}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 min-h-[140px]">
                                <button
                                    onClick={handleYes}
                                    className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full text-2xl shadow-xl transform active:scale-90 hover:-translate-y-1.5 transition-all"
                                >
                                    YES! 💘
                                </button>
                                <button
                                    onMouseEnter={handleNoHover}
                                    onMouseLeave={() => setIsNoHovered(false)}
                                    onClick={handleNo}
                                    style={noButtonStyle}
                                    className="w-full sm:w-auto px-10 py-5 bg-rose-400 text-white font-bold rounded-full text-xl shadow-xl active:scale-95 transition-all"
                                >
                                    NO 💔
                                </button>
                            </div>
                        </div>
                    )}

                    {hasAcceptedOnce && (
                        <div className="animate-in fade-in zoom-in slide-in-from-bottom-10 space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-rose-600">I Love You, Smriti! ❤️</h1>
                            <p className="text-pink-500 text-xl font-medium italic animate-pulse">I'm officially yours forever! 💍💘</p>

                            <div className="grid grid-cols-2 gap-3 mt-6 p-2">
                                {[0,1,2,3].map((i) => (
                                    <div key={i} className={`bg-white p-2 pb-6 shadow-lg border border-rose-100 transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-2'}`}>
                                        <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-sm">
                                            <img 
                                                src="Photo.jpeg" 
                                                alt="Smriti" 
                                                className="w-full h-full object-cover"
                                                onError={(e: any) => e.target.src = `https://placehold.co/400x600/fff1f2/e11d48?text=Smriti+${i+1}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 mt-4">
                                <p className="text-rose-600 text-lg italic">"You're the most beautiful person I've ever seen. I'm so lucky to have you!"</p>
                            </div>
                            <div className="flex justify-center gap-2 text-3xl animate-bounce pt-4">
                                <span>🌹</span><span>🧸</span><span>💍</span><span>✨</span>
                            </div>
                        </div>
                    )}

                    {state === AppState.PERSUADING && !hasAcceptedOnce && (
                        <div className="space-y-6 animate-in fade-in zoom-in slide-in-from-bottom-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-rose-600">
                                No, I don't allow you to say no, <span className="text-pink-500">Smriti</span>...
                            </h2>
                            <p className="text-rose-500 text-xl font-medium italic animate-pulse">No other option left! 😤💕</p>
                            <div className="pt-8">
                                <button onClick={handleYes} className="w-full px-12 py-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full text-3xl shadow-2xl animate-pulse">
                                    YES 💘
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}