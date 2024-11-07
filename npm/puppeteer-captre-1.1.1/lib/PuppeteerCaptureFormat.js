"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MP4 = void 0;
function MP4(preset = 'ultrafast', videoCodec = 'libx264') {
    return (ffmpeg) => __awaiter(this, void 0, void 0, function* () {
        ffmpeg
            .outputFormat('mp4').withVideoCodec(videoCodec)
            .outputOption(`-preset ${preset}`)
            .outputOption('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov');
    });
}
exports.MP4 = MP4;
