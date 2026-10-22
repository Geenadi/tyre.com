import { useId } from 'react';

// Product render drawn in SVG so every tyre has an image without hosting photos:
// rubber sidewall with the brand moulded in, a split-spoke alloy, and a brake
// caliper in the brand colour. Tread depth follows the tyre's terrain.
const brandColors = {
  michelin: '#27509b', bridgestone: '#d6001c', continental: '#f5a800', pirelli: '#e2b007',
  goodyear: '#0d47a1', yokohama: '#c8102e', hankook: '#f37021', kumho: '#e60012',
  toyo: '#1d4f91', falken: '#0072ce', nexen: '#7a1fa2', bfgoodrich: '#cf102d',
};
const brandNames = {
  michelin: 'MICHELIN', bridgestone: 'BRIDGESTONE', continental: 'CONTINENTAL', pirelli: 'PIRELLI',
  goodyear: 'GOODYEAR', yokohama: 'YOKOHAMA', hankook: 'HANKOOK', kumho: 'KUMHO',
  toyo: 'TOYO TIRES', falken: 'FALKEN', nexen: 'NEXEN', bfgoodrich: 'BFGOODRICH',
};

export default function TyreImage({ brand, terrain = 'Highway', size = 180, label }) {
  const uid = useId().replace(/:/g, '');
  const id = (name) => `${name}-${uid}`;
  const accent = brandColors[brand] || '#f5b700';
  const lugs = terrain === 'Mud Terrain' ? 22 : terrain === 'All Terrain' ? 32 : 60;
  const lugW = terrain === 'Mud Terrain' ? 9 : terrain === 'All Terrain' ? 6 : 2.2;
  const lugH = terrain === 'Highway' ? 4 : 7;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={label || 'Tyre'} className="tyre-img">
      <defs>
        <radialGradient id={id('rubber')} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="#1b1f26" />
          <stop offset="88%" stopColor="#262b33" />
          <stop offset="100%" stopColor="#0e1116" />
        </radialGradient>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('alloy')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f5f7" />
          <stop offset="40%" stopColor="#b7bcc5" />
          <stop offset="60%" stopColor="#e9ebef" />
          <stop offset="100%" stopColor="#7b828e" />
        </linearGradient>
        <radialGradient id={id('barrel')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a404a" />
          <stop offset="100%" stopColor="#14171c" />
        </radialGradient>
        <path id={id('arcTop')} d="M 32 100 A 68 68 0 0 1 168 100" />
        <path id={id('arcBottom')} d="M 36 100 A 64 64 0 0 0 164 100" />
      </defs>

      {/* Tyre */}
      <circle cx="100" cy="100" r="97" fill={`url(#${id('rubber')})`} />
      {Array.from({ length: lugs }).map((_, i) => (
        <rect key={i} x={100 - lugW / 2} y="3" width={lugW} height={lugH} rx="1"
          fill="#07090c" transform={`rotate(${(360 / lugs) * i} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="89" fill="none" stroke="#2f343d" strokeWidth="0.8" />
      <text fontFamily="Inter, Arial, sans-serif" fontSize="9.5" fontWeight="800" letterSpacing="3" fill="#4b525d">
        <textPath href={`#${id('arcTop')}`} startOffset="50%" textAnchor="middle">{brandNames[brand] || 'TYRE'}</textPath>
      </text>
      <text fontFamily="Inter, Arial, sans-serif" fontSize="5.5" fontWeight="600" letterSpacing="2" fill="#3c424c">
        <textPath href={`#${id('arcBottom')}`} startOffset="50%" textAnchor="middle">RADIAL · TUBELESS</textPath>
      </text>

      {/* Wheel */}
      <circle cx="100" cy="100" r="61" fill={`url(#${id('alloy')})`} />
      <circle cx="100" cy="100" r="56" fill={`url(#${id('barrel')})`} />
      <circle cx="100" cy="100" r="40" fill="#5a616c" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#767d88" strokeWidth="3" strokeDasharray="1.5 3" />
      <path d="M 128 72 A 40 40 0 0 1 140 92 L 131 95 A 31 31 0 0 0 122 79 Z" fill={accent} />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`rotate(${72 * i + 18} 100 100)`}>
          <path d="M 96.5 88 L 92 45 Q 94.5 43.5 97 45 L 99.2 88 Z" fill={`url(#${id('alloy')})`} />
          <path d="M 100.8 88 L 103 45 Q 105.5 43.5 108 45 L 103.5 88 Z" fill={`url(#${id('alloy')})`} />
        </g>
      ))}
      <circle cx="100" cy="100" r="56" fill="none" stroke="#c9cdd4" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="15" fill={`url(#${id('alloy')})`} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx="100" cy="90" r="1.6" fill="#4b5563" transform={`rotate(${72 * i + 54} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="6.5" fill="#111827" />
      <circle cx="100" cy="100" r="4.5" fill={accent} />

      <circle cx="100" cy="100" r="97" fill={`url(#${id('sheen')})`} />
    </svg>
  );
}
