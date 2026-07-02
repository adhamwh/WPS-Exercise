import { useState } from "react";
import type { FormEvent } from "react";
import {
  createService,
  deleteService,
  getAdminApiError,
  getAdminServices,
  updateService,
} from "../../api/admin";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import type { CmsService } from "../../types/cms";

type ServiceFormProps = {
  service: CmsService | null;
  onClose: () => void;
  onSaved: (service: CmsService) => void;
};

function ServiceForm({ service, onClose, onSaved }: ServiceFormProps) {
  const [values, setValues] = useState({
    title: service?.title ?? "",
    slug: service?.slug ?? "",
    description: service?.description ?? "",
    sortOrder: String(service?.sort_order ?? 0),
    isActive: service?.is_active ?? true,
  });
  const [icon, setIcon] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [removeIcon, setRemoveIcon] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setFormError(null);

    const data = new FormData();
    data.set("title", values.title.trim());
    data.set("slug", values.slug.trim());
    data.set("description", values.description);
    data.set("sort_order", values.sortOrder || "0");
    data.set("is_active", values.isActive ? "1" : "0");
    data.set("remove_icon", removeIcon ? "1" : "0");
    data.set("remove_image", removeImage ? "1" : "0");

    if (icon) data.set("icon", icon);
    if (image) data.set("image", image);

    try {
      const saved = service
        ? await updateService(service.id, data)
        : await createService(data);
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
          <span>Service title</span>
          <input
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            required
            maxLength={255}
          />
          {errors.title?.[0] && <small>{errors.title[0]}</small>}
        </label>
        <label className="admin-field">
          <span>Slug</span>
          <input
            value={values.slug}
            onChange={(event) => update("slug", event.target.value)}
            placeholder="Generated from the title"
            maxLength={255}
          />
          {errors.slug?.[0] && <small>{errors.slug[0]}</small>}
        </label>
        <label className="admin-field admin-field--full">
          <span>Description</span>
          <textarea
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            rows={5}
            maxLength={10000}
          />
          {errors.description?.[0] && <small>{errors.description[0]}</small>}
        </label>
        <label className="admin-field">
          <span>Display order</span>
          <input
            type="number"
            min="0"
            value={values.sortOrder}
            onChange={(event) => update("sortOrder", event.target.value)}
          />
          {errors.sort_order?.[0] && <small>{errors.sort_order[0]}</small>}
        </label>
        <span className="admin-field admin-field--spacer" aria-hidden="true" />
        <label className="admin-field">
          <span>Service icon</span>
          <input
            className="admin-field__file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              setIcon(event.target.files?.[0] ?? null);
              setRemoveIcon(false);
            }}
          />
          {errors.icon?.[0] && <small>{errors.icon[0]}</small>}
        </label>
        <label className="admin-field">
          <span>Service image</span>
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

      <div className="admin-form__toggles">
        <label className="admin-check">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => update("isActive", event.target.checked)}
          />
          <span>Published on the website</span>
        </label>
        {service?.icon_path && (
          <label className="admin-check admin-check--danger">
            <input
              type="checkbox"
              checked={removeIcon}
              onChange={(event) => setRemoveIcon(event.target.checked)}
            />
            <span>Remove current icon</span>
          </label>
        )}
        {service?.image_path && (
          <label className="admin-check admin-check--danger">
            <input
              type="checkbox"
              checked={removeImage}
              onChange={(event) => setRemoveImage(event.target.checked)}
            />
            <span>Remove current image</span>
          </label>
        )}
      </div>

      <div className="admin-form__actions">
        <button type="button" className="admin-button--quiet" onClick={onClose}>Cancel</button>
        <button type="submit" className="admin-button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : service ? "Save service" : "Create service"}
        </button>
      </div>
    </form>
  );
}

function ServicesAdminPage() {
  const { items, setItems, isLoading, error, reload } = useAdminCollection(
    getAdminServices,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<CmsService | null>(null);
  const [deletingService, setDeletingService] = useState<CmsService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const openEdit = (service: CmsService) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleSaved = (saved: CmsService) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === saved.id);
      const next = exists
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [...current, saved];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      await deleteService(deletingService.id);
      setItems((current) => current.filter((item) => item.id !== deletingService.id));
      setDeletingService(null);
    } catch (error) {
      setActionError(getAdminApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="admin-management" aria-labelledby="services-title">
      <AdminPageHeader
        titleId="services-title"
        eyebrow="Services"
        title="Service list"
        description="Create, edit, publish, order, and remove the services displayed by the public API."
        count={items.length}
        action={<button type="button" className="admin-button--primary" onClick={openCreate}>Add service</button>}
      />

      {actionError && <div className="admin-data-error" role="alert">{actionError}</div>}
      {error && <div className="admin-data-error" role="alert"><span>{error}</span><button type="button" onClick={() => void reload()}>Try again</button></div>}
      {isLoading && <div className="admin-data-state">Loading services...</div>}
      {!isLoading && !error && items.length === 0 && <div className="admin-data-state">No services have been created.</div>}

      {!isLoading && !error && (
        <div className="admin-manage-list">
          {items.map((service, index) => (
            <article className="admin-manage-row" key={service.id}>
              <span className="admin-manage-row__number">{String(index + 1).padStart(2, "0")}</span>
              {service.image_url || service.icon_url ? (
                <img src={service.image_url || service.icon_url || ""} alt="" />
              ) : (
                <span className="admin-manage-row__image-empty" aria-hidden="true" />
              )}
              <div className="admin-manage-row__copy">
                <span>{service.slug}</span>
                <h2>{service.title}</h2>
                <p>{service.description || "No description set."}</p>
              </div>
              <span className={`admin-status${service.is_active ? " admin-status--active" : ""}`}>
                {service.is_active ? "Published" : "Hidden"}
              </span>
              <div className="admin-manage-row__actions">
                <button type="button" className="admin-row-action" onClick={() => openEdit(service)}>Edit</button>
                <button type="button" className="admin-row-action admin-row-action--danger" onClick={() => setDeletingService(service)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isFormOpen}
        title={editingService ? "Edit service" : "Add service"}
        description="Slugs are generated automatically when left empty."
        onClose={() => setIsFormOpen(false)}
        size="wide"
      >
        {isFormOpen && (
          <ServiceForm
            key={editingService?.id ?? "new"}
            service={editingService}
            onClose={() => setIsFormOpen(false)}
            onSaved={handleSaved}
          />
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={deletingService !== null}
        title="Delete service?"
        message={`This will permanently remove “${deletingService?.title ?? "this service"}” and its uploaded media.`}
        isWorking={isDeleting}
        onCancel={() => setDeletingService(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}

export default ServicesAdminPage;
