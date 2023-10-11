import SearchBar from "@/components/core/form/search-bar";
import AccountCard from "@/components/core/ui/account-card";
import InfinitePostList from "@/components/core/ui/infinite-post-list";
import InfiniteTagList from "@/components/core/ui/infinite-tag-list";
import InfiniteUserList from "@/components/core/ui/infinite-user-list";
import PostCard from "@/components/core/ui/post-card";
import SearchHistory from "@/components/core/ui/search-history";
import TopTrends from "@/components/core/ui/top-trends";
import Navbar from "@/layouts/core/navbar";
import { exploreQueryAtom, exploreTabAtom, toQueryAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tab,
  Tabs,
  cn,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import Head from "next/head";
import { useState, type KeyboardEvent } from "react";
import { toast } from "sonner";

export default function Explore() {
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);
  const [exploreTab, setExploreTab] = useAtom(exploreTabAtom);
  const [toQuery, setToQuery] = useAtom(toQueryAtom);

  const trpcUtils = api.useContext();
  const history = api.history.create.useMutation({
    onSuccess: ({ newHistory }) => {
      if (newHistory) {
        trpcUtils.history.getHistory.setData({}, (oldData) => {
          if (oldData) {
            return [
              newHistory,
              ...oldData.filter(
                (oldHistory) => oldHistory.id !== newHistory.id
              ),
            ];
          }
        });
        setToQuery(newHistory.term);
      }
    },
    onError: () => toast.error("Error while searching"),
  });

  const handleSearch = (term: string) => {
    setExploreQuery(term);
  };

  const handleOnFocus = () => {
    setIsSearching(true);
  };

  const handleOnBlur = () => {
    setIsSearching(false);
  };

  const handleOnClear = () => {
    setExploreQuery("");
    setToQuery(undefined);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && exploreQuery.length) {
      history.mutate({ term: exploreQuery });
    }
  };

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>Explore | Sonarium</title>
      </Head>
      <Navbar>
        <div className="grid w-full grid-cols-[auto_48px] items-center gap-2">
          <div className="group relative">
            <SearchBar
              value={exploreQuery}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              handleSearch={handleSearch}
              onClear={handleOnClear}
              onKeydown={handleKeyDown}
              duration={1}
            />
            <div
              className={cn(
                "absolute top-10 z-40 w-full pt-4",
                "group-hover:block",
                isSearching ? "block" : "hidden"
              )}
            >
              <SearchHistory />
            </div>
          </div>
          <Button
            isIconOnly
            size="lg"
            variant="light"
            color="default"
            className="text-2xl"
            aria-label="+ options"
          >
            <Icon icon="solar:settings-minimalistic-linear" />
          </Button>
        </div>
      </Navbar>
      {toQuery ? (
        <Tabs
          aria-label="explore"
          color="primary"
          variant="light"
          classNames={{
            base: [
              "sticky",
              "top-0",
              "z-40",
              "w-full",
              "flex",
              "justify-center",
            ],
            tabList: ["w-full"],
            tab: ["font-bold", "h-10"],
          }}
          selectedKey={exploreTab}
          onSelectionChange={setExploreTab}
        >
          <Tab key="default" title="Default">
            <DefaultResult term={toQuery} />
          </Tab>
          <Tab key="tags" title="Tags">
            <TagsResult term={toQuery} />
          </Tab>
          <Tab key="posts" title="Posts">
            <PostsResult term={toQuery} />
          </Tab>
          <Tab key="users" title="People">
            <UsersResult term={toQuery} />
          </Tab>
        </Tabs>
      ) : (
        <section className="flex flex-col gap-2">
          <TopTrends />
        </section>
      )}
    </div>
  );
}

function DefaultResult({ term }: { term: string }) {
  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);
  const [exploreTab, setExploreTab] = useAtom(exploreTabAtom);
  const [toQuery, setToQuery] = useAtom(toQueryAtom);

  const result = api.explore.getByDefault.useQuery({
    term,
  });

  if (result.isLoading) return <div>Loading...</div>;

  if (result.isError) return <div>Error...</div>;

  if (!result.data) return <div>No result</div>;

  return (
    <section className="flex flex-col gap-2">
      {!!result.data.tags.length && (
        <Card className="bg-content2/50 px-2 shadow-none">
          <CardHeader>Tags</CardHeader>
          <CardBody>
            <ul>
              {result.data.tags.map((tag) => (
                <li
                  key={tag.id}
                  className="my-1 cursor-pointer text-lg font-bold"
                  onClick={() => {
                    setExploreQuery(tag.name);
                    setToQuery(tag.name);
                    setExploreTab("posts");
                  }}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </CardBody>
          <CardFooter>
            <span
              className="cursor-pointer text-sm text-primary hover:text-primary-300"
              onClick={() => void setExploreTab("tags")}
            >
              View More
            </span>
          </CardFooter>
        </Card>
      )}
      {!!result.data.users.length && (
        <Card className="bg-content2/50 px-2 shadow-none">
          <CardHeader>People</CardHeader>
          <CardBody className="p-3">
            <ul className="flex flex-col gap-5">
              {result.data.users.map((user) => (
                <li key={user.id}>
                  <AccountCard user={user} />
                </li>
              ))}
            </ul>
          </CardBody>
          <CardFooter>
            <span
              className="cursor-pointer text-sm text-primary hover:text-primary-300"
              onClick={() => void setExploreTab("users")}
            >
              View More
            </span>
          </CardFooter>
        </Card>
      )}
      <div className="w-full">
        <div className="flex w-full items-center justify-between p-4">
          <span>Posts</span>
          <span
            className="cursor-pointer text-sm text-primary hover:text-primary-300"
            onClick={() => void setExploreTab("posts")}
          >
            View More Posts
          </span>
        </div>
        <ul className="w-full">
          {result.data.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TagsResult({ term }: { term: string }) {
  const result = api.explore.getByTags.useInfiniteQuery(
    { term },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <Card className="bg-content2/50 px-2 shadow-none">
      <CardBody>
        <InfiniteTagList
          tags={result.data?.pages.flatMap((page) => page.tags)}
          isError={result.isError}
          isLoading={result.isLoading}
          hasMore={result.hasNextPage}
          fetchNewTags={result.fetchNextPage}
        />
      </CardBody>
    </Card>
  );
}

function PostsResult({ term }: { term: string }) {
  const result = api.explore.getByPosts.useInfiniteQuery(
    {
      term,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <InfinitePostList
      posts={result.data?.pages.flatMap((page) => page.posts)}
      isError={result.isError}
      isLoading={result.isLoading}
      hasMore={result.hasNextPage}
      fetchNewPosts={result.fetchNextPage}
    />
  );
}

function UsersResult({ term }: { term: string }) {
  const result = api.explore.getByUsers.useInfiniteQuery(
    {
      term,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <InfiniteUserList
      users={result.data?.pages.flatMap((page) => page.users)}
      isLoading={result.isLoading}
      isError={result.isError}
      hasMore={result.hasNextPage}
      fetchNewUsers={result.fetchNextPage}
    />
  );
}
