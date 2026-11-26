import { ArrowRight } from "lucide-react";
import unnamed from "@/assets/unnamed.jpg";
import headphones from "@/assets/headphones.png";
import smartHome from "@/assets/smarthome.png";
import smartwatch from "@/assets/watch.png";
export const CategorySection = () => {
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
  return (
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
  );
};
