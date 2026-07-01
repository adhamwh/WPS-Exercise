import { getAdminProductImages } from "../../api/admin";
import AdminCollectionPage from "../../components/admin/AdminCollectionPage";
import type { AdminListItem } from "../../components/admin/AdminCollectionPage";

async function loadImages(): Promise<AdminListItem[]> {
  const images = await getAdminProductImages();

  return images.map((image) => ({
    id: image.id,
    title: image.alt_text || `Image ${image.id}`,
    description: image.image_path,
    meta: image.product?.name || `Product ${image.product_id}`,
    imageUrl: image.image_url,
  }));
}

function ImagesAdminPage() {
  return (
    <AdminCollectionPage
      eyebrow="Images"
      title="Product gallery"
      description="Review every uploaded product image and its current product association."
      emptyMessage="No product images have been uploaded."
      loadItems={loadImages}
    />
  );
}

export default ImagesAdminPage;
