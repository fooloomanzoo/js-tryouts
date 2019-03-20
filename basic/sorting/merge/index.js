const { performance } = require('perf_hooks');
const mergesort = require('./mergesort.js');
const mergesort2 = require('./mergesort-splice.js');
const mergesort3 = require('./mergesort-splice-min.js');

function initTests() {
  let tests = [];
  tests.push([]);
  tests.push([-1, -3]);
  tests.push([1, 3, 6, 4, 1, 2]);
  tests.push([2147483640]);
  tests.push([]);
  for (var i = 10000; i > -10000; i--) {
    tests[4].push(i);
  }
  tests.push([]);
  for (var i = 0; i < 100000; i++) {
    tests[5].push(Math.round(Math.random() * 100000));
  }
  return tests;
}

function isSorted(A) {
  for (var i = 0; i < A.length - 1; i++) {
    if (A[i] > A[i+1]) {
      return false;
    }
  }
  return true;
}

function test_run(tests, fn, msg) {
  console.log(msg || '');
  for (var i = 0; i < tests.length; i++) {
    let timestampStarted = performance.now();
    const result = fn(tests[i]);
    let processedTime = performance.now() - timestampStarted;
    console.log(`TEST${i+1}' ${isSorted(result) ? 'success' : 'failed'} ${processedTime}ms`);
    // console.log(result);
  }
}

let tests = initTests();
test_run(tests, mergesort, '-----------------------------------');
tests = initTests();
test_run(tests, mergesort2, '-----------------------------------');
tests = initTests();
test_run(tests, mergesort3, '-----------------------------------');
