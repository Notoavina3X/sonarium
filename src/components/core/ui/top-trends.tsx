import { exploreQueryAtom, exploreTabAtom, toQueryAtom } from "@/store";
import { api } from "@/utils/api";
import {
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  CardFooter,
  Link as NextUILink,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { useScopedI18n } from "locales";
import { useRouter } from "next/router";
import { toast } from "sonner";

function TopTrends() {
  const scopedT = useScopedI18n("sidebar.right");
  const router = useRouter();

  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);
  const [exploreTab, setExploreTab] = useAtom(exploreTabAtom);
  const [toQuery, setToQuery] = useAtom(toQueryAtom);

  const top = api.tag.getTop.useQuery({ limit: 5 });

  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardHeader className="text-xl font-black">
        {scopedT("popular")}
      </CardHeader>
      <CardBody className="p-3">
        {top.isLoading ? (
          <ul className="flex flex-col gap-3 text-sm font-bold">
            <Skeleton className="h-5 w-1/3 rounded-md" />
            <Skeleton className="h-5 w-1/2 rounded-md" />
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-5 w-1/3 rounded-md" />
            <Skeleton className="h-5 w-1/2 rounded-md" />
          </ul>
        ) : (
          <ul className="flex flex-col gap-3 text-sm font-bold">
            {top.data?.tags.map((tag) => (
              <li
                key={tag.id}
                onClick={() => {
                  setExploreQuery(tag.name);
                  setExploreTab("posts");
                  setToQuery(tag.name);
                  if (router.pathname !== "/explore")
                    router.push("/explore").catch((err) => {
                      console.error(err);
                      toast.error("Error while redirecting");
                    });
                }}
                className="cursor-pointer"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </CardBody>
      <CardFooter>
        {top.data?.tags?.length && top.data.tags.length > 5 && (
          <NextUILink href="/#" size="sm">
            {scopedT("more")}
          </NextUILink>
        )}
      </CardFooter>
    </Card>
  );
}

export default TopTrends;
