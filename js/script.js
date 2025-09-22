
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

// Span valores
const spanReceita = document.getElementById('span-receitas');
const spanDespesa = document.getElementById('span-despesas');
const spanInvestimento = document.getElementById('span-investimento');
const spanFaturaCartao = document.getElementById('span-fatura-cartao');
const spanSaldo = document.getElementById('span-saldo');

// Tabela transações
const transactionHistory = document.getElementById('transactions-history');


// ModalS
const transactionModal = document.getElementById('add-transaction');
const cardModal = document.getElementById('add-card');
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

// Arrays
const RECEITAS = [];
const DESPESAS = [];
const INVESTIMENTOS = [];
const FATURAS_CARTAO = [];
const SALDOS = [];
const TOTAL = {
    receita: 0,
    despesa: 0,
    investimento: 0,
    fatura: 0,
    saldo: 0
}


transactionForm.addEventListener('submit', (e) => {

    if (!transactionForm.checkValidity()) {
        return;
    }

    e.preventDefault();

    const obj = {
        date: dateTransaction.value,
        value: valueTransaction.value,
        description: descriptionTransaction.value,
        category: categoryTransaction.value,
        type: typeTransaction.value,
        status: statusTransaction.value
    }

    makeTransaction(obj);
    storeValues(obj);
    updateValues();

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

function updateList() {

}

function updateValues() {

    TOTAL.receita = 0;
    TOTAL.despesa = 0;
    TOTAL.investimento = 0;
    TOTAL.fatura = 0; 


    RECEITAS.forEach((objeto) => {
        TOTAL.receita += parseInt(objeto.value.replace(".", ""));
    });

    DESPESAS.forEach((objeto) => {
        TOTAL.despesa += parseInt(objeto.value.replace(".", ""));
    });

    INVESTIMENTOS.forEach((objeto) => {
        TOTAL.investimento += parseInt(objeto.value.replace(".", ""));
    });

    FATURAS_CARTAO.forEach((objeto) => {
        TOTAL.fatura += parseInt(objeto.value.replace(".", ""));
    });

    spanReceita.innerHTML = `R$ ${TOTAL.receita.toFixed(2)}`;
    if (TOTAL.despesa > 0){
        spanDespesa.style.color = "red";
        spanDespesa.innerHTML = `R$ ${TOTAL.despesa.toFixed(2)}`;
    } else {
        spanDespesa.style.color = "black";
        spanDespesa.innerHTML = `R$ ${TOTAL.despesa.toFixed(2)}`;
    }
    spanFaturaCartao.innerHTML = `R$ ${TOTAL.fatura.toFixed(2)}`;
    spanInvestimento.innerHTML = `R$ ${TOTAL.investimento.toFixed(2)}`;
    if (TOTAL.saldo < 0) {
        spanSaldo.style.color = "red";
        spanSaldo.innerHTML = `R$ ${TOTAL.saldo.toFixed(2)}`;
    } else {
        spanSaldo.style.color = "black";
        spanSaldo.innerHTML = `R$ ${TOTAL.saldo.toFixed(2)}`;
    }
}

function storeValues(obj) {
    let value = obj.value.replace(".", "");
    if (obj.category == "Receita") {
        RECEITAS.push(obj);
        SALDOS.push(obj);
    }

    if (obj.category == "Saldo" && obj.type == "Dinheiro" || obj.type == "Pix" || obj.type == "Débito") {
        TOTAL.saldo += parseInt(value);
        SALDOS.push(obj);
    }

    if (obj.category == "Despesa") {
        if (obj.type == "Pix" || obj.type == "Débito" || obj.type == "Dinheiro") {
            TOTAL.saldo -= parseInt(value);
            DESPESAS.push(obj);
        } else {
            DESPESAS.push(obj);
        }
    }

    if (obj.category == "Investimento") {
        if (obj.type == "Pix" || obj.type == "Débito" || obj.type == "Dinheiro") {
            TOTAL.saldo -= parseInt(value);
        }
        INVESTIMENTOS.push(obj);
    }

    if (obj.category == "Fatura cartão" && obj.status == "Pendente") {
        FATURAS_CARTAO.push(obj);
    }
}

function makeTransaction(obj) {
    if (obj.category == "Saldo" && obj.type == "Crédito") {
        return
    } else {
        transactionHistory.innerHTML += `
    <tr>
        <td>${obj.date}</td>
        <td>R$ ${obj.value}</td>
        <td>${obj.description}</td>
        <td>${obj.category}</td>
        <td>${obj.type}</td>
        <td>${obj.status}</td>
    </tr>
    `
    }

}

function openModal(div) {
    div.classList.toggle('open-modal');
}


