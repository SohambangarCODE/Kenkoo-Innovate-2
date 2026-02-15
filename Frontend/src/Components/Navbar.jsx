import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const linkClass = ({ isActive }) =>
  `relative z-[5]
  sm:px-3 md:px-4 sm:py-1 md:py-2
  text-sm sm:text-base md:text-lg
  flex items-center justify-center gap-2
  font-semibold
  py-2.5 px-5
  w-fit
  rounded-2xl
  border-t-2 border-l-2 border-b-4 border-r-4 border-slate-900
  shadow-md
  active:scale-95
   hover:-translate-y-1
  transition-all duration-200
  group
  ${
    isActive
      ? "bg-blue-700 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`;


  // CSS for the underline animation that will come from cursor direction
  const navItemStyle = {
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  // This will be used to track mouse position for the underline animation
  const handleMouseEnter = (e) => {
    const el = e.currentTarget;
    const underline = el.querySelector(".nav-underline");
    if (underline) {
      // Get cursor position relative to the element
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      // Determine if cursor is coming from left or right
      const fromLeft = x < width / 2;

      // Set the starting position of the underline
      underline.style.left = fromLeft ? "-100%" : "100%";
      underline.style.right = "auto";

      // Add a subtle glow effect
      el.style.textShadow = "0 0 5px rgba(56, 182, 255, 0.5)";

      // Trigger animation
      setTimeout(() => {
        underline.style.left = "0";
      }, 10);
    }
  };

  const handleMouseLeave = (e) => {
    const el = e.currentTarget;
    // Remove the glow effect
    el.style.textShadow = "none";
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 px-3 ${
        isScrolled
          ? "bg-white/40 backdrop-blur-md shadow-md border-b border-[#b4b4b4]/30"
          : "bg-white shadow-sm border-b border-[#b4b4b4]/30"
      }`}
    >
      <div className="container-fluid mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
              <img
                src="/logo.png-removebg-preview.png"
                alt="Kenkoo logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              />
            </div>
            <div className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#05395e]">
              Kenkoo
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative flex flex-col justify-between w-7 h-5 sm:w-8 sm:h-6 focus:outline-none group"
              aria-label="Toggle menu"
            >
              {/* Top bar */}
              <motion.span
                className="block h-1 w-full bg-gray-800 rounded-full"
                animate={
                  isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              {/* Middle bar */}
              <motion.span
                className="block h-1 w-full bg-gray-800 rounded-full"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Bottom bar */}
              <motion.span
                className="block h-1 w-full bg-gray-800 rounded-full"
                animate={
                  isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              {/* Optional hover effect */}
              <span className="absolute inset-0 rounded-md scale-125 opacity-0 group-hover:opacity-10 bg-gray-500 transition" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-2 md:items-center">
            <NavLink
              to="/"
              className={linkClass}
              end
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Assistant
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full  transform transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"></div>
            </NavLink>
            <NavLink
              to="/Records"
              className={linkClass}
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Records
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full transform transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </NavLink>
            <NavLink
              to="/Insights"
              className={linkClass}
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Insights
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full  transform transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </NavLink>
            <NavLink
              to="/careplan"
              className={linkClass}
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Care Plan
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full  transform transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </NavLink>
            {/* <NavLink
              to="/about"
              className={linkClass}
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              About Us
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full transform transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </NavLink> */}
            <NavLink
              to="/contact"
              className={linkClass}
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Contact Us
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full transform transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </NavLink>
            <NavLink
              to="/profile"
              className={linkClass}
              style={navItemStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Your Profile
              <div className="nav-underline absolute bottom-0 left-0 h-0.5 w-full transform transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </NavLink>
            {/* <Link
              to="/signin"
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-md"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 hover:scale-105 shadow-md"
            >
              Log In
            </Link> */}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-white shadow-md z-20 border-b border-gray-200`}
        >
          <div className="flex flex-col py-2">
            <NavLink
              to="/"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              end
              onClick={handleLinkClick}
            >
              Assistant
            </NavLink>
            <NavLink
              to="/Records"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              onClick={handleLinkClick}
            >
              Records
            </NavLink>
            <NavLink
              to="/Insights"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              onClick={handleLinkClick}
            >
              Insights
            </NavLink>
            <NavLink
              to="/careplan"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              onClick={handleLinkClick}
            >
              Care Plan
            </NavLink>
            {/* <NavLink
              to="/about"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              onClick={handleLinkClick}
            >
              About Us
            </NavLink> */}
            <NavLink
              to="/contact"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              onClick={handleLinkClick}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/profile"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#05395e] font-medium transition-all duration-300 hover:pl-6 hover:shadow-inner"
              onClick={handleLinkClick}
            >
              Your Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
