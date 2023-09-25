import { api } from "@/utils/api";
import Navbar from "@/layouts/core/navbar";
import Head from "next/head";
import InfinitePostList from "@/components/core/ui/infinite-post-list";

export default function Home() {
  return (
    <div className="min-h-screen grow">
      <Head>
        <title>For you | Sonarium</title>
      </Head>
      <Navbar>
        <div>
          <h1 className="text-xl font-bold">For you</h1>
          <span className="text-xs italic text-foreground-500">
            &quot;Know them better&quot;
          </span>
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
