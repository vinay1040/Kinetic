import ProductCard from "@/components/products/ProductCard";
import { SideBar } from "@/components/SideBar";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button, Input } from "antd";
import { useProduct } from "@/context/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/services/productApi";

const Store = () => {
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

  return (
    <main className="min-h-screen  py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6  p-6 ">
          <p className="mb-1 text-xs font-semibold tracking-wider text-primary">
            LUMIÈRE TECH
          </p>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Computing Gear
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Discover precision-engineered technology designed for modern life.
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-4  p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
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
              className="h-10 bg-slate-50 pl-9"
            />
          </div>

          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {totalProducts}
            </span>{" "}
            products found
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
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

              <Button type="default" className="gap-2 bg-white">
                <SlidersHorizontal size={16} />
                Sort
              </Button>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-2  sm:grid-cols-2 xl:grid-cols-4">
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
