import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Navbar from "@/layouts/core/navbar";
import PostCard from "@/components/core/ui/post-card";
import Head from "next/head";
// import YoutubeEmbed from "@/components/global/YoutubeEmbed";
// import SpotifyEmbed from "@/components/global/SpotifyEmbed";
// <YoutubeEmbed songId="hwATO9UMiw8" />
// <SpotifyEmbed songId="1qkwBaQUYh3HeUlUlGu8YM" />

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <div className="min-h-screen grow">
      <Head>
        <title>For you | Sonarium</title>
      </Head>
      <Navbar>
        <div>
          <h1 className="text-xl font-bold">For you</h1>
          <span className="text-xs italic text-foreground-500">
            &quot;Know them better&quot;
          </span>
        </div>
      </Navbar>
      <section className="flex flex-col gap-2">
        <PostCard post={"post"} />
        <PostCard post={"post"} />
      </section>
    </div>
  );
}
