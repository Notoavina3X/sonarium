import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react";
import User from "./user";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useState } from "react";

type PostCardProps = {
  post: string;
};

const fake_post = {
  id: "whatever",
  userId: "user1",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt iusto eaque architecto itaque adipisci voluptatum veritatis facilis, alias perspiciatis ut, consequuntur reprehenderit animi rerum! Quos illo distinctio officiis nisi odit.",
  createdAt: "2023-09-03",
  user: {
    id: "user1",
    name: "Harvey Specter",
    username: "veys",
    image: false,
  },
  likesCount: 2764,
  comments: [
    {
      id: "commentId",
      userId: "user1",
      postId: "whatever",
      content: "commentaire like",
      user: {
        id: "user1",
        name: "Harvey Specter",
        username: "veys",
        image: false,
      },
      likesCount: 20,
    },
  ],
  subposts: [],
};

function PostCard({ post }: PostCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const handleCardClick = () => {
    if (!isDropdownOpen) {
      router.push(`/post/${fake_post.id}`).catch((err) => {
        console.log(err);
        toast.error("Error while redirecting");
      });
    }
  };

  const handleToggleLike = () => {
    alert("toggle Like");
  };
  return (
    <div onClick={handleCardClick}>
      <Card className="cursor-pointer bg-content1/25 p-2 shadow-none hover:bg-content1/40">
        <CardHeader className="flex items-start justify-between gap-2">
          <div className="flex flex-nowrap items-start justify-start gap-1">
            <User
              id="fh35-4ngjd-dgjh"
              name={fake_post.user.name}
              username={fake_post.user.username}
              avatarProps={{
                name: fake_post.user.name,
              }}
            />
            <span className="ml-1 text-foreground-500">∙</span>
            <Chip
              className="bg-transparent px-0 text-xs text-foreground-500"
              size="sm"
            >
              {fake_post.createdAt}
            </Chip>
          </div>
          <Dropdown
            placement="bottom-end"
            backdrop="opaque"
            onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
            classNames={{ base: "bg-content3 dark:bg-content1" }}
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-lg"
                aria-label="+ options"
              >
                <Icon icon="solar:menu-dots-bold" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              aria-label="More options"
              className="bg-content3 dark:bg-content1"
            >
              <DropdownItem
                key="not_interested"
                startContent={
                  <Icon icon="solar:sad-circle-linear" className="text-lg" />
                }
              >
                <span className="font-bold">Not interested</span>
              </DropdownItem>
              <DropdownItem
                key="unfollow"
                startContent={
                  <Icon icon="solar:user-cross-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">
                  Unfollow {fake_post.user.username}
                </span>
              </DropdownItem>
              <DropdownItem
                key="block"
                startContent={
                  <Icon icon="solar:user-block-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">
                  Block {fake_post.user.username}
                </span>
              </DropdownItem>
              <DropdownItem
                key="report"
                startContent={
                  <Icon icon="solar:flag-linear" className="text-lg" />
                }
              >
                <span className="font-semibold">Report post</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 px-3 py-2">
          {/* <Skeleton className="rounded-md" isLoaded={true}> */}
          <p className="text-sm text-foreground-600">{fake_post.description}</p>
          {/* </Skeleton> */}
          <div className="flex h-20 items-center justify-between rounded-lg bg-content2/40 p-2">
            <div className="flex gap-3">
              <Skeleton className="aspect-square h-16 rounded-md"></Skeleton>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-40 rounded-md"></Skeleton>
                <Skeleton className="h-3 w-28 rounded-md"></Skeleton>
              </div>
            </div>
            <div className="flex h-full flex-col items-end justify-between">
              <Skeleton className="h-4 w-4 rounded-md"></Skeleton>
              <Skeleton className="h-10 w-10 rounded-full"></Skeleton>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button
            size="sm"
            variant="light"
            radius="md"
            color="default"
            onPress={() => void alert("like")}
            className="text-foreground-500"
          >
            <Icon icon="solar:heart-angle-linear" className="text-lg" />
            <span>{fake_post.likesCount}</span>
          </Button>
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="light"
              radius="md"
              onPress={handleToggleLike}
              className="text-foreground-500"
            >
              <Icon icon="solar:chat-dots-linear" className="text-lg" />
              <span>{fake_post.comments.length}</span>
            </Button>
            <Button
              size="sm"
              variant="light"
              radius="md"
              onPress={() => void alert("share")}
              className="text-foreground-500"
            >
              <Icon icon="solar:square-share-line-linear" className="text-lg" />
              <span>{fake_post.subposts.length}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PostCard;
