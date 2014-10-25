var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var normalizeOptions = require('./opts.js');

module.exports.compile = function(opts, onError) {

	var compilerPath = opts.compiler && fs.existsSync(opts.compiler) ? opts.compiler : tscPath();
	var TypeScript = require('./tsc.js')(compilerPath);
	var tsdir = path.dirname(compilerPath);

	var args = normalizeOptions(opts.args);
	args.push('--nolib');
	args = args.concat(opts.files);
	args.push(path.join(tsdir, 'lib.d.ts'));

	var io = _.extend({}, TypeScript.IO, { arguments: args });

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

// default tsc.js path
function tscPath() {
	var ts = require.resolve("typescript");
	// console.log('typescript module path: %s', ts);
	var dir = path.dirname(ts);
	return path.join(dir, 'tsc.js');
}
