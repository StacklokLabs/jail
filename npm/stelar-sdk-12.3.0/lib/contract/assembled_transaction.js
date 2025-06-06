"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssembledTransaction = void 0;
var _stellarBase = require("@stellar/stellar-base");
var _server = require("../rpc/server");
var _api = require("../rpc/api");
var _transaction = require("../rpc/transaction");
var _rust_result = require("./rust_result");
var _utils = require("./utils");
var _types = require("./types");
var _sent_transaction = require("./sent_transaction");
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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AssembledTransaction = exports.AssembledTransaction = function () {
  function AssembledTransaction(options) {
    var _this = this,
      _this$options$simulat,
      _this$options$allowHt;
    _classCallCheck(this, AssembledTransaction);
    _defineProperty(this, "simulate", _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
      var _restore;
      var _ref2,
        restore,
        account,
        result,
        _this$options$fee,
        _this$options$args,
        _this$options$timeout,
        contract,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, restore = _ref2.restore;
            if (_this.built) {
              _context.next = 5;
              break;
            }
            if (_this.raw) {
              _context.next = 4;
              break;
            }
            throw new Error("Transaction has not yet been assembled; " + "call `AssembledTransaction.build` first.");
          case 4:
            _this.built = _this.raw.build();
          case 5:
            restore = (_restore = restore) !== null && _restore !== void 0 ? _restore : _this.options.restore;
            delete _this.simulationResult;
            delete _this.simulationTransactionData;
            _context.next = 10;
            return _this.server.simulateTransaction(_this.built);
          case 10:
            _this.simulation = _context.sent;
            if (!(restore && _api.Api.isSimulationRestore(_this.simulation))) {
              _context.next = 25;
              break;
            }
            _context.next = 14;
            return (0, _utils.getAccount)(_this.options, _this.server);
          case 14:
            account = _context.sent;
            _context.next = 17;
            return _this.restoreFootprint(_this.simulation.restorePreamble, account);
          case 17:
            result = _context.sent;
            if (!(result.status === _api.Api.GetTransactionStatus.SUCCESS)) {
              _context.next = 24;
              break;
            }
            contract = new _stellarBase.Contract(_this.options.contractId);
            _this.raw = new _stellarBase.TransactionBuilder(account, {
              fee: (_this$options$fee = _this.options.fee) !== null && _this$options$fee !== void 0 ? _this$options$fee : _stellarBase.BASE_FEE,
              networkPassphrase: _this.options.networkPassphrase
            }).addOperation(contract.call.apply(contract, [_this.options.method].concat(_toConsumableArray((_this$options$args = _this.options.args) !== null && _this$options$args !== void 0 ? _this$options$args : [])))).setTimeout((_this$options$timeout = _this.options.timeoutInSeconds) !== null && _this$options$timeout !== void 0 ? _this$options$timeout : _types.DEFAULT_TIMEOUT);
            _context.next = 23;
            return _this.simulate();
          case 23:
            return _context.abrupt("return", _this);
          case 24:
            throw new AssembledTransaction.Errors.RestorationFailure("Automatic restore failed! You set 'restore: true' but the attempted restore did not work. Result:\n".concat(JSON.stringify(result)));
          case 25:
            if (_api.Api.isSimulationSuccess(_this.simulation)) {
              _this.built = (0, _transaction.assembleTransaction)(_this.built, _this.simulation).build();
            }
            return _context.abrupt("return", _this);
          case 27:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
    _defineProperty(this, "sign", _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
      var _this$options$timeout2;
      var _ref4,
        _ref4$force,
        force,
        _ref4$signTransaction,
        signTransaction,
        timeoutInSeconds,
        signature,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _ref4 = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {}, _ref4$force = _ref4.force, force = _ref4$force === void 0 ? false : _ref4$force, _ref4$signTransaction = _ref4.signTransaction, signTransaction = _ref4$signTransaction === void 0 ? _this.options.signTransaction : _ref4$signTransaction;
            if (_this.built) {
              _context2.next = 3;
              break;
            }
            throw new Error("Transaction has not yet been simulated");
          case 3:
            if (!(!force && _this.isReadCall)) {
              _context2.next = 5;
              break;
            }
            throw new AssembledTransaction.Errors.NoSignatureNeeded("This is a read call. It requires no signature or sending. " + "Use `force: true` to sign and send anyway.");
          case 5:
            if (signTransaction) {
              _context2.next = 7;
              break;
            }
            throw new AssembledTransaction.Errors.NoSigner("You must provide a signTransaction function, either when calling " + "`signAndSend` or when initializing your Client");
          case 7:
            if (!_this.needsNonInvokerSigningBy().length) {
              _context2.next = 9;
              break;
            }
            throw new AssembledTransaction.Errors.NeedsMoreSignatures("Transaction requires more signatures. " + "See `needsNonInvokerSigningBy` for details.");
          case 9:
            timeoutInSeconds = (_this$options$timeout2 = _this.options.timeoutInSeconds) !== null && _this$options$timeout2 !== void 0 ? _this$options$timeout2 : _types.DEFAULT_TIMEOUT;
            _this.built = _stellarBase.TransactionBuilder.cloneFrom(_this.built, {
              fee: _this.built.fee,
              timebounds: undefined,
              sorobanData: _this.simulationData.transactionData
            }).setTimeout(timeoutInSeconds).build();
            _context2.next = 13;
            return signTransaction(_this.built.toXDR(), {
              networkPassphrase: _this.options.networkPassphrase
            });
          case 13:
            signature = _context2.sent;
            _this.signed = _stellarBase.TransactionBuilder.fromXDR(signature, _this.options.networkPassphrase);
          case 15:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
    _defineProperty(this, "signAndSend", _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
      var _ref6,
        _ref6$force,
        force,
        _ref6$signTransaction,
        signTransaction,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _ref6 = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref6$force = _ref6.force, force = _ref6$force === void 0 ? false : _ref6$force, _ref6$signTransaction = _ref6.signTransaction, signTransaction = _ref6$signTransaction === void 0 ? _this.options.signTransaction : _ref6$signTransaction;
            if (_this.signed) {
              _context3.next = 4;
              break;
            }
            _context3.next = 4;
            return _this.sign({
              force: force,
              signTransaction: signTransaction
            });
          case 4:
            return _context3.abrupt("return", _this.send());
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
    _defineProperty(this, "needsNonInvokerSigningBy", function () {
      var _rawInvokeHostFunctio;
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$includeAlreadyS = _ref7.includeAlreadySigned,
        includeAlreadySigned = _ref7$includeAlreadyS === void 0 ? false : _ref7$includeAlreadyS;
      if (!_this.built) {
        throw new Error("Transaction has not yet been simulated");
      }
      if (!("operations" in _this.built)) {
        throw new Error("Unexpected Transaction type; no operations: ".concat(JSON.stringify(_this.built)));
      }
      var rawInvokeHostFunctionOp = _this.built.operations[0];
      return _toConsumableArray(new Set(((_rawInvokeHostFunctio = rawInvokeHostFunctionOp.auth) !== null && _rawInvokeHostFunctio !== void 0 ? _rawInvokeHostFunctio : []).filter(function (entry) {
        return entry.credentials().switch() === _stellarBase.xdr.SorobanCredentialsType.sorobanCredentialsAddress() && (includeAlreadySigned || entry.credentials().address().signature().switch().name === "scvVoid");
      }).map(function (entry) {
        return _stellarBase.StrKey.encodeEd25519PublicKey(entry.credentials().address().address().accountId().ed25519());
      })));
    });
    _defineProperty(this, "signAuthEntries", _asyncToGenerator(_regeneratorRuntime().mark(function _callee6() {
      var _rawInvokeHostFunctio2;
      var _ref9,
        _ref9$expiration,
        expiration,
        _ref9$signAuthEntry,
        signAuthEntry,
        _ref9$publicKey,
        publicKey,
        needsNonInvokerSigningBy,
        rawInvokeHostFunctionOp,
        authEntries,
        _iterator,
        _step,
        _step$value,
        i,
        entry,
        pk,
        _args6 = arguments;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _ref9 = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {}, _ref9$expiration = _ref9.expiration, expiration = _ref9$expiration === void 0 ? _asyncToGenerator(_regeneratorRuntime().mark(function _callee4() {
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return _this.server.getLatestLedger();
                  case 2:
                    _context4.t0 = _context4.sent.sequence;
                    return _context4.abrupt("return", _context4.t0 + 100);
                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }))() : _ref9$expiration, _ref9$signAuthEntry = _ref9.signAuthEntry, signAuthEntry = _ref9$signAuthEntry === void 0 ? _this.options.signAuthEntry : _ref9$signAuthEntry, _ref9$publicKey = _ref9.publicKey, publicKey = _ref9$publicKey === void 0 ? _this.options.publicKey : _ref9$publicKey;
            if (_this.built) {
              _context6.next = 3;
              break;
            }
            throw new Error("Transaction has not yet been assembled or simulated");
          case 3:
            needsNonInvokerSigningBy = _this.needsNonInvokerSigningBy();
            if (needsNonInvokerSigningBy) {
              _context6.next = 6;
              break;
            }
            throw new AssembledTransaction.Errors.NoUnsignedNonInvokerAuthEntries("No unsigned non-invoker auth entries; maybe you already signed?");
          case 6:
            if (!(needsNonInvokerSigningBy.indexOf(publicKey !== null && publicKey !== void 0 ? publicKey : "") === -1)) {
              _context6.next = 8;
              break;
            }
            throw new AssembledTransaction.Errors.NoSignatureNeeded("No auth entries for public key \"".concat(publicKey, "\""));
          case 8:
            if (signAuthEntry) {
              _context6.next = 10;
              break;
            }
            throw new AssembledTransaction.Errors.NoSigner("You must provide `signAuthEntry` when calling `signAuthEntries`, " + "or when constructing the `Client` or `AssembledTransaction`");
          case 10:
            rawInvokeHostFunctionOp = _this.built.operations[0];
            authEntries = (_rawInvokeHostFunctio2 = rawInvokeHostFunctionOp.auth) !== null && _rawInvokeHostFunctio2 !== void 0 ? _rawInvokeHostFunctio2 : [];
            _iterator = _createForOfIteratorHelper(authEntries.entries());
            _context6.prev = 13;
            _iterator.s();
          case 15:
            if ((_step = _iterator.n()).done) {
              _context6.next = 34;
              break;
            }
            _step$value = _slicedToArray(_step.value, 2), i = _step$value[0], entry = _step$value[1];
            if (!(entry.credentials().switch() !== _stellarBase.xdr.SorobanCredentialsType.sorobanCredentialsAddress())) {
              _context6.next = 19;
              break;
            }
            return _context6.abrupt("continue", 32);
          case 19:
            pk = _stellarBase.StrKey.encodeEd25519PublicKey(entry.credentials().address().address().accountId().ed25519());
            if (!(pk !== publicKey)) {
              _context6.next = 22;
              break;
            }
            return _context6.abrupt("continue", 32);
          case 22:
            _context6.t0 = _stellarBase.authorizeEntry;
            _context6.t1 = entry;
            _context6.t2 = function () {
              var _ref11 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(preimage) {
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.t0 = Buffer;
                      _context5.next = 3;
                      return signAuthEntry(preimage.toXDR("base64"));
                    case 3:
                      _context5.t1 = _context5.sent;
                      return _context5.abrupt("return", _context5.t0.from.call(_context5.t0, _context5.t1, "base64"));
                    case 5:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }));
              return function (_x) {
                return _ref11.apply(this, arguments);
              };
            }();
            _context6.next = 27;
            return expiration;
          case 27:
            _context6.t3 = _context6.sent;
            _context6.t4 = _this.options.networkPassphrase;
            _context6.next = 31;
            return (0, _context6.t0)(_context6.t1, _context6.t2, _context6.t3, _context6.t4);
          case 31:
            authEntries[i] = _context6.sent;
          case 32:
            _context6.next = 15;
            break;
          case 34:
            _context6.next = 39;
            break;
          case 36:
            _context6.prev = 36;
            _context6.t5 = _context6["catch"](13);
            _iterator.e(_context6.t5);
          case 39:
            _context6.prev = 39;
            _iterator.f();
            return _context6.finish(39);
          case 42:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[13, 36, 39, 42]]);
    })));
    this.options = options;
    this.options.simulate = (_this$options$simulat = this.options.simulate) !== null && _this$options$simulat !== void 0 ? _this$options$simulat : true;
    this.server = new _server.Server(this.options.rpcUrl, {
      allowHttp: (_this$options$allowHt = this.options.allowHttp) !== null && _this$options$allowHt !== void 0 ? _this$options$allowHt : false
    });
  }
  return _createClass(AssembledTransaction, [{
    key: "toJSON",
    value: function toJSON() {
      var _this$built;
      return JSON.stringify({
        method: this.options.method,
        tx: (_this$built = this.built) === null || _this$built === void 0 ? void 0 : _this$built.toXDR(),
        simulationResult: {
          auth: this.simulationData.result.auth.map(function (a) {
            return a.toXDR("base64");
          }),
          retval: this.simulationData.result.retval.toXDR("base64")
        },
        simulationTransactionData: this.simulationData.transactionData.toXDR("base64")
      });
    }
  }, {
    key: "toXDR",
    value: function toXDR() {
      var _this$built2;
      if (!this.built) throw new Error("Transaction has not yet been simulated; " + "call `AssembledTransaction.simulate` first.");
      return (_this$built2 = this.built) === null || _this$built2 === void 0 ? void 0 : _this$built2.toEnvelope().toXDR('base64');
    }
  }, {
    key: "simulationData",
    get: function get() {
      var _simulation$result;
      if (this.simulationResult && this.simulationTransactionData) {
        return {
          result: this.simulationResult,
          transactionData: this.simulationTransactionData
        };
      }
      var simulation = this.simulation;
      if (!simulation) {
        throw new AssembledTransaction.Errors.NotYetSimulated("Transaction has not yet been simulated");
      }
      if (_api.Api.isSimulationError(simulation)) {
        throw new Error("Transaction simulation failed: \"".concat(simulation.error, "\""));
      }
      if (_api.Api.isSimulationRestore(simulation)) {
        throw new AssembledTransaction.Errors.ExpiredState("You need to restore some contract state before you can invoke this method.\n" + 'You can set `restore` to true in the method options in order to ' + 'automatically restore the contract state when needed.');
      }
      this.simulationResult = (_simulation$result = simulation.result) !== null && _simulation$result !== void 0 ? _simulation$result : {
        auth: [],
        retval: _stellarBase.xdr.ScVal.scvVoid()
      };
      this.simulationTransactionData = simulation.transactionData.build();
      return {
        result: this.simulationResult,
        transactionData: this.simulationTransactionData
      };
    }
  }, {
    key: "result",
    get: function get() {
      try {
        if (!this.simulationData.result) {
          throw new Error("No simulation result!");
        }
        return this.options.parseResultXdr(this.simulationData.result.retval);
      } catch (e) {
        if (!(0, _utils.implementsToString)(e)) throw e;
        var err = this.parseError(e.toString());
        if (err) return err;
        throw e;
      }
    }
  }, {
    key: "parseError",
    value: function parseError(errorMessage) {
      if (!this.options.errorTypes) return undefined;
      var match = errorMessage.match(_utils.contractErrorPattern);
      if (!match) return undefined;
      var i = parseInt(match[1], 10);
      var err = this.options.errorTypes[i];
      if (!err) return undefined;
      return new _rust_result.Err(err);
    }
  }, {
    key: "send",
    value: (function () {
      var _send = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7() {
        var sent;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              if (this.signed) {
                _context7.next = 2;
                break;
              }
              throw new Error("The transaction has not yet been signed. Run `sign` first, or use `signAndSend` instead.");
            case 2:
              _context7.next = 4;
              return _sent_transaction.SentTransaction.init(undefined, this);
            case 4:
              sent = _context7.sent;
              return _context7.abrupt("return", sent);
            case 6:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function send() {
        return _send.apply(this, arguments);
      }
      return send;
    }())
  }, {
    key: "isReadCall",
    get: function get() {
      var authsCount = this.simulationData.result.auth.length;
      var writeLength = this.simulationData.transactionData.resources().footprint().readWrite().length;
      return authsCount === 0 && writeLength === 0;
    }
  }, {
    key: "restoreFootprint",
    value: (function () {
      var _restoreFootprint = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8(restorePreamble, account) {
        var _account;
        var restoreTx, sentTransaction;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (this.options.signTransaction) {
                _context8.next = 2;
                break;
              }
              throw new Error("For automatic restore to work you must provide a signTransaction function when initializing your Client");
            case 2:
              if (!((_account = account) !== null && _account !== void 0)) {
                _context8.next = 6;
                break;
              }
              _context8.t0 = _account;
              _context8.next = 9;
              break;
            case 6:
              _context8.next = 8;
              return (0, _utils.getAccount)(this.options, this.server);
            case 8:
              _context8.t0 = _context8.sent;
            case 9:
              account = _context8.t0;
              _context8.next = 12;
              return AssembledTransaction.buildFootprintRestoreTransaction(_objectSpread({}, this.options), restorePreamble.transactionData, account, restorePreamble.minResourceFee);
            case 12:
              restoreTx = _context8.sent;
              _context8.next = 15;
              return restoreTx.signAndSend();
            case 15:
              sentTransaction = _context8.sent;
              if (sentTransaction.getTransactionResponse) {
                _context8.next = 18;
                break;
              }
              throw new AssembledTransaction.Errors.RestorationFailure("The attempt at automatic restore failed. \n".concat(JSON.stringify(sentTransaction)));
            case 18:
              return _context8.abrupt("return", sentTransaction.getTransactionResponse);
            case 19:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function restoreFootprint(_x2, _x3) {
        return _restoreFootprint.apply(this, arguments);
      }
      return restoreFootprint;
    }())
  }], [{
    key: "fromJSON",
    value: function fromJSON(options, _ref12) {
      var tx = _ref12.tx,
        simulationResult = _ref12.simulationResult,
        simulationTransactionData = _ref12.simulationTransactionData;
      var txn = new AssembledTransaction(options);
      txn.built = _stellarBase.TransactionBuilder.fromXDR(tx, options.networkPassphrase);
      txn.simulationResult = {
        auth: simulationResult.auth.map(function (a) {
          return _stellarBase.xdr.SorobanAuthorizationEntry.fromXDR(a, "base64");
        }),
        retval: _stellarBase.xdr.ScVal.fromXDR(simulationResult.retval, "base64")
      };
      txn.simulationTransactionData = _stellarBase.xdr.SorobanTransactionData.fromXDR(simulationTransactionData, "base64");
      return txn;
    }
  }, {
    key: "fromXDR",
    value: function fromXDR(options, encodedXDR, spec) {
      var _operation$func;
      var envelope = _stellarBase.xdr.TransactionEnvelope.fromXDR(encodedXDR, "base64");
      var built = _stellarBase.TransactionBuilder.fromXDR(envelope, options.networkPassphrase);
      var operation = built.operations[0];
      if (!(operation !== null && operation !== void 0 && (_operation$func = operation.func) !== null && _operation$func !== void 0 && _operation$func.value) || typeof operation.func.value !== 'function') {
        throw new Error("Could not extract the method from the transaction envelope.");
      }
      var invokeContractArgs = operation.func.value();
      if (!(invokeContractArgs !== null && invokeContractArgs !== void 0 && invokeContractArgs.functionName)) {
        throw new Error("Could not extract the method name from the transaction envelope.");
      }
      var method = invokeContractArgs.functionName().toString('utf-8');
      var txn = new AssembledTransaction(_objectSpread(_objectSpread({}, options), {}, {
        method: method,
        parseResultXdr: function parseResultXdr(result) {
          return spec.funcResToNative(method, result);
        }
      }));
      txn.built = built;
      return txn;
    }
  }, {
    key: "build",
    value: (function () {
      var _build = _asyncToGenerator(_regeneratorRuntime().mark(function _callee9(options) {
        var _options$fee, _options$args, _options$timeoutInSec;
        var tx, contract, account;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              tx = new AssembledTransaction(options);
              contract = new _stellarBase.Contract(options.contractId);
              _context9.next = 4;
              return (0, _utils.getAccount)(options, tx.server);
            case 4:
              account = _context9.sent;
              tx.raw = new _stellarBase.TransactionBuilder(account, {
                fee: (_options$fee = options.fee) !== null && _options$fee !== void 0 ? _options$fee : _stellarBase.BASE_FEE,
                networkPassphrase: options.networkPassphrase
              }).addOperation(contract.call.apply(contract, [options.method].concat(_toConsumableArray((_options$args = options.args) !== null && _options$args !== void 0 ? _options$args : [])))).setTimeout((_options$timeoutInSec = options.timeoutInSeconds) !== null && _options$timeoutInSec !== void 0 ? _options$timeoutInSec : _types.DEFAULT_TIMEOUT);
              if (!options.simulate) {
                _context9.next = 9;
                break;
              }
              _context9.next = 9;
              return tx.simulate();
            case 9:
              return _context9.abrupt("return", tx);
            case 10:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function build(_x4) {
        return _build.apply(this, arguments);
      }
      return build;
    }())
  }, {
    key: "buildFootprintRestoreTransaction",
    value: function () {
      var _buildFootprintRestoreTransaction = _asyncToGenerator(_regeneratorRuntime().mark(function _callee10(options, sorobanData, account, fee) {
        var _options$timeoutInSec2;
        var tx;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              tx = new AssembledTransaction(options);
              tx.raw = new _stellarBase.TransactionBuilder(account, {
                fee: fee,
                networkPassphrase: options.networkPassphrase
              }).setSorobanData(sorobanData instanceof _stellarBase.SorobanDataBuilder ? sorobanData.build() : sorobanData).addOperation(_stellarBase.Operation.restoreFootprint({})).setTimeout((_options$timeoutInSec2 = options.timeoutInSeconds) !== null && _options$timeoutInSec2 !== void 0 ? _options$timeoutInSec2 : _types.DEFAULT_TIMEOUT);
              _context10.next = 4;
              return tx.simulate({
                restore: false
              });
            case 4:
              return _context10.abrupt("return", tx);
            case 5:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function buildFootprintRestoreTransaction(_x5, _x6, _x7, _x8) {
        return _buildFootprintRestoreTransaction.apply(this, arguments);
      }
      return buildFootprintRestoreTransaction;
    }()
  }]);
}();
_defineProperty(AssembledTransaction, "Errors", {
  ExpiredState: function (_Error) {
    function ExpiredStateError() {
      _classCallCheck(this, ExpiredStateError);
      return _callSuper(this, ExpiredStateError, arguments);
    }
    _inherits(ExpiredStateError, _Error);
    return _createClass(ExpiredStateError);
  }(_wrapNativeSuper(Error)),
  RestorationFailure: function (_Error2) {
    function RestoreFailureError() {
      _classCallCheck(this, RestoreFailureError);
      return _callSuper(this, RestoreFailureError, arguments);
    }
    _inherits(RestoreFailureError, _Error2);
    return _createClass(RestoreFailureError);
  }(_wrapNativeSuper(Error)),
  NeedsMoreSignatures: function (_Error3) {
    function NeedsMoreSignaturesError() {
      _classCallCheck(this, NeedsMoreSignaturesError);
      return _callSuper(this, NeedsMoreSignaturesError, arguments);
    }
    _inherits(NeedsMoreSignaturesError, _Error3);
    return _createClass(NeedsMoreSignaturesError);
  }(_wrapNativeSuper(Error)),
  NoSignatureNeeded: function (_Error4) {
    function NoSignatureNeededError() {
      _classCallCheck(this, NoSignatureNeededError);
      return _callSuper(this, NoSignatureNeededError, arguments);
    }
    _inherits(NoSignatureNeededError, _Error4);
    return _createClass(NoSignatureNeededError);
  }(_wrapNativeSuper(Error)),
  NoUnsignedNonInvokerAuthEntries: function (_Error5) {
    function NoUnsignedNonInvokerAuthEntriesError() {
      _classCallCheck(this, NoUnsignedNonInvokerAuthEntriesError);
      return _callSuper(this, NoUnsignedNonInvokerAuthEntriesError, arguments);
    }
    _inherits(NoUnsignedNonInvokerAuthEntriesError, _Error5);
    return _createClass(NoUnsignedNonInvokerAuthEntriesError);
  }(_wrapNativeSuper(Error)),
  NoSigner: function (_Error6) {
    function NoSignerError() {
      _classCallCheck(this, NoSignerError);
      return _callSuper(this, NoSignerError, arguments);
    }
    _inherits(NoSignerError, _Error6);
    return _createClass(NoSignerError);
  }(_wrapNativeSuper(Error)),
  NotYetSimulated: function (_Error7) {
    function NotYetSimulatedError() {
      _classCallCheck(this, NotYetSimulatedError);
      return _callSuper(this, NotYetSimulatedError, arguments);
    }
    _inherits(NotYetSimulatedError, _Error7);
    return _createClass(NotYetSimulatedError);
  }(_wrapNativeSuper(Error)),
  FakeAccount: function (_Error8) {
    function FakeAccountError() {
      _classCallCheck(this, FakeAccountError);
      return _callSuper(this, FakeAccountError, arguments);
    }
    _inherits(FakeAccountError, _Error8);
    return _createClass(FakeAccountError);
  }(_wrapNativeSuper(Error))
});