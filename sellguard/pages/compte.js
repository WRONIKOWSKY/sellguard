import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { getSupabase } from "../lib/supabaseClient";

export default function Compte() {
  const [envois, setEnvois] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sb = getSupabase();
      const { data, error } = await sb
        .from("envois")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setEnvois(data);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Compte</title>
      </Head>

      <h1>Mes envois</h1>

      <ul>
        {envois.map((e) => (
          <li key={e.id}>{e.id}</li>
        ))}
      </ul>
    </Layout>
  );
}
