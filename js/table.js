// Código continua bagunçado...
// Como eu acho que estou com todas as features implementadas (de uma forma porca), refazer com código mais limpo vai ser mais fácil.
// O plano pra frente é não fazer nada sem planejar, e forçar o pessoal a não fazer as coisas toda diferente misturando arquivos e pastas sem necessidade.

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

    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    date = newDate;

    insertTable(description, type, date, status, value, category);
    transactionForm.reset();

})

clearAllBtn.addEventListener("click", () => {
    const confirm = deleteAllForm.querySelector('button');
    const cancel = deleteAllForm.querySelector('button[class="close-modal-btn"]');

    deleteAllForm.classList.add("open-modal");
    deleteAllForm.showModal();

    console.log("insideclear");

    confirm.addEventListener("click", () => {
        LIST.length = 0;
        TRANSACTIONS.receita = 0;
        TRANSACTIONS.despesa = 0;
        TRANSACTIONS.investimento = 0;
        TRANSACTIONS.saldo = 0;

        let obj = {
            tipo: 'DELETE',
            status: 'pago',
        }

        updateValues(obj, "update");
        quantityOfPages();
        listTransaction(currentPage);
        updateChart();

        setTimeout(() => {
            deleteAllForm.innerHTML = `<img src="./img/green_check.gif" alt="">
            <header>
                <h1>Lista deletada!</h1>
            </header>
            <div></div>`
        }, 500);

        setTimeout(() => {
            deleteAllForm.classList.remove("open-modal");
            deleteAllForm.close();
        }, 2 * 1000)

        setTimeout(() => {
            deleteAllForm.innerHTML = backupDeleteForm;
        }, 2.5 * 1000);

    })

    cancel.addEventListener("click", () => {
        deleteAllForm.classList.remove("open-modal");
        deleteAllForm.close();
    })

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

        if (item.data < currentDate && status_id != "pago" && status_id != "recebido") {
            if (status_id == "aguardando") {
                item.status = "Aguardando"
                status_id = item.status.toLowerCase();
            } else if (status_id == "pendente") {
                item.status = "Pendente"
                status_id = item.status.toLowerCase();
            } else {
                item.status = "Aplicado"
                status_id = item.status.toLowerCase();
            }

            tableArea.innerHTML += `<tr>
                        <td class="date-table-late"><img src="./img/error.svg" alt="">${new Date(item.data).toLocaleDateString('pt-BR')}</td>
                        <td>${item.descricao}</td>
                        <td>${item.categoria}</td>
                        <td>${formatMoney(item.valor)}</td>
                        <td><span class="${status_id}">${item.status}</span><span class="payment-status" onclick="editTransaction('${item.id}')"><img src="./img/edit2.svg"></span></td>
                        <td>${item.tipo}<span class="type-table" onclick="deleteTransaction('${item.id}')"><img src="./img/delete.svg"></span></td>
                    </tr>`
        } else if (status_id == "pago" || status_id == "recebido" || status_id == "resgatado") {
            tableArea.innerHTML += `<tr>
                        <td class="date-table"><img src="./img/error.svg" alt="">${new Date(item.data).toLocaleDateString('pt-BR')}</td>
                        <td>${item.descricao}</td>
                        <td>${item.categoria}</td>
                        <td>${formatMoney(item.valor)}</td>
                        <td><span class="${status_id}">${item.status}</span></td>
                        <td>${item.tipo}<span class="type-table" onclick="deleteTransaction('${item.id}')"><img src="./img/delete.svg"></span></td>
                    </tr>`
        } else {
            tableArea.innerHTML += `<tr>
                        <td class="date-table"><img src="./img/error.svg" alt="">${new Date(item.data).toLocaleDateString('pt-BR')}</td>
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

    var posicao = LIST.findIndex((i) => i.id == id);
    var obj = LIST[posicao];

    const confirm = editForm.querySelector('button');
    const cancel = editForm.querySelector('button[class="close-modal-btn"]');

    cancel.addEventListener("click", () => {
        editForm.classList.remove("open-modal");
        editForm.close();
    })

    confirm.addEventListener("click", () => {

        setTimeout(() => {
            editForm.innerHTML = `<img src="./img/green_check.gif" alt="">
            <header>
                <h1>Pagamento registrado com sucesso!</h1>
            </header>
            <div></div>`
        }, 100);

        setTimeout(() => {
            editForm.classList.remove("open-modal");
            editForm.close();

            if (obj.status == "Aplicado") {
                obj.status = "Resgatado";
                obj.data = currentDate;
                updateValues(obj, "update");
                quantityOfPages();
                listTransaction(currentPage);
                updateChart();
            } else if (obj.status == "Aguardando") {
                obj.status = "Recebido";
                obj.data = currentDate;
                updateValues(obj, "update");
                quantityOfPages();
                listTransaction(currentPage);
                updateChart();
            } else {
                obj.status = "Pago";
                obj.data = currentDate;
                updateValues(obj, "update");
                quantityOfPages();
                listTransaction(currentPage);
                updateChart();
            }
        }, 2 * 1000);

        setTimeout(() => {
            editForm.innerHTML = backupEditForm;
        }, 2.5 * 1000);
    })
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
}

function updateValues(obj, type) {
    let tipo = obj.tipo.toLowerCase();
    let status = obj.status.toLowerCase();

    if (tipo == "receita" && status == "recebido") {
        TRANSACTIONS.receita += (parseInt(obj.valor));
    }

    if (tipo == "despesa" && status == "pago") {
        TRANSACTIONS.despesa += (parseInt(obj.valor));
    }

    if (tipo == "investimento" && status == "resgatado") {
        TRANSACTIONS.investimento -= (parseInt(obj.valor));
        TRANSACTIONS.saldo += (parseInt(obj.valor));
    }

    if (tipo == "investimento" && status == "pago" || status == "aplicado") {
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

    if (status == "pago" || status == "aplicado" || status == "recebido" && type == "new") {
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
