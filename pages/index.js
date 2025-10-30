import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Documentation</title>
        <meta name="description" content="Documentation website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Our Documentation
        </h1>

        <p className={styles.description}>
          Get started by browsing our guides and API references
        </p>

        <div className={styles.grid}>
          <a href="#" className={styles.card}>
            <h2>Getting Started &rarr;</h2>
            <p>Learn how to quickly set up and deploy your project.</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>Guides &rarr;</h2>
            <p>Step-by-step guides to help you master our platform.</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>API Reference &rarr;</h2>
            <p>Detailed documentation for all available APIs.</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Explore practical examples and code snippets.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Documentation. All rights reserved.</p>
      </footer>
    </div>
  );
}
