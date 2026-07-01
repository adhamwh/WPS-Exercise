import phoneIcon from "../imgs/PhoneIcon.png";
import locationIcon from "../imgs/LocationIcon.png";

function ContactInfoSection() {
  return (
    <section
      className="contact-info-section"
      aria-labelledby="contact-info-title"
    >
      <div className="contact-info-section__inner">
        <div className="contact-info-section__details">
          <h1 id="contact-info-title" className="contact-info-section__title">
            CONTACT
          </h1>

          <a className="contact-info-section__item" href="tel:+420000000000">
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
  );
}

export default ContactInfoSection;