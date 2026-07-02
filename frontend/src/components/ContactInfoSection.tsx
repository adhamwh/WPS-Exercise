import phoneIcon from "../imgs/PhoneIcon.png";
import locationIcon from "../imgs/LocationIcon.png";
import type { ContactDetails } from "../types/homepage";

type ContactInfoSectionProps = {
  details: ContactDetails;
};

function ContactInfoSection({ details }: ContactInfoSectionProps) {
  const telephoneUrl = `tel:${details.phone.replace(/[^\d+]/g, "")}`;

  return (
    <section
      className="contact-info-section"
      aria-labelledby="contact-info-title"
    >
      <div className="contact-info-section__inner">
        <div className="contact-info-section__details">
          <h1 id="contact-info-title" className="contact-info-section__title">
            {details.title}
          </h1>

          <a className="contact-info-section__item" href={telephoneUrl}>
            <img src={phoneIcon} alt="" aria-hidden="true" />
            <span>{details.phone}</span>
          </a>

          <a
            className="contact-info-section__item"
            href={details.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            <img src={locationIcon} alt="" aria-hidden="true" />
            <span className="preserve-lines">{details.address}</span>
          </a>
        </div>

        <iframe
          className="contact-info-section__map"
          title={`${details.title} map`}
          src={details.mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

export default ContactInfoSection;
