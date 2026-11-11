
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

export interface ProductResponse {
  products: Product[];
  page: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
}

export type ProductCreateRequest = Omit<Product, "id">;

export interface ProductDeleteResponse {
  status: number;
  message: string;
}

export type ProductUpdateRequest = Partial<
  Pick<
    Product,
    | "title"
    | "mainCategory"
    | "subCategory"
    | "category"
    | "thumbnail"
    | "images"
    | "price"
    | "originalPrice"
    | "rating"
    | "numberOfRatings"
    | "externalUrl"
  >
>;

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
