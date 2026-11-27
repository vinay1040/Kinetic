import { useProduct } from "@/features/products/context/ProductContext";
import { useCategory } from "@/hooks/products/useCategory";
import { useNavigate } from "react-router";

const CategoryNav = () => {
  const { data: categories = [], isLoading } = useCategory();
  const { filters, setFilters } = useProduct();
  const navigate = useNavigate();
  const selectedCategories = filters.categories ?? [];
  const subCategories = categories.flatMap((c) => c.subCategory);
  const handleCategoryClick = (category?: string) => {
    setFilters({
      ...filters,
      categories: category ? [category] : [],
    });
    navigate("/store");
  };

  if (isLoading) return null;

  return (
    <nav
      aria-label="Product categories"
      className="hidden lg:block"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 overflow-x-auto overflow-y-hidden px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleCategoryClick()}
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
            selectedCategories.length === 0
              ? "bg-primary/10 font-semibold text-primary"
              : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
          }`}
        >
          All Products
        </button>

        {subCategories.map((category) => {
          const isActive = selectedCategories.includes(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm capitalize transition ${
                isActive
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-surface-low hover:text-foreground"
              }`}
            >
              {category.replaceAll("-", " ")}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNav;