let vagas = [];

const form = document.getElementById("form-vaga");
const vagasContainer = document.getElementById("vagas-container");
const empresa = document.getElementById("empresa");
const cargo = document.getElementById("cargo");
const data = document.getElementById("data");
const status = document.getElementById("status");
const link = document.getElementById("link");

const vagasSalvas = localStorage.getItem("vagas");
if (vagasSalvas) {
  vagas = JSON.parse(vagasSalvas);
  exibirVagas();
}

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

  vagas.push(vaga);
  localStorage.setItem("vagas", JSON.stringify(vagas));
  exibirVagas();

  empresa.value = "";
  cargo.value = "";
  data.value = "";
  status.value = "";
  link.value = "";
});

function exibirVagas() {
  const listaVagas = document.getElementById("vagas-container");
  listaVagas.innerHTML = "";

  vagas.forEach(function (vaga, index) {
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
      vagas.splice(index, 1);
      localStorage.setItem("vagas", JSON.stringify(vagas));
      exibirVagas();
    });

    buttonEditar.addEventListener("click", function () {
      empresa.value = vaga.empresa;
      cargo.value = vaga.cargo;
      data.value = vaga.data;
      status.value = vaga.status;
      link.value = vaga.link;


      vagas.splice(index, 1);
      localStorage.setItem("vagas", JSON.stringify(vagas));
      exibirVagas();
    });
  });
}
