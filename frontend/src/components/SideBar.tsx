import { useState } from "react";
import { RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button, Collapse, Dropdown, Input, Radio } from "antd";

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
}

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
}: FilterCategories) => {
  const [isOpen, setIsOpen] = useState(false);

  const clearFilters = () => {
    setSelectCategories("all");
    setMinPrice(0);
    setMaxPrice(Infinity);
    setMinRating(0);
  };

  return (
    <aside className="my-4 h-fit w-full shrink-0 overflow-hidden bg-white md:sticky md:top-20 md:w-70">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 py-2">
        <Button
          type="text"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 md:cursor-default"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal size={16} />
          </span>

          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          <ChevronDown
            size={18}
            className={`ml-1 transition-transform md:hidden ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        <Button
          type="text"
          size="small"
          onClick={clearFilters}
          className="text-slate-500 hover:text-primary"
        >
          <RotateCcw size={14} />
          Clear
        </Button>
      </div>
      <div
        className={`
          ${isOpen ? "block" : "hidden"}
          md:block
        `}
      >
        <div className="max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className=" p-2">
            <section>
              <div className="space-y-1">
                {/* All Products */}
                <Collapse
                  ghost
                  defaultActiveKey={["categories"]}
                  items={[
                    {
                      key: "categories",
                      label: (
                        <h3 className="text-sm font-semibold text-slate-900">
                          Categories
                        </h3>
                      ),
                      children: (
                        <div>
                          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">
                            <input
                              type="radio"
                              name="category"
                              checked={selectCategories === "all"}
                              onChange={() => setSelectCategories("all")}
                              className="size-4 accent-primary"
                            />

                            <span>All Products</span>
                          </label>
                          {/* Categories */}
                          {categories.map((category) => (
                            <label
                              key={category}
                              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm capitalize text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                              <Radio
                                type="radio"
                                name="category"
                                checked={selectCategories === category}
                                onChange={() => setSelectCategories(category)}
                                className="size-4 accent-primary"
                              />

                              <span>{category.replaceAll("-", " ")}</span>
                            </label>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                ></Collapse>
              </div>
            </section>

            {/* Price */}
            <section className="border-t border-slate-100 pt-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Price range
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min="0"
                  placeholder="$0"
                  value={minPrice || ""}
                  className="bg-slate-50"
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />

                <Input
                  type="number"
                  min="0"
                  placeholder="Any"
                  className="bg-slate-50"
                  value={maxPrice === Infinity ? "" : maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? Infinity : Number(e.target.value),
                    )
                  }
                />
              </div>
            </section>

            <section className="border-t border-slate-100 pt-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Customer rating
              </h3>

              <div className="space-y-1">
                {[4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="size-4 accent-primary"
                    />

                    <span>⭐ {rating}+ & above</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
};
