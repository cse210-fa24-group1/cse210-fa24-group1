import { sayHello } from '../../src/script';

describe('Hello World Application Tests', () => {
    let originalGetElementById;
    let mockElement;

    beforeAll(() => {
        // Store original method
        originalGetElementById = document.getElementById;
    });

    beforeEach(() => {
        // Set up the mock DOM element
        mockElement = { textContent: '' };
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

        // Mock addEventListener for DOMContentLoaded
        jest.spyOn(document, 'addEventListener').mockImplementation((event, callback) => {
            if (event === "DOMContentLoaded") {
                callback(); // Trigger the callback immediately
            }
        });
    });

    afterAll(() => {
        // Restore original method
        document.getElementById = originalGetElementById;
    });

    afterEach(() => {
        // Restore the original implementation
        jest.restoreAllMocks();
    });

    describe('sayHello Function', () => {
        test('should return "Hello World"', () => {
            expect(sayHello()).toBe('Hello World');
        });

        test('should return a string', () => {
            expect(typeof sayHello()).toBe('string');
        });

        test('should not return empty string', () => {
            expect(sayHello()).not.toBe('');
        });
    });

    describe('DOM Integration', () => {
        test('should handle missing DOM element gracefully', () => {
            // Mock getElementById to return null (element not found)
            document.getElementById = jest.fn(() => null);
            
            // This should not throw an error
            expect(() => {
                require('../../src/script');
            }).not.toThrow();
        });
    });

    describe('HTML Structure', () => {
        test('should have message div in document', () => {
            const messageDiv = document.querySelector('#message');
            expect(messageDiv).not.toBeNull();
        });

        test('message div should be empty initially', () => {
            const messageDiv = document.querySelector('#message');
            expect(messageDiv.textContent).toBe('');
        });
    });
});