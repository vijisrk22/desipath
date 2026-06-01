import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
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
    <div className="w-full mt-8">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="signup_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
      />
    </div>
  );
}

function GoogleAuth() {
  return (
    <GoogleOAuthProvider clientId="122456871358-0ml36gj9qblo6smhq4j7hhpgb05khtdo.apps.googleusercontent.com">
      <div className="w-full">
        <CustomGoogleButton />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleAuth;
