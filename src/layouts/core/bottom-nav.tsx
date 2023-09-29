import { isModalOpenAtom, unreadAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import { Avatar, Badge, Button } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

function BottomNav() {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const [unread, setUnread] = useAtom(unreadAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);

  const { data: count } = api.notification.getCount.useQuery();

  useEffect(() => {
    setUnread(count ?? 0);
  }, [setUnread, count]);

  return (
    <div className="fixed bottom-2 left-2 z-50 flex w-[calc(100%-1rem)] items-center justify-between rounded-2xl bg-content2/50 px-5 py-4 backdrop-blur-lg lg:hidden">
      <Link href="/" className={`${router.pathname == "/" && "text-primary"}`}>
        <Icon
          icon={`solar:home-smile-${
            router.pathname == "/" ? "bold" : "linear"
          }`}
          className="text-2xl"
        />
      </Link>
      <Link
        href="/explore"
        className={`${router.pathname == "/explore" && "text-primary"}`}
      >
        <Icon
          icon={`solar:minimalistic-magnifer-${
            router.pathname == "/explore" ? "bold" : "linear"
          }`}
          className="text-2xl"
        />
      </Link>
      <Button
        size="sm"
        color="primary"
        className="font-bold"
        isIconOnly
        onPress={() => void setIsModalOpen(true)}
      >
        <Icon icon="ph:plus-bold" className="text-lg" />
      </Button>
      <Link
        href="/notifications"
        className={`${router.pathname == "/notifications" && "text-primary"}`}
      >
        <Badge
          content=""
          isInvisible={unread == 0}
          shape="circle"
          color="primary"
          size="sm"
        >
          <Icon
            icon={`solar:bell-${
              router.pathname == "/notifications" ? "bold" : "linear"
            }`}
            className="text-2xl"
          />
        </Badge>
      </Link>
      <Avatar
        as={Link}
        showFallback
        src={sessionData?.user.image ?? undefined}
        name={sessionData?.user.name ?? ""}
        href={`/${sessionData?.user.username}`}
        size="sm"
        radius="sm"
      />
    </div>
  );
}

export default BottomNav;
