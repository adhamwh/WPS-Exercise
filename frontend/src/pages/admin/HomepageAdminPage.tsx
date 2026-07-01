import { getAdminHomepageSections } from "../../api/admin";
import AdminCollectionPage from "../../components/admin/AdminCollectionPage";
import type { AdminListItem } from "../../components/admin/AdminCollectionPage";

async function loadHomepageSections(): Promise<AdminListItem[]> {
  const sections = await getAdminHomepageSections();

  return sections.map((section) => ({
    id: section.id,
    title: section.title || section.key,
    description: section.description || "No description set.",
    meta: section.key,
    imageUrl: section.image_url,
    isActive: section.is_active,
  }));
}

function HomepageAdminPage() {
  return (
    <AdminCollectionPage
      eyebrow="Homepage"
      title="Page sections"
      description="Review the hero, banners, text blocks, buttons, and section images currently stored for the homepage."
      emptyMessage="No homepage sections are stored."
      loadItems={loadHomepageSections}
    />
  );
}

export default HomepageAdminPage;
