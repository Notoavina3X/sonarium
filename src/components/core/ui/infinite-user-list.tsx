import InfiniteScroll from "react-infinite-scroll-component";
import AccountCardSkeleton from "../skeleton/account-card-skeleton";
import type { User } from "@/types";
import AccountCard from "./account-card";

type InfiniteUserListProps = {
  users?: User[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewUsers: () => Promise<unknown>;
};

function InfiniteUserList({
  users,
  isLoading,
  isError,
  hasMore = false,
  fetchNewUsers,
}: InfiniteUserListProps) {
  if (isLoading)
    return (
      <div className="flex w-full flex-col justify-center">
        <AccountCardSkeleton />
        <AccountCardSkeleton />
        <AccountCardSkeleton />
        <AccountCardSkeleton />
        <AccountCardSkeleton />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (users == null || users.length === 0)
    return <h1 className="text xl text-center">No User</h1>;

  return (
    <InfiniteScroll
      dataLength={users.length}
      hasMore={hasMore}
      next={fetchNewUsers}
      loader={
        <div className="flex w-full flex-col justify-center">
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
          <AccountCardSkeleton />
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <AccountCard key={user.id} user={user} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default InfiniteUserList;
