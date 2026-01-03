import { Link } from "react-router-dom";

function SignInUp({ viewPortClass = "md:flex hidden" }) {
  return (
    <div className={`items-center gap-3 ${viewPortClass}`}>
      <Link
        to="/register"
        className="px-4 py-2 text-base sm:text-lg md:text-base lg:text-xl font-medium text-gray-500 rounded-[20px]"
      >
        Sign Up
      </Link>
      <Link
        to="/login"
        className="px-4 py-2 bg-[#ffa41c] text-base sm:text-lg md:text-base lg:text-xl font-medium text-gray-800 rounded-[20px]"
      >
        Log In
      </Link>
    </div>
  );
}

export default SignInUp;
