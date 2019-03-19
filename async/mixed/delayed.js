const { performance } = require('perf_hooks');

module.exports = async function(delay) {
  const timestampStarted = performance.now();
  return await new Promise((resolve) => {
    setTimeout(() => resolve(performance.now() - timestampStarted), delay);
  });
}
