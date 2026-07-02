import aboutImageOne from "../imgs-optimized/Aboutus1.webp";
import aboutImageTwo from "../imgs-optimized/Aboutus2.webp";
import aboutImageThree from "../imgs-optimized/Aboutus3.webp";

type AboutSectionProps = {
  title: string;
  aboutDescription: string;
  image?: string | null;
};

function AboutSection({ title, aboutDescription, image }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-title"
    >
      <div className="about-section__panel">
        <div className="about-section__content">
          <h2 id="about-title" className="about-section__title">
            {title}
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
            src={image || aboutImageTwo}
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
  );
}

export default AboutSection;
