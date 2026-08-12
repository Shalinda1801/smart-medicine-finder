"use client";

import { useEffect, useState } from "react";

import SiteHeader from "@/components/site-header";
import { apiRequest } from "@/lib/api-client";

type ReservationItem = {
  id: string;
  quantity: number;
  unitPrice: number | string;

  inventory: {
    id: string;

    medicine: {
      id: string;
      code: string;
      genericName: string;
      brandName: string | null;
      dosage: string;
      form: string;
    };
  };
};

type Reservation = {
  id: string;
  status: string;
  pickupCode?: string | null;
  expiresAt: string;
  createdAt: string;

  pharmacy: {
    id: string;
    name: string;
    city: string;
    phone?: string | null;
  };

  items: ReservationItem[];
};

type ReservationResponse = {
  items: Reservation[];

  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export default function ReservationsPage() {
  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const data =
          await apiRequest<ReservationResponse>(
            "/api/reservations",
          );

        if (!cancelled) {
          setReservations(data.items);
        }
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Could not load reservations.";

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

  async function refreshReservations() {
    const data =
      await apiRequest<ReservationResponse>(
        "/api/reservations",
      );

    setReservations(data.items);
  }

  async function cancelReservation(
    reservationId: string,
  ) {
    const confirmed =
      window.confirm(
        "Cancel this reservation?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(
        `/api/reservations/${reservationId}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            status: "CANCELLED",
          }),
        },
      );

      await refreshReservations();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not cancel reservation.",
      );
    }
  }

  function canCancel(status: string) {
    return [
      "PENDING",
      "CONFIRMED",
      "READY_FOR_PICKUP",
    ].includes(status);
  }

  return (
    <>
      <SiteHeader />

      <main className="dashboard-page">
        <section className="page-heading">
          <span>My Reservations</span>

          <h1>Medicine reservations</h1>

          <p>
            Track reservation status,
            pickup information and previous
            medicine requests.
          </p>
        </section>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            Loading reservations...
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <h2>No reservations yet</h2>

            <p>
              Search for medicine and
              reserve available stock.
            </p>
          </div>
        ) : (
          <div className="reservation-grid">
            {reservations.map(
              (reservation) => (
                <article
                  key={reservation.id}
                  className="dashboard-card"
                >
                  <div className="card-top">
                    <div>
                      <span className="small-label">
                        Reservation
                      </span>

                      <h2>
                        {
                          reservation
                            .pharmacy.name
                        }
                      </h2>

                      <p>
                        {
                          reservation
                            .pharmacy.city
                        }
                      </p>
                    </div>

                    <span
                      className={`status-badge status-${reservation.status.toLowerCase()}`}
                    >
                      {reservation.status.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>
                  </div>

                  <div className="reservation-items">
                    {reservation.items.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="reservation-item"
                        >
                          <div>
                            <strong>
                              {
                                item
                                  .inventory
                                  .medicine
                                  .genericName
                              }
                            </strong>

                            <p>
                              {
                                item
                                  .inventory
                                  .medicine
                                  .dosage
                              }{" "}
                              •{" "}
                              {
                                item
                                  .inventory
                                  .medicine
                                  .form
                              }
                            </p>
                          </div>

                          <div className="reservation-price">
                            <span>
                              Qty{" "}
                              {item.quantity}
                            </span>

                            <strong>
                              LKR{" "}
                              {Number(
                                item.unitPrice,
                              ).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {reservation.pickupCode && (
                    <div className="pickup-code">
                      <span>
                        Pickup Code
                      </span>

                      <strong>
                        {
                          reservation.pickupCode
                        }
                      </strong>
                    </div>
                  )}

                  <div className="card-footer">
                    <small>
                      Created{" "}
                      {new Date(
                        reservation.createdAt,
                      ).toLocaleString()}
                    </small>

                    {canCancel(
                      reservation.status,
                    ) && (
                      <button
                        type="button"
                        className="button danger"
                        onClick={() =>
                          cancelReservation(
                            reservation.id,
                          )
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </main>
    </>
  );
}