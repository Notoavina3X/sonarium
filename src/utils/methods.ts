import { formatDistanceToNowStrict } from "date-fns";

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
