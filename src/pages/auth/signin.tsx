import Loader from "@/components/global/Loader";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

const providers = [
  {
    id: "google",
    name: "Google",
    type: "oauth",
    icon: "google-icon",
  },
  {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    icon: "facebook",
  },
  {
    id: "discord",
    name: "Discord",
    type: "oauth",
    icon: "discord-icon",
  },
];

function SignIn() {
  const { status } = useSession();
  const router = useRouter();

  const handleLogin = async (providerId: string) => {
    try {
      await signIn(providerId);
    } catch (error) {
      toast.error("Sorry, can't sign in!");
    }
  };

  useEffect(() => {
    if (status == "authenticated") {
      router.push("/").catch(() => toast.error("Can't redirect to home page"));
    }
  }, [status, router]);

  if (status == "loading") {
    return (
      <div className="fixed left-0 top-0 grid h-screen w-screen place-items-center bg-background">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="grid h-screen w-screen place-items-center bg-[url('/image/grid-orange.svg')] ">
      <Head>
        <title>Sign In</title>
        <meta
          name="description"
          content="Sign in to Sonarium to get more content"
        />
      </Head>
      <div className="absolute left-0 top-0 z-0 h-screen w-screen bg-gradient-to-b from-transparent to-background"></div>
      <Card className="rounded-3xl bg-content2 p-8 dark:bg-content1">
        <CardHeader className="flex justify-center">
          <div className="aspect-square h-14 bg-[url('/logo.svg')] bg-cover bg-center"></div>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          <h1 className="text-center font-semibold">Sign with</h1>
          <div className="flex justify-center gap-3">
            {providers.map((provider) => (
              <Button
                size="lg"
                key={provider.name}
                className="bg-background"
                onPress={() => void handleLogin(provider.id)}
                isIconOnly
              >
                <Icon
                  inline
                  icon={`logos:${provider.icon}`}
                  className="text-lg"
                />
              </Button>
            ))}
          </div>
          <div className="relative my-2 flex w-full justify-center">
            <span className="relative z-10 max-w-fit rounded-full bg-content4 px-2 text-center">
              or
            </span>
            <span className="absolute inset-y-1/2 left-0 z-0 w-full border-b border-content4"></span>
          </div>
          <div className="flex flex-col gap-3">
            <Input label="Email address" variant="bordered" />
            <Input label="Password" type="password" variant="bordered" />
            <Button
              color="primary"
              size="lg"
              className="min-w-[250px] font-semibold"
              isDisabled
            >
              Sign in
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default SignIn;
