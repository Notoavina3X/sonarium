import PostCard from "./post-card";
import { type Post } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCardSkeleton from "../skeleton/post-card-skeleton";

type InfinitePostListProps = {
  posts?: Post[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPosts: () => Promise<unknown>;
};

function InfinitePostList({
  posts,
  isLoading,
  isError,
  hasMore = false,
  fetchNewPosts,
}: InfinitePostListProps) {
  if (isLoading)
    return (
      <div className="flex w-full flex-col justify-center">
        <PostCardSkeleton withText={true} />
        <PostCardSkeleton isText={true} />
        <PostCardSkeleton />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (posts == null || posts.length === 0)
    return <h1 className="text xl text-center">No Posts</h1>;

  return (
    <InfiniteScroll
      dataLength={posts.length}
      hasMore={hasMore}
      next={fetchNewPosts}
      loader={
        <div className="flex w-full flex-col justify-center">
          <PostCardSkeleton withText={true} />
          <PostCardSkeleton isText={true} />
          <PostCardSkeleton />
        </div>
      }
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
}

export default InfinitePostList;
