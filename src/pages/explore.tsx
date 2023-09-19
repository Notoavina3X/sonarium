import SearchBar from "@/components/core/form/search-bar";
import Navbar from "@/layouts/core/navbar";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link as NextUILink,
} from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";

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
        <Trends />
      </section>
    </div>
  );
}

const Trends = () => {
  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardHeader className="text-xl font-black">Trends for you</CardHeader>
      <CardBody className="p-3">
        <ul className="flex flex-col gap-3 text-sm font-bold">
          <li>
            <Link href={"/explore?q=test"}>#Feel_good</Link>
          </li>
          <li>
            <Link href={"/explore?q=test"}>#sad</Link>
          </li>
          <li>
            <Link href={"/explore?q=test"}>#lonely</Link>
          </li>
        </ul>
      </CardBody>
      <CardFooter>
        <NextUILink href="/#" size="sm">
          Show more
        </NextUILink>
      </CardFooter>
    </Card>
  );
};
