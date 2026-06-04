import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../store/UserSlice";
import api from "../../utils/api";

function CustomGoogleButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      // Redirect back to original page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Google sign-in failed. Please try again.");
    }
  };

  const handleError = () => {
    console.log("Login Failed");
    alert("Google sign-in failed. Please try again.");
  };

  return (
    <div className="w-full mt-8 flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text="signup_with"
        shape="rectangular"
        logo_alignment="left"
      />
    </div>
  );
}

function GoogleAuth() {
  return (
    <div className="w-full flex justify-center">
      <CustomGoogleButton />
    </div>
  );
}

export default GoogleAuth;

