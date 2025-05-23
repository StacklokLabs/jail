"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotFoundError = exports.NetworkError = exports.BadResponseError = exports.BadRequestError = exports.AccountRequiresMemoError = void 0;
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var NetworkError = exports.NetworkError = function (_Error) {
  function NetworkError(message, response) {
    var _this;
    _classCallCheck(this, NetworkError);
    var trueProto = (this instanceof NetworkError ? this.constructor : void 0).prototype;
    _this = _callSuper(this, NetworkError, [message]);
    _this.__proto__ = trueProto;
    _this.constructor = NetworkError;
    _this.response = response;
    return _this;
  }
  _inherits(NetworkError, _Error);
  return _createClass(NetworkError, [{
    key: "getResponse",
    value: function getResponse() {
      return this.response;
    }
  }]);
}(_wrapNativeSuper(Error));
var NotFoundError = exports.NotFoundError = function (_NetworkError) {
  function NotFoundError(message, response) {
    var _this2;
    _classCallCheck(this, NotFoundError);
    var trueProto = (this instanceof NotFoundError ? this.constructor : void 0).prototype;
    _this2 = _callSuper(this, NotFoundError, [message, response]);
    _this2.__proto__ = trueProto;
    _this2.constructor = NotFoundError;
    _this2.name = "NotFoundError";
    return _this2;
  }
  _inherits(NotFoundError, _NetworkError);
  return _createClass(NotFoundError);
}(NetworkError);
var BadRequestError = exports.BadRequestError = function (_NetworkError2) {
  function BadRequestError(message, response) {
    var _this3;
    _classCallCheck(this, BadRequestError);
    var trueProto = (this instanceof BadRequestError ? this.constructor : void 0).prototype;
    _this3 = _callSuper(this, BadRequestError, [message, response]);
    _this3.__proto__ = trueProto;
    _this3.constructor = BadRequestError;
    _this3.name = "BadRequestError";
    return _this3;
  }
  _inherits(BadRequestError, _NetworkError2);
  return _createClass(BadRequestError);
}(NetworkError);
var BadResponseError = exports.BadResponseError = function (_NetworkError3) {
  function BadResponseError(message, response) {
    var _this4;
    _classCallCheck(this, BadResponseError);
    var trueProto = (this instanceof BadResponseError ? this.constructor : void 0).prototype;
    _this4 = _callSuper(this, BadResponseError, [message, response]);
    _this4.__proto__ = trueProto;
    _this4.constructor = BadResponseError;
    _this4.name = "BadResponseError";
    return _this4;
  }
  _inherits(BadResponseError, _NetworkError3);
  return _createClass(BadResponseError);
}(NetworkError);
var AccountRequiresMemoError = exports.AccountRequiresMemoError = function (_Error2) {
  function AccountRequiresMemoError(message, accountId, operationIndex) {
    var _this5;
    _classCallCheck(this, AccountRequiresMemoError);
    var trueProto = (this instanceof AccountRequiresMemoError ? this.constructor : void 0).prototype;
    _this5 = _callSuper(this, AccountRequiresMemoError, [message]);
    _this5.__proto__ = trueProto;
    _this5.constructor = AccountRequiresMemoError;
    _this5.name = "AccountRequiresMemoError";
    _this5.accountId = accountId;
    _this5.operationIndex = operationIndex;
    return _this5;
  }
  _inherits(AccountRequiresMemoError, _Error2);
  return _createClass(AccountRequiresMemoError);
}(_wrapNativeSuper(Error));