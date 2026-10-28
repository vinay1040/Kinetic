import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface FilterCategories {
  categories: string[];
  selectCategories: string;
  setSelectCategories: (category: string) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  alwaysOpen?: boolean;
}

const SectionTitle = ({
  title,
  open,
  onClick,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-between py-3 text-left"
  >
    <span className="text-sm font-semibold text-slate-900">{title}</span>
    <ChevronDown
      size={16}
      className={`text-slate-700 transition-transform ${
        open ? "rotate-180" : ""
      }`}
    />
  </button>
);

export const SideBar = ({
  categories,
  selectCategories,
  setSelectCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  alwaysOpen = false,
}: FilterCategories) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brand: true,
    rating: true,
  });
  const [brandSearch, setBrandSearch] = useState("");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const clearFilters = () => {
    setSelectCategories("all");
    setMinPrice(0);
    setMaxPrice(Infinity);
    setMinRating(0);
  };

  const activeFilters =
    (selectCategories !== "all" ? 1 : 0) +
    (minPrice > 0 || maxPrice !== Infinity ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const brands = ["Logitech", "Razer", "Keychron", "Dell"];
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  return (
    <aside className="my-2 h-fit w-full shrink-0 self-start rounded-xl border border-slate-200 bg-white px-4 md:sticky md:top-24 md:w-64 md:self-start md:rounded-none md:border-0 md:px-0">
      {" "}
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
        className="flex w-full items-center justify-between py-3 md:hidden"
      >
        <span className="text-sm font-semibold text-slate-900">
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </span>
        <ChevronDown size={16} className={mobileOpen ? "rotate-180" : ""} />
      </button>
      <div className={`${mobileOpen || alwaysOpen ? "block" : "hidden"} md:block`}>
        {/* Active filters */}
        <section className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between gap-2 py-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
              Active filters
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-blue-700 hover:text-blue-900"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {selectCategories !== "all" && (
              <button
                type="button"
                onClick={() => setSelectCategories("all")}
                className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-medium text-white"
              >
                <span className="capitalize">
                  {selectCategories.replaceAll("-", " ")}
                </span>
                <X size={12} />
              </button>
            )}

            {(minPrice > 0 || maxPrice !== Infinity) && (
              <button
                type="button"
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(Infinity);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-medium text-white"
              >
                ${minPrice} – {maxPrice === Infinity ? "Any" : `$${maxPrice}`}
                <X size={12} />
              </button>
            )}

            {minRating > 0 && (
              <button
                type="button"
                onClick={() => setMinRating(0)}
                className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-medium text-white"
              >
                {minRating}+ stars
                <X size={12} />
              </button>
            )}

            {activeFilters === 0 && (
              <p className="text-xs text-slate-400">No filters selected</p>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-slate-200 pb-2">
          <SectionTitle
            title="Categories"
            open={openSections.categories}
            onClick={() => toggleSection("categories")}
          />

          {openSections.categories && (
            <div className="space-y-2 pb-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 hover:text-slate-950">
                <input
                  type="radio"
                  name="category"
                  checked={selectCategories === "all"}
                  onChange={() => setSelectCategories("all")}
                  className="size-3.5 accent-blue-600"
                />
                <span>All products</span>
              </label>
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 hover:text-slate-950"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectCategories === category}
                    onChange={() => setSelectCategories(category)}
                    className="size-3.5 accent-blue-600"
                  />
                  <span className="capitalize">
                    {category.replaceAll("-", " ")}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Price range */}
        <section className="border-b border-slate-200 pb-3">
          <SectionTitle
            title="Price Range"
            open={openSections.price}
            onClick={() => toggleSection("price")}
          />

          {openSections.price && (
            <div className="pb-2">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <label className="flex min-w-0 items-center rounded bg-slate-50 px-2">
                  <span className="text-[10px] text-slate-500">$</span>
                  <input
                    type="number"
                    min={0}
                    value={minPrice || ""}
                    onChange={(event) =>
                      setMinPrice(Math.max(0, Number(event.target.value)))
                    }
                    className="w-full min-w-0 bg-transparent py-1.5 text-[11px] outline-none"
                    aria-label="Minimum price amount"
                  />
                </label>

                <span className="text-xs text-slate-400">–</span>

                <label className="flex min-w-0 items-center rounded bg-slate-50 px-2">
                  <span className="text-[10px] text-slate-500">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Any"
                    value={maxPrice === Infinity ? "" : maxPrice}
                    onChange={(event) =>
                      setMaxPrice(
                        event.target.value === ""
                          ? Infinity
                          : Math.max(0, Number(event.target.value)),
                      )
                    }
                    className="w-full min-w-0 bg-transparent py-1.5 text-[11px] outline-none"
                    aria-label="Maximum price amount"
                  />
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Brand: UI prepared for backend integration */}
        <section className="border-b border-slate-200 pb-2">
          <SectionTitle
            title="Brand"
            open={openSections.brand}
            onClick={() => toggleSection("brand")}
          />

          {openSections.brand && (
            <div className="pb-3">
              <div className="relative mb-3">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={brandSearch}
                  onChange={(event) => setBrandSearch(event.target.value)}
                  placeholder="Search brands"
                  className="w-full rounded bg-slate-50 py-1.5 pl-8 pr-2 text-xs outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <span className="size-3.5 rounded-sm border border-slate-300" />
                    <span>{brand}</span>
                  </div>
                ))}
                {filteredBrands.length === 0 && (
                  <p className="text-xs text-slate-400">No brands found</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Rating */}
        <section className="pb-3">
          <SectionTitle
            title="Rating"
            open={openSections.rating}
            onClick={() => toggleSection("rating")}
          />

          {openSections.rating && (
            <div className="pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === 0}
                  onChange={() => setMinRating(0)}
                  className="size-3.5 accent-blue-600"
                />
                <span className="text-blue-600">★★★★★</span>
                <span>& Up</span>
              </label>

              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-600"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                    className="size-3.5 accent-blue-600"
                  />
                  <span className="text-blue-600">
                    {"★".repeat(rating)}
                    <span className="text-slate-300">
                      {"★".repeat(5 - rating)}
                    </span>
                  </span>
                  <span>& Up</span>
                </label>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
};
