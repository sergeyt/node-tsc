var path = require('path');
var vm = require('vm');
var readlines = require('./readlines.js');
var _ = require('lodash');
var iswin = require('iswin')();

// loads TypeScript compiler
function create_sandbox(compilerPath) {

	// read lines of the tsc.js
	var lines = readlines(compilerPath);

	// comment last lines to avoid autorun:
	// var batch = new TypeScript.BatchCompiler(TypeScript.IO);
	// batch.batchCompile();

	var i = _.findLastIndex(lines, function(l){
		return (/new\s*(TypeScript\.)?\s*BatchCompiler\((TypeScript\.)?IO\)/).test(l);
	});

	lines[i] = '// ' + lines[i];
	// comment possible 'batchCompile' call
	if ((/batchCompile\s*\(\s*\)/).test(lines[i + 1])) {
		lines[i+1] = '// ' + lines[i+1];
	}

	// build a wrapping closure
	var script = ['module.exports = (function() {']
		.concat(lines)
		.concat(['return TypeScript;', '})();'])
		.join('\n');

	// prepare sandbox to run script
	var filename = compilerPath;

	var sandbox = _.extend({}, global);
	sandbox.require = module.require.bind(module);
	sandbox.exports = module.exports;
	sandbox.__filename = filename;
	sandbox.__dirname = path.dirname(filename);
	sandbox.module = module;
	sandbox.global = sandbox;
	sandbox.root = root;

	// run script to expose typescript compiler API
	return vm.runInNewContext(script, sandbox, { filename: filename });
}

var compilers = {}; // sanbox caches to avoid errors

module.exports = function(compilerPath) {
	if (iswin) {
		compilerPath = compilerPath.toLowerCase();
	}

	var box = compilers[compilerPath];

	if (typeof box == "undefined") {
		box = create_sandbox(compilerPath);
		compilers[compilerPath] = box;
	}

	return box;
};
