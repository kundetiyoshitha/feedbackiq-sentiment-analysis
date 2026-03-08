import React from "react";
import FeedbackForm from "../components/FeedbackForm";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "linear-gradient(120deg,#4F46E5,#6366F1)",
        color: "white"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "10px"
        }}>
          FeedbackIQ
        </h1>

        <p style={{
          fontSize: "1.1rem",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "auto"
        }}>
          AI-Powered Customer Feedback Intelligence Platform.  
          Understand how customers feel using real-time sentiment analysis.
        </p>

        <div style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "center",
          gap: "12px"
        }}>
          <a href="#feedback">
            <button style={buttonStyleWhite}>
              Submit Feedback
            </button>
          </a>

          <a href="#dashboard">
            <button style={buttonStyleOutline}>
              View Dashboard
            </button>
          </a>
        </div>
      </section>


      {/* FEEDBACK FORM */}
      <section id="feedback" style={{
        padding: "60px 20px"
      }}>
        <FeedbackForm />
      </section>


      {/* DASHBOARD */}
      <section id="dashboard" style={{
        padding: "60px 20px",
        background: "#F9FAFB"
      }}>
        <Dashboard />
      </section>


      {/* FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: "30px",
        background: "#111827",
        color: "#9CA3AF"
      }}>
        <p style={{ fontWeight: "600", color: "white" }}>
          FeedbackIQ
        </p>

        <p style={{ fontSize: "0.9rem" }}>
          AI-Powered Customer Sentiment Analytics Platform
        </p>

        <p style={{ fontSize: "0.8rem", marginTop: "10px" }}>
          Built with React • Node • MySQL • VADER NLP
        </p>

        <p style={{ marginTop: "8px", fontSize: "0.75rem" }}>
          © 2026
        </p>
      </footer>

    </div>
  );
}


/* Button Styles */

const buttonStyleWhite = {
  background: "white",
  color: "#4F46E5",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
};

const buttonStyleOutline = {
  background: "transparent",
  color: "white",
  border: "2px solid white",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
};