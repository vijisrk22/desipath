import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function AdminRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'superadmin');

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
