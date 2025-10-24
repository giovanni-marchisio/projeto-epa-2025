const emailUser = document.getElementById("email");
const senhaUser = document.getElementById("senha");
const entrar = document.getElementById("entrar");
const registrar = document.getElementById("registrar");

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const spanMsg = document.getElementById("msg-erro");

entrar.addEventListener("click", () => {
    // O forms já indica que os campos estão vázios.    
/*     if (!emailUser.value || !senhaUser.value) {
        alert("Por favor, preencha os dados.")
    } */
    const emailDigitado = emailUser.value;
    const senhaDigitado = senhaUser.value;

    const usuarioEncontrado = usuarios.find(user => user.email === emailDigitado && user.senha === senhaDigitado);

    if (usuarioEncontrado && emailUser.value && senhaUser.value) {
        goToDashboard();
    } else{
        spanMsg.innerHTML = "<p>O e-mail ou a senha está incorreto</p>"
        spanMsg.classList.add("msg-show");
        setTimeout(() => {
            spanMsg.classList.remove("msg-show");
            spanMsg.innerHTML = "";
        }, 2 * 1000);
    }
    emailUser.value = "";
    senhaUser.value = "";
});

registrar.addEventListener("click", (e)=> {
    e.preventDefault();
    console.log(emailUser.value)
    if (emailUser.value != ""){
        localStorage.setItem("email-digitado", JSON.stringify(emailUser.value));
        goToRegister();
    } else {
        goToRegister();
    }
});
