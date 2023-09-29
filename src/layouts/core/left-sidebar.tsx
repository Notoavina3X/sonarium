import User from "@/components/core/ui/user";
import { siteConfig } from "@/config/site";
import { type NavLink } from "@/types";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  cn,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isModalOpenAtom, trackSelectedAtom, unreadAtom } from "@/store";
import { useAtom } from "jotai";
import { api } from "@/utils/api";

const variants = {
  open: { minWidth: "300px" },
  close: { minWidth: "75px" },
};

function LeftSidebar() {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const router = useRouter();
  const [isExpand, setIsExpand] = useState<boolean>(true);

  const [unread, setUnread] = useAtom(unreadAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);

  const { data: count } = api.notification.getCount.useQuery();

  const handleExpand = () => setIsExpand(!isExpand);

  const handleNewPost = () => {
    setTrackSelected(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setUnread(count ?? 0);
  }, [setUnread, count]);

  return (
    <motion.div
      className={cn(
        "sticky top-2 hidden h-[calc(100vh_-_16px)] flex-col justify-between rounded-2xl bg-content2/50 px-5 py-4 lg:flex",
        !isExpand && "items-center"
      )}
      initial={{ minWidth: "300px" }}
      animate={isExpand ? "open" : "close"}
      variants={variants}
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          !isExpand && "items-center",
          isExpand && "pr-2"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isExpand ? "justify-between" : "flex-col gap-3"
          )}
        >
          <Link href="/" className="max-w-fit">
            <Image
              src="/logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="w-12"
            />
          </Link>
          <Tooltip
            color="primary"
            content={`${isExpand ? "Close" : "Open"} Menu`}
            placement="right"
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-xl"
              onPress={() => void handleExpand()}
            >
              <Icon
                icon={`solar:square-alt-arrow-${
                  isExpand ? "left" : "right"
                }-linear`}
              />
            </Button>
          </Tooltip>
        </div>
        <ul className="flex flex-col">
          {siteConfig.mainNav.map(
            ({ title, href, icon, isActive }: NavLink) => {
              isActive = router.pathname == href;
              return (
                <li key={title}>
                  <Tooltip
                    color="primary"
                    content={`Go to ${title}`}
                    placement="right"
                    className={cn(isExpand && "hidden")}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "flex flex-nowrap items-center gap-4 rounded-xl p-3 text-lg outline-none duration-500 transition-background hover:bg-content2/75 focus:bg-content2/75",
                        isActive
                          ? "font-bold hover:bg-transparent focus:bg-transparent"
                          : "font-normal",
                        !isExpand && "justify-center"
                      )}
                    >
                      {title != "Notifications" ? (
                        <Icon
                          icon={`solar:${icon}-${isActive ? "bold" : "linear"}`}
                          className="text-2xl"
                        />
                      ) : (
                        <Badge
                          shape="circle"
                          color="primary"
                          size="sm"
                          content={unread > 99 ? "99+" : unread}
                          isInvisible={unread == 0}
                        >
                          <Icon
                            icon={`solar:${icon}-${
                              isActive ? "bold" : "linear"
                            }`}
                            className="text-2xl"
                          />
                        </Badge>
                      )}
                      {isExpand && <span>{title}</span>}
                    </Link>
                  </Tooltip>
                </li>
              );
            }
          )}
        </ul>
        <Tooltip
          color="primary"
          content="New Post"
          placement="right"
          className={cn(isExpand && "hidden")}
        >
          <Button
            color="primary"
            size="lg"
            className="font-bold"
            isIconOnly={!isExpand}
            onPress={() => void handleNewPost()}
          >
            {isExpand ? (
              "New Post"
            ) : (
              <Icon icon="ph:plus-bold" className="text-xl" />
            )}
          </Button>
        </Tooltip>
      </div>
      <div
        className={cn(
          "items-center gap-2",
          isExpand && "grid grid-cols-[auto_36px]",
          !isExpand && "flex flex-col"
        )}
      >
        <Tooltip
          color="primary"
          content="My Profile"
          placement="right"
          className={cn(isExpand && "hidden")}
        >
          <div className="flex">
            {isExpand ? (
              <Link href={`/${user?.username ?? ""}`}>
                <User
                  isLinked={false}
                  name={user?.name}
                  username={user?.username}
                  avatarProps={{
                    name: user?.name ?? "",
                    src: user?.image ?? undefined,
                  }}
                />
              </Link>
            ) : (
              <Avatar
                as={Link}
                showFallback
                src={user?.image ?? undefined}
                name={user?.name ?? ""}
                href={`/${user?.username}`}
                radius="md"
              />
            )}
          </div>
        </Tooltip>
        <Dropdown
          placement={isExpand ? "top-end" : "right-end"}
          backdrop="opaque"
          classNames={{
            base: "bg-content3 dark:bg-content1",
            backdrop: "bg-transparent",
          }}
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
              key="switch_account"
              startContent={
                <Icon icon="ph:arrows-counter-clockwise" className="text-lg" />
              }
            >
              <span className="font-semibold">Switch account</span>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              startContent={
                <Icon icon="solar:logout-2-linear" className="text-lg" />
              }
              onPress={() => void signOut()}
            >
              <span className="font-semibold">Log out</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </motion.div>
  );
}

export default LeftSidebar;
