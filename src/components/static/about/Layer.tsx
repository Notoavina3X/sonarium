import { Image } from "@nextui-org/react";

function Layer() {
  return (
    <section
      id="layer"
      className="relative overflow-hidden rounded-2xl"
      data-scroll
      data-scroll-speed=".2"
    >
      <div className="relative top-0 z-20 translate-y-1 transform bg-gradient-to-r from-[#C2BCAC] via-[#D1CCC0] to-[#CFCCC4] p-8 md:absolute md:transform-none md:from-transparent md:to-transparent md:p-10 lg:p-20">
        <p className="text-justify text-base font-bold text-slate-600 md:text-3xl lg:text-5xl">
          “Sonarium is the most amazing thing to happen to music lovers since
          headphones. It&apos;s changed the way I share and discover new tunes!”
        </p>
      </div>
      <Image
        src="/image/ketut-subiyanto.webp"
        className="relative z-10 rounded-none"
        alt="layer"
      />
    </section>
  );
}

export default Layer;
