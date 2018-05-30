function debounce(func, wait) {
  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (!timeout) func.apply(this, args);
  };
}

module.exports = debounce;
