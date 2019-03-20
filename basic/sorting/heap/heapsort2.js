
function sift(A, start, count) {
  let root = start;
  let child = 2 * root + 1;

  while (child < count) {
    if (child + 1 < count && A[child] < A[child + 1]) {
      child++;
    }
    if (A[root] < A[child]) {
      swap(A, root, child);
      root = child;
    } else {
      return;
    }
    child = 2 * root + 1;
  }
}

function swap(A, pos1, pos2) {
  let temp = A[pos1];
  A[pos1] = A[pos2];
  A[pos2] = temp;
}

function heapSort(A) {
  let start = Math.floor(A.length / 2) - 1;
  let end = A.length - 1;

  while (start >= 0) {
    sift(A, start, A.length);
    start--;
  }
  while (end > 0) {
    swap(A, 0, end);
    sift(A, 0, end);
    end--;
  }
  return A;
}


module.exports = heapSort;
