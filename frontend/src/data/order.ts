import type { Product } from "@/services/productApi";
import type { Order } from "@/components/account/OrderCard";

const laptop: Product = {
  id: 101,
  title: "Gaming Laptop",
  description: "High performance gaming laptop.",
  category: "laptops",
  price: 74999,
  discountPercentage: 10,
  rating: 4.6,
  stock: 8,
  brand: "Kinetic Tech",
  thumbnail:
    "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-m3/thumbnail.webp",
  images: [],
};

const headphones: Product = {
  id: 102,
  title: "Wireless Headphones",
  description: "Wireless over-ear headphones with noise cancellation.",
  category: "headphones",
  price: 4999,
  discountPercentage: 5,
  rating: 4.5,
  stock: 15,
  brand: "Kinetic Audio",
  thumbnail:
    "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
  images: [],
};

export const orders: Order[] = [
  {
    id: "KIN-1001",
    date: "September 5, 2026",
    status: "Delivered",
    items: [
      {
        product: laptop,
        quantity: 1,
      },
      {
        product: headphones,
        quantity: 2,
      },
    ],
    total: 84997,
  },

  {
    id: "KIN-1002",
    date: "September 2, 2026",
    status: "Processing",
    items: [
      {
        product: headphones,
        quantity: 1,
      },
    ],
    total: 4999,
  },
];