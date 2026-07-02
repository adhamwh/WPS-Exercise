import { useState } from "react";
import type { FormEvent } from "react";
import {
  deleteProductImage,
  getAdminApiError,
  getAdminProductImages,
  getAdminProducts,
  reorderProductImages,
  selectOurWorkGallery,
  updateProductImage,
  uploadProductImage,
} from "../../api/admin";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import type { CmsProduct, ProductImage } from "../../types/cms";

type ImageUploadFormProps = {
  products: CmsProduct[];
  defaultProductId: number | null;
  onClose: () => void;
  onUploaded: (image: ProductImage) => void;
};

function ImageUploadForm({
  products,
  defaultProductId,
  onClose,
  onUploaded,
}: ImageUploadFormProps) {
  const [productId, setProductId] = useState(String(defaultProductId ?? products[0]?.id ?? ""));
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || !productId) {
      setFormError("Choose a product and an image file.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setErrors({});
    const data = new FormData();
    data.set("image", file);
    data.set("alt_text", altText);

    try {
      onUploaded(await uploadProductImage(Number(productId), data));
      onClose();
    } catch (error) {
      const apiError = getAdminApiError(error);
      setFormError(apiError.message);
      setErrors(apiError.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {formError && <div className="admin-form__error" role="alert">{formError}</div>}
      <div className="admin-form__grid">
        <label className="admin-field">
          <span>Product</span>
          <select value={productId} onChange={(event) => setProductId(event.target.value)} required>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </label>
        <label className="admin-field">
          <span>Image file</span>
          <input className="admin-field__file" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
          {errors.image?.[0] && <small>{errors.image[0]}</small>}
        </label>
        <label className="admin-field admin-field--full">
          <span>Alternative text</span>
          <input value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={255} placeholder="Describe the image for accessibility" />
          {errors.alt_text?.[0] && <small>{errors.alt_text[0]}</small>}
        </label>
      </div>
      <div className="admin-form__actions">
        <button type="button" className="admin-button--quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="admin-button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload image"}
        </button>
      </div>
    </form>
  );
}

type ImageAltFormProps = {
  image: ProductImage;
  onClose: () => void;
  onSaved: (image: ProductImage) => void;
};

function ImageAltForm({ image, onClose, onSaved }: ImageAltFormProps) {
  const [altText, setAltText] = useState(image.alt_text ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      onSaved(await updateProductImage(image.id, altText));
      onClose();
    } catch (error) {
      setFormError(getAdminApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {formError && <div className="admin-form__error" role="alert">{formError}</div>}
      <label className="admin-field">
        <span>Alternative text</span>
        <input value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={255} autoFocus />
      </label>
      <div className="admin-form__actions">
        <button type="button" className="admin-button--quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="admin-button--primary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save alt text"}</button>
      </div>
    </form>
  );
}

function ImagesAdminPage() {
  const imagesData = useAdminCollection(getAdminProductImages);
  const productsData = useAdminCollection(getAdminProducts);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [deletingImage, setDeletingImage] = useState<ProductImage | null>(null);
  const [workingImageId, setWorkingImageId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelectingGallery, setIsSelectingGallery] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const activeProductId = selectedProduct ?? productsData.items[0]?.id ?? null;
  const activeProduct = productsData.items.find(
    (product) => product.id === activeProductId,
  );
  const visibleImages = imagesData.items
    .filter((image) => image.product_id === activeProductId)
    .sort((a, b) => a.sort_order - b.sort_order);

  const mergeProductImages = (updated: ProductImage[]) => {
    if (activeProductId === null) return;
    imagesData.setItems((current) => [
      ...current.filter((image) => image.product_id !== activeProductId),
      ...updated,
    ]);
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (activeProductId === null) return;
    const target = index + direction;
    if (target < 0 || target >= visibleImages.length) return;
    const reordered = [...visibleImages];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setWorkingImageId(visibleImages[index].id);
    setActionError(null);
    try {
      mergeProductImages(
        await reorderProductImages(activeProductId, reordered.map((image) => image.id)),
      );
    } catch (error) {
      setActionError(getAdminApiError(error).message);
    } finally {
      setWorkingImageId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingImage) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await deleteProductImage(deletingImage.id);
      imagesData.setItems((current) => current.filter((image) => image.id !== deletingImage.id));
      setDeletingImage(null);
    } catch (error) {
      setActionError(getAdminApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectGallery = async () => {
    if (activeProductId === null || activeProduct?.is_work_gallery) return;

    setIsSelectingGallery(true);
    setActionError(null);

    try {
      const selected = await selectOurWorkGallery(activeProductId);
      productsData.setItems((current) =>
        current.map((product) => ({
          ...product,
          is_work_gallery: product.id === selected.id,
        })),
      );
    } catch (error) {
      setActionError(getAdminApiError(error).message);
    } finally {
      setIsSelectingGallery(false);
    }
  };

  return (
    <section className="admin-management" aria-labelledby="images-title">
      <AdminPageHeader
        titleId="images-title"
        eyebrow="Images"
        title="Product gallery"
        description="Upload accessible product imagery and control the exact display order without dragging on small screens."
        count={imagesData.items.length}
        countLabel="images"
        action={
          <button type="button" className="admin-button--primary" onClick={() => setIsUploadOpen(true)} disabled={productsData.items.length === 0}>
            Upload image
          </button>
        }
      />

      {actionError && <div className="admin-data-error" role="alert">{actionError}</div>}
      {imagesData.error && <div className="admin-data-error" role="alert"><span>{imagesData.error}</span><button type="button" onClick={() => void imagesData.reload()}>Try again</button></div>}
      {productsData.error && <div className="admin-data-error" role="alert">Products could not be loaded.</div>}

      {!productsData.isLoading && productsData.items.length === 0 && (
        <div className="admin-data-state">Create a product before uploading gallery images.</div>
      )}

      {productsData.items.length > 0 && (
        <div className="admin-image-toolbar">
          <label>
            <span>Product gallery</span>
            <select value={activeProductId ?? ""} onChange={(event) => setSelectedProduct(Number(event.target.value))}>
              {productsData.items.map((product) => <option key={product.id} value={product.id}>{product.name}{product.is_work_gallery ? " — Our Work" : ""}</option>)}
            </select>
          </label>
          <div className="admin-image-toolbar__summary">
            <span>{visibleImages.length} images in this gallery</span>
            <button
              type="button"
              className={activeProduct?.is_work_gallery ? "admin-button--quiet" : "admin-button--primary"}
              onClick={() => void handleSelectGallery()}
              disabled={activeProductId === null || activeProduct?.is_work_gallery || isSelectingGallery}
            >
              {activeProduct?.is_work_gallery
                ? "Used in Our Work"
                : isSelectingGallery
                  ? "Selecting..."
                  : "Use for Our Work"}
            </button>
          </div>
        </div>
      )}

      {imagesData.isLoading && <div className="admin-data-state">Loading images...</div>}
      {!imagesData.isLoading && activeProductId !== null && visibleImages.length === 0 && (
        <div className="admin-data-state">This product has no gallery images.</div>
      )}

      {!imagesData.isLoading && visibleImages.length > 0 && (
        <div className="admin-image-grid">
          {visibleImages.map((image, index) => (
            <article className="admin-image-card" key={image.id}>
              <div className="admin-image-card__preview">
                <img src={image.image_url} alt={image.alt_text ?? ""} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="admin-image-card__copy">
                <strong>{image.alt_text || "No alternative text"}</strong>
                <small>{image.image_path}</small>
              </div>
              <div className="admin-image-card__order" aria-label="Image order controls">
                <button type="button" onClick={() => void handleMove(index, -1)} disabled={index === 0 || workingImageId !== null}>Move up</button>
                <button type="button" onClick={() => void handleMove(index, 1)} disabled={index === visibleImages.length - 1 || workingImageId !== null}>Move down</button>
              </div>
              <div className="admin-image-card__actions">
                <button type="button" className="admin-row-action" onClick={() => setEditingImage(image)}>Edit alt text</button>
                <button type="button" className="admin-row-action admin-row-action--danger" onClick={() => setDeletingImage(image)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminModal isOpen={isUploadOpen} title="Upload product image" description="Images are appended to the end of the selected product gallery." onClose={() => setIsUploadOpen(false)}>
        {isUploadOpen && <ImageUploadForm products={productsData.items} defaultProductId={activeProductId} onClose={() => setIsUploadOpen(false)} onUploaded={(image) => { imagesData.setItems((current) => [...current, image]); setSelectedProduct(image.product_id); }} />}
      </AdminModal>

      <AdminModal isOpen={editingImage !== null} title="Edit alternative text" description="Describe meaningful visual content for screen-reader users." onClose={() => setEditingImage(null)}>
        {editingImage && <ImageAltForm key={editingImage.id} image={editingImage} onClose={() => setEditingImage(null)} onSaved={(saved) => imagesData.setItems((current) => current.map((image) => image.id === saved.id ? saved : image))} />}
      </AdminModal>

      <ConfirmDialog
        isOpen={deletingImage !== null}
        title="Delete image?"
        message="This permanently removes the file from storage and the product gallery."
        isWorking={isDeleting}
        onCancel={() => setDeletingImage(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}

export default ImagesAdminPage;
