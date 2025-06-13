import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaHotel,
  FaTrain,
  FaBus,
  FaUmbrellaBeach,
  FaUser,
  FaChartBar,
  FaStore,
  FaTools,
  FaSignOutAlt,
  FaSuitcaseRolling,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, role, handleLogout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pass icon components, not JSX elements
  const commonNavItems = [
    { label: "Flights", path: "/", icon: FaPlaneDeparture },
    { label: "Hotels", path: "/hotels", icon: FaHotel },
    { label: "Trains", path: "/trains", icon: FaTrain },
    { label: "Bus", path: "/buses", icon: FaBus },
    { label: "Packages", path: "/packages", icon: FaUmbrellaBeach },
  ];

  const roleBasedNavItems = {
    ADMIN: [
      { label: "Listings", path: "/admin/listings", icon: FaStore },
      { label: "Bookings", path: "/admin/bookings", icon: FaChartBar },
      { label: "Users", path: "/admin/users", icon: FaTools },
      { label: "Dashboard", path: "/dashboard", icon: FaChartBar },
    ],
    VENDOR: [
      { label: "Listings", path: "/vendor/listings", icon: FaStore },
      { label: "Bookings", path: "/vendor/booking", icon: FaChartBar },
      { label: "Dashboard", path: "/dashboard", icon: FaChartBar },
    ],
    USER: [
      { label: "My Trips", path: "/my-trips", icon: FaSuitcaseRolling },
      { label: "Wishlist", path: "/wishlist", icon: FaHeart },
    ],
  };

  const navItems = [...commonNavItems, ...(roleBasedNavItems[role] || [])];

  const toggleLoginModal = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md z-50">
      <div className="mx-auto px-6 py-3 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/images/Logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 text-sm items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="relative">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center font-medium transition-colors ${
                      isActive ? "text-orange-600" : "text-gray-700"
                    }`
                  }
                >
                  <Icon />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Right side desktop */}
        <div className="hidden md:flex space-x-4 text-sm font-medium items-center">
          {!isLoggedIn ? (
            <button
              onClick={toggleLoginModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <FaUser />
              <span>Login / Signup</span>
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <FaUser />
                <span className="capitalize">{user.first_name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md font-semibold text-orange-600 hover:bg-orange-100 transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 focus:outline-none relative w-8 h-8"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ transition: "transform 0.3s ease" }}
        >
          <div
            className={`block absolute h-[2px] w-6 bg-current transform transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mobileMenuOpen ? "rotate-45 top-[12px]" : "top-[6px]"
            }`}
          />
          <div
            className={`block absolute h-[2px] w-6 bg-current transition-opacity duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            } top-[12px]`}
            style={{
              transformOrigin: "center",
            }}
          />
          <div
            className={`block absolute h-[2px] w-6 bg-current transform transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mobileMenuOpen ? "-rotate-45 top-[12px]" : "top-[18px]"
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <ul className="flex flex-col px-4 py-3 space-y-2 text-gray-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 font-semibold py-2 px-3 rounded-md hover:bg-orange-100 transition-colors ${
                        isActive ? "text-orange-600" : "text-gray-700"
                      }`
                    }
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
            <li className="border-t border-gray-300 mt-2 pt-2">
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toggleLoginModal();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 w-full justify-center font-semibold"
                >
                  <FaUser />
                  <span>Login / Signup</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 w-full font-semibold"
                  >
                    <FaUser />
                    <span className="capitalize">{user.first_name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                      navigate("/");
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-orange-600 hover:bg-orange-100 w-full font-semibold mt-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
