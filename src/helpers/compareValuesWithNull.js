function compareValuesWithNull(a, b) {
  if (a === null) return 1;
  if (b === null) return -1;
  if (a < b) return 1;
  return a > b ? -1 : 0;
}

module.exports = compareValuesWithNull;
