import Loader from "@/components/global/Loader";
import { User } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import AccountCard from "./account-card";

type InfiniteFollowingListProps = {
  following?: User[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewFollowing: () => Promise<unknown>;
};

function InfiniteFollowingList({
  following,
  isLoading,
  isError,
  hasMore = false,
  fetchNewFollowing,
}: InfiniteFollowingListProps) {
  if (isLoading)
    return (
      <div className="flex w-full justify-center">
        <Loader size="md" color="default" />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (following == null || following.length === 0)
    return <h1 className="text xl text-center">No Following</h1>;

  return (
    <InfiniteScroll
      dataLength={following.length}
      hasMore={hasMore}
      next={fetchNewFollowing}
      loader={
        <div className="flex w-full justify-center">
          <Loader size="md" color="default" />
        </div>
      }
    >
      {following.map((following) => (
        <AccountCard key={following.id} user={following} />
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteFollowingList;
