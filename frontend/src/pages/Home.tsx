import { ArrowRight } from "lucide-react";
import type { Product } from "@/services/productApi";
import heroImg from "../assets/heroImg.png";
import unnamed from "../assets/unnamed.jpg";
import headphones from "../assets/headphones.png";
import smartHome from "../assets/smarthome.png";
import smartwatch from "../assets/watch.png";
import { useEffect, useState } from "react";

import { getData } from "@/services/productApi";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "antd";
const categories = [
  {
    title: "Performance Computing",
    description: "Workstations built for the most demanding tasks.",
    image: unnamed,
    className: "md:col-span-2",
  },
  {
    title: "High-Fidelity Audio",
    description: "Immersive soundscapes.",
    image: headphones,
    className: "",
  },
  {
    title: "Smart Home",
    description: "Intelligent living.",
    image: smartHome,
    className: "",
  },
  {
    title: "Advanced Wearables",
    description: "Precision on your wrist.",
    image: smartwatch,
    className: "md:col-span-2",
  },
];

const Home = () => {
  const [randomProducts, setRandomProducts] = useState<Product[] | null>();
  useEffect(() => {
    const loadData = async () => {
      const data = await getData();
      if (data) {
        const random = [...data].sort(() => Math.random() - 0.5).slice(0, 8);
        setRandomProducts(random);
      }
    };
    loadData();
  }, []);
  return (
    <main className="bg-[#f5f7fc]">
      <section className="relative h-[520px] overflow-hidden">
        <img
          src={heroImg}
          alt="Obsidian Series"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 md:px-10">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em]">
              Introducing
            </p>

            <h1 className="mb-3 text-4xl font-semibold tracking-tight md:text-5xl">
              The Obsidian Series
            </h1>

            <p className="mb-7 max-w-md text-sm leading-6 text-gray-200">
              Engineered for absolute silence. Crafted for infinite power.
              Discover the next evolution in premium desktop computing and
              architectural audio.
            </p>

            <div className="flex items-center gap-4">
              <button className="rounded-full bg-blue-600 px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-white transition hover:bg-blue-700">
                Explore Series
              </button>

              <button className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide">
                Watch Film
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="mb-7">
          <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-gray-500">
            Collections
          </p>

          <h2 className="text-2xl font-medium tracking-tight">
            Curated Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`group relative h-[290px] overflow-hidden rounded-lg ${category.className}`}
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                <div>
                  <h3 className="mb-1 text-sm font-medium">{category.title}</h3>

                  <p className="text-[10px] text-gray-200">
                    {category.description}
                  </p>
                </div>

                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-white group-hover:text-black">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-t-xl bg-[#dce8ff] md:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col justify-center px-8 py-14 md:px-12">
            <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-blue-600">
              Insider Access
            </p>

            <h2 className="mb-3 text-3xl font-medium tracking-tight">
              The Architecture of Sound
            </h2>

            <p className="mb-6 max-w-md text-xs leading-5 text-gray-600">
              Join the Kinetic list for early access to product drops, technical
              deep dives, and exclusive firmware optimizations for your devices.
            </p>

            <div className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Email address"
                className="h-11 flex-1 rounded-r-none border border-gray-200 bg-white px-4 text-xs outline-none focus:border-blue-500"
              />

              <button className="h-11 bg-blue-400 rounded-full px-4 text-[12px] font-semibold uppercase tracking-wide">
                Subscribe
              </button>
            </div>

            <p className="mt-4 text-[8px] text-gray-500">
              By subscribing, you agree to our Terms & Privacy Policy.
            </p>
          </div>

          {/* Right image */}
          <div className="min-h-[300px] overflow-hidden">
            <img
              src={heroImg}
              alt="Architecture of Sound"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
