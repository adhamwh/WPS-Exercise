import { useState } from "react";
import type { FormEvent } from "react";
import {
  getAdminApiError,
  getAdminHomepageSections,
  updateHomepageSection,
} from "../../api/admin";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAdminCollection } from "../../hooks/useAdminCollection";
import type { HomepageSection } from "../../types/cms";

type SectionFormProps = {
  section: HomepageSection;
  onClose: () => void;
  onSaved: (section: HomepageSection) => void;
};

function SectionForm({ section, onClose, onSaved }: SectionFormProps) {
  const [values, setValues] = useState({
    title: section.title ?? "",
    subtitle: section.subtitle ?? "",
    description: section.description ?? "",
    buttonText: section.button_text ?? "",
    buttonUrl: section.button_url ?? "",
    sortOrder: String(section.sort_order),
    isActive: section.is_active,
  });
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: [] }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setErrors({});

    const data = new FormData();
    data.set("title", values.title);
    data.set("subtitle", values.subtitle);
    data.set("description", values.description);
    data.set("button_text", values.buttonText);
    data.set("button_url", values.buttonUrl);
    data.set("sort_order", values.sortOrder || "0");
    data.set("is_active", values.isActive ? "1" : "0");
    data.set("remove_image", removeImage ? "1" : "0");

    if (image) {
      data.set("image", image);
    }

    try {
      onSaved(await updateHomepageSection(section.id, data));
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
          <span>Title</span>
          <input
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            maxLength={255}
          />
          {errors.title?.[0] && <small>{errors.title[0]}</small>}
        </label>

        <label className="admin-field">
          <span>Subtitle</span>
          <input
            value={values.subtitle}
            onChange={(event) => update("subtitle", event.target.value)}
            maxLength={255}
          />
          {errors.subtitle?.[0] && <small>{errors.subtitle[0]}</small>}
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
          <span>Button text</span>
          <input
            value={values.buttonText}
            onChange={(event) => update("buttonText", event.target.value)}
            maxLength={100}
          />
          {errors.button_text?.[0] && <small>{errors.button_text[0]}</small>}
        </label>

        <label className="admin-field">
          <span>Button URL</span>
          <input
            value={values.buttonUrl}
            onChange={(event) => update("buttonUrl", event.target.value)}
            placeholder="#contact"
            maxLength={2048}
          />
          {errors.button_url?.[0] && <small>{errors.button_url[0]}</small>}
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

        <label className="admin-field">
          <span>Replace section image</span>
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
        {section.image_path && (
          <label className="admin-check admin-check--danger">
            <input
              type="checkbox"
              checked={removeImage}
              onChange={(event) => {
                setRemoveImage(event.target.checked);
                if (event.target.checked) {
                  setImage(null);
                }
              }}
            />
            <span>Remove current image</span>
          </label>
        )}
      </div>

      <div className="admin-form__actions">
        <button type="button" className="admin-button--quiet" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="admin-button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save section"}
        </button>
      </div>
    </form>
  );
}

function HomepageAdminPage() {
  const { items, setItems, isLoading, error, reload } = useAdminCollection(
    getAdminHomepageSections,
  );
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  const handleSaved = (savedSection: HomepageSection) => {
    setItems((current) =>
      current
        .map((section) =>
          section.id === savedSection.id ? savedSection : section,
        )
        .sort((a, b) => a.sort_order - b.sort_order),
    );
  };

  return (
    <section className="admin-management" aria-labelledby="homepage-title">
      <AdminPageHeader
        titleId="homepage-title"
        eyebrow="Homepage"
        title="Page sections"
        description="Edit the copy, buttons, publishing state, order, and section imagery used by the public homepage."
        count={items.length}
        countLabel="sections"
      />

      {error && (
        <div className="admin-data-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void reload()}>Try again</button>
        </div>
      )}
      {isLoading && <div className="admin-data-state">Loading sections...</div>}
      {!isLoading && !error && items.length === 0 && (
        <div className="admin-data-state">No homepage sections are stored.</div>
      )}

      {!isLoading && !error && (
        <div className="admin-manage-list">
          {items.map((section, index) => (
            <article className="admin-manage-row" key={section.id}>
              <span className="admin-manage-row__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.image_url ? (
                <img src={section.image_url} alt="" />
              ) : (
                <span className="admin-manage-row__image-empty" aria-hidden="true" />
              )}
              <div className="admin-manage-row__copy">
                <span>{section.key}</span>
                <h2>{section.title || section.key}</h2>
                <p>{section.description || "No description set."}</p>
              </div>
              <span className={`admin-status${section.is_active ? " admin-status--active" : ""}`}>
                {section.is_active ? "Published" : "Hidden"}
              </span>
              <button
                type="button"
                className="admin-row-action"
                onClick={() => setEditingSection(section)}
              >
                Edit
              </button>
            </article>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={editingSection !== null}
        title={`Edit ${editingSection?.key ?? "section"}`}
        description="Changes are reflected through the public homepage API."
        onClose={() => setEditingSection(null)}
        size="wide"
      >
        {editingSection && (
          <SectionForm
            key={editingSection.id}
            section={editingSection}
            onClose={() => setEditingSection(null)}
            onSaved={handleSaved}
          />
        )}
      </AdminModal>
    </section>
  );
}

export default HomepageAdminPage;
