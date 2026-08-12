"use client";

import {
  type FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useLanguage,
} from "@/i18n/language-context";

type PharmacyRegisterResponse = {
  success:
    boolean;

  data?:
    unknown;

  error?: {
    message?:
      string;

    fieldErrors?:
      Record<
        string,
        string[]
      >;
  };
};

export default function PharmacyRegisterPage() {
  const router =
    useRouter();

  const { t } =
    useLanguage();

  const [
    ownerName,
    setOwnerName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    pharmacyName,
    setPharmacyName,
  ] =
    useState("");

  const [
    licenceNumber,
    setLicenceNumber,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    city,
    setCity,
  ] =
    useState("");

  const [
    addressLine1,
    setAddressLine1,
  ] =
    useState("");

  const [
    district,
    setDistrict,
  ] =
    useState("");

  const [
    postalCode,
    setPostalCode,
  ] =
    useState("");

  const [
    latitude,
    setLatitude,
  ] =
    useState("");

  const [
    longitude,
    setLongitude,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    );

  const [
    locating,
    setLocating,
  ] =
    useState(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  function useCurrentLocation() {
    setError("");

    if (
      !navigator.geolocation
    ) {
      setError(
        t(
          "pharmacyRegister.error.locationUnsupported",
        ),
      );

      return;
    }

    setLocating(
      true,
    );

    navigator.geolocation.getCurrentPosition(
      (
        position,
      ) => {
        setLatitude(
          position.coords.latitude.toFixed(
            6,
          ),
        );

        setLongitude(
          position.coords.longitude.toFixed(
            6,
          ),
        );

        setLocating(
          false,
        );
      },

      () => {
        setError(
          t(
            "pharmacyRegister.error.locationFailed",
          ),
        );

        setLocating(
          false,
        );
      },

      {
        enableHighAccuracy:
          true,

        timeout:
          10000,

        maximumAge:
          0,
      },
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !ownerName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !pharmacyName.trim() ||
      !licenceNumber.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !addressLine1.trim() ||
      !district.trim() ||
      !postalCode.trim()
    ) {
      setError(
        t(
          "pharmacyRegister.error.required",
        ),
      );

      return;
    }

    if (
      password.length <
      8
    ) {
      setError(
        t(
          "pharmacyRegister.error.passwordLength",
        ),
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        t(
          "pharmacyRegister.error.passwordMatch",
        ),
      );

      return;
    }

    const latitudeNumber =
      Number(
        latitude,
      );

    const longitudeNumber =
      Number(
        longitude,
      );

    if (
      !Number.isFinite(
        latitudeNumber,
      ) ||
      !Number.isFinite(
        longitudeNumber,
      )
    ) {
      setError(
        t(
          "pharmacyRegister.error.locationRequired",
        ),
      );

      return;
    }

    if (
      latitudeNumber <
        -90 ||
      latitudeNumber >
        90 ||
      longitudeNumber <
        -180 ||
      longitudeNumber >
        180
    ) {
      setError(
        t(
          "pharmacyRegister.error.locationInvalid",
        ),
      );

      return;
    }

    try {
      setLoading(
        true,
      );

      const response =
        await fetch(
          "/api/pharmacies/register",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                ownerName:
                  ownerName.trim(),

                email:
                  email
                    .trim()
                    .toLowerCase(),

                password,

                confirmPassword,

                pharmacyName:
                  pharmacyName.trim(),

                licenceNumber:
                  licenceNumber.trim(),

                phone:
                  phone.trim(),

                addressLine1:
                  addressLine1.trim(),

                city:
                  city.trim(),

                district:
                  district.trim(),

                postalCode:
                  postalCode.trim(),

                latitude:
                  latitudeNumber,

                longitude:
                  longitudeNumber,
              }),
          },
        );

      const payload =
        (await response.json()) as PharmacyRegisterResponse;

      if (
        !response.ok ||
        !payload.success
      ) {
        const firstFieldError =
          payload.error
            ?.fieldErrors
            ? Object.values(
                payload.error
                  .fieldErrors,
              )
                .flat()
                .find(
                  Boolean,
                )
            : undefined;

        throw new Error(
          firstFieldError ??
            payload.error
              ?.message ??
            t(
              "pharmacyRegister.error.generic",
            ),
        );
      }

      setSuccess(
        t(
          "pharmacyRegister.success",
        ),
      );

      window.setTimeout(
        () => {
          router.push(
            "/login",
          );
        },
        1500,
      );
    } catch (
      submitError:
        unknown
    ) {
      setError(
        submitError instanceof
          Error
          ? submitError.message
          : t(
              "pharmacyRegister.error.generic",
            ),
      );
    } finally {
      setLoading(
        false,
      );
    }
  }

  return (
    <main className="pharmacy-register-page">
      <section className="pharmacy-register-intro">
        <Link
          href="/register"
          className="pharmacy-register-badge"
        >
          <span>
            •
          </span>

          {t(
            "pharmacyRegister.badge",
          )}
        </Link>

        <h1>
          {t(
            "pharmacyRegister.title",
          )}
        </h1>

        <p className="pharmacy-register-description">
          {t(
            "pharmacyRegister.description",
          )}
        </p>

        <div className="pharmacy-register-steps">
          <article>
            <span>
              01
            </span>

            <strong>
              {t(
                "pharmacyRegister.step1",
              )}
            </strong>
          </article>

          <article>
            <span>
              02
            </span>

            <strong>
              {t(
                "pharmacyRegister.step2",
              )}
            </strong>
          </article>

          <article>
            <span>
              03
            </span>

            <strong>
              {t(
                "pharmacyRegister.step3",
              )}
            </strong>
          </article>

          <article>
            <span>
              04
            </span>

            <strong>
              {t(
                "pharmacyRegister.step4",
              )}
            </strong>
          </article>
        </div>
      </section>

      <section className="pharmacy-register-card">
        <div className="pharmacy-register-accent" />

        <form
          className="pharmacy-register-form"
          onSubmit={
            handleSubmit
          }
        >
          <section className="pharmacy-form-section">
            <h2>
              {t(
                "pharmacyRegister.ownerDetails",
              )}
            </h2>

            <div className="pharmacy-form-grid two-column">
              <label>
                {t(
                  "pharmacyRegister.ownerName",
                )}

                <input
                  type="text"
                  value={
                    ownerName
                  }
                  onChange={(
                    event,
                  ) =>
                    setOwnerName(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.email",
                )}

                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.password",
                )}

                <input
                  type="password"
                  value={
                    password
                  }
                  onChange={(
                    event,
                  ) =>
                    setPassword(
                      event.target
                        .value,
                    )
                  }
                  minLength={
                    8
                  }
                  autoComplete="new-password"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.confirmPassword",
                )}

                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event,
                  ) =>
                    setConfirmPassword(
                      event.target
                        .value,
                    )
                  }
                  minLength={
                    8
                  }
                  autoComplete="new-password"
                  required
                />
              </label>
            </div>
          </section>

          <section className="pharmacy-form-section">
            <h2>
              {t(
                "pharmacyRegister.pharmacyDetails",
              )}
            </h2>

            <div className="pharmacy-form-grid two-column">
              <label>
                {t(
                  "pharmacyRegister.pharmacyName",
                )}

                <input
                  type="text"
                  value={
                    pharmacyName
                  }
                  onChange={(
                    event,
                  ) =>
                    setPharmacyName(
                      event.target
                        .value,
                    )
                  }
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.licenceNumber",
                )}

                <input
                  type="text"
                  value={
                    licenceNumber
                  }
                  onChange={(
                    event,
                  ) =>
                    setLicenceNumber(
                      event.target
                        .value,
                    )
                  }
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.phone",
                )}

                <input
                  type="tel"
                  value={
                    phone
                  }
                  onChange={(
                    event,
                  ) =>
                    setPhone(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="tel"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.city",
                )}

                <input
                  type="text"
                  value={
                    city
                  }
                  onChange={(
                    event,
                  ) =>
                    setCity(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label className="pharmacy-form-full">
                {t(
                  "pharmacyRegister.address",
                )}

                <input
                  type="text"
                  value={
                    addressLine1
                  }
                  onChange={(
                    event,
                  ) =>
                    setAddressLine1(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="address-line1"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.district",
                )}

                <input
                  type="text"
                  value={
                    district
                  }
                  onChange={(
                    event,
                  ) =>
                    setDistrict(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="address-level1"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.postalCode",
                )}

                <input
                  type="text"
                  value={
                    postalCode
                  }
                  onChange={(
                    event,
                  ) =>
                    setPostalCode(
                      event.target
                        .value,
                    )
                  }
                  autoComplete="postal-code"
                  required
                />
              </label>
            </div>
          </section>

          <section className="pharmacy-location-box">
            <div className="pharmacy-location-heading">
              <div>
                <h2>
                  {t(
                    "pharmacyRegister.mapLocation",
                  )}
                </h2>

                <p>
                  {t(
                    "pharmacyRegister.mapDescription",
                  )}
                </p>
              </div>

              <button
                type="button"
                className="pharmacy-location-button"
                onClick={
                  useCurrentLocation
                }
                disabled={
                  locating
                }
              >
                📍{" "}
                {locating
                  ? t(
                      "pharmacyRegister.locating",
                    )
                  : t(
                      "pharmacyRegister.useCurrentLocation",
                    )}
              </button>
            </div>

            <div className="pharmacy-form-grid two-column location-grid">
              <label>
                {t(
                  "pharmacyRegister.latitude",
                )}

                <input
                  type="number"
                  step="any"
                  value={
                    latitude
                  }
                  onChange={(
                    event,
                  ) =>
                    setLatitude(
                      event.target
                        .value,
                    )
                  }
                  placeholder="6.9271"
                  required
                />
              </label>

              <label>
                {t(
                  "pharmacyRegister.longitude",
                )}

                <input
                  type="number"
                  step="any"
                  value={
                    longitude
                  }
                  onChange={(
                    event,
                  ) =>
                    setLongitude(
                      event.target
                        .value,
                    )
                  }
                  placeholder="79.8612"
                  required
                />
              </label>
            </div>
          </section>

          {error && (
            <div className="pharmacy-register-message error">
              {
                error
              }
            </div>
          )}

          {success && (
            <div className="pharmacy-register-message success">
              {
                success
              }
            </div>
          )}

          <button
            type="submit"
            className="pharmacy-register-submit"
            disabled={
              loading
            }
          >
            {loading
              ? t(
                  "pharmacyRegister.submitting",
                )
              : t(
                  "pharmacyRegister.submit",
                )}
          </button>

          <p className="pharmacy-register-login-link">
            {t(
              "pharmacyRegister.alreadyRegistered",
            )}{" "}

            <Link href="/login">
              {t(
                "pharmacyRegister.signIn",
              )}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}