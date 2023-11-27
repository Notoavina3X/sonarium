import InfiniteScroll from "react-infinite-scroll-component";
import { type TrackSelected } from "@/store";
import EmbedPlayer from "./embed-player";

export type PostTrack = {
  createdAt: Date;
  id: string;
  track: TrackSelected;
};

type InfiniteTrackListProps = {
  postTracks?: PostTrack[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPostTracks: () => Promise<unknown>;
};

function InfiniteTrackList({
  postTracks,
  isLoading,
  isError,
  hasMore = false,
  fetchNewPostTracks,
}: InfiniteTrackListProps) {
  if (isLoading)
    return (
      <div className="flex w-full flex-col justify-center">
        <h1>Loading...</h1>
        <h1>Loading...</h1>
        <h1>Loading...</h1>
      </div>
    );

  if (isError) return <h1>Error ...</h1>;
  if (postTracks == null || postTracks.length === 0)
    return <h1 className="text xl text-center">No Posts</h1>;

  return (
    <InfiniteScroll
      dataLength={postTracks.length}
      hasMore={hasMore}
      next={fetchNewPostTracks}
      loader={
        <div className="flex w-full flex-col justify-center">
          <h1>Loading...</h1>
          <h1>Loading...</h1>
          <h1>Loading...</h1>
        </div>
      }
    >
      {postTracks.map((postTrack) => (
        <EmbedPlayer key={postTrack.id} track={postTrack.track} />
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteTrackList;
