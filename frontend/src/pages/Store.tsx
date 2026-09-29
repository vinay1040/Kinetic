import ProductCard from "@/components/products/ProductCard";
import { SideBar } from "@/components/SideBar";
import { categories } from "@/services/productApi";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {  useMemo, useState } from "react";
import { Button, Input } from "antd";
import { useProduct } from "@/context/ProductContext";

const Store = () => {
  const {products} = useProduct();
  const [selectCategories, setSelectCategories] = useState("all");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minRating, setMinRating] = useState(0);

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const categoryMatch =
        selectCategories === "all" || product.category === selectCategories;

      const priceMatch = product.price >= minPrice && product.price <= maxPrice;

      const ratingMatch = product.rating >= minRating;

      const searchMatch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatch && priceMatch && ratingMatch && searchMatch;
    });
  }, [products, selectCategories, minPrice, maxPrice, minRating, search]);

  return (
    <main className="min-h-screen  px-4 py-6 sm:px-6 lg:px-8">
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
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 bg-slate-50 pl-9"
            />
          </div>

          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {filteredProducts?.length ?? 0}
            </span>{" "}
            products found
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <SideBar
            categories={categories}
            selectCategories={selectCategories}
            setSelectCategories={setSelectCategories}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
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
                      onClick={() => setSelectCategories("all")}
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
                      onClick={() => setMinRating(0)}
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
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(Infinity);
                      }}
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

            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-2  sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
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
          </section>
        </div>
      </div>
    </main>
  );
};

export default Store;
