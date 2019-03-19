const tree = {
  x: 2,
  l: {
    x: 1,
    l: {
      x: 3,
      r: null,
      l: null
    },
    r: null
  },
  r: {
    x: 4,
    l: {
      x: 1,
      l: {
        x: 2,
        r: null,
        l: null
      },
      r: {
        x: 5,
        l: null,
        r: {
          x: 8,
          r: null,
          l: {
            x: 7,
            r: null,
            l: null
          }
        }
      }
    },
    r: {
      x: 1,
      l: null,
      r: {
        x: 5,
        l: null,
        r: {
          x: 8,
          r: null,
          l: {
            x: 7,
            r: null,
            l: null
          }
        }
      }
    }
  }
};

const tree2 = {
  x: 1,
  l: {
    x: 1,
    l: {
      x: 1,
      l: {
        x: 1,
        l: {
          x: 2,
          l: null,
          r: null
        },
        r: null
      },
      r: null
    },
    r: {
      x: 1,
      l: {
        x: 1,
        l: {
          x: 1,
          l: {
            x: 1,
            l: null,
            r: null
          },
          r: null
        },
        r: null
      },
      r: null
    },
  },
  r: null
};

let calls = 0;

// function find(N) {
//   let maxSum = 0, maxLength, path = [];
//   const findLongestPath = function(N, sum, length) {
//     if (N !== null) {
//       sum += N.x;
//       length++;
//       if (N.l === null && N.r === null ) {
//         if (sum > maxSum) {
//           maxSum = sum;
//           if (maxLength === undefined || length < maxLength) {
//             maxLength = length;
//           }
//         }
//         return;
//       }
//       if (N.l !== null) {
//         findLongestPath(N.l, sum, length);
//       }
//       if (N.r !== null) {
//         findLongestPath(N.r, sum, length);
//       }
//     }
//   }
//   findLongestPath(N, 0, 0);
//   console.log(maxLength);
//   return maxSum;
// }



// function find(N) {
//   let ret = {maxSum: 0, length: undefined};
//   ret = findLongestPath(N, 0, 1, ret);
//   return ret;
// }
//
// function findLongestPath(N, sum, length, o) {
//   calls++;
//   if (N === null)
//     return maxSum;
//   sum += N.x;
//
//   if (N.l === null && N.r === null) {
//     console.log(length);
//     if (sum > o.maxSum) {
//       o.maxSum = sum;
//       o.length = length;
//     }
//     return o;
//   }
//   if (N.l !== null) {
//     o = findLongestPath(N.l, sum, length + 1, o);
//   }
//   if (N.r !== null) {
//     o = findLongestPath(N.r, sum, length + 1, o);
//   }
//
//   return o;
// }
//
//
//
// function find(N) {
//   return findLongestPath(N, 0, 0, 0)
// }
//
// function findLongestPath(N, sum, maxSum, length) {
//   if (N === null)
//     return maxSum;
//   sum += N.x;
//   if (N.l !== null) {
//     maxSum = findLongestPath(N.l, sum, maxSum, length);
//   }
//   if (N.r !== null) {
//     maxSum = findLongestPath(N.r, sum, maxSum, length);
//   }
//   if (sum > maxSum) {
//     return sum;
//   }
//   return maxSum;
// }
//
function find(N) {
  return findLongestPath(N, 0, 0);
}

function findLongestPath(N, sum, length, o) {
  if (!o) {
    o = {maxSum: 0, maxSumLength: 0, length: 1};
  }
  if (N !== null) {
    sum += N.x;
    length++;
    if (length > o.length) {
      o.length = length;
    }
    if (sum > o.maxSum) {
      o.maxSum = sum;
      o.maxSumLength = o.length;
    }
    if (N.l !== null) {
      o = findLongestPath(N.l, sum, length, o);
    }
    if (N.r !== null) {
      o = findLongestPath(N.r, sum, length, o);
    }
  }
  console.log(N);
  return o
}

// console.log('max:', find(tree));
console.log('max:', find(tree2));
