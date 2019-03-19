const delayed = require('./delayed.js');

console.log('### Mixed async and syncronized excecutions ###');

function delayedAsync(n, delay) {
	for (let i = 1; i <= n; i++) {
		delayed(delay).then(res => console.log(`delayedAsync ${i}/${n} ${res}ms/${delay}ms`));
	}
}
async function delayedSync(n, delay) {
	for (let i = 1; i <= n; i++) {
		await delayed(delay).then(res => console.log(`delayedSync ${i}/${n} ${res}ms/${delay}ms`));
	}
}
delayedSync(10, 25)
delayedAsync(10, 100)
delayedAsync(10, 50)
delayedAsync(10, 20)
