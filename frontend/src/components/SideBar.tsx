import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { Category } from "@/features/products/types/product.types";

interface FilterCategories {
  categories: Category[];
  selectCategories: string[];
  setSelectCategories: (categories: string[]) => void;
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
    rating: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const clearFilters = () => {
    setSelectCategories([]);
    setMinPrice(0);
    setMaxPrice(Infinity);
    setMinRating(0);
  };

  const activeFilters =
    selectCategories.length +
    (minPrice > 0 || maxPrice !== Infinity ? 1 : 0) +
    (minRating > 0 ? 1 : 0);
  return (
    <aside className="my-2 h-fit w-full shrink-0 self-start rounded-xl border border-slate-200 bg-white md:sticky md:top-24 md:w-full md:self-start md:rounded-none md:border-0 md:px-0">
      {!alwaysOpen && (
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
      )}
      <div
        className={`${mobileOpen || alwaysOpen ? "block" : "hidden"} md:block`}
      >
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
            {selectCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectCategories(
                    selectCategories.filter((item) => item !== category),
                  )
                }
                className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-medium text-white"
              >
                <span className="capitalize">
                  {category.replaceAll("-", " ")}
                </span>
                <X size={12} />
              </button>
            ))}

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
            <div className="space-y-3 pb-3">
              {categories.map((category) => (
                <div key={category.mainCategory}>
                  <h3 className="mb-2 text-xs font-semibold text-slate-800">
                    {category.mainCategory}
                  </h3>

                  <div className="ml-2 space-y-2">
                    {category.subCategory.map((subCategory) => (
                      <label
                        key={subCategory}
                        className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 hover:text-slate-950"
                      >
                        <input
                          type="checkbox"
                          checked={selectCategories.includes(subCategory)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectCategories([
                                ...selectCategories,
                                subCategory,
                              ]);
                            } else {
                              setSelectCategories(
                                selectCategories.filter(
                                  (item) => item !== subCategory,
                                ),
                              );
                            }
                          }}
                          className="size-3.5 accent-blue-600"
                        />

                        <span>{subCategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
