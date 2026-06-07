import React from 'react';

interface WaveDividerProps {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
}

export function WaveDivider({
  topColor = '#F8FAF0',
  bottomColor = '#F1F4E0',
  flip = false,
}: WaveDividerProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: '90px',
        lineHeight: 0,
        backgroundColor: topColor,
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d="M0,46 C220,8 430,84 660,50 C880,18 1080,86 1280,52 C1360,38 1410,46 1440,42 L1440,90 L0,90 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}
