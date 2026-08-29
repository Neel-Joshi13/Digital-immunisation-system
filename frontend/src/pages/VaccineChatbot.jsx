import { useState } from "react";

import { askVaccineAssistant } from "../services/api";

import "../styles/vaccine-chatbot.css";

function VaccineChatbot() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your Digital Immunisation Assistant. Ask me about vaccines, doses, vaccination schedules, or missed vaccinations.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setError("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");

    setLoading(true);

    try {
      const data = await askVaccineAssistant(
        trimmedMessage
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickQuestion(question) {
    if (loading) {
      return;
    }

    setMessage(question);
  }

  return (
    <div className="vaccine-chatbot">

      <div className="vaccine-chatbot-header">

        <div className="vaccine-chatbot-header-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-3.6A8.38 8.38 0 0 1 3 12.5 8.5 8.5 0 0 1 12 4a8.38 8.38 0 0 1 5.4 1.9A8.5 8.5 0 0 1 21 11.5Z" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>

        <div>
          <h1>
            Vaccine Assistant
          </h1>

          <p>
            Get quick answers about vaccines
          </p>
        </div>

      </div>

      <div className="vaccine-chatbot-disclaimer">

        <div className="vaccine-chatbot-disclaimer-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v6" />
            <path d="M12 7h.01" />
          </svg>
        </div>

        <div>
          <strong>Important:</strong>{" "}
          This AI assistant provides general vaccine
          information and does not replace advice from
          a qualified healthcare professional.
        </div>

      </div>

      <div className="vaccine-chatbot-quick">

        <span className="vaccine-chatbot-quick-label">
          Try asking
        </span>

        <button
          type="button"
          onClick={() =>
            handleQuickQuestion(
              "What vaccines are available in India?"
            )
          }
        >
          Vaccines in India
        </button>

        <button
          type="button"
          onClick={() =>
            handleQuickQuestion(
              "Why are vaccination doses given at different ages?"
            )
          }
        >
          Dose information
        </button>

        <button
          type="button"
          onClick={() =>
            handleQuickQuestion(
              "What should I do if I missed a vaccine dose?"
            )
          }
        >
          Missed dose
        </button>

      </div>

      <div className="vaccine-chatbot-window">

        <div className="vaccine-chatbot-topbar">

          <div className="vaccine-chatbot-agent">

            <div className="vaccine-chatbot-agent-avatar">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="4"
                  y="6"
                  width="16"
                  height="13"
                  rx="3"
                />

                <path d="M8 12h.01" />
                <path d="M16 12h.01" />

                <path d="M9 16h6" />

                <path d="M12 3v3" />

                <path d="M9 3h6" />
              </svg>

            </div>

            <div>

              <div className="vaccine-chatbot-agent-name">
                Digital Immunisation Assistant
              </div>

              <div className="vaccine-chatbot-agent-status">

                <span className="vaccine-chatbot-agent-status-dot"></span>

                Available to answer

              </div>

            </div>

          </div>

          <span className="vaccine-chatbot-topbar-label">
            AI Assistant
          </span>

        </div>

        <div className="vaccine-chatbot-messages">

          {messages.map((item, index) => (

            <div
              key={index}
              className={
                item.role === "user"
                  ? "chat-message user-message"
                  : "chat-message assistant-message"
              }
            >

              <div className="chat-message-role">

                {item.role === "user"
                  ? "You"
                  : "Vaccine Assistant"}

              </div>

              <div className="chat-message-content">
                {item.content}
              </div>

            </div>

          ))}

          {loading && (

            <div
              className="
                chat-message
                assistant-message
                thinking-message
              "
            >

              <div className="chat-message-role">
                Vaccine Assistant
              </div>

              <div className="chat-thinking">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>

          )}

        </div>

        {error && (

          <div className="vaccine-chatbot-error">
            {error}
          </div>

        )}

        <form
          className="vaccine-chatbot-form"
          onSubmit={handleSubmit}
        >

          <div className="vaccine-chatbot-input-wrapper">

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Ask something about vaccines..."
              disabled={loading}
              aria-label="Ask the vaccine assistant"
            />

          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !message.trim()
            }
          >

            {loading ? (
              "Sending..."
            ) : (
              <>
                Ask

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
}

export default VaccineChatbot;