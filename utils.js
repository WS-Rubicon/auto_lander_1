/**
 * Adds two numbers together
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
function addNumbers(a, b) {
    return a + b;
}

// Export for use in Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addNumbers };
}

// Also make available globally for browser environments
if (typeof window !== 'undefined') {
    window.addNumbers = addNumbers;
}