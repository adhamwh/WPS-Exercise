import { useCallback, useEffect, useState } from "react";
import {
  clearContactMessages,
  deleteContactMessage,
  getAdminApiError,
  getAdminContactMessage,
  getAdminContactMessages,
} from "../../api/admin";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import type {
  ContactMessage,
  PaginatedResourceCollection,
} from "../../types/cms";

type PaginationMeta = PaginatedResourceCollection<ContactMessage>["meta"];

function formatMessageDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function InboxAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const loadMessages = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminContactMessages(targetPage);
      setMessages(response.data);
      setMeta(response.meta);
    } catch (loadError) {
      setError(getAdminApiError(loadError).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    getAdminContactMessages(page)
      .then((response) => {
        if (isActive) {
          setMessages(response.data);
          setMeta(response.meta);
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(getAdminApiError(loadError).message);
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
  }, [page]);

  const handleView = async (message: ContactMessage) => {
    setViewingId(message.id);
    setError(null);

    try {
      const opened = await getAdminContactMessage(message.id);
      setSelectedMessage(opened);
      setMessages((current) =>
        current.map((item) => (item.id === opened.id ? opened : item)),
      );
    } catch (viewError) {
      setError(getAdminApiError(viewError).message);
    } finally {
      setViewingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingMessage) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteContactMessage(deletingMessage.id);
      setDeletingMessage(null);
      if (selectedMessage?.id === deletingMessage.id) {
        setSelectedMessage(null);
      }

      if (messages.length === 1 && page > 1) {
        setIsLoading(true);
        setPage((current) => current - 1);
      } else {
        await loadMessages(page);
      }
    } catch (deleteError) {
      setError(getAdminApiError(deleteError).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    setError(null);

    try {
      await clearContactMessages();
      setMessages([]);
      setMeta((current) => current ? {
        ...current,
        current_page: 1,
        from: null,
        last_page: 1,
        to: null,
        total: 0,
      } : null);
      setPage(1);
      setSelectedMessage(null);
      setIsClearOpen(false);
    } catch (clearError) {
      setError(getAdminApiError(clearError).message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <section className="admin-management" aria-labelledby="inbox-title">
      <AdminPageHeader
        titleId="inbox-title"
        eyebrow="Inbox"
        title="Customer questions"
        description="Read and manage questions submitted through the public website form."
        count={meta?.total ?? messages.length}
        countLabel="messages"
        action={
          <button
            type="button"
            className="admin-button--danger"
            onClick={() => setIsClearOpen(true)}
            disabled={(meta?.total ?? 0) === 0}
          >
            Clear inbox
          </button>
        }
      />

      {error && (
        <div className="admin-data-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void loadMessages(page)}>Try again</button>
        </div>
      )}

      {isLoading && <div className="admin-data-state">Loading messages...</div>}
      {!isLoading && !error && messages.length === 0 && (
        <div className="admin-data-state">No questions have been received yet.</div>
      )}

      {!isLoading && messages.length > 0 && (
        <div className="admin-inbox-list">
          {messages.map((message) => (
            <article
              className={`admin-inbox-card${message.is_read ? "" : " admin-inbox-card--unread"}`}
              key={message.id}
            >
              <div className="admin-inbox-card__status" aria-label={message.is_read ? "Read" : "Unread"}>
                <span />
              </div>
              <div className="admin-inbox-card__sender">
                <strong>{message.name}</strong>
                <a href={`tel:${message.telephone}`}>{message.telephone}</a>
              </div>
              <p>{message.question}</p>
              <time dateTime={message.created_at}>{formatMessageDate(message.created_at)}</time>
              <div className="admin-inbox-card__actions">
                <button
                  type="button"
                  className="admin-row-action"
                  onClick={() => void handleView(message)}
                  disabled={viewingId !== null}
                >
                  {viewingId === message.id ? "Opening..." : "View"}
                </button>
                <button
                  type="button"
                  className="admin-row-action admin-row-action--danger"
                  onClick={() => setDeletingMessage(message)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <nav className="admin-inbox-pagination" aria-label="Inbox pages">
          <button type="button" onClick={() => { setIsLoading(true); setPage((current) => current - 1); }} disabled={page <= 1 || isLoading}>
            Previous
          </button>
          <span>Page {meta.current_page} of {meta.last_page}</span>
          <button type="button" onClick={() => { setIsLoading(true); setPage((current) => current + 1); }} disabled={page >= meta.last_page || isLoading}>
            Next
          </button>
        </nav>
      )}

      <AdminModal
        isOpen={selectedMessage !== null}
        title={selectedMessage ? `Message from ${selectedMessage.name}` : "Message"}
        description={selectedMessage ? formatMessageDate(selectedMessage.created_at) : undefined}
        onClose={() => setSelectedMessage(null)}
        size="wide"
      >
        {selectedMessage && (
          <div className="admin-inbox-message">
            <div>
              <span>Telephone</span>
              <a href={`tel:${selectedMessage.telephone}`}>{selectedMessage.telephone}</a>
            </div>
            <div>
              <span>Question</span>
              <p>{selectedMessage.question}</p>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={deletingMessage !== null}
        title="Delete message?"
        message={`This permanently removes the message from ${deletingMessage?.name ?? "this sender"}.`}
        isWorking={isDeleting}
        onCancel={() => setDeletingMessage(null)}
        onConfirm={() => void handleDelete()}
      />

      <ConfirmDialog
        isOpen={isClearOpen}
        title="Clear the inbox?"
        message="This permanently removes every customer question. This action cannot be undone."
        confirmLabel="Clear all"
        isWorking={isClearing}
        onCancel={() => setIsClearOpen(false)}
        onConfirm={() => void handleClear()}
      />
    </section>
  );
}

export default InboxAdminPage;
