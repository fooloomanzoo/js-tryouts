const https = require('https');

const URL = 'https://challenges.hackajob.co/swapi/api/people/?search=';

async function run(character) {
	return await Promise.resolve(
    getRequestPromise(URL + character)
  ).then(result => {
    console.log(result);
    if (result && result.results && result.results[0] && result.results[0].films.length > 0) {
      return result.results[0].films.length;
    }
    return 0;
	});
}

function getRequestPromise(url) {
	return new Promise((resolve, reject) => {
	    let request = https.get(url, response => {
        response.setEncoding("utf8");
	      if (response.statusCode < 200 || response.statusCode > 299) {
	         reject(new Error(`Failed to load page, status code:  ${response.statusCode}`));
	       }

	      let body = [];
	      response.on('data', chunk => {
          body.push(chunk)
        });
	      response.on('end', () => {
          try {
            const result = JSON.parse(body.join(''));
            resolve(result);
          } catch (e) {
            reject(new Error(`Error parsing result: ${e}`));
          }
        });
	    });

	    request.on('error', (err) => reject(err));
    });
}


const test = 3;
run(test).then(console.log);
run('Owen Lars').then(console.log);
