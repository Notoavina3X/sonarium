import { Icon } from "@iconify/react";

function Topic() {
  return (
    <section
      id="topic"
      className="flex min-h-screen flex-col justify-center gap-10 p-8 md:p-10 lg:p-20"
      data-scroll
      data-scroll-speed=".2"
    >
      <div className="relative" data-scroll data-scroll-speed=".3">
        <h1 className="relative z-20 font-delaGothic text-5xl">
          Socialize with Music
        </h1>
        <div className="absolute -left-8 -top-6 z-10">
          <Icon
            icon="solar:global-line-duotone"
            className="scale-150 transform text-6xl text-content4 dark:text-primary"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="text-2xl" data-scroll data-scroll-speed=".5">
          Like, comment, and share posts with your fellow music enthusiasts, or
          follow users with similar tastes. Sonarium brings the classic features
          of a social network to the world of music!
        </div>
        <div
          className="text-2xl"
          data-scroll
          data-scroll-speed=".5"
          data-scroll-offset="170%,0%"
        >
          Explore trending topics, hashtags, and discover fresh beats from our
          ever-growing community. Sonarium connects you with music lovers from
          diverse backgrounds and preferences across the globe.
        </div>
      </div>
    </section>
  );
}

export default Topic;
