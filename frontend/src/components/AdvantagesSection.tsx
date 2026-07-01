import advantagesImage from "../imgs-optimized/AdvantagesPic.webp";

type AdvantagesSectionProps = {
  advantagesLead: string;
  advantagesRest: string[];
  advantageItems: string[];
  buttonText: string;
  buttonUrl: string;
};

function AdvantagesSection({
  advantagesLead,
  advantagesRest,
  advantageItems,
  buttonText,
  buttonUrl,
}: AdvantagesSectionProps) {
  return (
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

        <a className="advantages-section__button" href={buttonUrl}>
          {buttonText}
        </a>
      </div>
    </section>
  );
}

export default AdvantagesSection;