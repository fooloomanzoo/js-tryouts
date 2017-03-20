// Random Number Test for encform Float64 to String
const N = 1000000;
const MAX_64 = Number.MAX_SAFE_INTEGER;

var float2str = function(num) {
    var view = new DataView( new ArrayBuffer(8) );
    view.setFloat64(0, num); // bigEndian
    var b = [];
    for ( var i = 0; i < 8; i+=2 ) {
        // console.log(view.getUint16(i));
        b.push( String.fromCharCode( view.getUint16(i) ) );
    }
    return b.join('');
};

var str2float = function(s) {
    var view = new DataView( new ArrayBuffer(8) );
    for (var i = 0; i < 4; i++) {
        // re-convert the characters into bytes.
        // console.log(s[i].charCodeAt());
        view.setUint16( i*2, s[i].charCodeAt() );
    }
    return view.getFloat64(0); // bigEndian
};

var num;
var enc;
var back_enc;
var failed = 0;

for (var i = 0; i < N; i++) {
  num = Math.random() * MAX_64 + Math.random();
  enc = float2str(num);
  back_enc = str2float(enc);
  if (num !== back_enc) {
    console.log('Test failed:', i, back_enc);
    failed++;
  }
  // console.log('num: %d enc: %s back-enc: %d', num, enc, back_enc);
}

console.log('Test', failed ? `failed (${failed}x)` : 'successful');
