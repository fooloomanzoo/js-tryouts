// Performance Test for encoding Float64 to String
//
// NOTE String values are not implementation dependent, according the ECMA-262 3rd Edition Specification, each character represents a single 16-bit unit of UTF-16 text:

// QUOTE 4.3.16 String Value
//
// A string value is a member of the type String and is a finite ordered sequence of zero or more 16-bit unsigned integer values.
//
// NOTE Although each value usually represents a single 16-bit unit of UTF-16 text, the language does not place any restrictions or requirements on the values except that they be 16-bit unsigned integers.

const MAX_SAFE_CHARCODE = Math.pow(2, 16) - 1;

var float64ToStr_1 = function(num) {
    var view = new DataView( new ArrayBuffer(8) );
    view.setFloat64(0, num); // bigEndian
    var b = [];
    for ( var i = 0; i < 8; i+=2 ) {
        b.push( String.fromCharCode( view.getUint16(i) ) );
    }
    return b.join('');
};

var float64ToStr_2 = function(num) {
    var view = new DataView( new ArrayBuffer(8) );
    view.setFloat64(0, num); // bigEndian
    var b = '';
    for ( var i = 0; i < 8; i+=2 ) {
        b += String.fromCharCode( view.getUint16(i) );
    }
    return b;
};

var float64BufferToStr_1 = function(buffer) {
    var view = new DataView( buffer );
    var b = [];
    for ( var i = 0; i < buffer.length; i+=2 ) {
        b.push( String.fromCharCode( view.getUint16(i) ) );
    }
    return b.join('');
};

var float64BufferToStr_2 = function(buffer) {
    var view = new DataView( buffer );
    var b = '';
    for ( var i = 0; i < buffer.length; i+=2 ) {
        b += String.fromCharCode( view.getUint16(i) );
    }
    return b;
};

var float64ArrayToStr_1 = function(array) {
    var view = new DataView( Float64Array.from(array).buffer );
    var b = [];
    for ( var i = 0; i < array.length * 8; i+=2 ) {
        b.push( String.fromCharCode( view.getUint16(i) ) );
    }
    return b.join('');
};

var float64ArrayToStr_2 = function(array) {
    var view = new DataView( Float64Array.from(array).buffer );
    var b = '';
    for ( var i = 0; i < array.length * 8; i+=2 ) {
        b += String.fromCharCode( view.getUint16(i) );
    }
    return b;
};

var strToFloat64_1 = function(s) {
    if (s.length !== 4) {
      throw new TypeError(`String with length ${s.length} doesnt match float64`);
    }
    var view = new DataView( new ArrayBuffer(8) );
    for (var i = 0; i < 4; i++) {
        view.setUint16( i*2, s[i].charCodeAt() );
    }
    return view.getFloat64(0); // bigEndian
};

var strToFloat64Buffer_1 = function(s) {
    if (!s.length s.length % 4 !== 0) {
      throw new TypeError(`String with length ${s.length} doesnt match float64`);
    }
    var view = new DataView( new ArrayBuffer(s.length * 8) );
    for (var i = 0; i < s.length; i++) {
        view.setUint16( i*2, s[i].charCodeAt() );
    }
    return view.buffer;
};

var strToFloat64Array_1 = function(s) {
    return Array.from(strToFloat64Buffer_1(s));
};

function randomNumber() {
  return Math.random() * Number.MAX_SAFE_INTEGER + Math.random();
}

function randomChar() {
  return String.fromCharCode( Math.floor(Math.random() * MAX_SAFE_CHARCODE));
}

function perfTest(n, num, encFunc, decFunc, assertionTest) {
  var enc, dec, time_start, time_diff_enc, time_diff_dec;

  if (encFunc && typeof(encFunc) === 'function') {
    time_start = process.hrtime();
    for (var i = 0; i < n; i++) {
      enc = encFunc(num);
    }
    time_diff_enc = process.hrtime(time_start);
    console.log('total encoding', time_diff_enc);
    time_diff_enc = (time_diff_enc[0] * 1000000000 + time_diff_enc[1]) / n;
  }

  if (decFunc && typeof(decFunc) === 'function') {
    if (!enc) {
      enc = float64ToStr_1(num);
    }
    time_start = process.hrtime();
    for (var i = 0; i < n; i++) {
      dec = decFunc(enc);
    }
    time_diff_dec = process.hrtime(time_start);
    console.log('total decoding', time_diff_dec);
    time_diff_dec = (time_diff_dec[0] * 1000000000 + time_diff_dec[1]) / n;
  }

  console.log(`${n} tests`, time_diff_enc ? `per encoding ${time_diff_enc}ns` : '', time_diff_dec ? `per decoding ${time_diff_dec}ns` : '');

  if (assertionTest && decFunc && typeof(decFunc) === 'function' && encFunc && typeof(encFunc) === 'function') {

  }
}


// --------------------------- SINGLE FLOATS  ---------------------------
console.log('\n--- TEST --- Single Float, Using Array To Build Up');
perfTest(1, 2122.5435565656562, float64ToStr_1);
perfTest(100, 2122.5435565656562, float64ToStr_1);
perfTest(10000, 2122.5435565656562, float64ToStr_1);
perfTest(1000000, 2122.5435565656562, float64ToStr_1);

console.log('\n--- TEST --- Single Float, Using String To Build Up');
perfTest(1, 2122.5435565656562, float64ToStr_2);
perfTest(100, 2122.5435565656562, float64ToStr_2);
perfTest(10000, 2122.5435565656562, float64ToStr_2);
perfTest(1000000, 2122.5435565656562, float64ToStr_2);


// --------------------------- FLOATBUFFERS ---------------------------
var test_string = '';
var test_buffer;
const TEST_BUFFER_LENGTH = 4 * 1000;
for (var i = 0; i < TEST_BUFFER_LENGTH; i++) {
  test_string += randomChar();
}
test_buffer = strToFloat64Buffer_1(test_string);

console.log(`\n--- TEST --- FloatBuffer with Length of ${TEST_BUFFER_LENGTH}, Using Array To Build Up`);
perfTest(1, test_buffer, float64BufferToStr_1);
perfTest(100, test_buffer, float64BufferToStr_1);
perfTest(10000, test_buffer, float64BufferToStr_1);

console.log(`\n--- TEST --- FloatBuffer with Length of ${TEST_BUFFER_LENGTH}, Using String To Build Up`);
perfTest(1, test_buffer, float64BufferToStr_2);
perfTest(100, test_buffer, float64BufferToStr_2);
perfTest(10000, test_buffer, float64BufferToStr_2);


// --------------------------- FLOAT ARRAYS ---------------------------
var test_array = [];
const TEST_ARRAY_LENGTH = 1000;
for (var i = 0; i < TEST_ARRAY_LENGTH; i++) {
  test_array.push(randomNumber());
}

console.log(`\n--- TEST --- FloatArray with Length of ${TEST_ARRAY_LENGTH}, Using Array To Build Up`);
perfTest(1, test_array, float64ArrayToStr_1);
perfTest(100, test_array, float64ArrayToStr_1);
perfTest(10000, test_array, float64ArrayToStr_1);

console.log(`\n--- TEST --- FloatArray with Length of ${TEST_ARRAY_LENGTH}, Using String To Build Up`);
perfTest(1, test_array, float64ArrayToStr_2);
perfTest(100, test_array, float64ArrayToStr_2);
perfTest(10000, test_array, float64ArrayToStr_2);
