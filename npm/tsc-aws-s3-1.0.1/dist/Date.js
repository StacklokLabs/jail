"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateYMD = exports.xAmzDate = exports.dateISOString = void 0;
exports.dateISOString = new Date(+new Date() + 864e5).toISOString();
exports.xAmzDate = exports.dateISOString.split('-').join('').split(':').join('').split('.').join('');
exports.dateYMD = exports.dateISOString.split('T')[0].split('-').join('');
