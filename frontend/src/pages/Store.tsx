import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { SideBar } from "@/components/SideBar";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Button, Input } from "antd";
import { useProduct } from "@/context/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/services/productApi";

const Store = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const {
    products,
    page,
    totalPages,
    totalProducts,
    setPage,
    filters,
    setFilters,
  } = useProduct();

  const { data: categories = [] } = useQuery({
    queryKey: ["productsCategory"],
    queryFn: getCategory,
    staleTime: 5 * 60 * 1000,
  });
  const selectCategories = filters.category ?? "all";
  const minPrice = filters.minPrice ?? 0;
  const maxPrice = filters.maxPrice ?? Infinity;
  const minRating = filters.minRating ?? 0;
  const search = filters.search ?? "";
  const selectedSort =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}-${filters.sortOrder}`
      : "";

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSortOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  // const [selectCategories, setSelectCategories] = useState("all");

  // const [minPrice, setMinPrice] = useState(0);
  // const [maxPrice, setMaxPrice] = useState(Infinity);
  // const [minRating, setMinRating] = useState(0);

  // const [search, setSearch] = useState("");

  // const filteredProducts = useMemo(() => {
  //   return products?.filter((product) => {
  //     const categoryMatch =
  //       selectCategories === "all" || product.category === selectCategories;

  //     const priceMatch = product.price >= minPrice && product.price <= maxPrice;

  //     const ratingMatch = product.rating >= minRating;

  //     const searchMatch = (product.title ?? "")
  //       .toLowerCase()
  //       .includes(search.toLowerCase());

  //     return categoryMatch && priceMatch && ratingMatch && searchMatch;
  //   });
  // }, [products, selectCategories, minPrice, maxPrice, minRating, search]);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const sortByValue = [
    ["price-asc", "Price: Low to High"],
    ["price-desc", "Price: High to Low"],
    ["rating-desc", "Rating: Highest First"],
    ["rating-asc", "Rating: Lowest First"],
    ["stock-asc", "Stock: Lowest First"],
    ["stock-desc", "Stock: Highest First"],
    ["title-asc", "Title: A to Z"],
    ["title-desc", "Title: Z to A"],
  ];
  return (
    <main className="min-h-screen py-2 sm:px-6 lg:px-4">
      <div className="mx-auto">
        <div className="flex w-full justify-between border-b-1 mb-2">
          <div className="">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Computing Gear
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Discover precision-engineered technology designed for modern life.
            </p>
          </div>
          <div className="w-md">
            <div className="relative w-full mb-3">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    search: e.target.value,
                  }))
                }
                className="h-10 border-none bg-slate-50 focus:border-none"
              />
            </div>

            <div className="text-sm text-slate-500 text-right">
              <span className="font-semibold text-slate-900">
                {totalProducts}
              </span>{" "}
              products found
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <SideBar
            categories={categories}
            selectCategories={selectCategories}
            setSelectCategories={(category) =>
              setFilters((current) => ({
                ...current,
                category: category === "all" ? undefined : category,
              }))
            }
            minPrice={minPrice}
            setMinPrice={(minPrice) =>
              setFilters((current) => ({
                ...current,
                minPrice: minPrice > 0 ? minPrice : undefined,
              }))
            }
            maxPrice={maxPrice}
            setMaxPrice={(price) =>
              setFilters((current) => ({
                ...current,
                maxPrice: Number.isFinite(price) ? price : undefined,
              }))
            }
            minRating={minRating}
            setMinRating={(rating) =>
              setFilters((current) => ({
                ...current,
                minRating: rating > 0 ? rating : undefined,
              }))
            }
          />

          <section className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {selectCategories !== "all" && (
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
                    <span className="capitalize">
                      {selectCategories.replaceAll("-", " ")}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setFilters((category) => ({
                          ...category,
                          category: undefined,
                        }))
                      }
                      className="rounded-full text-slate-400 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {minRating > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
                    <span>⭐ {minRating}+</span>

                    <button
                      type="button"
                      onClick={() =>
                        setFilters((minRating) => ({
                          ...minRating,
                          minRating: undefined,
                        }))
                      }
                      className="rounded-full text-slate-400 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {(minPrice > 0 || maxPrice !== Infinity) && (
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
                    <span>
                      ₹{minPrice} -{" "}
                      {maxPrice === Infinity ? "Any" : `₹${maxPrice}`}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          minPrice: undefined,
                          maxPrice: undefined,
                        }))
                      }
                      className="rounded-full text-slate-400 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div ref={sortDropdownRef} className="relative w-full sm:w-56">
                <button
                  type="button"
                  aria-label="Sort products"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  onClick={() => setIsSortOpen((open) => !open)}
                  className={`flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm font-medium shadow-sm outline-none transition focus:ring-2 focus:ring-slate-200 ${
                    isSortOpen
                      ? "border-slate-400"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={
                      selectedSort ? "text-slate-800" : "text-slate-500"
                    }
                  >
                    {selectedSort
                      ? sortByValue.find(([value]) => value === selectedSort)?.[1]
                      : "Sort by"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${
                      isSortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSortOpen && (
                  <div
                    role="listbox"
                    aria-label="Sort products"
                    className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
                  >
                    <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Sort products
                    </p>
                    {sortByValue.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        role="option"
                        aria-selected={selectedSort === value}
                        onClick={() => {
                          const [sortBy, sortOrder] = value.split("-") as [
                            "price" | "rating" | "stock" | "title",
                            "asc" | "desc",
                          ];
                          setFilters((current) => ({
                            ...current,
                            sortBy,
                            sortOrder,
                          }));
                          setPage(1);
                          setIsSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition ${
                          selectedSort === value
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {label}
                        {selectedSort === value && (
                          <Check size={15} className="text-slate-700" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your filters or search term.
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>

              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  type={pageNumber === page ? "primary" : "default"}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Store;
