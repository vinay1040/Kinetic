const BASE_URL = "https://dummyjson.com";
export const categories = [
  "laptops",
  "smartphones",
  "tablets",
  "mobile-accessories",
  "smartwatches",
  "gaming",
  "monitors",
  "computer-accessories",
  "headphones",
  "speakers",
  "cameras",
];

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

export const getData = async (): Promise<Product[] | null> => {
  const requests = categories.map(async (category) => {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category}`);
    }
    const data = await response.json();

    return data.products;
  });
  const results = await Promise.all(requests);

  return results.flat();
};

export const getProductById = async (id: number) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  };

  const data = await response.json();

  return data;
};
