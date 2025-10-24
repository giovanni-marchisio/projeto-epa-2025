const nomeCompleto = document.getElementById("nome-completo")
const emailCliente = document.getElementById("email")
const celularClient = document.getElementById("celular")
const senhaClient = document.getElementById("inputPassword5")


const DADOS = carregarLista();



function salvar() {
    localStorage.setItem("seguranca", JSON.stringify(DADOS));
}


function carregarLista() {
    let arr = localStorage.getItem("seguranca");
    if (arr) {
        return JSON.parse(arr);
    } else {
        return [];
    }


}

btnAdicionar.addEventListener("click", () => {
    if (!nomeCompleto.value || !emailCliente.value || !celularClient.value  || !senhaClient.value ) return;

    DADOS.push({ NomeCompleto: nomeCompleto.value, Email: emailCliente.value, Celular: Number(celularClient.value), Senha: senhaClient.value  });

    carregarLista();
    salvar();
});

