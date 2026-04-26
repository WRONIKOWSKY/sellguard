import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { getSupabase } from "../lib/supabaseClient";

export default function Compte() {
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sb = getSupabase();

      // 🔐 Récupère l'utilisateur connecté
      const { data: { user }, error: userError } = await sb.auth.getUser();

      if (userError || !user) {
        setErrorMsg("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      // 🔒 Récupère uniquement SES envois
      const { data, error } = await sb
        .from("envois")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setEnvois(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Compte</title>
      </Head>

      <h1>Mes envois</h1>

      {loading && <p>Chargement...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {!loading && envois.length === 0 && (
        <p>Aucun envoi pour le moment</p>
      )}

      <ul>
        {envois.map((e) => (
          <li key={e.id}>
            Envoi #{e.id}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
