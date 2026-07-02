import axios from "axios";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { sendContactMessage } from "../api/contact-messages";
import logImage from "../imgs/LogImg.png";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const PHONE_MIN_LENGTH = 7;
const PHONE_MAX_LENGTH = 15;
const QUESTION_MIN_LENGTH = 10;
const QUESTION_MAX_LENGTH = 1000;

type QuestionsSectionProps = {
  title: string;
  description: string;
  buttonText: string;
  image?: string | null;
};

function QuestionsSection({
  title,
  description,
  buttonText,
  image,
}: QuestionsSectionProps) {
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setIsSending(true);
    setToast(null);

    try {
      const message = await sendContactMessage({
        name: String(data.get("name") ?? ""),
        telephone: String(data.get("telephone") ?? ""),
        question: String(data.get("question") ?? ""),
        website: String(data.get("website") ?? ""),
      });

      form.reset();
      setToast({ type: "success", message });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = Number(error.response.headers["retry-after"] ?? 300);
        const minutes = Math.max(1, Math.ceil(retryAfter / 60));
        setToast({
          type: "error",
          message: `Please wait ${minutes} ${minutes === 1 ? "minute" : "minutes"} before sending another.`,
        });
      } else if (axios.isAxiosError(error) && error.response?.status === 422) {
        const response = error.response.data as {
          message?: string;
          errors?: Record<string, string[]>;
        };
        const firstError = Object.values(response.errors ?? {})[0]?.[0];
        setToast({
          type: "error",
          message: firstError || response.message || "Check the form and try again.",
        });
      } else {
        setToast({
          type: "error",
          message: "The message could not be sent. Please try again.",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <section
      id="contact"
      className="questions-section"
      aria-labelledby="questions-title"
      >
        <div className="questions-section__inner">
        <h2 id="questions-title" className="questions-section__title">
          {title}
        </h2>

        <div className="questions-section__layout">
          <form
            className="questions-form"
            onSubmit={handleSubmit}
          >
            <label className="questions-form__honeypot" aria-hidden="true">
              <span>Website</span>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
            <label>
              <span className="questions-form__label">Your name</span>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
              />
            </label>

            <label>
              <span className="questions-form__label">Your telephone number</span>
              <input
                type="tel"
                name="telephone"
                placeholder="Your telephone number"
                inputMode="numeric"
                pattern={`[0-9]{${PHONE_MIN_LENGTH},${PHONE_MAX_LENGTH}}`}
                minLength={PHONE_MIN_LENGTH}
                maxLength={PHONE_MAX_LENGTH}
                title={`Enter ${PHONE_MIN_LENGTH} to ${PHONE_MAX_LENGTH} digits`}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, PHONE_MAX_LENGTH);
                }}
                required
              />
            </label>

            <label>
              <span className="questions-form__label">Your question</span>
              <textarea
                name="question"
                placeholder="Your question"
                rows={5}
                minLength={QUESTION_MIN_LENGTH}
                maxLength={QUESTION_MAX_LENGTH}
                required
              />
            </label>

            <button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : buttonText}
            </button>
          </form>

          <p className="questions-section__copy">
            {description}
          </p>
        </div>

        <img
          className="questions-section__log"
          src={image || logImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />

        </div>
      </section>

      {toast && createPortal(
          <div
            className={`contact-toast contact-toast--${toast.type}`}
            role={toast.type === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">
              {"\u00d7"}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default QuestionsSection;
