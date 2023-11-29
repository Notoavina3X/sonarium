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
import { updatePostAtom } from "@/store";
import { useAtom } from "jotai";
import { dateFormater, getTags } from "@/utils/methods";
import EmbedPlayer from "../ui/embed-player";
import { api } from "@/utils/api";
import { toast } from "sonner";

function UpdatePost() {
  const { data: sessionData } = useSession();

  const [tags, setTags] = useState<Array<string>>([]);

  const [updatePost, setUpdatePost] = useAtom(updatePostAtom);
  const [description, setDescription] = useState<string | undefined>(
    () => updatePost.postSelected?.description ?? undefined
  );

  const onModalOpenChange = () => {
    setUpdatePost((data) => ({ ...data, isUpdating: !data.isUpdating }));
    setDescription(updatePost.postSelected?.description ?? undefined);
    setTags(updatePost.postSelected?.tags ?? []);
  };

  const trpcUtils = api.useContext();
  const update = api.post.update.useMutation({
    onSuccess: ({ isUpdated }) => {
      setUpdatePost({ postSelected: undefined, isUpdating: false });
      setDescription(undefined);
      setTags([]);
      toast.success("Post updated successfully");

      const updateData: Parameters<
        typeof trpcUtils.post.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((oldPost) => {
                if (oldPost.id === isUpdated.id) {
                  return {
                    ...oldPost,
                    description: isUpdated.description,
                    tags: isUpdated.tags,
                  };
                }

                return oldPost;
              }),
            };
          }),
        };
      };

      trpcUtils.post.infiniteProfileFeed.setInfiniteData(
        { userId: isUpdated.userId },
        updateData
      );
      trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.post.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.post.getById.setData({ id: isUpdated.id }, (oldData) => {
        if (oldData == null) return;

        return {
          ...oldData,
          description: isUpdated.description,
          tags: isUpdated.tags,
        };
      });
    },
    onError: () => {
      toast.error("Error appeared while updating");
    },
  });

  const handleSubmit = () => {
    if (updatePost.postSelected)
      update.mutate({ description, id: updatePost.postSelected.id, tags });
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
    if (updatePost.postSelected?.description?.length) {
      setDescription(updatePost.postSelected.description);
    }
  }, [updatePost.postSelected]);

  useEffect(() => {
    if (description) {
      setTags(getTags(description));
    }
  }, [description]);

  return (
    <Modal
      isOpen={updatePost.isUpdating && !!updatePost.postSelected}
      onOpenChange={onModalOpenChange}
      placement="auto"
      size="xl"
      classNames={{ base: "bg-content3 dark:bg-content1" }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col">
          {sessionData?.user && (
            <div className="flex max-w-fit flex-nowrap items-start justify-start gap-1">
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
              <span className="ml-1 text-foreground-500">∙</span>
              <Chip
                className="bg-transparent px-0 text-xs text-foreground-500"
                size="sm"
              >
                {updatePost.postSelected &&
                  dateFormater(updatePost.postSelected.createdAt)}
              </Chip>
            </div>
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
          {updatePost.postSelected?.sharedPost ? (
            <Card className="bg-white/20 p-2 shadow-none dark:bg-black/20">
              <CardHeader className="flex items-start justify-between gap-2">
                <div className="flex flex-nowrap items-start justify-start gap-1">
                  <User
                    id={updatePost.postSelected?.sharedPost.user.id}
                    name={updatePost.postSelected?.sharedPost.user.name}
                    username={updatePost.postSelected?.sharedPost.user.username}
                    avatarProps={{
                      name:
                        updatePost.postSelected?.sharedPost.user.name ??
                        undefined,
                      src:
                        updatePost.postSelected?.sharedPost.user.image ??
                        undefined,
                    }}
                  />
                  <span className="ml-1 text-foreground-500">∙</span>
                  <Chip
                    className="bg-transparent px-0 text-xs text-foreground-500"
                    size="sm"
                  >
                    {updatePost.postSelected?.sharedPost &&
                      dateFormater(
                        updatePost.postSelected?.sharedPost.createdAt
                      )}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 px-3 py-2">
                <p className="text-sm text-foreground-600">
                  {updatePost.postSelected?.description}
                </p>
                {updatePost.postSelected?.sharedPost.track && (
                  <EmbedPlayer
                    track={JSON.parse(
                      JSON.stringify(updatePost.postSelected?.sharedPost.track)
                    )}
                  />
                )}
              </CardBody>
            </Card>
          ) : updatePost.postSelected?.track ? (
            <EmbedPlayer
              track={JSON.parse(JSON.stringify(updatePost.postSelected?.track))}
            />
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="font-semibold"
            size="sm"
            onPress={() => void handleSubmit()}
            isLoading={update.isLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdatePost;
