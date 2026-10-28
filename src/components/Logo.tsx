type LogoProps = {
  onClick: () => void;
  className?: string;
};

export const LogoIcon = ({
  size = 36,
  className = '',
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-200 ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="pb-logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#6b21a8" />
      </linearGradient>
      <filter
        id="pb-shadow"
        x="-10%"
        y="-10%"
        width="120%"
        height="130%"
        filterUnits="userSpaceOnUse"
      >
        <feDropShadow
          dx="0"
          dy="1.5"
          stdDeviation="1.5"
          floodColor="#4a044e"
          floodOpacity="0.25"
        />
      </filter>
    </defs>
    {/* Rounded squircle background */}
    <rect
      width="32"
      height="32"
      rx="8.5"
      fill="url(#pb-logo-bg)"
      filter="url(#pb-shadow)"
    />
    {/* Notebook Cover */}
    <rect x="7.5" y="6" width="17" height="20" rx="3" fill="#ffffff" />
    {/* Spine Strip */}
    <path
      d="M7.5 9 C7.5 7.34 8.84 6 10.5 6 H12.5 V26 H10.5 C8.84 26 7.5 24.66 7.5 23 Z"
      fill="#e9d5ff"
    />
    {/* Elastic Strap */}
    <rect x="20.5" y="6" width="2" height="20" rx="0.5" fill="#c084fc" />
    {/* Bookmark Ribbon hanging at bottom */}
    <path d="M14.5 22 V28.5 L16.5 27 L18.5 28.5 V22 Z" fill="#facc15" />
    {/* Decorative phrase lines */}
    <rect x="14.5" y="10" width="4.5" height="1.5" rx="0.75" fill="#9333ea" />
    <rect x="14.5" y="13.5" width="4.5" height="1.5" rx="0.75" fill="#c084fc" />
  </svg>
);

const Logo = ({ onClick, className = '' }: LogoProps) => (
  <a
    className={`group flex items-center font-bold tracking-tight gap-2.5 mb-7 max-[1150px]:text-xl max-[760px]:mb-3 max-[760px]:text-xl text-text transition-colors select-none ${className}`}
    href="#"
    aria-label="Phrasebook — Dashboard"
    onClick={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    <div className="relative group-hover:scale-105 active:scale-95 transition-transform duration-200">
      <LogoIcon size={36} />
    </div>
    <span className="font-extrabold tracking-tight text-text text-xl sm:text-2xl font-sans group-hover:text-forest transition-colors">
      phrasebook
      <span className="-ml-px text-forest group-hover:text-forest-hover transition-colors">
        .
      </span>
    </span>
  </a>
);

export default Logo;
