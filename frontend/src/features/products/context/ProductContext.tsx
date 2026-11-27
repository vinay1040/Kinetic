import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
  type SetStateAction,
} from "react";

import { useSearchParams } from "react-router";

import type {
  ProductFilters,
  ProductSortBy,
  SortOrder,
} from "../types/product.types";

type SetProductFilters = (
  action: SetStateAction<ProductFilters>,
  options?: {
    replace?: boolean;
  },
) => void;

type ProductContextType = {
  filters: ProductFilters;
  setFilters: SetProductFilters;
};

const ProductContext = createContext<ProductContextType | null>(null);

const FILTER_QUERY_KEYS = [
  "search",
  "categories",
  "mainCategories",
  "minPrice",
  "maxPrice",
  "minRating",
  "sortBy",
  "sortOrder",
];

const parseNumber = (value: string | null): number | undefined => {
  if (value === null || value.trim() === "") return undefined;

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
};

const parseFilters = (params: URLSearchParams): ProductFilters => {
  const filters: ProductFilters = {};

  const search = params.get("search");

  if (search?.trim()) {
    filters.search = search;
  }

  const categories = params.getAll("categories");

  if (categories.length > 0) {
    filters.categories = categories;
  }
  const mainCategories = params.getAll("mainCategories");
  if (mainCategories.length > 0) {
    filters.mainCategories = mainCategories;
  }
  const minPrice = parseNumber(params.get("minPrice"));

  if (minPrice !== undefined) {
    filters.minPrice = minPrice;
  }

  const maxPrice = parseNumber(params.get("maxPrice"));

  if (maxPrice !== undefined) {
    filters.maxPrice = maxPrice;
  }

  const minRating = parseNumber(params.get("minRating"));

  if (minRating !== undefined && minRating > 0) {
    filters.minRating = minRating;
  }

  const sortBy = params.get("sortBy");

  if (sortBy === "price" || sortBy === "rating" || sortBy === "title") {
    filters.sortBy = sortBy as ProductSortBy;
  }

  const sortOrder = params.get("sortOrder");

  if (sortOrder === "asc" || sortOrder === "desc") {
    filters.sortOrder = sortOrder as SortOrder;
  }

  return filters;
};

const updateSearchParams = (
  currentParams: URLSearchParams,
  filters: ProductFilters,
): URLSearchParams => {
  const params = new URLSearchParams(currentParams);

  FILTER_QUERY_KEYS.forEach((key) => params.delete(key));

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  filters.categories?.forEach((category) => {
    params.append("categories", category);
  });
  filters.mainCategories?.forEach((category) => {
    params.append("mainCategories", category);
  });
  if (filters.minPrice !== undefined && Number.isFinite(filters.minPrice)) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined && Number.isFinite(filters.maxPrice)) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (
    filters.minRating !== undefined &&
    Number.isFinite(filters.minRating) &&
    filters.minRating > 0
  ) {
    params.set("minRating", String(filters.minRating));
  }

  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }

  return params;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilters = useCallback<SetProductFilters>(
    (action, options) => {
      setSearchParams(
        (currentParams) => {
          const currentFilters = parseFilters(currentParams);

          const nextFilters =
            typeof action === "function" ? action(currentFilters) : action;

          return updateSearchParams(currentParams, nextFilters);
        },
        {
          replace: options?.replace ?? false,
        },
      );
    },
    [setSearchParams],
  );

  return (
    <ProductContext.Provider value={{ filters, setFilters }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (context === null) {
    throw new Error("useProduct must be used inside ProductProvider");
  }

  return context;
};
