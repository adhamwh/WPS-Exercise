import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import favicon from "../imgs/Favicon.png";
import logo from "../imgs-optimized/LogoWhite.webp";

const navigation = [
  { icon: "overview", label: "Overview", path: "/admin", end: true },
  { icon: "homepage", label: "Homepage", path: "/admin/homepage", end: false },
  { icon: "services", label: "Services", path: "/admin/services", end: false },
  { icon: "products", label: "Products", path: "/admin/products", end: false },
  { icon: "images", label: "Images", path: "/admin/images", end: false },
  { icon: "inbox", label: "Inbox", path: "/admin/inbox", end: false },
] as const;

type AdminNavIconName = (typeof navigation)[number]["icon"];

function AdminNavIcon({ name }: { name: AdminNavIconName }) {
  return (
    <span className="admin-sidebar__nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        {name === "overview" && (
          <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </>
        )}
        {name === "homepage" && (
          <>
            <path d="m3.5 10.5 8.5-7 8.5 7" />
            <path d="M5.5 9.5V20h13V9.5M9.5 20v-6h5v6" />
          </>
        )}
        {name === "services" && (
          <>
            <path d="M4 6h4M12 6h8M4 12h10M18 12h2M4 18h2M10 18h10" />
            <circle cx="10" cy="6" r="2" />
            <circle cx="16" cy="12" r="2" />
            <circle cx="8" cy="18" r="2" />
          </>
        )}
        {name === "products" && (
          <>
            <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
          </>
        )}
        {name === "images" && (
          <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9" r="1.5" />
            <path d="m5 17 4.5-4 3.5 3 2.5-2 3.5 3" />
          </>
        )}
        {name === "inbox" && (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
          </>
        )}
      </svg>
    </span>
  );
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const initials = user?.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const currentSection =
    navigation.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    )?.label ?? "Admin";

  return (
    <div
      className={`admin-shell${
        isSidebarCollapsed ? " admin-shell--collapsed" : ""
      }${isMobileMenuOpen ? " admin-shell--mobile-menu-open" : ""}`}
    >
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link
            className="admin-sidebar__logo"
            to="/"
            aria-label="BIO CWT home"
          >
            <img
              src={isSidebarCollapsed ? favicon : logo}
              alt="BIO CWT"
            />
          </Link>
          <button
            className="admin-sidebar__collapse"
            type="button"
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"
            }
            aria-expanded={!isSidebarCollapsed}
            aria-controls="admin-sidebar"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 6-6 6 6 6" />
            </svg>
          </button>
          <button
            className="admin-sidebar__mobile-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="admin-navigation"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
        </div>

        <div className="admin-sidebar__label">Content management</div>
        <nav
          className="admin-sidebar__nav"
          id="admin-navigation"
          aria-label="Admin navigation"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsMobileMenuOpen(false)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                isActive ? "admin-sidebar__nav-link--active" : undefined
              }
            >
              <AdminNavIcon name={item.icon} />
              <span className="admin-sidebar__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Link
          className="admin-sidebar__site-link"
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
          <span>View public website</span>
        </Link>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p>{currentSection}</p>
            <strong>{user?.name}</strong>
          </div>
          <div className="admin-topbar__account">
            <span className="admin-topbar__avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="admin-topbar__email">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
