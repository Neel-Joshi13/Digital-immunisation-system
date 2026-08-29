import { useState } from "react";
import { askAIAssistant } from "../services/api";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setError("");

    setConversation((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await askAIAssistant(trimmedMessage);

      setConversation((previous) => [
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

  return (
    <div className="patient-page">

      <div className="patient-page-header">
        <h1>AI Vaccination Assistant</h1>

        <p>
          Ask questions about vaccines and
          immunisation schedules.
        </p>
      </div>

      <section className="ai-assistant">

        <div className="ai-conversation">

          {conversation.length === 0 && (
            <div className="ai-welcome">
              <h2>How can I help?</h2>

              <p>
                You can ask about vaccines, doses,
                vaccination schedules or missed doses.
              </p>
            </div>
          )}

          {conversation.map((item, index) => (
            <div
              key={index}
              className={`ai-message ${
                item.role === "user"
                  ? "ai-message-user"
                  : "ai-message-assistant"
              }`}
            >
              <div className="ai-message-label">
                {item.role === "user"
                  ? "You"
                  : "Vaccine Assistant"}
              </div>

              <div className="ai-message-content">
                {item.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-message ai-message-assistant">
              <div className="ai-message-label">
                Vaccine Assistant
              </div>

              <div className="ai-message-content">
                Thinking...
              </div>
            </div>
          )}

        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          className="ai-input-form"
          onSubmit={handleSubmit}
        >
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Ask a question about vaccination..."
            rows="3"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending..." : "Ask Assistant"}
          </button>
        </form>

      </section>

    </div>
  );
}

export default AIAssistant;