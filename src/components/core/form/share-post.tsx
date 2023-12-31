import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import User from "../ui/user";
import { useSession } from "next-auth/react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { sharingPostAtom } from "@/store";
import { useAtom } from "jotai";
import { dateFormater, getTags } from "@/utils/methods";
import EmbedPlayer from "../ui/embed-player";
import { api } from "@/utils/api";
import { toast } from "sonner";

function SharePost() {
  const { data: sessionData } = useSession();

  const [description, setDescription] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<Array<string>>([]);

  const [sharingPost, setSharingPost] = useAtom(sharingPostAtom);

  const onModalOpenChange = () => {
    setSharingPost((data) => ({ ...data, isSharing: !data.isSharing }));
    setDescription(undefined);
    setTags([]);
  };

  const trpcUtils = api.useContext();
  const notify = api.notification.create.useMutation({
    onSuccess: async ({ notifications }) => {
      await trpcUtils.notification.getCount.refetch();
    },
  });
  const share = api.post.share.useMutation({
    onSuccess: (newPost) => {
      setSharingPost({ postSelected: undefined, isSharing: false });
      setDescription(undefined);
      setTags([]);
      toast.success("Post shared successfully");

      const updateData: Parameters<
        typeof trpcUtils.post.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = newPost ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((oldPost) => {
                if (oldPost.id === newPost.sharedId) {
                  return {
                    ...oldPost,
                    sharedCount: oldPost.sharedCount + countModifier,
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
      trpcUtils.post.getById.setData(
        { id: newPost.sharedId ?? "no-post" },
        (oldData) => {
          if (oldData == null) return;

          const countModifier = newPost ? 1 : 0;

          return {
            ...oldData,
            sharedCount: oldData.sharedCount + countModifier,
          };
        }
      );

      if (sharingPost?.postSelected) {
        if (sharingPost.postSelected.user.id != sessionData?.user.id) {
          notify.mutate({
            userId: sharingPost.postSelected.user.id,
            text: sharingPost.postSelected.description,
            content: {
              id: sharingPost.postSelected.id,
              type: "share",
              postId: sharingPost.postSelected.id,
            },
          });
        }
        notify.mutate({
          text: newPost.description,
          content: {
            id: newPost.id,
            type: "post",
            postId: newPost.id,
          },
        });
      }
    },
    onError: () => {
      toast.error("Error appeared while sharing");
    },
  });

  const handleSubmit = () => {
    if (sharingPost.postSelected)
      share.mutate({ description, postId: sharingPost.postSelected.id, tags });
  };

  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (description?.length == 0) {
        e.preventDefault();
      } else if (
        !e.shiftKey &&
        description?.length &&
        description?.length > 0
      ) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (description) {
      setTags(getTags(description));
    }
  }, [description]);

  return (
    <Modal
      isOpen={sharingPost.isSharing && !!sharingPost.postSelected}
      onOpenChange={onModalOpenChange}
      placement="auto"
      size="xl"
      classNames={{ base: "bg-content3 dark:bg-content1" }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col">
          {sessionData?.user && (
            <User
              isLinked={false}
              name={sessionData.user.name}
              username={sessionData.user.username}
              size="md"
              avatarProps={{
                name: sessionData.user.name ?? undefined,
                src: sessionData.user.image ?? undefined,
              }}
            />
          )}
          <Textarea
            minRows={1}
            placeholder="Wanna say something?"
            size="md"
            radius="none"
            classNames={{
              inputWrapper: [
                "bg-transparent",
                "data-[hover=true]:bg-transparent",
                "group-data-[focus-visible=true]:ring-0",
                "group-data-[focus=true]:bg-transparent",
                "outline-none",
                "shadow-none",
              ],
              input: "text-lg",
            }}
            value={description}
            onValueChange={setDescription}
            onKeyDown={handleKeyEvent}
          />
        </ModalHeader>
        <ModalBody>
          <Card className="bg-white/20 p-2 shadow-none dark:bg-black/20">
            <CardHeader className="flex items-start justify-between gap-2">
              <div className="flex flex-nowrap items-start justify-start gap-1">
                <User
                  id={sharingPost.postSelected?.user.id}
                  name={sharingPost.postSelected?.user.name}
                  username={sharingPost.postSelected?.user.username}
                  avatarProps={{
                    name: sharingPost.postSelected?.user.name ?? undefined,
                    src: sharingPost.postSelected?.user.image ?? undefined,
                  }}
                />
                <span className="ml-1 text-foreground-500">∙</span>
                <Chip
                  className="bg-transparent px-0 text-xs text-foreground-500"
                  size="sm"
                >
                  {sharingPost.postSelected &&
                    dateFormater(sharingPost.postSelected.createdAt)}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 px-3 py-2">
              <p className="text-sm text-foreground-600">
                {sharingPost.postSelected?.description}
              </p>
              {sharingPost.postSelected?.track && (
                <EmbedPlayer
                  track={JSON.parse(
                    JSON.stringify(sharingPost.postSelected.track)
                  )}
                />
              )}
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="font-semibold"
            size="sm"
            onPress={() => void handleSubmit()}
            isLoading={share.isLoading}
          >
            Share
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SharePost;
