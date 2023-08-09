function Hero() {
  return (
    <section
      id="hero"
      className="wrapper relative h-screen overflow-hidden rounded-2xl bg-black dark:bg-primary"
    >
      <div
        id="asterisk"
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-[110vh] text-content4/20"
      >
        <span>&#10059;</span>
      </div>
      <div className="relative z-20 grid h-full w-screen place-items-center whitespace-nowrap font-delaGothic text-[calc(100vw/9)] text-primary dark:text-stone-950">
        <span data-scroll data-scroll-speed="0.2">
          SONARIUM
        </span>
      </div>
    </section>
  );
}

export default Hero;
