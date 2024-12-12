//SCRIPT FOR VISUALIZATION PAGE
/**
 * Fetch all transactions for the current session from the API.
 * @returns {Promise<Array>} List of transactions.
 */
async function getUserTransactions() {
  const currentSession = JSON.parse(localStorage.getItem('currentSession'));
  const errorMessageElement = document.getElementById('error-message');
  try {
    const response = await fetch(
      `http://localhost:3000/api/transactions/${currentSession.userId}`
    );
    const data = await response.json();
    errorMessageElement.style.display = 'none';
    if (data.length === 0) {
      errorMessageElement.textContent = 'No transactions to visualize!';
      errorMessageElement.style.display = 'block';
    }
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    errorMessageElement.textContent = 'Failed to get transactions!';
    errorMessageElement.style.display = 'block';
    return [];
  }
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

// Get data from database
(async () => {
  const transactionsPromise = getUserTransactions(); // returns a Promise
  const transactions = await transactionsPromise; // Wait for the Promise to resolve

  // Get full data as initial data for download
  var downloadData = transactions;
  const noDataMessage = document.getElementById('no-data-message');

  if (transactions.length === 0) {
    // If no transactions are available
    noDataMessage.style.display = 'block'; // Show the message
    document.getElementById('line-chart').style.display = 'none';
    document.getElementById('pie-chart').style.display = 'none';
    return; // Stop further execution
  } else {
    // If there is data, ensure charts are visible
    noDataMessage.style.display = 'none';
    document.getElementById('line-chart').style.display = 'block';
    document.getElementById('pie-chart').style.display = 'block';
  }

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
    const timestamp = new Date(transaction.timestamp);
    transactionsByCategory[categoryId].push({ timestamp, amount });
  });

  // Sort transactions for each category by timestamp
  Object.keys(transactionsByCategory).forEach((categoryId) => {
    transactionsByCategory[categoryId].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  });

  // Replace the existing date label generation with this improved version
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const lineChartLabels = [
    ...new Set(
      sortedTransactions.map((t) => {
        const date = new Date(t.timestamp);
        // Use a consistent date formatting method
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      })
    ),
  ];

  // Modify the line chart datasets generation to match this sorting
  const lineChartDatasets = categories.map((category) => {
    const categoryTransactions = transactionsByCategory[category.id];
    const amounts = lineChartLabels.map((date) => {
      const transaction = categoryTransactions.find(
        (t) => t.timestamp.toISOString().split('T')[0] === date
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
            family: 'Poppins',
          },
          color: '#16423C',
          padding: { top: 10, bottom: 20 },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date (YYYY/MM/DD)',
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

  // Function to filter transactions by date range
  function getDateRangeData(startDate, endDate) {
    if (!startDate || !endDate) {
      // If no dates are selected, reset to original data
      lineChart.data.labels = lineChartLabels;
      lineChart.data.datasets = lineChartDatasets;
      lineChart.update();

      pieChart.data.labels = pieChartLabels;
      pieChart.data.datasets[0].data = pieChartData;
      pieChart.data.datasets[0].backgroundColor = pieChartBackgroundColors;
      pieChart.update();
      return;
    }

    // Convert input dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set end date to end of day

    // Filter transactions within the date range
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.timestamp);
      return transactionDate >= start && transactionDate <= end;
    });

    // Update download data
    downloadData = filteredTransactions;
    // Prepare filtered line chart labels
    const newLineChartLabels = [
      ...new Set(
        filteredTransactions.map((t) =>
          new Date(t.timestamp).toLocaleDateString()
        )
      ),
    ];

    // Prepare filtered line chart datasets
    const newLineChartDatasets = categories.map((category) => {
      const categoryTransactions = filteredTransactions
        .filter((t) => t.categoryid === category.id)
        .map((t) => ({
          timestamp: new Date(t.timestamp),
          amount: t.amount,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

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

    // Update line chart
    lineChart.data.labels = newLineChartLabels;
    lineChart.data.datasets = newLineChartDatasets;
    lineChart.update();

    // Prepare filtered pie chart data
    const newCategorySpending = {};
    filteredTransactions.forEach((transaction) => {
      const categoryId = transaction.categoryid;
      const amount = transaction.amount;
      if (newCategorySpending[categoryId]) {
        newCategorySpending[categoryId] += amount;
      } else {
        newCategorySpending[categoryId] = amount;
      }
    });

    // Prepare pie chart labels and data
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

    // Update pie chart
    pieChart.data.labels = newPieChartLabels;
    pieChart.data.datasets[0].data = newPieChartData;
    pieChart.data.datasets[0].backgroundColor = newPieChartBackgroundColors;
    pieChart.update();
  }

  // Get start and end date inputs
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');

  // Add event listeners to date range inputs
  startDateInput.addEventListener('change', () => {
    getDateRangeData(startDateInput.value, endDateInput.value);
  });

  endDateInput.addEventListener('change', () => {
    getDateRangeData(startDateInput.value, endDateInput.value);
  });

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
            family: 'Poppins',
          },
          color: '#16423C',
          padding: { top: 10, bottom: 20 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const total = context.chart.data.datasets[0].data.reduce(
                (sum, val) => sum + val,
                0
              );
              const amount = parseInt(
                context.formattedValue.replace(/,/g, ''),
                10
              );

              const percentage = ((amount / total) * 100).toFixed(2) + '%';
              // console.log(parseInt(context.formattedValue, 10));

              return `${context.label}: ${percentage}`;
            },
          },
        },
        datalabels: {
          display: false, // Disable static datalabels in favor of tooltips
        },
        datalabels: {
          formatter: function (value, context) {
            const data = context.chart.data.datasets[0].data;
            const total = data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            return null;
          },
          color: '#000000',
          font: {
            size: 14,
            weight: 'bold',
          },
          anchor: 'end',
          align: 'end',
        },
      },
    },
    // eslint-disable-next-line no-undef
    plugins: [ChartDataLabels],
  });

  // Download data from the currently displayed data timeframe
  function downloadDataCSV() {
    console.log('Hi');

    const filename = 'data.csv';
    let csv = 'Category, Amount, Timestamp\n';

    downloadData.forEach((transaction) => {
      const categoryId = transaction.categoryid;
      const amount = transaction.amount;
      const timestamp = new Date(transaction.timestamp);
      const date =
        timestamp.getFullYear().toString() +
        '/' +
        timestamp.getMonth().toString() +
        '/' +
        timestamp.getDate().toString();
      console.log(date);

      const foundEntry = categories.find((item) => item.id === categoryId);
      const categoryName = foundEntry.name;

      const newLine = categoryName + ', ' + amount + ', ' + date;
      csv += newLine;
      csv += '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.download = filename;
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);
  }

  // Download a csv file containing data from clicking on the Export button
  document.getElementById('export-btn').addEventListener('click', () => {
    try {
      downloadDataCSV();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
})();

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getUserTransactions,
    getRandomColor,
  };
}
