"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.SOCKS_PROTOCOLS = void 0;
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const util_1 = tslib_1.__importDefault(require("util"));
const url_1 = require("url");
const events_1 = require("events");
const buffer_1 = require("buffer");
const parse_authorization_header_1 = require("./utils/parse_authorization_header");
const redact_url_1 = require("./utils/redact_url");
const nodeify_1 = require("./utils/nodeify");
const count_target_bytes_1 = require("./utils/count_target_bytes");
const request_error_1 = require("./request_error");
const chain_1 = require("./chain");
const forward_1 = require("./forward");
const direct_1 = require("./direct");
const custom_response_1 = require("./custom_response");
const normalize_url_port_1 = require("./utils/normalize_url_port");
const statuses_1 = require("./statuses");
const custom_connect_1 = require("./custom_connect");
const forward_socks_1 = require("./forward_socks");
const chain_socks_1 = require("./chain_socks");
exports.SOCKS_PROTOCOLS = ['socks:', 'socks4:', 'socks4a:', 'socks5:', 'socks5h:'];
// TODO:
// - Implement this requirement from rfc7230
//   "A proxy MUST forward unrecognized header fields unless the field-name
//    is listed in the Connection header field (Section 6.1) or the proxy
//    is specifically configured to block, or otherwise transform, such
//    fields.  Other recipients SHOULD ignore unrecognized header fields.
//    These requirements allow HTTP's functionality to be enhanced without
//    requiring prior update of deployed intermediaries."
const DEFAULT_AUTH_REALM = 'ProxyChain';
const DEFAULT_PROXY_SERVER_PORT = 8000;
/**
 * Represents the proxy server.
 * It emits the 'requestFailed' event on unexpected request errors, with the following parameter `{ error, request }`.
 * It emits the 'connectionClosed' event when connection to proxy server is closed, with parameter `{ connectionId, stats }`.
 */
class Server extends events_1.EventEmitter {
    /**
     * Initializes a new instance of Server class.
     * @param options
     * @param [options.port] Port where the server will listen. By default 8000.
     * @param [options.prepareRequestFunction] Custom function to authenticate proxy requests,
     * provide URL to upstream proxy or potentially provide a function that generates a custom response to HTTP requests.
     * It accepts a single parameter which is an object:
     * ```
     * {
     *   connectionId: symbol,
     *   request: http.IncomingMessage,
     *   username: string,
     *   password: string,
     *   hostname: string,
     *   port: number,
     *   isHttp: boolean,
     * }
     * ```
     * and returns an object (or promise resolving to the object) with following form:
     * ```
     * {
     *   requestAuthentication: boolean,
     *   upstreamProxyUrl: string,
     *   customResponseFunction: Function,
     * }
     * ```
     * If `upstreamProxyUrl` is a falsy value, no upstream proxy is used.
     * If `prepareRequestFunction` is not set, the proxy server will not require any authentication
     * and will not use any upstream proxy.
     * If `customResponseFunction` is set, it will be called to generate a custom response to the HTTP request.
     * It should not be used together with `upstreamProxyUrl`.
     * @param [options.authRealm] Realm used in the Proxy-Authenticate header and also in the 'Server' HTTP header. By default it's `ProxyChain`.
     * @param [options.verbose] If true, the server will output logs
     */
    constructor(options = {}) {
        super();
        Object.defineProperty(this, "port", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "host", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prepareRequestFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authRealm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastHandlerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stats", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "connections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (options.port === undefined || options.port === null) {
            this.port = DEFAULT_PROXY_SERVER_PORT;
        }
        else {
            this.port = options.port;
        }
        this.host = options.host;
        this.prepareRequestFunction = options.prepareRequestFunction;
        this.authRealm = options.authRealm || DEFAULT_AUTH_REALM;
        this.verbose = !!options.verbose;
        this.server = http_1.default.createServer();
        this.server.on('clientError', this.onClientError.bind(this));
        this.server.on('request', this.onRequest.bind(this));
        this.server.on('connect', this.onConnect.bind(this));
        this.server.on('connection', this.onConnection.bind(this));
        this.lastHandlerId = 0;
        this.stats = {
            httpRequestCount: 0,
            connectRequestCount: 0,
        };
        this.connections = new Map();
    }
    log(connectionId, str) {
        if (this.verbose) {
            const logPrefix = connectionId ? `${String(connectionId)} | ` : '';
            // eslint-disable-next-line no-console
            console.log(`ProxyServer[${this.port}]: ${logPrefix}${str}`);
        }
    }
    onClientError(err, socket) {
        this.log(socket.proxyChainId, `onClientError: ${err}`);
        // https://nodejs.org/api/http.html#http_event_clienterror
        if (err.code === 'ECONNRESET' || !socket.writable) {
            return;
        }
        this.sendSocketResponse(socket, 400, {}, 'Invalid request');
    }
    /**
     * Assigns a unique ID to the socket and keeps the register up to date.
     * Needed for abrupt close of the server.
     */
    registerConnection(socket) {
        const unique = this.lastHandlerId++;
        socket.proxyChainId = unique;
        this.connections.set(unique, socket);
        socket.on('close', () => {
            this.emit('connectionClosed', {
                connectionId: unique,
                stats: this.getConnectionStats(unique),
            });
            this.connections.delete(unique);
        });
        // We have to manually destroy the socket if it timeouts.
        // This will prevent connections from leaking and close them properly.
        socket.on('timeout', () => {
            socket.destroy();
        });
    }
    /**
     * Handles incoming sockets, useful for error handling
     */
    onConnection(socket) {
        // https://github.com/nodejs/node/issues/23858
        if (!socket.remoteAddress) {
            socket.destroy();
            return;
        }
        this.registerConnection(socket);
        // We need to consume socket errors, because the handlers are attached asynchronously.
        // See https://github.com/apify/proxy-chain/issues/53
        socket.on('error', (err) => {
            // Handle errors only if there's no other handler
            if (this.listenerCount('error') === 1) {
                this.log(socket.proxyChainId, `Source socket emitted error: ${err.stack || err}`);
            }
        });
    }
    /**
     * Converts known errors to be instance of RequestError.
     */
    normalizeHandlerError(error) {
        if (error.message === 'Username contains an invalid colon') {
            return new request_error_1.RequestError('Invalid colon in username in upstream proxy credentials', statuses_1.badGatewayStatusCodes.AUTH_FAILED);
        }
        if (error.message === '407 Proxy Authentication Required') {
            return new request_error_1.RequestError('Invalid upstream proxy credentials', statuses_1.badGatewayStatusCodes.AUTH_FAILED);
        }
        return error;
    }
    /**
     * Handles normal HTTP request by forwarding it to target host or the upstream proxy.
     */
    async onRequest(request, response) {
        try {
            const handlerOpts = await this.prepareRequestHandling(request);
            handlerOpts.srcResponse = response;
            const { proxyChainId } = request.socket;
            if (handlerOpts.customResponseFunction) {
                this.log(proxyChainId, 'Using handleCustomResponse()');
                return await (0, custom_response_1.handleCustomResponse)(request, response, handlerOpts);
            }
            if (handlerOpts.upstreamProxyUrlParsed && exports.SOCKS_PROTOCOLS.includes(handlerOpts.upstreamProxyUrlParsed.protocol)) {
                this.log(proxyChainId, 'Using forwardSocks()');
                return await (0, forward_socks_1.forwardSocks)(request, response, handlerOpts);
            }
            this.log(proxyChainId, 'Using forward()');
            return await (0, forward_1.forward)(request, response, handlerOpts);
        }
        catch (error) {
            this.failRequest(request, this.normalizeHandlerError(error));
        }
    }
    /**
     * Handles HTTP CONNECT request by setting up a tunnel either to target host or to the upstream proxy.
     * @param request
     * @param socket
     * @param head The first packet of the tunneling stream (may be empty)
     */
    async onConnect(request, socket, head) {
        try {
            const handlerOpts = await this.prepareRequestHandling(request);
            handlerOpts.srcHead = head;
            const data = { request, sourceSocket: socket, head, handlerOpts: handlerOpts, server: this, isPlain: false };
            if (handlerOpts.customConnectServer) {
                socket.unshift(head); // See chain.ts for why we do this
                return await (0, custom_connect_1.customConnect)(socket, handlerOpts.customConnectServer);
            }
            if (handlerOpts.upstreamProxyUrlParsed) {
                if (exports.SOCKS_PROTOCOLS.includes(handlerOpts.upstreamProxyUrlParsed.protocol)) {
                    this.log(socket.proxyChainId, `Using chainSocks() => ${request.url}`);
                    return await (0, chain_socks_1.chainSocks)(data);
                }
                this.log(socket.proxyChainId, `Using chain() => ${request.url}`);
                return await (0, chain_1.chain)(data);
            }
            this.log(socket.proxyChainId, `Using direct() => ${request.url}`);
            return await (0, direct_1.direct)(data);
        }
        catch (error) {
            this.failRequest(request, this.normalizeHandlerError(error));
        }
    }
    /**
     * Prepares handler options from a request.
     * @see {prepareRequestHandling}
     */
    getHandlerOpts(request) {
        const handlerOpts = {
            server: this,
            id: request.socket.proxyChainId,
            srcRequest: request,
            srcHead: null,
            trgParsed: null,
            upstreamProxyUrlParsed: null,
            isHttp: false,
            srcResponse: null,
            customResponseFunction: null,
            customConnectServer: null,
        };
        this.log(request.socket.proxyChainId, `!!! Handling ${request.method} ${request.url} HTTP/${request.httpVersion}`);
        if (request.method === 'CONNECT') {
            // CONNECT server.example.com:80 HTTP/1.1
            try {
                handlerOpts.trgParsed = new url_1.URL(`connect://${request.url}`);
            }
            catch {
                throw new request_error_1.RequestError(`Target "${request.url}" could not be parsed`, 400);
            }
            if (!handlerOpts.trgParsed.hostname || !handlerOpts.trgParsed.port) {
                throw new request_error_1.RequestError(`Target "${request.url}" could not be parsed`, 400);
            }
            this.stats.connectRequestCount++;
        }
        else {
            // The request should look like:
            //   GET http://server.example.com:80/some-path HTTP/1.1
            // Note that RFC 7230 says:
            // "When making a request to a proxy, other than a CONNECT or server-wide
            //  OPTIONS request (as detailed below), a client MUST send the target
            //  URI in absolute-form as the request-target"
            let parsed;
            try {
                parsed = new url_1.URL(request.url);
            }
            catch (error) {
                // If URL is invalid, throw HTTP 400 error
                throw new request_error_1.RequestError(`Target "${request.url}" could not be parsed`, 400);
            }
            // Only HTTP is supported, other protocols such as HTTP or FTP must use the CONNECT method
            if (parsed.protocol !== 'http:') {
                throw new request_error_1.RequestError(`Only HTTP protocol is supported (was ${parsed.protocol})`, 400);
            }
            handlerOpts.trgParsed = parsed;
            handlerOpts.isHttp = true;
            this.stats.httpRequestCount++;
        }
        return handlerOpts;
    }
    /**
     * Calls `this.prepareRequestFunction` with normalized options.
     * @param request
     * @param handlerOpts
     */
    async callPrepareRequestFunction(request, handlerOpts) {
        if (this.prepareRequestFunction) {
            const funcOpts = {
                connectionId: request.socket.proxyChainId,
                request,
                username: '',
                password: '',
                hostname: handlerOpts.trgParsed.hostname,
                port: (0, normalize_url_port_1.normalizeUrlPort)(handlerOpts.trgParsed),
                isHttp: handlerOpts.isHttp,
            };
            // Authenticate the request using a user function (if provided)
            const proxyAuth = request.headers['proxy-authorization'];
            if (proxyAuth) {
                const auth = (0, parse_authorization_header_1.parseAuthorizationHeader)(proxyAuth);
                if (!auth) {
                    throw new request_error_1.RequestError('Invalid "Proxy-Authorization" header', 400);
                }
                // https://datatracker.ietf.org/doc/html/rfc7617#page-3
                // Note that both scheme and parameter names are matched case-
                // insensitively.
                if (auth.type.toLowerCase() !== 'basic') {
                    throw new request_error_1.RequestError('The "Proxy-Authorization" header must have the "Basic" type.', 400);
                }
                funcOpts.username = auth.username;
                funcOpts.password = auth.password;
            }
            const result = await this.prepareRequestFunction(funcOpts);
            return result !== null && result !== void 0 ? result : {};
        }
        return {};
    }
    /**
     * Authenticates a new request and determines upstream proxy URL using the user function.
     * Returns a promise resolving to an object that can be used to run a handler.
     * @param request
     */
    async prepareRequestHandling(request) {
        const handlerOpts = this.getHandlerOpts(request);
        const funcResult = await this.callPrepareRequestFunction(request, handlerOpts);
        handlerOpts.localAddress = funcResult.localAddress;
        handlerOpts.ipFamily = funcResult.ipFamily;
        handlerOpts.dnsLookup = funcResult.dnsLookup;
        handlerOpts.customConnectServer = funcResult.customConnectServer;
        handlerOpts.customTag = funcResult.customTag;
        // If not authenticated, request client to authenticate
        if (funcResult.requestAuthentication) {
            throw new request_error_1.RequestError(funcResult.failMsg || 'Proxy credentials required.', 407);
        }
        if (funcResult.upstreamProxyUrl) {
            try {
                handlerOpts.upstreamProxyUrlParsed = new url_1.URL(funcResult.upstreamProxyUrl);
            }
            catch (error) {
                throw new Error(`Invalid "upstreamProxyUrl" provided: ${error} (was "${funcResult.upstreamProxyUrl}"`);
            }
            if (!['http:', ...exports.SOCKS_PROTOCOLS].includes(handlerOpts.upstreamProxyUrlParsed.protocol)) {
                // eslint-disable-next-line max-len
                throw new Error(`Invalid "upstreamProxyUrl" provided: URL must have one of the following protocols: "http", ${exports.SOCKS_PROTOCOLS.map((p) => `"${p.replace(':', '')}"`).join(', ')} (was "${funcResult.upstreamProxyUrl}")`);
            }
        }
        const { proxyChainId } = request.socket;
        if (funcResult.customResponseFunction) {
            this.log(proxyChainId, 'Using custom response function');
            handlerOpts.customResponseFunction = funcResult.customResponseFunction;
            if (!handlerOpts.isHttp) {
                throw new Error('The "customResponseFunction" option can only be used for HTTP requests.');
            }
            if (typeof (handlerOpts.customResponseFunction) !== 'function') {
                throw new Error('The "customResponseFunction" option must be a function.');
            }
        }
        if (handlerOpts.upstreamProxyUrlParsed) {
            this.log(proxyChainId, `Using upstream proxy ${(0, redact_url_1.redactUrl)(handlerOpts.upstreamProxyUrlParsed)}`);
        }
        return handlerOpts;
    }
    /**
     * Sends a HTTP error response to the client.
     * @param request
     * @param error
     */
    failRequest(request, error) {
        const { proxyChainId } = request.socket;
        if (error.name === 'RequestError') {
            const typedError = error;
            this.log(proxyChainId, `Request failed (status ${typedError.statusCode}): ${error.message}`);
            this.sendSocketResponse(request.socket, typedError.statusCode, typedError.headers, error.message);
        }
        else {
            this.log(proxyChainId, `Request failed with error: ${error.stack || error}`);
            this.sendSocketResponse(request.socket, 500, {}, 'Internal error in proxy server');
            this.emit('requestFailed', { error, request });
        }
        this.log(proxyChainId, 'Closing because request failed with error');
    }
    /**
     * Sends a simple HTTP response to the client and forcibly closes the connection.
     * This invalidates the ServerResponse instance (if present).
     * We don't know the state of the response anyway.
     * Writing directly to the socket seems to be the easiest solution.
     * @param socket
     * @param statusCode
     * @param headers
     * @param message
     */
    sendSocketResponse(socket, statusCode = 500, caseSensitiveHeaders = {}, message = '') {
        try {
            const headers = Object.fromEntries(Object.entries(caseSensitiveHeaders).map(([name, value]) => [name.toLowerCase(), value]));
            headers.connection = 'close';
            headers.date = (new Date()).toUTCString();
            headers['content-length'] = String(buffer_1.Buffer.byteLength(message));
            headers.server = headers.server || this.authRealm;
            headers['content-type'] = headers['content-type'] || 'text/plain; charset=utf-8';
            if (statusCode === 407 && !headers['proxy-authenticate']) {
                headers['proxy-authenticate'] = `Basic realm="${this.authRealm}"`;
            }
            let msg = `HTTP/1.1 ${statusCode} ${http_1.default.STATUS_CODES[statusCode] || 'Unknown Status Code'}\r\n`;
            for (const [key, value] of Object.entries(headers)) {
                msg += `${key}: ${value}\r\n`;
            }
            msg += `\r\n${message}`;
            // Unfortunately it's not possible to send RST in Node.js yet.
            // See https://github.com/nodejs/node/issues/27428
            socket.setTimeout(1000, () => {
                socket.destroy();
            });
            // This sends FIN, meaning we still can receive data.
            socket.end(msg);
        }
        catch (err) {
            this.log(socket.proxyChainId, `Unhandled error in sendResponse(), will be ignored: ${err.stack || err}`);
        }
    }
    /**
     * Starts listening at a port specified in the constructor.
     */
    listen(callback) {
        const promise = new Promise((resolve, reject) => {
            // Unfortunately server.listen() is not a normal function that fails on error,
            // so we need this trickery
            const onError = (error) => {
                this.log(null, `Listen failed: ${error}`);
                removeListeners();
                reject(error);
            };
            const onListening = () => {
                this.port = this.server.address().port;
                this.log(null, 'Listening...');
                removeListeners();
                resolve();
            };
            const removeListeners = () => {
                this.server.removeListener('error', onError);
                this.server.removeListener('listening', onListening);
            };
            this.server.on('error', onError);
            this.server.on('listening', onListening);
            this.server.listen(this.port, this.host);
        });
        return (0, nodeify_1.nodeify)(promise, callback);
    }
    /**
     * Gets array of IDs of all active connections.
     */
    getConnectionIds() {
        return [...this.connections.keys()];
    }
    /**
     * Gets data transfer statistics of a specific proxy connection.
     */
    getConnectionStats(connectionId) {
        const socket = this.connections.get(connectionId);
        if (!socket)
            return undefined;
        const targetStats = (0, count_target_bytes_1.getTargetStats)(socket);
        const result = {
            srcTxBytes: socket.bytesWritten,
            srcRxBytes: socket.bytesRead,
            trgTxBytes: targetStats.bytesWritten,
            trgRxBytes: targetStats.bytesRead,
        };
        return result;
    }
    /**
     * Forcibly close a specific pending proxy connection.
     */
    closeConnection(connectionId) {
        this.log(null, 'Closing pending socket');
        const socket = this.connections.get(connectionId);
        if (!socket)
            return;
        socket.destroy();
        this.log(null, `Destroyed pending socket`);
    }
    /**
     * Forcibly closes pending proxy connections.
     */
    closeConnections() {
        this.log(null, 'Closing pending sockets');
        for (const socket of this.connections.values()) {
            socket.destroy();
        }
        this.log(null, `Destroyed ${this.connections.size} pending sockets`);
    }
    /**
     * Closes the proxy server.
     * @param closeConnections If true, pending proxy connections are forcibly closed.
     */
    close(closeConnections, callback) {
        if (typeof closeConnections === 'function') {
            callback = closeConnections;
            closeConnections = false;
        }
        if (closeConnections) {
            this.closeConnections();
        }
        if (this.server) {
            const { server } = this;
            // @ts-expect-error Let's make sure we can't access the server anymore.
            this.server = null;
            const promise = util_1.default.promisify(server.close).bind(server)();
            return (0, nodeify_1.nodeify)(promise, callback);
        }
        return (0, nodeify_1.nodeify)(Promise.resolve(), callback);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map