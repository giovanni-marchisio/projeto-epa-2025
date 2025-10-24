
const infNome = document.getElementById("nome");
const infEmail = document.getElementById("email");
const infCelular = document.getElementById("celular");
const infSenha = document.getElementById("senha");
const btnCadastrar = document.getElementById("btn-cadastrar");

let dadosUsuario = JSON.parse(localStorage.getItem("usuarios")) || [];
let temp = JSON.parse(localStorage.getItem("email-digitado")) || "";

if (temp != ""){
    infEmail.value = temp;
}

const phoneMask = IMask(infCelular, {
  mask: '(00) 00000-0000' 
});

infCelular.addEventListener("input", () =>{
    infCelular.value = phoneMask.value;
})

btnCadastrar.addEventListener("click", () => {

     if (!infNome.value || !infEmail.value || !infCelular.value || !infCelular.value || !infSenha.value) {
        return;
    }

    const obj = {
        nome: infNome.value,
        email: infEmail.value,
        celular: infCelular.value,
        senha: infSenha.value,
    }
    dadosUsuario.push(obj);

    localStorage.setItem("usuarios", JSON.stringify(dadosUsuario));

    infNome.value = "";
    infEmail.value = "";
    infCelular.value = "";
    infSenha.value = "";

    goToLogin();
});