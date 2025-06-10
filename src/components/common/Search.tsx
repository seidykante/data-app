import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export default function Search({ onSearch, initialValue = "" }: SearchProps) {
  const [searchValue, setSearchValue] = useState(initialValue);

  // Use useEffect to update internal state when initialValue changes from parent
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    onSearch(searchValue.toLowerCase()); // Pass the current value
  };

  const handleClear = () => {
    setSearchValue(""); // Clear internal state
    onSearch(""); // Trigger search with empty value to clear filter
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="relative flex items-center">
      <SearchIcon
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary transition-all outline-none"
        onKeyDown={handleKeyPress}
      />

      <button
        className="ml-1 bg-primary text-white  p-2 rounded-[8px]"
        onClick={() => {
          onSearch(searchValue);
          setSearchValue(""); // Clear the search input after search
        }}
      >
        <SearchIcon className="flex justify-center " />
      </button>
    </div>
  );
}
