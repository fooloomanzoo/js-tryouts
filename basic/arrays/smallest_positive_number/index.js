const { performance } = require('perf_hooks');

const test1 = [1, 3, 6, 4, 1, 2], sol1 = 5;
const test2 = [-1, -3], sol2 = 1;
let test3 = [];
for (var i = 100000; i > -10000; i--) {
  test3.push(i);
}
const sol3 = 100001;

function solutionA(A) {
    if (!(A && A.length)) return 1;
    const B = Array.from(A);
    // console.log(B);
    let i = 0;
    let min = 1;
    while (i < B.length) {
      if (B[i] === min) {
        min++;
        B.splice(i, 1);
        i = 0;
      } else if (B[i] < min) {
        B.splice(i, 1);
      } else {
        i++;
      }
    }
    return min;
}

function solutionB(A) {
    if (!(A && A.length)) return 1;

    let i = 0;
    let min = 1;
    while (i < A.length) {
      if (A[i] === min) {
        min++;
        i = 0;
      } else {
        i++;
      }
    }
    return min;
}

function solutionC(A) {
    if (!(A && A.length)) return 1;

    let max = 0;
    let map = {};

    for (let i = 0; i < A.length; i++) {
      if (A[i] > 0) {
        map[A[i]] = true;
        if (max < A[i]) {
          max = A[i];
        }
      }
    }
    for (var i = 1; i < max; i++) {
      if (!map[i])
        return i;
    }
    return max + 1;
}

function test_run(fn, msg) {
  console.log(msg);
  let timestampStarted = performance.now();
  const t1 = fn(test1);
  console.log('TEST1', t1 === sol1 ? 'success' : 'failed', performance.now() - timestampStarted, 'ms');

  timestampStarted = performance.now();
  const t2 = fn(test2);
  console.log('TEST2', t2 === sol2 ? 'success' : 'failed', performance.now() - timestampStarted, 'ms');

  timestampStarted = performance.now();
  const t3 = fn(test3);
  console.log('TEST3', t3 === sol3 ? 'success' : 'failed',t3, performance.now() - timestampStarted, 'ms');
}

test_run(solutionA, '#### A ####');
test_run(solutionB, '#### B ####');
test_run(solutionC, '#### C ####');
