"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type Medicine = {
  id: string;
  code: string;
  genericName: string;
  brandName: string | null;
  dosage: string;
  form: string;
  prescriptionRequired: boolean;
};

/*
  Some inventory APIs may return quantity,
  reservedQuantity and availableQuantity
  in slightly different combinations.

  We keep these optional here and normalize
  them before showing values in the UI.
*/
type RawInventoryItem = {
  id: string;

  medicineId?: string;

  quantity?: number | string | null;

  reservedQuantity?:
    | number
    | string
    | null;

  availableQuantity?:
    | number
    | string
    | null;

  price:
    | number
    | string;

  lowStockThreshold?:
    | number
    | string
    | null;

  isActive?: boolean;

  medicine: {
    id: string;
    genericName: string;
    brandName?: string | null;
    dosage: string;
    form: string;
  };

  pharmacy?: {
    id: string;
    name: string;
    verificationStatus?: string;
  };
};

type InventoryItem = {
  id: string;

  medicineId?: string;

  quantity: number;

  reservedQuantity: number;

  availableQuantity: number;

  price: number;

  lowStockThreshold: number;

  isActive: boolean;

  medicine: {
    id: string;
    genericName: string;
    brandName?: string | null;
    dosage: string;
    form: string;
  };

  pharmacy?: {
    id: string;
    name: string;
    verificationStatus?: string;
  };
};

type ApiResponse<T> = {
  success: boolean;

  data?: T;

  error?: {
    code?: string;
    message?: string;
  };
};

/* =========================================================
   NUMBER HELPER

   Prevents NaN values from reaching the UI.
========================================================= */

function safeNumber(
  value:
    | number
    | string
    | null
    | undefined,
  fallback = 0,
) {
  const converted =
    Number(value);

  return Number.isFinite(
    converted,
  )
    ? converted
    : fallback;
}

/* =========================================================
   NORMALIZE INVENTORY ITEM

   This is the important NaN fix.

   Example:

   quantity = undefined
   reservedQuantity = undefined

   would normally create:

   undefined - undefined = NaN

   Instead, everything is converted safely.
========================================================= */

function normalizeInventoryItem(
  item: RawInventoryItem,
): InventoryItem {
  const reservedQuantity =
    safeNumber(
      item.reservedQuantity,
      0,
    );

  const rawAvailable =
    safeNumber(
      item.availableQuantity,
      -1,
    );

  /*
    If quantity exists, use it.

    If quantity is missing but the API gave us
    availableQuantity, reconstruct total stock:

    quantity =
      available + reserved
  */

  const rawQuantity =
    safeNumber(
      item.quantity,
      -1,
    );

  const quantity =
    rawQuantity >= 0
      ? rawQuantity
      : rawAvailable >= 0
        ? rawAvailable +
          reservedQuantity
        : 0;

  /*
    Prefer the backend's availableQuantity
    when it exists.

    Otherwise:

    available =
      quantity - reserved
  */

  const availableQuantity =
    rawAvailable >= 0
      ? rawAvailable
      : Math.max(
          0,
          quantity -
            reservedQuantity,
        );

  return {
    id: item.id,

    medicineId:
      item.medicineId,

    quantity,

    reservedQuantity,

    availableQuantity,

    price:
      safeNumber(
        item.price,
        0,
      ),

    lowStockThreshold:
      safeNumber(
        item.lowStockThreshold,
        5,
      ),

    isActive:
      item.isActive ??
      true,

    medicine:
      item.medicine,

    pharmacy:
      item.pharmacy,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function PharmacyDashboardPage() {
  const [
    medicines,
    setMedicines,
  ] = useState<Medicine[]>(
    [],
  );

  const [
    inventory,
    setInventory,
  ] = useState<
    InventoryItem[]
  >([]);

  const [
    medicineId,
    setMedicineId,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState("50");

  const [
    price,
    setPrice,
  ] = useState("125");

  const [
    lowStockThreshold,
    setLowStockThreshold,
  ] = useState("5");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  /* =======================================================
     LOAD MEDICINE CATALOGUE
  ======================================================= */

  const loadMedicines =
    useCallback(
      async () => {
        const response =
          await fetch(
            "/api/medicines/catalog",
            {
              cache:
                "no-store",
            },
          );

        const payload =
          (await response.json()) as ApiResponse<{
            items:
              Medicine[];
          }>;

        if (
          !response.ok ||
          !payload.success
        ) {
          throw new Error(
            payload.error
              ?.message ??
              "Could not load medicine catalogue.",
          );
        }

        const items =
          payload.data
            ?.items ??
          [];

        setMedicines(
          items,
        );

        if (
          items.length >
          0
        ) {
          setMedicineId(
            (
              current,
            ) =>
              current ||
              items[0].id,
          );
        }
      },
      [],
    );

  /* =======================================================
     LOAD PHARMACY INVENTORY
  ======================================================= */

  const loadInventory =
    useCallback(
      async () => {
        const response =
          await fetch(
            "/api/pharmacy/inventory",
            {
              cache:
                "no-store",
            },
          );

        const payload =
          (await response.json()) as ApiResponse<
            | RawInventoryItem[]
            | {
                items:
                  RawInventoryItem[];
              }
          >;

        if (
          response.status ===
          401
        ) {
          throw new Error(
            "Please sign in with a pharmacy staff account.",
          );
        }

        if (
          response.status ===
          403
        ) {
          throw new Error(
            "This account does not have access to this pharmacy dashboard.",
          );
        }

        if (
          !response.ok ||
          !payload.success
        ) {
          throw new Error(
            payload.error
              ?.message ??
              "Could not load pharmacy inventory.",
          );
        }

        let rawItems:
          RawInventoryItem[] =
          [];

        if (
          Array.isArray(
            payload.data,
          )
        ) {
          rawItems =
            payload.data;
        } else {
          rawItems =
            payload.data
              ?.items ??
            [];
        }

        /*
          This converts all quantity fields into
          safe numbers before storing them.
        */

        const normalizedItems =
          rawItems.map(
            normalizeInventoryItem,
          );

        setInventory(
          normalizedItems,
        );
      },
      [],
    );

  /* =======================================================
     INITIAL PAGE LOAD
  ======================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function loadDashboard() {
      try {
        setLoading(
          true,
        );

        setError("");

        await Promise.all([
          loadMedicines(),
          loadInventory(),
        ]);
      } catch (
        loadError:
          unknown
      ) {
        if (
          cancelled
        ) {
          return;
        }

        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Could not load pharmacy dashboard.",
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled =
        true;
    };
  }, [
    loadInventory,
    loadMedicines,
  ]);

  /* =======================================================
     DASHBOARD STATISTICS

     Because our inventory items have already
     been normalized, these calculations cannot
     produce NaN.
  ======================================================= */

  const statistics =
    useMemo(() => {
      const totalStock =
        inventory.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.quantity,
          0,
        );

      const totalReserved =
        inventory.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.reservedQuantity,
          0,
        );

      const totalAvailable =
        inventory.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.availableQuantity,
          0,
        );

      const lowStockItems =
        inventory.filter(
          (item) =>
            item
              .availableQuantity <=
            item
              .lowStockThreshold,
        ).length;

      return {
        totalStock,
        totalReserved,
        totalAvailable,
        lowStockItems,
      };
    }, [inventory]);

  /* =======================================================
     ADD MEDICINE TO INVENTORY
  ======================================================= */

  async function addInventory(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !medicineId
    ) {
      setError(
        "Please select a medicine.",
      );

      return;
    }

    const numericQuantity =
      Number(quantity);

    const numericPrice =
      Number(price);

    const numericThreshold =
      Number(
        lowStockThreshold,
      );

    /* ===============================
       CLIENT VALIDATION
    =============================== */

    if (
      !Number.isInteger(
        numericQuantity,
      ) ||
      numericQuantity <
        0
    ) {
      setError(
        "Quantity must be a whole number of 0 or more.",
      );

      return;
    }

    if (
      !Number.isFinite(
        numericPrice,
      ) ||
      numericPrice <=
        0
    ) {
      setError(
        "Price must be greater than zero.",
      );

      return;
    }

    if (
      !Number.isInteger(
        numericThreshold,
      ) ||
      numericThreshold <
        0
    ) {
      setError(
        "Low stock warning level must be a whole number of 0 or more.",
      );

      return;
    }

    try {
      setSaving(
        true,
      );

      const response =
        await fetch(
          "/api/pharmacy/inventory",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                medicineId,

                quantity:
                  numericQuantity,

                price:
                  numericPrice,

                lowStockThreshold:
                  numericThreshold,
              }),
          },
        );

      const payload =
        (await response.json()) as ApiResponse<unknown>;

      if (
        !response.ok ||
        !payload.success
      ) {
        throw new Error(
          payload.error
            ?.message ??
            "Could not add medicine to inventory.",
        );
      }

      setSuccess(
        "Medicine inventory saved successfully.",
      );

      /*
        Reload actual inventory from PostgreSQL.
      */

      await loadInventory();
    } catch (
      saveError:
        unknown
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Could not save medicine inventory.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="pharmacy-dashboard-page">
      {/* ===================================================
          PAGE HEADING
      =================================================== */}

      <section className="portal-heading">
        <div>
          <span className="portal-label">
            Pharmacy Portal
          </span>

          <h1>
            Manage your
            medicine stock
          </h1>

          <p>
            Add medicine
            availability, update
            stock quantities and
            control the prices
            customers see in
            MediFlux search.
          </p>
        </div>

        <div className="portal-status-card">
          <span>
            System
          </span>

          <strong>
            ● Connected
          </strong>
        </div>
      </section>

      {/* ===================================================
          STATISTICS
      =================================================== */}

      <section className="dashboard-stat-grid">
        <article>
          <span>
            Inventory items
          </span>

          <strong>
            {
              inventory.length
            }
          </strong>
        </article>

        <article>
          <span>
            Total stock
          </span>

          <strong>
            {
              statistics.totalStock
            }
          </strong>
        </article>

        <article>
          <span>
            Reserved
          </span>

          <strong>
            {
              statistics.totalReserved
            }
          </strong>
        </article>

        <article>
          <span>
            Available
          </span>

          <strong>
            {
              statistics.totalAvailable
            }
          </strong>
        </article>
      </section>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <section className="portal-grid">
        {/* =================================================
            ADD INVENTORY
        ================================================= */}

        <div className="portal-card">
          <div className="portal-card-heading">
            <div>
              <span>
                Inventory
              </span>

              <h2>
                Add Medicine
              </h2>
            </div>

            <div className="portal-card-icon">
              +
            </div>
          </div>

          <form
            className="inventory-form"
            onSubmit={
              addInventory
            }
          >
            {/* MEDICINE */}

            <label>
              Medicine

              <select
                value={
                  medicineId
                }
                onChange={(
                  event,
                ) =>
                  setMedicineId(
                    event
                      .target
                      .value,
                  )
                }
                required
              >
                {medicines.length ===
                0 ? (
                  <option value="">
                    No medicines
                    available
                  </option>
                ) : (
                  medicines.map(
                    (
                      medicine,
                    ) => (
                      <option
                        key={
                          medicine.id
                        }
                        value={
                          medicine.id
                        }
                      >
                        {
                          medicine.genericName
                        }{" "}
                        {
                          medicine.dosage
                        }{" "}
                        —{" "}
                        {
                          medicine.form
                        }
                      </option>
                    ),
                  )
                )}
              </select>
            </label>

            {/* QUANTITY + PRICE */}

            <div className="inventory-form-row">
              <label>
                Quantity

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    quantity
                  }
                  onChange={(
                    event,
                  ) =>
                    setQuantity(
                      event
                        .target
                        .value,
                    )
                  }
                  required
                />
              </label>

              <label>
                Price (LKR)

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    price
                  }
                  onChange={(
                    event,
                  ) =>
                    setPrice(
                      event
                        .target
                        .value,
                    )
                  }
                  required
                />
              </label>
            </div>

            {/* LOW STOCK */}

            <label>
              Low stock
              warning level

              <input
                type="number"
                min="0"
                step="1"
                value={
                  lowStockThreshold
                }
                onChange={(
                  event,
                ) =>
                  setLowStockThreshold(
                    event
                      .target
                      .value,
                  )
                }
                required
              />
            </label>

            {/* ERRORS */}

            {error && (
              <div className="portal-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="portal-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="portal-primary-button"
              disabled={
                saving ||
                medicines.length ===
                  0
              }
            >
              {saving
                ? "Saving..."
                : "Add to Inventory"}
            </button>
          </form>
        </div>

        {/* =================================================
            CURRENT INVENTORY
        ================================================= */}

        <div className="portal-card portal-inventory-list">
          <div className="portal-card-heading">
            <div>
              <span>
                Pharmacy Stock
              </span>

              <h2>
                Current Inventory
              </h2>
            </div>

            <div>
              <span>
                Low stock
              </span>

              <strong>
                {
                  statistics.lowStockItems
                }
              </strong>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="portal-empty">
              Loading
              inventory...
            </div>
          ) : inventory.length ===
            0 ? (
            /* EMPTY */

            <div className="portal-empty">
              No medicines have
              been added to this
              pharmacy yet.
            </div>
          ) : (
            /* INVENTORY ITEMS */

            inventory.map(
              (item) => {
                /*
                  IMPORTANT:

                  This is the part you asked
                  about.

                  We DO NOT calculate:

                  item.quantity -
                  item.reservedQuantity

                  directly anymore.

                  The values have already
                  been safely normalized.

                  Therefore NaN cannot appear.
                */

                const available =
                  item.availableQuantity;

                const isLowStock =
                  available <=
                  item.lowStockThreshold;

                return (
                  <article
                    key={
                      item.id
                    }
                    className="inventory-row"
                  >
                    {/* MEDICINE */}

                    <div>
                      <span className="inventory-name">
                        {
                          item
                            .medicine
                            .genericName
                        }{" "}
                        {
                          item
                            .medicine
                            .dosage
                        }
                      </span>

                      <small>
                        {
                          item
                            .medicine
                            .form
                        }
                      </small>
                    </div>

                    {/* AVAILABLE */}

                    <div className="inventory-number">
                      <small>
                        Available
                      </small>

                      <strong>
                        {
                          available
                        }
                      </strong>
                    </div>

                    {/* PRICE */}

                    <div className="inventory-number">
                      <small>
                        Price
                      </small>

                      <strong>
                        LKR{" "}
                        {item.price.toFixed(
                          2,
                        )}
                      </strong>
                    </div>

                    {/* STATUS */}

                    <span
                      className={
                        isLowStock
                          ? "inventory-status low"
                          : "inventory-status"
                      }
                    >
                      {isLowStock
                        ? "Low Stock"
                        : "Available"}
                    </span>
                  </article>
                );
              },
            )
          )}
        </div>
      </section>
    </main>
  );
}