function heap_root(A, i, pos) {
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  let max = i;

  if (left < pos && A[left] > A[max]) {
    max = left;
  }

  if (right < pos && A[right] > A[max])     {
    max = right;
  }

  if (max !== i) {
    swap(A, i, max);
    heap_root(A, max, pos);
  }
}

function swap(A, index_A, index_B) {
  let temp = A[index_A];

  A[index_A] = A[index_B];
  A[index_B] = temp;
}

function heapSort(A) {
  for (let i = Math.floor(A.length / 2); i >= 0; i -= 1) {
    heap_root(A, i, A.length);
  }

  for (i = A.length - 1; i > 0; i--) {
    swap(A, 0, i);
    heap_root(A, 0, i);
  }
  return A;
}


module.exports = heapSort;
