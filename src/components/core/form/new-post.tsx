/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom } from "jotai";
import { isModalOpenAtom } from "@/atoms/modalAtoms";
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
import { type Key, useState, useEffect, useCallback, useMemo } from "react";
import spotifyApi from "@/lib/spotifyApi";
import { getToken } from "@/utils/spotify-get-token";
import { tracklistAtom } from "@/atoms/spotify-tracklist-atom";
import User from "../ui/user";
import {
  type TrackSelected,
  trackSelectedAtom,
} from "@/atoms/track-selected-atom";
import { trackSelectedIcon } from "@/components/variants";
import EmbedPlayer from "../ui/embed-player";
import { toLower } from "lodash";

function NewPost() {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);
  const onModalOpenChange = () => setIsModalOpen(!isModalOpen);

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
                placeholder="What's on your mind?"
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
              />
            </div>
            {trackSelected ? (
              <div className="relative">
                <EmbedPlayer track={trackSelected} />
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="absolute -left-2.5 -top-2.5"
                  onPress={() => void setTrackSelected(null)}
                >
                  <Icon icon="ph:minus" className="text-lg" />
                </Button>
              </div>
            ) : (
              <button
                className="flex h-20 w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary-300 font-bold text-primary opacity-70 hover:bg-primary/20"
                onClick={onOpen}
              >
                <Icon icon="ph:plus-bold" className="text-xl" />
                <span>Add Track</span>
              </button>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="font-semibold"
              size="sm"
              onPress={() => void setIsModalOpen(false)}
            >
              Post
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
  const [selectedTab, setSelectedTab] = useState<Key>("spotify");
  const [selectedFilter, setSelectedFilter] = useState<Selection>(
    new Set(["default"])
  );
  const [query, setQuery] = useState<string>("");
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

  return (
    <>
      <div className="sticky -top-2 z-50 mr-2 flex gap-2 bg-content3 p-2 pr-0 dark:bg-content1">
        <SearchBar
          handleSearch={handleSearch}
          onClear={() => setTrackList([])}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="lg" variant="light">
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
            <DropdownItem key="default">By default</DropdownItem>
            <DropdownItem key="track">By track</DropdownItem>
            <DropdownItem key="artist">By artist</DropdownItem>
            <DropdownItem key="album">By album</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Tabs
        aria-label="stream app"
        variant="underlined"
        size="sm"
        color="primary"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
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
          <SearchYoutube term={query} findBy={selectedValue} />
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
  const [trackList, setTrackList] = useAtom(tracklistAtom);
  const [trackSelected, setTrackSelected] = useAtom(trackSelectedAtom);

  const fetchTracks = useCallback(async () => {
    const accessToken = await getToken();
    const param = findBy === "default" ? term : `${findBy}:${term}`;

    try {
      const response = await spotifyApi.searchTracks(param, { limit: 10 });
      setTrackList((oldTrackList: any[]) => [
        ...oldTrackList,
        ...response.tracks.items,
      ]);
      console.log(response.tracks.items);
    } catch (error: any) {
      if (error.status === 401) {
        try {
          spotifyApi.setAccessToken(accessToken);
          const response = await spotifyApi.searchTracks(param, { limit: 10 });
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
  }, [term, findBy, setTrackList]);

  const handleTrackClick = (track: TrackSelected) => {
    setTrackSelected(track);
  };

  useEffect(() => {
    if (term) {
      fetchTracks().catch((err) => console.error(err));
    }
  }, [fetchTracks, term]);
  return (
    <div className="flex flex-col gap-1">
      {trackList?.map((track) => (
        <div
          key={track.id}
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

const SearchYoutube = ({ term, findBy }: { term: string; findBy: string }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000); // Increment every 1000 milliseconds (1 second)

    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures the effect runs once on component mount

  return (
    <div>
      <h1>{term}</h1>
      <h1>Counter: {count}</h1>
    </div>
  );
};

export default NewPost;
