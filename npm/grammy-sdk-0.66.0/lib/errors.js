'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.BaseError = (function (_Error) {
  _inherits(BaseError, _Error);

  /**
   * @class BaseError
   * @constructor
   * @private
   * @param  {String} code Error code
   * @param  {String} message Error message
   */

  function BaseError(code, message) {
    _classCallCheck(this, BaseError);

    _get(Object.getPrototypeOf(BaseError.prototype), 'constructor', this).call(this, code + ': ' + message);
    this.code = code;
  }

  _createClass(BaseError, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        code: this.code,
        message: this.message
      };
    }
  }]);

  return BaseError;
})(Error);

exports.FatalError = (function (_exports$BaseError) {
  _inherits(FatalError, _exports$BaseError);

  /**
   * Fatal Error. Error code is `"EFATAL"`.
   * @class FatalError
   * @constructor
   * @param  {String|Error} data Error object or message
   */

  function FatalError(data) {
    _classCallCheck(this, FatalError);

    var error = typeof data === 'string' ? null : data;
    var message = error ? error.message : data;
    _get(Object.getPrototypeOf(FatalError.prototype), 'constructor', this).call(this, 'EFATAL', message);
    if (error) this.stack = error.stack;
  }

  return FatalError;
})(exports.BaseError);

exports.ParseError = (function (_exports$BaseError2) {
  _inherits(ParseError, _exports$BaseError2);

  /**
   * Error during parsing. Error code is `"EPARSE"`.
   * @class ParseError
   * @constructor
   * @param  {String} message Error message
   * @param  {http.IncomingMessage} response Server response
   */

  function ParseError(message, response) {
    _classCallCheck(this, ParseError);

    _get(Object.getPrototypeOf(ParseError.prototype), 'constructor', this).call(this, 'EPARSE', message);
    this.response = response;
  }

  return ParseError;
})(exports.BaseError);

exports.TelegramError = (function (_exports$BaseError3) {
  _inherits(TelegramError, _exports$BaseError3);

  /**
   * Error returned from Telegram. Error code is `"ETELEGRAM"`.
   * @class TelegramError
   * @constructor
   * @param  {String} message Error message
   * @param  {http.IncomingMessage} response Server response
   */

  function TelegramError(message, response) {
    _classCallCheck(this, TelegramError);

    _get(Object.getPrototypeOf(TelegramError.prototype), 'constructor', this).call(this, 'ETELEGRAM', message);
    this.response = response;
  }

  return TelegramError;
})(exports.BaseError);