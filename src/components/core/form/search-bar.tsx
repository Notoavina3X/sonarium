import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/react";
import { useCallback, useState } from "react";
import _ from "lodash";

type SearchBarProps = {
  handleSearch: (value: string) => void;
  onClear: () => void;
};

function SearchBar({ handleSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(
    _.debounce((value) => handleSearch(value), 2000),
    [handleSearch]
  );

  const handleChange = (value: string) => {
    setQuery(value);
    debouncedHandleSearch(value);
  };

  return (
    <Input
      placeholder="Search"
      isClearable
      startContent={
        <Icon icon="solar:minimalistic-magnifer-linear" className="text-xl" />
      }
      classNames={{
        innerWrapper: "gap-5",
        inputWrapper: ["shadow-none", "bg-content2/50", "px-5"],
      }}
      size="lg"
      value={query}
      onValueChange={handleChange}
      onClear={() => onClear()}
    />
  );
}

export default SearchBar;
