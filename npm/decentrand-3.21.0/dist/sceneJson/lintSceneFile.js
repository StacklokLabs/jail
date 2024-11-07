"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintSceneFile = void 0;
const _1 = require(".");
async function lintSceneFile(workingDir) {
    const sceneFile = await (0, _1.getSceneFile)(workingDir);
    const finalScene = Object.assign(Object.assign({}, sceneFile), { scene: Object.assign(Object.assign({}, sceneFile.scene), { base: sceneFile.scene.base.replace(/\ /g, ''), parcels: sceneFile.scene.parcels.map((coords) => coords.replace(/\ /g, '')) }) });
    if (JSON.stringify(sceneFile) !== JSON.stringify(finalScene)) {
        return (0, _1.setSceneFile)(finalScene, workingDir);
    }
}
exports.lintSceneFile = lintSceneFile;
//# sourceMappingURL=lintSceneFile.js.map