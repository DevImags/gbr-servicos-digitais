import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY_DO_FIREBASE",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);

// Proteção contra bots via App Check + reCAPTCHA v3 (Chave pública de site)
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeTvS0uAAAAANcwlAkiWE4tBbE_QBhjZcfT1Wwc"),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);