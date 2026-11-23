import {
  autenticarClienteGoogle,
  observarUsuario,
  enviarSolicitacaoContato
} from "./contact-service.js";
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Elementos do Modal
const modal = document.getElementById("modal-contato");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const overlayModal = document.getElementById("modal-overlay");
const botoesAbrirModal = document.querySelectorAll("[data-open-modal]");

// Etapas dentro do Modal (Autenticação -> Formulário -> Sucesso)
const etapaAuth = document.getElementById("etapa-auth");
const etapaForm = document.getElementById("etapa-form");
const etapaSucesso = document.getElementById("etapa-sucesso");

const btnLoginGoogle = document.getElementById("btn-login-google");
const btnTrocarConta = document.getElementById("btn-trocar-conta");
const btnNovoEnvio = document.getElementById("btn-novo-envio");

const usuarioLogadoNome = document.getElementById("usuario-logado-nome");
const usuarioLogadoEmail = document.getElementById("usuario-logado-email");

const formOrcamento = document.getElementById("form-orcamento");
const selectServico = document.getElementById("campo-servico");
const feedbackErro = document.getElementById("feedback-erro");
const btnSubmit = document.getElementById("btn-submit-orcamento");

let usuarioAtual = null;

function exibirErro(mensagem) {
  feedbackErro.textContent = mensagem;
  feedbackErro.classList.remove("hidden");
}

function limparErro() {
  feedbackErro.textContent = "";
  feedbackErro.classList.add("hidden");
}

function atualizarVisualModal() {
  limparErro();
  etapaSucesso.classList.add("hidden");

  if (usuarioAtual) {
    etapaAuth.classList.add("hidden");
    etapaForm.classList.remove("hidden");
    usuarioLogadoNome.textContent = usuarioAtual.displayName || "Conta verificada";
    usuarioLogadoEmail.textContent = usuarioAtual.email || "";
  } else {
    etapaForm.classList.add("hidden");
    etapaAuth.classList.remove("hidden");
  }
}

function abrirModal(servicoPreSelecionado = "") {
  if (servicoPreSelecionado && selectServico) {
    selectServico.value = servicoPreSelecionado;
  }
  atualizarVisualModal();
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

// Eventos para abrir/fechar modal
botoesAbrirModal.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const servico = btn.getAttribute("data-servico") || "";
    abrirModal(servico);
  });
});

btnFecharModal.addEventListener("click", fecharModal);
overlayModal.addEventListener("click", fecharModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    fecharModal();
  }
});

// Observa estado de login do Firebase Auth
observarUsuario((user) => {
  usuarioAtual = user;
  if (!modal.classList.contains("hidden")) {
    atualizarVisualModal();
  }
});

// Login com Google
btnLoginGoogle.addEventListener("click", async () => {
  limparErro();
  btnLoginGoogle.disabled = true;
  btnLoginGoogle.textContent = "Verificando conta...";

  try {
    await autenticarClienteGoogle();
  } catch (err) {
    exibirErro("Não foi possível concluir a verificação com o Google. Tente novamente.");
    console.error(err);
  } finally {
    btnLoginGoogle.disabled = false;
    btnLoginGoogle.innerHTML = `
      <svg class="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.24-.92 2.29-1.96 2.99v2.48h3.17c1.86-1.71 2.93-4.23 2.93-7.21 0-.42-.04-.83-.13-1.24z"/>
        <path fill="currentColor" d="M12.17 21c2.65 0 4.88-.88 6.5-2.38l-3.17-2.48c-.88.59-2 94-3.33.94-2.56 0-4.73-1.73-5.51-4.05H3.39v2.55C5.01 18.8 8.33 21 12.17 21z"/>
        <path fill="currentColor" d="M6.66 13.03c-.2-.59-.31-1.22-.31-1.88s.11-1.29.31-1.88V6.72H3.39C2.72 8.05 2.34 9.55 2.34 11.15s.38 3.1 1.05 4.43l3.27-2.55z"/>
        <path fill="currentColor" d="M12.17 5.22c1.44 0 2.74.5 3.76 1.47l2.82-2.82C17.04 2.28 14.82 1.3 12.17 1.3 8.33 1.3 5.01 3.5 3.39 6.72l3.27 2.55c.78-2.32 2.95-4.05 5.51-4.05z"/>
      </svg>
      Continuar com Google
    `;
  }
});

// Trocar conta
btnTrocarConta.addEventListener("click", async () => {
  await signOut(auth);
  atualizarVisualModal();
});

// Envio do formulário protegido
formOrcamento.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparErro();

  const dados = {
    empresa: document.getElementById("campo-empresa").value,
    servico: selectServico.value,
    canalPreferido: document.getElementById("campo-canal").value,
    contatoCliente: document.getElementById("campo-contato").value,
    mensagem: document.getElementById("campo-mensagem").value
  };

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Enviando com segurança...";

  try {
    await enviarSolicitacaoContato(dados);
    formOrcamento.reset();
    etapaForm.classList.add("hidden");
    etapaSucesso.classList.remove("hidden");
  } catch (err) {
    exibirErro(err.message || "Erro ao enviar solicitação. Verifique os campos e tente novamente.");
    console.error(err);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Enviar solicitação ↗";
  }
});

btnNovoEnvio.addEventListener("click", () => {
  atualizarVisualModal();
});