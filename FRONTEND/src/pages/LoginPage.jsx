import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthPageLeft from "../components/Auth/AuthPageLeft";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import EmailInput from "../components/Auth/EmailInput";
import PasswordInput from "../components/Auth/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/UserSlice";
import Loader from "../components/Loader";
import GoogleAuth from "../components/Auth/GoogleAuth";
import { useState } from "react";
import api from "../utils/api";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.user);
  
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Initialize useForm

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    let userCredentials = {
      email: data.email,
      password: data.password,
    };

    try {
      const result = await dispatch(loginUser(userCredentials)).unwrap(); // .unwrap to get payload or throw error
      console.log("Login successful:", result);
      
      // Redirect back to original page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      // Check if account is pending
      if (err.status === 403 && err.message.includes("pending")) {
        setRegisteredEmail(userCredentials.email);
        setShowOtp(true);
      }
    }
    // Dispatch the login action
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
        otp: otp
      });
      
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "/";
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP. Please check the code sent to your email.");
    } finally {
      setOtpLoading(false);
    }
  };

  if (loading && !showOtp) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 font-dmsans">
      <div className="bg-white w-full max-w-[1000px] min-h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 transform transition-all duration-500 hover:shadow-blue-100/50">
        
        {/* Visual/Branding Side (Preserving AuthPageLeft content) */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0857d0] to-[#2e61b1] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-normal font-fredoka tracking-tight">
              Desipath
            </Link>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 hidden md:block">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins leading-[1.2] mb-6">
              Easy way to interact with Desi!
            </h2>
            <p className="text-blue-100 text-base md:text-lg font-light leading-relaxed max-w-md">
              Find local services, Roommates, Buy & Sell Home, Rental home, Find Travel companion, Local doctors, IT trainings, and browse local events.
            </p>
          </div>

          <div className="relative z-10 hidden md:block">
            <div className="flex gap-2 items-center text-blue-200 text-sm">
              <span className="w-8 h-[1px] bg-blue-300"></span>
              Join our growing community
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            
            {showOtp ? (
               /* OTP VERIFICATION VIEW */
               <div className="animate-fade-in">
                <div className="mb-8 text-center md:text-left">
                  <div className="w-16 h-16 bg-blue-50 text-[#0857d0] rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto md:mx-0 shadow-sm border border-blue-100">📧</div>
                  <h1 className="text-[#141718] text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    Verify Email
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Your account is pending activation. Enter the 6-digit code sent to <span className="font-bold text-gray-800">{registeredEmail}</span>.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Activation Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0857d0] focus:bg-white rounded-2xl text-center text-2xl font-bold tracking-[0.5em] text-gray-800 transition-all outline-none"
                      placeholder="000000"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full h-14 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-2xl shadow-xl shadow-blue-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {otpLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Activate Account"
                    )}
                  </button>

                  {otpError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium animate-shake text-center">
                       ⚠️ {otpError}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-gray-500 text-xs">
                      Didn't receive the code?{" "}
                      <button 
                        type="button" 
                        onClick={() => alert("OTP resent! (Check laravel.log)")} 
                        className="text-[#0857d0] font-bold hover:underline ml-1"
                      >
                        Resend Code
                      </button>
                    </p>
                    <button 
                      type="button" 
                      onClick={() => setShowOtp(false)} 
                      className="mt-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest hover:text-gray-600"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* LOGIN FORM VIEW */
              <>
                <div className="mb-10 text-center md:text-left">
                  <h1 className="text-[#141718] text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    Sign In
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Don’t have an account yet?{" "}
                    <Link
                      to="/register"
                      className="text-[#38cb89] font-bold hover:underline"
                      onClick={() => dispatch(clearError())}
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>

                <div className="mb-8">
                  <GoogleAuth />
                </div>

                <div className="relative mb-8 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <span className="relative px-4 bg-white text-gray-400 text-xs font-medium uppercase tracking-widest">
                    Or sign in with email
                  </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <EmailInput
                      register={register}
                      errors={errors}
                      onChange={() => dispatch(clearError())}
                    />
                    <PasswordInput register={register} errors={errors} noFlag={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#0857d0] checked:border-[#0857d0] transition-all cursor-pointer" 
                        />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link to="#" className="text-sm font-bold text-[#0857d0] hover:text-[#0746a8] hover:underline transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-xl shadow-lg shadow-blue-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In for Desipath.com"
                    )}
                  </button>
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-shake">
                       ⚠️ {error}
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
