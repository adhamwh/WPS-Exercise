import { useEffect, useMemo, useRef, useState } from "react";
import { getAboutPage } from "./api/about";
import { getContactPage } from "./api/contact";
import { getGallery } from "./api/gallery";
import { getHomepage } from "./api/homepage";
import { getNotFoundPage } from "./api/not-found";
import { getServicesPage } from "./api/services";
import type { HomepageSection, Service, WoodType } from "./types/homepage";
import aboutImageOne from "./imgs/Aboutus1.jpg";
import aboutImageTwo from "./imgs/Aboutus2.jpg";
import aboutImageThree from "./imgs/Aboutus3.jpg";
import advantagesImage from "./imgs/AdvantagesPic.png";
import arrow from "./imgs/Arrow.png";
import backgroundTexture from "./imgs/BackgroundImg.png";
import ashWood from "./imgs/AshWood.jpg";
import bukWood from "./imgs/BukWood.jpg";
import heroImageOne from "./imgs/HeroImg1.jpg";
import heroImageTwo from "./imgs/HeroImg2.jpg";
import heroImageThree from "./imgs/HeroImg3.jpg";
import locationIcon from "./imgs/LocationIcon.png";
import logImage from "./imgs/LogImg.png";
import logo from "./imgs/LogoWhite.png";
import notFoundImage from "./imgs/NotFound.png";
import oakWood from "./imgs/OakWood.jpg";
import ourWorkOne from "./imgs/OurWork1.jpg";
import phoneIcon from "./imgs/PhoneIcon.png";
import priceOne from "./imgs/Price1.png";
import priceTwo from "./imgs/Price2.png";
import priceThree from "./imgs/Price3.png";
import priceFour from "./imgs/Price4.png";
import priceFive from "./imgs/Price5.png";
import priceSix from "./imgs/Price6.png";
import priceSeven from "./imgs/Price7.png";
import priceEight from "./imgs/Price8.png";
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
  { label: "Gallery", href: "/gallery" },
  { label: "Prices for services", href: "/services" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const knownPaths = new Set(["/", "/gallery", "/services", "/about", "/contact"]);

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

const workSlides = [
  {
    src: ourWorkOne,
    alt: "Custom kitchen made with solid wood cabinetry",
  },
  {
    src: heroImageOne,
    alt: "Custom solid wood dining table",
  },
  {
    src: heroImageTwo,
    alt: "Custom curved solid wood staircase",
  },
];

const priceSlides = [
  {
    id: "oak",
    items: [
      { src: priceOne, alt: "Oak service size table" },
      { src: priceThree, alt: "Oak service price table" },
      { src: priceTwo, alt: "Oak additional service size table" },
      { src: priceFour, alt: "Oak additional service price table" },
    ],
  },
  {
    id: "ash",
    items: [
      { src: priceFive, alt: "Ash service size table" },
      { src: priceSix, alt: "Ash service price table" },
      { src: priceSeven, alt: "Ash additional service size table" },
      { src: priceEight, alt: "Ash additional service price table" },
    ],
  },
  {
    id: "mixed",
    items: [
      { src: priceSeven, alt: "Custom service size table" },
      { src: priceEight, alt: "Custom service price table" },
    ],
  },
];

const defaultAdvantageItems = [
  "In-house carpentry production",
  "We only treat wood with environmentally friendly and safe products",
  "Prices from the manufacturer, no extra charges",
];

const defaultAboutDescription =
  "We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.";

function getTitleLines(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length < 3) {
    return words;
  }

  return [words[0], words[1], words.slice(2).join(" ")];
}

function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isGalleryPage = currentPath === "/gallery";
  const isServicesPage = currentPath === "/services";
  const isAboutPage = currentPath === "/about";
  const isContactPage = currentPath === "/contact";
  const isNotFoundPage = !knownPaths.has(currentPath);
  const mainPageClass = isGalleryPage
    ? "gallery-page"
    : isServicesPage
      ? "services-page"
      : isAboutPage
        ? "about-page"
        : isContactPage
          ? "contact-page"
          : isNotFoundPage
            ? "not-found-page"
            : undefined;
  const [heroSection, setHeroSection] = useState<HomepageSection | null>(null);
  const [advantagesSection, setAdvantagesSection] =
    useState<HomepageSection | null>(null);
  const [aboutSection, setAboutSection] = useState<HomepageSection | null>(null);
  const [woodTypes, setWoodTypes] = useState<WoodType[]>(defaultWoodTypes);
  const [services, setServices] = useState<Service[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeWood, setActiveWood] = useState(0);
  const [activeWork, setActiveWork] = useState(0);
  const [activePrice, setActivePrice] = useState(0);
  const woodTrackRef = useRef<HTMLDivElement>(null);
  const workTouchStartX = useRef<number | null>(null);
  const priceTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    const fetchPageData = isNotFoundPage
      ? getNotFoundPage
      : isContactPage
        ? getContactPage
        : isServicesPage
          ? getServicesPage
          : isAboutPage
            ? getAboutPage
            : isGalleryPage
              ? getGallery
              : getHomepage;

    fetchPageData()
      .then((response) => {
        setHeroSection(response.sections.hero ?? null);
        setAdvantagesSection(response.sections.advantages ?? null);
        setAboutSection(response.sections.about ?? null);

        if (response.wood_types.length > 0) {
          setWoodTypes(response.wood_types.slice(0, 3));
        }

        if (response.services.length > 0) {
          setServices(response.services.slice(0, 3));
        }
      })
      .catch(() => {
        // The design remains available while the API is offline during UI work.
      });
  }, [
    isAboutPage,
    isContactPage,
    isGalleryPage,
    isNotFoundPage,
    isServicesPage,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((currentlyScrolled) =>
        currentlyScrolled ? window.scrollY > 16 : window.scrollY > 64,
      );
    };

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
  const advantagesTitle =
    advantagesSection?.title || "ADVANTAGES WORKING WITH US";
  const [advantagesLead, ...advantagesRest] = advantagesTitle.split(/\s+/);
  const advantageItems = [
    services[0]?.title || defaultAdvantageItems[0],
    services[1]?.description || defaultAdvantageItems[1],
    services[2]?.description || defaultAdvantageItems[2],
  ];
  const aboutDescription = (
    aboutSection?.description || defaultAboutDescription
  ).replace(/^BIO CWT\s*-\s*/i, "");

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

  const showWork = (index: number) => {
    setActiveWork((index + workSlides.length) % workSlides.length);
  };

  return (
    <div className="home-page">
      <header
        className={`site-header${
          isScrolled ||
          isGalleryPage ||
          isServicesPage ||
          isAboutPage ||
          isContactPage
            ? " site-header--scrolled"
            : ""
        }${
          isMenuOpen ? " site-header--menu-open" : ""
        }`}
      >
        <div className="site-header__inner">
          <a className="site-header__brand" href="/" aria-label="BIO CWT home">
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
              <a
                key={item.label}
                className={
                  (item.label === "Gallery" && isGalleryPage) ||
                  (item.label === "Prices for services" && isServicesPage) ||
                  (item.label === "About us" && isAboutPage) ||
                  (item.label === "Contact" && isContactPage)
                    ? "site-header__nav-link--active"
                    : undefined
                }
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div
        className="home-page__contours"
        style={{ backgroundImage: `url(${backgroundTexture})` }}
        aria-hidden="true"
      />

      <main className={mainPageClass}>
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

        </section>

        <section
          id="wood-types"
          className="wood-types-section"
          aria-labelledby="wood-types-title"
        >
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

        <section
          id="gallery"
          className="our-work-section"
          aria-labelledby="our-work-title"
        >
          <div className="our-work-section__inner">
            <h2 id="our-work-title" className="our-work-section__title">
              OUR WORK
            </h2>

            <div className="our-work-slider">
              <button
                className="our-work-slider__arrow our-work-slider__arrow--previous"
                type="button"
                aria-label="Show previous project"
                onClick={() => showWork(activeWork - 1)}
              >
                <img src={arrow} alt="" aria-hidden="true" />
              </button>

              <div
                className="our-work-slider__viewport"
                aria-live="polite"
                onTouchStart={(event) => {
                  workTouchStartX.current = event.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(event) => {
                  if (workTouchStartX.current === null) {
                    return;
                  }

                  const endX = event.changedTouches[0]?.clientX;

                  if (endX !== undefined) {
                    const distance = endX - workTouchStartX.current;

                    if (Math.abs(distance) > 40) {
                      showWork(activeWork + (distance < 0 ? 1 : -1));
                    }
                  }

                  workTouchStartX.current = null;
                }}
              >
                {workSlides.map((slide, index) => (
                  <img
                    key={slide.src}
                    className={`our-work-slider__image${
                      index === activeWork ? " our-work-slider__image--active" : ""
                    }`}
                    src={slide.src}
                    alt={index === activeWork ? slide.alt : ""}
                    aria-hidden={index !== activeWork}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>

              <button
                className="our-work-slider__arrow our-work-slider__arrow--next"
                type="button"
                aria-label="Show next project"
                onClick={() => showWork(activeWork + 1)}
              >
                <img src={arrow} alt="" aria-hidden="true" />
              </button>

              <div className="our-work-slider__pagination" aria-label="Choose project">
                {workSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    className={`our-work-slider__dot${
                      index === activeWork ? " our-work-slider__dot--active" : ""
                    }`}
                    type="button"
                    aria-label={`Show project ${index + 1}`}
                    aria-current={index === activeWork ? "true" : undefined}
                    onClick={() => showWork(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="advantages-section"
          aria-labelledby="advantages-title"
        >
          <div className="advantages-section__inner">
            <h2 id="advantages-title" className="advantages-section__title">
              <span>{advantagesLead}</span>
              <span>{advantagesRest.join(" ")}</span>
            </h2>

            <div className="advantages-section__content">
              <img
                className="advantages-section__image"
                src={advantagesImage}
                alt="Solid wood staircase construction"
                loading="lazy"
              />

              <div className="advantages-section__copy">
                {advantageItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <a
              className="advantages-section__button"
              href={advantagesSection?.button_url || "#contact"}
            >
              {advantagesSection?.button_text || "Receive a consultation"}
            </a>
          </div>
        </section>

        <section
          id="price-list"
          className="price-list-section"
          aria-labelledby="price-list-title"
        >
          <div className="price-list-section__inner">
            <h1 id="price-list-title" className="price-list-section__title">
              PRICE LIST
            </h1>

            <div className="price-slider">
              <button
                className="price-slider__arrow price-slider__arrow--previous"
                type="button"
                aria-label="Show previous price list"
                onClick={() =>
                  setActivePrice(
                    (activePrice - 1 + priceSlides.length) % priceSlides.length,
                  )
                }
              >
                <img src={arrow} alt="" aria-hidden="true" />
              </button>

              <div
                className="price-slider__viewport"
                aria-live="polite"
                onTouchStart={(event) => {
                  priceTouchStartX.current = event.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(event) => {
                  if (priceTouchStartX.current === null) {
                    return;
                  }

                  const endX = event.changedTouches[0]?.clientX;

                  if (endX !== undefined) {
                    const distance = endX - priceTouchStartX.current;

                    if (Math.abs(distance) > 40) {
                      setActivePrice(
                        (activePrice +
                          (distance < 0 ? 1 : -1) +
                          priceSlides.length) %
                          priceSlides.length,
                      );
                    }
                  }

                  priceTouchStartX.current = null;
                }}
              >
                {priceSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`price-slider__slide${
                      index === activePrice ? " price-slider__slide--active" : ""
                    }`}
                    aria-hidden={index !== activePrice}
                  >
                    {slide.items.map((item) => (
                      <img
                        className="price-slider__image"
                        src={item.src}
                        alt={index === activePrice ? item.alt : ""}
                        loading={index === 0 ? "eager" : "lazy"}
                        key={item.src}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <button
                className="price-slider__arrow price-slider__arrow--next"
                type="button"
                aria-label="Show next price list"
                onClick={() =>
                  setActivePrice((activePrice + 1) % priceSlides.length)
                }
              >
                <img src={arrow} alt="" aria-hidden="true" />
              </button>

              <div className="price-slider__pagination" aria-label="Choose price list">
                {priceSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    className={`price-slider__dot${
                      index === activePrice ? " price-slider__dot--active" : ""
                    }`}
                    type="button"
                    aria-label={`Show price list ${index + 1}`}
                    aria-current={index === activePrice ? "true" : undefined}
                    onClick={() => setActivePrice(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="about-section"
          aria-labelledby="about-title"
        >
          <div className="about-section__panel">
            <div className="about-section__content">
              <h2 id="about-title" className="about-section__title">
                {aboutSection?.title || "ABOUT US"}
              </h2>

              <p className="about-section__copy">
                <strong>BIO CWT</strong>
                <span> - {aboutDescription}</span>
              </p>
            </div>

            <div className="about-section__images" aria-label="Our workshop">
              <img
                className="about-section__image about-section__image--top"
                src={aboutImageOne}
                alt="Carpenter measuring a wooden frame"
                loading="lazy"
              />
              <img
                className="about-section__image about-section__image--main"
                src={aboutImageTwo}
                alt="Carpenter working in the BIO CWT workshop"
                loading="lazy"
              />
              <img
                className="about-section__image about-section__image--bottom"
                src={aboutImageThree}
                alt="Preparing a custom wood product drawing"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section
          className="contact-info-section"
          aria-labelledby="contact-info-title"
        >
          <div className="contact-info-section__inner">
            <div className="contact-info-section__details">
              <h1 id="contact-info-title" className="contact-info-section__title">
                CONTACT
              </h1>

              <a
                className="contact-info-section__item"
                href="tel:+420000000000"
              >
                <img src={phoneIcon} alt="" aria-hidden="true" />
                <span>+420 000 000 000</span>
              </a>

              <a
                className="contact-info-section__item"
                href="https://maps.google.com/?q=Pixel38%2C+11+4404%2C+47+Patriarch+Howeiyek+Street%2C+Beirut"
                target="_blank"
                rel="noreferrer"
              >
                <img src={locationIcon} alt="" aria-hidden="true" />
                <span>
                  Na Plzence 1166/0
                  <br />
                  150 00
                </span>
              </a>
            </div>

            <iframe
              className="contact-info-section__map"
              title="Pixel38 location in Beirut"
              src="https://www.google.com/maps?q=Pixel38%2C%2011%204404%2C%2047%20Patriarch%20Howeiyek%20Street%2C%20Beirut&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="not-found-section" aria-labelledby="not-found-title">
          <div
            className="not-found-section__wood"
            style={{ backgroundImage: `url(${woodBackground})` }}
            aria-hidden="true"
          />
          <div className="not-found-section__content">
            <img
              className="not-found-section__number"
              src={notFoundImage}
              alt="404"
            />
            <h1 id="not-found-title">Woops</h1>
            <p>Oh, you must be lost, there is no such page.</p>
            <a href="/">Go to the home page</a>
          </div>
        </section>

        <section
          id="contact"
          className="questions-section"
          aria-labelledby="questions-title"
        >
          <div className="questions-section__inner">
            <h2 id="questions-title" className="questions-section__title">
              ANY QUESTIONS?
            </h2>

            <div className="questions-section__layout">
              <form
                className="questions-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <label>
                  <span className="questions-form__label">Your name</span>
                  <input type="text" name="name" placeholder="Your name" required />
                </label>

                <label>
                  <span className="questions-form__label">Your telephone number</span>
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Your telephone number"
                    required
                  />
                </label>

                <label>
                  <span className="questions-form__label">Your question</span>
                  <textarea
                    name="question"
                    placeholder="Your question"
                    rows={5}
                    required
                  />
                </label>

                <button type="submit">Send</button>
              </form>

              <p className="questions-section__copy">
                Write to us and we will be sure to answer all your questions and
                give you a comprehensive consultation.
              </p>
            </div>

            <img
              className="questions-section__log"
              src={logImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      {!isNotFoundPage && (
        <footer className="site-footer">
          <div className="site-footer__inner">
            <div className="site-footer__brand-block">
              <a href="/" aria-label="BIO CWT home">
                <img className="site-footer__logo" src={logo} alt="BIO CWT" />
              </a>
              <a className="site-footer__privacy" href="#privacy">
                Privacy Policy
              </a>
            </div>

            <a className="site-footer__contact" href="tel:+420000000000">
              <img src={phoneIcon} alt="" aria-hidden="true" />
              <span>+420 000 000 000</span>
            </a>

            <a
              className="site-footer__contact site-footer__contact--address"
              href="https://maps.google.com/?q=Pixel38%2C+11+4404%2C+47+Patriarch+Howeiyek+Street%2C+Beirut"
              target="_blank"
              rel="noreferrer"
            >
              <img src={locationIcon} alt="" aria-hidden="true" />
              <span>
                Na Plzence 1166/0
                <br />
                150 00
              </span>
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
