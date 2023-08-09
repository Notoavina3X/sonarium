const Pattern1 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(0, 0, 0)" />
          <stop offset="100%" stopColor="rgb(230, 61, 0)" />
        </linearGradient>
        <clipPath id="clip1">
          <path d="M 32 0 L 64 32 L 0 32 L 32 0" />
        </clipPath>
        <clipPath id="clip2">
          <path d="M 32 32 L 64 64 L 0 64 L 32 32" />
        </clipPath>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#gradient-1)"
        clipPath="url(#clip1)"
      />
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#gradient-1)"
        clipPath="url(#clip2)"
      />
    </svg>
  );
};

export default Pattern1;
