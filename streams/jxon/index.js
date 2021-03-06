const fs = require('fs')
    , path = require('path')
    , jxon = require('jxon');

const TEST_FILES = [
  //   'test1.xml'
  // , 'test2.xml'
  // , 'test3.xml'
];
const URL = "https://www.heise.de/newsticker/heise-atom.xml";

// function logJSON(jsonObj) {
//   console.dir( jsonObj, {depth: null} );
// }
//
// function readFile(filepath) {
//   return new Promise(function(resolve, reject) {
//     fs.readFile( path.resolve(filepath), 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(data);
//     });
//   });
// };
//
// for (let i = 0; i < TEST_FILES.length; i++) {
//   readFile( TEST_FILES[i] )
//     .then( data => {
//       console.log(`\n********** FILENAME: ${TEST_FILES[i]} *********\n`);
//       let jsonobj = jxon.stringToJs( data, null, null, true );
//       // console.log(jsonobj);
//       logJSON( jsonobj );
//     })
//     .catch( error => {
//       logJSON( error );
//     })
// }


const FeedParser = require('feedparser')
    , request = require('request');

var req = request(URL);
var feedparser = new FeedParser();

req.on('error', function (error) {
  // handle any request errors
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  // always handle errors
});

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;

  while (item = stream.read()) {
    console.dir(item, { depth: null });
  }
});
