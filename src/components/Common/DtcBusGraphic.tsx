import React from 'react';

interface DtcBusGraphicProps {
  routeNumber: string;
  variant?: 'orange' | 'green' | 'blue';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DtcBusGraphic: React.FC<DtcBusGraphicProps> = ({
  routeNumber,
  variant = 'orange',
  className = '',
  size = 'md'
}) => {
  // Color themes matching Delhi DTC fleet
  // Orange: Standard DTC / DIMTS Cluster CNG
  // Green: DTC Electric / Zero Emission fleet
  // Blue: DTC AC Low-Floor / Metro feeder
  const theme = {
    orange: {
      primary: '#EA580C',
      primaryDark: '#C2410C',
      primaryLight: '#FFEDD5',
      accent: '#F97316',
      border: '#9A3412',
      ledBg: '#18181B',
      ledText: '#FDE047'
    },
    green: {
      primary: '#059669',
      primaryDark: '#047857',
      primaryLight: '#D1FAE5',
      accent: '#10B981',
      border: '#065F46',
      ledBg: '#18181B',
      ledText: '#6EE7B7'
    },
    blue: {
      primary: '#0284C7',
      primaryDark: '#0369A1',
      primaryLight: '#E0F2FE',
      accent: '#38BDF8',
      border: '#075985',
      ledBg: '#18181B',
      ledText: '#BAE6FD'
    }
  }[variant];

  const sizeClasses = {
    sm: 'w-[100px] h-[34px]',
    md: 'w-[128px] h-[44px]',
    lg: 'w-[156px] h-[52px]'
  }[size];

  // Truncate display route number on small LED board if too long
  const displayNum = routeNumber.length > 7 ? routeNumber.slice(0, 7) : routeNumber;

  return (
    <div className={`relative inline-flex items-center shrink-0 ${sizeClasses} ${className}`}>
      <svg
        viewBox="0 0 160 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xs select-none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle metallic linear gradients */}
          <linearGradient id={`busBody-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.accent} />
            <stop offset="65%" stopColor={theme.primary} />
            <stop offset="100%" stopColor={theme.primaryDark} />
          </linearGradient>
          <linearGradient id="windowGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="wheelRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* 1. AC Pod / Roof Ventilation */}
        <path
          d="M 45 4 L 115 4 C 117 4 118 5 118 6 L 118 8 L 42 8 L 42 6 C 42 5 43 4 45 4 Z"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="0.8"
        />
        {/* AC vents */}
        <line x1="55" y1="6" x2="105" y2="6" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" />

        {/* 2. Main Bus Chassis / Body */}
        <path
          d="
            M 14 42
            L 22 42
            A 9 9 0 0 1 40 42
            L 118 42
            A 9 9 0 0 1 136 42
            L 152 42
            C 155 42 157 40 157 37
            L 157 14
            C 157 10 154 8 150 8
            L 18 8
            C 13 8 8 11 7 16
            L 5 30
            C 4 34 5 40 9 42
            Z
          "
          fill={`url(#busBody-${variant})`}
          stroke={theme.border}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* White Accent Beltline (Characteristic of Delhi Public Transport) */}
        <path
          d="M 5 28 L 157 28 L 157 32 L 6 32 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* 3. Electronic Destination LED Board (Front/Top) */}
        <rect
          x="12"
          y="10"
          width="42"
          height="8.5"
          rx="1.5"
          fill={theme.ledBg}
          stroke="#3F3F46"
          strokeWidth="0.6"
        />
        {/* Glow behind LED text */}
        <text
          x="33"
          y="16.5"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="900"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fill={theme.ledText}
          letterSpacing="0.4"
        >
          {displayNum}
        </text>

        {/* 4. Windows Glazing Strip */}
        {/* Front Windshield */}
        <path
          d="M 8 19 L 14 11 L 28 11 L 28 26 L 7 26 C 6.8 23 7.2 21 8 19 Z"
          fill="url(#windowGlass)"
          stroke="#0F172A"
          strokeWidth="0.7"
        />
        {/* Front Passenger Door Windows */}
        <rect x="31" y="11" width="11" height="15" rx="1" fill="url(#windowGlass)" stroke="#0F172A" strokeWidth="0.6" />
        <rect x="44" y="11" width="18" height="15" rx="1" fill="url(#windowGlass)" stroke="#0F172A" strokeWidth="0.6" />
        <rect x="64" y="11" width="18" height="15" rx="1" fill="url(#windowGlass)" stroke="#0F172A" strokeWidth="0.6" />
        {/* Middle Exit Door */}
        <rect x="84" y="11" width="11" height="15" rx="1" fill="url(#windowGlass)" stroke="#0F172A" strokeWidth="0.6" />
        <rect x="97" y="11" width="18" height="15" rx="1" fill="url(#windowGlass)" stroke="#0F172A" strokeWidth="0.6" />
        <rect x="117" y="11" width="18" height="15" rx="1" fill="url(#windowGlass)" stroke="#0F172A" strokeWidth="0.6" />
        {/* Rear Window */}
        <path
          d="M 137 11 L 153 11 C 154.5 11 155 12 155 13.5 L 155 26 L 137 26 Z"
          fill="url(#windowGlass)"
          stroke="#0F172A"
          strokeWidth="0.6"
        />

        {/* Window reflection gloss highlight */}
        <path
          d="M 10 13 L 26 13 L 20 24 L 8 24 Z"
          fill="#FFFFFF"
          opacity="0.12"
        />
        <path
          d="M 45 13 L 60 13 L 52 24 L 44 24 Z"
          fill="#FFFFFF"
          opacity="0.1"
        />

        {/* 5. Door outlines & Handles */}
        <line x1="36.5" y1="11" x2="36.5" y2="40" stroke="#CBD5E1" strokeWidth="0.6" />
        <line x1="89.5" y1="11" x2="89.5" y2="40" stroke="#CBD5E1" strokeWidth="0.6" />

        {/* 6. Front Headlight & Turn Indicator */}
        <rect x="4.5" y="33" width="3" height="4" rx="1" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.5" />
        <circle cx="5" cy="38.5" r="1.2" fill="#F97316" />

        {/* Rear Taillight */}
        <rect x="155.5" y="32" width="2" height="5" rx="0.8" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />

        {/* 7. Wheels & Mudguards */}
        {/* Front Wheel */}
        <g>
          {/* Wheel Arch */}
          <path d="M 21 42 A 10 10 0 0 1 41 42" stroke={theme.border} strokeWidth="1" fill="none" />
          {/* Tire */}
          <circle cx="31" cy="42" r="7.8" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          {/* Rim */}
          <circle cx="31" cy="42" r="4.8" fill="url(#wheelRim)" />
          {/* Hubcap center */}
          <circle cx="31" cy="42" r="2.2" fill="#475569" />
        </g>

        {/* Rear Wheel */}
        <g>
          {/* Wheel Arch */}
          <path d="M 117 42 A 10 10 0 0 1 137 42" stroke={theme.border} strokeWidth="1" fill="none" />
          {/* Tire */}
          <circle cx="127" cy="42" r="7.8" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          {/* Rim */}
          <circle cx="127" cy="42" r="4.8" fill="url(#wheelRim)" />
          {/* Hubcap center */}
          <circle cx="127" cy="42" r="2.2" fill="#475569" />
        </g>

        {/* Ground shadow */}
        <ellipse cx="80" cy="51" rx="72" ry="2" fill="#0F172A" opacity="0.12" />
      </svg>
    </div>
  );
};
