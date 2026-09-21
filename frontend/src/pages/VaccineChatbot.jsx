import { useState } from "react";
import { askVaccineAssistant } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/vaccine-chatbot.css";

function VaccineChatbot() {
  const { language } = useLanguage();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        language === "hi"
          ? "नमस्ते! मैं आपका डिजिटल टीकाकरण सहायक हूँ। आप मुझसे टीकों, खुराक, टीकाकरण अनुसूची या छूटे हुए टीकों के बारे में पूछ सकते हैं।"
          : "Hello! I am your Digital Immunisation Assistant. Ask me about vaccines, doses, vaccination schedules, or missed vaccinations.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const text = {
    en: {
      title: "Vaccine Assistant",
      subtitle: "Get answers about vaccines",
      important: "Important:",
      disclaimer:
        "This AI assistant provides general vaccine information and does not replace advice from a qualified healthcare professional.",
      tryAsking: "Try asking",
      vaccinesIndia: "Vaccines in India",
      doseInformation: "Dose information",
      missedDose: "Missed dose",
      vaccinesIndiaQuestion:
        "What vaccines are available in India?",
      doseInformationQuestion:
        "Why are vaccination doses given at different ages?",
      missedDoseQuestion:
        "What should I do if I missed a vaccine dose?",
      available: "Available to answer",
      aiAssistant: "AI Assistant",
      you: "You",
      assistant: "Vaccine Assistant",
      placeholder: "Ask something about vaccines...",
      ariaLabel: "Ask the vaccine assistant",
      sending: "Sending...",
      ask: "Ask",
    },
    hi: {
      title: "टीका सहायक",
      subtitle: "टीकों के बारे में जानकारी प्राप्त करें",
      important: "महत्वपूर्ण:",
      disclaimer:
        "यह AI सहायक टीकों के बारे में सामान्य जानकारी प्रदान करता है और योग्य स्वास्थ्य पेशेवर की सलाह का विकल्प नहीं है।",
      tryAsking: "यह पूछकर देखें",
      vaccinesIndia: "भारत में टीके",
      doseInformation: "खुराक की जानकारी",
      missedDose: "छूटी हुई खुराक",
      vaccinesIndiaQuestion:
        "भारत में कौन-कौन से टीके उपलब्ध हैं?",
      doseInformationQuestion:
        "टीकाकरण की खुराक अलग-अलग उम्र में क्यों दी जाती है?",
      missedDoseQuestion:
        "अगर मेरी कोई टीके की खुराक छूट गई है तो मुझे क्या करना चाहिए?",
      available: "उत्तर देने के लिए उपलब्ध",
      aiAssistant: "AI सहायक",
      you: "आप",
      assistant: "टीका सहायक",
      placeholder: "टीकों के बारे में कुछ पूछें...",
      ariaLabel: "टीका सहायक से प्रश्न पूछें",
      sending: "भेजा जा रहा है...",
      ask: "पूछें",
    },
  };

  const currentText = text[language];

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
        trimmedMessage,
        language
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
            <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-3.6A8.38 8.38 0 0 1 3 12.5 8.5 8.5 0 0 1 12 4a8.38 8.38 0 0 1 5.4 1.9A8.38 8.38 0 0 1 21 11.5Z" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>

        <div>
          <h1>{currentText.title}</h1>

          <p>{currentText.subtitle}</p>
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
          <strong>{currentText.important}</strong>{" "}
          {currentText.disclaimer}
        </div>
      </div>

      <div className="vaccine-chatbot-quick">
        <span className="vaccine-chatbot-quick-label">
          {currentText.tryAsking}
        </span>

        <button
          type="button"
          onClick={() =>
            handleQuickQuestion(
              currentText.vaccinesIndiaQuestion
            )
          }
        >
          {currentText.vaccinesIndia}
        </button>

        <button
          type="button"
          onClick={() =>
            handleQuickQuestion(
              currentText.doseInformationQuestion
            )
          }
        >
          {currentText.doseInformation}
        </button>

        <button
          type="button"
          onClick={() =>
            handleQuickQuestion(
              currentText.missedDoseQuestion
            )
          }
        >
          {currentText.missedDose}
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
                {currentText.available}
              </div>
            </div>
          </div>

          <span className="vaccine-chatbot-topbar-label">
            {currentText.aiAssistant}
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
                  ? currentText.you
                  : currentText.assistant}
              </div>

              <div className="chat-message-content">
                {item.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant-message thinking-message">
              <div className="chat-message-role">
                {currentText.assistant}
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
              placeholder={currentText.placeholder}
              disabled={loading}
              aria-label={currentText.ariaLabel}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim()}
          >
            {loading ? (
              currentText.sending
            ) : (
              <>
                {currentText.ask}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 9 20-20Z" />
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