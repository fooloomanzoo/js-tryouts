const { performance } = require('perf_hooks');

let counter = 0, called = 0;
const timestampStarted = performance.now();

async function unexpected() {
  called++;
  const randomDelay1 = Math.floor(Math.random() * 1000 * 2);
  const randomDelay2 = Math.floor(Math.random() * 1000 * 2);

  try {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(`Everything OK`), randomDelay1);
      setTimeout(() => reject(new Error(`Something went wrong`)), randomDelay2);
    });
    console.log(`${++counter}/${called} | ${result} | delayed ${randomDelay1}ms | waited ${performance.now() - timestampStarted}ms`);
  } catch (error) {
    console.log(`${++counter}/${called} | ${error.message} | delayed ${randomDelay2}ms | waited ${performance.now() - timestampStarted}ms`);
  }
}

module.exports = unexpected;
