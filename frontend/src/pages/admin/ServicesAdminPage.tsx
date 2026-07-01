import { getAdminServices } from "../../api/admin";
import AdminCollectionPage from "../../components/admin/AdminCollectionPage";
import type { AdminListItem } from "../../components/admin/AdminCollectionPage";

async function loadServices(): Promise<AdminListItem[]> {
  const services = await getAdminServices();

  return services.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description || "No description set.",
    meta: service.slug,
    imageUrl: service.image_url || service.icon_url,
    isActive: service.is_active,
  }));
}

function ServicesAdminPage() {
  return (
    <AdminCollectionPage
      eyebrow="Services"
      title="Service list"
      description="View the services currently available to the public website in their configured order."
      emptyMessage="No services have been created."
      loadItems={loadServices}
    />
  );
}

export default ServicesAdminPage;
