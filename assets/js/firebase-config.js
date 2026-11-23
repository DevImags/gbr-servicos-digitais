import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app-check.js";

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig = {
  apiKey: "AIzaSyBEhNzm5l6H52MBTDCuVguojpukYLCvCxQ",
  authDomain: "gbr-servicos-digitais.firebaseapp.com",
  projectId: "gbr-servicos-digitais",
  storageBucket: "gbr-servicos-digitais.firebasestorage.app",
  messagingSenderId: "220270933088",
  appId: "1:220270933088:web:7ff59e79467cf0a769ff05",
  measurementId: "G-T9RNKZPFBB"
};

const app = initializeApp(firebaseConfig);

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("6LeTvS0uAAAAANcwlAkiWE4tBbE_QBhjZcfT1Wwc"),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);