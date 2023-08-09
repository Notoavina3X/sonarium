import { Card, CardHeader } from "@nextui-org/react";
import { Pattern5, Pattern6, Pattern7 } from "../patterns";

function Visual() {
  return (
    <section
      id="visual"
      className="relative z-20 flex flex-col gap-10 overflow-hidden bg-background p-8 md:p-10 lg:p-20"
      data-scroll
      data-scroll-speed=".7"
    >
      <h1 className="font-delaGothic text-5xl">Visualize the Beat</h1>
      <div
        className="grid grid-cols-2 gap-5 md:grid-cols-3"
        data-scroll
        data-scroll-speed=".2"
        data-scroll-offset="30%,0%"
      >
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
  );
}

export default Visual;
