import {
  Pattern1,
  Pattern2,
  Pattern3,
  Pattern4,
  Pattern5,
  Pattern6,
  Pattern7,
  Pattern8,
} from "@/components/patterns";
import { Icon } from "@iconify/react";
import { Avatar, Button, Card, CardHeader, Image } from "@nextui-org/react";

const About = () => {
  return (
    <div className="layout">
      {/* Header section is waiting: Explore, Contact, Join */}
      <section
        id="hero"
        className="relative h-screen overflow-hidden rounded-2xl bg-black dark:bg-primary"
      >
        <div
          id="asterisk"
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-[110vh] text-content4/20"
        >
          <span>&#10059;</span>
        </div>
        <div className="relative z-20 grid h-full w-screen place-items-center whitespace-nowrap font-delaGothic text-[calc(100vw/9)] text-primary dark:text-stone-950">
          <span>SONARIUM</span>
        </div>
      </section>
      <section id="introduction">
        <div className="grid gap-3 rounded-2xl bg-primary px-5 py-20 text-stone-950 dark:bg-white md:grid-cols-2 md:gap-0 md:px-10 md:py-24 lg:px-32">
          <div className="flex gap-3">
            <Avatar src="/image/who.webp" className="h-20 w-20" />
            <div className="h-20 w-20">
              <Pattern1 />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-delaGothic text-5xl">Unleash</h1>
            <p className="text-xl leading-8">
              Sonarium is your digital playground to unite with fellow music
              enthusiasts, share and discuss your all-time favorite tunes, and
              express your current mood through music. With seamless integration
              of Spotify and YouTube, finding and sharing songs has never been
              easier!
            </p>
          </div>
        </div>
      </section>
      <section id="stat">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 p-4 md:flex-row md:p-10 lg:p-24">
          <div className="flex flex-1 flex-col items-center gap-6 rounded-3xl bg-content2 px-3 py-9 dark:bg-content1">
            <div className="h-20 w-20">
              <Pattern2 />
            </div>
            <h1 className="font-delaGothic text-5xl">100k+</h1>
            <span className="capitalize">Moods shared</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-6 rounded-3xl bg-content2 px-3 py-9 dark:bg-content1">
            <div className="h-20 w-20">
              <Pattern3 />
            </div>
            <h1 className="font-delaGothic text-5xl">50k</h1>
            <span className="capitalize">Happy users</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-6 rounded-3xl bg-content2 px-3 py-9 dark:bg-content1">
            <div className="h-20 w-20">
              <Pattern4 />
            </div>
            <h1 className="font-delaGothic text-5xl">300</h1>
            <span className="capitalize">Genres explored</span>
          </div>
        </div>
      </section>
      <section id="layer" className="relative overflow-hidden rounded-2xl">
        <div className="relative top-0 z-20 translate-y-1 transform bg-gradient-to-r from-[#C2BCAC] via-[#D1CCC0] to-[#CFCCC4] p-8 md:absolute md:transform-none md:from-transparent md:to-transparent md:p-10 lg:p-20">
          <p className="text-justify text-base font-bold text-slate-600 md:text-3xl lg:text-5xl">
            “Sonarium is the most amazing thing to happen to music lovers since
            headphones. It&apos;s changed the way I share and discover new
            tunes!”
          </p>
        </div>
        <Image
          src="/image/ketut-subiyanto.webp"
          className="relative z-10 rounded-none"
          alt="layer"
        />
      </section>
      <section
        id="topic"
        className="flex min-h-screen flex-col justify-center gap-10 p-8 md:p-10 lg:p-20"
      >
        <div className="relative">
          <h1 className="relative z-20 font-delaGothic text-5xl">
            Socialize with Music
          </h1>
          <div className="absolute -left-8 -top-6 z-10">
            <Icon
              icon="solar:play-circle-bold"
              className="scale-150 transform text-6xl text-content4 dark:text-primary"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="text-2xl">
            Like, comment, and share posts with your fellow music enthusiasts,
            or follow users with similar tastes. Sonarium brings the classic
            features of a social network to the world of music!
          </div>
          <div className="text-2xl">
            Explore trending topics, hashtags, and discover fresh beats from our
            ever-growing community. Sonarium connects you with music lovers from
            diverse backgrounds and preferences across the globe.
          </div>
        </div>
      </section>
      <section
        id="visual"
        className="flex flex-col gap-10 overflow-hidden p-8 md:p-10 lg:p-20"
      >
        <h1 className="font-delaGothic text-5xl">Visualize the Beat</h1>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          <Card className="order-1 aspect-square border-none bg-[url('/image/vibing-6.webp')] bg-cover bg-center grayscale hover:grayscale-0">
            <CardHeader className="absolute z-10 flex h-full items-center justify-center">
              <div className="w-1/2">
                <Pattern5 fill="fill-content3 dark:fill-content1" />
              </div>
            </CardHeader>
          </Card>
          <Card className="order-2 aspect-square border-none bg-[url('/image/vibing-4.webp')] bg-cover bg-center grayscale hover:grayscale-0"></Card>
          <Card className="order-4 aspect-square border-none bg-[url('/image/vibing-1.webp')] bg-cover bg-center grayscale hover:grayscale-0 md:order-3">
            <CardHeader className="absolute z-10 flex h-full items-center justify-center">
              <div className="w-1/2">
                <Pattern7 fill="fill-content3 dark:fill-content1" />
              </div>
            </CardHeader>
          </Card>
          <Card className="order-3 aspect-square border-none bg-[url('/image/vibing-2.webp')] bg-cover bg-center grayscale hover:grayscale-0 md:order-4"></Card>
          <Card className="order-5 aspect-square border-none bg-[url('/image/vibing-3.webp')] bg-cover bg-center grayscale hover:grayscale-0">
            <CardHeader className="absolute z-10 flex h-full items-center justify-center">
              <div className="w-1/2">
                <Pattern6 fill="fill-content3 dark:fill-content1" />
              </div>
            </CardHeader>
          </Card>
          <Card className="order-last aspect-square border-none bg-[url('/image/phone-spotify.webp')] bg-cover bg-center grayscale hover:grayscale-0"></Card>
        </div>
      </section>
      <section
        id="join"
        className="flex flex-col items-center gap-10 p-8 md:p-10 lg:p-20"
      >
        <div className="h-16 w-16">
          <Pattern8 />
        </div>
        <h1 className="text-center font-delaGothic text-5xl">Join Now</h1>
        <p className="max-w-md text-center text-xl">
          Ready to dive into a world of musical connections? Don&apos;t just
          listen—experience the heartbeat of songs and moods. Sign up today and
          elevate your vibe!
        </p>
        <div className="flex justify-center gap-4">
          <Button color="primary" variant="solid" size="lg">
            Sign Up
          </Button>
          <Button color="primary" variant="flat" size="lg">
            Learn More
          </Button>
        </div>
        <p className="mt-10 text-center">
          © 2023 Sonarium. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default About;
