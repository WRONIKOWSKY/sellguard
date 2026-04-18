import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { getSupabase } from "../lib/supabaseClient";

export default function Compte() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [envois, setEnvois] = useState([]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setEnvois([]);
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    sb.from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => setProfile(data));
    sb.from("envois")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setEnvois(data || []));
  }, [session]);

  async function sendMagicLink(e) {
    e.preventDefault();
    setError(null);
    const sb = getSupabase();
    if (!sb) {
      setError("Connexion impossible.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Email invalide.");
      return;
    }
    setSending(true);
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? window.location.origin + "/compte"
            : undefined,
      },
    });
    setSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  async function logout() {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setSession(null);
    setSent(false);
    setEmail("");
  }

  const card = {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 28,
  };

  return (
    <Layout>
      <Head>
        <title>Compte — SellCov</title>
      </Head>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {loading && (
          <div
            style={{
              ...card,
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Chargement…
          </div>
        )}

        {!loading && !session && !sent && (
          <div style={card}>
            <div
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 28,
                color: "#fff",
                marginBottom: 8,
                letterSpacing: "-0.02em",
              }}
            >
              Mon compte
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              Entre ton email. Tu recevras un lien de connexion, sans mot de passe.
            </div>
            <form onSubmit={sendMagicLink}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  color: "#fff",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
              />
              <button
                type="submit"
                disabled={sending}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  fontWeight: 600,
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: 10,
                  cursor: sending ? "wait" : "pointer",
                  opacity: sending ? 0.6 : 1,
                  fontFamily: "inherit",
                }}
              >
                {sending ? "Envoi…" : "Recevoir le lien de connexion"}
              </button>
              {error && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "rgba(244,114,182,0.1)",
                    border: "0.5px solid rgba(244,114,182,0.3)",
                    borderRadius: 8,
                    color: "#F472B6",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}
            </form>
          </div>
        )}

        {!loading && !session && sent && (
          <div style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
            <div
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 24,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Vérifie ta boîte mail
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.5,
              }}
            >
              Un lien de connexion vient d'être envoyé à{" "}
              <span style={{ color: "#fff" }}>{email}</span>.
              <br />
              Clique dessus pour te connecter.
            </div>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              style={{
                marginTop: 20,
                padding: "8px 16px",
                fontSize: 13,
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Changer d'email
            </button>
          </div>
        )}

        {!loading && session && (
          <div>
            <div style={card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Connecté en tant que
                  </div>
                  <div style={{ fontSize: 17, color: "#fff", fontWeight: 500 }}>
                    {session.user.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    background: "transparent",
                    color: "rgba(255,255,255,0.5)",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Déconnexion
                </button>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Plan
                  </div>
                  <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>
                    {profile?.plan === "pro" ? "Pro" : "Gratuit"}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Envois certifiés
                  </div>
                  <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>
                    {envois.length}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Derniers envois
              </div>
              {envois.length === 0 ? (
                <div
                  style={{
                    ...card,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 14,
                  }}
                >
                  Aucun envoi certifié pour l'instant.
                  <br />
                  <a
                    href="/protection"
                    style={{
                      color: "#4ADE80",
                      textDecoration: "none",
                      marginTop: 8,
                      display: "inline-block",
                    }}
                  >
                    Protéger un envoi →
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {envois.slice(0, 10).map((e) => (
                    <div
                      key={e.id}
                      style={{
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.03)",
                        border: "0.5px solid rgba(255,255,255,0.06)",
                        borderRadius: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          {e.article_name || "Envoi sans titre"}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {new Date(e.created_at).toLocaleString("fr-FR")} · {e.status}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: "monospace",
                        }}
                      >
                        {e.id.substring(0, 8)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
