import InfiniteNotificationList from "@/components/core/ui/infinite-notification-list";
import Navbar from "@/layouts/core/navbar";
import { unreadAtom } from "@/store";
import { api } from "@/utils/api";
import { getPlural } from "@/utils/methods";
import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import Head from "next/head";

function Notifications() {
  const [unread, setUnread] = useAtom(unreadAtom);

  const trpcUtils = api.useContext();
  const notifications = api.notification.infiniteNotif.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const makeRead = api.notification.read.useMutation({
    onSuccess: ({ readed }) => {
      setUnread(0);

      trpcUtils.notification.infiniteNotif.setInfiniteData({}, (oldData) => {
        if (oldData == null) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              notifications: page.notifications.map((oldNotif) => {
                return {
                  ...oldNotif,
                  isRead: true,
                };
              }),
            };
          }),
        };
      });
    },
  });

  const handleReadAllClick = () => {
    makeRead.mutate({ readAll: true });
  };

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>Notifications | Sonarium</title>
      </Head>
      <Navbar>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            <span className="text-xs text-foreground-500">
              {unread} {getPlural(unread, "notification", "notifications")}
            </span>
          </div>
          <Dropdown
            placement="bottom-end"
            backdrop="opaque"
            classNames={{
              base: "bg-content3 dark:bg-content1",
              backdrop: "bg-transparent",
            }}
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                size="lg"
                variant="light"
                className="text-2xl"
                aria-label="+ options"
              >
                <Icon icon="solar:widget-linear" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              aria-label="More options"
              className="bg-content3 dark:bg-content1"
            >
              <DropdownItem
                key="all_as_read"
                startContent={
                  <Icon icon="solar:check-read-linear" className="text-lg" />
                }
                isReadOnly={unread == 0}
                onPress={handleReadAllClick}
              >
                <span className="font-semibold">Make all as read</span>
              </DropdownItem>
              <DropdownItem
                key="manage"
                startContent={
                  <Icon icon="solar:settings-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">Manage notifications</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Navbar>
      <section className="flex flex-col gap-2">
        <InfiniteNotificationList
          notifications={notifications.data?.pages.flatMap(
            (page) => page.notifications
          )}
          isError={notifications.isError}
          isLoading={notifications.isLoading}
          hasMore={notifications.hasNextPage}
          fetchNewNotifications={notifications.fetchNextPage}
        />
      </section>
    </div>
  );
}

export default Notifications;
