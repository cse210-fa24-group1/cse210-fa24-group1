/**
 * @fileoverview Setup file for Jest tests to initialize DOM environment
 * @requires jest
 */

/**
 * Setup function to create DOM structure before each test
 * @function
 * @returns {void}
 */
beforeEach(() => {
  document.body.innerHTML = `
      <div id="message"></div>
    `;
});
