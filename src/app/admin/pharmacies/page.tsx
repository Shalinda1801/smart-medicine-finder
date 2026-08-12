"use client";

import {
  useEffect,
  useState,
} from "react";

type Pharmacy = {
  id: string;
  name: string;
  slug: string;

  licenceNumber: string | null;
  phone: string | null;
  email: string | null;

  addressLine1: string;
  addressLine2?: string | null;

  city: string;
  district: string | null;
  postalCode?: string | null;

  verificationStatus: string;

  latitude: number | null;
  longitude: number | null;

  createdAt?: string;
};

type ApiResponse<T> = {
  success: boolean;

  data?: T;

  error?: {
    code?: string;
    message?: string;
  };
};

export default function AdminPharmaciesPage() {
  const [
    pharmacies,
    setPharmacies,
  ] = useState<Pharmacy[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    workingId,
    setWorkingId,
  ] = useState<string | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  /* ========================================================
     LOAD PENDING PHARMACIES
  ======================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadPendingPharmacies() {
      try {
        const response =
          await fetch(
            "/api/admin/pharmacies?status=PENDING&page=1&pageSize=50",
            {
              cache: "no-store",
            },
          );

        const payload =
          (await response.json()) as ApiResponse<
            | Pharmacy[]
            | {
                items: Pharmacy[];
              }
          >;

        if (
          !response.ok ||
          !payload.success
        ) {
          throw new Error(
            payload.error?.message ??
              "Could not load pending pharmacies.",
          );
        }

        if (cancelled) {
          return;
        }

        if (
          Array.isArray(
            payload.data,
          )
        ) {
          setPharmacies(
            payload.data,
          );
        } else {
          setPharmacies(
            payload.data?.items ?? [],
          );
        }
      } catch (
        loadError: unknown
      ) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load pending pharmacies.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPendingPharmacies();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================================
     APPROVE / REJECT
  ======================================================== */

  async function reviewPharmacy(
    pharmacyId: string,
    nextStatus:
      | "APPROVED"
      | "REJECTED",
  ) {
    setError("");
    setSuccess("");

    let reason:
      | string
      | undefined;

    /*
      Your Zod schema requires a reason
      only when the pharmacy is rejected.
    */

    if (
      nextStatus ===
      "REJECTED"
    ) {
      const enteredReason =
        window.prompt(
          "Enter the reason for rejecting this pharmacy:",
        );

      if (
        !enteredReason ||
        !enteredReason.trim()
      ) {
        setError(
          "A reason is required when rejecting a pharmacy.",
        );

        return;
      }

      reason =
        enteredReason.trim();
    }

    try {
      setWorkingId(
        pharmacyId,
      );

      const requestBody =
        nextStatus ===
        "REJECTED"
          ? {
              status:
                nextStatus,

              reason,
            }
          : {
              status:
                nextStatus,
            };

      const response =
        await fetch(
`/api/admin/pharmacies/${pharmacyId}/verification/`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                requestBody,
              ),
          },
        );

      const payload =
        (await response.json()) as ApiResponse<unknown>;

      if (
        !response.ok ||
        !payload.success
      ) {
        throw new Error(
          payload.error?.message ??
            "Could not update pharmacy verification.",
        );
      }

      setPharmacies(
        (current) =>
          current.filter(
            (pharmacy) =>
              pharmacy.id !==
              pharmacyId,
          ),
      );

      setSuccess(
        nextStatus ===
          "APPROVED"
          ? "Pharmacy approved successfully."
          : "Pharmacy rejected successfully.",
      );
    } catch (
      reviewError: unknown
    ) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Could not review pharmacy.",
      );
    } finally {
      setWorkingId(
        null,
      );
    }
  }

  return (
    <main className="admin-pharmacy-page">
      <section className="portal-heading">
        <div>
          <span className="portal-label">
            Administrator
          </span>

          <h1>
            Pharmacy verification
          </h1>

          <p>
            Review newly registered
            pharmacies before they can
            publish medicine availability
            to MediFlux customers.
          </p>
        </div>

        <div className="admin-pending-counter">
          <small>
            Pending
          </small>

          <strong>
            {pharmacies.length}
          </strong>
        </div>
      </section>

      {error && (
        <div className="portal-error portal-page-message">
          {error}
        </div>
      )}

      {success && (
        <div className="portal-success portal-page-message">
          {success}
        </div>
      )}

      <section className="admin-pharmacy-grid">
        {loading ? (
          <div className="portal-empty admin-empty">
            Loading pending pharmacy
            registrations...
          </div>
        ) : pharmacies.length ===
          0 ? (
          <div className="portal-empty admin-empty">
            <strong>
              ✓ Everything is reviewed
            </strong>

            <span>
              There are currently no
              pending pharmacy
              registrations.
            </span>
          </div>
        ) : (
          pharmacies.map(
            (pharmacy) => (
              <article
                key={
                  pharmacy.id
                }
                className="admin-pharmacy-card"
              >
                <div className="admin-card-top">
                  <div className="admin-pharmacy-icon">
                    +
                  </div>

                  <div>
                    <span className="pending-pill">
                      Pending Verification
                    </span>

                    <h2>
                      {pharmacy.name}
                    </h2>
                  </div>
                </div>

                <div className="admin-detail-grid">
                  <div>
                    <small>
                      Licence Number
                    </small>

                    <strong>
                      {pharmacy.licenceNumber ??
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <small>
                      Phone
                    </small>

                    <strong>
                      {pharmacy.phone ??
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <small>
                      City
                    </small>

                    <strong>
                      {pharmacy.city}
                    </strong>
                  </div>

                  <div>
                    <small>
                      District
                    </small>

                    <strong>
                      {pharmacy.district ??
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                <div className="admin-address">
                  <small>
                    Pharmacy Address
                  </small>

                  <strong>
                    {pharmacy.addressLine1}
                  </strong>
                </div>

                {pharmacy.latitude !==
                  null &&
                  pharmacy.longitude !==
                    null && (
                    <a
                      className="admin-map-link"
                      href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📍 View registered
                      location ↗
                    </a>
                  )}

                <div className="admin-review-actions">
                  <button
                    type="button"
                    className="reject-button"
                    disabled={
                      workingId ===
                      pharmacy.id
                    }
                    onClick={() =>
                      reviewPharmacy(
                        pharmacy.id,
                        "REJECTED",
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    className="approve-button"
                    disabled={
                      workingId ===
                      pharmacy.id
                    }
                    onClick={() =>
                      reviewPharmacy(
                        pharmacy.id,
                        "APPROVED",
                      )
                    }
                  >
                    {workingId ===
                    pharmacy.id
                      ? "Updating..."
                      : "✓ Approve Pharmacy"}
                  </button>
                </div>
              </article>
            ),
          )
        )}
      </section>
    </main>
  );
}