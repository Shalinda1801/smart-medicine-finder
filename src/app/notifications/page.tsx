"use client";

import { useEffect, useState } from "react";

import SiteHeader from "@/components/site-header";
import { apiRequest } from "@/lib/api-client";

type Notification = {
  id: string;
  reservationId: string | null;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

type NotificationResponse = {
  items: Notification[];
  unreadCount: number;

  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const data =
          await apiRequest<NotificationResponse>(
            "/api/notifications",
          );

        if (!cancelled) {
          setNotifications(data.items);
          setUnreadCount(
            data.unreadCount,
          );
        }
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Could not load notifications.";

        if (
          message
            .toLowerCase()
            .includes("sign in")
        ) {
          window.location.href = "/login";
          return;
        }

        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshNotifications() {
    const data =
      await apiRequest<NotificationResponse>(
        "/api/notifications",
      );

    setNotifications(data.items);
    setUnreadCount(
      data.unreadCount,
    );
  }

  async function markRead(
    notificationId: string,
  ) {
    try {
      setError("");

      await apiRequest(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        },
      );

      await refreshNotifications();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not update notification.",
      );
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="dashboard-page">
        <section className="page-heading">
          <span>Notifications</span>

          <h1>
            Your medicine updates
          </h1>

          <p>
            You currently have{" "}
            <strong>
              {unreadCount}
            </strong>{" "}
            unread notification
            {unreadCount === 1
              ? ""
              : "s"}
            .
          </p>
        </section>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            Loading notifications...
          </div>
        ) : notifications.length ===
          0 ? (
          <div className="empty-state">
            <h2>No notifications</h2>

            <p>
              Medicine and reservation
              updates will appear here.
            </p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map(
              (notification) => (
                <article
                  key={
                    notification.id
                  }
                  className={`notification-card ${
                    notification.readAt
                      ? ""
                      : "unread"
                  }`}
                >
                  <div>
                    <span className="small-label">
                      {notification.type.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>

                    <h3>
                      {
                        notification.title
                      }
                    </h3>

                    <p>
                      {
                        notification.body
                      }
                    </p>

                    <small>
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </small>
                  </div>

                  {!notification.readAt && (
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() =>
                        markRead(
                          notification.id,
                        )
                      }
                    >
                      Mark as read
                    </button>
                  )}
                </article>
              ),
            )}
          </div>
        )}
      </main>
    </>
  );
}