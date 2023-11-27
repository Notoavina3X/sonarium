import { exploreQueryAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";

export function SearchHistory() {
  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);

  const { data: histories } = api.history.getHistory.useQuery({
    term: exploreQuery,
  });
  return (
    <div className="absolute top-14 z-40 flex w-full flex-col gap-3 rounded-xl bg-content2 p-4">
      <h1 className="text-sm font-bold">Search history</h1>
      <ul>
        <li>
          <Icon icon="solar:minimalistic-magnifer-linear" className="text-lg" />{" "}
          #marley
        </li>
        <li>
          <Icon icon="solar:minimalistic-magnifer-linear" className="text-lg" />{" "}
          #fyp
        </li>
        <li>
          <Icon icon="solar:minimalistic-magnifer-linear" className="text-lg" />{" "}
          Lahatra
        </li>
      </ul>
    </div>
  );
}
