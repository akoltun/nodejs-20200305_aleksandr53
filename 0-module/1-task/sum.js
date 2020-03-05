const isNumber = n => typeof n === "number" && !isNaN(n);

function sum(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new TypeError();
  }
  return a + b;
}

module.exports = sum;
