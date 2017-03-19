let TEST_MIN, TEST_MAX, invalid, c;


/////////// TEST: String.fromCharCode ///////////
console.log('\n', 'String.fromCharCode', '\n');

/////////////////////////////////////////////////
TEST_MIN = 0;
TEST_MAX = Math.pow(2, 16) - 1;
invalid = false;
console.log(`TEST_MIN ${TEST_MIN}  TEST_MAX ${TEST_MAX}`);
for (var i = TEST_MIN; i < TEST_MAX; i++) {
    if (i !== String.fromCharCode(i).charCodeAt(0)) {
        invalid = true;
        console.log('start failing with', i);
        break;
    }
}
console.log('Test', invalid ? 'failed' : 'ok', '\n');

/////////////////////////////////////////////////
TEST_MIN = 0;
TEST_MAX = Math.pow(2, 32);
invalid = false;
console.log(`TEST_MIN ${TEST_MIN}  TEST_MAX ${TEST_MAX}`);
for (var i = TEST_MIN; i < TEST_MAX; i++) {
    if (i !== String.fromCharCode(i).charCodeAt(0)) {
        invalid = true;
        console.log('start failing with', i);
        break;
    }
}
console.log('Test', invalid ? 'failed' : 'ok', '\n');

console.log((new Date(-100000000)).toLocaleString());
