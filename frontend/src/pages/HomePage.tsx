import HeroSection from "../components/HeroSection";
import WoodTypesSection from "../components/WoodTypesSection";
import OurWorkSection from "../components/OurWorkSection";
import AdvantagesSection from "../components/AdvantagesSection";
import PriceListSection from "../components/PriceListSection";
import AboutSection from "../components/AboutSection";
import ContactInfoSection from "../components/ContactInfoSection";
import QuestionsSection from "../components/QuestionsSection";
import type { ContactDetails, WoodType } from "../types/homepage";

type HeroData = {
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  image: string | null;
};

type WorkSlide = {
  src: string;
  alt: string;
};

type PriceItem = {
  src: string;
  alt: string;
};

type PriceSlide = {
  id: string;
  items: PriceItem[];
};

type WoodItem = WoodType & {
  image: string;
};

type HomePageProps = {
  titleLines: string[];
  hero: HeroData;
  priceAmount: string;
  priceSuffix: string;
  woodItems: WoodItem[];
  workSlides: WorkSlide[];
  workTitle: string;
  workDescription: string;
  advantagesLead: string;
  advantagesRest: string[];
  advantagesDescription: string;
  advantageItems: string[];
  advantagesButtonText: string;
  advantagesButtonUrl: string;
  advantagesImage: string | null;
  priceSlides: PriceSlide[];
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string | null;
  questionsTitle: string;
  questionsDescription: string;
  questionsButtonText: string;
  questionsImage: string | null;
  contactDetails: ContactDetails;
  showHero: boolean;
  showWoodTypes: boolean;
  showWork: boolean;
  showAdvantages: boolean;
  showAbout: boolean;
  showQuestions: boolean;
  showContactInfo: boolean;
};

function HomePage({
  titleLines,
  hero,
  priceAmount,
  priceSuffix,
  woodItems,
  workSlides,
  workTitle,
  workDescription,
  advantagesLead,
  advantagesRest,
  advantagesDescription,
  advantageItems,
  advantagesButtonText,
  advantagesButtonUrl,
  advantagesImage,
  priceSlides,
  aboutTitle,
  aboutDescription,
  aboutImage,
  questionsTitle,
  questionsDescription,
  questionsButtonText,
  questionsImage,
  contactDetails,
  showHero,
  showWoodTypes,
  showWork,
  showAdvantages,
  showAbout,
  showQuestions,
  showContactInfo,
}: HomePageProps) {
  return (
    <>
      {showHero && (
        <HeroSection
          titleLines={titleLines}
          subtitle={hero.subtitle}
          priceAmount={priceAmount}
          priceSuffix={priceSuffix}
          buttonText={hero.buttonText}
          buttonUrl={hero.buttonUrl}
          image={hero.image}
        />
      )}

      {showWoodTypes && <WoodTypesSection woodItems={woodItems} />}

      {showWork && (
        <OurWorkSection
          key={workSlides.map((slide) => slide.src).join("|")}
          title={workTitle}
          description={workDescription}
          workSlides={workSlides}
        />
      )}

      {showAdvantages && (
        <AdvantagesSection
          advantagesLead={advantagesLead}
          advantagesRest={advantagesRest}
          description={advantagesDescription}
          advantageItems={advantageItems}
          buttonText={advantagesButtonText}
          buttonUrl={advantagesButtonUrl}
          image={advantagesImage}
        />
      )}

      <PriceListSection
        key={priceSlides.map((slide) => slide.id).join("|")}
        priceSlides={priceSlides}
      />

      {showAbout && (
        <AboutSection
          title={aboutTitle}
          aboutDescription={aboutDescription}
          image={aboutImage}
        />
      )}

      {showContactInfo && <ContactInfoSection details={contactDetails} />}

      {showQuestions && (
        <QuestionsSection
          title={questionsTitle}
          description={questionsDescription}
          buttonText={questionsButtonText}
          image={questionsImage}
        />
      )}
    </>
  );
}

export default HomePage;
