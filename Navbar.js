import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav
      style={{
        background: "#667eea",
        padding: "15px 0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Wanderlust
        </Link>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: location.pathname === "/" ? "underline" : "none",
              padding: "8px 16px",
              borderRadius: "5px",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            Home
          </Link>
          <Link
            to="/listings"
            style={{
              color: "white",
              textDecoration:
                location.pathname === "/listings" ? "underline" : "none",
              padding: "8px 16px",
              borderRadius: "5px",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            Listings
          </Link>
          <Link
            to="/login"
            style={{
              color: "white",
              textDecoration:
                location.pathname === "/login" ? "underline" : "none",
              padding: "8px 16px",
              borderRadius: "5px",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
