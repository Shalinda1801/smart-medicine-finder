"use client";

import { useEffect, useState } from "react";

import SiteHeader from "@/components/site-header";
import { apiRequest } from "@/lib/api-client";

type WatchlistItem = {
  id: string;
  radiusKm: number;
  currentlyAvailable: boolean;

  medicine: {
    id: string;
    code: string;
    genericName: string;
    brandName: string | null;
    dosage: string;
    form: string;
  };

  availableAt: {
    inventoryId: string;

    pharmacy: {
      id: string;
      name: string;
      city: string;
      district: string | null;
    };

    availableQuantity: number;
    price: number;
  }[];
};

type WatchlistResponse = {
  items: WatchlistItem[];
};

export default function WatchlistPage() {
  const [items, setItems] =
    useState<WatchlistItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const data =
          await apiRequest<WatchlistResponse>(
            "/api/watchlist",
          );

        if (!cancelled) {
          setItems(data.items);
        }
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Could not load watchlist.";

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

  async function refreshWatchlist() {
    const data =
      await apiRequest<WatchlistResponse>(
        "/api/watchlist",
      );

    setItems(data.items);
  }

  async function removeItem(
    watchlistId: string,
  ) {
    try {
      setError("");

      await apiRequest(
        `/api/watchlist/${watchlistId}`,
        {
          method: "DELETE",
        },
      );

      await refreshWatchlist();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not remove medicine.",
      );
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="dashboard-page">
        <section className="page-heading">
          <span>
            Medicine Watchlist
          </span>

          <h1>
            Medicines you are watching
          </h1>

          <p>
            Quickly check whether your
            watched medicines are currently
            available.
          </p>
        </section>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            Loading watchlist...
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h2>
              Your watchlist is empty
            </h2>

            <p>
              Add medicines from the search
              page.
            </p>
          </div>
        ) : (
          <div className="watchlist-grid">
            {items.map((item) => (
              <article
                className="dashboard-card"
                key={item.id}
              >
                <div className="card-top">
                  <div>
                    <span className="small-label">
                      {
                        item.medicine
                          .code
                      }
                    </span>

                    <h2>
                      {
                        item.medicine
                          .genericName
                      }
                    </h2>

                    <p>
                      {item.medicine
                        .brandName &&
                        `${item.medicine.brandName} • `}

                      {
                        item.medicine
                          .dosage
                      }{" "}
                      •{" "}
                      {
                        item.medicine
                          .form
                      }
                    </p>
                  </div>

                  <span
                    className={
                      item.currentlyAvailable
                        ? "status-badge status-available"
                        : "status-badge status-out"
                    }
                  >
                    {item.currentlyAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                {item.availableAt.length >
                  0 &&
                  item.availableAt.map(
                    (availability) => (
                      <div
                        key={
                          availability.inventoryId
                        }
                        className="availability-row"
                      >
                        <div>
                          <strong>
                            {
                              availability
                                .pharmacy
                                .name
                            }
                          </strong>

                          <p>
                            {
                              availability
                                .pharmacy
                                .city
                            }
                          </p>
                        </div>

                        <div>
                          <span>
                            {
                              availability
                                .availableQuantity
                            }{" "}
                            available
                          </span>

                          <strong>
                            LKR{" "}
                            {Number(
                              availability.price,
                            ).toFixed(
                              2,
                            )}
                          </strong>
                        </div>
                      </div>
                    ),
                  )}

                <button
                  className="button danger"
                  type="button"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}