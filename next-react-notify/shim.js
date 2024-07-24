'use strict';

var $SyntaxError = SyntaxError;

var defineProperties = require('define-properties');

var getPolyfill = require('./polyfill');

module.exports = function shimDateToJSON() {
	if (typeof Date !== 'function') {
		throw new $SyntaxError('`Date` must be present before `Date.prototype.toJSON` can be shimmed');
	}

	var polyfill = getPolyfill();
	defineProperties(
		Date.prototype,
		{ toJSON: polyfill },
		{ toJSON: function () { return Date.prototype.toJSON !== polyfill; } }
	);

	return polyfill;
};
