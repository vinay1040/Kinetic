
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { SideBar } from "@/components/SideBar";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button, Drawer } from "antd";
import { useProduct } from "@/context/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/services/productApi";

const Store = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
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

  const selectCategories = filters.categories ?? [];
  const minPrice = filters.minPrice ?? 0;
  const maxPrice = filters.maxPrice ?? Infinity;
  const minRating = filters.minRating ?? 0;

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
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const sortByValue = [
    ["default", "Default"],
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
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex w-full flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Computing Gear
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Discover precision-engineered technology designed for modern life.
            </p>

            <div className="text-left text-sm text-slate-500">
              <span className="font-semibold text-slate-900">
                {totalProducts}
              </span>{" "}
              products found
            </div>
          </div>

          {/* Filter button and sort dropdown */}
          <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-nowrap">
            <Button
              className="!h-9 !shrink-0"
              onClick={() => setFilterOpen(true)}
              icon={<SlidersHorizontal size={16} />}
            >
              <span className="whitespace-nowrap font-medium text-sm text-slate-600">
                FILTERS
              </span>
            </Button>

            <div ref={sortDropdownRef} className="relative w-full sm:w-56">
              <button
                type="button"
                aria-label="Sort products"
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                onClick={() => setIsSortOpen((open) => !open)}
                className={`flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm font-medium shadow-sm outline-none transition focus:ring-2 focus:ring-slate-200 ${
                  isSortOpen
                    ? "border-slate-400"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className={selectedSort ? "text-slate-800" : "text-slate-500"}
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
                        if (value === "default") {
                          setFilters((current) => ({
                            ...current,
                            sortBy: undefined,
                            sortOrder: undefined,
                          }));
                          setPage(1);
                          setIsSortOpen(false);
                          return;
                        }

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
        </div>

        {/* Drawer is outside the header */}
        
{isFilterOpen && (
  <div
    className="fixed inset-0 z-[1000] bg-black/40"
    onClick={() => setFilterOpen(false)}
  >
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Product filters"
      className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col overflow-y-auto overscroll-contain border-r border-slate-200 bg-white shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Filters
        </h2>

        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setFilterOpen(false)}
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            ×
          </span>
        </button>
      </div>

      <div className="min-h-0 flex-1 px-4">
        <SideBar
          categories={categories}
          selectCategories={selectCategories}
          setSelectCategories={(selected) =>
            setFilters((current) => ({
              ...current,
              categories: selected.length > 0 ? selected : undefined,
            }))
          }
          minPrice={minPrice}
          setMinPrice={(price) =>
            setFilters((current) => ({
              ...current,
              minPrice: price > 0 ? price : undefined,
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
      </div>
    </aside>
  </div>
)}


        {/* Product grid */}
        <div className="mt-6 min-w-0">
          <section className="min-w-0 flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

            <div className="mt-6 overflow-x-auto pb-1">
              <div className="flex w-max min-w-full items-center justify-center gap-2">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
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
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Store;
