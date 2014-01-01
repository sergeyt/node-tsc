var TypeScript = require('./tsc.js'),
	path = require('path'),
	_ = require('lodash');

module.exports = TypeScript;

module.exports.compile = function(files, args, onError) {

	// TODO support args as hash object
	var opts = typeof args == "string" ? args.split(' ') : args || [];
	opts.push('--nolib');
	opts = opts.concat(files);
	opts.push(path.resolve(__dirname, 'node_modules/typescript/bin/lib.d.ts'));

	var io = _.extend({}, TypeScript.IO, { arguments: opts });

	var exitCode = 0;
	io.quit = function(code) {
		exitCode = code;
	};

	function wrap(fn) {
		var original = fn;
		return function (str) {
			if (onError(str) === false) {
				return;
			}
			original(str);
		};
	}

	if (onError) {
		io.stderr.Write = wrap(io.stderr.Write);
		io.stderr.WriteLine = wrap(io.stderr.WriteLine);
	}

	var batch = new TypeScript.BatchCompiler(io);
	batch.batchCompile();

	return exitCode;
};