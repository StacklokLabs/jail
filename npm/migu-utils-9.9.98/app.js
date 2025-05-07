"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./util/type.ts" />
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
fs_1.default.readdirSync(path_1.default.join(__dirname, 'routes')).reverse().forEach(file => {
    const filename = file.replace(/(\.js|\.ts)$/, '');
    const RouterMap = require(`./routes/${filename}`).default;
    Object.keys(RouterMap).forEach((path) => {
        let fullPah = `/${filename}${path}`;
        if (fullPah === '/index/') {
            fullPah = '/';
        }
        app.use(fullPah, (req, res, next) => {
            const router = express_1.default.Router();
            req.query = Object.assign(Object.assign({}, req.query), req.body);
            let routeFunc = RouterMap[path];
            const func = async (req, res) => {
                const result = await routeFunc({
                    query: req.query,
                    res,
                }).catch((err) => ({ result: 200, errMsg: `异常：${err.message}` }));
                if (typeof result === 'object') {
                    res.send(result);
                }
            };
            router.post('/', func);
            router.get('/', func);
            router(req, res, next);
        });
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;