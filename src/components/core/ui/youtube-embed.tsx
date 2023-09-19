import { Icon } from "@iconify/react";
import { CircularProgress, Image, Link } from "@nextui-org/react";
import { useState, useEffect, createRef } from "react";
import YouTube from "react-youtube";
import CopyButton from "@/components/global/copy-button";
import { type TrackSelected } from "@/atoms/track-selected-atom";

function YoutubeEmbed({ track }: { track: TrackSelected }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = createRef<YouTube>();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((currentTime) => {
          if (currentTime >= 30) {
            setIsPlaying(false);
            playerRef.current?.internalPlayer.stopVideo();
            clearInterval(interval!);
            return 0;
          }
          return currentTime + 0.1;
        });
      }, 100);
    }

    return () => {
      clearInterval(interval!);
    };
  }, [isPlaying, currentTime, playerRef]);

  const onStateChange = (event: { target: YouTube; data: number }) => {
    if (event.data === 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.internalPlayer.pauseVideo();
    } else {
      playerRef.current?.internalPlayer.playVideo();
    }
  };

  const youtubeOpts = {
    playerVars: {
      controls: 0,
      autoplay: 0,
    },
  };

  return (
    <div className="relative grid h-20 w-full grid-cols-[64px_auto] gap-4 rounded-xl bg-red-600/20 p-2">
      <Image
        as={Link}
        href={track?.url}
        isExternal
        src={track?.image}
        alt={track?.title}
        className="aspect-square w-[64px] cursor-pointer rounded-lg"
      />
      <div className="grid grid-cols-[auto_64px]">
        <div className="flex h-full flex-col justify-end gap-1 overflow-hidden">
          <Link
            href={track?.url}
            isExternal
            className="max-w-max flex-none cursor-pointer truncate text-sm font-bold leading-[1.5ch] text-foreground hover:underline"
            title={track?.title}
          >
            {track?.title}
          </Link>
          <Link
            href={`https://www.youtube.com/channel/${track?.authorId}`}
            isExternal
            className="max-w-max flex-none cursor-pointer truncate text-[10px] font-bold text-foreground opacity-70 hover:underline"
            title={track?.author}
          >
            {track?.author}
          </Link>
          <span className="max-w-max flex-none rounded-[2px] bg-foreground/75 px-[5px] py-[2px] text-[9px] font-bold text-background">
            PREVIEW
          </span>
        </div>
        <div className="relative flex items-end gap-3">
          <Link
            href="https://www.youtube.com/"
            className="absolute right-0 top-0 text-foreground"
            isExternal
          >
            <Icon icon="simple-icons:youtube" />
          </Link>
          <CopyButton text={track?.url} />
          <button
            onClick={togglePlayPause}
            className="relative z-30 translate-x-1 translate-y-1 transform rounded-full text-4xl"
          >
            {isPlaying ? (
              <Icon icon="fe:pause" />
            ) : (
              <Icon icon="solar:play-circle-bold" />
            )}
          </button>
          {isPlaying && (
            <CircularProgress
              aria-label="Loading..."
              size="md"
              value={(currentTime / 30) * 100}
              color="default"
              strokeWidth={1}
              className="absolute -bottom-[0.35rem] -right-[0.35rem] z-10"
            />
          )}
        </div>
      </div>

      <YouTube
        videoId={track?.id}
        opts={youtubeOpts}
        onStateChange={onStateChange}
        ref={playerRef}
        className="absolute h-0 w-0 scale-0"
      />
    </div>
  );
}

export default YoutubeEmbed;
