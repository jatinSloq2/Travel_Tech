import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isLoggedIn, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  const hiddenFooterPaths = [
    "/profile",
    "/dashboard",
    "/admin/users",
    "/admin/bookings",
    "/vendor/listings",
    "/vendor/booking",
  ];
  const shouldHideFooter = hiddenFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Navbar />
      <Outlet />
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default ProtectedRoutes;
