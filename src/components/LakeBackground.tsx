interface LakeBackgroundProps {
  opacity?: number;
  className?: string;
}

export function LakeBackground({ opacity = 1, className = '' }: LakeBackgroundProps) {
  const videoSrc = import.meta.env.DEV 
    ? '/ozero.mp4' 
    : `${import.meta.env.BASE_URL}ozero.mp4`;

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

