import { api } from "@/utils/api";
import {
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  CardFooter,
  Link as NextUILink,
} from "@nextui-org/react";
import Link from "next/link";

function TopTrends() {
  const top = api.tag.getTop.useQuery({ limit: 5 });

  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardHeader className="text-xl font-black">Popular trends</CardHeader>
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
              <li key={tag.id}>
                <Link href={`/explore/tag/${tag.name}`}>{tag.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
      <CardFooter>
        {top.data?.tags?.length && top.data.tags.length > 5 && (
          <NextUILink href="/#" size="sm">
            Show more
          </NextUILink>
        )}
      </CardFooter>
    </Card>
  );
}

export default TopTrends;
