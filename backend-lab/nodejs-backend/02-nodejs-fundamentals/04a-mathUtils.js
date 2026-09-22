// Custom module used by 04-custom-modules.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

module.exports = { add, subtract, multiply, divide };
