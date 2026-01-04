import { useEffect, useRef } from 'react';

type RodId = 'stick' | 'reed' | 'bamboo' | 'telescopic' | 'spinning' | 'feeder' | 'boom' | null;

interface LakeCastOverlayProps {
  rodId: RodId;
  active: boolean;
  castKey: string | number;
  target?: { x: number; y: number };
}

type SkinMode = 'bobber' | 'lure' | 'feeder' | 'dynamite';

interface Skin {
  lineColor: string;
  bobberGradient: { from: string; to: string };
  rippleColor: string;
  mode: SkinMode;
}

const SKINS: Record<string, Skin> = {
  stick: {
    lineColor: '#6B7280',
    bobberGradient: { from: '#FCD34D', to: '#F59E0B' },
    rippleColor: 'rgba(252, 211, 77, 0.3)',
    mode: 'bobber',
  },
  reed: {
    lineColor: '#6B7280',
    bobberGradient: { from: '#FCD34D', to: '#F59E0B' },
    rippleColor: 'rgba(252, 211, 77, 0.3)',
    mode: 'bobber',
  },
  bamboo: {
    lineColor: '#6B7280',
    bobberGradient: { from: '#FCD34D', to: '#F59E0B' },
    rippleColor: 'rgba(252, 211, 77, 0.3)',
    mode: 'bobber',
  },
  telescopic: {
    lineColor: '#6B7280',
    bobberGradient: { from: '#FCD34D', to: '#F59E0B' },
    rippleColor: 'rgba(252, 211, 77, 0.3)',
    mode: 'bobber',
  },
  spinning: {
    lineColor: '#4B5563',
    bobberGradient: { from: '#60A5FA', to: '#3B82F6' },
    rippleColor: 'rgba(96, 165, 250, 0.3)',
    mode: 'lure',
  },
  feeder: {
    lineColor: '#6B7280',
    bobberGradient: { from: '#A78BFA', to: '#8B5CF6' },
    rippleColor: 'rgba(167, 139, 250, 0.3)',
    mode: 'feeder',
  },
  boom: {
    lineColor: '#7C2D12',
    bobberGradient: { from: '#F87171', to: '#DC2626' },
    rippleColor: 'rgba(248, 113, 113, 0.4)',
    mode: 'dynamite',
  },
};

export function LakeCastOverlay({ rodId, active, castKey, target = { x: 0.54, y: 0.56 } }: LakeCastOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (active && lineRef.current) {
      // Reset animation by removing and re-adding the class
      lineRef.current.classList.remove('cast-line');
      requestAnimationFrame(() => {
        if (lineRef.current) {
          lineRef.current.classList.add('cast-line');
        }
      });
    }
  }, [castKey, active]);

  if (!active || !rodId || !SKINS[rodId]) {
    return null;
  }

  const skin = SKINS[rodId];
  const targetX = target.x * 100;
  const targetY = target.y * 100;

  // Control point for quadratic curve (creates a natural arc)
  const controlX = 50;
  const controlY = (target.y * 100 + 100) / 2;

  // Line path: from bottom center (50%, 100%) to target point
  const linePath = `M 50 100 Q ${controlX} ${controlY} ${targetX} ${targetY}`;

  return (
    <svg
      ref={svgRef}
      className="lake-cast-overlay"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <linearGradient id={`bobber-gradient-${rodId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skin.bobberGradient.from} />
          <stop offset="100%" stopColor={skin.bobberGradient.to} />
        </linearGradient>
      </defs>

      {/* Fishing line */}
      <path
        ref={lineRef}
        d={linePath}
        fill="none"
        stroke={skin.lineColor}
        strokeWidth="0.3"
        strokeLinecap="round"
        className="cast-line"
      />

      {/* Ripples */}
      <g transform={`translate(${targetX}, ${targetY})`}>
        <circle
          className="ripple ripple-1"
          cx="0"
          cy="0"
          r="9"
          fill="none"
          stroke={skin.rippleColor}
          strokeWidth="0.4"
        />
        <circle
          className="ripple ripple-2"
          cx="0"
          cy="0"
          r="9"
          fill="none"
          stroke={skin.rippleColor}
          strokeWidth="0.4"
        />
        <circle
          className="ripple ripple-3"
          cx="0"
          cy="0"
          r="9"
          fill="none"
          stroke={skin.rippleColor}
          strokeWidth="0.4"
        />
      </g>

      {/* Bobber/Lure/Feeder/Dynamite */}
      <g
        transform={`translate(${targetX}, ${targetY})`}
        className="bobber-container"
      >
        {skin.mode === 'bobber' && (
          <g>
            {/* Bobber body */}
            <ellipse
              cx="0"
              cy="0"
              rx="1.2"
              ry="2"
              fill={`url(#bobber-gradient-${rodId})`}
              stroke="#F59E0B"
              strokeWidth="0.15"
            />
            {/* Bobber tip */}
            <circle cx="0" cy="-1.5" r="0.4" fill="#FCD34D" />
          </g>
        )}
        {skin.mode === 'lure' && (
          <g>
            {/* Lure body */}
            <ellipse
              cx="0"
              cy="0"
              rx="1.5"
              ry="0.8"
              fill={`url(#bobber-gradient-${rodId})`}
              stroke="#3B82F6"
              strokeWidth="0.15"
            />
            {/* Lure hook */}
            <path
              d="M 0.8 0.4 L 1.2 0.8 L 0.8 1.2"
              fill="none"
              stroke="#1E40AF"
              strokeWidth="0.2"
              strokeLinecap="round"
            />
          </g>
        )}
        {skin.mode === 'feeder' && (
          <g>
            {/* Feeder basket */}
            <rect
              x="-1.5"
              y="-1"
              width="3"
              height="2"
              rx="0.3"
              fill={`url(#bobber-gradient-${rodId})`}
              stroke="#8B5CF6"
              strokeWidth="0.15"
            />
            {/* Feeder holes */}
            <circle cx="-0.8" cy="0" r="0.2" fill="#A78BFA" opacity="0.6" />
            <circle cx="0" cy="0" r="0.2" fill="#A78BFA" opacity="0.6" />
            <circle cx="0.8" cy="0" r="0.2" fill="#A78BFA" opacity="0.6" />
          </g>
        )}
        {skin.mode === 'dynamite' && (
          <g>
            {/* Dynamite stick */}
            <rect
              x="-0.8"
              y="-2"
              width="1.6"
              height="4"
              rx="0.2"
              fill={`url(#bobber-gradient-${rodId})`}
              stroke="#DC2626"
              strokeWidth="0.15"
            />
            {/* Fuse */}
            <line
              x1="0"
              y1="-2"
              x2="0"
              y2="-2.8"
              stroke="#FCD34D"
              strokeWidth="0.2"
              strokeLinecap="round"
            />
            {/* Spark */}
            <circle cx="0" cy="-3" r="0.3" fill="#FCD34D" className="spark" />
          </g>
        )}
      </g>
    </svg>
  );
}

