export function FloatBobber() {
  return (
    <>
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[140px] z-[2] pointer-events-none opacity-90">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full border-2 border-aqua/55 animate-ripple"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full border-2 border-aqua/55 animate-ripple" style={{ animationDelay: '0.55s' }}></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full border-2 border-aqua/55 animate-ripple" style={{ animationDelay: '1.1s' }}></div>
      </div>
      <svg
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] z-[3] pointer-events-none animate-bob drop-shadow-[0_12px_18px_rgba(0,0,0,.18)]"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bobberGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3b3b" />
            <stop offset="1" stopColor="#ff8f2f" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="34"
          r="18"
          fill="url(#bobberGradient)"
          stroke="rgba(255,255,255,.85)"
          strokeWidth="3"
        />
        <rect x="27" y="6" width="10" height="14" rx="5" fill="rgba(255,255,255,.9)" />
        <circle cx="32" cy="34" r="6" fill="rgba(255,255,255,.18)" />
      </svg>
    </>
  );
}

