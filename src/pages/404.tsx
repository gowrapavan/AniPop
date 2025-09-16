import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  // Generate random number between 1 and 8
  const randomImageNumber = Math.floor(Math.random() * 8) + 1;
  const randomImageSrc = `/char/${randomImageNumber}.png`;

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#232230",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <img
        src={randomImageSrc} // Use random image here
        alt="404 Error"
        style={{
          maxWidth: "300px",
          width: "60%",
          height: "auto",
          marginBottom: "30px",
        }}
      />
      <h1 style={{ fontSize: "3rem", marginBottom: "10px", color: "#ff6bcb" }}>
        404 Error
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "25px", color: "#ccc" }}>
        Oops! We can't find this page.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          padding: "12px 30px",
          background: "#8b5cf6",
          color: "#fff",
          fontWeight: 600,
          textDecoration: "none",
          borderRadius: "8px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLAnchorElement).style.background = "#7c3aed")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLAnchorElement).style.background = "#8b5cf6")
        }
      >
        Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
