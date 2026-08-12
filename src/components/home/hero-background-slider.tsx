"use client";

import {
  useEffect,
  useState,
} from "react";

type HeroSlide = {
  image: string;
  name: string;
  position: string;
};

const slides: HeroSlide[] = [
  {
    image:
      "/images/hero/hero-pharmacy.png",

    name:
      "Modern Pharmacy",

    position:
      "center center",
  },

  {
    image:
      "/images/hero/hero-pharmacist.png",

    name:
      "Professional Pharmacist",

    position:
      "center center",
  },

  {
    image:
      "/images/hero/hero-medicine.png",

    name:
      "Medicine Availability",

    position:
      "center center",
  },

  {
    image:
      "/images/hero/hero-laboratory.png",

    name:
      "Pharmaceutical Laboratory",

    position:
      "center center",
  },

  {
    image:
      "/images/hero/hero-care.png",

    name:
      "Customer Care",

    position:
      "center center",
  },
];

const AUTO_SLIDE_TIME = 6000;

export default function HeroBackgroundSlider() {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  // ==========================================
  // AUTO CHANGE EVERY 6 SECONDS
  // ==========================================

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setActiveIndex(
            (current) =>
              (current + 1) %
              slides.length,
          );
        },
        AUTO_SLIDE_TIME,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [activeIndex]);

  // ==========================================
  // NEXT
  // ==========================================

  function nextSlide() {
    setActiveIndex(
      (current) =>
        (current + 1) %
        slides.length,
    );
  }

  // ==========================================
  // PREVIOUS
  // ==========================================

  function previousSlide() {
    setActiveIndex(
      (current) =>
        (current -
          1 +
          slides.length) %
        slides.length,
    );
  }

  // ==========================================
  // MANUAL DOT
  // ==========================================

  function selectSlide(
    index: number,
  ) {
    setActiveIndex(index);
  }

  return (
    <div className="mf-hero-slider">

      {/* ================================
          BACKGROUND IMAGES
      ================================= */}

      <div className="mf-hero-slides">
        {slides.map(
          (
            slide,
            index,
          ) => (
            <div
              key={
                slide.image
              }
              className={`mf-hero-slide ${
                index ===
                activeIndex
                  ? "is-active"
                  : ""
              }`}
              style={{
                backgroundImage:
                  `url("${slide.image}")`,

                backgroundPosition:
                  slide.position,
              }}
            />
          ),
        )}
      </div>

      {/* ================================
          READABILITY OVERLAY
      ================================= */}

      <div className="mf-hero-image-overlay" />

      {/* ================================
          PREVIOUS BUTTON
      ================================= */}

      <button
        type="button"
        className="
          mf-slider-arrow
          mf-slider-left
        "
        onClick={
          previousSlide
        }
        aria-label="Previous slide"
      >
        ‹
      </button>

      {/* ================================
          NEXT BUTTON
      ================================= */}

      <button
        type="button"
        className="
          mf-slider-arrow
          mf-slider-right
        "
        onClick={
          nextSlide
        }
        aria-label="Next slide"
      >
        ›
      </button>

      {/* ================================
          SLIDE DOTS
      ================================= */}

      <div className="mf-slider-dots">
        {slides.map(
          (
            slide,
            index,
          ) => (
            <button
              key={
                slide.image
              }
              type="button"
              className={`mf-slider-dot ${
                index ===
                activeIndex
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                selectSlide(
                  index,
                )
              }
              aria-label={`Show ${slide.name}`}
            />
          ),
        )}
      </div>

      {/* ================================
          6 SECOND PROGRESS BAR
      ================================= */}

      <div className="mf-slider-progress">
        <span
          key={
            activeIndex
          }
        />
      </div>
    </div>
  );
}