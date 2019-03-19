const s = 'ababac'

/**
 * [findSubStringCount description]
 * @param  {String} str        [description]
 * @param  {String} cmp        [description]
 * @param  {Number} [offset=0] [description]
 * @return {Number}            [description]
 */
function findSubStringCount(str, cmp, offset = 0) {
  if (!str || !cmp) {
    return 0;
  }
  return findSubStringRecursive(str, cmp, offset, 0);
}

/**
 * [findSubStringRecursive description]
 * @param  {[type]} str   [description]
 * @param  {[type]} cmp   [description]
 * @param  {[type]} pos   [description]
 * @param  {[type]} count [description]
 * @return {[type]}       [description]
 */
function findSubStringRecursive(str, cmp, pos, count) {
  if (pos + cmp.length > str.length) {
    return count;
  }
  for (var i = 0; i < cmp.length; i++) {
    if (cmp[i] !== str[i+pos]) {
      console.log(pos, i);
      return findSubStringRecursive(str, cmp, pos + i + 1, count);
    }
  }
  return findSubStringRecursive(str, cmp, pos + 1, ++count);
}

console.log(findSubStringCount(s, 'aba'));
