import { deleteAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

function ConfirmPopup() {
  const { data: sessionData } = useSession();
  const [deleting, setDeleting] = useAtom(deleteAtom);

  const trpcUtils = api.useContext();
  const deletePost = api.post.delete.useMutation({
    onSuccess: ({ isDeleted }) => {
      if (isDeleted) {
        toast.success("Post deleted successfully");
        setDeleting({
          type: undefined,
          instance: undefined,
          isDeleting: false,
        });

        const updateData: Parameters<
          typeof trpcUtils.post.infiniteFeed.setInfiniteData
        >[1] = (oldData) => {
          if (oldData == null) return;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                posts: page.posts.filter(
                  (oldPost) => oldPost.id !== isDeleted.id
                ),
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
          { userId: isDeleted.userId },
          updateData
        );

        if (sessionData?.user.username) {
          trpcUtils.profile.getByUsername.setData(
            { username: sessionData.user.username },
            (oldData) => {
              if (oldData == null) return;

              return {
                ...oldData,
                postsCount: oldData.postsCount - 1,
              };
            }
          );
        }
      }
    },
    onError: () => toast.error("Error while deleting!"),
  });

  const deleteComment = api.comment.delete.useMutation({
    onSuccess: ({ isDeleted }) => {
      if (isDeleted) {
        toast.success("Comment deleted successfully");

        setDeleting({
          type: undefined,
          instance: undefined,
          isDeleting: false,
        });

        trpcUtils.post.getById.setData({ id: isDeleted.postId }, (oldData) => {
          if (oldData == null) return;

          return {
            ...oldData,
            commentCount: oldData.commentCount - 1,
          };
        });

        if (isDeleted.parentId) {
          trpcUtils.comment.infiniteReplies.setInfiniteData(
            { postId: isDeleted.postId, parentId: isDeleted.parentId },
            (oldData) => {
              if (oldData?.pages[0] == null) return;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    comments: page.comments.filter(
                      (oldComment) => oldComment.id !== isDeleted.id
                    ),
                  };
                }),
              };
            }
          );

          trpcUtils.comment.infiniteComment.setInfiniteData(
            { postId: isDeleted.postId },
            (oldData) => {
              if (oldData?.pages[0] == null) return;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    comments: page.comments.map((oldComment) => {
                      if (oldComment.id === isDeleted.parentId) {
                        return {
                          ...oldComment,
                          repliesCount: oldComment.repliesCount - 1,
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
            { postId: isDeleted.postId },
            (oldData) => {
              if (oldData?.pages[0] == null) return;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    comments: page.comments.filter(
                      (oldComment) => oldComment.id !== isDeleted.id
                    ),
                  };
                }),
              };
            }
          );
        }
      }
    },
  });

  const onModalOpenChange = () =>
    setDeleting((data) => ({ ...data, isDeleting: !data.isDeleting }));

  const handleDelete = () => {
    if (deleting?.instance) {
      deleting.type == "post"
        ? deletePost.mutate({ id: deleting.instance.id })
        : deleteComment.mutate({ id: deleting.instance.id });
    }
  };

  const handleCancel = () =>
    setDeleting({ type: undefined, instance: undefined, isDeleting: false });

  return (
    <Modal
      isOpen={deleting.isDeleting && !!deleting.instance && !!deleting.type}
      onOpenChange={onModalOpenChange}
      size="sm"
      placement="auto"
      classNames={{
        base: "bg-content3 dark:bg-content1",
        closeButton: "hidden",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <Icon
            icon="solar:compass-linear"
            className="w-full text-center text-5xl text-danger"
          />
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-center">
            <span className="font-semibold text-danger">
              Irreversible action
            </span>
            <h1 className="text-xl font-bold">Are you sure to delete it?</h1>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full justify-center gap-4">
            <Button variant="flat" color="danger" onPress={handleDelete}>
              Yeah, sure!
            </Button>
            <Button onPress={handleCancel}>No, cancel it</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmPopup;
