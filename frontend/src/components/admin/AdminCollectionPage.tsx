import { useCallback, useEffect, useState } from "react";

export type AdminListItem = {
  id: number;
  title: string;
  description: string;
  meta: string;
  imageUrl?: string | null;
  isActive?: boolean;
};

type AdminCollectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  loadItems: () => Promise<AdminListItem[]>;
};

function AdminCollectionPage({
  eyebrow,
  title,
  description,
  emptyMessage,
  loadItems,
}: AdminCollectionPageProps) {
  const [items, setItems] = useState<AdminListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setItems(await loadItems());
    } catch {
      setError("Content could not be loaded. Check the API and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [loadItems]);

  useEffect(() => {
    let isActive = true;

    loadItems()
      .then((loadedItems) => {
        if (isActive) {
          setItems(loadedItems);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Content could not be loaded. Check the API and try again.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [loadItems]);

  return (
    <section className="admin-collection" aria-labelledby="collection-title">
      <div className="admin-collection__heading">
        <div>
          <p>{eyebrow}</p>
          <h1 id="collection-title">{title}</h1>
        </div>
        <div className="admin-collection__heading-copy">
          <span>{isLoading ? "Loading" : `${items.length} total`}</span>
          <p>{description}</p>
        </div>
      </div>

      {error && (
        <div className="admin-collection__error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void load()}>
            Try again
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="admin-collection__state" role="status">
          Loading content…
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="admin-collection__state">{emptyMessage}</div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="admin-collection__list">
          {items.map((item, index) => (
            <article className="admin-content-row" key={item.id}>
              <span className="admin-content-row__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" loading="lazy" />
              ) : (
                <span className="admin-content-row__image-empty" aria-hidden="true" />
              )}
              <div className="admin-content-row__copy">
                <span>{item.meta}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              {typeof item.isActive === "boolean" && (
                <span
                  className={`admin-content-row__status${
                    item.isActive ? " admin-content-row__status--active" : ""
                  }`}
                >
                  {item.isActive ? "Published" : "Hidden"}
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminCollectionPage;
