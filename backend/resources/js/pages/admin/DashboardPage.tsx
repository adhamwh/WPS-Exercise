import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminContentCounts } from "../../api/admin";

type ContentCounts = Awaited<ReturnType<typeof getAdminContentCounts>>;

const contentAreas = [
  {
    number: "01",
    key: "homepage" as const,
    title: "Homepage",
    description: "Hero, banners, text sections, and homepage imagery.",
    path: "/admin/homepage",
  },
  {
    number: "02",
    key: "services" as const,
    title: "Services",
    description: "Create, update, order, publish, or remove services.",
    path: "/admin/services",
  },
  {
    number: "03",
    key: "products" as const,
    title: "Products",
    description: "Manage wood types, descriptions, and product features.",
    path: "/admin/products",
  },
  {
    number: "04",
    key: "images" as const,
    title: "Images",
    description: "Upload and reorder product and gallery images.",
    path: "/admin/images",
  },
  {
    number: "05",
    key: "messages" as const,
    title: "Inbox",
    description: "Read and manage questions sent through the website.",
    path: "/admin/inbox",
  },
];

function DashboardPage() {
  const [counts, setCounts] = useState<ContentCounts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAdminContentCounts()
      .then(setCounts)
      .catch(() => setError(true));
  }, []);

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="dashboard-page__heading">
        <div>
          <p className="dashboard-page__eyebrow">Overview</p>
          <h1 id="dashboard-title">Website content</h1>
        </div>
        <p>
          Select a content area to review the records currently stored for the
          public website.
        </p>
      </div>

      {error && (
        <div className="dashboard-page__error" role="alert">
          Content totals could not be loaded. Open a section to try again.
        </div>
      )}

      <div className="dashboard-grid">
        {contentAreas.map((area) => (
          <Link className="dashboard-card" to={area.path} key={area.title}>
            <span className="dashboard-card__number">{area.number}</span>
            <div>
              <h2>{area.title}</h2>
              <p>{area.description}</p>
            </div>
            <span className="dashboard-card__status">
              {counts ? `${counts[area.key]} records` : "Loading records"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
