import React from 'react';
import { MATERIAL_SPECS } from '../data/dataset';
import { MaterialFamily } from '../types/envelope';

interface MaterialMarkerProps {
  family: MaterialFamily;
  x: number;
  y: number;
  size?: number;
  isDark: boolean;
  selected?: boolean;
  dimmed?: boolean;
}

export function getMaterialColor(family: MaterialFamily, isDark: boolean): string {
  const spec = MATERIAL_SPECS[family];
  return isDark ? spec.colorDark : spec.colorLight;
}

export const MaterialMarker: React.FC<MaterialMarkerProps> = ({
  family,
  x,
  y,
  size = 6.5,
  isDark,
  selected = false,
  dimmed = false,
}) => {
  const spec = MATERIAL_SPECS[family];
  const color = getMaterialColor(family, isDark);
  const strokeColor = isDark ? '#0F1419' : '#FFFFFF';
  const opacity = dimmed ? 0.25 : 1;

  const renderShape = () => {
    switch (spec.shape) {
      case 'circle':
        return (
          <circle
            cx={x}
            cy={y}
            r={size}
            fill={color}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
        );
      case 'square':
        return (
          <rect
            x={x - size * 0.9}
            y={y - size * 0.9}
            width={size * 1.8}
            height={size * 1.8}
            fill={color}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
        );
      case 'diamond': {
        const d = size * 1.25;
        return (
          <polygon
            points={`${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`}
            fill={color}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
        );
      }
      case 'triangle': {
        const h = size * 1.2;
        const w = size * 1.25;
        return (
          <polygon
            points={`${x},${y - h} ${x + w},${y + h * 0.85} ${x - w},${y + h * 0.85}`}
            fill={color}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
        );
      }
      case 'ring':
      default:
        return (
          <circle
            cx={x}
            cy={y}
            r={size}
            fill={isDark ? '#161D24' : '#FFFFFF'}
            stroke={color}
            strokeWidth={2.5}
          />
        );
    }
  };

  return (
    <g style={{ opacity, transition: 'opacity 160ms ease' }}>
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={size + 6}
          fill="none"
          stroke={color}
          strokeWidth={1.75}
          strokeDasharray="3 2"
        />
      )}
      {renderShape()}
    </g>
  );
};

export const MaterialLegendSwatch: React.FC<{
  family: MaterialFamily;
  isDark: boolean;
}> = ({ family, isDark }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0" aria-hidden="true">
    <MaterialMarker family={family} x={8} y={8} size={4.8} isDark={isDark} />
  </svg>
);
