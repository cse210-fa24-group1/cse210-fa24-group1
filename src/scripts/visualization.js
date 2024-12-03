// //SCRIPT FOR VISUALIZATION PAGE

//set sample data in local storage
// const transactionsData = [
//   {
//     transactionId: 1,
//     isExpense: true,
//     amount: 50,
//     categoryid: 1,
//     timestamp: '1638797400000',
//   },
//   {
//     transactionId: 2,
//     isExpense: false,
//     amount: 100,
//     categoryid: 2,
//     timestamp: '1638883800000',
//   },
//   {
//     transactionId: 3,
//     isExpense: true,
//     amount: 25,
//     categoryid: 1,
//     timestamp: '1638970200000',
//   },
//   {
//     transactionId: 4,
//     isExpense: true,
//     amount: 150,
//     categoryid: 3,
//     timestamp: '1639056600000',
//   },
//   {
//     transactionId: 5,
//     isExpense: true,
//     amount: 80,
//     categoryid: 5,
//     timestamp: '1639143000000',
//   },
//   {
//     transactionId: 6,
//     isExpense: true,
//     amount: 100,
//     categoryid: 1,
//     timestamp: '1635750000000',
//   },
//   {
//     transactionId: 7,
//     isExpense: true,
//     amount: 80,
//     categoryid: 2,
//     timestamp: '1636268400000',
//   },
//   {
//     transactionId: 8,
//     isExpense: true,
//     amount: 20,
//     categoryid: 4,
//     timestamp: '1636268400000',
//   },
//   {
//     transactionId: 9,
//     isExpense: true,
//     amount: 10,
//     categoryid: 5,
//     timestamp: '1636444800000',
//   },
//   {
//     transactionId: 10,
//     isExpense: true,
//     amount: 50,
//     categoryid: 5,
//     timestamp: '1636444800000',
//   },
// ];
// localStorage.setItem('transactions', JSON.stringify(transactionsData));
function getUserTransactions() {
  // Retrieve the current user session
  const currentSession = JSON.parse(localStorage.getItem('currentSession'));
  if (!currentSession || !currentSession.username) {
    alert('No active user session found. Please log in.');
    window.location.href = './login-page.html';
    return [];
  }

  // Retrieve all users
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Find the current user
  const currentUser = users.find(
    (user) => user.username === currentSession.username
  );

  // If user found, return their transactions (or an empty array if no transactions)
  return currentUser ? currentUser.transactions || [] : [];
}

const categoriesData = [
  { id: 1, name: 'Food' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Rent' },
  { id: 4, name: 'Leisure' },
  { id: 5, name: 'Misc' },
  { id: 6, name: 'Credit' },
];
localStorage.setItem('category', JSON.stringify(categoriesData));

// Get data from local storage
const transactions = getUserTransactions();
const categories = JSON.parse(localStorage.getItem('category')) || [];

// Prepare data for the line chart (amount vs timestamp)
const transactionsByCategory = {};
categories.forEach((category) => {
  transactionsByCategory[category.id] = [];
});

// Group transactions by categoryId
transactions.forEach((transaction) => {
  const categoryId = transaction.categoryid;
  const amount = transaction.amount;
  const timestamp = new Date(Number(transaction.timestamp));
  transactionsByCategory[categoryId].push({ timestamp, amount });
});

// Sort transactions for each category by timestamp
Object.keys(transactionsByCategory).forEach((categoryId) => {
  transactionsByCategory[categoryId].sort((a, b) => a.timestamp - b.timestamp);
});

// Prepare the line chart data
const lineChartLabels = [
  ...new Set(
    transactions.flatMap((t) =>
      new Date(Number(t.timestamp)).toLocaleDateString()
    )
  ),
]; // Unique dates
const lineChartDatasets = categories.map((category) => {
  const categoryTransactions = transactionsByCategory[category.id];
  const amounts = lineChartLabels.map((date) => {
    const transaction = categoryTransactions.find(
      (t) => t.timestamp.toLocaleDateString() === date
    );
    return transaction ? transaction.amount : 0;
  });

  return {
    label: category.name,
    data: amounts,
    fill: false,
    borderColor: getRandomColor(),
    tension: 0.1,
  };
});

// Set up the line chart
const lineChartCtx = document.getElementById('line-chart').getContext('2d');
// eslint-disable-next-line no-undef, no-unused-vars
const lineChart = new Chart(lineChartCtx, {
  type: 'line',
  data: {
    labels: lineChartLabels,
    datasets: lineChartDatasets,
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Expense Timeline by Category',
        font: {
          size: 20,
          weight: 'bold',
          family: 'Arial',
        },
        color: '#333',
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date (MM/DD/YYYY)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
  },
});

// Function to generate a random color for line chart
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Prepare data for the pie chart (category-wise spending distribution)
const categorySpending = {};
transactions.forEach((transaction) => {
  const categoryId = transaction.categoryid;
  const amount = transaction.amount;
  if (categorySpending[categoryId]) {
    categorySpending[categoryId] += amount;
  } else {
    categorySpending[categoryId] = amount;
  }
});

// Map category spending data to categories
const pieChartLabels = [];
const pieChartData = [];
const pieChartBackgroundColors = [];
categories.forEach((category) => {
  const categoryId = category.id;
  if (categorySpending[categoryId]) {
    pieChartLabels.push(category.name);
    pieChartData.push(categorySpending[categoryId]);
    pieChartBackgroundColors.push(getRandomColor());
  }
});

// Set up the pie chart
const pieChartCtx = document.getElementById('pie-chart').getContext('2d');
// eslint-disable-next-line no-undef, no-unused-vars
const pieChart = new Chart(pieChartCtx, {
  type: 'pie',
  data: {
    labels: pieChartLabels,
    datasets: [
      {
        data: pieChartData,
        backgroundColor: pieChartBackgroundColors,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Spending Distribution by Category',
        font: {
          size: 20,
          weight: 'bold',
          family: 'Arial',
        },
        color: '#333',
        padding: { top: 10, bottom: 20 },
      },
      datalabels: {
        formatter: function (value, context) {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
        color: '#ffffff',
        font: {
          size: 14,
          weight: 'bold',
        },
        anchor: 'center',
        align: 'center',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [ChartDataLabels],
});

// get the selected month's data and update the charts accordingly
function getMonthData(monthInput) {
  // if there is no month input aka user selected "clear", return the total data
  if (!monthInput) {
    lineChart.data.labels = lineChartLabels;
    lineChart.data.datasets = lineChartDatasets;
    lineChart.update();

    pieChart.data.labels = pieChartLabels;
    pieChart.data.datasets[0].data = pieChartData;
    pieChart.data.datasets[0].backgroundColor = pieChartBackgroundColors;
    pieChart.update();
    return;
  }

  // get the selected year and month
  const currentYear = monthInput.substring(0, 4);
  const currentMonth = monthInput.substring(5);

  // get the selected month's labels for the line chart
  const newLineChartLabels = lineChartLabels.filter(
    (date) =>
      date.substring(5) === currentYear && date.substring(0, 2) === currentMonth
  );

  // get the selected month's datasets for the line chart
  const newLineChartDatasets = categories.map((category) => {
    const categoryTransactions = transactionsByCategory[category.id];
    const amounts = newLineChartLabels.map((date) => {
      const transaction = categoryTransactions.find(
        (t) => t.timestamp.toLocaleDateString() === date
      );
      return transaction ? transaction.amount : 0;
    });

    return {
      label: category.name,
      data: amounts,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    };
  });

  // update the line chart to the selected month's data
  lineChart.data.labels = newLineChartLabels;
  lineChart.data.datasets = newLineChartDatasets;
  lineChart.update();

  // helper function to filter through transactions for data concerning the selected moneth
  function checkDate(t) {
    const currentDate = new Date(Number(t.timestamp)).toLocaleDateString();
    return (
      currentDate.substring(5) === currentYear &&
      currentDate.substring(0, 2) === currentMonth
    );
  }
  // get selected month transactions
  const newTransactions = transactions.filter((t) => checkDate(t));

  // get the selected month's category spending for the pie chart
  const newCategorySpending = {};
  newTransactions.forEach((transaction) => {
    const categoryId = transaction.categoryid;
    const amount = transaction.amount;
    if (newCategorySpending[categoryId]) {
      newCategorySpending[categoryId] += amount;
    } else {
      newCategorySpending[categoryId] = amount;
    }
  });

  // get the selected month's labels, datasets, and background colors for the pie chart
  const newPieChartLabels = [];
  const newPieChartData = [];
  const newPieChartBackgroundColors = [];
  categories.forEach((category) => {
    const categoryId = category.id;
    if (newCategorySpending[categoryId]) {
      newPieChartLabels.push(category.name);
      newPieChartData.push(newCategorySpending[categoryId]);
      newPieChartBackgroundColors.push(getRandomColor());
    }
  });

  // update the pie chart to the selected month's data
  pieChart.data.labels = newPieChartLabels;
  pieChart.data.datasets[0].data = newPieChartData;
  pieChart.data.datasets[0].backgroundColor = newPieChartBackgroundColors;
  pieChart.update();
}

// Get selected month
var monthChange = document.getElementById('monthly-calender');
monthChange.addEventListener('change', function (event) {
  // update both charts to reflect the selected month's data
  getMonthData(event.currentTarget.value);
});

function getStartOfISOWeek(weekInput) {
  const [year, week] = weekInput.split('-W').map(Number);
  const jan4 = new Date(year, 0, 4); // January 4th is always in the first ISO week
  const startOfISOYear = new Date(
    jan4.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7))
  ); // Adjust to Monday
  return new Date(
    startOfISOYear.setDate(startOfISOYear.getDate() + (week - 1) * 7)
  ); // Add weeks
}

function getWeekData(weekInput) {
  if (!weekInput) {
    lineChart.data.labels = lineChartLabels;
    lineChart.data.datasets = lineChartDatasets;
    lineChart.update();

    pieChart.data.labels = pieChartLabels;
    pieChart.data.datasets[0].data = pieChartData;
    pieChart.data.datasets[0].backgroundColor = pieChartBackgroundColors;
    pieChart.update();
    return;
  }
  // Calculate the start and end dates of the selected week
  const startOfWeek = getStartOfISOWeek(weekInput);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Sunday)

  // Filter line chart labels for the selected week
  const newLineChartLabels = lineChartLabels.filter((date) => {
    const currentDate = new Date(date);
    return currentDate >= startOfWeek && currentDate <= endOfWeek;
  });

  // Get the selected week's datasets for the line chart
  const newLineChartDatasets = categories.map((category) => {
    const categoryTransactions = transactionsByCategory[category.id];
    const amounts = newLineChartLabels.map((date) => {
      const transaction = categoryTransactions.find(
        (t) => new Date(Number(t.timestamp)).toLocaleDateString() === date
      );
      return transaction ? transaction.amount : 0;
    });

    return {
      label: category.name,
      data: amounts,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    };
  });

  // Update the line chart to the selected week's data
  lineChart.data.labels = newLineChartLabels;
  lineChart.data.datasets = newLineChartDatasets;
  lineChart.update();

  // Helper function to filter transactions for the selected week
  function checkDate(t) {
    const transactionDate = new Date(Number(t.timestamp));
    return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
  }

  // Get selected week's transactions
  const newTransactions = transactions.filter((t) => checkDate(t));

  // Get the selected week's category spending for the pie chart
  const newCategorySpending = {};
  newTransactions.forEach((transaction) => {
    const categoryId = transaction.categoryid;
    const amount = transaction.amount;
    if (newCategorySpending[categoryId]) {
      newCategorySpending[categoryId] += amount;
    } else {
      newCategorySpending[categoryId] = amount;
    }
  });

  // Get the selected week's labels, datasets, and background colors for the pie chart
  const newPieChartLabels = [];
  const newPieChartData = [];
  const newPieChartBackgroundColors = [];
  categories.forEach((category) => {
    const categoryId = category.id;
    if (newCategorySpending[categoryId]) {
      newPieChartLabels.push(category.name);
      newPieChartData.push(newCategorySpending[categoryId]);
      newPieChartBackgroundColors.push(getRandomColor());
    }
  });

  // Update the pie chart to the selected week's data
  pieChart.data.labels = newPieChartLabels;
  pieChart.data.datasets[0].data = newPieChartData;
  pieChart.data.datasets[0].backgroundColor = newPieChartBackgroundColors;
  pieChart.update();
}

// Get selected week
var weekChange = document.getElementById('weekly-calender');
weekChange.addEventListener('change', function (event) {
  // update both charts to reflect the selected week's data
  getWeekData(event.currentTarget.value);
});

// Print a pdf from the Export button
document.getElementById('export-btn').addEventListener('click', () => {
  try {
    window.print();
  } catch (err) {
    alert('Error: ' + err.message);
  }
});
