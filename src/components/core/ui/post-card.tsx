import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import User from "./user";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useState } from "react";
import { type Post } from "@/types";
import { dateFormater } from "@/utils/methods";
import EmbedPlayer from "./embed-player";
import { api } from "@/utils/api";
import {
  type TrackSelected,
  isModalOpenAtom,
  sharingPostAtom,
  trackSelectedAtom,
} from "@/store";
import { useAtom } from "jotai";
import Link from "next/link";
import SentenceLinked from "./sentence-linked";

function PostCard({ post }: { post: Post }) {
  const [sharingPost, setSharingPost] = useAtom(sharingPostAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const router = useRouter();

  const handleCardClick = () => {
    if (!isDropdownOpen) {
      router.push(`/post/${post.id}`).catch((err) => {
        console.log(err);
        toast.error("Error while redirecting");
      });
    }
  };

  const handleUseTrack = (track: TrackSelected) => {
    setTrackSelected(track);
    setIsModalOpen(true);
  };

  const trpcUtils = api.useContext();
  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.post.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((oldPost) => {
                if (oldPost.id === post.id) {
                  return {
                    ...oldPost,
                    likeCount: oldPost.likeCount + countModifier,
                    isLiked: addedLike,
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
        { userId: post.user.id },
        updateData
      );
    },
  });

  const toggleBookmark = api.post.toggleBookmark.useMutation({
    onSuccess: ({ addedBookmark }) => {
      const updateData: Parameters<
        typeof trpcUtils.post.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedBookmark ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((oldPost) => {
                if (oldPost.id === post.id) {
                  return {
                    ...oldPost,
                    bookmarkCount: oldPost.bookmarkCount + countModifier,
                    isBookmarked: addedBookmark,
                  };
                }

                return oldPost;
              }),
            };
          }),
        };
      };

      const updateDataBookmarked: Parameters<
        typeof trpcUtils.post.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.filter((oldPost) => oldPost.id !== post.id),
            };
          }),
        };
      };

      trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.post.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.post.infiniteFeed.setInfiniteData(
        { onlyBookmarked: true },
        updateDataBookmarked
      );
      trpcUtils.post.infiniteProfileFeed.setInfiniteData(
        { userId: post.user.id },
        updateData
      );

      const message = addedBookmark
        ? "Added to bookmarks"
        : "Removed from bookmarks";
      toast.success(message);
    },
  });

  const handleToggleLike = () => {
    toggleLike.mutate({ id: post.id });
  };

  const handleToggleBookmark = () => {
    toggleBookmark.mutate({ id: post.id });
  };

  return (
    <div onClick={handleCardClick} className="my-2">
      <Card className="cursor-pointer bg-content1/25 p-2 shadow-none hover:bg-content1/40">
        <CardHeader className="flex items-start justify-between gap-2">
          <div className="flex flex-nowrap items-start justify-start gap-1">
            <User
              id={post.user.id}
              name={post.user.name}
              username={post.user.username}
              avatarProps={{
                name: post.user.name ?? undefined,
                src: post.user.image ?? undefined,
              }}
            />
            <span className="ml-1 text-foreground-500">∙</span>
            <Chip
              className="bg-transparent px-0 text-xs text-foreground-500"
              size="sm"
            >
              {dateFormater.format(post.createdAt)}
            </Chip>
          </div>
          <Dropdown
            placement="bottom-end"
            backdrop="opaque"
            onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
            classNames={{ base: "bg-content3 dark:bg-content1" }}
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-lg"
                aria-label="+ options"
              >
                <Icon icon="solar:menu-dots-bold" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              aria-label="More options"
              className="bg-content3 dark:bg-content1"
            >
              <DropdownItem
                key="not_interested"
                startContent={
                  <Icon icon="solar:sad-circle-linear" className="text-lg" />
                }
              >
                <span className="font-bold">Not interested</span>
              </DropdownItem>
              <DropdownItem
                key="unfollow"
                startContent={
                  <Icon icon="solar:user-cross-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">
                  Unfollow @{post.user.username}
                </span>
              </DropdownItem>
              <DropdownItem
                key="block"
                startContent={
                  <Icon icon="solar:user-block-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">
                  Block @{post.user.username}
                </span>
              </DropdownItem>
              <DropdownItem
                key="report"
                startContent={
                  <Icon icon="solar:flag-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">Report post</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 px-3 py-2">
          <p className="text-sm text-foreground-600">
            <SentenceLinked sentence={post.description} toLink={post.tags} />
          </p>
          {post.track && (
            <div className="group relative w-full">
              <EmbedPlayer track={post.track} />
              <div className="absolute -right-3 -top-3 hidden group-hover:flex">
                <Tooltip content="Use this track">
                  <Button
                    size="sm"
                    isIconOnly
                    radius="full"
                    color="primary"
                    onPress={() =>
                      void handleUseTrack(
                        JSON.parse(JSON.stringify(post.track))
                      )
                    }
                  >
                    <Icon icon="ph:plus-bold" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          )}
          {post.sharedPost?.user && (
            <Card className="bg-white/20 p-2 shadow-none dark:bg-black/20">
              <CardHeader
                className="flex items-start justify-between gap-2"
                as={Link}
                href={`/${post.sharedPost.user.username}`}
              >
                <div className="flex flex-nowrap items-start justify-start gap-1">
                  <User
                    id={post.sharedPost.user.id}
                    name={post.sharedPost.user.name}
                    username={post.sharedPost.user.username}
                    avatarProps={{
                      name: post.sharedPost.user.name ?? undefined,
                      src: post.sharedPost.user.image ?? undefined,
                    }}
                  />
                  <span className="ml-1 text-foreground-500">∙</span>
                  <Chip
                    className="bg-transparent px-0 text-xs text-foreground-500"
                    size="sm"
                  >
                    {dateFormater.format(post.sharedPost.createdAt)}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody
                className="flex flex-col gap-4 px-3 py-2"
                as={Link}
                href={`/post/${post.sharedPost.id}`}
              >
                <p className="text-sm text-foreground-600">
                  <SentenceLinked
                    sentence={post.sharedPost.description}
                    toLink={post.sharedPost.tags}
                  />
                </p>
                {post.sharedPost.track && (
                  <div className="group relative w-full">
                    <EmbedPlayer track={post.sharedPost.track} />
                    <div className="absolute -right-3 -top-3 hidden group-hover:flex">
                      <Tooltip content="Use this track">
                        <Button
                          size="sm"
                          isIconOnly
                          radius="full"
                          color="primary"
                          onPress={() =>
                            void handleUseTrack(
                              JSON.parse(JSON.stringify(post.sharedPost?.track))
                            )
                          }
                        >
                          <Icon icon="ph:plus-bold" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </CardBody>
        <CardFooter>
          <div className="hidden w-full justify-between md:flex">
            <Button
              size="sm"
              variant={post.isLiked ? "flat" : "light"}
              radius="md"
              color={post.isLiked ? "primary" : "default"}
              onPress={handleToggleLike}
              isLoading={toggleLike.isLoading}
              className={`${!post.isLiked && "text-foreground-500"}`}
            >
              <Icon
                icon={`solar:heart-angle-${post.isLiked ? "bold" : "linear"}`}
                className="text-lg"
              />
              <span>{post.likeCount}</span>
            </Button>
            <div className="flex justify-between gap-3">
              <Button
                size="sm"
                variant="light"
                radius="md"
                className="text-foreground-500"
              >
                <Icon icon="solar:chat-dots-linear" className="text-lg" />
                <span>{post.commentCount}</span>
              </Button>
              <Button
                size="sm"
                variant="light"
                radius="md"
                onPress={() =>
                  setSharingPost({
                    postSelected: post.sharedPost ?? post,
                    isSharing: true,
                  })
                }
                className="text-foreground-500"
              >
                <Icon
                  icon="solar:square-share-line-linear"
                  className="text-lg"
                />
                <span>{post.sharedCount}</span>
              </Button>
              <Button
                size="sm"
                variant={post.isBookmarked ? "flat" : "light"}
                radius="md"
                color={post.isBookmarked ? "warning" : "default"}
                onPress={handleToggleBookmark}
                isLoading={toggleBookmark.isLoading}
                className={`${!post.isBookmarked && "text-foreground-500"}`}
              >
                <Icon
                  icon={`solar:bookmark-${
                    post.isBookmarked ? "bold" : "linear"
                  }`}
                  className="text-lg"
                />
                <span>{post.bookmarkCount}</span>
              </Button>
            </div>
          </div>
          <div className="flex w-full justify-between md:hidden">
            <Button
              size="sm"
              variant={post.isLiked ? "flat" : "light"}
              radius="md"
              color={post.isLiked ? "primary" : "default"}
              onPress={handleToggleLike}
              isLoading={toggleLike.isLoading}
              className={`${!post.isLiked && "text-foreground-500"}`}
            >
              <Icon
                icon={`solar:heart-angle-${post.isLiked ? "bold" : "linear"}`}
                className="text-lg"
              />
              <span>{post.likeCount}</span>
            </Button>
            <Button
              size="sm"
              variant="light"
              radius="md"
              className="text-foreground-500"
            >
              <Icon icon="solar:chat-dots-linear" className="text-lg" />
              <span>{post.commentCount}</span>
            </Button>
            <Button
              size="sm"
              variant="light"
              radius="md"
              onPress={() =>
                setSharingPost({ postSelected: post, isSharing: true })
              }
              className="text-foreground-500"
            >
              <Icon icon="solar:square-share-line-linear" className="text-lg" />
              <span>{post.sharedCount}</span>
            </Button>
            <Button
              size="sm"
              variant={post.isBookmarked ? "flat" : "light"}
              radius="md"
              color={post.isBookmarked ? "warning" : "default"}
              onPress={handleToggleBookmark}
              isLoading={toggleBookmark.isLoading}
              className={`${!post.isBookmarked && "text-foreground-500"}`}
            >
              <Icon
                icon={`solar:bookmark-${post.isBookmarked ? "bold" : "linear"}`}
                className="text-lg"
              />
              <span>{post.bookmarkCount}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PostCard;