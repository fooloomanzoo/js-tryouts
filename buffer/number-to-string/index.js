// Random Number Test for encoding Float64 to String UTF-16 Characters

// REFERENCE http://www.ecma-international.org/ecma-262/6.0
const DATA_TYPES = {
      'bool': {
          'typedArray': (n) => { return new Int8Array(n); },
          'setter': DataView.prototype.setInt8,
          'getter': DataView.prototype.getInt8,
          'min': 0,
          'max': 1,
          'bytes': 1,
          'precision': 0,
          'epsilon': 0
      },
      'char': { // experimental (for Unicode)
          'typedArray': (n) => { return new Int8Array(n); },
          'setter': DataView.prototype.setInt8,
          'getter': DataView.prototype.getInt8,
          'min': 0,
          'max': 127,
          'bytes': 1,
          'precision': 0,
          'epsilon': 0
      },
      'int8': {
          'typedArray': (n) => { return new Int8Array(n); },
          'setter': DataView.prototype.setInt8,
          'getter': DataView.prototype.getInt8,
          'min': -128,
          'max': 127,
          'bytes': 1,
          'precision': 0,
          'epsilon': 0
      },
      'uint8': {
          'typedArray': (n) => { return new Uint8Array(n); },
          'setter': DataView.prototype.setUint8,
          'getter': DataView.prototype.getUint8,
          'min': 0,
          'max': 255,
          'bytes': 1,
          'precision': 0,
          'epsilon': 0
      },
      'uint8clamped': {
          'typedArray': (n) => { return new Uint8ClampedArray(n); },
          'setter': DataView.prototype.setUint8,
          'getter': DataView.prototype.getUint8,
          'min': 0,
          'max': 255,
          'bytes': 1,
          'precision': 0,
          'epsilon': 0
      },
      'int16': {
          'typedArray': (n) => { return new Int16Array(n); },
          'setter': DataView.prototype.setInt16,
          'getter': DataView.prototype.getInt16,
          'min': -32768,
          'max': 32767,
          'bytes': 2,
          'precision': 0,
          'epsilon': 0
      },
      'uint16': {
          'typedArray': (n) => { return new Uint16Array(n); },
          'setter': DataView.prototype.setUint16,
          'getter': DataView.prototype.getUint16,
          'min': 0,
          'max': 65535,
          'bytes': 2,
          'precision': 0,
          'epsilon': 0
      },
      'int32': {
          'typedArray': (n) => { return new Int32Array(n); },
          'setter': DataView.prototype.setInt32,
          'getter': DataView.prototype.getInt32,
          'min': -2147483648,
          'max': 2147483647,
          'bytes': 4,
          'precision': 0,
          'epsilon': 0
      },
      'uint32': {
          'typedArray': (n) => { return new Uint32Array(n); },
          'setter': DataView.prototype.setUint32,
          'getter': DataView.prototype.getUint32,
          'min': 0,
          'max': 4294967295,
          'bytes': 4,
          'precision': 0,
          'epsilon': 0
      },
      'float32': {
          'typedArray': (n) => { return new Float32Array(n); },
          'setter': DataView.prototype.setFloat32,
          'getter': DataView.prototype.getFloat32,
          'min': -1*(2-Math.pow(2,-23))*Math.pow(2,127),
          'max': (2-Math.pow(2,-23))*Math.pow(2,127),
          'bytes': 4,
          'precision': 1, // single
          'epsilon': Math.pow(2,-23)
      },
      'float64': {
          'typedArray': (n) => { return new Float64Array(n); },
          'setter': DataView.prototype.setFloat64,
          'getter': DataView.prototype.getFloat64,
          'min': -Number.MAX_VALUE,
          'max': Number.MAX_VALUE,
          'bytes': 8,
          'precision': 2, // double
          'epsilon': Number.EPSILON
      },
      'number': {
          'typedArray': (n) => { return new Float64Array(n); },
          'setter': DataView.prototype.setFloat64,
          'getter': DataView.prototype.getFloat64,
          'min': -Number.MAX_VALUE,
          'max': Number.MAX_VALUE,
          'bytes': 8,
          'precision': 2, // double
          'epsilon': Number.EPSILON
      },
      'date': { // http://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range
          'typedArray': (n) => { return new Float64Array(n); },
          'setter': DataView.prototype.setFloat64,
          'getter': DataView.prototype.getFloat64,
          'min': -8640000000000000,
          'max': 8640000000000000,
          'bytes': 8,
          'precision': 0,
          'epsilon': 0
      }
  }

const ENCRYPTION_TYPES = {
      'char': {
        'setter': DataView.prototype.setUint8,
        'getter': DataView.prototype.getUint8,
        'bytes': 1
      },
      'short': {
        'setter': DataView.prototype.setUint16,
        'getter': DataView.prototype.getUint16,
        'bytes': 2
      }
  }

function numberToStr(num, type, enc_type) {
    if (!enc_type || !ENCRYPTION_TYPES[enc_type]) {
      enc_type = 'char';
    }
    let view = new DataView( new ArrayBuffer( DATA_TYPES[type].bytes * ENCRYPTION_TYPES[enc_type].bytes) );
    DATA_TYPES[type].setter.call(view, 0, num); // bigEndian
    let b = '';
    for ( let i = 0; i < DATA_TYPES[type].bytes; i += ENCRYPTION_TYPES[enc_type].bytes ) {
        // console.log(view.getUint8(i));
        b += String.fromCharCode( ENCRYPTION_TYPES[enc_type].getter.call(view, i) );
        //console.log(b.codePointAt(i));
    }
    return b;
};

function strToNumber(s, type, enc_type) {
    if (!enc_type || !ENCRYPTION_TYPES[enc_type]) {
      enc_type = 'char';
    }
    let view = new DataView( new ArrayBuffer( DATA_TYPES[type].bytes ) );
    for (let i = 0; i < DATA_TYPES[type].bytes / ENCRYPTION_TYPES[enc_type].bytes; i++) {
        // re-convert the characters into bytes.
        ENCRYPTION_TYPES[enc_type].setter.call(view, i*ENCRYPTION_TYPES[enc_type].bytes, s.charCodeAt(i) );
    }
    return DATA_TYPES[type].getter.call(view, 0); // bigEndian
};

function strToNumberSet(s, types, enc_type) {
    if (!enc_type || !ENCRYPTION_TYPES[enc_type]) {
      enc_type = 'char';
    }
    if (!Array.isArray(types)) {
      if (types && DATA_TYPES[types]) {
        types = [types];
      } else {
        types = ['float64']
      }
    }
    let enc_byte_length = ENCRYPTION_TYPES[enc_type].bytes;
    let max_byte_length = enc_byte_length;
    let valid_types = [];
    for (let i = 0; i < types.length; i++) {
      if (DATA_TYPES[types[i]]) {
        max_byte_length = Math.max(max_byte_length, DATA_TYPES[types[i]].bytes);
        valid_types.push(types[i]);
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }
    types = valid_types;
    valid_types = null;

    let ret = [];
    let tmp_view = new DataView( new ArrayBuffer( max_byte_length ) );

    let l = 0; // l: number of the actual decoded set of values
    let i = 0; // i: start in string of the actual set of values
    let j = 0; // j: actual decoded value
    let k = 0; // k: inner byte-position in actual decoded value
    while (i < s.length) {
      ret.push([]);
      for (j = 0; j < types.length; j++) {
        for (k = 0; k < DATA_TYPES[types[j]].bytes; k+=enc_byte_length) {
            // re-convert the characters into bytes.
            // console.log(i,j,k, s.charCodeAt(i));
            ENCRYPTION_TYPES[enc_type].setter.call(tmp_view, k, s.charCodeAt(i) );
            i++;
        }
        ret[l].push( DATA_TYPES[types[j]].getter.call(tmp_view, 0) ); // bigEndian
      }
      l++;
    }

    return ret;
};

function getBinarySize(s) {
    return Buffer.byteLength(s, 'char');
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(min, max, prec) {
  switch (prec) {
    case 1:
      let r = (Math.random() * (max - min)) + min;
      return Math.fround(r);
      break;
    case 2:
      return (Math.random() * (max - min)) + min;
      break;
    default:
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
  }
}

let num, enc, enc16, dec, failed, type, number_type, N;

// // --------------------------- ENCODING DECODING NUMBERS ---------------------------
// let types = ['int8', 'uint8', 'uint8clamped', 'int16', 'uint16', 'int32', 'uint32', 'float32', 'float64', 'number', 'date'];
//
// for (let j = 0; j < types.length; j++) {
//   N = 100000;
//   enc = '';
//   dec = '';
//   failed = 0;
//   type = types[j];
//   number_type = DATA_TYPES[type];
//
//   for (let i = 0; i < N; i++) {
//     num = getRandom(number_type.min, number_type.max, number_type.precision);
//     enc = numberToStr(num, type);
//     dec = strToNumber(enc, type);
//     if (num !== dec) {
//       // console.log('Test failed:', num, dec, num - dec);
//       failed++;
//     }
//     // console.log('num: %d enc: %s back-enc: %d', num, enc, dec);
//   }
//   console.log(`\nEncoding-Decoding-Test with type \"${type}\"`, failed ? `failed (${failed}x)` : 'successful');
// }
//
//
// // --------------------------- ENCODING FLOAT32 NUMBERS ---------------------------
// type = 'float32';
// number_type = DATA_TYPES[type];
// num = getRandom(10, 1000, 1);
//
// enc = '';
// dec = '';
// enc_type = 'char';
// failed = 0;
//
// enc = numberToStr(num, type, enc_type);
// dec = strToNumber(enc, type, enc_type);
// console.log('\n', num, num.toString(16), enc, enc.toString(16), dec, dec.toString(16));
// if (num !== dec) {
//   console.log('Test failed:', num, dec, num - dec);
//   failed++;
// }
// console.log(`\nEncoding-Decoding-Test with type \"${type}\" in \"${enc_type}\"`, failed ? `failed` : 'successful');
//
// enc = '';
// dec = '';
// enc_type = 'short';
// failed = 0;
//
// enc = numberToStr(num, type, enc_type);
// dec = strToNumber(enc, type, enc_type);
// console.log('\n', num, num.toString(16), enc, enc.toString(16), dec, dec.toString(16));
// if (num !== dec) {
//   console.log('Test failed:', num, dec, num - dec);
//   failed++;
// }
// console.log(`Encoding-Decoding-Test with type \"${type}\" in \"${enc_type}\"`, failed ? `failed` : 'successful');
//
//
// // --------------------------- CONTROL CHARS (0 - 33) ---------------------------
// for (let i = 0; i < 33; i++) {
//   if (i !== String.fromCharCode(i).charCodeAt()) {
//     console.log('Impossible to Encode for Char-Code', i);
//   }
// }

// --------------------------- Byte-Length in UTF-8 ---------------------------

let M = 1000;
const EXPECTED_FORMAT = ['date', 'float32', 'int8'];
const EXPECTED_FORMAT_MAX_LOWER_BOUNDERY = EXPECTED_FORMAT.map( (v) => { return DATA_TYPES[v].max / 2; });
const EXPECTED_FORMAT_MAX_UPPER_BOUNDERY= EXPECTED_FORMAT.map( (v) => { return DATA_TYPES[v].max; });
const EXPECTED_FORMAT_MIN_LOWER_BOUNDERY = [ (new Date()).valueOf(), 0, -1 ];
const EXPECTED_FORMAT_MIN_UPPER_BOUNDERY= [ (new Date()).valueOf() + 60*1000, 1, 1 ]

// // --------------------------- Max-Byte-Length in UTF-8 ---------------------------
// enc = '';
// enc16 = '';
// csv = [];
// asJson = [];
//
// for (let i = 0; i < M; i++) {
//   asJson.push([]);
//   for (let j = 0; j < EXPECTED_FORMAT.length; j++) {
//     num = getRandom(EXPECTED_FORMAT_MAX_LOWER_BOUNDERY[j], EXPECTED_FORMAT_MAX_UPPER_BOUNDERY[j], DATA_TYPES[EXPECTED_FORMAT[j]].precision);
//     enc += numberToStr(num, EXPECTED_FORMAT[j], 'char');
//     enc16 += numberToStr(num, EXPECTED_FORMAT[j], 'short');
//     csv.push(num);
//     asJson[i].push(num);
//   }
// }
//
// console.log(`\nMax-Byte-Length for ${M}-Multi-Values in Expected Format ${EXPECTED_FORMAT.join(',')} when in:\n`);
// console.log('Mixed-Byte-Length-Character-String-Buffer CHAR: ', getBinarySize(enc) );
// // console.log(enc);
// console.log('Mixed-Byte-Length-Character-String-Buffer SHORT:', getBinarySize(enc16) );
// // console.log(enc16);
// console.log('CSV-String:', getBinarySize(csv.join(';')) );
// // console.log(csv.join(';'));
// console.log('JSON-String:', getBinarySize( JSON.stringify(asJson) ) );
// // console.log(JSON.stringify(asJson));
//
// // --------------------------- Min-Byte-Length in UTF-8 ---------------------------
// enc = '';
// enc16 = '';
// csv = [];
// asJson = [];
//
// for (let i = 0; i < M; i++) {
//   asJson.push([]);
//   for (let j = 0; j < EXPECTED_FORMAT.length; j++) {
//     num = getRandom(EXPECTED_FORMAT_MIN_LOWER_BOUNDERY[j], EXPECTED_FORMAT_MIN_UPPER_BOUNDERY[j], DATA_TYPES[EXPECTED_FORMAT[j]].precision);
//     enc += numberToStr(num, EXPECTED_FORMAT[j], 'char');
//     enc16 += numberToStr(num, EXPECTED_FORMAT[j], 'short');
//     csv.push(num);
//     asJson[i].push(num);
//   }
// }
//
// console.log(`\nMin-Byte-Length for ${M}-Multi-Values in Expected Format ${EXPECTED_FORMAT.join(',')} when in:\n`);
// console.log('Mixed-Byte-Length-Character-String-Buffer CHAR: ', getBinarySize(enc) );
// // console.log(enc);
// console.log('Mixed-Byte-Length-Character-String-Buffer SHORT:', getBinarySize(enc16) );
// // console.log(enc16);
// console.log('CSV-String:', getBinarySize(csv.join(';')) );
// // console.log(csv.join(';'));
// console.log('JSON-String:', getBinarySize( JSON.stringify(asJson) ) );
// // console.log(JSON.stringify(asJson));


// --------------------------- Mult-Value Encoding-Decoding ---------------------------
M = 100000;
enc_type = 'char';

enc = '';
num = [];
dec = [];
failed = 0;

for (let i = 0; i < M; i++) {
  num.push([]);
  for (let j = 0; j < EXPECTED_FORMAT.length; j++) {
    num[i].push( getRandom(
        DATA_TYPES[EXPECTED_FORMAT[j]].min
      , DATA_TYPES[EXPECTED_FORMAT[j]].max
      , DATA_TYPES[EXPECTED_FORMAT[j]].precision ) );
    enc += numberToStr(num[i][j], EXPECTED_FORMAT[j], enc_type);
  }
}
dec = strToNumberSet(enc, EXPECTED_FORMAT, enc_type);

for (let i = 0; i < num.length; i++) {
  if (!dec[i]) {
    console.log(`Missing value-set at ${i}: ${num[i]}`);
  }
  for (let j = 0; j < num[i].length; j++) {
    if (Number.isNaN(dec[i][j])) {
      console.log(`Missing value in set at ${i} ${j}: ${dec[i]}`);
      failed++;
    } else if (num[i][j] !== dec[i][j]) {
      console.log(`Encoding value in set at ${i} ${j} failed: ${num[i][j]} !== ${dec[i][j]}`);
      failed++;
    }
  }
}

console.log(`\nEncoding-Decoding Set of ${M} Multi-Values in Expected Format ${EXPECTED_FORMAT.join(',')}`, failed ? `failed` : 'successful');
console.log('Length of Encoded String: ', enc.length );
console.log('Binary Size of Encoded String: ', getBinarySize(enc), 'Byte', '(', getBinarySize(enc)/M,'Bytes/Set)' );
console.log('Binary Size of Object: ', getBinarySize(JSON.stringify(num)), 'Byte', '(', getBinarySize(JSON.stringify(num))/M,'Bytes/Set)' );
