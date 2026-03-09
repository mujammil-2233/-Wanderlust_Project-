import React from "react";

const HomePage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          Welcome to Wanderlust
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
          Find or list beautiful properties around the world.
        </p>
        <div>
          <a
            href="/auth/register"
            style={{
              margin: "0 10px",
              padding: "12px 30px",
              background: "white",
              color: "#667eea",
              textDecoration: "none",
              borderRadius: "25px",
              display: "inline-block",
            }}
          >
            Register
          </a>
          <a
            href="#/login"
            style={{
              margin: "0 10px",
              padding: "12px 30px",
              background: "transparent",
              color: "white",
              textDecoration: "none",
              border: "2px solid white",
              borderRadius: "25px",
              display: "inline-block",
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
