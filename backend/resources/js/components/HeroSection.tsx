import heroImageOne from "../imgs-optimized/HeroImg1.webp";
import heroImageTwo from "../imgs-optimized/HeroImg2.webp";
import heroImageThree from "../imgs-optimized/HeroImg3.webp";
import woodBackground from "../imgs-optimized/Woodstock.webp";

type HeroSectionProps = {
  titleLines: string[];
  subtitle: string;
  priceAmount: string;
  priceSuffix: string;
  buttonText: string;
  buttonUrl: string;
  image?: string | null;
};

function HeroSection({
  titleLines,
  subtitle,
  priceAmount,
  priceSuffix,
  buttonText,
  buttonUrl,
  image,
}: HeroSectionProps) {
  return (
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
            <span>{subtitle}</span>
            <span>
              <strong>{priceAmount}</strong>
              {priceSuffix}
            </span>
          </p>

          <a className="hero-card__button" href={buttonUrl}>
            {buttonText}
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
          src={image || heroImageOne}
          alt="Solid wood dining table"
        />
      </div>
    </section>
  );
}

export default HeroSection;
