(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["axiosThrottle"] = factory();
	else
		root["axiosThrottle"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	"use strict";
	
	//globals
	var axios = void 0,
	    delayBetweenRequests = void 0;
	/**
	 *
	 * @param {any} axiosArg axios object
	 * @param {number} delayBetweenRequests delay between requests in miliseconds
	 */
	function init(axiosArg, delayBetweenRequestsArg) {
	  axios = axiosArg;
	  delayBetweenRequests = delayBetweenRequestsArg;
	}
	
	/**
	 *
	 * @param {time} time sleep time in miliseconds
	 */
	function sleep(time) {
	  return new Promise(function (resolve) {
	    return setTimeout(resolve, time);
	  });
	}
	
	/**
	 *
	 * @param {any} options axios options
	 * @param {number} index index from urls array
	 */
	function getRequestPromise(options, index) {
	  var _options = JSON.parse(JSON.stringify(options));
	  return sleep(delayBetweenRequests * index).then(function () {
	    return axios(_options);
	  });
	}
	
	var axiosThrottle = {
	  init: init,
	  getRequestPromise: getRequestPromise
	};
	
	module.exports = axiosThrottle;

/***/ })
/******/ ])
});
;
//# sourceMappingURL=index.js.map