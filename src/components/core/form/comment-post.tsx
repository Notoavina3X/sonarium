import { dateFormater, getTags } from "@/utils/methods";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  Textarea,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { commentAtom } from "@/store";
import User from "../ui/user";
import { useEffect, useState, type KeyboardEvent } from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

function CommentPost() {
  const { data: sessionData, status } = useSession();

  const [comment, setComment] = useAtom(commentAtom);

  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<Array<string>>([]);

  const onModalOpenChange = () =>
    setComment((data) => ({ ...data, isCommenting: !data.isCommenting }));

  const trpcUtils = api.useContext();
  const notify = api.notification.create.useMutation({
    onSuccess: async () => {
      await trpcUtils.notification.getCount.refetch();
    },
  });
  const createComment = api.comment.createComment.useMutation({
    onSuccess: (newComment) => {
      setComment({
        postSelected: undefined,
        isCommenting: false,
      });
      setContent("");
      toast.success("Comment posted successfully");

      if (status !== "authenticated") return;
      else {
        if (comment.postSelected?.id) {
          if (comment.postSelected.user.id != sessionData?.user.id) {
            notify.mutate({
              userId: comment.postSelected.user.id,
              text: comment.postSelected.description,
              content: {
                id: comment.postSelected.id,
                type: "comment",
                postId: comment.postSelected.id,
              },
            });
          }
          trpcUtils.post.getById.setData(
            { id: comment.postSelected.id },
            (oldData) => {
              if (oldData == null) return;

              const countModifier = newComment ? 1 : 0;
              return {
                ...oldData,
                commentCount: oldData.commentCount + countModifier,
              };
            }
          );

          const updateData: Parameters<
            typeof trpcUtils.post.infiniteFeed.setInfiniteData
          >[1] = (oldData) => {
            if (oldData == null) return;

            const countModifier = newComment ? 1 : -1;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  posts: page.posts.map((oldPost) => {
                    if (oldPost.id === comment.postSelected?.id) {
                      return {
                        ...oldPost,
                        commentCount: oldPost.commentCount + countModifier,
                      };
                    }

                    return oldPost;
                  }),
                };
              }),
            };
          };

          trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
          trpcUtils.post.infiniteFeed.setInfiniteData(
            { onlyFollowing: true },
            updateData
          );
          trpcUtils.post.infiniteProfileFeed.setInfiniteData(
            { userId: comment.postSelected.user.id },
            updateData
          );

          trpcUtils.comment.infiniteComment.setInfiniteData(
            { postId: comment.postSelected.id },
            (oldData) => {
              if (oldData?.pages[0] == null) return;

              const newCacheComment = {
                ...newComment,
                likeCount: 0,
                isLiked: false,
                user: {
                  name: sessionData.user.name,
                  username: sessionData.user.username,
                  id: sessionData.user.id,
                  image: sessionData.user.image,
                },
              };

              return {
                ...oldData,
                pages: [
                  {
                    ...oldData.pages[0],
                    comments: [newCacheComment, ...oldData.pages[0].comments],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            }
          );
        }
      }
    },

    onError: () => {
      toast.error("Error while commenting");
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
    if (comment.postSelected?.id)
      createComment.mutate({ postId: comment.postSelected.id, content, tags });
    else return;
  };

  useEffect(() => {
    if (content) {
      setTags(getTags(content));
    }
  }, [content]);

  if (!comment.postSelected) return null;

  return (
    <Modal
      isOpen={comment.isCommenting && !!comment.postSelected}
      onOpenChange={onModalOpenChange}
      placement="auto"
      size="xl"
      classNames={{ base: "bg-content3 dark:bg-content1", closeButton: "z-50" }}
    >
      <ModalContent>
        <Card className="bg-transparent p-2 shadow-none">
          <CardHeader className="flex items-start justify-between gap-2">
            <div className="flex flex-nowrap items-start justify-start gap-1">
              <User
                id={comment.postSelected?.user.id}
                name={comment.postSelected?.user.name}
                username={comment.postSelected?.user.username}
                avatarProps={{
                  name: comment.postSelected?.user.name ?? undefined,
                  src: comment.postSelected?.user.image ?? undefined,
                }}
              />
              <span className="ml-1 text-foreground-500">∙</span>
              <Chip
                className="bg-transparent px-0 text-xs text-foreground-500"
                size="sm"
              >
                {comment.postSelected &&
                  dateFormater(comment.postSelected.createdAt)}
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 px-3 py-2">
            <p className="text-sm text-foreground-600">
              {comment.postSelected?.description}
            </p>
          </CardBody>
        </Card>
        <Divider className="mx-auto w-2/3" />
        <ModalFooter>
          <div className="grid w-full grid-cols-[56px_auto_64px] rounded-xl bg-white/20 py-2 dark:bg-black/20">
            <div className="py-2 pl-4">
              <Avatar
                name={sessionData?.user.name ?? undefined}
                size="sm"
                radius="sm"
                src={sessionData?.user.image ?? undefined}
              />
            </div>
            <Textarea
              minRows={1}
              maxLength={150}
              description={content.length > 0 && `${content.length}/150`}
              placeholder={`Reply to @${comment.postSelected.user.username}`}
              value={content}
              onValueChange={setContent}
              onKeyDown={handleKeyEvent}
              classNames={{
                inputWrapper: [
                  "bg-transparent",
                  "data-[hover=true]:bg-transparent",
                  "group-data-[focus-visible=true]:ring-0",
                  "group-data-[focus=true]:bg-transparent",
                  "outline-none",
                  "shadow-none",
                ],
              }}
            />
            <div className="px-4 py-2">
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="flat"
                isDisabled={content.length == 0}
                onPress={handleSend}
              >
                <Icon
                  icon="heroicons:paper-airplane-solid"
                  className="text-lg"
                />
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CommentPost;
