import ProductCard from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types/product.types";
import { getData } from "@/Services/productApi";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export const TrendingSection = () => {
  const [randomProducts, setRandomProducts] = useState<Product[] | null>();
  useEffect(() => {
    const loadData = async () => {
      const data = await getData(1, 12);
      if (data) {
        const random = [...data.products]
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);
        setRandomProducts(random);
      }
    };
    loadData();
  }, []);
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
        {randomProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
