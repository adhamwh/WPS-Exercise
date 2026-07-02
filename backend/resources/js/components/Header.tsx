import logo from "../imgs/LogoWhite.png";
import { NavLink } from "react-router-dom";

type NavigationItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  navigation: NavigationItem[];
  isScrolled: boolean;
  isMenuOpen: boolean;
  isGalleryPage: boolean;
  isServicesPage: boolean;
  isAboutPage: boolean;
  isContactPage: boolean;
  closeMenu: () => void;
  toggleMenu: () => void;
};

function Header({
  navigation,
  isScrolled,
  isMenuOpen,
  isGalleryPage,
  isServicesPage,
  isAboutPage,
  isContactPage,
  closeMenu,
  toggleMenu,
}: HeaderProps) {
  return (
    <header
      className={`site-header${
        isScrolled ||
        isGalleryPage ||
        isServicesPage ||
        isAboutPage ||
        isContactPage
          ? " site-header--scrolled"
          : ""
      }${isMenuOpen ? " site-header--menu-open" : ""}`}
    >
      <div className="site-header__inner">
        <NavLink className="site-header__brand" to="/" aria-label="BIO CWT home">
          <img src={logo} alt="BIO CWT" />
        </NavLink>

        <button
          className="site-header__menu-button"
          type="button"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`site-header__nav${
            isMenuOpen ? " site-header__nav--open" : ""
          }`}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              className={
                (item.label === "Gallery" && isGalleryPage) ||
                (item.label === "Prices for services" && isServicesPage) ||
                (item.label === "About us" && isAboutPage) ||
                (item.label === "Contact" && isContactPage)
                  ? "site-header__nav-link--active"
                  : undefined
              }
              to={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;