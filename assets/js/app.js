import { signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const modal = document.getElementById("modal-contato");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const overlayModal = document.getElementById("modal-overlay");
const botoesAbrirModal = document.querySelectorAll("[data-open-modal]");

const etapaAuth = document.getElementById("etapa-auth");
const etapaForm = document.getElementById("form-orcamento");
const etapaSucesso = document.getElementById("etapa-sucesso");

const btnLoginGoogle = document.getElementById("btn-login-google");
const btnTrocarConta = document.getElementById("btn-trocar-conta");
const btnNovoEnvio = document.getElementById("btn-novo-envio");

const usuarioLogadoNome = document.getElementById("usuario-logado-nome");
const usuarioLogadoEmail = document.getElementById("usuario-logado-email");

const formOrcamento = document.getElementById("form-orcamento");
const inputEmpresa = document.getElementById("campo-empresa");
const selectServico = document.getElementById("campo-servico");
const selectCanal = document.getElementById("campo-canal");
const inputContato = document.getElementById("campo-contato");
const textareaMensagem = document.getElementById("campo-mensagem");
const feedbackErro = document.getElementById("feedback-erro");
const btnSubmit = document.getElementById("btn-submit-orcamento");

let usuarioAtual = null;
let servicoFirebase = null;

function exibirErro(mensagem) {
  if (!feedbackErro) return;
  feedbackErro.textContent = mensagem;
  feedbackErro.classList.remove("hidden");
}

function limparErro() {
  if (!feedbackErro) return;
  feedbackErro.textContent = "";
  feedbackErro.classList.add("hidden");
}

function atualizarVisualModal() {
  limparErro();
  etapaSucesso?.classList.add("hidden");

  if (usuarioAtual) {
    etapaAuth?.classList.add("hidden");
    etapaForm?.classList.remove("hidden");

    if (usuarioLogadoNome) {
      usuarioLogadoNome.textContent = usuarioAtual.displayName || "Conta verificada";
    }
    if (usuarioLogadoEmail) {
      usuarioLogadoEmail.textContent = usuarioAtual.email || "";
    }
  } else {
    etapaForm?.classList.add("hidden");
    etapaAuth?.classList.remove("hidden");
  }
}

function abrirModal(servicoPreSelecionado = "") {
  if (!modal) {
    console.warn("Elemento #modal-contato não encontrado no DOM.");
    return;
  }
  if (servicoPreSelecionado && selectServico) {
    selectServico.value = servicoPreSelecionado;
  }
  atualizarVisualModal();
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function fecharModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

botoesAbrirModal.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const servico = btn.getAttribute("data-servico") || "";
    abrirModal(servico);
  });
});

btnFecharModal?.addEventListener("click", fecharModal);
overlayModal?.addEventListener("click", (e) => {
  if (e.target === overlayModal) {
    fecharModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    fecharModal();
  }
});

(async () => {
  try {
    const firebaseMod = await import("./firebase-config.js");
    const contactMod = await import("./contact-service.js");
    servicoFirebase = { ...firebaseMod, ...contactMod };

    servicoFirebase.observarUsuario((user) => {
      usuarioAtual = user;
      if (modal && !modal.classList.contains("hidden")) {
        atualizarVisualModal();
      }
    });
  } catch (err) {
    console.warn("Firebase ainda não configurado ou com erro na inicialização:", err);
  }
})();

btnLoginGoogle?.addEventListener("click", async () => {
  limparErro();
  if (!servicoFirebase?.autenticarClienteGoogle) {
    exibirErro("Verifique a configuração do Firebase em assets/js/firebase-config.js e do App Check.");
    return;
  }

  btnLoginGoogle.disabled = true;
  btnLoginGoogle.textContent = "Verificando conta...";

  try {
    await servicoFirebase.autenticarClienteGoogle();
    atualizarVisualModal();
  } catch (err) {
    etapaForm?.classList.add("hidden");
    etapaSucesso?.classList.add("hidden");
    etapaAuth?.classList.remove("hidden");

    if (err?.code === "auth/popup-closed-by-user") {
      exibirErro("A janela de login foi fechada antes de concluir. Clique em 'Continuar com Google' novamente.");
    } else if (err?.code === "auth/popup-blocked") {
      exibirErro("O navegador bloqueou a janela pop-up. Permita pop-ups para este site e tente novamente.");
    } else {
      exibirErro("Não foi possível concluir a verificação com o Google. Confirme o domínio autorizado no Firebase.");
    }
    console.error(err);
  } finally {
    btnLoginGoogle.disabled = false;
    btnLoginGoogle.textContent = "Continuar com Google";
  }
});

btnTrocarConta?.addEventListener("click", async () => {
  if (servicoFirebase?.auth) {
    await signOut(servicoFirebase.auth);
  }
  atualizarVisualModal();
});

formOrcamento?.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparErro();

  if (!servicoFirebase?.enviarSolicitacaoContato) {
    exibirErro("Serviço de envio indisponível. Recarregue a página e tente novamente.");
    return;
  }

  const dados = {
    empresa: inputEmpresa?.value || "",
    servico: selectServico?.value || "",
    canalPreferido: selectCanal?.value || "WhatsApp",
    contatoCliente: inputContato?.value || "",
    mensagem: textareaMensagem?.value || ""
  };

  const textoOriginal = btnSubmit?.textContent || "Enviar solicitação ↗";
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Enviando com segurança...";
  }

  try {
    await servicoFirebase.enviarSolicitacaoContato(dados);
    formOrcamento.reset();
    etapaAuth?.classList.add("hidden");
    etapaForm?.classList.add("hidden");
    etapaSucesso?.classList.remove("hidden");
  } catch (err) {
    exibirErro(err?.message || "Não foi possível enviar sua solicitação agora.");
    console.error(err);
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = textoOriginal;
    }
  }
});

btnNovoEnvio?.addEventListener("click", () => {
  atualizarVisualModal();
});