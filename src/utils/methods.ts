import { env } from "@/env.mjs";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNowStrict } from "date-fns";
import { createClient } from "@supabase/supabase-js";

const pluralRules = new Intl.PluralRules();
export function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const dateFormater = (date: Date) => {
  const result = formatDistanceToNowStrict(date);
  return result;
};

export const getTags = (str: string) => {
  const regex = /#([A-Za-z0-9_]+)\b/g;
  const matches = str.match(regex);

  if (matches) return matches;
  else return [];
};

export const notifMessage = (type: string) => {
  switch (type) {
    case "post":
      return "posted a new post";
    case "like":
      return "liked your post";
    case "comment":
      return "commented on your post";
    case "reply":
      return "replied to your comment";
    case "bookmark":
      return "bookmarked your post";
    case "share":
      return "shared your post";
    case "follow":
      return "started following you";
    default:
      return "system said";
  }
};

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_KEY
);

export async function uploadImg(imageURI: string) {
  let imageUrl = "";
  const image = imageURI;
  const imageName = uuidv4();
  const imageData = image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(imageData, "base64");
  imageUrl = env.NEXT_PUBLIC_IMAGE_SERVER.endsWith("/")
    ? env.NEXT_PUBLIC_IMAGE_SERVER + imageName
    : env.NEXT_PUBLIC_IMAGE_SERVER + "/" + imageName;

  try {
    const { data, error } = await supabase.storage
      .from("cdnsonarium")
      .upload(imageName, imageBuffer, {
        cacheControl: "999999999",
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    console.info("Image uploaded successfully:", data);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
