import React, { useState, useEffect, useRef } from 'react';
import { AppState } from './types';
import HeartBackground from './components/HeartBackground';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INITIAL);
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const [isNoHovered, setIsNoHovered] = useState(false);
  const [cutenessLevel, setCutenessLevel] = useState(70);
  const [hasAcceptedOnce, setHasAcceptedOnce] = useState(false);
  
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const handleYes = () => {
    setState(AppState.INITIAL);
    setHasAcceptedOnce(true);
    setCutenessLevel(100);
    triggerConfetti();
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
    
    setCutenessLevel(prev => Math.max(30, prev - 2));
  };

  const resetNoButton = () => {
    setIsNoHovered(false);
  };

  const triggerConfetti = () => {
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

  const getAvatar = () => {
    if (state === AppState.PERSUADING) return '😢';
    if (hasAcceptedOnce) return '💖';
    if (isNoHovered) return '😲';
    if (cutenessLevel < 50) return '🥺';
    return '🧸';
  };

  // We'll look for Photo.jpeg as primary and numbered ones as backups
  const collagePhotos = [
    "Photo.jpeg",
    "Photo1.jpeg",
    "Photo2.jpeg",
    "Photo3.jpeg"
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-50 to-indigo-100 flex flex-col items-center justify-start md:justify-center p-4 py-12 relative overflow-x-hidden font-fredoka">
      <HeartBackground />

      <div className={`
        relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[3.5rem] 
        shadow-[0_25px_60px_rgba(255,150,170,0.4)] border border-white/70 animate-float transition-all duration-700 my-8
        ${state === AppState.PERSUADING ? 'scale-105 border-rose-200' : 'scale-100'}
      `}>
        {/* Love Meter */}
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
            <div className="transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-4">
              <h1 className="text-3xl md:text-4xl font-bold text-rose-600 leading-tight mb-3">
                Will you be my Valentine, <span className="text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.3)]">Smriti</span>? 💖
              </h1>
              <p className="text-rose-400/90 text-lg font-medium italic tracking-wide">
                {isNoHovered 
                  ? "Wait! You can't escape my love! 😲" 
                  : "You're the marshmallows to my hot cocoa! ☕☁️"}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 min-h-[140px]">
                <button
                  onClick={handleYes}
                  className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-full text-2xl shadow-xl shadow-emerald-200/50 transform transition-all active:scale-90 hover:-translate-y-1.5 flex items-center justify-center gap-2 group"
                >
                  <span className="group-hover:animate-bounce">YES! 💘</span>
                </button>
                
                <button
                  ref={noButtonRef}
                  onMouseEnter={handleNoHover}
                  onMouseLeave={resetNoButton}
                  onClick={handleNo}
                  style={noButtonStyle}
                  className={`
                    w-full sm:w-auto px-10 py-5 bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-full text-xl shadow-xl shadow-rose-200/50 
                    transform transition-all active:scale-95 flex items-center justify-center gap-2
                    ${isNoHovered ? 'animate-shake' : ''}
                  `}
                >
                  NO 💔
                </button>
              </div>
            </div>
          )}

          {hasAcceptedOnce && (
            <div className="transition-all duration-1000 animate-in fade-in zoom-in slide-in-from-bottom-10 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-rose-600 drop-shadow-sm">
                  I Love You, Smriti! ❤️
                </h1>
                <p className="text-pink-500 text-xl font-medium italic animate-pulse">
                  I'm officially yours forever! 💍💘
                </p>
              </div>

              {/* Photo Collage Section */}
              <div className="grid grid-cols-2 gap-3 mt-6 relative p-2">
                {collagePhotos.map((photo, index) => (
                  <div 
                    key={index} 
                    className={`
                      relative bg-white p-2 pb-6 shadow-lg border border-rose-100 transform transition-transform hover:scale-105 hover:z-20
                      ${index === 0 ? '-rotate-3 -translate-y-2' : ''}
                      ${index === 1 ? 'rotate-2 translate-y-1' : ''}
                      ${index === 2 ? 'rotate-1 -translate-x-1' : ''}
                      ${index === 3 ? '-rotate-2 translate-x-2 translate-y-2' : ''}
                    `}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-sm">
                      <img 
                        src={photo} 
                        alt={`Smriti ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (!img.dataset.tried) {
                            img.dataset.tried = "true";
                            img.src = "Photo.jpeg"; // Fallback to basic Photo.jpeg if specific ones fail
                          } else {
                            img.src = `https://placehold.co/400x600/fff1f2/e11d48?text=Photo+${index+1}`;
                          }
                        }}
                      />
                    </div>
                    <div className="absolute bottom-1 left-0 w-full text-center text-[10px] text-rose-300 font-bold uppercase tracking-tighter">
                      My Beautiful Valentine ✨
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 mt-4">
                <p className="text-rose-600 text-lg font-medium leading-relaxed italic">
                  "You're the most beautiful person I've ever seen. Every time I look at these photos, I fall in love all over again! I can't wait to spend forever with you."
                </p>
              </div>

              <div className="flex justify-center gap-2 text-3xl animate-bounce pt-4">
                <span>🌹</span><span>🧸</span><span>💍</span><span>✨</span>
              </div>
            </div>
          )}

          {state === AppState.PERSUADING && !hasAcceptedOnce && (
            <div className="space-y-6 min-h-[300px] flex flex-col justify-center transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8">
              <h2 className="text-2xl md:text-3xl font-bold text-rose-600 leading-relaxed px-2">
                No, I don't allow you to say no, <span className="text-pink-500 underline decoration-pink-300 underline-offset-4">Smriti</span>... You should be my Valentine!
              </h2>
              
              <p className="text-rose-500 text-xl font-medium italic animate-pulse">
                No other option left! 😤💕
              </p>

              <p className="text-rose-400 text-lg font-medium">
                You're far too pretty to be this mean to a teddy bear... 😉
              </p>
              
              <div className="pt-8">
                <button
                  onClick={handleYes}
                  className="w-full px-12 py-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full text-3xl shadow-2xl shadow-emerald-200/60 transform transition-all active:scale-90 animate-pulse hover:scale-105"
                >
                  YES 💘
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-rose-400/40 font-bold pointer-events-none text-[10px] tracking-[0.2em] px-4 uppercase text-center w-full">
        Infinite Love Engine Activated • 2026 Valentine Edition
      </div>
    </div>
  );
};

export default App;