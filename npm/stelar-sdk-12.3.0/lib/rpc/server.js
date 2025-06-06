"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = exports.SUBMIT_TRANSACTION_TIMEOUT = exports.Durability = void 0;
var _urijs = _interopRequireDefault(require("urijs"));
var _stellarBase = require("@stellar/stellar-base");
var _axios = _interopRequireDefault(require("./axios"));
var jsonrpc = _interopRequireWildcard(require("./jsonrpc"));
var _api = require("./api");
var _transaction = require("./transaction");
var _parsers = require("./parsers");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { "use strict"; _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SUBMIT_TRANSACTION_TIMEOUT = exports.SUBMIT_TRANSACTION_TIMEOUT = 60 * 1000;
var Durability = exports.Durability = function (Durability) {
  Durability["Temporary"] = "temporary";
  Durability["Persistent"] = "persistent";
  return Durability;
}({});
function findCreatedAccountSequenceInTransactionMeta(meta) {
  var _operations$flatMap$f;
  var operations = [];
  switch (meta.switch()) {
    case 0:
      operations = meta.operations();
      break;
    case 1:
    case 2:
    case 3:
      operations = meta.value().operations();
      break;
    default:
      throw new Error('Unexpected transaction meta switch value');
  }
  var sequenceNumber = (_operations$flatMap$f = operations.flatMap(function (op) {
    return op.changes();
  }).find(function (c) {
    return c.switch() === _stellarBase.xdr.LedgerEntryChangeType.ledgerEntryCreated() && c.created().data().switch() === _stellarBase.xdr.LedgerEntryType.account();
  })) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.created()) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.data()) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.account()) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.seqNum()) === null || _operations$flatMap$f === void 0 ? void 0 : _operations$flatMap$f.toString();
  if (sequenceNumber) {
    return sequenceNumber;
  }
  throw new Error('No account created in transaction');
}
var Server = exports.Server = function () {
  function Server(serverURL) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Server);
    this.serverURL = (0, _urijs.default)(serverURL);
    if (opts.headers && Object.keys(opts.headers).length !== 0) {
      _axios.default.interceptors.request.use(function (config) {
        config.headers = Object.assign(config.headers, opts.headers);
        return config;
      });
    }
    if (this.serverURL.protocol() !== 'https' && !opts.allowHttp) {
      throw new Error("Cannot connect to insecure Soroban RPC server if `allowHttp` isn't set");
    }
  }
  return _createClass(Server, [{
    key: "getAccount",
    value: (function () {
      var _getAccount = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(address) {
        var ledgerKey, resp, accountEntry;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              ledgerKey = _stellarBase.xdr.LedgerKey.account(new _stellarBase.xdr.LedgerKeyAccount({
                accountId: _stellarBase.Keypair.fromPublicKey(address).xdrPublicKey()
              }));
              _context.next = 3;
              return this.getLedgerEntries(ledgerKey);
            case 3:
              resp = _context.sent;
              if (!(resp.entries.length === 0)) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", Promise.reject({
                code: 404,
                message: "Account not found: ".concat(address)
              }));
            case 6:
              accountEntry = resp.entries[0].val.account();
              return _context.abrupt("return", new _stellarBase.Account(address, accountEntry.seqNum().toString()));
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getAccount(_x) {
        return _getAccount.apply(this, arguments);
      }
      return getAccount;
    }())
  }, {
    key: "getHealth",
    value: (function () {
      var _getHealth = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getHealth'));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getHealth() {
        return _getHealth.apply(this, arguments);
      }
      return getHealth;
    }())
  }, {
    key: "getContractData",
    value: (function () {
      var _getContractData = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(contract, key) {
        var durability,
          scAddress,
          xdrDurability,
          contractKey,
          _args3 = arguments;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              durability = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : Durability.Persistent;
              if (!(typeof contract === 'string')) {
                _context3.next = 5;
                break;
              }
              scAddress = new _stellarBase.Contract(contract).address().toScAddress();
              _context3.next = 14;
              break;
            case 5:
              if (!(contract instanceof _stellarBase.Address)) {
                _context3.next = 9;
                break;
              }
              scAddress = contract.toScAddress();
              _context3.next = 14;
              break;
            case 9:
              if (!(contract instanceof _stellarBase.Contract)) {
                _context3.next = 13;
                break;
              }
              scAddress = contract.address().toScAddress();
              _context3.next = 14;
              break;
            case 13:
              throw new TypeError("unknown contract type: ".concat(contract));
            case 14:
              _context3.t0 = durability;
              _context3.next = _context3.t0 === Durability.Temporary ? 17 : _context3.t0 === Durability.Persistent ? 19 : 21;
              break;
            case 17:
              xdrDurability = _stellarBase.xdr.ContractDataDurability.temporary();
              return _context3.abrupt("break", 22);
            case 19:
              xdrDurability = _stellarBase.xdr.ContractDataDurability.persistent();
              return _context3.abrupt("break", 22);
            case 21:
              throw new TypeError("invalid durability: ".concat(durability));
            case 22:
              contractKey = _stellarBase.xdr.LedgerKey.contractData(new _stellarBase.xdr.LedgerKeyContractData({
                key: key,
                contract: scAddress,
                durability: xdrDurability
              }));
              return _context3.abrupt("return", this.getLedgerEntries(contractKey).then(function (r) {
                if (r.entries.length === 0) {
                  return Promise.reject({
                    code: 404,
                    message: "Contract data not found. Contract: ".concat(_stellarBase.Address.fromScAddress(scAddress).toString(), ", Key: ").concat(key.toXDR('base64'), ", Durability: ").concat(durability)
                  });
                }
                return r.entries[0];
              }));
            case 24:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getContractData(_x2, _x3) {
        return _getContractData.apply(this, arguments);
      }
      return getContractData;
    }())
  }, {
    key: "getContractWasmByContractId",
    value: (function () {
      var _getContractWasmByContractId = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(contractId) {
        var _response$entries$;
        var contractLedgerKey, response, wasmHash;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              contractLedgerKey = new _stellarBase.Contract(contractId).getFootprint();
              _context4.next = 3;
              return this.getLedgerEntries(contractLedgerKey);
            case 3:
              response = _context4.sent;
              if (!(!response.entries.length || !((_response$entries$ = response.entries[0]) !== null && _response$entries$ !== void 0 && _response$entries$.val))) {
                _context4.next = 6;
                break;
              }
              return _context4.abrupt("return", Promise.reject({
                code: 404,
                message: "Could not obtain contract hash from server"
              }));
            case 6:
              wasmHash = response.entries[0].val.contractData().val().instance().executable().wasmHash();
              return _context4.abrupt("return", this.getContractWasmByHash(wasmHash));
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getContractWasmByContractId(_x4) {
        return _getContractWasmByContractId.apply(this, arguments);
      }
      return getContractWasmByContractId;
    }())
  }, {
    key: "getContractWasmByHash",
    value: (function () {
      var _getContractWasmByHash = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(wasmHash) {
        var _responseWasm$entries;
        var format,
          wasmHashBuffer,
          ledgerKeyWasmHash,
          responseWasm,
          wasmBuffer,
          _args5 = arguments;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              format = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : undefined;
              wasmHashBuffer = typeof wasmHash === "string" ? Buffer.from(wasmHash, format) : wasmHash;
              ledgerKeyWasmHash = _stellarBase.xdr.LedgerKey.contractCode(new _stellarBase.xdr.LedgerKeyContractCode({
                hash: wasmHashBuffer
              }));
              _context5.next = 5;
              return this.getLedgerEntries(ledgerKeyWasmHash);
            case 5:
              responseWasm = _context5.sent;
              if (!(!responseWasm.entries.length || !((_responseWasm$entries = responseWasm.entries[0]) !== null && _responseWasm$entries !== void 0 && _responseWasm$entries.val))) {
                _context5.next = 8;
                break;
              }
              return _context5.abrupt("return", Promise.reject({
                code: 404,
                message: "Could not obtain contract wasm from server"
              }));
            case 8:
              wasmBuffer = responseWasm.entries[0].val.contractCode().code();
              return _context5.abrupt("return", wasmBuffer);
            case 10:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function getContractWasmByHash(_x5) {
        return _getContractWasmByHash.apply(this, arguments);
      }
      return getContractWasmByHash;
    }())
  }, {
    key: "getLedgerEntries",
    value: (function () {
      var _getLedgerEntries2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6() {
        var _args6 = arguments;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt("return", this._getLedgerEntries.apply(this, _args6).then(_parsers.parseRawLedgerEntries));
            case 1:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function getLedgerEntries() {
        return _getLedgerEntries2.apply(this, arguments);
      }
      return getLedgerEntries;
    }())
  }, {
    key: "_getLedgerEntries",
    value: function () {
      var _getLedgerEntries3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7() {
        var _len,
          keys,
          _key,
          _args7 = arguments;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              for (_len = _args7.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
                keys[_key] = _args7[_key];
              }
              return _context7.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getLedgerEntries', {
                keys: keys.map(function (k) {
                  return k.toXDR('base64');
                })
              }));
            case 2:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function _getLedgerEntries() {
        return _getLedgerEntries3.apply(this, arguments);
      }
      return _getLedgerEntries;
    }()
  }, {
    key: "getTransaction",
    value: (function () {
      var _getTransaction2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8(hash) {
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt("return", this._getTransaction(hash).then(function (raw) {
                var foundInfo = {};
                if (raw.status !== _api.Api.GetTransactionStatus.NOT_FOUND) {
                  Object.assign(foundInfo, (0, _parsers.parseTransactionInfo)(raw));
                }
                var result = _objectSpread({
                  status: raw.status,
                  latestLedger: raw.latestLedger,
                  latestLedgerCloseTime: raw.latestLedgerCloseTime,
                  oldestLedger: raw.oldestLedger,
                  oldestLedgerCloseTime: raw.oldestLedgerCloseTime
                }, foundInfo);
                return result;
              }));
            case 1:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function getTransaction(_x6) {
        return _getTransaction2.apply(this, arguments);
      }
      return getTransaction;
    }())
  }, {
    key: "_getTransaction",
    value: function () {
      var _getTransaction3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee9(hash) {
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getTransaction', {
                hash: hash
              }));
            case 1:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function _getTransaction(_x7) {
        return _getTransaction3.apply(this, arguments);
      }
      return _getTransaction;
    }()
  }, {
    key: "getTransactions",
    value: (function () {
      var _getTransactions2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee10(request) {
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", this._getTransactions(request).then(function (raw) {
                var result = {
                  transactions: raw.transactions.map(_parsers.parseRawTransactions),
                  latestLedger: raw.latestLedger,
                  latestLedgerCloseTimestamp: raw.latestLedgerCloseTimestamp,
                  oldestLedger: raw.oldestLedger,
                  oldestLedgerCloseTimestamp: raw.oldestLedgerCloseTimestamp,
                  cursor: raw.cursor
                };
                return result;
              }));
            case 1:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function getTransactions(_x8) {
        return _getTransactions2.apply(this, arguments);
      }
      return getTransactions;
    }())
  }, {
    key: "_getTransactions",
    value: function () {
      var _getTransactions3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee11(request) {
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              return _context11.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getTransactions', request));
            case 1:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function _getTransactions(_x9) {
        return _getTransactions3.apply(this, arguments);
      }
      return _getTransactions;
    }()
  }, {
    key: "getEvents",
    value: (function () {
      var _getEvents2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee12(request) {
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              return _context12.abrupt("return", this._getEvents(request).then(_parsers.parseRawEvents));
            case 1:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function getEvents(_x10) {
        return _getEvents2.apply(this, arguments);
      }
      return getEvents;
    }())
  }, {
    key: "_getEvents",
    value: function () {
      var _getEvents3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee13(request) {
        var _request$filters;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              return _context13.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getEvents', _objectSpread({
                filters: (_request$filters = request.filters) !== null && _request$filters !== void 0 ? _request$filters : [],
                pagination: _objectSpread(_objectSpread({}, request.cursor && {
                  cursor: request.cursor
                }), request.limit && {
                  limit: request.limit
                })
              }, request.startLedger && {
                startLedger: request.startLedger
              })));
            case 1:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function _getEvents(_x11) {
        return _getEvents3.apply(this, arguments);
      }
      return _getEvents;
    }()
  }, {
    key: "getNetwork",
    value: (function () {
      var _getNetwork = _asyncToGenerator(_regeneratorRuntime().mark(function _callee14() {
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              return _context14.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getNetwork'));
            case 1:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function getNetwork() {
        return _getNetwork.apply(this, arguments);
      }
      return getNetwork;
    }())
  }, {
    key: "getLatestLedger",
    value: (function () {
      var _getLatestLedger = _asyncToGenerator(_regeneratorRuntime().mark(function _callee15() {
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              return _context15.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getLatestLedger'));
            case 1:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this);
      }));
      function getLatestLedger() {
        return _getLatestLedger.apply(this, arguments);
      }
      return getLatestLedger;
    }())
  }, {
    key: "simulateTransaction",
    value: (function () {
      var _simulateTransaction2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee16(tx, addlResources) {
        return _regeneratorRuntime().wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              return _context16.abrupt("return", this._simulateTransaction(tx, addlResources).then(_parsers.parseRawSimulation));
            case 1:
            case "end":
              return _context16.stop();
          }
        }, _callee16, this);
      }));
      function simulateTransaction(_x12, _x13) {
        return _simulateTransaction2.apply(this, arguments);
      }
      return simulateTransaction;
    }())
  }, {
    key: "_simulateTransaction",
    value: function () {
      var _simulateTransaction3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee17(transaction, addlResources) {
        return _regeneratorRuntime().wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              return _context17.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'simulateTransaction', _objectSpread({
                transaction: transaction.toXDR()
              }, addlResources !== undefined && {
                resourceConfig: {
                  instructionLeeway: addlResources.cpuInstructions
                }
              })));
            case 1:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this);
      }));
      function _simulateTransaction(_x14, _x15) {
        return _simulateTransaction3.apply(this, arguments);
      }
      return _simulateTransaction;
    }()
  }, {
    key: "prepareTransaction",
    value: (function () {
      var _prepareTransaction = _asyncToGenerator(_regeneratorRuntime().mark(function _callee18(tx) {
        var simResponse;
        return _regeneratorRuntime().wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return this.simulateTransaction(tx);
            case 2:
              simResponse = _context18.sent;
              if (!_api.Api.isSimulationError(simResponse)) {
                _context18.next = 5;
                break;
              }
              throw new Error(simResponse.error);
            case 5:
              return _context18.abrupt("return", (0, _transaction.assembleTransaction)(tx, simResponse).build());
            case 6:
            case "end":
              return _context18.stop();
          }
        }, _callee18, this);
      }));
      function prepareTransaction(_x16) {
        return _prepareTransaction.apply(this, arguments);
      }
      return prepareTransaction;
    }())
  }, {
    key: "sendTransaction",
    value: (function () {
      var _sendTransaction2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee19(transaction) {
        return _regeneratorRuntime().wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              return _context19.abrupt("return", this._sendTransaction(transaction).then(_parsers.parseRawSendTransaction));
            case 1:
            case "end":
              return _context19.stop();
          }
        }, _callee19, this);
      }));
      function sendTransaction(_x17) {
        return _sendTransaction2.apply(this, arguments);
      }
      return sendTransaction;
    }())
  }, {
    key: "_sendTransaction",
    value: function () {
      var _sendTransaction3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee20(transaction) {
        return _regeneratorRuntime().wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              return _context20.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'sendTransaction', {
                transaction: transaction.toXDR()
              }));
            case 1:
            case "end":
              return _context20.stop();
          }
        }, _callee20, this);
      }));
      function _sendTransaction(_x18) {
        return _sendTransaction3.apply(this, arguments);
      }
      return _sendTransaction;
    }()
  }, {
    key: "requestAirdrop",
    value: (function () {
      var _requestAirdrop = _asyncToGenerator(_regeneratorRuntime().mark(function _callee21(address, friendbotUrl) {
        var account, response, meta, sequence, _error$response, _error$response$detai;
        return _regeneratorRuntime().wrap(function _callee21$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              account = typeof address === 'string' ? address : address.accountId();
              _context21.t0 = friendbotUrl;
              if (_context21.t0) {
                _context21.next = 6;
                break;
              }
              _context21.next = 5;
              return this.getNetwork();
            case 5:
              _context21.t0 = _context21.sent.friendbotUrl;
            case 6:
              friendbotUrl = _context21.t0;
              if (friendbotUrl) {
                _context21.next = 9;
                break;
              }
              throw new Error('No friendbot URL configured for current network');
            case 9:
              _context21.prev = 9;
              _context21.next = 12;
              return _axios.default.post("".concat(friendbotUrl, "?addr=").concat(encodeURIComponent(account)));
            case 12:
              response = _context21.sent;
              meta = _stellarBase.xdr.TransactionMeta.fromXDR(response.data.result_meta_xdr, 'base64');
              sequence = findCreatedAccountSequenceInTransactionMeta(meta);
              return _context21.abrupt("return", new _stellarBase.Account(account, sequence));
            case 18:
              _context21.prev = 18;
              _context21.t1 = _context21["catch"](9);
              if (!(((_error$response = _context21.t1.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 400)) {
                _context21.next = 23;
                break;
              }
              if (!((_error$response$detai = _context21.t1.response.detail) !== null && _error$response$detai !== void 0 && _error$response$detai.includes('createAccountAlreadyExist'))) {
                _context21.next = 23;
                break;
              }
              return _context21.abrupt("return", this.getAccount(account));
            case 23:
              throw _context21.t1;
            case 24:
            case "end":
              return _context21.stop();
          }
        }, _callee21, this, [[9, 18]]);
      }));
      function requestAirdrop(_x19, _x20) {
        return _requestAirdrop.apply(this, arguments);
      }
      return requestAirdrop;
    }())
  }, {
    key: "getFeeStats",
    value: (function () {
      var _getFeeStats = _asyncToGenerator(_regeneratorRuntime().mark(function _callee22() {
        return _regeneratorRuntime().wrap(function _callee22$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              return _context22.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getFeeStats'));
            case 1:
            case "end":
              return _context22.stop();
          }
        }, _callee22, this);
      }));
      function getFeeStats() {
        return _getFeeStats.apply(this, arguments);
      }
      return getFeeStats;
    }())
  }, {
    key: "getVersionInfo",
    value: (function () {
      var _getVersionInfo = _asyncToGenerator(_regeneratorRuntime().mark(function _callee23() {
        return _regeneratorRuntime().wrap(function _callee23$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              return _context23.abrupt("return", jsonrpc.postObject(this.serverURL.toString(), 'getVersionInfo'));
            case 1:
            case "end":
              return _context23.stop();
          }
        }, _callee23, this);
      }));
      function getVersionInfo() {
        return _getVersionInfo.apply(this, arguments);
      }
      return getVersionInfo;
    }())
  }]);
}();