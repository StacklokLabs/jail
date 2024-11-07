"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const validations_js_1 = require("../../utils/validations.js");
class HttpProvider {
    host;
    timeout;
    user;
    password;
    headers;
    statusPage;
    instance;
    constructor(host, timeout = 30000, user = '', password = '', headers = {}, statusPage = '/') {
        if (!(0, validations_js_1.isValidURL)(host))
            throw new Error('Invalid URL provided to HttpProvider');
        if (isNaN(timeout) || timeout < 0)
            throw new Error('Invalid timeout duration provided');
        if (!(0, validations_js_1.isObject)(headers))
            throw new Error('Invalid headers object provided');
        host = host.replace(/\/+$/, '');
        this.host = host;
        this.timeout = timeout;
        this.user = user;
        this.password = password;
        this.headers = headers;
        this.statusPage = statusPage;
        this.instance = axios_1.default.create({
            baseURL: host,
            timeout: timeout,
            headers: headers,
            auth: user
                ? {
                    username: user,
                    password,
                }
                : undefined,
        });
    }
    setStatusPage(statusPage = '/') {
        this.statusPage = statusPage;
    }
    async isConnected(statusPage = this.statusPage) {
        return this.request(statusPage)
            .then((data) => {
            return (0, validations_js_1.hasProperties)(data, 'blockID', 'block_header');
        })
            .catch(() => false);
    }
    request(url, payload = {}, method = 'get') {
        method = method.toLowerCase();
        return this.instance
            .request({
            data: method == 'post' && Object.keys(payload).length ? payload : null,
            params: method == 'get' && payload,
            url,
            method,
        })
            .then(({ data }) => data);
    }
}
exports.default = HttpProvider;
//# sourceMappingURL=HttpProvider.js.map