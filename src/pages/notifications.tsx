import Navbar from "@/layouts/core/navbar";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import Head from "next/head";

function Notifications() {
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
              5 new Notifications
            </span>
          </div>
          <Button
            isIconOnly
            size="lg"
            variant="light"
            className="text-2xl"
            aria-label="+ options"
          >
            <Icon icon="solar:settings-minimalistic-linear" />
          </Button>
        </div>
      </Navbar>
      <section className="flex flex-col gap-2"></section>
    </div>
  );
}

export default Notifications;
