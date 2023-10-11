import Loader from "@/components/global/Loader";
import { exploreQueryAtom, toQueryAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { toast } from "sonner";

function SearchHistory() {
  const router = useRouter();

  const [exploreQuery, setExploreQuery] = useAtom(exploreQueryAtom);
  const [toQuery, setToQuery] = useAtom(toQueryAtom);

  const histories = api.history.getHistory.useQuery({});

  const trpcUtils = api.useContext();
  const deleteHistory = api.history.delete.useMutation({
    onSuccess: ({ deletedHistory }) => {
      trpcUtils.history.getHistory.setData({}, (oldData) => {
        if (oldData) {
          return oldData.filter(
            (oldHistory) => oldHistory.id !== deletedHistory.id
          );
        }
      });
    },
  });

  const handleClick = (term: string) => {
    setExploreQuery(term);
    setToQuery(term);
    if (router.pathname !== "/explore") {
      router.push("/explore").catch((err) => {
        console.error(err);
        toast.error("Sorry, error while redirecting");
      });
    }
  };

  const handleDelete = (historyId: string) => {
    deleteHistory.mutate({ id: historyId });
  };

  if (!histories?.data) return null;

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-content2 p-4">
      <h1 className="flex items-center gap-2 font-bold">
        <Icon icon="ph:clock-counter-clockwise-fill" className="text-lg" />
        Search history
      </h1>
      <ul className="flex flex-col gap-2">
        {histories.isLoading && (
          <div className="flex w-full justify-center py-4">
            <Loader size="md" color="primary" />
          </div>
        )}
        {histories.data.map(
          (history: {
            id: string;
            term: string;
            userId: string;
            createdAt: Date;
          }) => (
            <li key={history.id} className="flex items-center justify-between">
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => void handleClick(history.term)}
              >
                <Icon icon="solar:minimalistic-magnifer-linear" />
                <span>{history.term}</span>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => void handleDelete(history.id)}
              >
                <Icon icon="ph:x-bold" className="text-lg opacity-70" />
              </Button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default SearchHistory;
