let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let initialBalance = parseFloat(localStorage.getItem('initialBalance')) || 0;
let editId = null;

if(!initialBalance){
    initialBalance = parseFloat(prompt("Enter your initial balance:")) || 0;
    localStorage.setItem('initialBalance', initialBalance);
}
console.log(initialBalance)

function renderExpenses() {
    // const list = document.getElementById('expensesList');
    const list = document.getElementById('expensesList');
    list.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;
        
    expenses.forEach((record) => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
        <span>${record.description}(${record.category},${record.type}):${record.amount}</span>
            <span class="expense-actions">
                <button class="edit" onclick= "editExpense(${record.id})">Edit</button>
                <button class="delete" onclick="deleteExpense(${record.id})">Delete</button>
            </span>`
            list.appendChild(li);
            
            if(record.type  ==='income') totalIncome += record.amount;
            else totalExpense += record.amount;
    });
    document.getElementById('totalIncome').textContent = totalIncome;
    document.getElementById('totalExpense').textContent = totalExpense;

    const currentBalance = initialBalance + totalIncome - totalExpense;
    document.getElementById('initialBalance').textContent = initialBalance;
    document.getElementById('currentBalance').textContent = currentBalance;
}

function addExpense(e) {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const desc = document.getElementById('desc').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
        
        if(!desc || amount <= 0){
            alert('please enter valid description and amount.');
            return;
        }
        if(editId) {
            const idx = expenses.findIndex((r) => r.id === editId);
            expenses[idx] = { id: editId,description:desc,amount,category,type};
            editId = null;
            document.getElementById('submitBtn').textContent = 'Add Record';
        } else {
            const record = {
                id: Date.now(),
                description: desc,
                amount,
                category,
                type,
            };
            expenses.push(record);
        }
        localStorage.setItem('expenses',JSON.stringify(expenses));
        renderExpenses();
        document.getElementById('expenseForm').reset();
}

function deleteExpense(id) {
    expenses = expenses.filter((r) => r.id !== id);
    localStorage.setItem('expenses',JSON.stringify(expenses));
    renderExpenses();
}

function editExpense(id) {
        const record = expenses.find((r) => r.id ===id);
        document.getElementById('type').value = record.type;
        document.getElementById('desc').value = record.description;
        document.getElementById('amount').value = record.amount;
        document.getElementById('category').value = record.category;
        editId = id;
        document.getElementById('submitBtn').textContent = 'update Record';
}

document.getElementById('expenseForm').addEventListener('submit', addExpense);

document.addEventListener('DOMContentLoaded', renderExpenses);