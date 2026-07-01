import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthApiError } from "../api/auth";
import { useAuth } from "../auth/useAuth";
import heroImage from "../imgs-optimized/HeroImg1.webp";
import logo from "../imgs-optimized/LogoWhite.webp";
import woodBackground from "../imgs-optimized/Woodstock.webp";

type LoginFields = {
  email: string;
  password: string;
};

type LoginFieldErrors = Partial<Record<keyof LoginFields, string>>;

type LoginLocationState = {
  from?: {
    pathname?: string;
    search?: string;
  };
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: LoginFields): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(fields.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!fields.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [fields, setFields] = useState<LoginFields>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state as LoginLocationState | null;
  const requestedPath = state?.from?.pathname;
  const destination = requestedPath?.startsWith("/admin")
    ? `${requestedPath}${state?.from?.search ?? ""}`
    : "/admin";

  const updateField = (field: keyof LoginFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate(fields);
    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: fields.email.trim(),
        password: fields.password,
      });
      navigate(destination, { replace: true });
    } catch (error) {
      const apiError = getAuthApiError(error);

      setFieldErrors({
        email: apiError.errors?.email?.[0],
        password: apiError.errors?.password?.[0],
      });
      setFormError(apiError.message ?? "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-page__wood"
        style={{ backgroundImage: `url(${woodBackground})` }}
        aria-hidden="true"
      />

      <header className="login-page__header">
        <Link to="/" className="login-page__logo" aria-label="BIO CWT home">
          <img src={logo} alt="BIO CWT" />
        </Link>
        <Link to="/" className="login-page__back-link">
          Back to website
        </Link>
      </header>

      <main className="login-page__main">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card__form-panel">
            <p className="login-card__eyebrow">Admin CMS</p>
            <h1 id="login-title">Welcome back</h1>
            <p className="login-card__intro">
              Sign in to manage website content, services, products, and
              images.
            </p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="login-form__alert" role="alert">
                  {formError}
                </div>
              )}

              <label className="login-form__field" htmlFor="login-email">
                <span>Email address</span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  autoComplete="email"
                  placeholder="admin@example.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  disabled={isSubmitting}
                />
                {fieldErrors.email && (
                  <small id="email-error">{fieldErrors.email}</small>
                )}
              </label>

              <label className="login-form__field" htmlFor="login-password">
                <span>Password</span>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={fields.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  disabled={isSubmitting}
                />
                {fieldErrors.password && (
                  <small id="password-error">{fieldErrors.password}</small>
                )}
              </label>

              <button
                className="login-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <div className="login-card__visual" aria-hidden="true">
            <img src={heroImage} alt="" />
            <div className="login-card__visual-copy">
              <span>Secure content management</span>
              <strong>Built for BIO CWT</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
