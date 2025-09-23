

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
var id = 0;

// Arrays
const RECEITAS = JSON.parse(localStorage.getItem("RECEITAS")) || [];
const DESPESAS = JSON.parse(localStorage.getItem("DESPESAS")) || [];
const INVESTIMENTOS = JSON.parse(localStorage.getItem("INVESTIMENTOS")) || [];
const FATURAS_CARTAO = JSON.parse(localStorage.getItem("FATURAS_CARTAO")) || [];
const SALDOS = JSON.parse(localStorage.getItem("SALDOS")) || [];
const TOTAL = JSON.parse(localStorage.getItem("TOTAL")) || {
    receita: 0,
    despesa: 0,
    investimento: 0,
    fatura: 0,
    saldo: 0
};

// 
const cardOptions = document.getElementById('card-options');


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
        status: statusTransaction.value,
        id: id++
    }

    // Existe formas mais bonitas de fazer isso, mas eu sou preguiçoso
    if (obj.type == "Crédito") {
        obj.type += ` x${cardOptions.value}`;
        console.log(obj.type);
        makeTransaction(obj);
        storeValues(obj);
        store();
        updateValues();
    } else {
        makeTransaction(obj);
        storeValues(obj);
        store();
        updateValues();
    }


});

cardOptions.style.display = "none";
transactionForm.addEventListener('input', () => {
    if (typeTransaction.value == "Crédito") {
        cardOptions.style.display = "block";
    } else {
        cardOptions.style.display = "none";
    }
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
};

// Funções

function updateList() {
    transactionHistory.innerHTML = "";
    [...RECEITAS, ...DESPESAS, ...INVESTIMENTOS, ...FATURAS_CARTAO].forEach(obj => {
        makeTransaction(obj);
    });
    updateValues();
}

function updateValues() {
    TOTAL.receita = 0;
    TOTAL.despesa = 0;
    TOTAL.investimento = 0;
    TOTAL.fatura = 0;
    TOTAL.saldo = 0;

    RECEITAS.forEach((objeto) => {
        const valor = parseInt(objeto.value.replace(".", ""));
        TOTAL.receita += valor;
        TOTAL.saldo += valor;
    });

    DESPESAS.forEach((objeto) => {
        const valor = parseInt(objeto.value.replace(".", ""));
        TOTAL.despesa += valor;
        if (objeto.type.includes("Pix") || objeto.type.includes("Débito") || objeto.type.includes("Dinheiro")) {
            TOTAL.saldo -= valor;
        }
    });

    INVESTIMENTOS.forEach((objeto) => {
        const valor = parseInt(objeto.value.replace(".", ""));
        TOTAL.investimento += valor;
        if (objeto.type.includes("Pix") || objeto.type.includes("Débito") || objeto.type.includes("Dinheiro")) {
            TOTAL.saldo -= valor;
        }
    });

    FATURAS_CARTAO.forEach((objeto) => {
        const valor = parseInt(objeto.value.replace(".", ""));
        TOTAL.fatura += valor;
    });

    spanReceita.innerHTML = `R$ ${TOTAL.receita.toFixed(2)}`;
    if (TOTAL.despesa > 0) {
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
        <td><a href="javascript:removeElement(${obj.id})"><img src="./img/delete.svg" alt=""></a></td>
    </tr>
    `
    }

}

function openModal(div) {
    div.classList.toggle('open-modal');
}

function store() {
    localStorage.setItem("RECEITAS", JSON.stringify(RECEITAS));
    localStorage.setItem("DESPESAS", JSON.stringify(DESPESAS));
    localStorage.setItem("INVESTIMENTOS", JSON.stringify(INVESTIMENTOS));
    localStorage.setItem("FATURAS_CARTAO", JSON.stringify(FATURAS_CARTAO));
    localStorage.setItem("SALDOS", JSON.stringify(SALDOS));
    localStorage.setItem("TOTAL", JSON.stringify(TOTAL));
}

function removeElement(id) {
    let removed = false;
    [RECEITAS, DESPESAS, INVESTIMENTOS, FATURAS_CARTAO].forEach(arr => {
        const idx = arr.findIndex(obj => obj.id === id);
        if (idx !== -1) {
            arr.splice(idx, 1);
            removed = true;
        }
    });
    if (removed) {
        store();
        updateList();
    }
}


window.addEventListener('DOMContentLoaded', updateList);