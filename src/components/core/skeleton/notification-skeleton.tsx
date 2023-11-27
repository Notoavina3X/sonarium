import { Skeleton } from "@nextui-org/react";

function NotificationSkeleton() {
  return (
    <div className="my-[2px] grid grid-cols-[40px_auto] gap-4 rounded-sm bg-transparent p-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export default NotificationSkeleton;
