import { useEffect, useRef } from 'react';

interface LakeBackgroundProps {
  opacity?: number;
  className?: string;
}

export function LakeBackground({ opacity = 1, className = '' }: LakeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let animationFrame: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      lastTime = currentTime;

      // Subtle parallax/zoom effect
      const parallax = Math.sin(currentTime / 5000) * 0.5;
      const zoom = 1 + Math.sin(currentTime / 8000) * 0.01;

      if (video) {
        video.style.transform = `scale(${zoom}) translateY(${parallax}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const videoSrc = import.meta.env.DEV 
    ? '/ozero.mp4' 
    : `${import.meta.env.BASE_URL}ozero.mp4`;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out"
        style={{
          filter: 'saturate(1.1) contrast(1.05) brightness(0.98)',
          opacity,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Caustics shimmer overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(173,216,230,0.25) 0%, transparent 60%)
          `,
          backgroundSize: '200% 200%',
          animation: 'caustics 8s ease-in-out infinite',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Mist layer */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(255,255,255,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at bottom, rgba(200,230,255,0.3) 0%, transparent 50%)
          `,
          animation: 'shimmer 12s ease-in-out infinite reverse',
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,20,30,0.15) 100%)',
        }}
      />

      {/* Shimmer animation overlay */}
      <div className="shimmer-overlay"></div>
    </div>
  );
}

