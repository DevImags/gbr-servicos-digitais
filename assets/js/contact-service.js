import { auth, googleProvider, db } from "./firebase-config.js";
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Autentica o cliente com um clique via Google
export async function autenticarClienteGoogle() {
  const resultado = await signInWithPopup(auth, googleProvider);
  return resultado.user;
}

// Monitora se o cliente já está logado
export function observarUsuario(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// Grava o pedido de orçamento no Firestore de forma protegida
export async function enviarSolicitacaoContato({ empresa, servico, canalPreferido, contatoCliente, mensagem }) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("É necessário validar sua conta antes de enviar a solicitação.");
  }

  // Validação básica antes do envio
  if (!empresa || !mensagem || mensagem.trim().length < 10) {
    throw new Error("Preencha o nome do negócio e descreva brevemente o que precisa.");
  }

  const docRef = await addDoc(collection(db, "solicitacoes_contato"), {
    uid: user.uid,
    nomeConta: user.displayName || "Cliente",
    emailConta: user.email,
    empresa: empresa.trim(),
    servico: servico,
    canalPreferido: canalPreferido,
    contatoCliente: contatoCliente.trim(),
    mensagem: mensagem.trim(),
    status: "novo",
    criadoEm: serverTimestamp()
  });

  return docRef.id;
}