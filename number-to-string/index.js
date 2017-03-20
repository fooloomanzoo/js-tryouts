// Random Number Test for encoding Float64 to String UTF-16 Characters

// REFERENCE http://www.ecma-international.org/ecma-262/6.0
const NUMBER_TYPES = {
      'int8': {
          'typedArray': (n) => { return new Int8Array(n); },
          'setter': DataView.prototype.setInt8,
          'getter': DataView.prototype.getInt8,
          'min': -128,
          'max': 127,
          'bytes': 1,
          'pricision': 0
      },
      'uint8': {
          'typedArray': (n) => { return new Uint8Array(n); },
          'setter': DataView.prototype.setUint8,
          'getter': DataView.prototype.getUint8,
          'min': 0,
          'max': 255,
          'bytes': 1,
          'pricision': 0
      },
      'uint8clamped': {
          'typedArray': (n) => { return new Uint8ClampedArray(n); },
          'setter': DataView.prototype.setUint8,
          'getter': DataView.prototype.getUint8,
          'min': 0,
          'max': 255,
          'bytes': 1,
          'pricision': 0
      },
      'int16': {
          'typedArray': (n) => { return new Int16Array(n); },
          'setter': DataView.prototype.setInt16,
          'getter': DataView.prototype.getInt16,
          'min': -32768,
          'max': 32767,
          'bytes': 2,
          'pricision': 0
      },
      'uint16': {
          'typedArray': (n) => { return new Uint16Array(n); },
          'setter': DataView.prototype.setUint16,
          'getter': DataView.prototype.getUint16,
          'min': 0,
          'max': 65535,
          'bytes': 2,
          'pricision': 0
      },
      'int32': {
          'typedArray': (n) => { return new Int32Array(n); },
          'setter': DataView.prototype.setInt32,
          'getter': DataView.prototype.getInt32,
          'min': -2147483648,
          'max': 2147483647,
          'bytes': 4,
          'pricision': 0
      },
      'uint32': {
          'typedArray': (n) => { return new Uint32Array(n); },
          'setter': DataView.prototype.setUint32,
          'getter': DataView.prototype.getUint32,
          'min': 0,
          'max': 4294967295,
          'bytes': 4,
          'pricision': 0
      },
      'float32': {
          'typedArray': (n) => { return new Float32Array(n); },
          'setter': DataView.prototype.setFloat32,
          'getter': DataView.prototype.getFloat32,
          'min': -1*(1-Math.pow(2,-24))*Math.pow(2,128),
          'max': (1-Math.pow(2,-24))*Math.pow(2,128),
          'bytes': 8,
          'pricision': Math.pow(2,-23)
      },
      'float64': {
          'typedArray': (n) => { return new Float64Array(n); },
          'setter': DataView.prototype.setFloat64,
          'getter': DataView.prototype.getFloat64,
          'min': -Number.MAX_VALUE,
          'max': Number.MAX_VALUE,
          'bytes': 8,
          'pricision': Number.EPSILON
      },
      'number': {
          'typedArray': (n) => { return new Float64Array(n); },
          'setter': DataView.prototype.setFloat64,
          'getter': DataView.prototype.getFloat64,
          'min': -Number.MAX_VALUE,
          'max': Number.MAX_VALUE,
          'bytes': 8,
          'pricision': Number.EPSILON
      },
      'date': { // http://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range
          'typedArray': (n) => { return new Float64Array(n); },
          'setter': DataView.prototype.setFloat64,
          'getter': DataView.prototype.getFloat64,
          'min': -8640000000000000,
          'max': 8640000000000000,
          'bytes': 8,
          'pricision': 0
      }
  }

function float64ToStr(num) {
    var view = new DataView( new ArrayBuffer(8) );
    view.setFloat64(0, num); // bigEndian
    var b = '';
    for ( var i = 0; i < 8; i++ ) {
        b += String.fromCharCode( view.getUint8(i) );
    }
    return b;
};

function float32ToStr(num) {
    var view = new DataView( new ArrayBuffer(4) );
    view.setFloat32(0, num); // bigEndian
    var b = '';
    for ( var i = 0; i < 4; i++ ) {
        b += String.fromCharCode( view.getUint8(i) );
    }
    return b;
};

function numberToStr(num, type) {
    var view = new DataView( new ArrayBuffer( NUMBER_TYPES[type].bytes ) );
    NUMBER_TYPES[type].setter.call(view, 0, num); // bigEndian
    var b = '';
    for ( var i = 0; i < NUMBER_TYPES[type].bytes; i++ ) {
        // console.log(view.getUint8(i));
        b += String.fromCharCode( view.getUint8(i) );
    }
    return b;
};

function strToFloat64(s) {
    var view = new DataView( new ArrayBuffer(8) );
    for (var i = 0; i < 8; i++) {
        // re-convert the characters into bytes.
        // console.log(s[i].charCodeAt());
        view.setUint8( i, s[i].charCodeAt() );
    }
    return view.getFloat64(0); // bigEndian
};

function strToNumber(s, type) {
    var view = new DataView( new ArrayBuffer( NUMBER_TYPES[type].bytes ) );
    for (var i = 0; i < NUMBER_TYPES[type].bytes; i++) {
        // re-convert the characters into bytes.
        // console.log(s[i].charCodeAt());
        view.setUint8( i, s[i].charCodeAt() );
    }
    return NUMBER_TYPES[type].getter.call(view, 0); // bigEndian
};

function getBinarySize(s) {
    return Buffer.byteLength(s, 'utf8');
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandom(min, max, prec) {
  if (!prec) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  } else {
    return (Math.random() * (max - min)) + min;
  }
}

const N = 100000;
var num, enc, dec, failed, type, number_type;

// enc = '';
// dec = '';
// // --------------------------- RANDOM NUMBERS ---------------------------
// failed = 0;
//
// for (var i = 0; i < N; i++) {
//   num = getRandom(-Number.MAX_VALUE, Number.MAX_VALUE);
//   enc = float64ToStr(num);
//   dec = strToFloat64(enc);
//   if (num !== dec) {
//     console.log('Test failed:', i, dec);
//     failed++;
//   }
//   // console.log('num: %d enc: %s back-enc: %d', num, enc, dec);
// }


// --------------------------- ENCODING DECODING NUMBERS ---------------------------
var types = ['int8', 'uint8', 'uint8clamped', 'int16', 'uint16', 'int32', 'uint32', 'float32', 'float64', 'number', 'date'];

for (var j = 0; j < types.length; j++) {
  enc = '';
  dec = '';
  failed = 0;
  type = types[j];
  number_type = NUMBER_TYPES[type];

  for (var i = 0; i < N; i++) {
    num = getRandom(number_type.min, number_type.max, number_type.precision);
    enc = numberToStr(num, type);
    dec = strToNumber(enc, type);
    if (num !== dec) {
      console.log('Test failed:', num, dec);
      failed++;
    }
    // console.log('num: %d enc: %s back-enc: %d', num, enc, dec);
  }
  console.log(`\nEncoding-Decoding-Test with type \"${type}\"`, failed ? `failed (${failed}x)` : 'successful');
}



// --------------------------- CONTROL CHARS (0 - 33) ---------------------------
for (var i = 0; i < 33; i++) {
  if (i !== String.fromCharCode(i).charCodeAt()) {
    console.log('Impossible to Encode for Char-Code', i);
  }
}

// --------------------------- Byte-Length in UTF-8 ---------------------------

const M = 1000;
const EXPECTED_FORMAT = ['date', 'float32', 'int8'];
const EXPECTED_FORMAT_MAX_LOWER_BOUNDERY = EXPECTED_FORMAT.map( (v) => { return NUMBER_TYPES[v].max / 2; });
const EXPECTED_FORMAT_MAX_UPPER_BOUNDERY= EXPECTED_FORMAT.map( (v) => { return NUMBER_TYPES[v].max; });
const EXPECTED_FORMAT_MIN_LOWER_BOUNDERY = [ (new Date()).valueOf(), 0, -1 ];
const EXPECTED_FORMAT_MIN_UPPER_BOUNDERY= [ (new Date()).valueOf() + 60*1000, 1, 1 ]

// --------------------------- Min-Byte-Length in UTF-8 ---------------------------
var enc = '';
var enc32 = '';
var enc64 = '';
var csv = [];
var asJson = [];

for (var i = 0; i < M; i++) {
  asJson.push({});
  for (var j = 0; j < EXPECTED_FORMAT.length; j++) {
    num = getRandomInt(EXPECTED_FORMAT_MAX_LOWER_BOUNDERY[j], EXPECTED_FORMAT_MAX_UPPER_BOUNDERY[j]);
    enc += numberToStr(num, EXPECTED_FORMAT[j]);
    enc32 += float32ToStr(num);
    enc64 += float64ToStr(num);
    csv.push(num);
    asJson[i][j] = num;
  }
}

console.log(`\nMax-Byte-Length for ${M}-Multi-Values in Expected Format ${EXPECTED_FORMAT.join(',')} when in:\n`);
console.log('Mixed-Byte-Length-Character-String-Buffer:', getBinarySize(enc) );
// console.log(enc);
console.log('Float32-Character-String-Buffer:', getBinarySize(enc32) );
// console.log(enc32);
console.log('Float64-Character-String-Buffer:', getBinarySize(enc64) );
// console.log(enc64);
console.log('CSV-String:', getBinarySize(csv.join(';')) );
// console.log(csv.join(';'));
console.log('JSON-String:', getBinarySize( JSON.stringify(asJson) ) );
// console.log(JSON.stringify(asJson));

// --------------------------- Min-Byte-Length in UTF-8 ---------------------------
var enc = '';
var enc32 = '';
var enc64 = '';
var csv = [];
var asJson = [];

for (var i = 0; i < M; i++) {
  asJson.push({});
  for (var j = 0; j < EXPECTED_FORMAT.length; j++) {
    num = getRandomInt(EXPECTED_FORMAT_MIN_LOWER_BOUNDERY[j], EXPECTED_FORMAT_MIN_UPPER_BOUNDERY[j], NUMBER_TYPES[EXPECTED_FORMAT[j]].precision);
    enc += numberToStr(num, EXPECTED_FORMAT[j]);
    enc32 += float32ToStr(num);
    enc64 += float64ToStr(num);
    csv.push(num);
    asJson[i][j] = num;
  }
}

console.log(`\nMax-Byte-Length for ${M}-Multi-Values in Expected Format ${EXPECTED_FORMAT.join(',')} when in:\n`);
console.log('Mixed-Byte-Length-Character-String-Buffer:', getBinarySize(enc) );
// console.log(enc);
console.log('Float32-Character-String-Buffer:', getBinarySize(enc32) );
// console.log(enc32);
console.log('Float64-Character-String-Buffer:', getBinarySize(enc64) );
// console.log(enc64);
console.log('CSV-String:', getBinarySize(csv.join(';')) );
// console.log(csv.join(';'));
console.log('JSON-String:', getBinarySize( JSON.stringify(asJson) ) );
// console.log(JSON.stringify(asJson));
