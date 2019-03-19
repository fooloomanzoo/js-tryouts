const delayed = require('./delayed.js');

console.log('### Multiple Excecutions of minimal async function with fixed duration ###');
for (let i = 0; i <= 210; i++) {
	delayed(100).then(res => console.log(i, res));
}
