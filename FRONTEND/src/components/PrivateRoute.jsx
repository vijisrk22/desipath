import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

export default PrivateRoute;
