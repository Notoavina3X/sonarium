import Loader from "@/components/global/Loader";
import { User } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import AccountCard from "./account-card";

type InfiniteFollowerListProps = {
  followers?: User[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewFollowers: () => Promise<unknown>;
};

function InfiniteFollowerList({
  followers,
  isLoading,
  isError,
  hasMore = false,
  fetchNewFollowers,
}: InfiniteFollowerListProps) {
  if (isLoading)
    return (
      <div className="flex w-full justify-center">
        <Loader size="md" color="default" />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (followers == null || followers.length === 0)
    return <h1 className="text xl text-center">No Followers</h1>;

  return (
    <InfiniteScroll
      dataLength={followers.length}
      hasMore={hasMore}
      next={fetchNewFollowers}
      loader={
        <div className="flex w-full justify-center">
          <Loader size="md" color="default" />
        </div>
      }
    >
      {followers.map((follower) => (
        <AccountCard key={follower.id} user={follower} />
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteFollowerList;
