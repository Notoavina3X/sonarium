import SearchBar from "@/components/core/form/search-bar";
import AccountCard from "@/components/core/ui/account-card";
import SearchHistory from "@/components/core/ui/search-history";
import TopTrends from "@/components/core/ui/top-trends";
import { exploreQueryAtom, toQueryAtom } from "@/store";
import { api } from "@/utils/api";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link as NextUILink,
  cn,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { useI18n, useScopedI18n } from "locales";
import { useRouter } from "next/router";
import { useState, type KeyboardEvent } from "react";
import { toast } from "sonner";

function RightSidebar() {
  const t = useI18n();
  const router = useRouter();

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);
  const [toQuery, setToQuery] = useAtom(toQueryAtom);

  const trpcUtils = api.useContext();
  const history = api.history.create.useMutation({
    onSuccess: ({ newHistory }) => {
      if (newHistory) {
        trpcUtils.history.getHistory.setData({}, (oldData) => {
          if (oldData) {
            return [
              newHistory,
              ...oldData.filter(
                (oldHistory) => oldHistory.id !== newHistory.id
              ),
            ];
          }
        });
        setToQuery(newHistory.term);
        router.push("/explore").catch((err) => {
          console.error(err);
          toast.error("error.redirect");
        });
      }
    },
    onError: () => toast.error(t("error.search")),
  });

  const handleSearch = (term: string) => {
    setExploreQuery(term);
  };

  const handleOnFocus = () => {
    setIsSearching(true);
  };

  const handleOnBlur = () => {
    setIsSearching(false);
  };

  const handleOnClear = () => {
    setExploreQuery("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && exploreQuery.length) {
      history.mutate({ term: exploreQuery });
    }
  };

  return (
    <div className="sticky top-2 hidden min-w-[350px] flex-col gap-2 lg:flex">
      {!router.pathname.startsWith("/explore") && (
        <>
          <div className="group relative">
            <SearchBar
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              handleSearch={handleSearch}
              onClear={handleOnClear}
              onKeydown={handleKeyDown}
              duration={1}
            />
            <div
              className={cn(
                "absolute top-10 z-40 w-full pt-4",
                "group-hover:block",
                isSearching ? "block" : "hidden"
              )}
            >
              <SearchHistory />
            </div>
          </div>
          <TopTrends />
        </>
      )}
      <Suggestions />
    </div>
  );
}

const Suggestions = () => {
  const scopedT = useScopedI18n("sidebar.right");

  const { data: suggestions } = api.profile.getSuggestions.useQuery();

  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardHeader className="text-xl font-black">
        {scopedT("suggestion")}
      </CardHeader>
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
            {scopedT("more")}
          </NextUILink>
        )}
      </CardFooter>
    </Card>
  );
};

export default RightSidebar;
