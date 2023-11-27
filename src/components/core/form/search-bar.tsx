import { Icon } from "@iconify/react";
import { Input } from "@nextui-org/react";
import { useCallback, useState, type KeyboardEvent } from "react";
import _ from "lodash";
import { useI18n } from "locales";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  handleSearch: (value: string) => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeydown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  duration?: number;
};

function SearchBar({
  placeholder,
  value,
  handleSearch,
  onClear,
  onFocus,
  onBlur,
  onKeydown,
  duration = 1000,
}: SearchBarProps) {
  const t = useI18n();
  const [query, setQuery] = useState<string>("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearch = useCallback(
    _.debounce((value) => handleSearch(value), duration),
    [handleSearch, duration]
  );

  const handleChange = (value: string) => {
    setQuery(value);
    debouncedHandleSearch(value);
  };

  return (
    <Input
      placeholder={placeholder ?? t("searchbar")}
      isClearable
      startContent={
        <Icon icon="solar:minimalistic-magnifer-linear" className="text-xl" />
      }
      classNames={{
        innerWrapper: "gap-4",
        inputWrapper: ["shadow-none", "bg-content2/50", "px-5", "h-[auto]"],
      }}
      size="lg"
      value={value ?? query}
      onValueChange={handleChange}
      onClear={() => onClear()}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeydown}
    />
  );
}

export default SearchBar;
