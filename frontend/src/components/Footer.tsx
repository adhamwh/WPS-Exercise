import logo from "../imgs/LogoWhite.png";
import phoneIcon from "../imgs/PhoneIcon.png";
import locationIcon from "../imgs/LocationIcon.png";
import { Link } from "react-router-dom";
import type { ContactDetails } from "../types/homepage";

type FooterProps = {
  isNotFoundPage: boolean;
  contactDetails: ContactDetails | null;
};

function Footer({ isNotFoundPage, contactDetails }: FooterProps) {
  if (isNotFoundPage) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <Link to="/" aria-label="BIO CWT home">
            <img className="site-footer__logo" src={logo} alt="BIO CWT" />
          </Link>
          <a className="site-footer__privacy" href="#privacy">
            Privacy Policy
          </a>
        </div>

        {contactDetails && (
          <a
            className="site-footer__contact"
            href={`tel:${contactDetails.phone.replace(/[^\d+]/g, "")}`}
          >
            <img src={phoneIcon} alt="" aria-hidden="true" />
            <span>{contactDetails.phone}</span>
          </a>
        )}

        {contactDetails && (
          <a
            className="site-footer__contact site-footer__contact--address"
            href={contactDetails.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            <img src={locationIcon} alt="" aria-hidden="true" />
            <span className="preserve-lines">{contactDetails.address}</span>
          </a>
        )}
      </div>
    </footer>
  );
}

export default Footer;
