var fs = require('fs');

// reads lines of given file
module.exports = function(path){
	var text = fs.readFileSync(path, 'utf8');
	return text.split(/\r?\n/);
};