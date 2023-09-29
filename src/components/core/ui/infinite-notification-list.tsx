import { type Notif } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import NotificationSkeleton from "../skeleton/notification-skeleton";
import NotificationCard from "./notification-card";

type InfiniteNotificationListProps = {
  notifications?: Notif[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewNotifications: () => Promise<unknown>;
};

function InfiniteNotificationList({
  notifications,
  isLoading,
  isError,
  hasMore = false,
  fetchNewNotifications,
}: InfiniteNotificationListProps) {
  if (isLoading)
    return (
      <div className="flex w-full flex-col justify-center">
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (notifications == null || notifications.length === 0)
    return <h1 className="text xl text-center">No notifications</h1>;

  return (
    <InfiniteScroll
      dataLength={notifications.length}
      hasMore={hasMore}
      next={fetchNewNotifications}
      loader={
        <div className="flex w-full flex-col justify-center">
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </div>
      }
    >
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteNotificationList;
