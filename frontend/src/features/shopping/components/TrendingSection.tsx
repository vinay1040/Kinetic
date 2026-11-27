import ProductCard from "@/features/products/components/ProductCard";
import { useProducts } from "@/hooks/products/useProducts";
import { ArrowRight } from "lucide-react";

export const TrendingSection = () => {
  const { data, isLoading, isError } = useProducts(1, 8, {});

  if (isLoading || isError || !data?.products.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 md:px-10">
      <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">
            Trending Hardware
          </h2>
        </div>

        <button className="flex items-center gap-1 text-[10px] text-blue-600">
          View All
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};