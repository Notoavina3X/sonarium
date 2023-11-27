import { api } from "@/utils/api";
import Head from "next/head";
import InfinitePostList from "@/components/core/ui/infinite-post-list";
import { Tab, Tabs } from "@nextui-org/react";
import NeedFollowIllustration from "@/components/global/need-to-follow-illustration";
import { useScopedI18n } from "locales";

export default function Feed() {
  const scopedT = useScopedI18n("home");

  return (
    <div className="relative min-h-screen grow">
      <Head>
        <title>{scopedT("title")} | Sonarium</title>
      </Head>
      <Tabs
        aria-label="feed"
        variant="underlined"
        color="primary"
        classNames={{
          base: [
            "sticky",
            "top-0",
            "z-40",
            "bg-background",
            "w-full",
            "flex",
            "justify-center",
          ],
          tabList: ["w-2/3"],
          tab: ["text-lg", "font-bold", "h-10"],
          panel: ["py-0"],
        }}
      >
        <Tab key="foryou" title={scopedT("tab.foryou")}>
          <section className="flex flex-col gap-2">
            <ForYou />
          </section>
        </Tab>
        <Tab key="following" title={scopedT("tab.following")}>
          <section className="flex flex-col gap-2">
            <Following />
          </section>
        </Tab>
      </Tabs>
    </div>
  );
}

function ForYou() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfinitePostList
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

function Following() {
  const scopedT = useScopedI18n("home");
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  if (posts.data?.pages.flatMap((page) => page.posts).length == 0)
    return (
      <div className="mx-auto flex h-[calc(100dvh-100px)] w-2/3 flex-col items-center justify-center gap-4 opacity-50">
        <NeedFollowIllustration />
        <h1 className="text-lg font-bold">{scopedT("startFollowing")}</h1>
      </div>
    );

  return (
    <InfinitePostList
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}
