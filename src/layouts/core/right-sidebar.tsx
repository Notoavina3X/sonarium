import SearchBar from "@/components/core/form/search-bar";
import User from "@/components/core/ui/user";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link as NextUILink,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";

function RightSidebar() {
  const router = useRouter();
  return (
    <div className="sticky top-2 flex min-w-[350px] flex-col gap-2">
      {!router.pathname.startsWith("/explore") && (
        <>
          <SearchBar />
          <Trends />
        </>
      )}
      <Suggestions />
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
            <Link href={"/explore?q=test"}>#Feel_bad</Link>
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

const Suggestions = () => {
  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardHeader className="text-xl font-black">Suggestions</CardHeader>
      <CardBody className="p-3">
        <ul className="flex flex-col gap-5">
          <li className="flex items-center justify-between gap-2">
            <User
              id="fh35-4ngjd-dgjh"
              name="Notoavina Razafilalao"
              username="stone310"
              avatarProps={{
                name: "Notoavina Razafilalao",
              }}
            />
            <Button
              size="sm"
              variant={"flat"}
              color="primary"
              className="font-semibold"
            >
              {"Follow"}
            </Button>
          </li>
          <li className="flex items-center justify-between gap-2">
            <User
              id="fh35-4ngjd-dgjh"
              name="Johny Mark"
              username="whoami"
              avatarProps={{
                name: "Johny Mark",
              }}
            />
            <Button
              size="sm"
              variant={"light"}
              color="primary"
              className="font-semibold"
            >
              {"Unfollow"}
            </Button>
          </li>
          <li className="flex items-center justify-between gap-2">
            <User
              id="fh35-4ngjd-dgjh"
              name="Elon Musk"
              username="elon_musk"
              avatarProps={{
                name: "Elon Musk",
              }}
            />
            <Button
              size="sm"
              variant={"flat"}
              color="primary"
              className="font-semibold"
            >
              {"Follow"}
            </Button>
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

export default RightSidebar;
