import { Link } from "react-router-dom";

function SignInUp({ viewPortClass = "md:flex hidden" }) {
  return (
    <div className={`items-center gap-3 ${viewPortClass}`}>
      <Link
        to="/register"
        className="px-3 py-1.5 text-sm sm:text-base md:text-sm lg:text-base font-bold text-gray-600 hover:text-blue-600 transition-colors"
      >
        Sign Up
      </Link>
      <Link
        to="/login"
        className="px-4 py-1.5 bg-[#0857d0] hover:bg-[#0746a8] text-sm sm:text-base md:text-sm lg:text-base font-bold text-white rounded-full shadow-sm transition-all"
      >
        Log In
      </Link>
    </div>
  );
}

export default SignInUp;
