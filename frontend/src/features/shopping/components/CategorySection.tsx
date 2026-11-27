import { ArrowUpRight } from "lucide-react";
import { useCategory } from "@/hooks/products/useCategory";
import { useProduct } from "@/features/products/context/ProductContext";

import computing from "@/assets/unnamed.jpg";
import headphones from "@/assets/headphones.png";
import smartHome from "@/assets/smarthome.png";
import smartwatch from "@/assets/watch.png";

const categoryImages = [computing, headphones, smartHome, smartwatch];

export const CategorySection = () => {
  const { data: categories = [], isLoading } = useCategory();
  const { setFilters } = useProduct();

  const handleCategoryClick = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      mainCategories: [category],
      categories: []
    }))
  };

  const categoryItems = categories.map((category) => ({
    name: category.mainCategory,
  }));
  if (isLoading || categoryItems.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
            Explore our collection
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Shop by Category
          </h2>
        </div>

        <span className="text-sm text-slate-500">
          {categoryItems.length} categories
        </span>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {categoryItems.map((category, index) => (
          <button
            key={`${category.name}`}
            type="button"
            onClick={() => handleCategoryClick(category.name)}
            className="group relative h-64 w-48 shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-100 text-left sm:h-72 sm:w-56"
          >
            <img
              src={categoryImages[index % categoryImages.length]}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
              <div>
                <h3 className="text-base font-semibold capitalize">
                  {category.name.replaceAll("-", " ")}
                </h3>

                <p className="mt-2 text-xs text-white/80">Explore collection</p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-white group-hover:text-slate-900">
                <ArrowUpRight size={17} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
