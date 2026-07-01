import { useEffect, useMemo, useRef, useState } from "react";
import { getHomepage } from "./api/homepage";
import type { HomepageSection, WoodType } from "./types/homepage";
import backgroundTexture from "./imgs/BackgroundImg.png";
import ashWood from "./imgs/AshWood.jpg";
import bukWood from "./imgs/BukWood.jpg";
import heroImageOne from "./imgs/HeroImg1.jpg";
import heroImageTwo from "./imgs/HeroImg2.jpg";
import heroImageThree from "./imgs/HeroImg3.jpg";
import logo from "./imgs/LogoWhite.png";
import oakWood from "./imgs/OakWood.jpg";
import woodBackground from "./imgs/Woodstock.jpg";
import "./index.css";

const defaultHero = {
  title: "SOLID WOOD PRODUCTS",
  subtitle: "Oak, beech, ash from",
  description: "1700 CZK per m3",
  buttonText: "Order",
  buttonUrl: "#contact",
};

const navigation = [
  { label: "Gallery", href: "#gallery" },
  { label: "Prices for services", href: "#services" },
  { label: "About us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const defaultWoodTypes: WoodType[] = [
  {
    id: -1,
    name: "Oak",
    slug: "oak",
    short_description: "Strong and durable wood type.",
    description: null,
    features: [
      { label: "Durability", positive: true },
      { label: "Beautiful texture", positive: true },
      { label: "Water resistance", positive: true },
      { label: "Expensive", positive: false },
    ],
    image_path: null,
    sort_order: 1,
    is_active: true,
  },
  {
    id: -2,
    name: "Buk",
    slug: "buk",
    short_description: "Hard wood suitable for furniture.",
    description: null,
    features: [
      { label: "Durability", positive: true },
      { label: "Hard to handle", positive: false },
    ],
    image_path: null,
    sort_order: 2,
    is_active: true,
  },
  {
    id: -3,
    name: "Ash",
    slug: "ash",
    short_description: "Light wood with a clean natural finish.",
    description: null,
    features: [
      { label: "Durability", positive: true },
      { label: "Hard to handle", positive: false },
    ],
    image_path: null,
    sort_order: 3,
    is_active: true,
  },
];

const woodImages: Record<string, string> = {
  oak: oakWood,
  buk: bukWood,
  ash: ashWood,
};

function getTitleLines(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length < 3) {
    return words;
  }

  return [words[0], words[1], words.slice(2).join(" ")];
}

function App() {
  const [heroSection, setHeroSection] = useState<HomepageSection | null>(null);
  const [woodTypes, setWoodTypes] = useState<WoodType[]>(defaultWoodTypes);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeWood, setActiveWood] = useState(0);
  const woodTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomepage()
      .then((response) => {
        setHeroSection(response.sections.hero ?? null);

        if (response.wood_types.length > 0) {
          setWoodTypes(response.wood_types.slice(0, 3));
        }
      })
      .catch(() => {
        // The design remains available while the API is offline during UI work.
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));

    if (!targetId) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const hero = useMemo(
    () => ({
      title: heroSection?.title || defaultHero.title,
      subtitle: heroSection?.subtitle || defaultHero.subtitle,
      description: heroSection?.description || defaultHero.description,
      buttonText: heroSection?.button_text || defaultHero.buttonText,
      buttonUrl: heroSection?.button_url || defaultHero.buttonUrl,
    }),
    [heroSection],
  );

  const titleLines = getTitleLines(hero.title);
  const woodItems = useMemo(
    () =>
      woodTypes.slice(0, 3).map((wood, index) => ({
        ...wood,
        image: woodImages[wood.slug] || Object.values(woodImages)[index],
      })),
    [woodTypes],
  );
  const [priceAmount, priceSuffix = ""] = hero.description.split(
    /(?=\s+per\s+m3$)/i,
  );

  const closeMenu = () => setIsMenuOpen(false);

  const showWood = (index: number) => {
    const count = woodItems.length;

    if (!count) {
      return;
    }

    const nextIndex = (index + count) % count;
    const track = woodTrackRef.current;

    track?.scrollTo({
      left: track.clientWidth * nextIndex,
      behavior: "smooth",
    });
    setActiveWood(nextIndex);
  };

  return (
    <div className="home-page">
      <header
        className={`site-header${isScrolled ? " site-header--scrolled" : ""}${
          isMenuOpen ? " site-header--menu-open" : ""
        }`}
      >
        <div className="site-header__inner">
          <a className="site-header__brand" href="#top" aria-label="BIO CWT home">
            <img src={logo} alt="BIO CWT" />
          </a>

          <button
            className="site-header__menu-button"
            type="button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="primary-navigation"
            className={`site-header__nav${isMenuOpen ? " site-header__nav--open" : ""}`}
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="top" className="hero-section" aria-labelledby="hero-title">
          <div
            className="hero-section__wood"
            style={{ backgroundImage: `url(${woodBackground})` }}
            aria-hidden="true"
          />

          <div className="hero-card">
            <div className="hero-card__content">
              <h1 id="hero-title">
                {titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>

              <p className="hero-card__description">
                <span>{hero.subtitle}</span>
                <span>
                  <strong>{priceAmount}</strong>
                  {priceSuffix}
                </span>
              </p>

              <a className="hero-card__button" href={hero.buttonUrl}>
                {hero.buttonText}
              </a>
            </div>

            <div className="hero-card__divider" aria-hidden="true" />

            <img
              className="hero-card__image hero-card__image--top"
              src={heroImageThree}
              alt="Crafting a solid wood product"
            />
            <img
              className="hero-card__image hero-card__image--middle"
              src={heroImageTwo}
              alt="Curved solid wood staircase"
            />
            <img
              className="hero-card__image hero-card__image--bottom"
              src={heroImageOne}
              alt="Solid wood dining table"
            />
          </div>

          <div
            className="hero-section__contours"
            style={{ backgroundImage: `url(${backgroundTexture})` }}
            aria-hidden="true"
          />
        </section>

        <section
          id="wood-types"
          className="wood-types-section"
          aria-labelledby="wood-types-title"
        >
          <div
            className="wood-types-section__contours"
            style={{ backgroundImage: `url(${backgroundTexture})` }}
            aria-hidden="true"
          />

          <div className="wood-types-section__inner">
            <h2 id="wood-types-title" className="wood-types-section__title">
              <span>THE WOOD WE</span>
              <span>WORK WITH</span>
            </h2>

            <div className="wood-types__slider">
              <button
                className="wood-types__arrow wood-types__arrow--previous"
                type="button"
                aria-label="Show previous wood type"
                onClick={() => showWood(activeWood - 1)}
              >
                <span aria-hidden="true">{"\u2039"}</span>
              </button>

              <div
                ref={woodTrackRef}
                className="wood-types__track"
                onScroll={(event) => {
                  const track = event.currentTarget;

                  if (track.clientWidth > 0) {
                    setActiveWood(
                      Math.min(
                        woodItems.length - 1,
                        Math.max(0, Math.round(track.scrollLeft / track.clientWidth)),
                      ),
                    );
                  }
                }}
              >
                {woodItems.map((wood) => (
                  <article className="wood-type-card" key={wood.id}>
                    <img
                      className="wood-type-card__image"
                      src={wood.image}
                      alt={`${wood.name} wood texture`}
                    />
                    <h3 className="wood-type-card__name">{wood.name}</h3>

                    <ul className="wood-type-card__features">
                      {wood.features?.map((feature) => (
                        <li key={feature.label}>
                          <span
                            className={`wood-type-card__feature-icon${
                              feature.positive
                                ? " wood-type-card__feature-icon--positive"
                                : " wood-type-card__feature-icon--negative"
                            }`}
                            aria-hidden="true"
                          >
                            {feature.positive ? "\u2713" : "\u00d7"}
                          </span>
                          <span>{feature.label}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <button
                className="wood-types__arrow wood-types__arrow--next"
                type="button"
                aria-label="Show next wood type"
                onClick={() => showWood(activeWood + 1)}
              >
                <span aria-hidden="true">{"\u203a"}</span>
              </button>

              <div className="wood-types__pagination" aria-label="Choose wood type">
                {woodItems.map((wood, index) => (
                  <button
                    key={wood.id}
                    className={`wood-types__dot${
                      index === activeWood ? " wood-types__dot--active" : ""
                    }`}
                    type="button"
                    aria-label={`Show ${wood.name}`}
                    aria-current={index === activeWood ? "true" : undefined}
                    onClick={() => showWood(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
