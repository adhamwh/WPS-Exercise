import logo from "../imgs/LogoWhite.png";
import phoneIcon from "../imgs/PhoneIcon.png";
import locationIcon from "../imgs/LocationIcon.png";
import { Link } from "react-router-dom";

type FooterProps = {
  isNotFoundPage: boolean;
};

function Footer({ isNotFoundPage }: FooterProps) {
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

        <a className="site-footer__contact" href="tel:+420000000000">
          <img src={phoneIcon} alt="" aria-hidden="true" />
          <span>+420 000 000 000</span>
        </a>

        <a
          className="site-footer__contact site-footer__contact--address"
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
    </footer>
  );
}

export default Footer;