import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import NotFoundSection from "./components/NotFoundSection";
import HomePage from "./pages/HomePage";
import PublicLayout from "./layouts/PublicLayout";
import { getAboutPage } from "./api/about";
import { getContactPage } from "./api/contact";
import { getGallery } from "./api/gallery";
import { getHomepage } from "./api/homepage";
import { getNotFoundPage } from "./api/not-found";
import { getServicesPage } from "./api/services";
import type { HomepageSection, Service, WoodType } from "./types/homepage";
import ashWood from "./imgs-optimized/AshWood.webp";
import bukWood from "./imgs-optimized/BukWood.webp";
import oakWood from "./imgs-optimized/OakWood.webp";
import ourWorkOne from "./imgs-optimized/OurWork1.webp";
import heroImageOne from "./imgs-optimized/HeroImg1.webp";
import heroImageTwo from "./imgs-optimized/HeroImg2.webp";
import priceOne from "./imgs/Price1.png";
import priceTwo from "./imgs/Price2.png";
import priceThree from "./imgs/Price3.png";
import priceFour from "./imgs/Price4.png";
import priceFive from "./imgs/Price5.png";
import priceSix from "./imgs/Price6.png";
import priceSeven from "./imgs/Price7.png";
import priceEight from "./imgs/Price8.png";
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

function AppContent() {
  const location = useLocation();
 const currentPath = location.pathname.replace(/\/+$/, "") || "/";
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


  return (
  <PublicLayout
    navigation={navigation}
    isScrolled={isScrolled}
    isMenuOpen={isMenuOpen}
    isGalleryPage={isGalleryPage}
    isServicesPage={isServicesPage}
    isAboutPage={isAboutPage}
    isContactPage={isContactPage}
    isNotFoundPage={isNotFoundPage}
    mainPageClass={mainPageClass}
    closeMenu={closeMenu}
    toggleMenu={() => setIsMenuOpen((open) => !open)}
  >
    {isNotFoundPage ? (
      <NotFoundSection />
    ) : (
      <HomePage
        titleLines={titleLines}
        hero={hero}
        priceAmount={priceAmount}
        priceSuffix={priceSuffix}
        woodItems={woodItems}
        workSlides={workSlides}
        advantagesLead={advantagesLead}
        advantagesRest={advantagesRest}
        advantageItems={advantageItems}
        advantagesButtonText={
          advantagesSection?.button_text || "Receive a consultation"
        }
        advantagesButtonUrl={advantagesSection?.button_url || "#contact"}
        priceSlides={priceSlides}
        aboutTitle={aboutSection?.title || "ABOUT US"}
        aboutDescription={aboutDescription}
      />
    )}
  </PublicLayout>
);
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
