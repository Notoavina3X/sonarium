function SpotifyEmbed({ songId }: { songId: string }) {
  return (
    <div className="h-24 w-full">
      <iframe
        src={`https://open.spotify.com/embed/track/${songId}`}
        width="100%"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        className="h-[83%] rounded-xl"
      ></iframe>
    </div>
  );
}

export default SpotifyEmbed;
