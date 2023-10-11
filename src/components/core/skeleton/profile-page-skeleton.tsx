import Navbar from "@/layouts/core/navbar";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, Skeleton } from "@nextui-org/react";
import Head from "next/head";
import { useRouter } from "next/router";

function ProfilePageSkeleton() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>Loading... | Sonarium</title>
      </Head>
      <Navbar>
        <div className="flex items-center justify-start gap-4">
          <Button
            isIconOnly
            size="lg"
            variant="light"
            className="text-2xl"
            aria-label="back"
            onPress={() => void handleBackClick()}
          >
            <Icon icon="solar:arrow-left-linear" />
          </Button>
          <div>
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="mt-1 h-4 w-16 rounded" />
          </div>
        </div>
      </Navbar>
      <section className="flex w-full flex-col items-center gap-2">
        <Card className="w-full bg-content2/50 shadow-none">
          <CardBody className="items-center gap-2">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex flex-col items-center">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="mt-2 h-5 w-20 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-6 w-14 rounded" />
                <span className="text-sm font-bold text-foreground opacity-70">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-6 w-14 rounded" />
                <span className="text-sm font-bold text-foreground opacity-70">
                  Following
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-6 w-14 rounded" />
                <span className="text-sm font-bold text-foreground opacity-70">
                  Likes
                </span>
              </div>
            </div>
            <Button
              size="md"
              className="w-32 font-bold"
              variant="solid"
              color="default"
              isLoading
            />
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

export default ProfilePageSkeleton;
