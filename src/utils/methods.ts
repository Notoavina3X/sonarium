const pluralRules = new Intl.PluralRules();
export function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const dateFormater = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

export const getTags = (str: string) => {
  const regex = /#([A-Za-z0-9_]+)\b/g;
  const matches = str.match(regex);

  if (matches) return matches;
  else return [];
};
