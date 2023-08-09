import { Button } from "@nextui-org/react";
import { Pattern8 } from "../patterns";

function Join() {
  return (
    <section
      id="join"
      className="relative z-0 flex flex-col items-center gap-10 p-8 pb-20 md:p-10 md:pb-28 lg:p-20"
      data-scroll
      data-scroll-speed=".2"
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
      <p className="text-center">© 2023 Sonarium. All rights reserved.</p>
    </section>
  );
}

export default Join;
