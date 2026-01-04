interface VideoBackgroundProps {
  opacity?: number;
  className?: string;
}

export function VideoBackground({ opacity = 1, className = '' }: VideoBackgroundProps) {
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: 'scale(1.02)',
          filter: 'saturate(1.04) contrast(1.02)',
          opacity,
        }}
      >
        <source src={import.meta.env.DEV ? '/ozero.mp4' : `${import.meta.env.BASE_URL}ozero.mp4`} type="video/mp4" />
      </video>
      <div className="shimmer-overlay"></div>
    </div>
  );
}

