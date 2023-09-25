import InfinitePostList from "@/components/core/ui/infinite-post-list";
import Navbar from "@/layouts/core/navbar";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

function Bookmarks() {
  const { data: sessionData } = useSession();

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>Bookmarks | Sonarium</title>
      </Head>
      <Navbar>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-xl font-bold">Bookmarks</h1>
            <span className="text-xs text-foreground-500">
              @{sessionData?.user.username}
            </span>
          </div>
        </div>
      </Navbar>
      <section className="flex flex-col gap-2">
        <Feed />
      </section>
    </div>
  );
}

function Feed() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    { onlyBookmarked: true },
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

export default Bookmarks;
