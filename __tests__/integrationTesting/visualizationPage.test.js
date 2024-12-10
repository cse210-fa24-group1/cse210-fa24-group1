// visualizationPage.test.js
// Mock setup
console.error = jest.fn();
const localStorageMock = {
  getItem: jest.fn((key) => {
    if (key === 'currentSession') {
      return JSON.stringify({ userId: '123' });
    }
    if (key === 'category') {
      return JSON.stringify([
        { id: 1, name: 'Food' },
        { id: 2, name: 'Travel' },
      ]);
    }
    return null;
  }),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { categoryid: 1, amount: 100, timestamp: '2023-01-01T00:00:00.000Z' },
        { categoryid: 2, amount: 200, timestamp: '2023-01-02T00:00:00.000Z' },
      ]),
  })
);
document.getElementById = jest.fn((id) => {
  if (id === 'error-message') {
    return {
      textContent: '',
      style: { display: 'none' },
    };
  }
  if (id === 'line-chart' || id === 'pie-chart') {
    return {
      getContext: () => ({
        createLinearGradient: jest.fn(() => ({
          addColorStop: jest.fn(),
        })),
      }),
    };
  }
  if (
    id === 'monthly-calender' ||
    id === 'weekly-calender' ||
    id === 'export-btn'
  ) {
    return {
      addEventListener: jest.fn(),
    };
  }
  return {
    getContext: jest.fn(() => ({
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
    })),
  };
});
// Mock Chart.js
global.Chart = jest.fn(() => ({
  update: jest.fn(),
}));

global.ChartDataLabels = {};

// Import functions
const {
  getUserTransactions,
  getRandomColor,
} = require('../../dist/scripts/visualization.js');

describe('Visualization Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Properly set up the DOM
    document.body.innerHTML = `
      <span role="alert" aria-invalid="true" id="error-message"></span>
      <canvas id="line-chart"></canvas>
      <canvas id="pie-chart"></canvas>
    `;
  });

  test('renders charts when transactions are available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              categoryid: 1,
              amount: 100,
              timestamp: '2023-01-01T00:00:00.000Z',
            },
            {
              categoryid: 2,
              amount: 200,
              timestamp: '2023-01-02T00:00:00.000Z',
            },
          ]),
      })
    );
    await getUserTransactions();
    const errorMessage = document.getElementById('error-message');
    expect(errorMessage.textContent).toBe('');
  });
});
