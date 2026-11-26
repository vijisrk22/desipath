import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "../store/UserSlice";
import api from "../utils/api";
import { privacyPolicy, termsOfUse } from "../utils/legalTexts";
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "user",
      agreeTerms: false,
    },
    mode: "onTouched",
  });

  const selectedRole = watch("role", "user");
  const passwordVal = watch("password", "");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Legal Modal
  const [legalModal, setLegalModal] = useState({ open: false, title: "", content: "" });

  // OTP Verification state
  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  // Clear errors when mounting or switching
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Resend cooldown timer
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

  const onSubmit = async (data) => {
    dispatch(clearError());

    const userCredentials = {
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: data.email.trim(),
      password: data.password,
      password_confirmation: data.password_confirmation,
      role: data.role,
    };

    if (data.role === "business") {
      if (data.business_name?.trim()) userCredentials.business_name = data.business_name.trim();
      if (data.business_phone?.trim()) userCredentials.business_phone = data.business_phone.trim();
      if (data.business_location?.trim()) userCredentials.business_location = data.business_location.trim();
    }

    try {
      await dispatch(registerUser(userCredentials)).unwrap();
      setRegisteredEmail(data.email.trim());
      setShowOtp(true);
      setIsCooldownActive(true);
      setResendCooldown(60);
      toast.success("Account created! Please check your email for the activation code.");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    try {
      const response = await api.post("/api/verify-otp", {
        email: registeredEmail,
        otp: otp.trim(),
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Account activated successfully!");
      window.location.href = "/";
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP. Please check the code sent to your email.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isCooldownActive || otpLoading) return;
    try {
      toast.success("A new code has been sent to your email.");
      setIsCooldownActive(true);
      setResendCooldown(60);
    } catch (err) {
      toast.error("Failed to resend code. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center font-dmsans text-gray-900 p-4 sm:p-6 md:p-8">
      {/* Main Two-Panel Card Container */}
      <div className="w-full max-w-[1020px] rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
          
          {/* Brand Panel: on mobile renders below form (order-2), on desktop renders left (md:order-1) */}
          <div className="w-full md:w-5/12 order-2 md:order-1 bg-gradient-to-br from-[#0857D0] to-[#043382] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Ambient background circles */}
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

            <div className="relative z-10 mb-8 md:mb-0">
              <Link
                to="/"
                className="inline-block hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
              >
                <img
                  src="/desipath-logo-white.png"
                  alt="Desipath"
                  className="h-9 md:h-11 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="relative z-10 my-auto py-4 md:py-8">
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white leading-tight mb-4">
                Desi <span className="text-[#ffa41c]">life</span>, made simple.
              </h2>
              <p className="text-blue-100 text-sm sm:text-base font-normal leading-relaxed max-w-sm">
                Find local services, buy and sell, and connect with your Desi community.
              </p>
            </div>

            {/* Empty space filler for layout symmetry on desktop */}
            <div className="relative z-10 hidden md:block">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>
          </div>

          {/* Form Panel: on mobile renders first (order-1), on desktop renders right (md:order-2) */}
          <div className="w-full md:w-7/12 order-1 md:order-2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              {showOtp ? (
                /* OTP VERIFICATION VIEW */
                <div className="animate-fade-in">
                  <div className="mb-6 text-left">
                    <div className="w-12 h-12 bg-blue-50 text-[#0857D0] rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                      Verify your email
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We’ve sent a 6-digit activation code to{" "}
                      <span className="font-semibold text-gray-900">{registeredEmail}</span>. Check your spam folder if it doesn’t arrive.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label htmlFor="otp-input" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Activation code
                      </label>
                      <input
                        id="otp-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={otp}
                        autoFocus
                        autoComplete="one-time-code"
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#0857D0] focus:ring-4 focus:ring-blue-100 rounded-xl text-center text-2xl font-bold tracking-[0.4em] text-gray-800 transition-all outline-none"
                        placeholder="______"
                        required
                      />
                    </div>

                    {otpError && (
                      <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium text-center animate-shake">
                        {otpError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={otpLoading || otp.length !== 6}
                      className="w-full py-3 px-4 bg-[#0857D0] hover:bg-[#0747ab] disabled:bg-blue-300 text-white font-semibold rounded-xl shadow-md shadow-blue-200/50 hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      {otpLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Activating…
                        </span>
                      ) : (
                        "Activate account"
                      )}
                    </button>

                    <div className="flex flex-col items-center gap-3 pt-2 text-xs sm:text-sm">
                      <p className="text-gray-500">
                        Didn’t receive the code?{" "}
                        {isCooldownActive ? (
                          <span className="text-gray-400 font-medium">Resend in {resendCooldown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-[#0857D0] font-semibold hover:underline focus:outline-none"
                          >
                            Resend code
                          </button>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtp(false);
                          setOtp("");
                          setOtpError("");
                        }}
                        className="text-gray-500 hover:text-gray-700 font-medium text-xs flex items-center gap-1 focus:outline-none"
                      >
                        ← Use a different email
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* REGISTRATION FORM VIEW */
                <>
                  <div className="mb-6 text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1.5">
                      Create your account
                    </h1>
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        onClick={() => dispatch(clearError())}
                        className="text-[#0857D0] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0857D0] rounded"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-shake"
                    >
                      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first-name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                          First name
                        </label>
                        <input
                          id="first-name"
                          type="text"
                          autoComplete="given-name"
                          placeholder="e.g. Rahul"
                          {...register("firstName", { required: "First name is required" })}
                          onChange={() => { if (error) dispatch(clearError()); }}
                          className={`w-full px-3.5 py-2.5 bg-white border ${
                            errors.firstName
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-[#0857D0] focus:ring-blue-100"
                          } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="last-name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                          Last name
                        </label>
                        <input
                          id="last-name"
                          type="text"
                          autoComplete="family-name"
                          placeholder="e.g. Sharma"
                          {...register("lastName", { required: "Last name is required" })}
                          onChange={() => { if (error) dispatch(clearError()); }}
                          className={`w-full px-3.5 py-2.5 bg-white border ${
                            errors.lastName
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-[#0857D0] focus:ring-blue-100"
                          } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...register("email", {
                          required: "Email address is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                        onChange={() => { if (error) dispatch(clearError()); }}
                        className={`w-full px-3.5 py-2.5 bg-white border ${
                          errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-300 focus:border-[#0857D0] focus:ring-blue-100"
                        } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Enter password"
                          aria-describedby="password-rules"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 7,
                              message: "Must be at least 7 characters",
                            },
                            pattern: {
                              value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                              message: "Must include at least one letter and one number",
                            },
                          })}
                          className={`w-full px-3.5 pr-11 py-2.5 bg-white border ${
                            errors.password
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-[#0857D0] focus:ring-blue-100"
                          } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-[#0857D0]"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p id="password-rules" className="text-xs text-gray-500 mt-1.5">
                        Use at least 7 characters, including one letter and one number.
                      </p>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Re-enter password"
                          {...register("password_confirmation", {
                            required: "Please confirm your password",
                            validate: (value) => value === passwordVal || "Passwords don’t match.",
                          })}
                          className={`w-full px-3.5 pr-11 py-2.5 bg-white border ${
                            errors.password_confirmation
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-300 focus:border-[#0857D0] focus:ring-blue-100"
                          } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          aria-pressed={showConfirmPassword}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-[#0857D0]"
                        >
                          {showConfirmPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password_confirmation && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.password_confirmation.message}</p>
                      )}
                    </div>

                    {/* Account Type */}
                    <fieldset className="pt-1">
                      <legend className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Account type</legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
                        {/* Personal */}
                        <label
                          htmlFor="role-personal"
                          className={`relative flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedRole === "user"
                              ? "border-[#0857D0] bg-blue-50/40 ring-1 ring-[#0857D0]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            id="role-personal"
                            type="radio"
                            value="user"
                            {...register("role")}
                            className="mt-0.5 h-4 w-4 text-[#0857D0] border-gray-300 focus:ring-[#0857D0] cursor-pointer"
                          />
                          <div className="ml-2.5 text-left">
                            <span className="block text-sm font-semibold text-gray-900">Personal</span>
                            <span className="block text-xs text-gray-500 mt-0.5 leading-snug">
                              Browse listings, buy and sell, and connect with community.
                            </span>
                          </div>
                        </label>

                        {/* Business */}
                        <label
                          htmlFor="role-business"
                          className={`relative flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedRole === "business"
                              ? "border-[#0857D0] bg-blue-50/40 ring-1 ring-[#0857D0]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            id="role-business"
                            type="radio"
                            value="business"
                            {...register("role")}
                            className="mt-0.5 h-4 w-4 text-[#0857D0] border-gray-300 focus:ring-[#0857D0] cursor-pointer"
                          />
                          <div className="ml-2.5 text-left">
                            <span className="block text-sm font-semibold text-gray-900">Business</span>
                            <span className="block text-xs text-gray-500 mt-0.5 leading-snug">
                              List commercial services, manage ads, and reach customers.
                            </span>
                          </div>
                        </label>
                      </div>
                    </fieldset>

                    {/* Optional Business Fields */}
                    {selectedRole === "business" && (
                      <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-xl transition-all animate-fade-in">
                        <p className="text-xs font-bold text-[#0857D0] uppercase tracking-wider">Business details (Optional)</p>
                        <div>
                          <label htmlFor="business_name" className="block text-xs font-medium text-gray-700 mb-1">
                            Business Name
                          </label>
                          <input
                            id="business_name"
                            type="text"
                            {...register("business_name")}
                            placeholder="e.g. Desi Spice Market"
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:border-[#0857D0] focus:ring-2 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="business_phone" className="block text-xs font-medium text-gray-700 mb-1">
                            Business Phone Number
                          </label>
                          <input
                            id="business_phone"
                            type="tel"
                            {...register("business_phone")}
                            placeholder="e.g. (555) 123-4567"
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:border-[#0857D0] focus:ring-2 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="business_location" className="block text-xs font-medium text-gray-700 mb-1">
                            Business Location
                          </label>
                          <input
                            id="business_location"
                            type="text"
                            {...register("business_location")}
                            placeholder="City, State"
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:border-[#0857D0] focus:ring-2 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Consent Checkbox */}
                    <div className="pt-1">
                      <label htmlFor="agreeTerms" className="flex items-start group cursor-pointer select-none">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            id="agreeTerms"
                            type="checkbox"
                            {...register("agreeTerms", {
                              required: "You must agree to the Terms of Use and Privacy Policy",
                            })}
                            className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-md checked:bg-[#0857D0] checked:border-[#0857D0] focus:outline-none focus:ring-2 focus:ring-[#0857D0]/30 transition-all cursor-pointer"
                          />
                          <svg
                            className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLegalModal({ open: true, title: "Terms of Use", content: termsOfUse });
                            }}
                            className="text-[#0857D0] font-semibold hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0857D0] rounded"
                          >
                            Terms of Use
                          </button>{" "}
                          and{" "}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLegalModal({ open: true, title: "Privacy Policy", content: privacyPolicy });
                            }}
                            className="text-[#0857D0] font-semibold hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0857D0] rounded"
                          >
                            Privacy Policy
                          </button>
                          .
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.agreeTerms.message}</p>
                      )}
                    </div>

                    {/* Primary Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="w-full py-3 px-4 bg-[#0857D0] hover:bg-[#0747ab] disabled:bg-blue-300 text-white font-semibold rounded-xl shadow-md shadow-blue-200/50 hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      {loading || isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account…
                        </span>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

      {/* Legal Modal Dialog */}
      {legalModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 id="legal-modal-title" className="text-lg sm:text-xl font-bold text-gray-900">
                {legalModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal({ open: false, title: "", content: "" })}
                className="text-gray-400 hover:text-gray-600 font-bold text-2xl leading-none p-1 focus:outline-none"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>
            <div className="p-5 sm:p-6 overflow-y-auto whitespace-pre-wrap text-sm text-gray-600 leading-relaxed font-dmsans">
              {legalModal.content}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button
                type="button"
                onClick={() => setLegalModal({ open: false, title: "", content: "" })}
                className="px-6 py-2 bg-[#0857D0] hover:bg-[#0747ab] text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
