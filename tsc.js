(function(){
	var path = require('path'),
		vm = require('vm'),
		readlines = require('./readlines.js'),
		_ = require('lodash');

	// read lines of the tsc.js
	var lines = readlines(path.join(__dirname, '/node_modules/typescript/bin/tsc.js'));

	// comment last lines to avoid autorun:
	// var batch = new TypeScript.BatchCompiler(TypeScript.IO);
	// batch.batchCompile();

	var i = _.findLastIndex(lines, function(l){
		return (/new\s*(TypeScript\.)?\s*BatchCompiler\((TypeScript\.)?IO\)/).test(l);
	});

	lines[i] = '// ' + lines[i];
	// comment possible 'batchCompile' call
	if ((/batchCompile\s*\(\s*\)/).test(lines[i + 1])){
		lines[i+1] = '// ' + lines[i+1];
	}

	// build a wrapping closure
	var script = ['module.exports = (function() {']
		.concat(lines)
		.concat(['return TypeScript;', '})();'])
		.join('\n');

	// prepare sandbox to run script
	var filename = path.join(__dirname, 'tsc.js');

	var sandbox = _.extend({}, global);
	sandbox.require = module.require.bind(module);
	sandbox.exports = module.exports;
	sandbox.__filename = filename;
	sandbox.__dirname = path.dirname(module.filename);
	sandbox.module = module;
	sandbox.global = sandbox;
	sandbox.root = root;

	// run script to expose typescript compiler API
	module.exports = vm.runInNewContext(script, sandbox, { filename: filename });
})();