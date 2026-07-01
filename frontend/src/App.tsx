import { useEffect, useMemo, useState } from "react";
import { getHomepage } from "./api/homepage";
import type { HomepageSection } from "./types/homepage";
import backgroundTexture from "./imgs/BackgroundImg.png";
import heroImageOne from "./imgs/HeroImg1.jpg";
import heroImageTwo from "./imgs/HeroImg2.jpg";
import heroImageThree from "./imgs/HeroImg3.jpg";
import logo from "./imgs/LogoWhite.png";
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

function getTitleLines(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length < 3) {
    return words;
  }

  return [words[0], words[1], words.slice(2).join(" ")];
}

function App() {
  const [heroSection, setHeroSection] = useState<HomepageSection | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getHomepage()
      .then((response) => setHeroSection(response.sections.hero ?? null))
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
  const [priceAmount, priceSuffix = ""] = hero.description.split(
    /(?=\s+per\s+m3$)/i,
  );

  const closeMenu = () => setIsMenuOpen(false);

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
      </main>
    </div>
  );
}

export default App;
