import { Link, useNavigate } from "react-router-dom";
import AuthPageLeft from "../components/Auth/AuthPageLeft";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import EmailInput from "../components/Auth/EmailInput";
import PasswordInput from "../components/Auth/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/UserSlice";
import Loader from "../components/Loader";
import GoogleAuth from "../components/Auth/GoogleAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user); // Access loading and error from the Redux store
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
      navigate("/");
    } catch (err) {
      // This error will be handled in Redux, but you can optionally log it
      console.error("Login failed:", err);
    }
    // Dispatch the login action
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-2 p-4 md:py-0 md:px-2">
      {/* Left Column */}
      <AuthPageLeft />
      {/* Right Column */}
      <div className="flex flex-col items-center md:items-start mt-2 md:mt-[220px] mx-auto w-full max-w-lg">
        {/* Sign In Header */}
        <div className="text-[#2e61b1] text-4xl md:text-[30px] lg:text-[40px] font-semibold font-dmsans">
          Sign In
        </div>

        <GoogleAuth />

        {/* Sign Up Link */}
        <div className="mt-4 md:mt-[24px] text-center md:text-left">
          <span className="text-[#6c7174] text-base font-normal font-dmsans">
            Don’t have an account yet?{" "}
          </span>
          <Link
            to="/register"
            className="text-[#38cb89] text-base font-normal font-dmsans"
          >
            <span onClick={() => dispatch(clearError())}>Sign Up</span>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
          className="mt-6 flex flex-col gap-4 md:gap-8 md:max-w-sm lg:max-w-lg w-full"
        >
          {/* Input Fields */}
          <EmailInput
            register={register}
            errors={errors}
            onChange={() => dispatch(clearError())}
          />
          <PasswordInput register={register} errors={errors} noFlag={true} />

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-row justify-between items-center w-full mt-4 gap-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-[#6c7174] text-base font-normal font-dmsans">
                Remember me
              </span>
            </label>
            <Link to="#" className="text-gray-800 text-base font-semibold">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="mt-6 px-10 py-2.5 bg-[#2e61b1] rounded-lg text-white text-base font-medium font-dmsans w-full"
          >
            {loading ? "Loading..." : "Sign In for Desipath.com"}
          </button>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </form>

        <div className="text-[#141718] block md:hidden mt-[32px] text-base font-inter leading-relaxed max-w-md">
          Find local services, Roommates, Buy & Sell Home, Rental home, Find
          Travel companion for your parents or Be a travel companion and get
          Gift cards, Find Local doctors/ Attorneys, Find IT trainings, Browse
          local events etc.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
