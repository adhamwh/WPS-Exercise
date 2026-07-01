import { useCallback, useEffect, useState } from "react";

export function useAdminCollection<T>(loader: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setItems(await loader());
    } catch {
      setError("Content could not be loaded. Check the API and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    let isActive = true;

    loader()
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
  }, [loader]);

  return { items, setItems, isLoading, error, reload };
}
