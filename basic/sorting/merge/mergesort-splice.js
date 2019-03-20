function mergeSort(A) {
  if (A.length <= 1) {
    return A;
  }
  // bisect
  const half = Math.round(A.length / 2);
  let L = A.splice(0, half);
  L = mergeSort(L);
  A = mergeSort(A);
  // sort & concat
  return merge(L, A);
}

function merge(L, R) {
  let M = [];
  while (L.length > 0 && R.length > 0) {
    if (L[0] < R[0]) {
      M.push(L.shift());
    } else {
      M.push(R.shift());
    }
  }
  while (L.length > 0) {
    M.push(L.shift());
  }
  while (R.length > 0) {
    M.push(R.shift());
  }
  return M;
}



module.exports = mergeSort;
