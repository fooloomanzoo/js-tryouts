function isPrime(n) {
	for (let i = 2; i <= Math.sqrt(n); i++) {
		if (n % i === 0) {
			return false;
		}
	}
	return true;
}

function run(N) {
	if (N <= 0)
		return false;
	if (N !== Math.round(N)) {
		return false;
	}
	let primeCount = 0;
	let test = 2;
	let primeSet = new Set();
	let noPrimeSet = new Set();
	while (primeCount <= 2 && test <= N) {
		if (!noPrimeSet.has(test)) {
			if (!primeSet.has(test)) {
				if (isPrime(test)) {
					primeSet.add(test);
					if (N % test === 0) {
						primeCount++;
						N /= test;
						test = 1;
					}
				} else {
					noPrimeSet.add(test);
				}
			} else if (N % test === 0) {
				primeCount++;
				N /= test;
				test = 1;
			}
		}
		test++;
	}

	if (primeCount !== 2) {
		return false;
	} else {
		return true;
	}
}

const test = 10e8;
console.log(run(test));
