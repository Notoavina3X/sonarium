import InfiniteCommentList from "@/components/core/ui/infinite-comment-list";
import SinglePostCard from "@/components/core/ui/single-post-card";
import Navbar from "@/layouts/core/navbar";
import { ssgHelper } from "@/server/api/ssgHelper";
import { api } from "@/utils/api";
import { getTags } from "@/utils/methods";
import { Icon } from "@iconify/react";
import { Avatar, Button, Card, Textarea } from "@nextui-org/react";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, type KeyboardEvent, useEffect } from "react";

const SinglePost: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const router = useRouter();
  const { data: post } = api.post.getById.useQuery({ id });

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>
          {post?.user.name} on Sonarium : &quot;{post?.description}&quot;
        </title>
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
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </Navbar>
      <section className="flex w-full flex-col items-center">
        <SinglePostCard post={post} />
        <CommentSection id={post?.id} />
      </section>
      <SinglePostComment id={post?.id} />
    </div>
  );
};

const SinglePostComment = ({ id }: { id: string | undefined }) => {
  const { data: sessionData, status } = useSession();

  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const trpcUtils = api.useContext();
  const createComment = api.comment.createComment.useMutation({
    onSuccess: (newComment) => {
      setContent("");
      if (status !== "authenticated") return;
      else {
        if (id) {
          trpcUtils.post.getById.setData({ id }, (oldData) => {
            if (oldData == null) return;

            const countModifier = newComment ? 1 : 0;
            return {
              ...oldData,
              commentCount: oldData.commentCount + countModifier,
            };
          });

          trpcUtils.comment.infiniteComment.setInfiniteData(
            { postId: id },
            (oldData) => {
              if (oldData == null || oldData.pages[0] == null) return;

              const newCacheComment = {
                ...newComment,
                likeCount: 0,
                isLiked: false,
                user: {
                  name: sessionData.user.name,
                  username: sessionData.user.username,
                  id: sessionData.user.id,
                  image: sessionData.user.image,
                },
              };

              return {
                ...oldData,
                pages: [
                  {
                    ...oldData.pages[0],
                    comments: [newCacheComment, ...oldData.pages[0].comments],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            }
          );
        }
      }
    },
  });

  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (content.length == 0) {
        e.preventDefault();
      } else if (!e.shiftKey && content.length > 0) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (id) createComment.mutate({ postId: id, content, tags });
    else return;
  };

  useEffect(() => {
    if (content && content.length > 0) {
      setTags(getTags(content));
    } else {
      setTags([]);
    }
  }, [content]);

  return (
    <Card className="sticky bottom-2 z-50 mt-2 bg-content3 px-2 shadow-none dark:bg-content1">
      <div className="grid grid-cols-[40px_auto_32px] items-center gap-2 p-2">
        <Avatar
          name={sessionData?.user.name ?? undefined}
          size="sm"
          radius="sm"
          src={sessionData?.user.image ?? undefined}
        />
        <Textarea
          minRows={1}
          maxLength={150}
          description={content.length > 0 && `${content.length}/150`}
          placeholder="Say something..."
          value={content}
          onValueChange={setContent}
          onKeyDown={handleKeyEvent}
        />
        <Button
          isIconOnly
          color="primary"
          size="sm"
          variant="flat"
          isDisabled={content.length == 0}
          onPress={handleSend}
        >
          <Icon icon="heroicons:paper-airplane-solid" className="text-lg" />
        </Button>
      </div>
    </Card>
  );
};

const CommentSection = ({ id }: { id: string | undefined }) => {
  const comments = api.comment.infiniteComment.useInfiniteQuery(
    { postId: id ?? "" },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <Card className="w-full bg-content1/20 p-2 shadow-none">
      {/* <InfiniteScroll></InfiniteScroll> */}
      <InfiniteCommentList
        comments={comments.data?.pages.flatMap((page) => page.comments)}
        isError={comments.isError}
        isLoading={comments.isLoading}
        hasMore={comments.hasNextPage}
        fetchNewComments={comments.fetchNextPage}
      />
    </Card>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default SinglePost;
