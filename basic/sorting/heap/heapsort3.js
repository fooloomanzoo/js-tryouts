
function siftDown(A, root, size) {
  let child = 2 * root + 1;

  while (child < size) {
    // if there is a right child and if it is larger than the left child
    if (child + 1 < size && A[child] < A[child + 1]) {
      // consider the right child
      child++;
    }
    // if the child is larger the parent
    if (A[child] > A[root]) {
      // swap the child and the parent
      swap(A, root, child);
      // continue at the child by setting parent position to the childs position
      root = child;
      // setting the new left child position
      child = 2*root + 1;
    } else { // else sifting down complete
      return;
    }
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
    siftDown(A, start, A.length);
    start--;
  }
  while (end > 0) {
    swap(A, 0, end);
    siftDown(A, 0, end);
    end--;
  }
  return A;
}


module.exports = heapSort;
