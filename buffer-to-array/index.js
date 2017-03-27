Number.prototype.rclamp = function(min, max) {
  return Math.min(Math.max( Math.round(this) , min), max);
};

const DATA_TYPES = {
    'bool': {
        typedArray: (n) => { return new Int8Array(n); },
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        min: 0,
        max: 1,
        bytes: 1,
        clamp: function(v) { return v ? true : false; },
        epsilon: 0
    },
    'char': { // experimental (for Unicode)
        typedArray: (n) => { return new Int8Array(n); },
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: 0,
        max: 127,
        bytes: 1,
        epsilon: 0
    },
    'int8': {
        typedArray: (n) => { return new Int8Array(n); },
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: -128,
        max: 127,
        bytes: 1,
        epsilon: 0
    },
    'uint8': {
        typedArray: (n) => { return new Uint8Array(n); },
        set: DataView.prototype.setUint8,
        get: DataView.prototype.getUint8,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: 0,
        max: 255,
        bytes: 1,
        epsilon: 0
    },
    'int16': {
        typedArray: (n) => { return new Int16Array(n); },
        set: DataView.prototype.setInt16,
        get: DataView.prototype.getInt16,
        clamp: function(v) { return v;return v.rclamp(this.min, this.max); },
        min: -32768,
        max: 32767,
        bytes: 2,
        epsilon: 0
    },
    'uint16': {
        typedArray: (n) => { return new Uint16Array(n); },
        set: DataView.prototype.setUint16,
        get: DataView.prototype.getUint16,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: 0,
        max: 65535,
        bytes: 2,
        epsilon: 0
    },
    'int32': {
        typedArray: (n) => { return new Int32Array(n); },
        set: DataView.prototype.setInt32,
        get: DataView.prototype.getInt32,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: -2147483648,
        max: 2147483647,
        bytes: 4,
        epsilon: 0
    },
    'uint32': {
        typedArray: (n) => { return new Uint32Array(n); },
        set: DataView.prototype.setUint32,
        get: DataView.prototype.getUint32,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: 0,
        max: 4294967295,
        bytes: 4,
        epsilon: 0
    },
    'float32': {
        typedArray: (n) => { return new Float32Array(n); },
        set: DataView.prototype.setFloat32,
        get: DataView.prototype.getFloat32,
        clamp: function(v) { return Math.fround(v); },
        min: -1*(2-Math.pow(2,-23))*Math.pow(2,127),
        max: (2-Math.pow(2,-23))*Math.pow(2,127),
        bytes: 4,
        epsilon: Math.pow(2,-23)
    },
    'float64': {
        typedArray: (n) => { return new Float64Array(n); },
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        clamp: function(v) { return v; },
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE,
        bytes: 8,
        epsilon: Number.EPSILON
    },
    'number': {
        typedArray: (n) => { return new Float64Array(n); },
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        clamp: function(v) { return v; },
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE,
        bytes: 8,
        epsilon: Number.EPSILON
    },
    'date': { // http://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range
        typedArray: (n) => { return new Float64Array(n); },
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        clamp: function(v) { return v.rclamp(this.min, this.max); },
        min: -8640000000000000,
        max: 8640000000000000,
        bytes: 8,
        epsilon: 0
    }
};

function bufferToArray(buffer, types) {
    if (!Array.isArray(types)) {
      if (types && DATA_TYPES[types]) {
        types = [types];
      } else {
        types = ['float64']
      }
    }
    let buf_byte_length = buffer.byteLength;
    let seq_byte_length = 0;
    let seq_byte_order = [];
    let getter = [];
    for (let i = 0; i < types.length; i++) {
      if (types[i] in DATA_TYPES) {
        seq_byte_length += DATA_TYPES[types[i]].bytes;
        seq_byte_order.push(DATA_TYPES[types[i]].bytes);
        getter.push(DATA_TYPES[types[i]].get);
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }

    let offset = 0;
    let row = 0;
    let col = 0;
    let tmp_view = new DataView( buffer );
    let ret = [];

    while (offset < buf_byte_length) {
      ret.push([]);
      for (col = 0; col < getter.length; col++) {
        ret[row].push( getter[col].call(tmp_view, offset) );
        offset += seq_byte_order[col];
      }
      row++;
    }
    return ret;
};

function arrayToBuffer(array, types) {
    if (!Array.isArray(array)) {
      throw new TypeError('argument is not an array');
    }
    if (!Array.isArray(types)) {
      if (types && DATA_TYPES[types]) {
        types = [types];
      } else {
        types = ['float64']
      }
    }

    let seq_byte_length = 0;
    let seq_byte_order = [];
    let setter = [];
    // let round = [];
    for (let i = 0; i < types.length; i++) {
      if (types[i] in DATA_TYPES) {
        seq_byte_length += DATA_TYPES[types[i]].bytes;
        seq_byte_order.push(DATA_TYPES[types[i]].bytes);
        setter.push(DATA_TYPES[types[i]].set);
        // round.push(DATA_TYPES[types[i]].clamp)
      } else {
        console.warn(`invalid Number-Type: \"${types[i]}\"`)
      }
    }

    let buf_byte_length = seq_byte_length * array.length;
    let buffer = new ArrayBuffer( buf_byte_length );
    let tmp_view = new DataView( buffer );
    let offset = 0;
    let row = 0;
    let col = 0;

    while (offset < buf_byte_length) {
      for (col = 0; col < setter.length; col++) {
        setter[col].apply(tmp_view, offset, array[row][col] );
        offset += seq_byte_order[col];
      }
      row++;
    }
    return buffer;
};

function sequenceToArray(start, end, view, seqTypeSetters) {

}

// ******************** TEST: BUFFER RO ARRAY *********************
const PackageSize = 1024*1024;
var types = ['float32', 'int16', 'float64', 'bool'];

let seq_byte_length = 0;
let seq_byte_order = [];
let setter = [];
for (let i = 0; i < types.length; i++) {
  if (types[i] in DATA_TYPES) {
    seq_byte_length += DATA_TYPES[types[i]].bytes;
    seq_byte_order.push(DATA_TYPES[types[i]].bytes);
    setter.push(DATA_TYPES[types[i]].set);
  } else {
    console.warn(`invalid Number-Type: \"${types[i]}\"`)
  }
}

let buf_byte_length = Math.ceil(PackageSize/seq_byte_length)*seq_byte_length;
let buffer = new ArrayBuffer( buf_byte_length );
let tmp_view = new DataView( buffer );
let offset = 0;
let row = 0;
let col = 0;

console.log(buf_byte_length, PackageSize,seq_byte_length, PackageSize/seq_byte_length,PackageSize%seq_byte_length, seq_byte_order);

let val = 0;

while (offset < buf_byte_length) {
  // console.log(offset);
  for (col = 0; col < setter.length; col++) {
    setter[col].call( tmp_view, offset, val );
    offset += seq_byte_order[col];
  }
  val += Math.PI;
  row++;
}

time_start = process.hrtime();
let arr = bufferToArray(buffer, types);
time_diff = process.hrtime(time_start);
console.log(time_diff, arr.length);

// var arr = [ [2.4, 1, 7.4], [1, 2.9, 5.44], [7.8, 32865, 2.11] ];
//
// var buffer = arrayToBuffer(arr, types);
//
// console.log(Math.fround(2.4));
// console.log(arr);
// console.log( bufferToArray(buffer, types) );
