/**
 * @fileoverview Test suite for greeting functionality and DOM manipulation
 * @requires jest
 * @requires ../../src/script
 */

import { sayHello } from '../../src/script';

/**
 * @jest-environment jsdom
 */
describe('Hello World Application Tests', () => {
  /** @type {Function} Original getElementById method */
  let originalGetElementById;

  /** @type {Object} Mock DOM element */
  let mockElement;

  /**
   * Setup before all tests
   * @beforeAll
   * @function
   * @returns {void}
   */
  beforeAll(() => {
    // Store original method
    originalGetElementById = document.getElementById;
  });

  /**
   * Setup before each test
   * @beforeEach
   * @function
   * @returns {void}
   */
  beforeEach(() => {
    // Set up the mock DOM element
    mockElement = { textContent: '' };

    /**
     * Mock implementation of getElementById
     * @type {jest.SpyInstance}
     */
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    /**
     * Mock implementation of addEventListener for DOMContentLoaded
     * @type {jest.SpyInstance}
     */
    jest
      .spyOn(document, 'addEventListener')
      .mockImplementation((event, callback) => {
        if (event === 'DOMContentLoaded') {
          callback(); // Trigger the callback immediately
        }
      });
  });

  /**
   * Cleanup after all tests
   * @afterAll
   * @function
   * @returns {void}
   */
  afterAll(() => {
    // Restore original method
    document.getElementById = originalGetElementById;
  });

  /**
   * Cleanup after each test
   * @afterEach
   * @function
   * @returns {void}
   */
  afterEach(() => {
    // Restore the original implementation
    jest.restoreAllMocks();
  });

  /**
   * Test suite for sayHello function
   * @function
   */
  describe('sayHello Function', () => {
    /**
     * Test case: verify return value
     * @test
     * @function
     * @returns {void}
     */
    test('should return "Hello World"', () => {
      expect(sayHello()).toBe('Hello World');
    });

    /**
     * Test case: verify return type
     * @test
     * @function
     * @returns {void}
     */
    test('should return a string', () => {
      expect(typeof sayHello()).toBe('string');
    });

    /**
     * Test case: verify non-empty return value
     * @test
     * @function
     * @returns {void}
     */
    test('should not return empty string', () => {
      expect(sayHello()).not.toBe('');
    });
  });

  /**
   * Test suite for DOM integration
   * @function
   */
  describe('DOM Integration', () => {
    /**
     * Test case: verify error handling for missing DOM element
     * @test
     * @function
     * @returns {void}
     */
    test('should handle missing DOM element gracefully', () => {
      // Mock getElementById to return null (element not found)
      document.getElementById = jest.fn(() => null);

      // This should not throw an error
      expect(() => {
        require('../../src/script');
      }).not.toThrow();
    });
  });

  /**
   * Test suite for HTML structure
   * @function
   */
  describe('HTML Structure', () => {
    /**
     * Test case: verify message div exists
     * @test
     * @function
     * @returns {void}
     */
    test('should have message div in document', () => {
      const messageDiv = document.querySelector('#message');
      expect(messageDiv).not.toBeNull();
    });

    /**
     * Test case: verify initial state of message div
     * @test
     * @function
     * @returns {void}
     */
    test('message div should be empty initially', () => {
      const messageDiv = document.querySelector('#message');
      expect(messageDiv.textContent).toBe('');
    });
  });
});
