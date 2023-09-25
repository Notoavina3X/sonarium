import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Navbar from "@/layouts/core/navbar";
import Head from "next/head";
import InfinitePostList from "@/components/core/ui/infinite-post-list";
import NeedFollowIllustration from "@/components/global/need-to-follow-illustration";
import { Button } from "@nextui-org/react";

export default function Following() {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const { data: profile } = api.profile.getByUsername.useQuery({
    username: user?.username ?? "",
  });

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>Following | Sonarium</title>
      </Head>
      <Navbar>
        <div>
          <h1 className="text-xl font-bold">Following</h1>
          <span className="text-xs text-foreground-500">
            {profile?.followsCount} Following
          </span>
        </div>
      </Navbar>
      <section className="flex flex-col gap-2">
        {profile?.username === user?.username && profile?.followsCount == 0 ? (
          <div className="mx-auto flex h-[calc(100vh-200px)] max-w-md flex-col items-center justify-center gap-3 opacity-60">
            <NeedFollowIllustration />
            <h2 className="text-lg font-bold">Start to follow people</h2>
            <Button color="primary" variant="flat">
              How to follow ?
            </Button>
          </div>
        ) : (
          <Feed />
        )}
      </section>
    </div>
  );
}

function Feed() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
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
