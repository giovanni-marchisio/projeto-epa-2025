
// Botões
const btnOpenMenu = document.getElementById('btn-open-menu');
const btnOpenImg = document.getElementById('btn-arrow')

// Containers
const containerSide = document.getElementById('container-side');
const containerAccount = document.getElementById('container-accounts');
const containerTransaction = document.getElementById('container-accounts');
const statusSide = localStorage.getItem('sidebarStatus');
const modalContainer = document.getElementById('modal-container');

// Tabela transações
const transactionHistory = document.getElementById('transactions-history');

// Modal add
const transactionModal = document.getElementById('add-transaction');

// Modal add cartão
const cardModal = document.getElementById('add-card');

// Modal help
const helpModal = document.getElementById('help-modal');

// Variáveis


if (statusSide === 'aberto') {
    btnOpenMenu.checked = true;
    containerSide.classList.add('side-open');
    btnOpenImg.classList.add('btn-reverse');
} else {
    containerSide.classList.remove('side-open');
    btnOpenImg.classList.remove('btn-reverse');
}

btnOpenMenu.addEventListener('change', () => {
   var modals = modalContainer.querySelectorAll('div');
    if (btnOpenMenu.checked) {
        containerSide.classList.add('side-open');
        btnOpenImg.classList.add('btn-reverse');
        localStorage.setItem('sidebarStatus', 'aberto');
    } else {
        containerSide.classList.remove('side-open');
        btnOpenImg.classList.remove('btn-reverse');
        localStorage.setItem('sidebarStatus', 'fechado');
        modals.forEach(div =>{
            div.classList.remove('open-modal');
        })
    }
});


// Funções

function criarTransacao(data, valor, descricao, categoria, transacao_status, tipo) {
    transactionHistory.innerHTML += `
    <tr>
        <td>${data}</td>
        <td>R$ ${valor}</td>
        <td>${descricao}</td>
        <td>${categoria}</td>
        <td>${transacao_status}</td>
        <td>${tipo}</td>
    </tr>
    `
}

function openModal(div) {
    div.classList.toggle('open-modal');
}
