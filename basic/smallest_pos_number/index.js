const test = [1, 3, 6, 4, 1, 2];
const test2 = [-1, -3];

function solution(A) {
    if (!(A && A.length)) return 1;

    let i = 0;
    let min = 1;
    let count = 0;
    while (i < A.length) {
      // console.log(i, min);
      count++;
      if (min === A[i]) {
        min++;
        i = 0;
      } else if (A[i] > min) {
        // min++;
      } else {
        // i = 0;
      }
      i++;
    }
    // console.log(count/A.length, min);
    return min;
}

let test3 = [];
for (var i = 100; i > -100; i--) {
  test3.push(i);
}
// console.log(solution(test));
// console.log(solution(test2));
console.log(solution(test3));
