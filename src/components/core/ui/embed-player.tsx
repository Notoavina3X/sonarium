import { type TrackSelected } from "@/atoms/track-selected-atom";
import YoutubeEmbed from "./youtube-embed";
import SpotifyEmbed from "./spotify-embed";

function EmbedPlayer({ track }: { track: TrackSelected }) {
  if (track?.source === "spotify") return <SpotifyEmbed id={track.id} />;

  return <YoutubeEmbed track={track} />;
}

export default EmbedPlayer;
