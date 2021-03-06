var path = require('path');
var tsc = require('../index.js');
var files = ['person.ts', 'hello.ts', 'spec1.ts', 'spec2.ts'].map(function(name) {
  return path.join(__dirname, name);
});

function logerr(msg) {
	console.error(msg);
	return false;
}

//var compilerPath = path.join(__dirname, '../node_modules/typescript/bin/tsc.js');
var args = ['--sourcemap', '--target', 'ES5'];

files.forEach(function(f) {
	tsc.compile({
		//compiler: compilerPath,
		files: [f],
		args: args
	}, logerr);
});
