import { useEffect, useState } from "react";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

import "../styles/notifications.css";

function PatientNotifications() {
  const { language } = useLanguage();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const text = {
    en: {
      title: "Notifications",
      subtitle:
        "Messages and important updates from your healthcare team.",
      unread: "unread",
      loading: "Loading notifications...",
      noNotifications: "No notifications",
      noNotificationsDescription:
        "You do not have any messages or notifications at the moment.",
      new: "New",
      markAsRead: "Mark as read",
      failedLoad:
        "Failed to load notifications.",
      failedRead:
        "Failed to mark notification as read.",
    },

    hi: {
      title: "सूचनाएँ",
      subtitle:
        "आपकी स्वास्थ्य टीम के संदेश और महत्वपूर्ण अपडेट।",
      unread: "अपठित",
      loading: "सूचनाएँ लोड हो रही हैं...",
      noNotifications: "कोई सूचना नहीं",
      noNotificationsDescription:
        "इस समय आपके पास कोई संदेश या सूचना नहीं है।",
      new: "नई",
      markAsRead: "पढ़ा हुआ चिह्नित करें",
      failedLoad:
        "सूचनाएँ लोड करने में समस्या हुई।",
      failedRead:
        "सूचना को पढ़ा हुआ चिह्नित करने में समस्या हुई।",
    },
  };

  const currentText = text[language];

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      setError(
        err.message || currentText.failedLoad
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      const updatedNotification =
        await markNotificationAsRead(notificationId);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === updatedNotification.id
            ? updatedNotification
            : notification
        )
      );
    } catch (err) {
      setError(
        err.message || currentText.failedRead
      );
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <h1>{currentText.title}</h1>

          <p>
            {currentText.subtitle}
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="notifications-count">
            {unreadCount} {currentText.unread}
          </div>
        )}

      </div>

      {error && (
        <div className="notification-error">
          {error}
        </div>
      )}

      {loading ? (

        <div className="notification-empty">
          <p>{currentText.loading}</p>
        </div>

      ) : notifications.length === 0 ? (

        <div className="notification-empty">

          <div className="notification-empty-icon">
            🔔
          </div>

          <h2>
            {currentText.noNotifications}
          </h2>

          <p>
            {currentText.noNotificationsDescription}
          </p>

        </div>

      ) : (

        <div className="notifications-list">

          {notifications.map((notification) => (

            <div
              key={notification.id}
              className={`notification-card ${
                notification.is_read
                  ? "notification-read"
                  : "notification-unread"
              }`}
            >

              <div className="notification-card-icon">
                {notification.notification_type ===
                "MISSED_DOSE"
                  ? "💉"
                  : "🔔"}
              </div>

              <div className="notification-card-content">

                <div className="notification-card-top">

                  <h2>
                    {notification.title}
                  </h2>

                  {!notification.is_read && (
                    <span className="notification-new">
                      {currentText.new}
                    </span>
                  )}

                </div>

                <p className="notification-message">
                  {notification.message}
                </p>

                <p className="notification-date">
                  {notification.created_at}
                </p>

                {!notification.is_read && (
                  <button
                    type="button"
                    className="notification-read-button"
                    onClick={() =>
                      handleMarkAsRead(
                        notification.id
                      )
                    }
                  >
                    {currentText.markAsRead}
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default PatientNotifications;