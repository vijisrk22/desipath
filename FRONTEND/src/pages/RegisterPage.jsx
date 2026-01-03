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
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-2 p-4 md:py-0 md:px-2">
      {/* Left Column */}
      <AuthPageLeft />

      {/* Right Column */}
      <div className="flex flex-col items-center md:items-start mt-[49px] md:mt-[220px] mx-auto w-full max-w-lg px-2">
        {/* Sign Up Header */}
        <div className="text-[#2e61b1] text-4xl md:text-[30px] lg:text-[40px] font-semibold font-dmsans">
          Sign Up
        </div>
        <div className="mt-6 flex flex-col gap-6 w-full">
          {/* Sign Up Link */}
          <div className="mt-4 md:mt-[0px] text-center md:text-left">
            <span className="text-[#6c7174] text-base font-normal font-dmsans">
              Already have an account yet?{" "}
            </span>
            <Link
              to="/login"
              className="text-[#38cb89] text-base font-normal font-dmsans"
            >
              <span onClick={() => dispatch(clearError())}>Sign In</span>
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
          className="mt-6 flex flex-col gap-4 md:gap-[26px] md:max-w-sm lg:max-w-lg w-full"
        >
          {/* Input Fields */}
          <div className="md:flex-row md:justify-between md:items-center flex flex-col gap-4 md:gap-[20px]">
            <input
              {...register("firstName", {
                required: "Required",
              })}
              className="p-4 bg-neutral-50 rounded-xl text-gray-800 text-sm font-dmsans outline-none w-full"
              placeholder="Your First Name"
              onChange={() => dispatch(clearError())}
            />
            {errors.firstName && (
              <div className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </div>
            )}
            <input
              {...register("lastName", {
                required: "Required",
              })}
              className="p-4 bg-neutral-50 rounded-xl text-gray-800 text-sm font-dmsans outline-none w-full"
              placeholder="Your Last Name"
            />
            {errors.lastName && (
              <div className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </div>
            )}
          </div>
          <EmailInput register={register} errors={errors} />
          <PasswordInput register={register} errors={errors} />

          <TwoRadioInput
            name="role"
            text="Role"
            op1="user"
            op2="business"
            control={control}
          />

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-row justify-between items-center w-full mt-4 gap-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" required />
              <div>
                <span className="text-[#6c7174] text-base font-semibold font-['DM Sans']">
                  I agree with{" "}
                </span>
                <span className="text-gray-800 text-base font-semibold font-['DM Sans']">
                  Privacy Policy
                </span>
                <span className="text-[#6c7174] text-base font-semibold font-['DM Sans']">
                  {" "}
                  and{" "}
                </span>
                <span className="text-gray-800 text-base font-semibold font-['DM Sans']">
                  Terms of Use
                </span>
              </div>
            </label>
          </div>
          {/* Sign In Button */}
          <button className="mt-2 px-10 py-2.5 bg-[#2e61b1] rounded-lg text-white text-base font-medium font-dmsans w-full">
            {loading ? "Loading..." : "Sign Up for Desipath.com"}
          </button>
          {errors && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
