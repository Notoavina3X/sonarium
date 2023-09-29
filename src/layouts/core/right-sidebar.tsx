import SearchBar from "@/components/core/form/search-bar";
import AccountCard from "@/components/core/ui/account-card";
import TopTrends from "@/components/core/ui/top-trends";
import { api } from "@/utils/api";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link as NextUILink,
} from "@nextui-org/react";
import { useRouter } from "next/router";

function RightSidebar() {
  const router = useRouter();
  return (
    <div className="sticky top-2 hidden min-w-[350px] flex-col gap-2 lg:flex">
      {!router.pathname.startsWith("/explore") && (
        <>
          <SearchBar />
          <TopTrends />
        </>
      )}
      <Suggestions />
    </div>
  );
}

const Suggestions = () => {
  const { data: suggestions } = api.profile.getSuggestions.useQuery();

  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardHeader className="text-xl font-black">Suggestions</CardHeader>
      <CardBody className="p-3">
        <ul className="flex flex-col gap-5">
          {suggestions?.map((user) => (
            <li key={user.id}>
              <AccountCard user={user} />
            </li>
          ))}
        </ul>
      </CardBody>
      <CardFooter>
        {suggestions && suggestions.length > 5 && (
          <NextUILink href="/#" size="sm">
            Show more
          </NextUILink>
        )}
      </CardFooter>
    </Card>
  );
};

export default RightSidebar;
