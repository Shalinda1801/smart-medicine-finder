"use client";

import {
  useEffect,
  useMemo,
} from "react";

import L from "leaflet";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  useLanguage,
} from "@/i18n/language-context";

export type MapPharmacy = {
  pharmacyId:
    string;

  name:
    string;

  address:
    string;

  city:
    string;

  latitude:
    number;

  longitude:
    number;

  phone?:
    string | null;

  medicineName:
    string;

  dosage:
    string;

  price:
    number;

  availableQuantity:
    number;

  stockStatus:
    string;
};

type MedicineMapProps = {
  pharmacies:
    MapPharmacy[];

  selectedId:
    string | null;

  onSelect: (
    pharmacyId:
      string,
  ) => void;
};

const COLOMBO_CENTER:
  [number, number] = [
    6.9271,
    79.8612,
  ];

/* =========================================================
   MAP CAMERA CONTROLLER
========================================================= */

function MapController({
  pharmacies,
  selectedId,
}: {
  pharmacies:
    MapPharmacy[];

  selectedId:
    string | null;
}) {
  const map =
    useMap();

  useEffect(() => {
    if (
      pharmacies.length ===
      0
    ) {
      map.setView(
        COLOMBO_CENTER,
        12,
      );

      return;
    }

    const selectedPharmacy =
      pharmacies.find(
        (
          pharmacy,
        ) =>
          pharmacy.pharmacyId ===
          selectedId,
      );

    if (
      selectedPharmacy
    ) {
      map.flyTo(
        [
          selectedPharmacy.latitude,
          selectedPharmacy.longitude,
        ],
        15,
        {
          duration:
            0.8,
        },
      );

      return;
    }

    const bounds =
      L.latLngBounds(
        pharmacies.map(
          (
            pharmacy,
          ) => [
            pharmacy.latitude,
            pharmacy.longitude,
          ],
        ),
      );

    map.fitBounds(
      bounds,
      {
        padding: [
          40,
          40,
        ],

        maxZoom:
          13,
      },
    );
  }, [
    map,
    pharmacies,
    selectedId,
  ]);

  return null;
}

/* =========================================================
   MEDICINE MAP
========================================================= */

export default function MedicineMap({
  pharmacies,
  selectedId,
  onSelect,
}: MedicineMapProps) {
  const { t } =
    useLanguage();

  const normalIcon =
    useMemo(
      () =>
        L.divIcon({
          className:
            "medicine-map-icon-wrapper",

          html: `
            <div class="medicine-map-marker">
              <span>+</span>
            </div>
          `,

          iconSize: [
            42,
            42,
          ],

          iconAnchor: [
            21,
            42,
          ],

          popupAnchor: [
            0,
            -38,
          ],
        }),
      [],
    );

  const selectedIcon =
    useMemo(
      () =>
        L.divIcon({
          className:
            "medicine-map-icon-wrapper",

          html: `
            <div class="medicine-map-marker medicine-map-marker-selected">
              <span>+</span>
            </div>
          `,

          iconSize: [
            46,
            46,
          ],

          iconAnchor: [
            23,
            46,
          ],

          popupAnchor: [
            0,
            -40,
          ],
        }),
      [],
    );

  function openDirections(
    pharmacy:
      MapPharmacy,
  ) {
    const destination =
      encodeURIComponent(
        `${pharmacy.latitude},${pharmacy.longitude}`,
      );

    const directionsUrl =
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    window.open(
      directionsUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <MapContainer
      center={
        COLOMBO_CENTER
      }
      zoom={12}
      scrollWheelZoom
      className="medicine-map"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        pharmacies={
          pharmacies
        }
        selectedId={
          selectedId
        }
      />

      {pharmacies.map(
        (
          pharmacy,
        ) => (
          <Marker
            key={
              pharmacy.pharmacyId
            }
            position={[
              pharmacy.latitude,
              pharmacy.longitude,
            ]}
            icon={
              pharmacy.pharmacyId ===
              selectedId
                ? selectedIcon
                : normalIcon
            }
            eventHandlers={{
              click: () => {
                onSelect(
                  pharmacy.pharmacyId,
                );
              },
            }}
          >
            <Popup>
              <div className="medicine-popup">
                <span className="popup-verified">
                  ✓{" "}
                  {t(
                    "search.verified",
                  )}
                </span>

                <strong>
                  {
                    pharmacy.name
                  }
                </strong>

                <span>
                  {
                    pharmacy.address
                  }
                </span>

                <span>
                  {
                    pharmacy.city
                  }
                </span>

                <div className="popup-separator" />

                <b>
                  {
                    pharmacy.medicineName
                  }{" "}
                  {
                    pharmacy.dosage
                  }
                </b>

                <span>
                  {t(
                    "search.availableLabel",
                  )}
                  :{" "}
                  {
                    pharmacy.availableQuantity
                  }
                </span>

                <strong>
                  LKR{" "}
                  {pharmacy.price.toFixed(
                    2,
                  )}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    openDirections(
                      pharmacy,
                    )
                  }
                >
                  {t(
                    "search.getDirections",
                  )}{" "}
                  ↗
                </button>
              </div>
            </Popup>
          </Marker>
        ),
      )}
    </MapContainer>
  );
}