"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDummyMappings(filePaths) {
    // In case of Windows
    const finalPaths = filePaths.map((f) => f.replace(/\\/g, '/'));
    const mappings = finalPaths.reduce((acc, f) => {
        acc[f] = f;
        return acc;
    }, {});
    return {
        mappings,
        contents: Object.entries(mappings).map(([file, hash]) => ({ file, hash })),
        parcel_id: '0,0',
        publisher: '0x0000000000000000000000000000000000000000',
        root_cid: 'Qm0000000000000000000000000000000000000000'
    };
}
exports.default = getDummyMappings;
//# sourceMappingURL=getDummyMappings.js.map