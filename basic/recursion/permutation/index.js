const { performance } = require('perf_hooks');

function solution(A, B) {
  let S = [];
  permute(A, B, '', S);
  return S[0];
}

function permute(A, B, s, S) {
  if (A === 0 && B === 0) {
    S.push(s);
    return;
  }
  if (S.length > 0) {
    return;
  }
  if (s.length < 2 || (s[s.length - 1] !== s[s.length - 2])) {
    if (A > 0) {
      permute(A-1, B, s + 'a', S);
    }
    if (B > 0) {
      permute(A, B-1, s + 'b', S);
    }
  } else if (s[s.length - 1] === s[s.length - 2]) {
    if (s[s.length - 1] === 'b' && A > 0) {
      permute(A-1, B, s + 'a', S);
    } else if (s[s.length - 1] === 'a' && B > 0) {
      permute(A, B-1, s + 'b', S);
    }
  }
}

function run(A, B, fn) {
  console.log(`${A}-times 'a' and ${B}-times 'b', no triplets and one solution`);
  const timestampStarted = performance.now();
  const result = fn(A, B);
  const processedTime = performance.now() - timestampStarted;
  console.log(`${processedTime}ms ${result}`);
}

run(10, 8, solution);
run(5, 3, solution);
