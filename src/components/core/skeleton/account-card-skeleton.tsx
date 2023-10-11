import { Skeleton } from "@nextui-org/react";
import React from "react";

function AccountCardSkeleton() {
  return (
    <div className="grid w-full grid-cols-[40px_auto] gap-2">
      <Skeleton className="aspect-square w-10 rounded-xl" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-2 w-14 rounded-sm" />
      </div>
    </div>
  );
}

export default AccountCardSkeleton;
