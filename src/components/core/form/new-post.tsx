/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom } from "jotai";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  type Selection,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  cn,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import SearchBar from "./search-bar";
import {
  type Key,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from "react";
import spotifyApi from "@/lib/spotifyApi";
import { getToken } from "@/utils/spotify-get-token";
import User from "../ui/user";
import {
  isModalOpenAtom,
  type TrackSelected,
  trackSelectedAtom,
  tracklistAtom,
} from "@/store";
import { trackSelectedIcon } from "@/components/variants";
import EmbedPlayer from "../ui/embed-player";
import { toLower } from "lodash";
import { api } from "@/utils/api";
import { toast } from "sonner";
import EmptyResult from "@/components/global/empty-result";
import { getTags } from "@/utils/methods";
import { useI18n, useScopedI18n } from "locales";

function NewPost() {
  const t = useI18n();
  const scopedT = useScopedI18n("newpost");

  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);
  const [tracklist, setTracklist] = useAtom(tracklistAtom);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<Array<string>>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onModalOpenChange = () => setIsModalOpen(!isModalOpen);

  const trpcUtils = api.useContext();
  const notify = api.notification.create.useMutation({
    onSuccess: ({ notifications }) => {
      console.log(notifications);
    },
  });
  const createPost = api.post.create.useMutation({
    onSuccess: ({ newPost }) => {
      setIsModalOpen(false);
      setTrackSelected(null);
      toast.success(t("success.posting"));
      notify.mutate({
        text: newPost.description,
        content: { id: newPost.id, type: "post", postId: newPost.id },
      });
      if (newPost) {
        const updateData: Parameters<
          typeof trpcUtils.post.infiniteFeed.setInfiniteData
        >[1] = (oldData) => {
          if (oldData?.pages[0] == null) return;

          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                posts: [newPost, ...oldData.pages[0].posts],
              },
              ...oldData.pages.slice(1),
            ],
          };
        };

        trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
        trpcUtils.post.infiniteProfileFeed.setInfiniteData(
          { userId: newPost.user.id },
          updateData
        );
      }
    },
    onError: () => {
      toast.error(t("error.posting"));
    },
  });

  const handleSubmit = () => {
    createPost.mutate({ description, track: trackSelected, tags });
  };

  const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (description?.length == 0) {
        e.preventDefault();
      } else if (
        !e.shiftKey &&
        description?.length &&
        description?.length > 0
      ) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (description && description?.length > 0) {
      setTags(getTags(description));
    } else {
      setTags([]);
    }
  }, [description]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        placement="auto"
        size="lg"
        classNames={{ base: "bg-content3 dark:bg-content1" }}
      >
        <ModalContent>
          <ModalBody>
            <div className="mt-2 grid grid-cols-[40px_auto] items-start gap-2">
              <Avatar
                size="md"
                radius="md"
                name={user?.name ?? undefined}
                src={user?.image ?? undefined}
                className="mt-2"
              />
              <Textarea
                minRows={2}
                placeholder={scopedT("view.textarea")}
                size="lg"
                radius="none"
                classNames={{
                  inputWrapper: [
                    "bg-transparent",
                    "data-[hover=true]:bg-transparent",
                    "group-data-[focus-visible=true]:ring-0",
                    "group-data-[focus=true]:bg-transparent",
                    "outline-none",
                    "shadow-none",
                  ],
                  input: "text-xl",
                }}
                value={description}
                onValueChange={setDescription}
                onKeyDown={handleKeyEvent}
              />
            </div>
            {trackSelected ? (
              <div className="relative">
                <EmbedPlayer track={trackSelected} />
                <Button
                  isIconOnly
                  size="sm"
                  className="absolute -left-3 -top-3 z-40"
                  onPress={() => void setTrackSelected(null)}
                >
                  <Icon icon="ph:minus" />
                </Button>
              </div>
            ) : (
              <button
                className="flex h-20 w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary-300 font-bold text-primary opacity-70 hover:bg-primary/20"
                onClick={() => {
                  onOpen();
                  setTracklist([]);
                }}
              >
                <Icon icon="ph:plus-bold" className="text-xl" />
                <span>{scopedT("view.add")}</span>
              </button>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="font-semibold"
              size="sm"
              onPress={() => void handleSubmit()}
              isLoading={createPost.isLoading}
            >
              {scopedT("view.post")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        size="lg"
        classNames={{
          base: "bg-content3 dark:bg-content1",
          closeButton: "data-[focus-visible=true]:z-[60] z-[60]",
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="gap-2">
                <AddTrack />
              </ModalBody>
              <ModalFooter>
                {trackSelected && (
                  <div className="flex w-full items-center justify-between rounded-lg bg-background p-2 px-4">
                    <div className="grid grow grid-cols-[40px_auto] gap-2">
                      <Icon
                        icon={`simple-icons:${trackSelected.source}`}
                        className={trackSelectedIcon({
                          color: trackSelected.source,
                        })}
                      />
                      <div className="flex h-full flex-col justify-center overflow-hidden">
                        <span className="flex-none truncate text-sm font-bold">
                          {trackSelected.title}
                        </span>
                        <span className="flex-none truncate text-xs opacity-70">
                          {trackSelected.author}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="light"
                      color="primary"
                      className="font-semibold"
                      size="sm"
                      onPress={onClose}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const AddTrack = () => {
  const scopedT = useScopedI18n("newpost.track");

  const [selectedTab, setSelectedTab] = useState<Key>("spotify");
  const [selectedFilter, setSelectedFilter] = useState<Selection>(
    new Set(["default"])
  );
  const [query, setQuery] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string | undefined>(undefined);

  const [trackList, setTrackList] = useAtom(tracklistAtom);

  const selectedValue = useMemo(
    () => Array.from(selectedFilter).join(", "),
    [selectedFilter]
  );

  const handleSearch = (term: string) => {
    setQuery(term);
    setTrackList([]);
  };

  const handleSelectionChange = (value: Selection) => {
    setSelectedFilter(value);
    setTrackList([]);
  };

  const handleTabChange = (key: Key) => {
    setSelectedTab(key);
    setTrackList([]);
  };

  useEffect(() => {
    if (selectedTab === "spotify")
      setPlaceholder(() => {
        switch (selectedValue) {
          case "default":
            return `${scopedT("placeholder.spotify")} ${scopedT("by.default")}`;
          case "artist":
            return `${scopedT("placeholder.spotify")} ${scopedT("by.artist")}`;
          case "album":
            return `${scopedT("placeholder.spotify")} ${scopedT("by.album")}`;
          case "track":
            return `${scopedT("placeholder.spotify")} ${scopedT("by.track")}`;
          default:
            return undefined;
        }
      });
    else setPlaceholder(`${scopedT("placeholder.youtube")} YouTube`);
  }, [selectedTab, selectedValue, scopedT]);

  return (
    <>
      <div className="sticky -top-2 z-50 mr-2 flex gap-2 bg-content3 p-2 pr-0 dark:bg-content1">
        <SearchBar
          placeholder={placeholder}
          handleSearch={handleSearch}
          onClear={() => setTrackList([])}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              size="lg"
              variant="light"
              isDisabled={selectedTab === "youtube"}
            >
              <Icon icon="solar:tuning-2-linear" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="find by"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedFilter}
            onSelectionChange={(value) => handleSelectionChange(value)}
          >
            <DropdownItem
              key="default"
              startContent={
                <Icon
                  icon="solar:archive-minimalistic-linear"
                  className="text-lg"
                />
              }
            >
              {scopedT("by.prepos")} {scopedT("by.default")}
            </DropdownItem>
            <DropdownItem
              key="track"
              startContent={
                <Icon icon="iconamoon:music-1-light" className="text-lg" />
              }
            >
              {scopedT("by.prepos")} {scopedT("by.track")}
            </DropdownItem>
            <DropdownItem
              key="artist"
              startContent={
                <Icon icon="iconamoon:music-artist-light" className="text-lg" />
              }
            >
              {scopedT("by.prepos")} {scopedT("by.artist")}
            </DropdownItem>
            <DropdownItem
              key="album"
              startContent={
                <Icon icon="iconamoon:music-album-light" className="text-lg" />
              }
            >
              {scopedT("by.prepos")} {scopedT("by.album")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Tabs
        aria-label="stream app"
        variant="underlined"
        size="sm"
        color="primary"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        classNames={{
          base: ["sticky", "top-12", "z-50", "bg-content3 dark:bg-content1"],
        }}
      >
        <Tab
          key="spotify"
          title={
            <div className="top- flex items-center gap-1">
              <Icon icon="simple-icons:spotify" />
              <span>Spotify</span>
            </div>
          }
          className="font-semibold"
        >
          <SearchSpotify term={query} findBy={selectedValue} />
        </Tab>
        <Tab
          key="youtube"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="simple-icons:youtube" />
              <span>YouTube</span>
            </div>
          }
          className="font-semibold"
        >
          <SearchYoutube term={query} />
        </Tab>
      </Tabs>
    </>
  );
};

type SearchSpotifyProps = {
  term: string;
  findBy: string;
};
const SearchSpotify = ({ term, findBy }: SearchSpotifyProps) => {
  const scopedT = useScopedI18n("newpost.track");

  const [trackList, setTrackList] = useAtom(tracklistAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);

  const fetchTracks = useCallback(
    async (query: string) => {
      const accessToken = await getToken();
      const param = findBy === "default" ? query : `${findBy}:${query}`;

      try {
        const response = await spotifyApi.searchTracks(param, { limit: 10 });
        setTrackList((oldTrackList: any[]) => [
          ...oldTrackList,
          ...response.tracks.items,
        ]);
      } catch (error: any) {
        if (error.status === 401) {
          try {
            spotifyApi.setAccessToken(accessToken);
            const response = await spotifyApi.searchTracks(param, {
              limit: 10,
            });
            setTrackList((oldTrackList: any[]) => [
              ...oldTrackList,
              ...response.tracks.items,
            ]);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error(error);
        }
      }
    },
    [findBy, setTrackList]
  );

  const handleTrackClick = (track: TrackSelected) => {
    setTrackSelected(track);
  };

  useEffect(() => {
    if (term) {
      fetchTracks(term).catch((err) => console.error(err));
    }
  }, [fetchTracks, term]);

  if (!term || trackList.length === 0)
    return (
      <div className="mx-auto flex flex-col items-center gap-1 opacity-60">
        <div className="w-36">
          <EmptyResult />
        </div>
        <span className="font-bold">
          {!term ? scopedT("need") : scopedT("noresult")}
        </span>
      </div>
    );

  return (
    <div className="flex flex-col gap-1">
      {trackList
        ?.filter((track) => track.album)
        .map((track) => (
          <div
            key={track.id + track.name}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md  p-2",
              trackSelected?.id == track.id
                ? "bg-primary/30"
                : "bg-default/20 hover:bg-default/50"
            )}
            onClick={() =>
              handleTrackClick({
                id: track.id,
                image: track.album.images[2].url,
                title: track.name,
                titleLowercase: toLower(track.name),
                authorId: track.artists[0].id,
                author: track.artists[0].name,
                url: track.href,
                source: "spotify",
              })
            }
          >
            <User
              name={track.name}
              description={track.artists[0].name}
              isLinked={false}
              avatarProps={{ src: track.album.images[2].url }}
              size="md"
              radius="full"
            />
            <Icon
              icon={`solar:${
                trackSelected?.id == track.id
                  ? "check-circle-linear"
                  : "alt-arrow-right-linear"
              }`}
              className="text-lg"
            />
          </div>
        ))}
    </div>
  );
};

const SearchYoutube = ({ term }: { term: string }) => {
  const scopedT = useScopedI18n("newpost.track");

  const [trackList, setTrackList] = useAtom(tracklistAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);

  const fetchTracks = useCallback(async () => {
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${term}&type=video&videoCategoryId=10&videoEmbeddable=true&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setTrackList((oldTrackList) => [...oldTrackList, ...data.items]);
    } catch (error) {
      console.error(error);
    }
  }, [term, setTrackList]);

  const handleTrackClick = (track: TrackSelected) => {
    setTrackSelected(track);
  };

  useEffect(() => {
    if (term) {
      fetchTracks().catch((err) => console.error(err));
    }
  }, [fetchTracks, term]);

  if (!term || trackList.length === 0)
    return (
      <div className="mx-auto flex flex-col items-center gap-1 opacity-60">
        <div className="w-36">
          <EmptyResult />
        </div>
        <span className="font-bold">
          {!term ? scopedT("need") : scopedT("noresult")}
        </span>
      </div>
    );

  return (
    <div className="flex flex-col gap-1">
      {trackList
        ?.filter((track) => track.snippet)
        .map((track, index) => (
          <div
            key={index}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md  p-2",
              trackSelected?.id == track.id.videoId
                ? "bg-primary/30"
                : "bg-default/20 hover:bg-default/50"
            )}
            onClick={() =>
              handleTrackClick({
                id: track.id.videoId,
                image: track.snippet.thumbnails.default.url,
                title: track.snippet.title,
                titleLowercase: toLower(track.snippet.title),
                authorId: track.snippet.channelId,
                author: track.snippet.channelTitle,
                url: `https://youtube.com/watch?v=${track.id.videoId}`,
                source: "youtube",
              })
            }
          >
            <User
              name={track.snippet.title}
              description={track.snippet.channelTitle}
              isLinked={false}
              avatarProps={{ src: track.snippet.thumbnails.default.url }}
              size="md"
              radius="full"
            />
            <Icon
              icon={`solar:${
                trackSelected?.id == track.id.videoId
                  ? "check-circle-linear"
                  : "alt-arrow-right-linear"
              }`}
              className="text-lg"
            />
          </div>
        ))}
    </div>
  );
};

export default NewPost;
