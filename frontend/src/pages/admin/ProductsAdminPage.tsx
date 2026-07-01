import { getAdminProducts } from "../../api/admin";
import AdminCollectionPage from "../../components/admin/AdminCollectionPage";
import type { AdminListItem } from "../../components/admin/AdminCollectionPage";

async function loadProducts(): Promise<AdminListItem[]> {
  const products = await getAdminProducts();

  return products.map((product) => ({
    id: product.id,
    title: product.name,
    description:
      product.short_description || product.description || "No description set.",
    meta: `${product.slug} · ${product.images.length} images`,
    imageUrl: product.image_url || product.images[0]?.image_url,
    isActive: product.is_active,
  }));
}

function ProductsAdminPage() {
  return (
    <AdminCollectionPage
      eyebrow="Products"
      title="Wood types"
      description="View product details, publishing state, features, and attached image totals."
      emptyMessage="No products have been created."
      loadItems={loadProducts}
    />
  );
}

export default ProductsAdminPage;
