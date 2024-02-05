import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Moment from "react-moment";
import moment from "moment";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [appResponse, setAppResponse] = useState("");
  const [error, setError] = useState(null);
  const [expires, setExpires] = useState<Date>();
  const [expired, setExpired] = useState(false);

  const router = useRouter();
  const { ticket } = router.query;

  const [timeFromNow, setTimeFromNow] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeFromNow(moment(expires).fromNow(true)); // Recalculate the time from now
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expires]);

  useEffect(() => {
    if (ticket) activateTicket();
  }, [ticket]);

  async function activateTicket() {
    try {
      const apiUrl = "/api/activate";
      const requestBody = { ticket };

      // Define the fetch options
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Convert the request body to JSON
      };

      // Make the POST request using fetch with async/await
      const response = await fetch(apiUrl, fetchOptions);

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        setExpired(!data.valid);
        setError(data.message);
      }

      const data = await response.json(); // Parse the response JSON

      setAppResponse(data.text);
      setExpires(data.expiresAt);
      setTimeFromNow(moment(data.expiresAt).fromNow(true));
      setExpired(!data.valid);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, e.g., network issues or server errors
    }
  }

  async function doHelloWorld() {
    try {
      const apiUrl = "/api/hello";
      const requestBody = {};

      // Define the fetch options
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Convert the request body to JSON
      };

      // Make the POST request using fetch with async/await
      const response = await fetch(apiUrl, fetchOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Parse the response JSON

      setAppResponse(data.text);
      setExpires(data.expiresAt);
      setTimeFromNow(moment(data.expiresAt).fromNow(true));
      setExpired(!data.valid);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, e.g., network issues or server errors
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Perk.Exchange Applet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h2>
          <a href="https://github.com/perkexchange/perklet-nextjs">PerkLet</a>
        </h2>
      </header>
      <main className={styles.main}>
        {error && <>{error}</>}
        <h1>{appResponse}</h1>
      </main>
      <p>
        <button onClick={doHelloWorld}>Retrieve Message</button>
      </p>
      {!expired && timeFromNow && <p>Session expires in {timeFromNow}</p>}
      {expired && <p>Session expired</p>}
      <footer className={styles.footer}>
        <a
          href="https://perk.exchange"
          target="_blank"
          rel="noopener noreferrer"
        >
          powered by Perk.Exchange
        </a>
      </footer>
    </div>
  );
}
