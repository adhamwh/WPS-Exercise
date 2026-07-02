import advantagesImage from "../imgs-optimized/AdvantagesPic.webp";

type AdvantagesSectionProps = {
  advantagesLead: string;
  advantagesRest: string[];
  description: string;
  advantageItems: string[];
  buttonText: string;
  buttonUrl: string;
  image?: string | null;
};

function AdvantagesSection({
  advantagesLead,
  advantagesRest,
  description,
  advantageItems,
  buttonText,
  buttonUrl,
  image,
}: AdvantagesSectionProps) {
  return (
    <section
      id="services"
      className="advantages-section"
      aria-labelledby="advantages-title"
    >
      <div className="advantages-section__inner">
        <h2
          id="advantages-title"
          className={`advantages-section__title${
            description
              ? ""
              : " advantages-section__title--without-description"
          }`}
        >
          <span>{advantagesLead}</span>
          <span>{advantagesRest.join(" ")}</span>
        </h2>

        {description && (
          <p className="advantages-section__description">{description}</p>
        )}

        <div className="advantages-section__content">
          <img
            className="advantages-section__image"
            src={image || advantagesImage}
            alt="Solid wood staircase construction"
            loading="lazy"
          />

          <div className="advantages-section__copy">
            {advantageItems.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <a className="advantages-section__button" href={buttonUrl}>
          {buttonText}
        </a>
      </div>
    </section>
  );
}

export default AdvantagesSection;
