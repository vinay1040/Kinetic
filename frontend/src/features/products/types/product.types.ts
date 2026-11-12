export interface Product {
  id: string;
  title: string;
  mainCategory: string;
  subCategory: string;
  category: string;
  thumbnail: string;
  images: string[];
  price: number | null;
  originalPrice: number | null;
  rating: number | null;
  numberOfRatings: number | null;
  externalUrl: string;
}

export type ProductResponse = Product;

export interface ProductListResponse {
  products: Product[];
  page: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
}

export type ProductCreateRequest = Omit<
  Product,
  "id" | "price" | "rating" | "numberOfRatings"
> & {
  price: number;
  rating: number;
  numberOfRatings: number;
};

export type ProductUpdateRequest = Partial<
  Omit<
    Product,
    "id" | "price" | "originalPrice" | "rating" | "numberOfRatings"
  >
> & {
  price?: number;
  originalPrice?: number;
  rating?: number;
  numberOfRatings?: number;
};

export interface ProductDeleteResponse {
  status: number;
  message: string;
}

export interface ProductUpdateResponse {
  status: number;
  message: string;
  modified: boolean;
}

export type ProductSortBy = "price" | "rating" | "title";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
}
