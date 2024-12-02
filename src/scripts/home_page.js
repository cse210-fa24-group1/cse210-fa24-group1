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
budgetLimitInput && (budgetLimitInput.value = `$${budgetLimit}`);

// Add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput && textInput.value.trim();
  const category = document.getElementById('category').value; // Get selected category
  let amount = amountInput && parseFloat(amountInput.value.trim());
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
    category,
    amount,
    date: new Date().toLocaleString(),
  };

  transactions.push(transaction);
  updateLocalStorage();
  updateUI();
  form && form.reset();

  // Check budget limit
  checkBudgetLimit();
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100);
}

// Add transaction to DOM with aligned description and amount
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Add classes based on the amount
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // Create the description span and set text
  const descriptionSpan = document.createElement('span');
  descriptionSpan.textContent = transaction.text; // Safely set text content

  // Create the amount span and set text
  const amountSpan = document.createElement('span');
  amountSpan.classList.add('amount-space');
  amountSpan.textContent = `${sign}$${Math.abs(transaction.amount).toFixed(2)}`; // Safely set amount text

  // Create the delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.textContent = 'x';
  deleteButton.onclick = () => removeTransaction(transaction.id); // Set delete button click handler

  // Append elements to the list item
  item.appendChild(descriptionSpan);
  item.appendChild(amountSpan);
  item.appendChild(deleteButton);

  // Append the item to the list
  list && list.appendChild(item);
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  updateUI();
  checkBudgetLimit();
}

/// Update balance
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  // Update the balance text
  balance && (balance.innerText = `$${total}`);

  // Update the balance status (positive or negative)
  if (parseFloat(total) >= 0) {
    balance && balance.classList.remove('negative'); // Remove negative class if balance is positive
    balance && balance.classList.add('positive'); // Add positive class if balance is positive
  } else {
    balance && balance.classList.remove('positive'); // Remove positive class if balance is negative
    balance && balance.classList.add('negative'); // Add negative class if balance is negative
  }

  return parseFloat(total);
}

// Check budget limit
function checkBudgetLimit() {
  const currentTotal = Math.abs(updateValues());
  const budgetWarning = document.getElementById('budget-warning');

  if (currentTotal > budgetLimit) {
    budgetWarning && (budgetWarning.innerText = 'Exceeded the limit.'); // Display the warning message
  } else {
    budgetWarning && (budgetWarning.innerText = ''); // Clear the warning if the limit is not exceeded
  }
}

// Edit budget limit
editBudgetBtn &&
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
  list && (list.innerHTML = '');
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listeners
form && form.addEventListener('submit', addTransaction);

// Initialize app
updateUI();
checkBudgetLimit();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateID,
    addTransaction,
    removeTransaction,
    transactions,
    updateValues,
    updateLocalStorage,
    checkBudgetLimit,
  };
}
