Number.prototype.rclamp = function(min, max) {
  return Math.min(Math.max( Math.round(this), min), max);
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

class ExtendedDataView extends DataView {
  constructor(buffer, offset, byteLength) {
    super(buffer, offset, byteLength);
    this.buf = buffer;
    this.sequenceByteLength = 0;
    this.sequenceByteOrder = [0];
    this.getter = [];
    this.setter = [];
  }

  addSequenceTypes(types) {
    for (let i = 0; i < types.length; i++) {
      if (types[i] in DATA_TYPES) {
        this.sequenceByteLength += DATA_TYPES[types[i]].bytes;
        this.sequenceByteOrder.push(DATA_TYPES[types[i]].bytes);
        this.getter.push(DATA_TYPES[types[i]].get);
        this.setter.push(DATA_TYPES[types[i]].set);
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }
  }

  toArray() {
    let offset = 0;
    let row = 0;
    let col = 0;
    let ret = [];
    console.log(this.sequenceByteOrder);
    while (offset < this.byteLength) {
      ret.push( this.getter.map( (g, i) => {
        // console.log(i, this.byteLength, offset, offset + this.sequenceByteOrder[i]);
        return g.call(this, offset += this.sequenceByteOrder[i]);
      } ) );
      offset += this.sequenceByteOrder[4];
    }
    return ret;
  }
  toArray2() {
    let offset = 0;
    let row = 0;
    let col = 0;
    let ret = [];
    let tmp_view = new DataView( this.buf );
    while (offset < this.byteLength) {
      ret.push([]);
      for (col = 0; col < this.getter.length; col++) {
        // console.log(col, this.byteLength, offset, offset + this.sequenceByteOrder[col]);
        offset += this.sequenceByteOrder[col];
        ret[row].push( this.getter[col].call(tmp_view, offset) );
      }

      offset += this.sequenceByteOrder[4];
      row++;
    }
    return ret;
  }
}
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
// ******************** TEST: BUFFER RO ARRAY *********************
const PackageSize = 10*1024*1024;
var types = ['float32', 'int16', 'float64', 'bool'];

// Set a Buffer
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

// Transform to Array
var dv = new ExtendedDataView(buffer);
dv.addSequenceTypes(types);
time_start = process.hrtime();
let arr = dv.toArray();
time_diff = process.hrtime(time_start);
console.log(time_diff, arr.length);
time_start = process.hrtime();
let arr2 = dv.toArray2();
time_diff = process.hrtime(time_start);
console.log(time_diff, arr2.length);
time_start = process.hrtime();
let arr3 = bufferToArray(buffer, types);
time_diff = process.hrtime(time_start);
console.log(time_diff, arr3.length);
