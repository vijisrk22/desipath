import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Step states: 'request' | 'verify' | 'new-password' | 'success'
  const [step, setStep] = useState("request");

  // Form states
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI / Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & error feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Resend cooldown timer (60 seconds)
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  // Hidden code input reference for accessibility & focus
  const codeInputRef = useRef(null);

  // Cooldown countdown effect
  useEffect(() => {
    let timer;
    if (isCooldownActive && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setIsCooldownActive(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCooldownActive, resendCooldown]);

  // Focus code input when reaching verify step
  useEffect(() => {
    if (step === "verify" && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

  // Email format validation helper
  const isValidEmailFormat = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // 1. REQUEST A RESET CODE
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isValidEmailFormat(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/forgot-password", { email: trimmedEmail });
      setInfoMessage(
        response.data.message ||
        "If a DesiPath account exists for that email address, we’ll send you a 6-digit reset code. Check your spam folder if it doesn’t arrive."
      );
      setStep("verify");
      setIsCooldownActive(true);
      setResendCooldown(60);
    } catch (err) {
      if (err.response?.status === 422) {
        setError("Enter a valid email address.");
      } else if (err.response?.status === 429) {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError("We couldn’t process your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. RESEND RESET CODE
  const handleResendCode = async () => {
    if (isCooldownActive || loading) return;
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/forgot-password", { email: email.trim() });
      setInfoMessage(
        response.data.message ||
        "If a DesiPath account exists for that email address, we’ll send you a 6-digit reset code. Check your spam folder if it doesn’t arrive."
      );
      setIsCooldownActive(true);
      setResendCooldown(60);
      setCode("");
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError("We couldn’t process your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. VERIFY CODE
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("This code is invalid or has expired. Try again or request a new code.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/verify-reset-code", {
        email: email.trim(),
        code: code.trim(),
      });

      if (response.data.reset_token) {
        setResetToken(response.data.reset_token);
        setStep("new-password");
      } else {
        setError("This code is invalid or has expired. Try again or request a new code.");
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError(
          err.response?.data?.message ||
          "This code is invalid or has expired. Try again or request a new code."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. SET A NEW PASSWORD
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords don’t match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/reset-password", {
        reset_token: resetToken,
        password,
        password_confirmation: confirmPassword,
      });

      setStep("success");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
          "Your reset session has expired. Request a new code."
        );
      } else if (err.response?.status === 422) {
        setError(err.response?.data?.message || "The passwords don’t match.");
      } else {
        setError("We couldn’t process your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle OTP digit change & paste
  const handleCodeChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(rawVal);
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8">`r`n      {/* Top Header with Logo */}`r`n      <header className="w-full max-w-4xl mx-auto pb-4 flex items-center justify-between z-20">`r`n        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">`r`n          <img src="/desipath-logo.png" alt="Desipath" className="h-8 sm:h-9 md:h-10 w-auto object-contain" />`r`n        </Link>`r`n      </header>
      
      {/* Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[540px]">
        
        {/* DESKTOP LEFT PANEL: Blue DesiPath Branding */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#0857d0] to-[#043382] p-10 text-white flex-col justify-between relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

          <div>
            <Link to="/" className="inline-block hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"><img src="/desipath-logo-white.png" alt="Desipath" className="h-9 md:h-11 w-auto object-contain" /></Link>
          </div>

          <div className="relative z-10 py-12">
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight mb-3">
              Account Recovery
            </h2>
            <p className="text-blue-100/90 text-sm leading-relaxed">
              Fast, secure password reset for your Desipath community account.
            </p>
          </div>

          <div className="text-xs text-blue-200/70">
            &copy; {new Date().getFullYear()} Desipath. All rights reserved.
          </div>
        </div>

        {/* MOBILE COMPACT HEADER: Shown above form on mobile screens */}
        <div className="md:hidden bg-gradient-to-r from-[#0857d0] to-[#043382] px-6 py-5 flex items-center justify-between text-white">
          <Link to="/" className="inline-block hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded"><img src="/desipath-logo-white.png" alt="Desipath" className="h-7 w-auto object-contain" /></Link>
          <span className="text-xs font-semibold text-blue-100 uppercase tracking-widest">
            Recovery
          </span>
        </div>

        {/* RIGHT PANEL: Form States */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* ========================================================= */}
            {/* 1. REQUEST A RESET CODE                                   */}
            {/* ========================================================= */}
            {step === "request" && (
              <div className="animate-fade-in">
                <header className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Reset your password
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Enter your email address to request a password reset code.
                  </p>
                </header>

                <form onSubmit={handleRequestCode} noValidate className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm font-medium focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>

                  {/* Validation / Service Error Alert */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5 animate-fade-in"
                    >
                      <span className="text-red-500 font-bold" aria-hidden="true">⚠️</span>
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending…" : "Send reset code"}
                  </button>

                  {/* Single navigation link below the form */}
                  <div className="text-center pt-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center text-sm font-semibold text-[#0857d0] hover:text-[#0746a8] hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 rounded p-1"
                    >
                      ← Back to sign in
                    </Link>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. VERIFY THE CODE                                        */}
            {/* ========================================================= */}
            {step === "verify" && (
              <div className="animate-fade-in">
                <header className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Check your inbox
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    If a DesiPath account exists for that email address, we’ll send you a 6-digit reset code. Check your spam folder if it doesn’t arrive.
                  </p>
                </header>

                {/* Neutral Confirmation Banner */}
                <div className="mb-6 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 text-xs sm:text-sm flex items-center justify-between">
                  <span className="truncate pr-2">
                    Sent to: <strong className="text-gray-900 font-semibold">{email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setError("");
                    }}
                    className="text-[#0857d0] hover:underline font-bold text-xs whitespace-nowrap focus:outline-none"
                  >
                    Edit
                  </button>
                </div>

                <form onSubmit={handleVerifyCode} noValidate className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-code"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Reset code
                    </label>

                    {/* Single Accessible 6-Digit Logical Input with Six Visual Boxes */}
                    <div
                      className="relative cursor-text"
                      onClick={() => codeInputRef.current?.focus()}
                    >
                      {/* Hidden actual native input for accessibility, screen readers, autofill & paste */}
                      <input
                        ref={codeInputRef}
                        id="reset-code"
                        name="code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoComplete="one-time-code"
                        required
                        value={code}
                        onChange={handleCodeChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
                        aria-label="Enter 6-digit reset code"
                      />

                      {/* 6 Visual Segmented Boxes */}
                      <div className="grid grid-cols-6 gap-2 sm:gap-3" aria-hidden="true">
                        {[0, 1, 2, 3, 4, 5].map((idx) => {
                          const char = code[idx] || "";
                          const isCurrent = idx === code.length && code.length < 6;
                          return (
                            <div
                              key={idx}
                              className={`h-14 sm:h-16 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold transition-all ${
                                isCurrent
                                  ? "border-[#0857d0] bg-white ring-4 ring-blue-100 shadow-sm"
                                  : char
                                  ? "border-gray-300 bg-white text-gray-900"
                                  : "border-gray-200 bg-gray-50 text-gray-400"
                              }`}
                            >
                              {char || <span className="text-gray-300 font-normal">_</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Validation Error Alert */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5 animate-fade-in"
                    >
                      <span className="text-red-500 font-bold" aria-hidden="true">⚠️</span>
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  {/* Primary Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full h-12 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying…" : "Verify code"}
                  </button>

                  {/* Secondary Actions: Resend code (with cooldown) & Use a different email */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-sm">
                    {isCooldownActive ? (
                      <span className="text-gray-400 font-medium text-xs sm:text-sm">
                        Resend code ({resendCooldown}s)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="font-bold text-[#0857d0] hover:text-[#0746a8] hover:underline focus:outline-none transition-colors"
                      >
                        Resend code
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setStep("request");
                        setError("");
                      }}
                      className="font-semibold text-gray-500 hover:text-gray-800 transition-colors focus:outline-none text-xs sm:text-sm"
                    >
                      Use a different email
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. SET A NEW PASSWORD                                     */}
            {/* ========================================================= */}
            {step === "new-password" && (
              <div className="animate-fade-in">
                <header className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Set a new password
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Choose a strong password to protect your account.
                  </p>
                </header>

                {/* Password Requirements Notice */}
                <div className="mb-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 text-xs flex items-center gap-2">
                  <span className="text-[#0857d0] font-bold">ℹ️</span>
                  <span>Password must be at least 6 characters.</span>
                </div>

                <form onSubmit={handleSetNewPassword} noValidate className="space-y-5">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        name="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="••••••••"
                        className="w-full h-12 px-4 pr-16 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm font-medium focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold text-gray-500 hover:text-gray-800 focus:outline-none transition-colors"
                        aria-label={showPassword ? "Hide new password" : "Show new password"}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirm-new-password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        name="confirm-new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="••••••••"
                        className="w-full h-12 px-4 pr-16 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 text-sm font-medium focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold text-gray-500 hover:text-gray-800 focus:outline-none transition-colors"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5 animate-fade-in"
                    >
                      <span className="text-red-500 font-bold" aria-hidden="true">⚠️</span>
                      <div className="flex-1 leading-snug">
                        {error}
                        {error.includes("expired") && (
                          <button
                            type="button"
                            onClick={() => {
                              setStep("request");
                              setError("");
                            }}
                            className="block mt-1 font-bold text-red-800 underline hover:no-underline"
                          >
                            Request a new code
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Primary Update Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating…" : "Update password"}
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. SUCCESS STATE                                          */}
            {/* ========================================================= */}
            {step === "success" && (
              <div className="animate-fade-in text-center py-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm border border-green-100">
                  ✓
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                  Password updated
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Sign in with your new password.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full h-12 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  Back to sign in
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}


