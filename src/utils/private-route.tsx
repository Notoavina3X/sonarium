import Loader from "@/components/global/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { data: sessionData, status } = useSession();
  const isLoading = status === "loading";
  const isSignedIn = !!sessionData;
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isSignedIn)
      router.push("/auth/signin").catch((err) => {
        console.error(err);
      });
  }, [isLoading, isSignedIn, router]);

  if (isLoading || !isSignedIn) {
    return <Loading />;
  }

  return children;
}

const Loading = () => {
  return (
    <div className="absolute left-0 top-0 z-50 grid h-screen w-screen place-items-center bg-background">
      <Loader size="lg" color="primary" />
    </div>
  );
};

export default PrivateRoute;
