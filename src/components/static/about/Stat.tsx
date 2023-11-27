import { Pattern2, Pattern3, Pattern4 } from "@/components/static/patterns";

function Stat() {
  return (
    <section id="stat" data-scroll data-scroll-speed=".2">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 p-4 md:flex-row md:p-10 lg:p-24">
        <div
          className="relative z-0 flex flex-1 flex-col items-center gap-6 rounded-3xl bg-content2 px-3 py-9 dark:bg-content1"
          data-scroll
          data-scroll-speed="-.2"
        >
          <div className="h-20 w-20">
            <Pattern2 />
          </div>
          <h1 className="font-delaGothic text-5xl">100k+</h1>
          <span className="capitalize">Moods shared</span>
        </div>
        <div
          className="relative z-10 flex flex-1 flex-col items-center gap-6 rounded-3xl bg-content2 px-3 py-9 dark:bg-content1"
          data-scroll
          data-scroll-speed="0"
        >
          <div className="h-20 w-20">
            <Pattern3 />
          </div>
          <h1 className="font-delaGothic text-5xl">50k</h1>
          <span className="capitalize">Happy users</span>
        </div>
        <div
          className="relative z-20 flex flex-1 flex-col items-center gap-6 rounded-3xl bg-content2 px-3 py-9 dark:bg-content1"
          data-scroll
          data-scroll-speed=".2"
        >
          <div className="h-20 w-20">
            <Pattern4 />
          </div>
          <h1 className="font-delaGothic text-5xl">300</h1>
          <span className="capitalize">Genres explored</span>
        </div>
      </div>
    </section>
  );
}

export default Stat;
