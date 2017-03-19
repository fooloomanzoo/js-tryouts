const OFFSET = 33;
const FLOAT = 2.41;

var float2str = function(num){
    var view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, num);

    var fourbits = [];
    for ( var i = 0; i < 4; i++ ){
        // split each byte into two 4-bit values
        console.log(view.getUint8(0));
        fourbits.push(view.getUint8(0) >> 4);
        fourbits.push(view.getUint8(0) & 15);
    }

    for ( var i = 0; i < 8; i++ ){
        // build a string with OFFSET four-bit values
        fourbits[i] = String.fromCharCode(OFFSET + fourbits[i]);
    }
    return fourbits.join('');

};

var str2float = function(str){
    var bytestream = str;
    var view = new DataView(new ArrayBuffer(4));

    for(var i = 0; i < 4; i++){
        // re-convert the characters into bytes.
        view.setUint8(i, ((bytestream[i*2].charCodeAt() - OFFSET) << 4) + bytestream[i*2+1].charCodeAt() - OFFSET);
    }

    return view.getFloat32(0);
};

var test_to_str = float2str(FLOAT);
console.log(test_to_str);

var test_to_float = str2float(test_to_str);
console.log(test_to_float);
