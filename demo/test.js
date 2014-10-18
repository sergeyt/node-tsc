var path = require('path');
var tsc = require('../index.js');
var files = ['person.ts', 'hello.ts'].map(function(name) {
  return path.join(__dirname, name);
});

tsc.compile(files,
	[
		'--sourcemap',
		'--target',
		'ES5'
	], function(msg) {
		console.error(msg);
		return false;
	});
