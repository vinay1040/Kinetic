import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/heroImg.png"
export const HeroSection = () => {
  return (
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
  );
};
