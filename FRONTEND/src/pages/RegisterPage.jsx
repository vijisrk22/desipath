import { Link, useNavigate } from "react-router-dom";
import AuthPageLeft from "../components/Auth/AuthPageLeft";
import { useForm } from "react-hook-form";
import EmailInput from "../components/Auth/EmailInput";
import PasswordInput from "../components/Auth/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "../store/UserSlice";
import TwoRadioInput from "../components/InputTemplate/TwoRadioInput";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let userCredentials = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    console.log(userCredentials);

    try {
      const result = await dispatch(registerUser(userCredentials)).unwrap(); // .unwrap to get payload or throw error
      console.log("Registration successful:", result);
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      // window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 font-dmsans">
      <div className="bg-white w-full max-w-[1000px] min-h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 transform transition-all duration-500 hover:shadow-blue-100/50">
        
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

          <div className="relative z-10 mt-12 md:mt-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins leading-[1.2] mb-6">
              New generation classifieds for Desi!
            </h2>
            <p className="text-blue-100 text-base md:text-lg font-light leading-relaxed max-w-md">
              The easiest way to interact with the Desi community. Post ads, find services, and connect with people.
            </p>
          </div>

          <div className="relative z-10 hidden md:block">
            <div className="flex gap-2 items-center text-blue-200 text-sm">
              <span className="w-8 h-[1px] bg-blue-300"></span>
              Join thousands of others today
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-[#141718] text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Sign Up
              </h1>
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#38cb89] font-bold hover:underline"
                  onClick={() => dispatch(clearError())}
                >
                  Sign In
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input
                    {...register("firstName", { required: "Required" })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#0857d0] focus:bg-white rounded-xl text-gray-800 text-sm font-medium transition-all outline-none"
                    placeholder="First Name"
                    onChange={() => dispatch(clearError())}
                  />
                  {errors.firstName && <p className="text-red-500 text-[10px] ml-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <input
                    {...register("lastName", { required: "Required" })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#0857d0] focus:bg-white rounded-xl text-gray-800 text-sm font-medium transition-all outline-none"
                    placeholder="Last Name"
                  />
                  {errors.lastName && <p className="text-red-500 text-[10px] ml-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <EmailInput register={register} errors={errors} />
                <PasswordInput register={register} errors={errors} />
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                <TwoRadioInput
                  name="role"
                  text="Identify yourself as:"
                  op1="user"
                  op2="business"
                  control={control}
                />
              </div>

              <div className="flex items-start">
                <label className="flex items-start group cursor-pointer">
                  <div className="relative flex items-center justify-center mt-1">
                    <input 
                      type="checkbox" 
                      required
                      className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#38cb89] checked:border-[#38cb89] transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-3 text-xs text-gray-600 font-medium leading-relaxed">
                    I agree with the <span className="text-gray-900 font-bold hover:underline">Privacy Policy</span> and <span className="text-gray-900 font-bold hover:underline">Terms of Use</span>.
                  </span>
                </label>
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
                    Creating account...
                  </span>
                ) : (
                  "Sign Up for Desipath.com"
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-shake">
                   ⚠️ {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
