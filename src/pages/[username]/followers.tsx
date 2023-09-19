import User from "@/components/core/ui/user";
import Navbar from "@/layouts/core/navbar";
import { getPlural } from "@/utils/methods";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import Head from "next/head";
import { useRouter } from "next/router";

function Followers() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>@stone310 | Sonarium</title>
      </Head>
      <Navbar>
        <div className="flex items-center justify-start gap-4">
          <Button
            isIconOnly
            size="lg"
            variant="light"
            className="text-2xl"
            onPress={() => void handleBackClick()}
            aria-label="back"
          >
            <Icon icon="solar:arrow-left-linear" />
          </Button>
          <User
            isLinked={false}
            name="Notoavina Razafilalao"
            username="stone310"
            description={`0 ${getPlural(0, "Follower", "Followers")}`}
            size="lg"
            avatarProps={{
              name: "Notoavina Razafilalao",
            }}
          />
        </div>
      </Navbar>
    </div>
  );
}

export default Followers;
