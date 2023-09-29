import { unreadAtom } from "@/store";
import type { Notif } from "@/types";
import { api } from "@/utils/api";
import { dateFormater, notifMessage } from "@/utils/methods";
import { Avatar, cn } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useRouter } from "next/router";

function NotificationCard({ notification }: { notification: Notif }) {
  const router = useRouter();

  const [unread, setUnread] = useAtom(unreadAtom);

  const trpcUtils = api.useContext();
  const makeRead = api.notification.read.useMutation({
    onSuccess: async ({ readed }) => {
      setUnread(unread - 1);

      if (notification.content.postId.length > 0) {
        await router.push(`/post/${notification.content.postId}`);
      } else {
        trpcUtils.notification.infiniteNotif.setInfiniteData({}, (oldData) => {
          if (oldData == null) return;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                notifications: page.notifications.map((oldNotif) => {
                  if (oldNotif.id === notification.id) {
                    return {
                      ...oldNotif,
                      isRead: true,
                    };
                  }

                  return oldNotif;
                }),
              };
            }),
          };
        });
      }
    },
  });
  const handleNotificationClick = () => {
    makeRead.mutate({ id: notification.id });
  };
  return (
    <div
      className={cn(
        "my-[2px] flex gap-4 rounded-sm p-2",
        !notification.isRead && "bg-content1/25 hover:bg-content1/40",
        notification.content.postId.length > 0 && "cursor-pointer"
      )}
      onClick={handleNotificationClick}
    >
      {notification.author ? (
        <Avatar
          size="md"
          radius="md"
          name={notification.author.username ?? undefined}
          src={notification.author.image ?? undefined}
        />
      ) : (
        <Avatar size="md" radius="md" name="system" src="/logo.svg" />
      )}
      <div className="flex flex-col">
        <div className="flex gap-4">
          <span className="text-sm font-semibold">
            {notification.author
              ? `@${notification.author.username}`
              : "System"}
          </span>
          <span className="text-sm opacity-70">
            {dateFormater(notification.createdAt)}
          </span>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="opacity-70">
            {notifMessage(notification.content.type)}
          </span>
          {notification.message}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
