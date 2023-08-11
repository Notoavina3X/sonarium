import { useRef, useEffect, useState } from "react";
import Navbar from "@/layouts/static/Navbar";
import { Icon } from "@iconify/react";

function Hero() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [offsetHeight, setOffsetHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (headerRef) {
      setOffsetHeight(() => {
        const headerHeight = headerRef.current?.offsetHeight;
        if (headerHeight) return headerHeight + 2;
      });
    }
  }, []);

  return (
    <>
      <Navbar ref={headerRef} />
      <section
        id="hero"
        className="wrapper relative mt-[2px] overflow-hidden rounded-2xl bg-black dark:bg-primary"
        style={{ height: `calc(100vh - ${offsetHeight}px)` }}
      >
        <div
          id="asterisk"
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-[100vh] text-content4/20"
        >
          {/* <span>&#10059;</span> */}
          <Icon icon="solar:soundwave-outline" />
        </div>
        <div className="relative z-20 grid h-full w-screen place-items-center whitespace-nowrap font-delaGothic text-[calc(100vw/9)] text-primary dark:text-stone-950">
          <span data-scroll data-scroll-speed="0.2">
            SONARIUM
          </span>
        </div>
      </section>
    </>
  );
}

export default Hero;
