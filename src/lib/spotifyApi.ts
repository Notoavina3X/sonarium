import { getToken } from "@/utils/spotify-get-token";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

getToken()
  .then((token: string) => {
    spotifyApi.setAccessToken(token);
  })
  .catch((err) => console.error(err));

export default spotifyApi;
