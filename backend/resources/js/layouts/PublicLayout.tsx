import Header from "../components/Header";
import Footer from "../components/Footer";
import BackgroundContours from "../components/BackgroundContours";
import type { ContactDetails } from "../types/homepage";

type NavigationItem = {
  label: string;
  href: string;
};

type PublicLayoutProps = {
  children: React.ReactNode;
  navigation: NavigationItem[];
  isScrolled: boolean;
  isMenuOpen: boolean;
  isGalleryPage: boolean;
  isServicesPage: boolean;
  isAboutPage: boolean;
  isContactPage: boolean;
  isNotFoundPage: boolean;
  mainPageClass?: string;
  contactDetails: ContactDetails | null;
  closeMenu: () => void;
  toggleMenu: () => void;
};

function PublicLayout({
  children,
  navigation,
  isScrolled,
  isMenuOpen,
  isGalleryPage,
  isServicesPage,
  isAboutPage,
  isContactPage,
  isNotFoundPage,
  mainPageClass,
  contactDetails,
  closeMenu,
  toggleMenu,
}: PublicLayoutProps) {
  return (
    <div className="home-page">
      <Header
        navigation={navigation}
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        isGalleryPage={isGalleryPage}
        isServicesPage={isServicesPage}
        isAboutPage={isAboutPage}
        isContactPage={isContactPage}
        closeMenu={closeMenu}
        toggleMenu={toggleMenu}
      />

      <BackgroundContours />

      <main className={mainPageClass}>{children}</main>

      <Footer
        isNotFoundPage={isNotFoundPage}
        contactDetails={contactDetails}
      />
    </div>
  );
}

export default PublicLayout;
