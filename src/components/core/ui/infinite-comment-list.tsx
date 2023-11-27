import Loader from "@/components/global/Loader";
import type { Comment } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentCard from "./comment-card";

type InfiniteCommentListProps = {
  comments?: Comment[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewComments: () => Promise<unknown>;
};

export default function InfiniteCommentList({
  comments,
  isLoading,
  isError,
  hasMore = false,
  fetchNewComments,
}: InfiniteCommentListProps) {
  if (isLoading)
    return (
      <div className="flex w-full justify-center">
        <Loader size="md" color="default" />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (comments == null || comments.length === 0)
    return <h1 className="text xl text-center">No Comments</h1>;

  return (
    <InfiniteScroll
      dataLength={comments.length}
      hasMore={hasMore}
      next={fetchNewComments}
      loader={
        <div className="flex w-full justify-center">
          <Loader size="md" color="default" />
        </div>
      }
    >
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </InfiniteScroll>
  );
}
