
import heroImg from "../assets/heroImg.png";
import { Input } from "antd";

import { useProduct } from "@/features/products/context/ProductContext";
import { BrowsingView } from "@/features/shopping/components/BrowsingView";
import { DiscoveryView } from "@/features/shopping/components/DiscoveryView";

const Home = () => {
  const { filters } = useProduct();

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.categories?.length) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined;

  return (
    <main className="bg-[#f5f7fc]">
      {hasActiveFilters ? (
        <DiscoveryView />
      ) : (
        <>
          <BrowsingView />

          <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-t-xl bg-[#dce8ff] md:grid-cols-2">
              <div className="flex flex-col justify-center px-8 py-14 md:px-12">
                <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-blue-600">
                  Insider Access
                </p>

                <h2 className="mb-3 text-3xl font-medium tracking-tight">
                  The Architecture of Sound
                </h2>

                <p className="mb-6 max-w-md text-xs leading-5 text-gray-600">
                  Join the Kinetic list for early access to product drops,
                  technical deep dives, and exclusive firmware optimizations
                  for your devices.
                </p>

                <div className="flex max-w-md gap-2">
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="h-11 flex-1 rounded-r-none border border-gray-200 bg-white px-4 text-xs outline-none focus:border-blue-500"
                  />

                  <button className="h-11 rounded-full bg-blue-400 px-4 text-[12px] font-semibold uppercase tracking-wide">
                    Subscribe
                  </button>
                </div>

                <p className="mt-4 text-[8px] text-gray-500">
                  By subscribing, you agree to our Terms & Privacy Policy.
                </p>
              </div>

              <div className="min-h-[300px] overflow-hidden">
                <img
                  src={heroImg}
                  alt="Architecture of Sound"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Home;