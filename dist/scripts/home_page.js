// DOM Elements
const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const budgetLimitInput = document.getElementById('budget-limit');
const editBudgetBtn = document.getElementById('edit-budget');

async function fetchInitialBudgetLimit() {
  const currentSession = JSON.parse(localStorage.getItem('currentSession'));

  if (!currentSession?.userId) {
    console.error('No user session found');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${currentSession.userId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    if (userData?.budgetLimit) {
      budgetLimit = userData.budgetLimit; // Set the server's budget limit
      budgetLimitInput.value = `$${budgetLimit}`;
    } else {
      // Fallback if no data is returned
      budgetLimitInput.value = `$${budgetLimit}`;
    }
  } catch (error) {
    console.error('Error fetching budget limit from server:', error.message);
    budgetLimitInput.value = `$200`;
  }

  budgetLimitInput.disabled = true;
}

// Transaction categories
const categoriesData = [
  { id: 1, name: 'Food' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Rent' },
  { id: 4, name: 'Leisure' },
  { id: 5, name: 'Misc' },
  { id: 6, name: 'Credit' },
];

// Global transactions variable
let transactions = [];

/**
 * Fetch all transactions for the current session from the API.
 * @returns {Promise<Array>} List of transactions.
 */
async function getAllTransactions() {
  const currentSession = JSON.parse(localStorage.getItem('currentSession'));
  try {
    const response = await fetch(
      `http://localhost:3000/api/transactions/${currentSession.userId}`
    );
    return (await response.json()) || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Save a new transaction to the database.
 * @param {number} userid - User ID.
 * @param {boolean} isExpense - Is the transaction an expense.
 * @param {number} amount - Transaction amount.
 * @param {number} categoryid - Category ID.
 * @param {string} description - Transaction description.
 */
async function saveTransactionToDB(
  userid,
  isExpense,
  amount,
  categoryid,
  description
) {
  await fetch('http://localhost:3000/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userid,
      isExpense,
      amount,
      categoryid,
      description,
    }),
  });
  await updateUI();
}

/**
 * Add a new transaction via form submission.
 * @param {Event} e - Form submit event.
 */
async function addTransaction(e) {
  e.preventDefault();
  const category = document.getElementById('category').value;
  const text = document.getElementById('text').value.trim();
  let amount = parseFloat(document.getElementById('amount').value.trim());
  const type = e.submitter.dataset.type; // 'expense' or 'income'
  const isExpense = type === 'expense';

  // Find category ID
  const categoryObj = categoriesData.find(
    (cat) => cat.name.toLowerCase() === category.toLowerCase()
  );
  const categoryId = categoryObj ? categoryObj.id : null;

  // Validate inputs
  if (text === '' || isNaN(amount)) {
    alert('Please enter a valid description and amount.');
    return;
  }

  const currentSession = JSON.parse(localStorage.getItem('currentSession'));
  saveTransactionToDB(
    currentSession.userId,
    isExpense,
    amount,
    categoryId,
    text
  );
  form && form.reset();
}

/**
 * Remove a transaction by ID (UI + Database).
 * @param {number} transactionId - Transaction ID.
 */
function removeTransaction(transactionId) {
  deleteTransaction(transactionId);
}

/**
 * Delete a transaction from the database.
 * @param {number} transactionId - Transaction ID.
 */
async function deleteTransaction(transactionId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/transactions/${transactionId}`,
      { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete transaction');
    }

    await updateUI();
    setTimeout(() => {
      alert(`Transaction with ID ${transactionId} deleted successfully!`);
    }, 200);
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    alert(`Failed to delete transaction: ${error.message}`);
  }
}

/**
 * Add a transaction to the DOM.
 * @param {Object} transaction - Transaction object.
 */
function addTransactionDOM(transaction) {
  const sign = transaction.isExpense ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.isExpense ? 'minus' : 'plus');

  // Create transaction description
  const descriptionSpan = document.createElement('span');
  descriptionSpan.classList.add('description-space');
  descriptionSpan.textContent = transaction.description;

  // Create transaction amount
  const amountSpan = document.createElement('span');
  amountSpan.classList.add('amount-space');
  amountSpan.textContent = `${sign}$${transaction.amount}`;

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.textContent = 'x';
  deleteButton.onclick = () => removeTransaction(transaction.transactionid);

  // Append elements to the item
  item.appendChild(descriptionSpan);
  item.appendChild(amountSpan);
  item.appendChild(deleteButton);

  // Add to the list
  list && list.appendChild(item);
}

/**
 * Update balance and apply budget warning if needed.
 */
async function updateValues() {
  const amounts = transactions.map((txn) =>
    txn.isExpense ? -txn.amount : txn.amount
  );
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  // Update balance text
  balance && (balance.innerText = `$${total}`);

  // Update balance class
  if (parseFloat(total) >= 0) {
    balance && balance.classList.add('positive');
    balance && balance.classList.remove('negative');
  } else {
    balance && balance.classList.add('negative');
    balance && balance.classList.remove('positive');
  }

  return parseFloat(total);
}

/**
 * Check if the current balance exceeds the budget limit.
 */
async function checkBudgetLimit() {
  const currentTotal = await updateValues();
  const budgetWarning = document.getElementById('budget-warning');
  const currentSession = JSON.parse(localStorage.getItem('currentSession'));

  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${currentSession.userId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    if (userData?.budgetLimit) {
      budgetLimit = userData.budgetLimit;
    }

    if (Math.abs(currentTotal) > budgetLimit && currentTotal < 0) {
      budgetWarning && (budgetWarning.innerText = 'Exceeded the limit :(');
    } else {
      budgetWarning && (budgetWarning.innerText = '');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// /**
//  * Edit the budget limit via user input.
//  */
// editBudgetBtn &&
// editBudgetBtn.addEventListener('click', async () => {
//   const newLimit = prompt('Enter new budget limit:', budgetLimit);
//   const currentSession = JSON.parse(localStorage.getItem('currentSession'));
//   if (newLimit !== null) {
//     const parsedLimit = parseFloat(newLimit);

//     if (isNaN(parsedLimit)) {
//       alert('Please enter a valid number');
//       return;
//     }

//     try {
//       // Update budget limit via server API
//       const response = await fetch('http://localhost:3000/api/users/budget', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userid: currentSession.userId, // Replace with the actual user ID
//           budgetLimit: parsedLimit,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update budget limit');
//       }

//       const result = await response.json();
//       console.log('Budget limit updated:', result);

//       budgetLimit = parsedLimit;
//       budgetLimitInput.value = `$${budgetLimit}`;
//       localStorage.setItem('budgetLimit', budgetLimit);
//       checkBudgetLimit();
//     } catch (error) {
//       console.error('Error:', error.message);
//       alert('Failed to save budget limit.');
//     }
//   }
// });

async function handleBudgetLimitChange() {
  const currentSession = JSON.parse(localStorage.getItem('currentSession'));
  const newLimit = parseFloat(budgetLimitInput.value.replace(/[$,]/g, ''));

  if (isNaN(newLimit)) {
    alert('Invalid budget limit value');
    budgetLimitInput.value = `$${budgetLimit}`;
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/budget', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: currentSession.userId,
        budgetLimit: newLimit,
      }),
    });

    if (!response.ok) throw new Error('Server issue');
    const result = await response.json();
    console.log('Budget limit updated:', result);

    budgetLimit = newLimit;
    localStorage.setItem('budgetLimit', budgetLimit);
  } catch (error) {
    console.error('Error saving new budget limit:', error.message);
    alert('Failed to save changes!');
  }
}

/**
 * Enter edit mode on click
 */
editBudgetBtn &&
  editBudgetBtn.addEventListener('click', () => {
    const isEditingBudgetLimit = !budgetLimitInput.disabled;

    if (isEditingBudgetLimit) {
      budgetLimitInput.disabled = true;
      editBudgetBtn.textContent = 'Edit Budget Limit';
    } else {
      budgetLimitInput.disabled = false;
      budgetLimitInput.focus();
      editBudgetBtn.textContent = 'Save Changes';
    }
  });

// Handle when user leaves the input field after editing
budgetLimitInput &&
  budgetLimitInput.addEventListener('blur', async () => {
    if (budgetLimitInput.disabled)
      return; // Exit if already disabled
    else {
      await handleBudgetLimitChange();
      budgetLimitInput.disabled = true;
      editBudgetBtn.textContent = 'Edit Budget Limit';
    }
  });

/**
 * Initialize the UI by loading transactions and updating values.
 */
async function updateUI() {
  list && (list.innerHTML = '');
  transactions = await getAllTransactions();
  transactions.forEach(addTransactionDOM);
  await checkBudgetLimit();
}

// Event listener for form submission
form && form.addEventListener('submit', addTransaction);

// Initialize the application
updateUI();
fetchInitialBudgetLimit();

// Export functions for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchInitialBudgetLimit,
    addTransaction,
    removeTransaction,
    saveTransactionToDB,
    addTransactionDOM,
    updateValues,
    checkBudgetLimit,
    deleteTransaction,
    updateUI,
  };
}
