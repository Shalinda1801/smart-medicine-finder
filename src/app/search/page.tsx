"use client";

import dynamic from "next/dynamic";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  MapPharmacy,
} from "@/components/search/medicine-map";

import {
  useLanguage,
} from "@/i18n/language-context";

function MapLoading() {
  const { t } =
    useLanguage();

  return (
    <div className="map-loading">
      {t(
        "search.loadingMap",
      )}
    </div>
  );
}

const MedicineMap =
  dynamic(
    () =>
      import(
        "@/components/search/medicine-map"
      ),
    {
      ssr:
        false,

      loading:
        () => (
          <MapLoading />
        ),
    },
  );

type SearchItem = {
  inventoryId:
    string;

  medicine: {
    id:
      string;

    code:
      string;

    genericName:
      string;

    brandName:
      string | null;

    dosage:
      string;

    form:
      string;

    activeIngredient:
      string | null;

    prescriptionRequired:
      boolean;
  };

  pharmacy: {
    id:
      string;

    slug:
      string;

    name:
      string;

    phone:
      string | null;

    addressLine1:
      string;

    addressLine2:
      string | null;

    city:
      string;

    district:
      string | null;

    latitude:
      number | null;

    longitude:
      number | null;

    verificationStatus:
      string;
  };

  stock: {
    availableQuantity:
      number;

    status:
      string;
  };

  price:
    string | number;

  lastUpdatedAt:
    string;
};

type SearchResponse = {
  success:
    boolean;

  data?: {
    items:
      SearchItem[];
  };

  error?: {
    message:
      string;
  };
};

type SortOption =
  | "LATEST"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "PHARMACY_ASC";

async function fetchMedicineResults(
  query:
    string,

  city:
    string,

  sort:
    SortOption,
) {
  const params =
    new URLSearchParams();

  params.set(
    "q",
    query,
  );

  params.set(
    "page",
    "1",
  );

  params.set(
    "pageSize",
    "50",
  );

  params.set(
    "sort",
    sort,
  );

  if (
    city.trim()
  ) {
    params.set(
      "city",
      city.trim(),
    );
  }

  const response =
    await fetch(
      `/api/medicines/search?${params.toString()}`,
      {
        cache:
          "no-store",
      },
    );

  const payload =
    (await response.json()) as SearchResponse;

  if (
    !response.ok ||
    !payload.success ||
    !payload.data
  ) {
    throw new Error(
      payload.error
        ?.message ??
        "Medicine search failed.",
    );
  }

  return payload.data.items;
}

export default function SearchPage() {
  const { t } =
    useLanguage();

  const [
    query,
    setQuery,
  ] =
    useState(
      "Paracetamol",
    );

  const [
    city,
    setCity,
  ] =
    useState("");

  const [
    sort,
    setSort,
  ] =
    useState<SortOption>(
      "PRICE_ASC",
    );

  const [
    items,
    setItems,
  ] =
    useState<
      SearchItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    selectedId,
    setSelectedId,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    let cancelled =
      false;

    async function loadInitialSearch() {
      try {
        const results =
          await fetchMedicineResults(
            "Paracetamol",
            "",
            "PRICE_ASC",
          );

        if (
          !cancelled
        ) {
          setItems(
            results,
          );
        }
      } catch (
        loadError:
          unknown
      ) {
        if (
          !cancelled
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Could not load medicines.",
          );
        }
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

    void loadInitialSearch();

    return () => {
      cancelled =
        true;
    };
  }, []);

  const mapPharmacies =
    useMemo(() => {
      const pharmacyMap =
        new Map<
          string,
          MapPharmacy
        >();

      for (
        const item of
        items
      ) {
        const {
          latitude,
          longitude,
        } =
          item.pharmacy;

        if (
          latitude ===
            null ||
          longitude ===
            null
        ) {
          continue;
        }

        const pharmacy:
          MapPharmacy = {
          pharmacyId:
            item.pharmacy.id,

          name:
            item.pharmacy.name,

          address:
            item.pharmacy
              .addressLine1,

          city:
            item.pharmacy.city,

          phone:
            item.pharmacy.phone,

          latitude,

          longitude,

          medicineName:
            item.medicine
              .genericName,

          dosage:
            item.medicine
              .dosage,

          price:
            Number(
              item.price,
            ),

          availableQuantity:
            item.stock
              .availableQuantity,

          stockStatus:
            item.stock.status,
        };

        const existing =
          pharmacyMap.get(
            pharmacy.pharmacyId,
          );

        if (
          !existing ||
          pharmacy.price <
            existing.price
        ) {
          pharmacyMap.set(
            pharmacy.pharmacyId,
            pharmacy,
          );
        }
      }

      return Array.from(
        pharmacyMap.values(),
      );
    }, [
      items,
    ]);

  async function handleSearch(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !query.trim()
    ) {
      setError(
        t(
          "search.error.enterMedicine",
        ),
      );

      return;
    }

    setLoading(
      true,
    );

    setError("");

    setSelectedId(
      null,
    );

    try {
      const results =
        await fetchMedicineResults(
          query.trim(),
          city,
          sort,
        );

      setItems(
        results,
      );
    } catch (
      searchError:
        unknown
    ) {
      setItems(
        [],
      );

      setError(
        searchError instanceof
          Error
          ? searchError.message
          : t(
              "search.error.search",
            ),
      );
    } finally {
      setLoading(
        false,
      );
    }
  }

  function navigateTo(
    pharmacy:
      MapPharmacy,
  ) {
    const destination =
      encodeURIComponent(
        `${pharmacy.latitude},${pharmacy.longitude}`,
      );

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="medicine-search-page">
      <section className="medicine-search-hero">
        <span className="medicine-search-label">
          {t(
            "search.badge",
          )}
        </span>

        <h1>
          {t(
            "search.title",
          )}
        </h1>

        <p>
          {t(
            "search.description",
          )}
        </p>

        <form
          className="medicine-search-form"
          onSubmit={
            handleSearch
          }
        >
          <input
            value={
              query
            }
            onChange={(
              event,
            ) => {
              setQuery(
                event.target
                  .value,
              );
            }}
            placeholder={t(
              "search.medicinePlaceholder",
            )}
            aria-label={t(
              "search.medicinePlaceholder",
            )}
          />

          <input
            value={
              city
            }
            onChange={(
              event,
            ) => {
              setCity(
                event.target
                  .value,
              );
            }}
            placeholder={t(
              "search.cityPlaceholder",
            )}
            aria-label={t(
              "search.cityPlaceholder",
            )}
          />

          <select
            value={
              sort
            }
            onChange={(
              event,
            ) => {
              setSort(
                event.target
                  .value as
                  SortOption,
              );
            }}
            aria-label={t(
              "search.sortLabel",
            )}
          >
            <option value="PRICE_ASC">
              {t(
                "search.sort.lowest",
              )}
            </option>

            <option value="PRICE_DESC">
              {t(
                "search.sort.highest",
              )}
            </option>

            <option value="PHARMACY_ASC">
              {t(
                "search.sort.pharmacy",
              )}
            </option>

            <option value="LATEST">
              {t(
                "search.sort.latest",
              )}
            </option>
          </select>

          <button
            type="submit"
            disabled={
              loading
            }
          >
            {loading
              ? t(
                  "search.searching",
                )
              : t(
                  "search.button",
                )}
          </button>
        </form>
      </section>

      <section className="medicine-results-summary">
        <div>
          <span>
            {t(
              "search.results",
            )}
          </span>

          <strong>
            {
              mapPharmacies.length
            }{" "}
            {mapPharmacies.length ===
            1
              ? t(
                  "search.pharmacyFound",
                )
              : t(
                  "search.pharmaciesFound",
                )}
          </strong>
        </div>

        <div className="demo-data-badge">
          {t(
            "search.demoData",
          )}
        </div>
      </section>

      {error && (
        <div className="medicine-search-error">
          {
            error
          }
        </div>
      )}

      <section className="medicine-search-layout">
        <div className="pharmacy-results-panel">
          {loading && (
            <div className="result-message">
              {t(
                "search.searchingPharmacies",
              )}
            </div>
          )}

          {!loading &&
            mapPharmacies.length ===
              0 && (
              <div className="result-message">
                <strong>
                  {t(
                    "search.noResults",
                  )}
                </strong>

                <br />

                {t(
                  "search.noResultsDescription",
                )}
              </div>
            )}

          {!loading &&
            mapPharmacies.map(
              (
                pharmacy,
                index,
              ) => (
                <article
                  key={
                    pharmacy.pharmacyId
                  }
                  className={`pharmacy-result-card ${
                    selectedId ===
                    pharmacy.pharmacyId
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedId(
                      pharmacy.pharmacyId,
                    );
                  }}
                >
                  <div className="pharmacy-card-number">
                    {
                      index +
                      1
                    }
                  </div>

                  <div className="pharmacy-result-content">
                    <div className="pharmacy-result-heading">
                      <div>
                        <span className="verified-pharmacy-label">
                          ✓{" "}
                          {t(
                            "search.verified",
                          )}
                        </span>

                        <h2>
                          {
                            pharmacy.name
                          }
                        </h2>
                      </div>

                      <span className="stock-pill">
                        {
                          pharmacy.availableQuantity
                        }{" "}
                        {t(
                          "search.available",
                        )}
                      </span>
                    </div>

                    <p>
                      {
                        pharmacy.address
                      }
                      ,{" "}
                      {
                        pharmacy.city
                      }
                    </p>

                    <div className="medicine-result-line">
                      <div>
                        <small>
                          {t(
                            "search.medicine",
                          )}
                        </small>

                        <strong>
                          {
                            pharmacy.medicineName
                          }{" "}
                          {
                            pharmacy.dosage
                          }
                        </strong>
                      </div>

                      <div>
                        <small>
                          {t(
                            "search.price",
                          )}
                        </small>

                        <strong>
                          LKR{" "}
                          {pharmacy.price.toFixed(
                            2,
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="pharmacy-result-actions">
                      <button
                        type="button"
                        className="view-map-button"
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          setSelectedId(
                            pharmacy.pharmacyId,
                          );
                        }}
                      >
                        {t(
                          "search.showMap",
                        )}
                      </button>

                      <button
                        type="button"
                        className="directions-button"
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          navigateTo(
                            pharmacy,
                          );
                        }}
                      >
                        {t(
                          "search.directions",
                        )}{" "}
                        ↗
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
        </div>

        <div className="medicine-map-panel">
          <div className="medicine-map-heading">
            <div>
              <span>
                {t(
                  "search.map",
                )}
              </span>

              <strong>
                {t(
                  "search.nearby",
                )}
              </strong>
            </div>

            <span className="map-live-badge">
              ●{" "}
              {t(
                "search.interactive",
              )}
            </span>
          </div>

          <MedicineMap
            pharmacies={
              mapPharmacies
            }
            selectedId={
              selectedId
            }
            onSelect={
              setSelectedId
            }
          />
        </div>
      </section>
    </main>
  );
}