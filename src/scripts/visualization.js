// //SCRIPT FOR VISUALIZATION PAGE

//set sample data in local storage
const transactionsData = [
    { 'transactionId': 1, 'isExpense': true, 'amount': 50, 'categoryid': 1, 'timestamp': '1638797400000' },
    { 'transactionId': 2, 'isExpense': false, 'amount': 100, 'categoryid': 2, 'timestamp': '1638883800000' },
    { 'transactionId': 3, 'isExpense': true, 'amount': 25, 'categoryid': 1, 'timestamp': '1638970200000'},
    { 'transactionId': 4, 'isExpense': true, 'amount': 150, 'categoryid': 3, 'timestamp': '1639056600000'},
    { 'transactionId': 5, 'isExpense': true, 'amount': 80, 'categoryid': 5, 'timestamp': '1639143000000'}
];
localStorage.setItem('transactions', JSON.stringify(transactionsData));

const categoriesData = [
    { 'id': 1, 'name': 'Food' },
    { 'id': 2, 'name': 'Travel' },
    { 'id': 3, 'name': 'Rent' },
    { 'id': 4, 'name': 'Leisure' },
    { 'id': 5, 'name': 'Miscellaneous' },
    { 'id': 6, 'name': 'Credit' }
];
localStorage.setItem('category', JSON.stringify(categoriesData));

// Get data from local storage
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const categories = JSON.parse(localStorage.getItem('category')) || [];

// Prepare data for the line chart (amount vs timestamp)
const transactionsByCategory = {}; 
categories.forEach(category => {
    transactionsByCategory[category.id] = [];
});

// Group transactions by categoryId
transactions.forEach(transaction => {
    const categoryId = transaction.categoryid;
    const amount = transaction.amount;
    const timestamp = new Date(Number(transaction.timestamp)); 
    transactionsByCategory[categoryId].push({ timestamp, amount });
});

// Sort transactions for each category by timestamp
Object.keys(transactionsByCategory).forEach(categoryId => {
    transactionsByCategory[categoryId].sort((a, b) => a.timestamp - b.timestamp);
});

// Prepare the line chart data
const lineChartLabels = [...new Set(transactions.flatMap(t => new Date(Number(t.timestamp)).toLocaleDateString()))]; // Unique dates
const lineChartDatasets = categories.map(category => {
    const categoryTransactions = transactionsByCategory[category.id];
    const amounts = lineChartLabels.map(date => {
        const transaction = categoryTransactions.find(t => t.timestamp.toLocaleDateString() === date);
        return transaction ? transaction.amount : 0; 
    });

    return {
        label: category.name,
        data: amounts,
        fill: false,
        borderColor: getRandomColor(), 
        tension: 0.1
    };
});

// Set up the line chart
const lineChartCtx = document.getElementById('line-chart').getContext('2d');
// eslint-disable-next-line no-undef, no-unused-vars
const lineChart = new Chart(lineChartCtx, {
    type: 'line',
    data: {
        labels: lineChartLabels,
        datasets: lineChartDatasets
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
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date (MM/DD/YYYY)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount'
                }
            }
        }
    }
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
transactions.forEach(transaction => {
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
categories.forEach(category => {
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
        datasets: [{
            data: pieChartData,
            backgroundColor: pieChartBackgroundColors
        }]
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
                formatter: function(value, context) {
                    const data = context.chart.data.datasets[0].data;
                    const total = data.reduce((sum, val) => sum + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2) + '%';
                    return percentage;
                },
                color: '#ffffff',
                font: {
                    size: 14,
                    weight: 'bold'
                },
                anchor: 'center', 
                align: 'center', 
            }
        }
    },
    // eslint-disable-next-line no-undef
    plugins: [ChartDataLabels]
});

// Print a pdf from the Export button
document.getElementById('export-btn').addEventListener('click', () => {
    try {
        window.print();
    } catch (err) {
        alert('Error: ' + err.message);  
    }
});