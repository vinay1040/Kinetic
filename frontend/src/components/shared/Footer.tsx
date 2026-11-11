import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { title: "Support", links: ["Help Center", "Shipping & Returns", "Contact"] },
  { title: "Company", links: ["About", "Journal", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms", "Accessibility"] },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.8fr_repeat(3,1fr)] md:px-10">
        <div className="max-w-xs">
          <a href="#top" className="text-lg font-semibold tracking-tight text-slate-950">
            Kinetic<span className="text-blue-600">.</span>
          </a>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Precision-engineered electronics for the modern era.
          </p>
          <a href="mailto:hello@kinetic.example" className="mt-5 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            hello@kinetic.example <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title}>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">{group.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-500 transition hover:text-blue-600">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <p>© {new Date().getFullYear()} Kinetic, Inc.</p>
          <p>Designed for the curious.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
