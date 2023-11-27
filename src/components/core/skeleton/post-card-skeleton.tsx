import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";
import User from "../ui/user";

function PostCardSkeleton({
  isText = false,
  withText = false,
}: {
  isText?: boolean;
  withText?: boolean;
}) {
  return (
    <div className="my-2 w-full">
      <Card className="bg-content1/25 p-2 shadow-none">
        <CardHeader>
          <User
            isLinked={false}
            name={undefined}
            username={undefined}
            avatarProps={{
              name: undefined,
            }}
          />
        </CardHeader>
        <CardBody className="flex flex-col gap-4 px-3 py-2">
          {(isText || withText) && (
            <Skeleton
              className="h-5 w-1/2 rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
          )}
          {!isText && (
            <Skeleton
              className="h-16 w-full rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
          )}
        </CardBody>
        <CardFooter>
          <div className="hidden w-full justify-between md:flex">
            <Skeleton
              className="h-8 w-16 rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
            <div className="flex gap-3">
              <Skeleton
                className="h-8 w-16 rounded-md"
                classNames={{
                  base: "bg-transparent dark:bg-transparent",
                }}
              />
              <Skeleton
                className="h-8 w-16 rounded-md"
                classNames={{
                  base: "bg-transparent dark:bg-transparent",
                }}
              />
              <Skeleton
                className="h-8 w-16 rounded-md"
                classNames={{
                  base: "bg-transparent dark:bg-transparent",
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-between md:hidden">
            <Skeleton
              className="h-8 w-16 rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
            <Skeleton
              className="h-8 w-16 rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
            <Skeleton
              className="h-8 w-16 rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
            <Skeleton
              className="h-8 w-16 rounded-md"
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PostCardSkeleton;
