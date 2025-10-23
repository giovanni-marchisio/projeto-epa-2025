const LIST = [];
const DELETED_LIST = [];
const TRANSACTIONS = {
    receita: 0,
    despesa: 0,
    investimento: 0,
    saldo: 0
};

// ID
var id = 0;


// Form
const transactionForm = document.getElementById("transaction-form");

// Table
const tableArea = document.getElementById("list-transactions");

// Sorting stuff  
var pageOrder = "newest"; // oldest | newest 
var itemOrder = 0; // high | low | 0;
var currentPage = 1;
var itemsPerPage = 8;
var currentDate = new Date().toISOString().split('T')[0];

// QtdPage
const qtdPages = document.getElementById("qtd-pages");

transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let description = document.getElementById("description").value;
    let type = document.getElementById("type");
    let date = document.getElementById("date").value;
    let status = document.getElementById("status");
    let value = document.getElementById("value").value;
    let category = document.getElementById("category");

    type = type.options[type.selectedIndex].textContent;
    status = status.options[status.selectedIndex].textContent;
    category = category.options[category.selectedIndex].textContent;

    insertTable(description, type, date, status, value, category);
})

clearAllBtn.addEventListener("click", () => {
    LIST.length = 0;
    TRANSACTIONS.receita = 0;
    TRANSACTIONS.despesa = 0;
    TRANSACTIONS.investimento = 0;
    TRANSACTIONS.saldo = 0;

    let obj = {
        tipo: 'DELETE',
        status: 'pago',
    }

    console.log(LIST, TRANSACTIONS);

    updateValues(obj, "update");
    quantityOfPages();
    listTransaction(currentPage);
    updateChart();
})

function listTransaction(page) {
    tableArea.innerHTML = "";
    let listInOrder = LIST;

    changeOrder(listInOrder, pageOrder, itemOrder);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageList = listInOrder.slice(start, end);

    pageList.forEach((item) => {
        let status_id = item.status.toLowerCase();

        if (item.data < currentDate && status_id != "pago") {
            item.status = "Pendente"
            status_id = item.status.toLowerCase();
            tableArea.innerHTML += `<tr>
                        <td class="date-table-late"><img src="./img/error.svg" alt="">${new Date(item.data).toLocaleDateString()}</td>
                        <td>${item.descricao}</td>
                        <td>${item.categoria}</td>
                        <td>${formatMoney(item.valor)}</td>
                        <td><span class="${status_id}">${item.status}</span><span class="payment-status" onclick="editTransaction('${item.id}')"><img src="./img/edit2.svg"></span></td>
                        <td>${item.tipo}<span class="type-table" onclick="deleteTransaction('${item.id}')"><img src="./img/delete.svg"></span></td>
                    </tr>`
        } else {
            tableArea.innerHTML += `<tr>
                        <td class="date-table"><img src="./img/error.svg" alt="">${new Date(item.data).toLocaleDateString()}</td>
                        <td>${item.descricao}</td>
                        <td>${item.categoria}</td>
                        <td>${formatMoney(item.valor)}</td>
                        <td><span class="${status_id}">${item.status}</span><span class="payment-status" onclick="editTransaction('${item.id}')"><img src="./img/edit2.svg"></span></td>
                        <td>${item.tipo}<span class="type-table" onclick="deleteTransaction('${item.id}')"><img src="./img/delete.svg"></span></td>
                    </tr>`
        }
    })

    quantityOfPages();
}

function insertTable(descricao, tipo, data, status, valor, categoria) {
    if (data == "") {
        data = currentDate;
    } else {
        data = data;
    }
    const obj = {
        id: id++,
        descricao: descricao,
        tipo: tipo,
        data: data,
        status: status,
        valor: valor,
        categoria: categoria
    }

    updateValues(obj, "new");
    LIST.push(obj);
    quantityOfPages();
    listTransaction(currentPage);
    updateChart();
}

function deleteTransaction(id) {
    const posicao = LIST.findIndex((i) => i.id == id);
    const tipo = LIST[posicao].tipo.toLowerCase();
    const valor = parseInt(LIST[posicao].valor);

    DELETED_LIST.push(LIST[posicao]);

    if (tipo == "receita") {
        TRANSACTIONS.receita -= valor;
    }

    if (tipo == "despesa") {
        TRANSACTIONS.despesa -= valor;
    }

    if (tipo == "investimento") {
        TRANSACTIONS.investimento -= valor;
    }

    const obj = {
        tipo: 'DELETE',
        status: 'pago',
    }

    updateValues(obj, "update");
    LIST.splice(posicao, 1);
    quantityOfPages();
    listTransaction(currentPage);
    updateChart();
}

function editTransaction(id) {
    editForm.showModal();
    editForm.classList.add("open-modal");
    // toDo
}

function changeOrder(array, date, price) {
    if (date == "oldest") {
        array.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (date == "newest") {
        array.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    if (price == "high") {
        array.sort((a, b) => Number(a.valor) - Number(b.valor));
    } else if (price == "low") {
        array.sort((a, b) => Number(b.valor) - Number(a.valor));
    }
}

function quantityOfPages() {
    qtdPages.innerHTML = "";
    const totalPages = Math.ceil(LIST.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        qtdPages.innerHTML += `<button onclick='listTransaction(${i})'>${i}</button>`
    }
    console.log(totalPages);
}

function updateValues(obj, type) {
    let tipo = obj.tipo.toLowerCase();
    let status = obj.status.toLowerCase();

    if (tipo == "receita" && status == "pago") {
        TRANSACTIONS.receita += (parseInt(obj.valor));
    }

    if (tipo == "despesa" && status == "pago") {
        TRANSACTIONS.despesa += (parseInt(obj.valor));
    }

    if (tipo == "investimento" && status == "pago") {
        TRANSACTIONS.investimento += (parseInt(obj.valor));
    }

    TRANSACTIONS.saldo = TRANSACTIONS.receita - (TRANSACTIONS.despesa + TRANSACTIONS.investimento);

    const receita = document.getElementById("valor-1");
    const despesa = document.getElementById("valor-2");
    const investimento = document.getElementById("valor-3");
    const saldo = document.getElementById("valor-4");

    if (type == "update") {
        receita.innerHTML = formatMoney(TRANSACTIONS.receita);
        despesa.innerHTML = formatMoney(TRANSACTIONS.despesa);
        despesa.style.color = "#000000";
        if (TRANSACTIONS.despesa < 0) {
            despesa.innerHTML = `-&nbsp;${formatMoney(TRANSACTIONS.despesa)}`;
            despesa.style.color = "#df5252";
        }

        investimento.innerHTML = formatMoney(TRANSACTIONS.investimento);

        if (TRANSACTIONS.saldo <= 100) {
            saldo.style.color = "#759c35";
        }
        if (TRANSACTIONS.saldo <= 0) {
            saldo.style.color = "#df5252";
        }
        if (TRANSACTIONS.saldo > 101) {
            saldo.style.color = "#000000";
        }
        saldo.innerHTML = formatMoney(TRANSACTIONS.saldo);
    }

    if (status == "pago" && type == "new") {
        receita.innerHTML = formatMoney(TRANSACTIONS.receita);
        despesa.innerHTML = formatMoney(TRANSACTIONS.despesa);
        despesa.style.color = "#000000";
        if (TRANSACTIONS.despesa < 0) {
            despesa.innerHTML = `-&nbsp;${formatMoney(TRANSACTIONS.despesa)}`;
            despesa.style.color = "#df5252";
        }

        investimento.innerHTML = formatMoney(TRANSACTIONS.investimento);

        if (TRANSACTIONS.saldo <= 100) {
            saldo.style.color = "#759c35";
        }
        if (TRANSACTIONS.saldo <= 0) {
            saldo.style.color = "#df5252";
        }
        if (TRANSACTIONS.saldo > 101) {
            saldo.style.color = "#000000";
        }
        saldo.innerHTML = formatMoney(TRANSACTIONS.saldo);
    }

}

function formatMoney(amount) {

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) return;

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(numericAmount);
}