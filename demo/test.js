var path = require('path');
var tsc = require('../index.js');
var files = ['person.ts', 'hello.ts'].map(function(name) {
  return path.join(__dirname, name);
});

function logerr(msg) {
	console.error(msg);
	return false;
}

tsc.compile({
	files: files,
	args: [
		'--sourcemap',
		'--target',
		'ES5'
	]
}, logerr);
