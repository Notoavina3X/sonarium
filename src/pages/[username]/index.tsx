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
import ErrorPage from "next/error";
import { type Key, useState } from "react";
import { useSession } from "next-auth/react";
import InfinitePostList from "@/components/core/ui/infinite-post-list";
import { Profile } from "@/types";

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data: profile } = api.profile.getByUsername.useQuery({ username });

  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId: profile?.id ?? "stone310" },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  if (profile?.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>{`${profile.username} | Sonarium`}</title>
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
          <div>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <span className="text-xs text-foreground-500">
              {profile.postsCount}{" "}
              {getPlural(profile.postsCount, "Post", "Posts")}
            </span>
          </div>
        </div>
      </Navbar>
      <section className="flex w-full flex-col items-center gap-2">
        <ProfileInfo profile={profile} />
        <ul className="w-full">
          <InfinitePostList
            posts={posts.data?.pages.flatMap((page) => page.posts)}
            isError={posts.isError}
            isLoading={posts.isLoading}
            hasMore={posts.hasNextPage}
            fetchNewPosts={posts.fetchNextPage}
          />
        </ul>
      </section>
    </div>
  );
};

function ProfileInfo({ profile }: { profile: Profile }) {
  const [tabKey, setTabKey] = useState("followers");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: sessionData } = useSession();

  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
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
          <div className="flex justify-center gap-4">
            <span className="text-sm font-semibold">
              {profile.followersCount}{" "}
              <NextUILink
                onPress={() => void handleShipClick("followers")}
                className="cursor-pointer opacity-70"
                size="sm"
                color="foreground"
              >
                {getPlural(profile.followersCount, "Follower", "Followers")}
              </NextUILink>
            </span>
            <span className="text-sm font-semibold">
              {profile.followsCount}{" "}
              <NextUILink
                onPress={() => void handleShipClick("following")}
                className="cursor-pointer opacity-70"
                size="sm"
                color="foreground"
              >
                Following
              </NextUILink>
            </span>
          </div>
          {profile.id != sessionData?.user.id && (
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
              tabKey={tabKey}
              followersCount={profile.followersCount}
              followsCount={profile.followsCount}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

type ShipProps = {
  tabKey: string;
  followersCount: number;
  followsCount: number;
};

function Ship({ tabKey, followersCount, followsCount }: ShipProps) {
  const [selectedTab, setSelectedTab] = useState<Key>(tabKey);

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
        Followers
      </Tab>
      <Tab key={"following"} title={`${followsCount} Following`}>
        Following
      </Tab>
    </Tabs>
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
