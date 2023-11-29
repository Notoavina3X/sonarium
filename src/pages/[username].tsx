import Navbar from "@/layouts/core/navbar";
import { ssgHelper } from "@/server/api/ssgHelper";
import { api } from "@/utils/api";
import { getPlural } from "@/utils/methods";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  Link as NextUILink,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { type Key, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import InfinitePostList from "@/components/core/ui/infinite-post-list";
import { Profile } from "@/types";
import InfiniteFollowerList from "@/components/core/ui/infinite-follower-list";
import InfiniteFollowingList from "@/components/core/ui/infinite-following-list";
import InfiniteTrackList from "@/components/core/ui/infinite-track-list";
import ProfilePageSkeleton from "@/components/core/skeleton/profile-page-skeleton";
import { isEditingAtom } from "@/store";
import EditProfile from "@/components/core/form/edit-profile";
import { useAtom } from "jotai";
import ErrorIllustration from "@/components/global/error-illustration";
import Link from "next/link";

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data: sessionData } = useSession();
  const getProfile = api.profile.getByUsername.useQuery({ username });

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  if (getProfile.isLoading) return <ProfilePageSkeleton />;
  if (!getProfile?.data)
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold opacity-70">
          Cannot find user @{username}
        </h1>
        <div className="grid w-2/3 place-items-center">
          <ErrorIllustration />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>{`${getProfile.data.username} | Sonarium`}</title>
      </Head>
      <Navbar>
        <div className="flex items-center justify-start gap-4">
          <Button
            isIconOnly
            size="lg"
            variant="light"
            className="text-2xl"
            aria-label="back"
            onPress={() => void handleBackClick()}
          >
            <Icon icon="solar:arrow-left-linear" />
          </Button>
          <div className="flex w-full items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{getProfile.data.name}</h1>
              <span className="text-xs text-foreground-500">
                {getProfile.data.postsCount}{" "}
                {getPlural(getProfile.data.postsCount, "Post", "Posts")}
              </span>
            </div>
            {sessionData?.user.username === getProfile.data.username && (
              <Button
                as={Link}
                href={"/bookmarks"}
                isIconOnly
                size="lg"
                variant="light"
                className="text-2xl lg:hidden "
                aria-label="bookmark"
              >
                <Icon icon="solar:bookmark-linear" />
              </Button>
            )}
          </div>
        </div>
      </Navbar>
      <section className="flex w-full flex-col items-center gap-2">
        <ProfileInfo profile={getProfile.data} />
        <Tabs
          size="lg"
          color="primary"
          variant="underlined"
          classNames={{
            base: ["bg-background", "w-full", "flex", "justify-center"],
            tabList: ["w-full"],
            tab: ["font-semibold", "h-10"],
            panel: ["w-full", "py-0"],
          }}
        >
          <Tab
            key="posts"
            title={
              <div className="flex items-center space-x-3">
                <Icon icon="solar:feed-bold" />
                <span>Posts</span>
              </div>
            }
          >
            {getProfile.data.id && <PostFeed userId={getProfile.data.id} />}
          </Tab>
          <Tab
            key="tracks"
            title={
              <div className="flex items-center space-x-2">
                <Icon icon="solar:turntable-music-note-bold" />
                <span>Songs used</span>
              </div>
            }
          >
            {getProfile.data.id && <TrackFeed userId={getProfile.data.id} />}
          </Tab>
        </Tabs>
      </section>
    </div>
  );
};

function ProfileInfo({ profile }: { profile: Profile }) {
  const [tabKey, setTabKey] = useState("followers");

  const [isEditing, setIsEditing] = useAtom(isEditingAtom);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: sessionData } = useSession();

  const trpcUtils = api.useContext();
  const notify = api.notification.create.useMutation({
    onSuccess: async () => {
      await trpcUtils.notification.getCount.refetch();
    },
  });
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: async ({ addedFollow }) => {
      trpcUtils.profile.getByUsername.setData(
        { username: profile.username ?? "stone310" },
        (oldData) => {
          if (oldData == null) return;

          const countModifier = addedFollow ? 1 : -1;
          return {
            ...oldData,
            isFollowing: addedFollow,
            followersCount: oldData.followersCount + countModifier,
          };
        }
      );

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
                if (oldPost.user.id === profile.id) {
                  return {
                    ...oldPost,
                    user: {
                      ...oldPost.user,
                      isFollowing: addedFollow,
                    },
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
        { onlyBookmarked: true },
        updateData
      );
      trpcUtils.post.infiniteProfileFeed.setInfiniteData(
        { userId: profile.id },
        updateData
      );
      await trpcUtils.profile.getSuggestions.invalidate();

      if (addedFollow) {
        notify.mutate({
          userId: profile.id,
          text: "",
          content: { id: "", type: "follow", postId: "" },
        });
      } else {
        trpcUtils.post.infiniteFeed.setInfiniteData(
          { onlyFollowing: true },
          (oldData) => {
            if (oldData == null) return;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  posts: page.posts.filter(
                    (oldPost) => oldPost.user.id !== profile.id
                  ),
                };
              }),
            };
          }
        );
      }
    },
  });

  const handleShipClick = (key: string) => {
    onOpen();
    setTabKey(key);
  };

  return (
    <>
      <Card className="w-full bg-content2/50 shadow-none">
        <CardBody className="items-center gap-2">
          <Avatar
            name={profile.name ?? undefined}
            className="h-28 w-28"
            size="lg"
            classNames={{ name: "text-2xl" }}
            isBordered
            src={profile.image ?? undefined}
          />
          <div className="text-center">
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <span className="text-sm opacity-70">@{profile.username}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span className="flex flex-col items-center gap-2 font-semibold">
              <span>{profile.followersCount}</span>
              <NextUILink
                onPress={() => void handleShipClick("followers")}
                className="cursor-pointer opacity-70"
                size="sm"
                color="foreground"
              >
                {getPlural(profile.followersCount, "Follower", "Followers")}
              </NextUILink>
            </span>
            <span className="flex flex-col items-center gap-2 font-semibold">
              <span>{profile.followsCount}</span>
              <NextUILink
                onPress={() => void handleShipClick("following")}
                className="cursor-pointer opacity-70"
                size="sm"
                color="foreground"
              >
                Following
              </NextUILink>
            </span>
            <span className="flex flex-col items-center gap-2 font-semibold">
              <span>{profile.likesCount}</span>
              <NextUILink
                isDisabled
                className="cursor-pointer opacity-70"
                size="sm"
                color="foreground"
              >
                {getPlural(profile.likesCount, "Like", "Likes")}
              </NextUILink>
            </span>
          </div>
          {profile.id != sessionData?.user.id ? (
            <Button
              size="md"
              className="w-32 font-bold"
              variant="solid"
              color={profile.isFollowing ? "default" : "primary"}
              onPress={() => toggleFollow.mutate({ userId: profile.id })}
              isLoading={toggleFollow.isLoading}
              startContent={
                !profile.isFollowing && (
                  <Icon icon="solar:user-plus-bold" className="text-xl" />
                )
              }
              endContent={
                profile.isFollowing && (
                  <Icon icon="solar:check-read-linear" className="text-xl" />
                )
              }
            >
              {profile.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          ) : (
            <Button
              size="md"
              className="w-32 font-bold"
              variant="solid"
              onPress={() => void setIsEditing(true)}
            >
              Edit profile
            </Button>
          )}
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        size="lg"
        classNames={{ base: "bg-content3 dark:bg-content1" }}
      >
        <ModalContent>
          <ModalBody>
            <Ship
              userId={profile.id}
              tabKey={tabKey}
              followersCount={profile.followersCount}
              followsCount={profile.followsCount}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <EditProfile />
    </>
  );
}

type ShipProps = {
  userId: string;
  tabKey: string;
  followersCount: number;
  followsCount: number;
};

function Ship({ userId, tabKey, followersCount, followsCount }: ShipProps) {
  const [selectedTab, setSelectedTab] = useState<Key>(tabKey);

  const followers = api.profile.infiniteFollowers.useInfiniteQuery(
    { userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const following = api.profile.infiniteFollowing.useInfiniteQuery(
    { userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (selectedTab == "followers") {
      async () => {
        await followers.refetch();
      };
    } else {
      async () => {
        await following.refetch();
      };
    }
  }, [selectedTab, followers, following]);

  return (
    <Tabs
      aria-label="ship"
      variant="solid"
      size="md"
      color="primary"
      selectedKey={selectedTab}
      onSelectionChange={setSelectedTab}
      classNames={{ base: "justify-center" }}
    >
      <Tab
        key={"followers"}
        title={`${followersCount} ${getPlural(
          followersCount,
          "Follower",
          "Followers"
        )}`}
      >
        <InfiniteFollowerList
          followers={followers.data?.pages.flatMap((page) => page.followers)}
          isLoading={followers.isLoading}
          isError={followers.isError}
          hasMore={followers.hasNextPage}
          fetchNewFollowers={() => followers.fetchNextPage()}
        />
      </Tab>
      <Tab key={"following"} title={`${followsCount} Following`}>
        <InfiniteFollowingList
          following={following.data?.pages.flatMap((page) => page.following)}
          isLoading={following.isLoading}
          isError={following.isError}
          hasMore={following.hasNextPage}
          fetchNewFollowing={() => following.fetchNextPage()}
        />
      </Tab>
    </Tabs>
  );
}

function PostFeed({ userId }: { userId: string }) {
  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <ul className="w-full">
      <InfinitePostList
        posts={posts.data?.pages.flatMap((page) => page.posts)}
        isError={posts.isError}
        isLoading={posts.isLoading}
        hasMore={posts.hasNextPage}
        fetchNewPosts={posts.fetchNextPage}
      />
    </ul>
  );
}

function TrackFeed({ userId }: { userId: string }) {
  const postTracks = api.profile.infiniteTracks.useInfiniteQuery(
    { userId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <ul className="w-full">
      <InfiniteTrackList
        postTracks={postTracks.data?.pages.flatMap((page) => page.postTracks)}
        isError={postTracks.isError}
        isLoading={postTracks.isLoading}
        hasMore={postTracks.hasNextPage}
        fetchNewPostTracks={postTracks.fetchNextPage}
      />
    </ul>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ username: string }>
) {
  const username = context.params?.username;

  if (username == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export default Profile;
