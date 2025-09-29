// Containers
const sideContainer = document.getElementById('side-container');
const accountContainer = document.getElementById('account-container');
const modalContainer = document.getElementById('modal-container');

const statusSide = localStorage.getItem('sidebarStatus');

// Modals
const transactionModal = document.getElementById('add-transaction');
const cardModal = document.getElementById('add-card');
const helpModal = document.getElementById('help-modal');
const cardSelectModal = document.getElementById('select-card-modal');
const chartModal = document.getElementById('chart-modal');

// Tabela
const transactionHistory = document.getElementById('transactions-history');

// Form
const transactionForm = document.getElementById('transaction-form');
const addCardForm = document.getElementById('add-card-form');

// Opções de parcela
const transactionCardOptions = document.getElementById('card-options');

// Opções cartão
const cardOptions = document.getElementById('card-list');

// Span valores
const spanReceita = document.getElementById('span-receitas');
const spanDespesa = document.getElementById('span-despesas');
const spanInvestimento = document.getElementById('span-investimento');
const spanFaturaCartao = document.getElementById('span-fatura-cartao');
const spanSaldo = document.getElementById('span-saldo');

// Entrada usuário
const valueTransaction = document.getElementById('value-transaction');
const dateTransaction = document.getElementById('date');
const typeTransaction = document.getElementById('type-transaction');
const categoryTransaction = document.getElementById('category');
const statusTransaction = document.getElementById('status-transaction');
const descriptionTransaction = document.getElementById('description');
const addCardName = document.getElementById('card-name');

// Array
const RECEITAS = JSON.parse(localStorage.getItem("RECEITAS")) || [];
const DESPESAS = JSON.parse(localStorage.getItem("DESPESAS")) || [];
const INVESTIMENTOS = JSON.parse(localStorage.getItem("INVESTIMENTOS")) || [];
const FATURAS_CARTAO = JSON.parse(localStorage.getItem("FATURAS_CARTAO")) || [];
const SALDOS = JSON.parse(localStorage.getItem("SALDOS")) || [];
const CARTOES = JSON.parse(localStorage.getItem("CARTOES")) || [];
const TOTAL = JSON.parse(localStorage.getItem("TOTAL")) || {
    receita: 0,
    despesa: 0,
    investimento: 0,
    fatura: 0,
    saldo: 0
};

// Botões
const btnOpenMenu = document.getElementById('btn-open-menu');
const btnOpenImg = document.getElementById('btn-arrow');

// Variáveis
var currentDate = new Date().toISOString().slice(0, 10);
var idTransaction = Number(localStorage.getItem('idTransaction')) || 0;
var chartInstance = null;
transactionCardOptions.style.display = "none";

addCardForm.addEventListener('submit', (e) => {
    e.preventDefault();

    CARTOES.push(addCardName.value);
    addCard(addCardName.value);

})

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
        id: idTransaction++
    }

    if (obj.type == "Crédito") {
        obj.type += ` x${transactionCardOptions.value}`;
        makeTransaction(obj);
        addToArray(obj);
        store();
        updateValues();
        updateChart()
    } else {
        makeTransaction(obj);
        addToArray(obj);
        store();
        updateValues();
        updateChart()
    }

});

transactionForm.addEventListener('input', () => {
    if (typeTransaction.value == "Crédito") {
        transactionCardOptions.style.display = "block";
    } else {
        transactionCardOptions.style.display = "none";
    }
});

valueTransaction.addEventListener('input', () => {

    let uValue = valueTransaction.value.replace(/\D/g, '');
    if (uValue === "") {
        valueTransaction.value = "";
        return;
    }

    uValue = (parseInt(uValue, 10) / 100).toFixed(2);
    valueTransaction.value = `${uValue.replace('.', ',')}`;

});

btnOpenMenu.addEventListener('change', () => {
    var modals = modalContainer.querySelectorAll('div');

    if (btnOpenMenu.checked) {
        sideContainer.classList.add('side-open');
        btnOpenImg.classList.add('btn-reverse');
        localStorage.setItem('sidebarStatus', 'opened');
    } else {
        sideContainer.classList.remove('side-open');
        btnOpenImg.classList.remove('btn-reverse');
        localStorage.setItem('sidebarStatus', 'closed');
        modals.forEach(div => {
            div.classList.remove('open-modal');
        })
    }
});

if (statusSide === 'opened') {
    btnOpenMenu.checked = true;
    sideContainer.classList.add('side-open');
    btnOpenImg.classList.add('btn-reverse');
} else {
    sideContainer.classList.remove('side-open');
    btnOpenImg.classList.remove('btn-reverse');
};

cardSelectModal.addEventListener("dblclick", cardSelection);

// Funções

function cardSelection() {
    cardSelectModal.classList.toggle('open-card-modal');
};

function openModal(div) {
    div.classList.toggle('open-modal');
    if (div == 'chartModal') {
        div.classList.toggle('open-modal-fullscreen');
    }
};

function addCard(name) {
    cardOptions.innerHTML +=
        `
    <option value="${name}">${name}</option>
    `
};

function changeStatus(id, category) {
    if (category == "Receita") {
        let posicao = RECEITAS.findIndex(item => item.id === id);
        if (posicao === -1) return;

        if (RECEITAS[posicao].status == "Agendado" || RECEITAS[posicao].status == "Pendente") {
            RECEITAS[posicao].status = "Pago";
        } else if (RECEITAS[posicao].status == "Pago") {
            RECEITAS[posicao].status = "Agendado";
        }
        store();
        updateList();
        updateValues();
        updateChart();
    }

    if (category == "Despesa") {
        let posicao = DESPESAS.findIndex(item => item.id === id);
        if (posicao === -1) return;

        if (DESPESAS[posicao].status == "Agendado" || DESPESAS[posicao].status == "Pendente") {
            DESPESAS[posicao].status = "Pago";
        } else if (DESPESAS[posicao].status == "Pago") {
            DESPESAS[posicao].status = "Agendado";
        }
        store();
        updateList();
        updateValues();
        updateChart();
    }

    if (category == "Investimento") {
        let posicao = INVESTIMENTOS.findIndex(item => item.id === id);
        if (posicao === -1) return;

        if (INVESTIMENTOS[posicao].status == "Agendado" || INVESTIMENTOS[posicao].status == "Pendente") {
            INVESTIMENTOS[posicao].status = "Pago";
        } else if (INVESTIMENTOS[posicao].status == "Pago") {
            INVESTIMENTOS[posicao].status = "Agendado";
        }
        store();
        updateList();
        updateValues();
        updateChart();
    }

    if (category == "Fatura cartão") {
        let posicao = FATURAS_CARTAO.findIndex(item => item.id === id);
        if (posicao === -1) return;

        if (FATURAS_CARTAO[posicao].status == "Agendado" || FATURAS_CARTAO[posicao].status == "Pendente") {
            FATURAS_CARTAO[posicao].status = "Pago";
        } else if (FATURAS_CARTAO[posicao].status == "Pago") {
            FATURAS_CARTAO[posicao].status = "Agendado";
        }
        store();
        updateList();
        updateValues();
        updateChart();
    }
}

function makeTransaction(obj) {
    transactionHistory.innerHTML += `
    <tr>
        <td>${obj.date}</td>
        <td>R$ ${obj.value}</td>
        <td>${obj.description}</td>
        <td>${obj.category}</td>
        <td>${obj.type}</td>
        <td><a href="javascript:changeStatus(${obj.id}, '${obj.category}')">${obj.status}</a></td>
        <td><a href="javascript:removeTransaction(${obj.id})"><img src="./img/delete.svg" alt=""></a></td>
    </tr>
    `
};

function removeTransaction(id) {
    let removed = false;
    [RECEITAS, DESPESAS, INVESTIMENTOS, FATURAS_CARTAO].forEach(arr => {
        const posicao = arr.findIndex(obj => obj.id === id);
        if (posicao !== -1) {
            arr.splice(posicao, 1);
            removed = true;
        }
    });
    if (removed) {
        updateValues();
        updateList();
        store();
        updateChart()
    }
};



function updateList() {
    transactionHistory.innerHTML = "";
    [...RECEITAS, ...DESPESAS, ...INVESTIMENTOS, ...FATURAS_CARTAO].forEach(obj => {
        makeTransaction(obj);
        updateValues();
        updateChart();
    });
};

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
        if (objeto.type == "Débito" || objeto.type == "Dinheiro") {
            TOTAL.saldo -= valor
        }

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
    } else if (TOTAL.saldo > 0 && TOTAL.saldo <= 100) {
        spanSaldo.style.color = "#aad805";
        spanSaldo.innerHTML = `R$ ${TOTAL.saldo.toFixed(2)}`;
    } else {
        spanSaldo.style.color = "black";
        spanSaldo.innerHTML = `R$ ${TOTAL.saldo.toFixed(2)}`;
    }
};

function updateChart() {
    const pieChart = document.getElementById('my-chart');

    const chartInfo = {
        labels: ['Receitas', 'Despesas', 'Investimentos', 'Fatura cartão', 'Saldo'],
        datasets: [{
            label: 'Valor',
            data: [TOTAL.receita, TOTAL.despesa, TOTAL.investimento, TOTAL.fatura, TOTAL.saldo],
            backgroundColor: [
                '#43d85b',
                '#d64747',
                '#3d49bd',
                '#d6ff43',
                '#a1e6b5'
            ],
            borderColor: [
                '#43d85b',
                '#d64747',
                '#3d49bd',
                '#d6ff43',
                '#a1e6b5'
            ],
            borderWidth: 1
        }]
    };

    // Atualiza o gráfico ou cria
    if (chartInstance) {
        chartInstance.data = chartInfo;
        chartInstance.update();
    } else {
        chartInstance = new Chart(pieChart, {
            type: 'pie',
            data: chartInfo
        });
    }
};

function addToArray(obj) {
    const value = obj.value.replace(".", "");
    if (obj.category == "Receita") {
        RECEITAS.push(obj);
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

    if (obj.category == "Fatura cartão") {
        if (obj.type == "Débito") {
            TOTAL.saldo -= parseInt(value);
            FATURAS_CARTAO.push(obj);
        } else {
            FATURAS_CARTAO.push(obj);
        }
    }

};

function store() {
    localStorage.setItem("RECEITAS", JSON.stringify(RECEITAS));
    localStorage.setItem("DESPESAS", JSON.stringify(DESPESAS));
    localStorage.setItem("INVESTIMENTOS", JSON.stringify(INVESTIMENTOS));
    localStorage.setItem("FATURAS_CARTAO", JSON.stringify(FATURAS_CARTAO));
    localStorage.setItem("SALDOS", JSON.stringify(SALDOS));
    localStorage.setItem("TOTAL", JSON.stringify(TOTAL));
    localStorage.setItem("CARTOES", JSON.stringify(CARTOES));
    localStorage.setItem('idTransaction', idTransaction);
};

window.addEventListener('DOMContentLoaded', () => {
    updateList();
    updateChart();
    updateValues();
});