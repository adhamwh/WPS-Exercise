import { useEffect, useState } from "react";
import { getHomepage } from "./api/homepage";
import type { HomepageResponse } from "./types/homepage";
import "./index.css";

function App() {
  const [data, setData] = useState<HomepageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHomepage()
      .then((response) => {
        setData(response);
      })
      .catch(() => {
        setError("Could not load homepage data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen p-10">Loading...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen p-10 text-red-600">{error}</div>;
  }

  const hero = data.sections.hero;
  const about = data.sections.about;
  const contact = data.sections.contact;

  return (
    <main className="page-shell min-h-screen text-white">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold">BIO CWT</div>

        <nav className="hidden gap-8 md:flex">
          <a href="#wood-types">Wood types</a>
          <a href="#work">Our work</a>
          <a href="#advantages">Advantages</a>
          <a href="#about">About us</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="grid min-h-[520px] items-center px-8 py-16 md:grid-cols-2 md:px-16">
        <div>
          <p className="mb-4 text-lg">{hero?.subtitle}</p>
          <h1 className="max-w-xl text-5xl font-bold leading-tight md:text-7xl">
            {hero?.title}
          </h1>
          <p className="mt-5 text-2xl">{hero?.description}</p>

          <a
            href={hero?.button_url || "#contact"}
            className="mt-8 inline-block rounded-full bg-[#8b5e34] px-8 py-3 font-semibold text-white"
          >
            {hero?.button_text || "Order"}
          </a>
        </div>

        <div className="mt-10 rounded-[40px] bg-[#d7b98f] p-10 text-center md:mt-0">
          <div className="text-8xl">🪵</div>
          <p className="mt-4 text-lg">Hero image placeholder</p>
        </div>
      </section>

      <section id="wood-types" className="px-8 py-16 md:px-16">
        <h2 className="mb-8 text-4xl font-bold">WOOD TYPES</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {data.wood_types.map((wood) => (
            <article key={wood.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 rounded-2xl bg-[#ead8c0] p-8 text-center text-5xl">
                🪵
              </div>

              <h3 className="text-2xl font-bold">{wood.name}</h3>
              <p className="mt-2 text-sm text-[#5f5148]">
                {wood.short_description}
              </p>

              <ul className="mt-5 space-y-2">
                {wood.features?.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2">
                    <span>{feature.positive ? "✓" : "×"}</span>
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="px-8 py-16 md:px-16">
        <h2 className="mb-8 text-4xl font-bold">
          {data.sections.work?.title || "OUR WORK"}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 rounded-3xl bg-[#c8a67a] p-6 text-white"
            >
              Gallery image placeholder
            </div>
          ))}
        </div>
      </section>

      <section id="advantages" className="px-8 py-16 md:px-16">
        <h2 className="mb-8 text-4xl font-bold">
          {data.sections.advantages?.title || "ADVANTAGES WORKING WITH US"}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {data.services.map((service) => (
            <article key={service.id} className="rounded-3xl bg-white p-6">
              <div className="mb-4 text-4xl">✓</div>
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="mt-3 text-[#5f5148]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="grid gap-10 px-8 py-16 md:grid-cols-2 md:px-16">
        <div className="h-80 rounded-3xl bg-[#d7b98f]" />
        <div>
          <h2 className="text-4xl font-bold">{about?.title}</h2>
          <p className="mt-5 leading-7 text-[#5f5148]">{about?.description}</p>
        </div>
      </section>

      <section id="contact" className="px-8 py-16 md:px-16">
        <div className="rounded-[40px] bg-[#2f241d] p-8 text-white md:p-12">
          <h2 className="text-4xl font-bold">{contact?.title}</h2>
          <p className="mt-4 max-w-2xl text-white/80">{contact?.description}</p>

          <form className="mt-8 grid gap-4 md:grid-cols-3">
            <input className="rounded-full px-5 py-3 text-black" placeholder="Your name" />
            <input className="rounded-full px-5 py-3 text-black" placeholder="Phone number" />
            <button className="rounded-full bg-[#d7a15f] px-6 py-3 font-semibold">
              {contact?.button_text || "Send"}
            </button>
          </form>
        </div>
      </section>

      <footer className="px-8 py-8 text-center text-sm md:px-16">
        © BIO CWT. Solid wood products.
      </footer>
    </main>
  );
}

export default App;