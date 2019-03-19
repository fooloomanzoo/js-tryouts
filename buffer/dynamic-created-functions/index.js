const DATA_TYPES = {
    'bool': {
        set: function(byteOffset, value) { DataView.prototype.setInt8.call(this, byteOffset, value ? 1 : 0); },
        get: function(byteOffset) { return DataView.prototype.getInt8.call(this, byteOffset) ? true : false },
        min: 0,
        max: 1,
        bytes: 1
    },
    'char': { // experimental (for Unicode)
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        min: 0,
        max: 127,
        bytes: 1,
    },
    'int8': {
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        min: -128,
        max: 127,
        bytes: 1
    },
    'uint8': {
        set: DataView.prototype.setUint8,
        get: DataView.prototype.getUint8,
        min: 0,
        max: 255,
        bytes: 1
    },
    'int16': {
        set: DataView.prototype.setInt16,
        get: DataView.prototype.getInt16,
        min: -32768,
        max: 32767,
        bytes: 2
    },
    'uint16': {
        set: DataView.prototype.setUint16,
        get: DataView.prototype.getUint16,
        min: 0,
        max: 65535,
        bytes: 2
    },
    'int32': {
        set: DataView.prototype.setInt32,
        get: DataView.prototype.getInt32,
        min: -2147483648,
        max: 2147483647,
        bytes: 4
    },
    'uint32': {
        set: DataView.prototype.setUint32,
        get: DataView.prototype.getUint32,
        min: 0,
        max: 4294967295,
        bytes: 4,
    },
    'float32': {
        set: DataView.prototype.setFloat32,
        get: DataView.prototype.getFloat32,
        min: -1*(2-Math.pow(2,-23))*Math.pow(2,127),
        max: (2-Math.pow(2,-23))*Math.pow(2,127),
        bytes: 4
    },
    'float64': {
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE,
        bytes: 8
    },
    'number': {
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE,
        bytes: 8
    },
    'date': { // http://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        min: -8640000000000000,
        max: 8640000000000000,
        bytes: 8
    }
};

const VAR_TYPES = {
    'bool': {
        set: 'function(byteOffset, value) { DataView.prototype.setInt8.call(this, byteOffset, value ? 1 : 0); }',
        get: 'function(byteOffset) { return DataView.prototype.getInt8.call(this, byteOffset) ? true : false }',
        bytes: 1
    },
    'char': { // experimental (for Unicode)
        set: 'DataView.prototype.setInt8',
        get: 'DataView.prototype.getInt8',
        bytes: 1
    },
    'int8': {
        set: 'DataView.prototype.setInt8',
        get: 'DataView.prototype.getInt8',
        bytes: 1
    },
    'uint8': {
        set: 'DataView.prototype.setUint8',
        get: 'DataView.prototype.getUint8',
        bytes: 1
    },
    'int16': {
        set: 'DataView.prototype.setInt16',
        get: 'DataView.prototype.getInt16',
        bytes: 2
    },
    'uint16': {
        set: 'DataView.prototype.setUint16',
        get: 'DataView.prototype.getUint16',
        bytes: 2
    },
    'int32': {
        set: 'DataView.prototype.setInt32',
        get: 'DataView.prototype.getInt32',
        bytes: 4
    },
    'uint32': {
        set: 'DataView.prototype.setUint32',
        get: 'DataView.prototype.getUint32',
        bytes: 4
    },
    'float32': {
        set: 'DataView.prototype.setFloat32',
        get: 'DataView.prototype.getFloat32',
        bytes: 4
    },
    'float64': {
        set: 'DataView.prototype.setFloat64',
        get: 'DataView.prototype.getFloat64',
        bytes: 8
    },
    'number': {
        set: 'DataView.prototype.setFloat64',
        get: 'DataView.prototype.getFloat64',
        bytes: 8
    },
    'date': { // http://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range
        set: 'DataView.prototype.setFloat64',
        get: 'DataView.prototype.getFloat64',
        bytes: 8
    }
};

class ExtendedDataView {
  constructor(types) {
    this.sequenceByteLength = 0;
    this.sequenceByteOrder = [0];
    this.getter = [];
    this.setter = [];
    this.addSequenceTypes(types);
  }

  addSequenceTypes(types) {
    for (let i = 0; i < types.length; i++) {
      if (types[i] in VAR_TYPES) {
        this.sequenceByteLength += VAR_TYPES[types[i]].bytes;
        this.sequenceByteOrder.push(this.sequenceByteLength);
        this.getter.push(VAR_TYPES[types[i]].get);
        this.setter.push(VAR_TYPES[types[i]].set);
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }
  }

  toArray(buffer, byteOffset, byteLength) { // another attempt using static split functions
    let ret = [];
    let length = byteLength || buffer.byteLength;
    let tmp_view = new DataView(buffer, byteOffset, byteLength);
    let splitFn = this.getSplitSequenceFnDyn(this.getter, this.sequenceByteOrder);
    for (var offset = 0; offset < length; offset += this.sequenceByteLength) {
      ret.push.apply(ret, splitFn(offset, tmp_view) );
    }
    return ret;
  }
  getSplitSequenceFnDyn(getter, byteOrder) { // build from static properties a split function
    var fnBody = 'var ret = [];';
    for (var col = 0; col < getter.length; col++) {
      fnBody += 'ret.push('+getter[col]+'.call(view,offset+'+byteOrder[col]+'));';
    }
    fnBody += 'return ret;';
    return new Function('offset', 'view', fnBody);
  }
}

// ******************** TEST: BUFFER TO ARRAY *********************
const PackageSize = 50*1024*1024;
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

// Transform to Array using Object
var dv = new ExtendedDataView(types);

time_start = process.hrtime();
let arr = dv.toArray(buffer);
time_diff = process.hrtime(time_start);
console.log(time_diff, arr.length);
