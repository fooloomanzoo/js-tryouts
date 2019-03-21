const s = 'SMS messages are really short';
const K = 12;

function solution(S, K) {
  const words = S.split(' ');
  let map = [0], j = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > K) {
      return -1;
    }
    if (map[j] !== 0 && map[j] + 1 + words[i].length > K) {
      j++;
      map.push(0);
    }
    if (map[j] > 0 && map[j] < K) {
      map[j] += 1;
    }
    map[j] += words[i].length;
  }
  return map.length;
}

console.log(solution(s, K));
console.log('###');
console.log(solution(s, 8));
console.log('###');
console.log(solution(s, 2));
console.log('###');
console.log(solution(s, 10));
console.log('###');
console.log(solution('SMS SMS SMS SMS SMS', 3));
