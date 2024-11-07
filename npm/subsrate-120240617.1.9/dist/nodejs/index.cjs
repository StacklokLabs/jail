"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }















































var _chunkRXDQ7URZcjs = require('../chunk-RXDQ7URZ.cjs');

// src/nodejs/polyfill.ts
var _nodefetch = require('node-fetch'); var _nodefetch2 = _interopRequireDefault(_nodefetch);
if (!globalThis.fetch) {
  globalThis.fetch = _nodefetch2.default;
  globalThis.Headers = _nodefetch.Headers;
  globalThis.Request = _nodefetch.Request;
  globalThis.Response = _nodefetch.Response;
}
















































exports.BatchComputeJSON = _chunkRXDQ7URZcjs.BatchComputeJSON; exports.BatchComputeText = _chunkRXDQ7URZcjs.BatchComputeText; exports.Box = _chunkRXDQ7URZcjs.Box; exports.CLIP = _chunkRXDQ7URZcjs.CLIP; exports.ComputeJSON = _chunkRXDQ7URZcjs.ComputeJSON; exports.ComputeText = _chunkRXDQ7URZcjs.ComputeText; exports.DeleteVectorStore = _chunkRXDQ7URZcjs.DeleteVectorStore; exports.DeleteVectors = _chunkRXDQ7URZcjs.DeleteVectors; exports.EmbedImage = _chunkRXDQ7URZcjs.EmbedImage; exports.EmbedText = _chunkRXDQ7URZcjs.EmbedText; exports.EraseImage = _chunkRXDQ7URZcjs.EraseImage; exports.Experimental = _chunkRXDQ7URZcjs.Experimental; exports.FetchVectors = _chunkRXDQ7URZcjs.FetchVectors; exports.FindOrCreateVectorStore = _chunkRXDQ7URZcjs.FindOrCreateVectorStore; exports.Firellava13B = _chunkRXDQ7URZcjs.Firellava13B; exports.GenerateImage = _chunkRXDQ7URZcjs.GenerateImage; exports.GenerateSpeech = _chunkRXDQ7URZcjs.GenerateSpeech; exports.If = _chunkRXDQ7URZcjs.If; exports.InpaintImage = _chunkRXDQ7URZcjs.InpaintImage; exports.InterpolateFrames = _chunkRXDQ7URZcjs.InterpolateFrames; exports.JinaV2 = _chunkRXDQ7URZcjs.JinaV2; exports.ListVectorStores = _chunkRXDQ7URZcjs.ListVectorStores; exports.Llama3Instruct70B = _chunkRXDQ7URZcjs.Llama3Instruct70B; exports.Llama3Instruct8B = _chunkRXDQ7URZcjs.Llama3Instruct8B; exports.Mistral7BInstruct = _chunkRXDQ7URZcjs.Mistral7BInstruct; exports.Mixtral8x7BInstruct = _chunkRXDQ7URZcjs.Mixtral8x7BInstruct; exports.MultiComputeJSON = _chunkRXDQ7URZcjs.MultiComputeJSON; exports.MultiComputeText = _chunkRXDQ7URZcjs.MultiComputeText; exports.MultiEmbedImage = _chunkRXDQ7URZcjs.MultiEmbedImage; exports.MultiEmbedText = _chunkRXDQ7URZcjs.MultiEmbedText; exports.MultiGenerateImage = _chunkRXDQ7URZcjs.MultiGenerateImage; exports.MultiInpaintImage = _chunkRXDQ7URZcjs.MultiInpaintImage; exports.QueryVectorStore = _chunkRXDQ7URZcjs.QueryVectorStore; exports.RemoveBackground = _chunkRXDQ7URZcjs.RemoveBackground; exports.SegmentAnything = _chunkRXDQ7URZcjs.SegmentAnything; exports.SegmentUnderPoint = _chunkRXDQ7URZcjs.SegmentUnderPoint; exports.SplitDocument = _chunkRXDQ7URZcjs.SplitDocument; exports.StableDiffusionXLControlNet = _chunkRXDQ7URZcjs.StableDiffusionXLControlNet; exports.StableDiffusionXLInpaint = _chunkRXDQ7URZcjs.StableDiffusionXLInpaint; exports.StableDiffusionXLLightning = _chunkRXDQ7URZcjs.StableDiffusionXLLightning; exports.StableVideoDiffusion = _chunkRXDQ7URZcjs.StableVideoDiffusion; exports.Substrate = _chunkRXDQ7URZcjs.Substrate; exports.SubstrateError = _chunkRXDQ7URZcjs.SubstrateError; exports.TranscribeSpeech = _chunkRXDQ7URZcjs.TranscribeSpeech; exports.UpdateVectors = _chunkRXDQ7URZcjs.UpdateVectors; exports.UpscaleImage = _chunkRXDQ7URZcjs.UpscaleImage; exports.sb = _chunkRXDQ7URZcjs.sb;
//# sourceMappingURL=index.cjs.map