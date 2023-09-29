import { Button } from "@nextui-org/react";
import User from "./user";
import type { User as UserType } from "@/types";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

function AccountCard({ user }: { user: UserType }) {
  const { data: sessionData } = useSession();

  const trpcUtils = api.useContext();
  const notify = api.notification.create.useMutation({
    onSuccess: async ({ notifications }) => {
      await trpcUtils.notification.getCount.refetch();
    },
  });
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: async ({ addedFollow }) => {
      if (user.username) {
        trpcUtils.profile.getByUsername.setData(
          { username: user.username },
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

        if (sessionData?.user.username) {
          trpcUtils.profile.getByUsername.setData(
            { username: sessionData.user.username },
            (oldData) => {
              if (oldData == null) return;

              const countModifier = addedFollow ? 1 : -1;

              return {
                ...oldData,
                followsCount: oldData.followsCount + countModifier,
              };
            }
          );
        }

        if (addedFollow) {
          notify.mutate({
            userId: user.id,
            text: "",
            content: { id: "", type: "follow", postId: "" },
          });

          await trpcUtils.post.infiniteFeed.invalidate({ onlyFollowing: true });
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
                      (oldPost) => oldPost.user.id !== user.id
                    ),
                  };
                }),
              };
            }
          );
        }

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
                  if (oldPost.user.id === user.id) {
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
          { userId: user.id },
          updateData
        );
        await trpcUtils.profile.getSuggestions.invalidate();
      }
    },
  });

  const handleToggleFollow = () => {
    toggleFollow.mutate({
      userId: user.id,
    });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <User
        id={user.id}
        name={user.name}
        username={user.username}
        avatarProps={{
          name: user.name ?? undefined,
          src: user.image ?? undefined,
        }}
      />
      <Button
        size="sm"
        variant={user.isFollowing ? "light" : "flat"}
        color="primary"
        className="font-semibold"
        onPress={handleToggleFollow}
      >
        {user.isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}

export default AccountCard;
