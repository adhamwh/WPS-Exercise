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
  { number: "01", label: "Overview", path: "/admin", end: true },
  { number: "02", label: "Homepage", path: "/admin/homepage" },
  { number: "03", label: "Services", path: "/admin/services" },
  { number: "04", label: "Products", path: "/admin/products" },
  { number: "05", label: "Images", path: "/admin/images" },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      }`}
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
        </div>

        <div className="admin-sidebar__label">Content management</div>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={isSidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                isActive ? "admin-sidebar__nav-link--active" : undefined
              }
            >
              <span className="admin-sidebar__nav-number" aria-hidden="true">
                {item.number}
              </span>
              <span className="admin-sidebar__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Link className="admin-sidebar__site-link" to="/">
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
