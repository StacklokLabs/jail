"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTarget = exports.filterAndFillEmpty = void 0;
function filterAndFillEmpty(data, def) {
    if (!data) {
        return { name: def || '', description: def || '' };
    }
    return { name: data.name || def, description: data.description || def };
}
exports.filterAndFillEmpty = filterAndFillEmpty;
function parseTarget(args) {
    const args1 = parseInt(args[1], 10);
    if (Number.isInteger(args1) && args1 < 0) {
        let coords = '-';
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-,') {
                coords += ',';
                continue;
            }
            const uint = args[i].substring(1);
            if (!Number.isInteger(parseInt(uint, 10))) {
                continue;
            }
            if (args[i - 1] === '--') {
                coords += `-${uint}`;
                continue;
            }
            coords += uint;
        }
        return coords;
    }
    return args[1];
}
exports.parseTarget = parseTarget;
//# sourceMappingURL=land.js.map