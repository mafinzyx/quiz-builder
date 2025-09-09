import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
            Full-Stack JS engineer test assessment - the Quiz Builder.
        </ol>
        <a
          className={styles.testApp}
          href="/create"
        >
          Test App
        </a>
        <div className={styles.ctas}>

          <a
            className={styles.linkedin}
            href="https://www.linkedin.com/in/danylo-zherzdiev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className={styles.github}
            href="https://github.com/mafinzyx"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Made by <strong>Danylo Zherzdiev (Mafin)</strong></p>
      </footer>
    </div>
  );
}
