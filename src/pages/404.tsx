import ErrorIllustration from "@/components/global/error-illustration";

export default function Custom404() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-9xl font-bold opacity-70">404</h1>
      <div className="grid w-2/3 place-items-center">
        <ErrorIllustration />
      </div>
      <p className="text-2xl font-bold">Page not found</p>
    </div>
  );
}
