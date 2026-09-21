import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  forgotPassword,
  loginUser,
  getMyUser,
  resetPassword,
} from "../services/api";

function Login() {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [emailFocused, setEmailFocused] =
    useState(false);
  const [passwordFocused, setPasswordFocused] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const token = params.get("reset_token");

    if (token) {
      setResetToken(token);
      setMode("reset");
      setMessage(
        "Create a new password for your account."
      );
    }
  }, []);

  async function handleLogin(event) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const data = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      const user = await getMyUser();

      if (user.role !== role) {
        localStorage.removeItem(
          "access_token"
        );

        setMessage(
          `This account is registered as ${user.role}, not ${role}.`
        );

        return;
      }

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "PATIENT") {
        navigate("/patient");
      } else {
        localStorage.removeItem(
          "access_token"
        );

        setMessage(
          "This account has an unsupported role."
        );
      }
    } catch (error) {
      localStorage.removeItem(
        "access_token"
      );

      setMessage(
        error?.message ||
          "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(event) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      await forgotPassword(email);

      setMessage(
        "If the email exists, a password reset link has been sent. Please check your email."
      );
    } catch (error) {
      setMessage(
        error?.message ||
          "Unable to create the password reset request."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    setMessage("");

    if (!resetToken) {
      setMessage(
        "This password reset link is invalid or missing."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(
        "New password and confirmation password do not match."
      );
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(
        resetToken,
        newPassword,
        confirmPassword
      );

      setEmail("");
      setPassword("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      setMode("login");
      setMessage(
        "Password reset successfully. You can now sign in with your new password."
      );
    } catch (error) {
      setMessage(
        error?.message ||
          "Unable to reset your password."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function switchToLogin() {
    setMode("login");
    setMessage("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  }

  function getPasswordStrength(value) {
    let score = 0;

    if (value.length >= 8) {
      score += 1;
    }

    if (/[A-Z]/.test(value)) {
      score += 1;
    }

    if (/[a-z]/.test(value)) {
      score += 1;
    }

    if (/[0-9]/.test(value)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(value)) {
      score += 1;
    }

    if (score >= 5) {
      return "Strong";
    }

    if (score >= 3) {
      return "Medium";
    }

    return "Weak";
  }

  const isFormReady =
    email.trim() !== "" &&
    password.trim() !== "" &&
    !isLoading;

  if (mode === "forgot") {
    return (
      <main className="login-page">
        <div
          className="login-orb login-orb-one"
          aria-hidden="true"
        />

        <div
          className="login-orb login-orb-two"
          aria-hidden="true"
        />

        <div
          className="login-grid"
          aria-hidden="true"
        />

        <section className="login-container">
          <div className="login-card">
            <div
              className="login-card-accent"
              aria-hidden="true"
            />

            <div className="login-brand">
              <div className="login-brand-mark">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M24 42S9 30.9 9 18.4C9 10.8 14.1 6 20.1 6c3.4 0 6.1 1.7 7.9 4.4C29.8 7.7 32.5 6 35.9 6 41.9 6 47 10.8 47 18.4 47 30.9 32 42 24 42Z"
                    fill="currentColor"
                    transform="translate(-4 0)"
                  />

                  <path
                    d="M24 13V29"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M16 21H32"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="login-brand-text">
                <span className="login-brand-name">
                  Digital Immunisation
                </span>

                <span className="login-brand-subtitle">
                  Digital healthcare management
                </span>
              </div>
            </div>

            <div className="login-heading">
              <span className="login-eyebrow">
                Account recovery
              </span>

              <h1>Forgot your password?</h1>

              <p>
                Enter your email address and we will
                send you a password reset link.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleForgotPassword}
            >
              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="forgot-email">
                    Email address
                  </label>
                </div>

                <div
                  className={`login-control ${
                    emailFocused
                      ? "login-control-focused"
                      : ""
                  }`}
                >
                  <span
                    className="login-control-icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="3.5"
                        y="5"
                        width="17"
                        height="14"
                        rx="2.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="m4.5 7 7.5 6 7.5-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setMessage("");
                    }}
                    onFocus={() =>
                      setEmailFocused(true)
                    }
                    onBlur={() =>
                      setEmailFocused(false)
                    }
                    className="login-input login-input-icon"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className="login-error"
                  role="alert"
                >
                  <span className="login-error-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="M12 8v5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="12"
                        cy="16.5"
                        r="1"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <div className="login-error-content">
                    <span>{message}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="login-submit login-submit-ready"
                disabled={isLoading}
              >
                {isLoading
                  ? "Sending reset link..."
                  : "Send Reset Link"}
              </button>

              <button
                type="button"
                className="login-back-button"
                onClick={switchToLogin}
              >
                Back to sign in
              </button>
            </form>

            <div className="login-security">
              <span
                className="login-security-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 3 5 6v5c0 4.7 2.8 8.5 7 10 4.2-1.5 7-5.3 7-10V6l-7-3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="m9 12 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>
                Your healthcare information is
                protected and securely stored.
              </span>
            </div>
          </div>

          <p className="login-footer">
            Digital Immunisation
            <span>•</span>
            Healthcare access
          </p>
        </section>
      </main>
    );
  }

  if (mode === "reset") {
    const passwordStrength =
      getPasswordStrength(newPassword);

    return (
      <main className="login-page">
        <div
          className="login-orb login-orb-one"
          aria-hidden="true"
        />

        <div
          className="login-orb login-orb-two"
          aria-hidden="true"
        />

        <div
          className="login-grid"
          aria-hidden="true"
        />

        <section className="login-container">
          <div className="login-card">
            <div
              className="login-card-accent"
              aria-hidden="true"
            />

            <div className="login-brand">
              <div className="login-brand-mark">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M24 42S9 30.9 9 18.4C9 10.8 14.1 6 20.1 6c3.4 0 6.1 1.7 7.9 4.4C29.8 7.7 32.5 6 35.9 6 41.9 6 47 10.8 47 18.4 47 30.9 32 42 24 42Z"
                    fill="currentColor"
                    transform="translate(-4 0)"
                  />

                  <path
                    d="M24 13V29"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M16 21H32"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="login-brand-text">
                <span className="login-brand-name">
                  Digital Immunisation
                </span>

                <span className="login-brand-subtitle">
                  Digital healthcare management
                </span>
              </div>
            </div>

            <div className="login-heading">
              <span className="login-eyebrow">
                Create new password
              </span>

              <h1>Reset your password</h1>

              <p>
                Choose a strong password for your
                account.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleResetPassword}
            >
              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="reset-new-password">
                    New password
                  </label>

                  {newPassword && (
                    <span className="login-password-strength">
                      {passwordStrength}
                    </span>
                  )}
                </div>

                <div className="login-control">
                  <input
                    id="reset-new-password"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    className="login-input"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showNewPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="reset-confirm-password">
                    Confirm new password
                  </label>
                </div>

                <div className="login-control">
                  <input
                    id="reset-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    className="login-input"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className="login-error"
                  role="alert"
                >
                  <div className="login-error-content">
                    <span>{message}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="login-submit login-submit-ready"
                disabled={isLoading}
              >
                {isLoading
                  ? "Resetting password..."
                  : "Reset Password"}
              </button>

              <button
                type="button"
                className="login-back-button"
                onClick={switchToLogin}
              >
                Back to sign in
              </button>
            </form>

            <div className="login-security">
              <span
                className="login-security-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 3 5 6v5c0 4.7 2.8 8.5 7 10 4.2-1.5 7-5.3 7-10V6l-7-3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="m9 12 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>
                Your healthcare information is
                protected and securely stored.
              </span>
            </div>
          </div>

          <p className="login-footer">
            Digital Immunisation
            <span>•</span>
            Healthcare access
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="login-page">
      <div
        className="login-orb login-orb-one"
        aria-hidden="true"
      />

      <div
        className="login-orb login-orb-two"
        aria-hidden="true"
      />

      <div
        className="login-grid"
        aria-hidden="true"
      />

      <div
        className="login-floating-shape login-floating-shape-one"
        aria-hidden="true"
      />

      <div
        className="login-floating-shape login-floating-shape-two"
        aria-hidden="true"
      />

      <section className="login-container">
        <div className="login-card">
          <div
            className="login-card-accent"
            aria-hidden="true"
          />

          <div className="login-brand">
            <div className="login-brand-mark">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M24 42S9 30.9 9 18.4C9 10.8 14.1 6 20.1 6c3.4 0 6.1 1.7 7.9 4.4C29.8 7.7 32.5 6 35.9 6 41.9 6 47 10.8 47 18.4 47 30.9 32 42 24 42Z"
                  fill="currentColor"
                  transform="translate(-4 0)"
                />

                <path
                  d="M24 13V29"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M16 21H32"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="login-brand-text">
              <span className="login-brand-name">
                Digital Immunisation
              </span>

              <span className="login-brand-subtitle">
                Digital healthcare management
              </span>
            </div>

            <div
              className="login-online-status"
              title="System available"
            >
              <span className="login-online-dot" />
              <span>Secure</span>
            </div>
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">
              Welcome back
            </span>

            <h1>Sign in to your account</h1>

            <p>
              Access your secure healthcare
              management dashboard.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-role">
                  Login as
                </label>

                <span className="login-field-hint">
                  Select your account type
                </span>
              </div>

              <div
                className={`login-control ${
                  role === "PATIENT"
                    ? "role-patient"
                    : "role-admin"
                }`}
              >
                <span
                  className="login-control-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M4.5 20a7.5 7.5 0 0 1 15 0"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <select
                  id="login-role"
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value);
                    setMessage("");
                  }}
                  className="login-input login-select"
                >
                  <option value="PATIENT">
                    Patient
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>

                <span
                  className="login-select-arrow"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              <div className="login-role-badge">
                <span className="login-role-badge-dot" />
                {role === "PATIENT"
                  ? "Patient portal selected"
                  : "Administrator portal selected"}
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-email">
                  Email address
                </label>

                {email && (
                  <span className="login-valid-indicator">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="m5 10 3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Entered
                  </span>
                )}
              </div>

              <div
                className={`login-control ${
                  emailFocused
                    ? "login-control-focused"
                    : ""
                }`}
              >
                <span
                  className="login-control-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="3.5"
                      y="5"
                      width="17"
                      height="14"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="m4.5 7 7.5 6 7.5-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    if (message) {
                      setMessage("");
                    }
                  }}
                  onFocus={() =>
                    setEmailFocused(true)
                  }
                  onBlur={() =>
                    setEmailFocused(false)
                  }
                  className="login-input login-input-icon"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-password">
                  Password
                </label>

                {password && (
                  <span className="login-password-strength">
                    <span
                      className={
                        password.length >= 8
                          ? "strength-active"
                          : ""
                      }
                    />

                    <span
                      className={
                        password.length >= 6
                          ? "strength-active"
                          : ""
                      }
                    />

                    <span
                      className={
                        password.length >= 4
                          ? "strength-active"
                          : ""
                      }
                    />

                    {password.length >= 8
                      ? "Strong"
                      : password.length >= 6
                      ? "Good"
                      : "Short"}
                  </span>
                )}
              </div>

              <div
                className={`login-control ${
                  passwordFocused
                    ? "login-control-focused"
                    : ""
                }`}
              >
                <span
                  className="login-control-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="15"
                      r="1.2"
                      fill="currentColor"
                    />
                  </svg>
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);

                    if (message) {
                      setMessage("");
                    }
                  }}
                  onFocus={() =>
                    setPasswordFocused(true)
                  }
                  onBlur={() =>
                    setPasswordFocused(false)
                  }
                  className="login-input login-input-icon login-password-input"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10.6 10.7a2 2 0 0 0 2.7 2.7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.6 4.4 9.8 6.5a1 1 0 0 1 0 1C21 13.6 19.5 16 17 17.7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M6.2 7.1C4.5 8.4 3.4 10 2.2 11.5a1 1 0 0 0 0 1C3.4 14.6 6.8 19 12 19c1.2 0 2.3-.2 3.3-.6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-forgot-password">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setMessage("");
                }}
              >
                Forgot password?
              </button>
            </div>

            {message && (
              <div
                className="login-error"
                role="alert"
              >
                <span
                  className="login-error-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M12 8v5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="16.5"
                      r="1"
                      fill="currentColor"
                    />
                  </svg>
                </span>

                <div className="login-error-content">
                  <strong>
                    Sign in unsuccessful
                  </strong>

                  <span>{message}</span>
                </div>

                <button
                  type="button"
                  className="login-error-close"
                  onClick={() =>
                    setMessage("")
                  }
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <button
              type="submit"
              className={`login-submit ${
                isFormReady
                  ? "login-submit-ready"
                  : ""
              }`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="login-spinner"
                    aria-hidden="true"
                  />

                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="m13 6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            <div className="login-form-status">
              <span
                className={
                  isFormReady
                    ? "status-dot status-ready"
                    : "status-dot"
                }
              />

              {isLoading
                ? "Authenticating securely..."
                : isFormReady
                ? "Ready to sign in"
                : "Enter your credentials to continue"}
            </div>
          </form>

          <div className="login-security">
            <span
              className="login-security-icon"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 3 5 6v5c0 4.7 2.8 8.5 7 10 4.2-1.5 7-5.3 7-10V6l-7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />

                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span>
              Your healthcare information is
              protected and securely stored.
            </span>
          </div>

          <div className="login-security-badges">
            <div className="login-security-badge">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2.5 4 5v4.3c0 3.9 2.4 7.1 6 8.2 3.6-1.1 6-4.3 6-8.2V5l-6-2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                <path
                  d="m7.5 10 1.7 1.7 3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Secure access
            </div>

            <span className="login-badge-divider" />

            <div className="login-security-badge">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="8"
                  width="12"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M6.5 8V6a3.5 3.5 0 0 1 7 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              Protected data
            </div>
          </div>
        </div>

        <p className="login-footer">
          Digital Immunisation
          <span>•</span>
          Healthcare access
        </p>
      </section>
    </main>
  );
}

export default Login;