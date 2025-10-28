// Modals
const transactionModal = document.getElementById("transaction-modal");
const chartModal = document.getElementById("chart-modal");
const deleteAllForm = document.getElementById("remove-all-form");
const editForm = document.getElementById("edit-form");

// Backing up default values
const backupDeleteForm = deleteAllForm.innerHTML;
const backupEditForm = editForm.innerHTML;

// Buttons
const addTransactionBtn = document.getElementById("add-btn");
const closeModalBtn = document.querySelectorAll('img.close-modal-btn');
const openChartBtn = document.getElementById("show-chart-btn");
const toggleSide = document.getElementById("close-side");
const clearAllBtn = document.getElementById("btn-clear");
const exitDashBtn = document.getElementById("exit-btn");

// Table buttons
const dateBtn = document.getElementById("date-btn");
const valueBtn = document.getElementById("value-btn");
const statusBtn = document.getElementById("status-btn");

// Select
const categorySelect = document.getElementById("category");
const inputCategory = document.getElementById("new-category");
const typeSelect = document.getElementById("type");

const btnLinksArray = document.querySelectorAll('a');
const btnArray = document.querySelectorAll('button');

// Chart stuff
var chartInstance = null;

// localStorage stuff
const USERS = JSON.parse(localStorage.getItem("usuarios"));

// Welcome message and user display thing
const welcomeMessage = document.querySelector('.welcome-message');
const displayName = document.getElementById("username");
const profileName = document.getElementById("profile-name");
displayName.innerHTML = USERS[0].nome;
profileName.innerHTML = `<p>${USERS[0].nome}</p>`;

setTimeout(() => {
  welcomeMessage.classList.add("hide");
}, 2 * 1000);


btnLinksArray.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  })
})

toggleSide.addEventListener("click", (e) => {

  e.preventDefault();

  const imgBtn = toggleSide.querySelector('img');
  const sideMenu = document.getElementById("side-menu");

  if (sideMenu.classList.contains("close")) {
    imgBtn.src = "./img/close.svg";
    sideMenu.classList.remove("close");

  } else {
    sideMenu.classList.add("close");
    imgBtn.src = "./img/arrow_foward.svg";
  }

})

statusBtn.addEventListener('click', () => {

  listTransaction(currentPage);
  if (statusOrder == 0 || statusOrder == "low") {
    statusOrder = "high";
    itemOrder = 0;
    pageOrder = 0;
    
    statusBtn.src = "./img/arrow_up.svg";
    listTransaction(currentPage);

  } else if (statusOrder == "high") {
    statusOrder = "low";
    itemOrder = 0;
    pageOrder = 0;

    statusBtn.src = "./img/arrow_down.svg";
    listTransaction(currentPage);
  }

})

dateBtn.addEventListener('click', () => {
  
  listTransaction(currentPage);
  if (pageOrder == "newest" || pageOrder == 0) {
    pageOrder = "oldest"
    dateBtn.src = "./img/arrow_up.svg"
    itemOrder = 0;
    statusOrder = 0;
    listTransaction(currentPage);
  } else if (pageOrder == "oldest") {
    pageOrder = "newest";
    dateBtn.src = "./img/arrow_down.svg"
    itemOrder = 0;
    statusOrder = 0;
    listTransaction(currentPage);
  }

});

valueBtn.addEventListener('click', () => {

  listTransaction(currentPage);
  if (itemOrder == 0 || itemOrder == "low") {
    itemOrder = "high";
    valueBtn.src = "./img/arrow_up.svg"
    pageOrder = 0;
    statusOrder = 0;
    listTransaction(currentPage);
  } else if (itemOrder == "high") {
    itemOrder = "low";
    valueBtn.src = "./img/arrow_down.svg"
    pageOrder = 0;
    statusOrder = 0;
    listTransaction(currentPage);
  }

});

addTransactionBtn.addEventListener("click", () => {
  transactionModal.showModal();
  transactionModal.classList.add("open-modal");

  const emptySelection = document.querySelector('option[value=""]');
  categorySelect.value = emptySelection.value;

})

openChartBtn.addEventListener("click", () => {
  chartModal.showModal();
  chartModal.classList.add("open-modal")
})

typeSelect.addEventListener("change", () => {
  const status = document.getElementById("status");

  if (typeSelect.value == "investimento") {
    [...status.options].forEach((item) => {
      if (item.innerText != "Aplicado" || item.innerText != "Resgatado") {
        item.style.display = "none";
      }
    });

    status.innerHTML += `<option value="pago">Aplicado</option>
    <option value="pendente">Resgatado</option>`;
  } else {

    [...status.options].forEach((item) => {
      item.style.display = "block";
      if (item.innerText == "Aplicado" || item.innerText == "Resgatado") {
        status.removeChild(item);
      }
    });
  }
})

categorySelect.addEventListener("change", () => {
  const tipo = document.getElementById("type");
  const status = document.getElementById("status");

  if (categorySelect.value == 'create-category') {
    inputCategory.classList.add("display-input");
    inputCategory.focus();
  } else {
    inputCategory.classList.remove("display-input");
  }

  if (categorySelect.value == "renda") {
    tipo.innerHTML += `<option value="receita">Receita</option>`;
    [...tipo.options].forEach((item) => {
      item.style.display = "none";
    });

    [...status.options].forEach((item) => {
      if (item.innerText != "Recebido" || item.innerText != "Aguardando") {
        item.style.display = "none";
      }
    });
    status.innerHTML += `<option value="pago">Recebido</option>
    <option value="pendente">Aguardando</option>`;

    tipo.value = "receita";
  } else {
    tipo.value = "";
    status.value = "";

    [...tipo.options].forEach((item) => {
      if (item.value != "receita") {
        item.style.display = "block";
      }
    });

    [...status.options].forEach((item) => {
      item.style.display = "block";
      if (item.innerText == "Recebido" || item.innerText == "Aguardando" || item.innerText == "Aplicado" || item.innerText == "Resgatado") {
        status.removeChild(item);
      }
    });

  }

})

inputCategory.addEventListener("keypress", (e) => {
  if (e.key === 'Enter' && inputCategory.value.trim() !== "") {
    e.preventDefault();

    const newCategory = inputCategory.value.trim();
    const newOption = document.createElement('option');
    newOption.value = newCategory.toLowerCase().replace(/\s+/g, '-');
    newOption.textContent = newCategory;

    categorySelect.insertBefore(newOption, categorySelect.lastElementChild);
    categorySelect.value = newOption.value;
    inputCategory.value = "";
    inputCategory.classList.remove("display-input");
  }
})

closeModalBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = document.querySelector('dialog.open-modal');
    if (!modal) {
      console.log("Não foi encontrado nenhum modal, zé");
      return;
    }

    modal.classList.remove("open-modal");
    setTimeout(() => {
      modal.close();
    }, 500);
  })
})

function returnHome() {
  window.location.href = "index.html";
  localStorage.clear();
}

function goToLogin() {
  window.location.href = "login.html";
}

function goToRegister() {
  window.location.href = "cadastro.html";
}

function goToDashboard() {
  window.location.href = "table.html";
}

function updateChart() {
  const pieChart = document.getElementById('my-chart');

  const chartInfo = {
    labels: ['Receitas', 'Despesas', 'Investimentos', 'Saldo'],
    datasets: [{
      label: 'Valor',
      data: [TRANSACTIONS.receita, TRANSACTIONS.despesa, TRANSACTIONS.investimento, TRANSACTIONS.saldo],
      backgroundColor: [
        '#43d85b',
        '#d64747',
        '#3d49bd',
        '#a1e6b5'
      ],
      borderColor: [
        '#43d85b',
        '#d64747',
        '#3d49bd',
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
}