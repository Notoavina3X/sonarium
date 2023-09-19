import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";

const providers = [
  {
    id: "google",
    name: "Google",
    type: "oauth",
  },
  {
    id: "discord",
    name: "Discord",
    type: "oauth",
  },
];

function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = async (providerId: string) => {
    try {
      await signIn(providerId);
    } catch (error) {
      toast.error("Sorry, can't sign in!");
    }
  };

  if (session) {
    router.push("/").catch(() => toast.error("Can't redirect to home page"));
    return null;
  }

  return (
    <div className="grid h-screen w-screen place-items-center">
      <Head>
        <title>Sign In</title>
        <meta
          name="description"
          content="Sign in to Sonarium to get more content"
        />
      </Head>
      <Card
        shadow="none"
        className="rounded-3xl border border-primary/30 p-8 md:p-12"
      >
        <CardHeader className="flex justify-center">
          <div className="aspect-square h-14 bg-[url('/logo.svg')] bg-cover bg-center"></div>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {providers.map((provider) => (
            <Button
              size="lg"
              className="flex justify-between"
              key={provider.name}
              onPress={() => void handleLogin(provider.id)}
            >
              <Icon inline icon={`simple-icons:${provider.id}`} />{" "}
              <span>Sign in with {provider.name}</span>
            </Button>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default SignIn;
