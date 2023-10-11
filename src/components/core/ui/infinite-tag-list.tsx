import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@nextui-org/react";
import { exploreQueryAtom, exploreTabAtom, toQueryAtom } from "@/store";
import { useAtom } from "jotai";

type InfiniteTagListProps = {
  tags?: { id: string; name: string }[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTags: () => Promise<unknown>;
};

function InfiniteTagList({
  tags,
  isLoading,
  isError,
  hasMore = false,
  fetchNewTags,
}: InfiniteTagListProps) {
  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);
  const [exploreTab, setExploreTab] = useAtom(exploreTabAtom);
  const [toQuery, setToQuery] = useAtom(toQueryAtom);

  if (isLoading)
    return (
      <div className="flex w-full flex-col justify-center">
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-1/2 rounded-md" />
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-1/2 rounded-md" />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (tags == null || tags.length === 0)
    return <h1 className="text xl text-center">No Tags</h1>;

  return (
    <InfiniteScroll
      dataLength={tags.length}
      hasMore={hasMore}
      next={fetchNewTags}
      loader={
        <div className="flex w-full flex-col justify-center">
          <Skeleton className="h-5 w-1/3 rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-5 w-1/3 rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
      }
    >
      {tags.map((tag) => (
        <p
          key={tag.id}
          className="my-1 cursor-pointer text-lg font-bold"
          onClick={() => {
            setExploreQuery(tag.name);
            setToQuery(tag.name);
            setExploreTab("posts");
          }}
        >
          {tag.name}
        </p>
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteTagList;
