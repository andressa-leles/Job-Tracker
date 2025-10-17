let vagas = [];
let vagaEmEdicao = null;

const form = document.getElementById("form-vaga");
const vagasContainer = document.getElementById("vagas-container");
const empresa = document.getElementById("empresa");
const cargo = document.getElementById("cargo");
const data = document.getElementById("data");
const status = document.getElementById("status");
const link = document.getElementById("link");
const filtroStatus = document.getElementById("filtro-status");
const alertasContainer = document.getElementById("alertas-container");

const vagasSalvas = localStorage.getItem("vagas");
if (vagasSalvas) {
  vagas = JSON.parse(vagasSalvas);
  exibirVagas();
}

function mostrarAlerta(mensagem, tipo) {
  const divAlerta = document.createElement("div");

  divAlerta.classList.add("alerta", tipo);
  divAlerta.textContent = mensagem;

  alertasContainer.appendChild(divAlerta);
  divAlerta.classList.add("mostrar");

  setTimeout(() => {
    divAlerta.classList.remove("mostrar");

    setTimeout(() => {
      divAlerta.remove();
    }, 300);
  }, 3000);
}

filtroStatus.addEventListener("change", function () {
  const statusSelecionado = filtroStatus.value;

  if (statusSelecionado === "") {
    return exibirVagas();
  }

  const vagasFiltradas = vagas.filter(
    (vaga) => vaga.status === statusSelecionado
  );
  exibirVagas(vagasFiltradas);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const valorEmpresa = empresa.value;
  const valorCargo = cargo.value;
  const valorData = data.value;
  const valorStatus = status.value;
  const valorLink = link.value;

  const vaga = {
    empresa: valorEmpresa,
    cargo: valorCargo,
    data: valorData,
    status: valorStatus,
    link: valorLink,
  };

  if (vagaEmEdicao !== null) {
    vagas[vagaEmEdicao] = vaga;
    mostrarAlerta("Vaga editada com sucesso!", "informacao");
    vagaEmEdicao = null;
  } else {
    vagas.push(vaga);
    mostrarAlerta("Vaga adicionada com sucesso!", "sucesso");
  }
  localStorage.setItem("vagas", JSON.stringify(vagas));
  exibirVagas();

  empresa.value = "";
  cargo.value = "";
  data.value = "";
  status.value = "";
  link.value = "";
});

function exibirVagas(lista = vagas) {
  const listaVagas = document.getElementById("vagas-container");
  listaVagas.innerHTML = "";

  if (lista.length === 0) {
    listaVagas.innerHTML = "<p>Nenhuma vaga adicionada.</p>";
    return;
  }

  lista.forEach(function (vaga, index) {
    const divVaga = document.createElement("div");
    divVaga.classList.add("vaga-card");

    const coresStatus = {
      pendente: "status-pendente",
      entrevista: "status-entrevista",
      "em andamento": "status-em-andamento",
      recusado: "status-recusado",
      contratado: "status-contratado",
    };

    divVaga.classList.add("vaga-card", coresStatus[vaga.status]);

    divVaga.innerHTML = `
            <p><strong>Empresa:</strong> ${vaga.empresa}</p>
            <p><strong>Cargo:</strong> ${vaga.cargo}</p>
            <p><strong>Data:</strong> ${vaga.data}</p>
            <p><strong>Status:</strong> ${vaga.status}</p>
            <p><a href="${vaga.link}" target="_blank">Ver vaga</a></p>
        `;

    const divBotoes = document.createElement("div");
    divBotoes.classList.add("botoes-card");

    const buttonEditar = document.createElement("button");
    buttonEditar.textContent = "Editar";
    buttonEditar.classList.add("btn-editar");

    const buttonDeletar = document.createElement("button");
    buttonDeletar.textContent = "Deletar";
    buttonDeletar.classList.add("btn-deletar");

    divBotoes.appendChild(buttonEditar);
    divBotoes.appendChild(buttonDeletar);

    divVaga.appendChild(divBotoes);

    listaVagas.appendChild(divVaga);

    buttonDeletar.addEventListener("click", function () {
      abrirModalConfirmacao(index);
    });

    function abrirModalConfirmacao(index) {
      const modal = document.getElementById("modal-confirmacao");
      modal.style.display = "flex";

      const btnConfirmar = document.getElementById("confirmar");
      const btnCancelar = document.getElementById("cancelar");

      btnConfirmar.onclick = function () {
        vagas.splice(index, 1);
        localStorage.setItem("vagas", JSON.stringify(vagas));
        exibirVagas();
        mostrarAlerta("Vaga deletada com sucesso!", "erro");
        modal.style.display = "none";
      };

      btnCancelar.onclick = function(){
        modal.style.display = "none"
      }
    }

    buttonEditar.addEventListener("click", function () {
      empresa.value = vaga.empresa;
      cargo.value = vaga.cargo;
      data.value = vaga.data;
      status.value = vaga.status;
      link.value = vaga.link;

      vagaEmEdicao = index;

      vagas.splice(index, 1);
      localStorage.setItem("vagas", JSON.stringify(vagas));
      exibirVagas();
    });
  });
}
