const unexpected = require('./unexpected.js');

console.log('### Multiple Excecutions of async function with random duration ###');
for (var i = 0; i < 10; i++) {
	unexpected();
}
