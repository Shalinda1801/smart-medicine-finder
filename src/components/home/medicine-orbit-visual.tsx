export default function MedicineOrbitVisual() {
  return (
    <div className="simple-med-stage">

      {/* Soft glow behind the visual */}
      <div className="simple-med-glow" />

      {/* Two clean 3D orbit rings */}
      <div className="simple-orbit simple-orbit-one" />

      <div className="simple-orbit simple-orbit-two" />

      {/* Semi-transparent grey sphere */}
      <div className="simple-med-sphere">

        <div className="simple-sphere-highlight" />

        {/* Main capsule */}
        <div className="simple-main-capsule">
          <span className="simple-capsule-green" />
          <span className="simple-capsule-white" />
        </div>

      </div>

      {/* Live availability */}
      <div className="floating-card card-availability simple-med-card">
        <span className="live-dot" />

        <div>
          <small>
            Live availability
          </small>

          <strong>
            35 units
          </strong>
        </div>
      </div>

      {/* Pharmacy */}
      <div className="floating-card card-pharmacy simple-med-card">

        <span className="simple-verified">
          ✓
        </span>

        <div>
          <small>
            Verified pharmacy
          </small>

          <strong>
            CityCare
          </strong>
        </div>
      </div>

      {/* Price */}
      <div className="floating-card card-price simple-med-card">

        <small>
          Best demo price
        </small>

        <strong>
          LKR 115
        </strong>

      </div>

      {/* Status */}
      <div className="visual-status simple-med-status">

        <span />

        System connected

      </div>

    </div>
  );
}