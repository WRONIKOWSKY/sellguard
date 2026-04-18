import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLang } from "../contexts/LangContext";

var NAV_COLORS = {
  "/annonce": "#818CF8",
  "/protection": "#4AD
mkdir\ -p\ lib\
\
cat\ \<\<\ \'EOFSUPA\'\ \>\ lib/supabaseClient.js\
import\ \{\ createClient\ \}\ from\ \"@supabase/supabase-js\"\;\
\
const\ url\ \=\ process.env.NEXT_PUBLIC_SUPABASE_URL\;\
const\ key\ \=\ process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\;\
\
let\ client\ \=\ null\;\
\
export\ function\ getSupabase\(\)\ \{\
\ \ if\ \(typeof\ window\ \=\=\=\ \"undefined\"\)\ return\ null\;\
\ \ if\ \(\!url\ \|\|\ \!key\)\ return\ null\;\
\ \ if\ \(\!client\)\ \{\
\ \ \ \ client\ \=\ createClient\(url\,\ key\,\ \{\
\ \ \ \ \ \ auth\:\ \{\
\ \ \ \ \ \ \ \ persistSession\:\ true\,\
\ \ \ \ \ \ \ \ autoRefreshToken\:\ true\,\
\ \ \ \ \ \ \ \ detectSessionInUrl\:\ true\,\
\ \ \ \ \ \ \}\,\
\ \ \ \ \}\)\;\
\ \ \}\
\ \ return\ client\;\
\}\
EOFSUPA\
\
cat\ \<\<\ \'EOFPKG\'\ \>\ package.json\
\{\
\ \ \"name\"\:\ \"sellguard\"\,\
\ \ \"version\"\:\ \"0.1.0\"\,\
\ \ \"private\"\:\ true\,\
\ \ \"scripts\"\:\ \{\
\ \ \ \ \"dev\"\:\ \"next\ dev\"\,\
\ \ \ \ \"build\"\:\ \"next\ build\"\,\
\ \ \ \ \"start\"\:\ \"next\ start\"\
\ \ \}\,\
\ \ \"dependencies\"\:\ \{\
\ \ \ \ \"next\"\:\ \"14.2.3\"\,\
\ \ \ \ \"react\"\:\ \"^18\"\,\
\ \ \ \ \"react-dom\"\:\ \"^18\"\,\
\ \ \ \ \"jspdf\"\:\ \"^2.5.1\"\,\
\ \ \ \ \"@supabase/supabase-js\"\:\ \"^2.45.0\"\
\ \ \}\
\}\
EOFPKG\
\
cat\ \<\<\ \'EOFLAYOUT\'\ \>\ components/Layout.js\
import\ Link\ from\ \"next/link\"\;\
import\ Head\ from\ \"next/head\"\;\
import\ \{\ useRouter\ \}\ from\ \"next/router\"\;\
import\ \{\ useLang\ \}\ from\ \"../contexts/LangContext\"\;\
\
var\ NAV_COLORS\ \=\ \{\
\ \ \"/annonce\"\:\ \"\#818CF8\"\,\
\ \ \"/protection\"\:\ \"\#4ADE80\"\,\
\ \ \"/litige\"\:\ \"\#F472B6\"\,\
\ \ \"/compte\"\:\ \"\#FBBF24\"\,\
\}\;\
\
export\ default\ function\ Layout\(\{\ children\ \}\)\ \{\
\ \ var\ router\ \=\ useRouter\(\)\;\
\ \ var\ ref\ \=\ useLang\(\)\,\ lang\ \=\ ref.lang\,\ t\ \=\ ref.t\,\ setLang\ \=\ ref.setLang\;\
\
\ \ var\ NAV\ \=\ \[\
\ \ \ \ \{\ href\:\ \"/annonce\"\,\ label\:\ t.nav.annonce\ \}\,\
\ \ \ \ \{\ href\:\ \"/protection\"\,\ label\:\ t.nav.protection\ \}\,\
\ \ \ \ \{\ href\:\ \"/litige\"\,\ label\:\ t.nav.litige\ \}\,\
\ \ \ \ \{\ href\:\ \"/compte\"\,\ label\:\ \"Compte\"\ \}\,\
\ \ \]\;\
\
\ \ return\ \(\
\ \ \ \ \<\>\
\ \ \ \ \ \ \<Head\>\
\ \ \ \ \ \ \ \ \<link\ rel\=\"preconnect\"\ href\=\"https\://fonts.googleapis.com\"\ /\>\
\ \ \ \ \ \ \ \ \<link\ rel\=\"preconnect\"\ href\=\"https\://fonts.gstatic.com\"\ crossOrigin\=\"anonymous\"\ /\>\
\ \ \ \ \ \ \ \ \<link\ href\=\"https\://fonts.googleapis.com/css2\?family\=DM+Serif+Display\:ital@0\;1\&family\=DM+Sans\:wght@300\;400\;500\;600\;700\&display\=swap\"\ rel\=\"stylesheet\"\ /\>\
\ \ \ \ \ \ \</Head\>\
\ \ \ \ \ \ \<div\ style\=\{\{\ minHeight\:\ \"100vh\"\,\ background\:\ \"\#000\"\,\ fontFamily\:\ \"\'DM\ Sans\'\,\ -apple-system\,\ sans-serif\"\ \}\}\>\
\ \ \ \ \ \ \ \ \<div\ style\=\{\{\ position\:\ \"sticky\"\,\ top\:\ 0\,\ zIndex\:\ 100\,\ background\:\ \"rgba\(0\,0\,0\,0.82\)\"\,\ borderBottom\:\ \"0.5px\ solid\ rgba\(255\,255\,255\,0.07\)\"\,\ backdropFilter\:\ \"blur\(20px\)\"\,\ WebkitBackdropFilter\:\ \"blur\(20px\)\"\ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \<div\ style\=\{\{\ maxWidth\:\ 700\,\ margin\:\ \"0\ auto\"\,\ padding\:\ \"0\ 20px\"\,\ height\:\ 54\,\ display\:\ \"flex\"\,\ alignItems\:\ \"center\"\,\ justifyContent\:\ \"space-between\"\ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \ \ \<Link\ href\=\"/\"\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \<span\ style\=\{\{\ fontFamily\:\ \"\'DM\ Serif\ Display\'\,\ Georgia\,\ serif\"\,\ fontSize\:\ 18\,\ color\:\ \"\#fff\"\,\ letterSpacing\:\ \"-0.01em\"\,\ cursor\:\ \"pointer\"\,\ display\:\ \"flex\"\,\ alignItems\:\ \"center\"\,\ gap\:\ 10\ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \<svg\ width\=\"26\"\ height\=\"26\"\ viewBox\=\"0\ 0\ 30\ 30\"\ fill\=\"none\"\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \<circle\ cx\=\"15\"\ cy\=\"15\"\ r\=\"14\"\ stroke\=\"\#fff\"\ strokeWidth\=\"1.2\"/\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \<circle\ cx\=\"15\"\ cy\=\"15\"\ r\=\"10\"\ stroke\=\"\#fff\"\ strokeWidth\=\"0.4\"\ strokeDasharray\=\"2.8\ 2.8\"/\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \<text\ x\=\"15\"\ y\=\"19.5\"\ fontFamily\=\"-apple-system\,Helvetica\ Neue\,sans-serif\"\ fontSize\=\"9\"\ fontWeight\=\"700\"\ fill\=\"\#fff\"\ textAnchor\=\"middle\"\ letterSpacing\=\"-0.02em\"\>SC\</text\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \</svg\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ SellCov\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \</span\>\
\ \ \ \ \ \ \ \ \ \ \ \ \</Link\>\
\ \ \ \ \ \ \ \ \ \ \ \ \<select\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ value\=\{lang\}\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ onChange\=\{function\(e\)\ \{\ setLang\(e.target.value\)\;\ \}\}\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ style\=\{\{\ fontSize\:\ 11\,\ fontWeight\:\ 600\,\ padding\:\ \"5px\ 14px\"\,\ borderRadius\:\ 20\,\ border\:\ \"0.5px\ solid\ rgba\(255\,255\,255\,0.2\)\"\,\ background\:\ \"rgba\(255\,255\,255\,0.05\)\"\,\ color\:\ \"rgba\(255\,255\,255\,0.6\)\"\,\ cursor\:\ \"pointer\"\,\ fontFamily\:\ \"inherit\"\ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \<option\ value\=\"fr\"\>FR\</option\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \<option\ value\=\"en\"\>EN\</option\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \<option\ value\=\"es\"\>ES\</option\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \<option\ value\=\"it\"\>IT\</option\>\
\ \ \ \ \ \ \ \ \ \ \ \ \</select\>\
\ \ \ \ \ \ \ \ \ \ \</div\>\
\ \ \ \ \ \ \ \ \ \ \<div\ style\=\{\{\ maxWidth\:\ 700\,\ margin\:\ \"0\ auto\"\,\ padding\:\ \"0\ 12px\ 8px\"\,\ display\:\ \"flex\"\,\ gap\:\ 4\,\ justifyContent\:\ \"center\"\ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \ \ \{NAV.map\(function\(n\)\ \{\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ var\ active\ \=\ router.pathname\ \=\=\=\ n.href\;\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ var\ color\ \=\ NAV_COLORS\[n.href\]\ \|\|\ \"\#fff\"\;\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ return\ \(\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \<Link\ key\=\{n.href\}\ href\=\{n.href\}\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \<span\ style\=\{\{\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ fontSize\:\ 13\,\ fontWeight\:\ active\ \?\ 600\ \:\ 400\,\ padding\:\ \"8px\ 20px\"\,\ borderRadius\:\ 8\,\ whiteSpace\:\ \"nowrap\"\,\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ background\:\ active\ \?\ \"rgba\(255\,255\,255\,0.08\)\"\ \:\ \"transparent\"\,\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ color\:\ active\ \?\ color\ \:\ \"rgba\(255\,255\,255\,0.4\)\"\,\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ transition\:\ \"all\ 0.15s\"\,\ display\:\ \"inline-block\"\,\ cursor\:\ \"pointer\"\,\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ borderBottom\:\ active\ \?\ \"2px\ solid\ \"\ +\ color\ \:\ \"2px\ solid\ transparent\"\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \{n.label\}\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \</span\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \</Link\>\
\ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\;\
\ \ \ \ \ \ \ \ \ \ \ \ \}\)\}\
\ \ \ \ \ \ \ \ \ \ \</div\>\
\ \ \ \ \ \ \ \ \</div\>\
\ \ \ \ \ \ \ \ \<div\ style\=\{\{\ maxWidth\:\ 700\,\ margin\:\ \"0\ auto\"\,\ padding\:\ \"32px\ 20px\"\ \}\}\>\
\ \ \ \ \ \ \ \ \ \ \{children\}\
\ \ \ \ \ \ \ \ \</div\>\
\ \ \ \ \ \ \</div\>\
\ \ \ \ \</\>\
\ \ \)\;\
\}\
EOFLAYOUT\
\
echo\ \"3\ fichiers\ créés.\ compte.js\ arrive\ dans\ la\ commande\ suivante.\"\
ls\ lib\
ls\ -la\ package.json\ components/Layout.js\ lib/supabaseClient.jsmkdir -p lib

cat << 'EOFSUPA' > lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client = null;

export function getSupabase() {
  if (typeof window === "undefined") return null;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
EOFSUPA

cat << 'EOFPKG' > package.json
{
  "name": "sellguard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "jspdf": "^2.5.1",
    "@supabase/supabase-js": "^2.45.0"
  }
}
EOFPKG

cat << 'EOFLAYOUT' > components/Layout.js
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLang } from "../contexts/LangContext";

var NAV_COLORS = {
  "/annonce": "#818CF8",
  "/protection": "#4ADE80",
  "/litige": "#F472B6",
  "/compte": "#FBBF24",
};

export default function Layout({ children }) {
  var router = useRouter();
  var ref = useLang(), lang = ref.lang, t = ref.t, setLang = ref.setLang;

  var NAV = [
    { href: "/annonce", label: t.nav.annonce },
    { href: "/protection", label: t.nav.protection },
    { href: "/litige", label: t.nav.litige },
    { href: "/compte", label: "Compte" },
  ];

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: "100vh", background: "#000", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.82)", borderBottom: "0.5px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/">
              <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: "#fff", letterSpacing: "-0.01em", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="14" stroke="#fff" strokeWidth="1.2"/>
                  <circle cx="15" cy="15" r="10" stroke="#fff" strokeWidth="0.4" strokeDasharray="2.8 2.8"/>
                  <text x="15" y="19.5" fontFamily="-apple-system,Helvetica Neue,sans-serif" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="-0.02em">SC</text>
                </svg>
                SellCov
              </span>
            </Link>
            <select
              value={lang}
              onChange={function(e) { setLang(e.target.value); }}
              style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 20, border: "0.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="it">IT</option>
            </select>
          </div>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 12px 8px", display: "flex", gap: 4, justifyContent: "center" }}>
            {NAV.map(function(n) {
              var active = router.pathname === n.href;
              var color = NAV_COLORS[n.href] || "#fff";
              return (
                <Link key={n.href} href={n.href}>
                  <span style={{
                    fontSize: 13, fontWeight: active ? 600 : 400, padding: "8px 20px", borderRadius: 8, whiteSpace: "nowrap",
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    color: active ? color : "rgba(255,255,255,0.4)",
                    transition: "all 0.15s", display: "inline-block", cursor: "pointer",
                    borderBottom: active ? "2px solid " + color : "2px solid transparent"
                  }}>
                    {n.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
          {children}
        </div>
      </div>
    </>
  );
}
