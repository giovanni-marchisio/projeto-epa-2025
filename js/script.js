
// Botões
const btnOpenMenu = document.getElementById('btn-open-menu');
const btnOpenImg = document.getElementById('btn-arrow')

// Containers
const containerSide = document.getElementById('container-side');
const containerAccount = document.getElementById('container-accounts');
const containerTransaction = document.getElementById('container-accounts');
const statusSide = localStorage.getItem('sidebarStatus');
const modalContainer = document.getElementById('modal-container');
const transactionForm = document.getElementById('transaction-form')

// Tabela transações
const transactionHistory = document.getElementById('transactions-history');

// Modal add
const transactionModal = document.getElementById('add-transaction');

// Modal add cartão
const cardModal = document.getElementById('add-card');

// Modal help
const helpModal = document.getElementById('help-modal');

// Entrada usuário
const valueTransaction = document.getElementById('value-transaction');
const dateTransaction = document.getElementById('date');
const typeTransaction = document.getElementById('type-transaction');
const categoryTransaction = document.getElementById('category');
const statusTransaction = document.getElementById('status-transaction');
const descriptionTransaction = document.getElementById('description');

// Variáveis
const currentDate = new Date().toISOString().slice(0, 10);


transactionForm.addEventListener('submit', (e) => {

    if (!transactionForm.checkValidity()) {
        return;
    }

    e.preventDefault();

    let date = dateTransaction.value
    let value = valueTransaction.value
    let description = descriptionTransaction.value;
    let category = categoryTransaction.value;
    let type = typeTransaction.value;
    let status = statusTransaction.value;

    // 
    makeTransaction(date, value, description, category, type, status);

});

valueTransaction.addEventListener("input", () => {

    let valor = valueTransaction.value.replace(/\D/g, '');
    if (valor === "") {
        valueTransaction.value = "";
        return;
    }

    valor = (parseInt(valor, 10) / 100).toFixed(2);
    valueTransaction.value = `${valor.replace('.', ',')}`;

});

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
        modals.forEach(div => {
            div.classList.remove('open-modal');
        })
    }
});

if (statusSide === 'aberto') {
    btnOpenMenu.checked = true;
    containerSide.classList.add('side-open');
    btnOpenImg.classList.add('btn-reverse');
} else {
    containerSide.classList.remove('side-open');
    btnOpenImg.classList.remove('btn-reverse');
}

// Funções

function makeTransaction(date, value, description, category, type, transactionStatus) {
    transactionHistory.innerHTML += `
    <tr>
        <td>${date}</td>
        <td>R$ ${value}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td>${type}</td>
        <td>${transactionStatus}</td>
    </tr>
    `
}

function openModal(div) {
    div.classList.toggle('open-modal');
}


