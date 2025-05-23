/**
 * axios-middleware v0.4.0
 * (c) 2023 Émile Bergeron
 * @license MIT
 */
/**
 * @property {Array} middlewares stack
 * @property {AxiosInstance} http
 * @property {Function} originalAdapter
 */
var HttpMiddlewareService = function HttpMiddlewareService(axios) {
  this.middlewares = [];

  this._updateChain();
  this.setHttp(axios);
};

/**
 * @param {AxiosInstance} axios
 * @returns {HttpMiddlewareService}
 */
HttpMiddlewareService.prototype.setHttp = function setHttp (axios) {
    var this$1 = this;

  this.unsetHttp();

  if (axios) {
    this.http = axios;
    this.originalAdapter = axios.defaults.adapter;
    axios.defaults.adapter = function (config) { return this$1.adapter(config); };
  }
  return this;
};

/**
 * @returns {HttpMiddlewareService}
 */
HttpMiddlewareService.prototype.unsetHttp = function unsetHttp () {
  if (this.http) {
    this.http.defaults.adapter = this.originalAdapter;
    this.http = null;
  }
  return this;
};

/**
 * @param {Object|HttpMiddleware} [middleware]
 * @returns {boolean} true if the middleware is already registered.
 */
HttpMiddlewareService.prototype.has = function has (middleware) {
  return this.middlewares.indexOf(middleware) > -1;
};

/**
 * Adds a middleware or an array of middlewares to the stack.
 * @param {Object|HttpMiddleware|Array} [middlewares]
 * @returns {HttpMiddlewareService}
 */
HttpMiddlewareService.prototype.register = function register (middlewares) {
    var this$1 = this;

  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(middlewares)) { middlewares = [middlewares]; }

  // Test if middlewares are registered more than once.
  middlewares.forEach(function (middleware) {
    if (!middleware) { return; }
    if (this$1.has(middleware)) {
      throw new Error('Middleware already registered');
    }
    this$1.middlewares.push(middleware);
    this$1._addMiddleware(middleware);
  });
  return this;
};

/**
 * Removes a middleware from the registered stack.
 * @param {Object|HttpMiddleware} [middleware]
 * @returns {HttpMiddlewareService}
 */
HttpMiddlewareService.prototype.unregister = function unregister (middleware) {
  if (middleware) {
    var index = this.middlewares.indexOf(middleware);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
    this._updateChain();
  }

  return this;
};

/**
 * Removes all the middleware from the stack.
 * @returns {HttpMiddlewareService}
 */
HttpMiddlewareService.prototype.reset = function reset () {
  this.middlewares.length = 0;
  this._updateChain();
  return this;
};

/**
 * @param config
 * @returns {Promise}
 */
HttpMiddlewareService.prototype.adapter = function adapter (config) {
  return this.chain.reduce(
    function (acc, ref) {
        var onResolve = ref[0];
        var onError = ref[1];

        return acc.then(onResolve, onError);
    },
    Promise.resolve(config)
  );
};

/**
 *
 * @param {Object} middleware
 * @private
 */
HttpMiddlewareService.prototype._addMiddleware = function _addMiddleware (middleware) {
  this.chain.unshift([
    middleware.onRequest && (function (conf) { return middleware.onRequest(conf); }),
    middleware.onRequestError &&
      (function (error) { return middleware.onRequestError(error); }) ]);

  this.chain.push([
    middleware.onResponse && (function (response) { return middleware.onResponse(response); }),
    middleware.onResponseError &&
      (function (error) { return middleware.onResponseError(error); }) ]);
};

/**
 * @private
 */
HttpMiddlewareService.prototype._updateChain = function _updateChain () {
    var this$1 = this;

  this.chain = [
    [
      function (conf) { return this$1._onSync(this$1.originalAdapter.call(this$1.http, conf)); },
      undefined ] ];
  this.middlewares.forEach(function (middleware) { return this$1._addMiddleware(middleware); });
};

/**
 * @param {Promise} promise
 * @returns {Promise}
 * @private
 */
HttpMiddlewareService.prototype._onSync = function _onSync (promise) {
  return this.middlewares.reduce(
    function (acc, middleware) { return (middleware.onSync ? middleware.onSync(acc) : acc); },
    promise
  );
};

var index_esm = {
  Service: HttpMiddlewareService,
  version: '0.4.0',
};

export default index_esm;
export { HttpMiddlewareService as Service };
