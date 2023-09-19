/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env.mjs";
import { getToken } from "@/utils/spotify-get-token";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();
// spotifyApi.setAccessToken(env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN);

getToken()
  .then((token) => {
    // const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
  })
  .catch((err) => console.error(err));

export default spotifyApi;
