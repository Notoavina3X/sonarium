import type { Comment } from "@/types";
import { api } from "@/utils/api";
import { dateFormater, getPlural, getTags } from "@/utils/methods";
import { Icon } from "@iconify/react";
import { Avatar, Button, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, type KeyboardEvent, useEffect } from "react";
import SentenceLinked from "./sentence-linked";

const CommentCard = ({ comment }: { comment: Comment }) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [viewReplies, setViewReplies] = useState<boolean>(false);

  const trpcUtils = api.useContext();
  const toggleLike = api.comment.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.comment.infiniteComment.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              comments: page.comments.map((oldComment) => {
                if (oldComment.id === comment.id) {
                  return {
                    ...oldComment,
                    likeCount: oldComment.likeCount + countModifier,
                    isLiked: addedLike,
                  };
                }

                return oldComment;
              }),
            };
          }),
        };
      };

      if (comment.parentId) {
        trpcUtils.comment.infiniteReplies.setInfiniteData(
          { parentId: comment.parentId, postId: comment.postId },
          updateData
        );
      } else {
        trpcUtils.comment.infiniteComment.setInfiniteData(
          { postId: comment.postId },
          updateData
        );
      }
    },
  });

  const handleToggleLike = () => {
    toggleLike.mutate({ id: comment.id });
  };

  return (
    <div className="group my-2 grid grid-cols-[40px_auto] gap-2">
      <Avatar
        as={Link}
        href={`/${comment.user.username}`}
        size="md"
        radius="md"
        name={comment.user.username ?? undefined}
        src={comment.user.image ?? undefined}
      />
      <div className="flex flex-col">
        <div className="grid grid-cols-[auto_40px]">
          <div className="flex flex-col">
            <Link
              href={`/${comment.user.username}`}
              className="truncate text-sm font-bold"
            >
              {comment.user.username}
            </Link>
            <p className="">
              <SentenceLinked
                sentence={comment.content}
                toLink={comment.tags}
              />
            </p>
            <div className="flex gap-3 p-1 text-[13px] text-foreground-500">
              <span>{dateFormater.format(comment.createdAt)}</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => void setIsReplying(true)}
              >
                Reply
              </span>
            </div>
          </div>
          {/* Options and Like section */}
          <div className="flex flex-col items-center">
            <Icon
              icon="solar:menu-dots-bold"
              className="invisible cursor-pointer group-hover:visible"
            />
            <div className="flex flex-col items-center">
              <Button
                isIconOnly
                size="sm"
                variant={comment.isLiked ? "flat" : "light"}
                radius="md"
                color={comment.isLiked ? "primary" : "default"}
                onPress={handleToggleLike}
                isLoading={toggleLike.isLoading}
                className={`${!comment.isLiked && "text-foreground-500"}`}
              >
                <Icon
                  icon={`solar:heart-angle-${
                    comment.isLiked ? "bold" : "linear"
                  }`}
                  className="text-lg"
                />
              </Button>
              <span className="text-sm">{comment.likeCount}</span>
            </div>
          </div>
        </div>
        {isReplying && (
          <ReplyComment
            id={comment.id}
            postId={comment.postId}
            parentId={comment.parentId}
            closeReply={() => void setIsReplying(false)}
          />
        )}
        {comment.repliesCount > 0 && !viewReplies && (
          <Button
            size="sm"
            variant="light"
            className="max-w-fit font-semibold"
            onPress={() => void setViewReplies(true)}
            endContent={
              <Icon
                icon="solar:alt-arrow-down-linear"
                className="text-lg"
                inline
              />
            }
          >
            View {comment.repliesCount}{" "}
            {getPlural(comment.repliesCount, "Reply", "Replies")}
          </Button>
        )}
        {viewReplies && (
          <ReplyList
            parentId={comment.id}
            postId={comment.postId}
            hideReplies={() => void setViewReplies(false)}
          />
        )}
      </div>
    </div>
  );
};

type ReplyCommentProps = {
  id: string;
  postId: string;
  parentId: string | null;
  closeReply: () => void;
};

const ReplyComment = ({
  id,
  postId,
  parentId,
  closeReply,
}: ReplyCommentProps) => {
  const { data: sessionData, status } = useSession();

  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const trpcUtils = api.useContext();
  const replyComment = api.comment.replyComment.useMutation({
    onSuccess: (newReply) => {
      setContent("");
      if (status !== "authenticated") return;
      else {
        trpcUtils.post.getById.setData({ id }, (oldData) => {
          if (oldData == null) return;

          const countModifier = newReply ? 1 : 0;

          return {
            ...oldData,
            commentCount: oldData.commentCount + countModifier,
          };
        });

        if (parentId) {
          trpcUtils.comment.infiniteReplies.setInfiniteData(
            { postId, parentId },
            (oldData) => {
              if (oldData?.pages[0] == null) return;

              const countModifier = newReply ? 1 : 0;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    comments: page.comments.map((oldComment) => {
                      if (oldComment.id === id) {
                        return {
                          ...oldComment,
                          repliesCount: oldComment.repliesCount + countModifier,
                        };
                      }

                      return oldComment;
                    }),
                  };
                }),
              };
            }
          );
        } else {
          trpcUtils.comment.infiniteComment.setInfiniteData(
            { postId },
            (oldData) => {
              if (oldData?.pages[0] == null) return;

              const countModifier = newReply ? 1 : 0;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    comments: page.comments.map((oldComment) => {
                      if (oldComment.id === id) {
                        return {
                          ...oldComment,
                          repliesCount: oldComment.repliesCount + countModifier,
                        };
                      }

                      return oldComment;
                    }),
                  };
                }),
              };
            }
          );
        }
      }
    },
  });

  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (content.length == 0) {
        e.preventDefault();
      } else if (!e.shiftKey && content.length > 0) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSend = () => {
    replyComment.mutate({ postId, content, parentId: id, tags });
  };

  useEffect(() => {
    if (content && content.length > 0) {
      setTags(getTags(content));
    } else {
      setTags([]);
    }
  }, [content]);

  return (
    <div className="grid grid-cols-[40px_auto_32px] items-center gap-1 p-2">
      <Avatar
        name={sessionData?.user.name ?? undefined}
        size="sm"
        radius="sm"
        src={sessionData?.user.image ?? undefined}
      />
      <Textarea
        size="sm"
        variant="underlined"
        color="primary"
        minRows={1}
        maxLength={150}
        description={content.length > 0 && `${content.length}/150`}
        placeholder="Reply something..."
        value={content}
        onValueChange={setContent}
        onKeyDown={handleKeyEvent}
      />
      <Button isIconOnly size="sm" variant="light" onPress={closeReply}>
        <Icon icon="ph:x-bold" className="text-lg" />
      </Button>
    </div>
  );
};

type ReplyListProps = {
  parentId: string;
  postId: string;
  hideReplies: () => void;
};
const ReplyList = ({ parentId, postId, hideReplies }: ReplyListProps) => {
  const replies = api.comment.infiniteReplies.useInfiniteQuery(
    { parentId, postId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const handleMore = () => {
    replies.fetchNextPage().catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        {replies.data?.pages
          .flatMap((page) => page.comments)
          .map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
      </div>
      <div className="flex w-full items-center justify-between">
        {replies.hasNextPage && (
          <Button
            size="sm"
            variant="light"
            className="max-w-fit font-semibold"
            onPress={handleMore}
          >
            View More{" "}
            <Icon
              icon="solar:alt-arrow-down-linear"
              className="text-lg"
              inline
            />
          </Button>
        )}
        <Button
          size="sm"
          variant="light"
          className="max-w-fit font-semibold"
          onPress={hideReplies}
        >
          Hide
        </Button>
      </div>
    </div>
  );
};

export default CommentCard;
