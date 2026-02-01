
import React, { useMemo } from 'react';

const HeartBackground: React.FC = () => {
  const elements = useMemo(() => {
    const hearts = Array.from({ length: 20 }).map((_, i) => ({
      id: `h-${i}`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * (40 - 15) + 15}px`,
      duration: `${Math.random() * (15 - 8) + 8}s`,
      delay: `${Math.random() * 10}s`,
      type: '❤️'
    }));
    const sparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: `s-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * (10 - 5) + 5}px`,
      duration: `${Math.random() * (3 - 1) + 1}s`,
      delay: `${Math.random() * 5}s`,
      type: '✨'
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
          {h.type}
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
          {s.type}
        </div>
      ))}
    </div>
  );
};

export default HeartBackground;
