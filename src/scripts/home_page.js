const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const budgetLimitInput = document.getElementById('budget-limit');
const editBudgetBtn = document.getElementById('edit-budget');

// Fetch transactions from localStorage or initialize empty
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgetLimit = parseFloat(localStorage.getItem('budgetLimit')) || 10000;

// Update budget limit display
budgetLimitInput.value = `$${budgetLimit}`;

// Add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const category = document.getElementById('category').value; // Get selected category
  let amount = parseFloat(amountInput.value.trim());
  const type = e.submitter.dataset.type;

  // Adjust amount based on transaction type
  amount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

  if (text === '' || isNaN(amount)) {
    alert('Please enter a valid description and amount.');
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    category, // Add the category to the transaction
    amount,
    date: new Date().toLocaleString(),
  };

  transactions.push(transaction);
  updateLocalStorage();
  updateUI();
  form.reset();

  // Check budget limit
  checkBudgetLimit();
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM with aligned description and amount
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
        <span>${transaction.text}</span> <!-- Description -->
        <span class="amount-space">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span> <!-- Amount -->
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
  list.appendChild(item);
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  updateUI();
  checkBudgetLimit();
}

// Update balance
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  balance.innerText = `$${total}`;
  return parseFloat(total);
}

// Check budget limit
function checkBudgetLimit() {
  const currentTotal = Math.abs(updateValues());
  const budgetWarning = document.getElementById('budget-warning');

  if (currentTotal > budgetLimit) {
    budgetWarning.innerText = 'Exceeded the limit!'; // Display the warning message
  } else {
    budgetWarning.innerText = ''; // Clear the warning if the limit is not exceeded
  }
}

// Edit budget limit
editBudgetBtn.addEventListener('click', () => {
  const newLimit = prompt('Enter new budget limit:', budgetLimit);
  if (newLimit !== null) {
    budgetLimit = parseFloat(newLimit);
    budgetLimitInput.value = `$${budgetLimit}`;
    localStorage.setItem('budgetLimit', budgetLimit);
    checkBudgetLimit();
  }
});

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize UI
function updateUI() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listeners
form.addEventListener('submit', addTransaction);

// Initialize app
updateUI();
checkBudgetLimit();
