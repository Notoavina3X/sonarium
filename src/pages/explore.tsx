import SearchBar from "@/components/core/form/search-bar";
import TopTrends from "@/components/core/ui/top-trends";
import Navbar from "@/layouts/core/navbar";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import Head from "next/head";

export default function Explore() {
  return (
    <div className="min-h-screen grow">
      <Head>
        <title>Explore | Sonarium</title>
      </Head>
      <Navbar>
        <div className="grid w-full grid-cols-[auto_48px] items-center gap-2">
          <SearchBar />
          <Button
            isIconOnly
            size="lg"
            variant="light"
            className="text-2xl"
            aria-label="+ options"
          >
            <Icon icon="solar:settings-minimalistic-linear" />
          </Button>
        </div>
      </Navbar>
      <section className="flex flex-col gap-2">
        <TopTrends />
      </section>
    </div>
  );
}
