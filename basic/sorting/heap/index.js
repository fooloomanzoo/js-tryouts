const { performance } = require('perf_hooks');
const heapsort = require('./heapsort.js');
const heapsort2 = require('./heapsort2.js');
const heapsort3 = require('./heapsort3.js');

function initTests() {
  let tests = [];
  tests.push([]);
  tests.push([-1, -3]);
  tests.push([1, 3, 2, 1, 6, 8, 4, 1, 2]);
  tests.push([2147483640]);
  tests.push([1, 2, 3]);
  tests.push([]);
  for (var i = 10000; i > -10000; i--) {
    tests[5].push(i);
  }
  tests.push([]);
  for (var i = 0; i < 100000; i++) {
    tests[6].push(Math.round(Math.random() * 100000));
  }
  return tests;
}

function isSorted(A) {
  for (let i = 0; i < A.length - 1; i++) {
    if (A[i] > A[i+1]) {
      console.log(`Failed at [${i}]: ${A[i]}, [${i+1}]: ${A[i+1]}`);
      return false;
    }
  }
  return true;
}

function test_run(tests, fn, msg) {
  console.log(msg || '');
  for (let i = 0; i < tests.length; i++) {
    let timestampStarted = performance.now();
    // console.log(tests[i]);
    const result = fn(tests[i]);
    let processedTime = performance.now() - timestampStarted;
    console.log(`TEST${i+1}' ${isSorted(result) ? 'success' : 'failed'} ${processedTime}ms`);
    // console.log(result);
  }
}

let tests = initTests();
test_run(tests, heapsort, '-----------------------------------');
tests = initTests();
test_run(tests, heapsort2, '-----------------------------------');
tests = initTests();
test_run(tests, heapsort3, '-----------------------------------');
