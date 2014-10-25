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
	compiler: path.join(__dirname, '../node_modules/typescript/bin/tsc.js'),
	files: files,
	args: [
		'--sourcemap',
		'--target',
		'ES5'
	]
}, logerr);
