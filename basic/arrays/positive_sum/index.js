const test = [-6, -91, 1011, -100, 84, -22, 0, 1, 473];
const test2 = [-1, -3];
let test3 = [];
for (var i = 1000; i > 0; i--) {
  test3.push(i);
}

function solution(A) {
  let sum = 0;
  for (let i = 0; i < A.length; i++) {
    if (A[i] > 0) {
      sum += A[i];
    }
  }
  return sum;
  // return A.reduce((acc, cur) => {
  //   console.log((acc > 0 ? acc : 0), cur);
  //   return (cur > 0 ? cur : 0) + acc
  // }, 0)
}

console.log(solution(test));
console.log(solution(test2));
console.log(solution(test3));
