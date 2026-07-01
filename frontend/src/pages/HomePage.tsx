import HeroSection from "../components/HeroSection";
import WoodTypesSection from "../components/WoodTypesSection";
import OurWorkSection from "../components/OurWorkSection";
import AdvantagesSection from "../components/AdvantagesSection";
import PriceListSection from "../components/PriceListSection";
import AboutSection from "../components/AboutSection";
import ContactInfoSection from "../components/ContactInfoSection";
import QuestionsSection from "../components/QuestionsSection";
import type { WoodType } from "../types/homepage";

type HeroData = {
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
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
  advantagesLead: string;
  advantagesRest: string[];
  advantageItems: string[];
  advantagesButtonText: string;
  advantagesButtonUrl: string;
  priceSlides: PriceSlide[];
  aboutTitle: string;
  aboutDescription: string;
};

function HomePage({
  titleLines,
  hero,
  priceAmount,
  priceSuffix,
  woodItems,
  workSlides,
  advantagesLead,
  advantagesRest,
  advantageItems,
  advantagesButtonText,
  advantagesButtonUrl,
  priceSlides,
  aboutTitle,
  aboutDescription,
}: HomePageProps) {
  return (
    <>
      <HeroSection
        titleLines={titleLines}
        subtitle={hero.subtitle}
        priceAmount={priceAmount}
        priceSuffix={priceSuffix}
        buttonText={hero.buttonText}
        buttonUrl={hero.buttonUrl}
      />

      <WoodTypesSection woodItems={woodItems} />

      <OurWorkSection workSlides={workSlides} />

      <AdvantagesSection
        advantagesLead={advantagesLead}
        advantagesRest={advantagesRest}
        advantageItems={advantageItems}
        buttonText={advantagesButtonText}
        buttonUrl={advantagesButtonUrl}
      />

      <PriceListSection priceSlides={priceSlides} />

      <AboutSection title={aboutTitle} aboutDescription={aboutDescription} />

      <ContactInfoSection />

      <QuestionsSection />
    </>
  );
}

export default HomePage;