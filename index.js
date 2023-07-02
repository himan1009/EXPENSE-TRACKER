const state = {
    earnings: 0,
    expense: 0,
    net: 0,
    transactions: [],
};

let isUpdate = false;
let tid;
const transactionformEl = document.getElementById("transactionform");
const renderTransactions = () => {
    const transactioncontainerEl = document.querySelector(".transactions");
    const netamountEl = document.getElementById("netamount");
    const earningEl = document.getElementById("earning");
    const expenseEl = document.getElementById("expense");


    const transactions = state.transactions;

    let earning = 0;
    let expense = 0;
    let net = 0;
    transactioncontainerEl.innerHTML = "";

    transactions.forEach((transaction) => {

        const { id, amount, text, type } = transaction;
        const iscredit = type === "credit" ? true : false;
        const sign = iscredit ? "+" : "-";
        const transactionEl = `
        <div class="transaction" id="${id}">
            <div class="content" onclick="showEdit(${id})">
                <div class="left">
                    <p>${text}</p>
                    <p>${sign} $ ${amount}</p>
                </div>
                <div class="status ${iscredit ? "credit" : "debit"}">
                    ${iscredit ? "C" : "D"}
                </div>
            </div>
            <div class="lower">
                <div class="icon" onclick="handleUpdate(${id})">
                    <img src="./icons/pen.svg" alt=""/>
                </div>
                <div class="icon" onclick="handleDelete(${id})">
                    <img src="./icons/trash.svg" alt=""/>
                </div>
            </div>
        </div>`;
        earning += iscredit ? amount : 0;
        expense += !iscredit ? amount : 0;
        net = earning - expense;
        transactioncontainerEl.insertAdjacentHTML("afterbegin", transactionEl);
    });

    console.log({ net, earning, expense });
    netamountEl.innerHTML = `$ ${net}`;
    earningEl.innerHTML = `$ ${earning}`;
    expenseEl.innerHTML = `$ ${expense}`;
};

const addTransaction = (e) => {
    e.preventDefault();
    const isEarn = e.submitter.id === "earnbtn" ? true : false;
    const formData = new FormData(transactionformEl);
    const tData = {};
    formData.forEach((value, key) => {
        tData[key] = value;
    });

    const { text, amount } = tData;
    const transaction = {
        id: isUpdate ? tid : Math.floor(Math.random() * 1000),
        text: text,
        amount: +amount,
        type: isEarn ? "credit" : "debit",
    };

    if (isUpdate) {
        const tIndex = state.transactions.findIndex((t) => t.id === tid);

        state.transactions[tIndex] = transaction;
        isUpdate = false;
        tid = null;
    }
    else {
        state.transactions.push(transaction);
    }

    renderTransactions();
    transactionformEl.reset();
    console.log({ state });
};

const showEdit = (id) => {
    console.log("id", id);

    const selectedTransaction = document.getElementById(id);
    const lowerEl = selectedTransaction.querySelector(".lower");

    lowerEl.classList.toggle("showTransaction");
};

const handleUpdate = (id) => {
    const transaction = state.transactions.find((t) => t.id === id);

    const { text, amount } = transaction;
    const textInput = document.getElementById("text");
    const amountInput = document.getElementById("amount");
    textInput.value = text;
    amountInput.value = amount;
    tid = id;
    isUpdate = true;
};

const handleDelete = (id) => {
    const filteredTransaction = state.transactions.filter((t) => t.id !== id);
    state.transactions = filteredTransaction;
    renderTransactions();
};
renderTransactions();
transactionformEl.addEventListener("submit", addTransaction);