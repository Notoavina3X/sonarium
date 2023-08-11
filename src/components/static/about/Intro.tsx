import { Avatar } from "@nextui-org/react";
import { Pattern1 } from "@/components/static/patterns";

function Intro() {
  return (
    <section
      id="introduction"
      data-scroll
      data-scroll-speed=".2"
      className="wrapper"
    >
      <div className="grid gap-3 rounded-2xl bg-primary px-5 py-20 text-stone-950 dark:bg-white md:grid-cols-2 md:gap-0 md:px-10 md:py-24 lg:px-32">
        <div className="wrapper flex gap-3">
          <Avatar
            src="/image/who.webp"
            className="h-20 w-20"
            data-scroll
            data-scroll-speed=".1"
          />
          <div className="h-20 w-20" data-scroll data-scroll-speed=".15">
            <Pattern1 />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h1
            className="font-delaGothic text-5xl"
            data-scroll
            data-scroll-speed=".2"
            data-scroll-offset="20%, -20%"
          >
            Unleash
          </h1>
          <p
            className="text-xl leading-8"
            data-scroll
            data-scroll-speed=".3"
            data-scroll-offset="20%, -15%"
          >
            Sonarium is your digital playground to unite with fellow music
            enthusiasts, share and discuss your all-time favorite tunes, and
            express your current mood through music. With seamless integration
            of Spotify and YouTube, finding and sharing songs has never been
            easier!
          </p>
        </div>
      </div>
    </section>
  );
}

export default Intro;
