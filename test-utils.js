// Simple test for the addNumbers function
const { addNumbers } = require('./utils.js');

// Test cases
const tests = [
    { a: 2, b: 3, expected: 5, description: 'adds positive numbers' },
    { a: -1, b: 1, expected: 0, description: 'adds negative and positive' },
    { a: 0, b: 0, expected: 0, description: 'adds zeros' },
    { a: 1.5, b: 2.5, expected: 4, description: 'adds decimal numbers' },
    { a: -5, b: -3, expected: -8, description: 'adds negative numbers' }
];

console.log('Testing addNumbers function...\n');

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
    const result = addNumbers(test.a, test.b);
    const success = result === test.expected;
    
    console.log(`Test ${index + 1}: ${test.description}`);
    console.log(`  Input: ${test.a} + ${test.b}`);
    console.log(`  Expected: ${test.expected}, Got: ${result}`);
    console.log(`  Status: ${success ? 'PASS' : 'FAIL'}\n`);
    
    if (success) {
        passed++;
    } else {
        failed++;
    }
});

console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('All tests passed! ✅');
    process.exit(0);
} else {
    console.log('Some tests failed! ❌');
    process.exit(1);
}