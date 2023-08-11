const Pattern2 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(0, 0, 0)" />
          <stop offset="100%" stopColor="rgb(230, 61, 0)" />
        </linearGradient>
        <clipPath id="clipPath-2">
          <path d="M 477.4 195.3 l -27.9 -27.9 v -39.5 c 0 -42.5 -34.8 -77.4 -77.4 -77.4 h -39.5 l -27.9 -27.9 c -30.1 -30.1 -79.3 -30.1 -109.4 0 l -27.9 27.9 h -39.5 c -42.5 0 -77.4 34.8 -77.4 77.4 v 39.5 l -27.9 27.9 c -30.1 30.1 -30.1 79.3 0 109.4 l 27.9 27.9 v 39.5 c 0 42.6 34.8 77.4 77.4 77.4 h 39.5 l 27.9 27.9 c 30.1 30.1 79.3 30.1 109.4 0 l 27.9 -27.9 h 39.5 c 42.5 0 77.4 -34.8 77.4 -77.4 v -39.5 l 27.9 -27.9 c 30.1 -30.1 30.1 -79.3 0 -109.4 Z" />
        </clipPath>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#gradient-2)"
        clipPath="url(#clipPath-2)"
      />
    </svg>
  );
};

export default Pattern2;
