import { env } from "@/env.mjs";

const headers = new Headers();
headers.append(
  "Authorization",
  "Basic " +
    btoa(
      env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
        ":" +
        env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
    )
);
headers.append("Content-Type", "application/x-www-form-urlencoded");

const body = new URLSearchParams();
body.append("grant_type", "client_credentials");

export const getToken = async () => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
  }
};
