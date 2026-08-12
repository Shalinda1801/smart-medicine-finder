import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main
      className={
        styles.loading
      }
    >
      <div
        className={
          styles.grid
        }
      />

      <div
        className={
          styles.content
        }
      >
        <div
          className={
            styles.logo
          }
        >
          <span>
            +
          </span>
        </div>

        <h1>
          Medi
          <span>
            Flux
          </span>
        </h1>

        <p>
          Loading secure
          workspace
        </p>

        <div
          className={
            styles.track
          }
        >
          <span />
        </div>

        <div
          className={
            styles.dots
          }
        >
          <i />
          <i />
          <i />
        </div>
      </div>
    </main>
  );
}