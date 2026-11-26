
import { useProduct } from "@/features/products/context/ProductContext";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";

const SearchInput = () => {
  const { filters, setFilters } = useProduct();
  const navigate = useNavigate();

  const search = filters.search ?? "";

  const updateSearch = (value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));
  };

  const handleSearch = () => {
    navigate("/store");
  };

  return (
    <label className="flex h-11 min-w-0 w-full max-w-105 items-center gap-3 rounded-full border border-border bg-surface-low px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
      <Search
        size={19}
        className="shrink-0 text-muted-foreground"
        aria-hidden="true"
      />

      <input
        type="search"
        placeholder="Search products..."
        aria-label="Search products"
        value={search}
        onChange={(event) => updateSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
};

export default SearchInput;
