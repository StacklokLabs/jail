'use strict';

var regexTester = require('safe-regex-test');

var hasNegativeYear = regexTester(/-000001/);
var negativeDate = -62198755200000;

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (
		typeof Date !== 'function'
		|| typeof Date.prototype.toJSON !== 'function'
		|| new Date(NaN).toJSON() !== null
		|| !hasNegativeYear(new Date(negativeDate).toJSON())
	) {
		return implementation;
	}
	try {
		if (
			Date.prototype.toJSON.call({ toISOString: function () { return 42; } }) !== 42 // Safari 10 throws when toISOString returns a non-primitive
		) {
			return implementation;
		}
	} catch (e) {
		return implementation;
	}

	return Date.prototype.toJSON;
};
