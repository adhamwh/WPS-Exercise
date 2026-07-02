import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { getAboutPage } from "./api/about";
import { getContactPage } from "./api/contact";
import { getGallery } from "./api/gallery";
import { getHomepage } from "./api/homepage";
import { getNotFoundPage } from "./api/not-found";
import { getServicesPage } from "./api/services";
import AuthProvider from "./auth/AuthProvider";
import NotFoundSection from "./components/NotFoundSection";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import HomepageAdminPage from "./pages/admin/HomepageAdminPage";
import ImagesAdminPage from "./pages/admin/ImagesAdminPage";
import ProductsAdminPage from "./pages/admin/ProductsAdminPage";
import ServicesAdminPage from "./pages/admin/ServicesAdminPage";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import type {
  ContactDetails,
  HomepageResponse,
  WoodType,
} from "./types/homepage";
import ashWood from "./imgs-optimized/AshWood.webp";
import bukWood from "./imgs-optimized/BukWood.webp";
import heroImageOne from "./imgs-optimized/HeroImg1.webp";
import heroImageTwo from "./imgs-optimized/HeroImg2.webp";
import oakWood from "./imgs-optimized/OakWood.webp";
import ourWorkOne from "./imgs-optimized/OurWork1.webp";
import priceOne from "./imgs/Price1.png";
import priceTwo from "./imgs/Price2.png";
import priceThree from "./imgs/Price3.png";
import priceFour from "./imgs/Price4.png";
import priceFive from "./imgs/Price5.png";
import priceSix from "./imgs/Price6.png";
import priceSeven from "./imgs/Price7.png";
import priceEight from "./imgs/Price8.png";
import "./index.css";
import "./styles/auth.css";
import "./styles/admin.css";

const defaultHero = {
  title: "SOLID WOOD PRODUCTS",
  subtitle: "Oak, beech, ash from",
  description: "1700 CZK per m³",
  buttonText: "Order",
  buttonUrl: "#contact",
};

const defaultQuestions = {
  title: "ANY QUESTIONS?",
  description:
    "Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.",
  buttonText: "Send",
};

const defaultContactDetails: ContactDetails = {
  title: "CONTACT",
  phone: "+420 000 000 000",
  address: "Na Plzence 1166/0\n150 00",
  mapUrl:
    "https://www.google.com/maps?q=Pixel38%2C%2011%204404%2C%2047%20Patriarch%20Howeiyek%20Street%2C%20Beirut&output=embed",
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
    image_url: null,
    sort_order: 1,
    is_active: true,
    images: [],
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
    image_url: null,
    sort_order: 2,
    is_active: true,
    images: [],
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
    image_url: null,
    sort_order: 3,
    is_active: true,
    images: [],
  },
];

const woodImages: Record<string, string> = {
  oak: oakWood,
  buk: bukWood,
  ash: ashWood,
};

const defaultWorkSlides = [
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

const defaultPriceSlides = [
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
const defaultWorkDescription =
  "A selection of our finished wood projects and custom furniture work.";
const defaultAdvantagesDescription =
  "We combine in-house carpentry, eco-friendly treatment, and direct manufacturer prices.";

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
  const [pageResponse, setPageResponse] = useState<{
    path: string;
    data: HomepageResponse;
  } | null>(null);
  const pageData =
    pageResponse?.path === currentPath ? pageResponse.data : null;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isCurrentRequest = true;
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
        if (isCurrentRequest) {
          setPageResponse({ path: currentPath, data: response });
        }
      })
      .catch(() => {
        // Keep the local design fallbacks available while the API is offline.
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [
    isAboutPage,
    isContactPage,
    isGalleryPage,
    isNotFoundPage,
    isServicesPage,
    currentPath,
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

  const sections = pageData?.sections ?? {};
  const heroSection = sections.hero;
  const workSection = sections.work;
  const advantagesSection = sections.advantages;
  const aboutSection = sections.about;
  const questionsSection = sections.contact;
  const contactInfoSection = sections.contact_info;
  const hasCmsResponse = pageData !== null;
  const woodTypes = pageData?.wood_types.length
    ? pageData.wood_types.slice(0, 6)
    : defaultWoodTypes;
  const services = useMemo(
    () => pageData?.services.slice(0, 3) ?? [],
    [pageData?.services],
  );

  const hero = useMemo(
    () => ({
      title: heroSection?.title || defaultHero.title,
      subtitle: heroSection?.subtitle || defaultHero.subtitle,
      description: heroSection?.description || defaultHero.description,
      buttonText: heroSection?.button_text || defaultHero.buttonText,
      buttonUrl: heroSection?.button_url || defaultHero.buttonUrl,
      image: heroSection?.image_url || null,
    }),
    [heroSection],
  );

  const woodItems = useMemo(
    () =>
      woodTypes.map((wood, index) => ({
        ...wood,
        image:
          wood.image_url ||
          wood.images[0]?.image_url ||
          woodImages[wood.slug] ||
          Object.values(woodImages)[index % Object.values(woodImages).length],
      })),
    [woodTypes],
  );

  const workSlides = useMemo(() => {
    const managedSlides = [
      ...(workSection?.image_url
        ? [
            {
              src: workSection.image_url,
              alt: workSection.title || "Our finished woodwork",
            },
          ]
        : []),
      ...(pageData?.gallery ?? []).map((image) => ({
        src: image.image_url,
        alt: image.alt_text || image.product?.name || "Finished wood project",
      })),
    ].filter(
      (slide, index, slides) =>
        slides.findIndex((candidate) => candidate.src === slide.src) === index,
    );

    return managedSlides.length > 0 ? managedSlides : defaultWorkSlides;
  }, [pageData?.gallery, workSection]);

  const priceSlides = useMemo(() => {
    const managedSlides = services
      .filter((service) => service.image_url)
      .map((service) => ({
        id: service.slug,
        items: [
          {
            src: service.image_url as string,
            alt: service.title,
          },
        ],
      }));

    return managedSlides.length > 0 ? managedSlides : defaultPriceSlides;
  }, [services]);

  const titleLines = getTitleLines(hero.title);
  const [priceAmount, priceSuffix = ""] = hero.description.split(
    /(?=\s+per\s+(?:m(?:3|³)|㎥)$)/i,
  );
  const advantagesTitle =
    advantagesSection?.title || "ADVANTAGES WORKING WITH US";
  const [advantagesLead, ...advantagesRest] = advantagesTitle.split(/\s+/);
  const advantageItems =
    services.length > 0
      ? services.map((service) => service.description || service.title)
      : hasCmsResponse
        ? []
        : defaultAdvantageItems;
  const aboutDescription = (
    aboutSection?.description || defaultAboutDescription
  ).replace(/^BIO CWT\s*-\s*/i, "");
  const contactDetails: ContactDetails = {
    title: contactInfoSection?.title || defaultContactDetails.title,
    phone: contactInfoSection?.subtitle || defaultContactDetails.phone,
    address: contactInfoSection?.description || defaultContactDetails.address,
    mapUrl: contactInfoSection?.button_url || defaultContactDetails.mapUrl,
  };
  const showContactInfo = !hasCmsResponse || Boolean(contactInfoSection);

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
      contactDetails={showContactInfo ? contactDetails : null}
      closeMenu={() => setIsMenuOpen(false)}
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
          workTitle={workSection?.title || "OUR WORK"}
          workDescription={
            hasCmsResponse
              ? workSection?.description ?? ""
              : defaultWorkDescription
          }
          advantagesLead={advantagesLead}
          advantagesRest={advantagesRest}
          advantagesDescription={
            hasCmsResponse
              ? advantagesSection?.description ?? ""
              : defaultAdvantagesDescription
          }
          advantageItems={advantageItems}
          advantagesButtonText={
            advantagesSection?.button_text || "Receive a consultation"
          }
          advantagesButtonUrl={advantagesSection?.button_url || "#contact"}
          advantagesImage={advantagesSection?.image_url || null}
          priceSlides={priceSlides}
          aboutTitle={aboutSection?.title || "ABOUT US"}
          aboutDescription={aboutDescription}
          aboutImage={aboutSection?.image_url || null}
          questionsTitle={questionsSection?.title || defaultQuestions.title}
          questionsDescription={
            questionsSection?.description || defaultQuestions.description
          }
          questionsButtonText={
            questionsSection?.button_text || defaultQuestions.buttonText
          }
          questionsImage={questionsSection?.image_url || null}
          contactDetails={contactDetails}
          showHero={!hasCmsResponse || Boolean(heroSection)}
          showWoodTypes={!hasCmsResponse || Boolean(pageData?.wood_types.length)}
          showWork={!hasCmsResponse || Boolean(workSection)}
          showAdvantages={!hasCmsResponse || Boolean(advantagesSection)}
          showAbout={!hasCmsResponse || Boolean(aboutSection)}
          showQuestions={!hasCmsResponse || Boolean(questionsSection)}
          showContactInfo={showContactInfo}
        />
      )}
    </PublicLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="homepage" element={<HomepageAdminPage />} />
              <Route path="services" element={<ServicesAdminPage />} />
              <Route path="products" element={<ProductsAdminPage />} />
              <Route path="images" element={<ImagesAdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
