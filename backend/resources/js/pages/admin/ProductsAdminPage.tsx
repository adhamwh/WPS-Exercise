import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  createProduct,
  deleteProduct,
  getAdminApiError,
  getAdminProducts,
  updateProduct,
} from "../../api/admin";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import type { CmsProduct } from "../../types/cms";

const MAX_PUBLISHED_PRODUCTS = 6;

type EditableFeature = {
  key: number;
  label: string;
  positive: boolean;
};

type ProductFormProps = {
  product: CmsProduct | null;
  productCount: number;
  publishedCount: number;
  onClose: () => void;
  onSaved: (product: CmsProduct) => void;
};

function ProductForm({
  product,
  productCount,
  publishedCount,
  onClose,
  onSaved,
}: ProductFormProps) {
  const featureKey = useRef(product?.features?.length ?? 0);
  const maximumPosition = Math.max(
    1,
    product ? productCount : productCount + 1,
  );
  const canPublish = Boolean(product?.is_active) || publishedCount < MAX_PUBLISHED_PRODUCTS;
  const [values, setValues] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    shortDescription: product?.short_description ?? "",
    description: product?.description ?? "",
    sortOrder: String(
      product
        ? Math.min(maximumPosition, Math.max(1, product.sort_order))
        : maximumPosition,
    ),
    isActive: product?.is_active ?? canPublish,
  });
  const [features, setFeatures] = useState<EditableFeature[]>(
    (product?.features ?? []).map((feature, index) => ({
      key: index,
      ...feature,
    })),
  );
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const addFeature = () => {
    featureKey.current += 1;
    setFeatures((current) => [
      ...current,
      { key: featureKey.current, label: "", positive: true },
    ]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setFormError(null);

    const data = new FormData();
    data.set("name", values.name.trim());
    data.set("slug", values.slug.trim());
    data.set("short_description", values.shortDescription);
    data.set("description", values.description);
    data.set("sort_order", values.sortOrder || "0");
    data.set("is_active", values.isActive ? "1" : "0");
    data.set("remove_image", removeImage ? "1" : "0");

    if (features.length === 0) {
      data.set("features", "");
    } else {
      features.forEach((feature, index) => {
        data.set(`features[${index}][label]`, feature.label.trim());
        data.set(`features[${index}][positive]`, feature.positive ? "1" : "0");
      });
    }

    if (image) data.set("image", image);

    try {
      const saved = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);
      onSaved(saved);
      onClose();
    } catch (error) {
      const apiError = getAdminApiError(error);
      setErrors(apiError.errors);
      setFormError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {formError && <div className="admin-form__error" role="alert">{formError}</div>}
      <div className="admin-form__grid">
        <label className="admin-field">
          <span>Product name</span>
          <input value={values.name} onChange={(event) => update("name", event.target.value)} required maxLength={255} />
          {errors.name?.[0] && <small>{errors.name[0]}</small>}
        </label>
        <label className="admin-field">
          <span>Slug</span>
          <input value={values.slug} onChange={(event) => update("slug", event.target.value)} placeholder="Generated from the name" maxLength={255} />
          {errors.slug?.[0] && <small>{errors.slug[0]}</small>}
        </label>
        <label className="admin-field admin-field--full">
          <span>Short description</span>
          <textarea value={values.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} rows={3} maxLength={1000} />
          {errors.short_description?.[0] && <small>{errors.short_description[0]}</small>}
        </label>
        <label className="admin-field admin-field--full">
          <span>Full description</span>
          <textarea value={values.description} onChange={(event) => update("description", event.target.value)} rows={5} maxLength={20000} />
          {errors.description?.[0] && <small>{errors.description[0]}</small>}
        </label>
        <label className="admin-field">
          <span>Display position</span>
          <select value={values.sortOrder} onChange={(event) => update("sortOrder", event.target.value)}>
            {Array.from({ length: maximumPosition }, (_, index) => index + 1).map(
              (position) => (
                <option key={position} value={position}>
                  {position} of {maximumPosition}
                </option>
              ),
            )}
          </select>
          {errors.sort_order?.[0] && <small>{errors.sort_order[0]}</small>}
        </label>
        <label className="admin-field">
          <span>Primary image</span>
          <input
            className="admin-field__file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              setImage(event.target.files?.[0] ?? null);
              setRemoveImage(false);
            }}
          />
          {errors.image?.[0] && <small>{errors.image[0]}</small>}
        </label>
      </div>

      <div className="admin-feature-editor">
        <div className="admin-feature-editor__header">
          <div>
            <h3>Product features</h3>
            <p>Add positive or negative characteristics shown with the product.</p>
          </div>
          <button type="button" className="admin-button--quiet" onClick={addFeature}>Add feature</button>
        </div>
        {features.length === 0 && <div className="admin-feature-editor__empty">No features added.</div>}
        {features.map((feature, index) => (
          <div className="admin-feature-row" key={feature.key}>
            <label className="admin-field">
              <span>Feature {index + 1}</span>
              <input
                value={feature.label}
                onChange={(event) =>
                  setFeatures((current) =>
                    current.map((item) =>
                      item.key === feature.key ? { ...item, label: event.target.value } : item,
                    ),
                  )
                }
                required
                maxLength={100}
              />
              {errors[`features.${index}.label`]?.[0] && <small>{errors[`features.${index}.label`][0]}</small>}
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={feature.positive}
                onChange={(event) =>
                  setFeatures((current) =>
                    current.map((item) =>
                      item.key === feature.key ? { ...item, positive: event.target.checked } : item,
                    ),
                  )
                }
              />
              <span>Positive</span>
            </label>
            <button type="button" className="admin-row-action admin-row-action--danger" onClick={() => setFeatures((current) => current.filter((item) => item.key !== feature.key))}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="admin-form__toggles">
        <div className="admin-publish-control">
          <label className="admin-check">
            <input
              type="checkbox"
              checked={values.isActive}
              disabled={!canPublish}
              onChange={(event) => update("isActive", event.target.checked)}
            />
            <span>Published on the website</span>
          </label>
          <small className={errors.is_active?.[0] ? "admin-publish-control__error" : undefined}>
            {errors.is_active?.[0] ||
              `${publishedCount} of ${MAX_PUBLISHED_PRODUCTS} publishing slots are currently used.`}
          </small>
        </div>
        {product?.image_path && (
          <label className="admin-check admin-check--danger">
            <input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />
            <span>Remove current primary image</span>
          </label>
        )}
      </div>

      <div className="admin-form__actions">
        <button type="button" className="admin-button--quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="admin-button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Save product" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function ProductsAdminPage() {
  const { items, setItems, isLoading, error, reload } = useAdminCollection(getAdminProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CmsProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<CmsProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const publishedCount = items.filter((product) => product.is_active).length;

  const openCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };
  const openEdit = (product: CmsProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  const handleSaved = (saved: CmsProduct) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === saved.id);
      const next = exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [...current, saved];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
    void reload();
  };
  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await deleteProduct(deletingProduct.id);
      setItems((current) => current.filter((item) => item.id !== deletingProduct.id));
      setDeletingProduct(null);
      await reload();
    } catch (error) {
      setActionError(getAdminApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="admin-management" aria-labelledby="products-title">
      <AdminPageHeader
        titleId="products-title"
        eyebrow="Products"
        title="Wood types"
        description="Create and maintain product descriptions, features, publishing state, order, and primary images."
        count={publishedCount}
        countLabel={`of ${MAX_PUBLISHED_PRODUCTS} published`}
        action={<button type="button" className="admin-button--primary" onClick={openCreate}>Add product</button>}
      />

      {actionError && <div className="admin-data-error" role="alert">{actionError}</div>}
      {error && <div className="admin-data-error" role="alert"><span>{error}</span><button type="button" onClick={() => void reload()}>Try again</button></div>}
      {isLoading && <div className="admin-data-state">Loading products...</div>}
      {!isLoading && !error && items.length === 0 && <div className="admin-data-state">No products have been created.</div>}

      {!isLoading && !error && (
        <div className="admin-manage-list">
          {items.map((product, index) => (
            <article className="admin-manage-row" key={product.id}>
              <span className="admin-manage-row__number">{String(index + 1).padStart(2, "0")}</span>
              {product.image_url ? (
                <img src={product.image_url} alt="" />
              ) : (
                <span className="admin-manage-row__image-empty" aria-hidden="true" />
              )}
              <div className="admin-manage-row__copy">
                <span>{product.slug} / {product.images.length} gallery images</span>
                <h2>{product.name}</h2>
                <p>{product.short_description || product.description || "No description set."}</p>
              </div>
              <span className={`admin-status${product.is_active ? " admin-status--active" : ""}`}>
                {product.is_active ? "Published" : "Hidden"}
              </span>
              <div className="admin-manage-row__actions">
                <button type="button" className="admin-row-action" onClick={() => openEdit(product)}>Edit</button>
                <button type="button" className="admin-row-action admin-row-action--danger" onClick={() => setDeletingProduct(product)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminModal isOpen={isFormOpen} title={editingProduct ? "Edit product" : "Add product"} description="Product features support positive and negative indicators." onClose={() => setIsFormOpen(false)} size="wide">
        {isFormOpen && (
          <ProductForm
            key={editingProduct?.id ?? "new"}
            product={editingProduct}
            productCount={items.length}
            publishedCount={publishedCount}
            onClose={() => setIsFormOpen(false)}
            onSaved={handleSaved}
          />
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={deletingProduct !== null}
        title="Delete product?"
        message={`This permanently removes “${deletingProduct?.name ?? "this product"}” and every uploaded gallery image attached to it.`}
        isWorking={isDeleting}
        onCancel={() => setDeletingProduct(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}

export default ProductsAdminPage;
