"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/Error.ts
var _SubstrateError = class _SubstrateError extends Error {
};
__name(_SubstrateError, "SubstrateError");
var SubstrateError = _SubstrateError;
var _RequestTimeoutError = class _RequestTimeoutError extends SubstrateError {
};
__name(_RequestTimeoutError, "RequestTimeoutError");
var RequestTimeoutError = _RequestTimeoutError;
var _NodeError = class _NodeError extends SubstrateError {
  constructor(type, message, request_id) {
    super(message);
    this.type = type;
    this.message = message;
    this.request_id = request_id;
  }
};
__name(_NodeError, "NodeError");
var NodeError = _NodeError;

// src/idGenerator.ts
function randomString(length) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
  let randomString2 = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomString2 += alphabet[randomIndex];
  }
  return randomString2;
}
__name(randomString, "randomString");
function idGenerator(prefix, start = 1) {
  let n = start;
  return () => {
    const id = `${prefix}${n.toString()}_${randomString(8)}`;
    n = n + 1;
    return id;
  };
}
__name(idGenerator, "idGenerator");

// src/Future.ts
var parsePath = /* @__PURE__ */ __name((path) => {
  const parts = path.split(/\.|\[|\]\[?/).filter(Boolean);
  return parts.map((part) => isNaN(Number(part)) ? part : Number(part));
}, "parsePath");
var newFutureId = idGenerator("future");
var _Directive = class _Directive {
  referencedFutures() {
    return this.items.filter((p) => p instanceof Future).flatMap((p) => [p, ...p.referencedFutures()]);
  }
};
__name(_Directive, "Directive");
var Directive = _Directive;
var _Trace = class _Trace extends Directive {
  constructor(items, originNode) {
    super();
    this.items = items;
    this.originNode = originNode;
  }
  next(...items) {
    return new _Trace([...this.items, ...items], this.originNode);
  }
  async result() {
    let result = await this.originNode.result();
    for (let item of this.items) {
      if (item instanceof Future) {
        item = await item._result();
      }
      result = result[item];
    }
    return result;
  }
  toJSON() {
    return {
      type: "trace",
      origin_node_id: this.originNode.id,
      op_stack: this.items.map((item) => {
        if (item instanceof FutureString) {
          return _Trace.Operation.future("attr", item._id);
        } else if (item instanceof FutureNumber) {
          return _Trace.Operation.future("item", item._id);
        } else if (typeof item === "string") {
          return _Trace.Operation.key("attr", item);
        }
        return _Trace.Operation.key("item", item);
      })
    };
  }
};
__name(_Trace, "Trace");
_Trace.Operation = {
  future: /* @__PURE__ */ __name((accessor, id) => ({
    future_id: id,
    key: null,
    accessor
  }), "future"),
  key: /* @__PURE__ */ __name((accessor, key) => ({
    future_id: null,
    key,
    accessor
  }), "key")
};
var Trace = _Trace;
var _JQ = class _JQ extends Directive {
  constructor(query, target) {
    super();
    this.items = [target];
    this.target = target;
    this.query = query;
  }
  next(...items) {
    return new _JQ(this.query, this.target);
  }
  async result() {
    return this.target instanceof Future ? (
      // @ts-expect-error (accessing protected prop: id)
      await this.target._result()
    ) : this.target;
  }
  toJSON() {
    return {
      type: "jq",
      query: this.query,
      target: this.target instanceof Future ? (
        // @ts-expect-error (accessing protected prop: id)
        _JQ.JQDirectiveTarget.future(this.target._id)
      ) : _JQ.JQDirectiveTarget.rawValue(this.target)
    };
  }
};
__name(_JQ, "JQ");
_JQ.JQDirectiveTarget = {
  future: /* @__PURE__ */ __name((id) => ({ future_id: id, val: null }), "future"),
  rawValue: /* @__PURE__ */ __name((val) => ({ future_id: null, val }), "rawValue")
};
var JQ = _JQ;
var _StringConcat = class _StringConcat extends Directive {
  constructor(items = []) {
    super();
    this.items = items;
  }
  next(...items) {
    return new _StringConcat([...this.items, ...items]);
  }
  async result() {
    let result = "";
    for (let item of this.items) {
      if (item instanceof Future) {
        item = await item._result();
      }
      result = result.concat(item);
    }
    return result;
  }
  toJSON() {
    return {
      type: "string-concat",
      items: this.items.map((item) => {
        if (item instanceof Future) {
          return _StringConcat.Concatable.future(item._id);
        }
        return _StringConcat.Concatable.string(item);
      })
    };
  }
};
__name(_StringConcat, "StringConcat");
_StringConcat.Concatable = {
  string: /* @__PURE__ */ __name((val) => ({ future_id: null, val }), "string"),
  future: /* @__PURE__ */ __name((id) => ({ future_id: id, val: null }), "future")
};
var StringConcat = _StringConcat;
var _Future = class _Future {
  constructor(directive, id = newFutureId()) {
    this._id = "";
    this._directive = directive;
    this._id = id;
  }
  referencedFutures() {
    return this._directive.referencedFutures();
  }
  toPlaceholder() {
    return { __$$SB_GRAPH_OP_ID$$__: this._id };
  }
  async _result() {
    return this._directive.result();
  }
  static jq(future, query, futureType = "string") {
    const directive = new JQ(query, future);
    switch (futureType) {
      case "string":
        return new FutureString(directive);
      case "number":
        return new FutureNumber(directive);
      case "object":
        return new FutureAnyObject(directive);
      case "boolean":
        return new FutureBoolean(directive);
      default:
        throw new Error(`Unknown future type: ${futureType}`);
    }
  }
  toJSON() {
    return {
      id: this._id,
      directive: this._directive.toJSON()
    };
  }
};
__name(_Future, "Future");
var Future = _Future;
var _FutureBoolean = class _FutureBoolean extends Future {
};
__name(_FutureBoolean, "FutureBoolean");
var FutureBoolean = _FutureBoolean;
var _FutureString = class _FutureString extends Future {
  static concat(...items) {
    return new _FutureString(new StringConcat(items));
  }
  static interpolate(strings, ...exprs) {
    return _FutureString.concat(
      ...strings.flatMap((s, i) => {
        const expr = exprs[i];
        return expr ? [s, expr instanceof Future ? expr : expr.toString()] : [s];
      })
    );
  }
  concat(...items) {
    return _FutureString.concat(...[this, ...items]);
  }
  async _result() {
    return super._result();
  }
};
__name(_FutureString, "FutureString");
var FutureString = _FutureString;
var _FutureNumber = class _FutureNumber extends Future {
};
__name(_FutureNumber, "FutureNumber");
var FutureNumber = _FutureNumber;
var _FutureArray = class _FutureArray extends Future {
  async _result() {
    return super._result();
  }
};
__name(_FutureArray, "FutureArray");
var FutureArray = _FutureArray;
var _FutureObject = class _FutureObject extends Future {
  get(path) {
    const props = parsePath(path);
    return props.reduce((future, prop) => {
      if (future instanceof FutureAnyObject) {
        return typeof prop === "string" ? future.get(prop) : future.at(prop);
      } else {
        return typeof prop === "string" ? future[prop] : future.at(prop);
      }
    }, this);
  }
  async _result() {
    return super._result();
  }
};
__name(_FutureObject, "FutureObject");
var FutureObject = _FutureObject;
var _FutureAnyObject = class _FutureAnyObject extends Future {
  get(path) {
    const d = typeof path === "string" ? this._directive.next(...parsePath(path)) : this._directive.next(path);
    return new _FutureAnyObject(d);
  }
  at(index) {
    return new _FutureAnyObject(this._directive.next(index));
  }
  async _result() {
    return super._result();
  }
};
__name(_FutureAnyObject, "FutureAnyObject");
var FutureAnyObject = _FutureAnyObject;

// src/Node.ts
var generator = idGenerator("node");
var _Node = class _Node {
  constructor(args = {}, opts) {
    this.node = this.constructor.name;
    this.args = args;
    this.id = _optionalChain([opts, 'optionalAccess', _ => _.id]) || generator(this.node);
    this.hide = _optionalChain([opts, 'optionalAccess', _2 => _2.hide]) || false;
    this.cache_age = _optionalChain([opts, 'optionalAccess', _3 => _3.cache_age]);
    this.cache_keys = _optionalChain([opts, 'optionalAccess', _4 => _4.cache_keys]);
    this.max_retries = _optionalChain([opts, 'optionalAccess', _5 => _5.max_retries]);
    this.depends = _nullishCoalesce(_optionalChain([opts, 'optionalAccess', _6 => _6.depends]), () => ( []));
  }
  /**
   * Reference the future output of this node.
   */
  get future() {
    return new FutureAnyObject(new Trace([], this));
  }
  set response(res) {
    this._response = res;
  }
  output() {
    const data = _optionalChain([this, 'access', _7 => _7._response, 'optionalAccess', _8 => _8.json, 'optionalAccess', _9 => _9.data, 'optionalAccess', _10 => _10[this.id]]);
    if (_optionalChain([data, 'optionalAccess', _11 => _11.type]) && _optionalChain([data, 'optionalAccess', _12 => _12.message])) {
      return new NodeError(data.type, data.message, _optionalChain([data, 'optionalAccess', _13 => _13.request_id]));
    } else if (data) {
      return data;
    }
    return new NodeError("no_data", `Missing data for "${this.id}"`);
  }
  /**
   * Return the resolved result for this node.
   */
  async result() {
    if (!this._response) {
      return Promise.reject(
        new SubstrateError(
          `${this.node} (id=${this.id}) has not been run yet!`
        )
      );
    }
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  toJSON() {
    const withPlaceholders = /* @__PURE__ */ __name((obj) => {
      if (Array.isArray(obj)) {
        return obj.map((item) => withPlaceholders(item));
      }
      if (obj instanceof Future) {
        return obj.toPlaceholder();
      }
      if (obj && typeof obj === "object") {
        return Object.keys(obj).reduce((acc, k) => {
          acc[k] = withPlaceholders(obj[k]);
          return acc;
        }, {});
      }
      return obj;
    }, "withPlaceholders");
    return {
      id: this.id,
      node: this.node,
      args: withPlaceholders(this.args),
      _should_output_globally: !this.hide,
      ...this.cache_age && { _cache_age: this.cache_age },
      ...this.cache_keys && { _cache_keys: this.cache_keys },
      ...this.max_retries && { _max_retries: this.max_retries }
    };
  }
  /**
   * @private
   * For this node, return all the Futures and other Nodes it has a reference to.
   */
  references() {
    const nodes = /* @__PURE__ */ new Set();
    const futures = /* @__PURE__ */ new Set();
    nodes.add(this);
    for (let node of this.depends) {
      const references = node.references();
      for (let node2 of references.nodes) {
        nodes.add(node2);
      }
      for (let future of references.futures) {
        futures.add(future);
      }
    }
    const collectFutures = /* @__PURE__ */ __name((obj) => {
      if (Array.isArray(obj)) {
        for (let item of obj) {
          collectFutures(item);
        }
      }
      if (obj instanceof Future) {
        futures.add(obj);
        for (let future of obj.referencedFutures()) {
          futures.add(future);
        }
        return;
      }
      if (obj && typeof obj === "object") {
        for (let key of Object.keys(obj)) {
          collectFutures(obj[key]);
        }
      }
    }, "collectFutures");
    collectFutures(this.args);
    for (let future of futures) {
      let directive = future._directive;
      if (directive instanceof Trace) {
        const references = directive.originNode.references();
        for (let node of references.nodes) {
          nodes.add(node);
        }
        for (let future2 of references.futures) {
          futures.add(future2);
        }
      }
    }
    return { nodes, futures };
  }
};
__name(_Node, "Node");
var Node = _Node;

// src/Nodes.ts
var _MultiComputeTextOutChoices = class _MultiComputeTextOutChoices extends FutureArray {
  /** Returns `ComputeTextOut` at given index. */
  at(index) {
    return new ComputeTextOut(this._directive.next(index));
  }
  /** Returns the result for `MultiComputeTextOutChoices` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiComputeTextOutChoices, "MultiComputeTextOutChoices");
var MultiComputeTextOutChoices = _MultiComputeTextOutChoices;
var _BatchComputeTextOutOutputs = class _BatchComputeTextOutOutputs extends FutureArray {
  /** Returns `ComputeTextOut` at given index. */
  at(index) {
    return new ComputeTextOut(this._directive.next(index));
  }
  /** Returns the result for `BatchComputeTextOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_BatchComputeTextOutOutputs, "BatchComputeTextOutOutputs");
var BatchComputeTextOutOutputs = _BatchComputeTextOutOutputs;
var _MultiComputeJSONOutChoices = class _MultiComputeJSONOutChoices extends FutureArray {
  /** Returns `ComputeJSONOut` at given index. */
  at(index) {
    return new ComputeJSONOut(this._directive.next(index));
  }
  /** Returns the result for `MultiComputeJSONOutChoices` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiComputeJSONOutChoices, "MultiComputeJSONOutChoices");
var MultiComputeJSONOutChoices = _MultiComputeJSONOutChoices;
var _BatchComputeJSONOutOutputs = class _BatchComputeJSONOutOutputs extends FutureArray {
  /** Returns `ComputeJSONOut` at given index. */
  at(index) {
    return new ComputeJSONOut(this._directive.next(index));
  }
  /** Returns the result for `BatchComputeJSONOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_BatchComputeJSONOutOutputs, "BatchComputeJSONOutOutputs");
var BatchComputeJSONOutOutputs = _BatchComputeJSONOutOutputs;
var _Mistral7BInstructOutChoices = class _Mistral7BInstructOutChoices extends FutureArray {
  /** Returns `Mistral7BInstructChoice` at given index. */
  at(index) {
    return new Mistral7BInstructChoice(this._directive.next(index));
  }
  /** Returns the result for `Mistral7BInstructOutChoices` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Mistral7BInstructOutChoices, "Mistral7BInstructOutChoices");
var Mistral7BInstructOutChoices = _Mistral7BInstructOutChoices;
var _Mixtral8x7BInstructOutChoices = class _Mixtral8x7BInstructOutChoices extends FutureArray {
  /** Returns `Mixtral8x7BChoice` at given index. */
  at(index) {
    return new Mixtral8x7BChoice(this._directive.next(index));
  }
  /** Returns the result for `Mixtral8x7BInstructOutChoices` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Mixtral8x7BInstructOutChoices, "Mixtral8x7BInstructOutChoices");
var Mixtral8x7BInstructOutChoices = _Mixtral8x7BInstructOutChoices;
var _Llama3Instruct8BOutChoices = class _Llama3Instruct8BOutChoices extends FutureArray {
  /** Returns `Llama3Instruct8BChoice` at given index. */
  at(index) {
    return new Llama3Instruct8BChoice(this._directive.next(index));
  }
  /** Returns the result for `Llama3Instruct8BOutChoices` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Llama3Instruct8BOutChoices, "Llama3Instruct8BOutChoices");
var Llama3Instruct8BOutChoices = _Llama3Instruct8BOutChoices;
var _Llama3Instruct70BOutChoices = class _Llama3Instruct70BOutChoices extends FutureArray {
  /** Returns `Llama3Instruct70BChoice` at given index. */
  at(index) {
    return new Llama3Instruct70BChoice(this._directive.next(index));
  }
  /** Returns the result for `Llama3Instruct70BOutChoices` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Llama3Instruct70BOutChoices, "Llama3Instruct70BOutChoices");
var Llama3Instruct70BOutChoices = _Llama3Instruct70BOutChoices;
var _MultiGenerateImageOutOutputs = class _MultiGenerateImageOutOutputs extends FutureArray {
  /** Returns `GenerateImageOut` at given index. */
  at(index) {
    return new GenerateImageOut(this._directive.next(index));
  }
  /** Returns the result for `MultiGenerateImageOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiGenerateImageOutOutputs, "MultiGenerateImageOutOutputs");
var MultiGenerateImageOutOutputs = _MultiGenerateImageOutOutputs;
var _StableDiffusionXLLightningOutOutputs = class _StableDiffusionXLLightningOutOutputs extends FutureArray {
  /** Returns `StableDiffusionImage` at given index. */
  at(index) {
    return new StableDiffusionImage(this._directive.next(index));
  }
  /** Returns the result for `StableDiffusionXLLightningOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionXLLightningOutOutputs, "StableDiffusionXLLightningOutOutputs");
var StableDiffusionXLLightningOutOutputs = _StableDiffusionXLLightningOutOutputs;
var _StableDiffusionXLControlNetOutOutputs = class _StableDiffusionXLControlNetOutOutputs extends FutureArray {
  /** Returns `StableDiffusionImage` at given index. */
  at(index) {
    return new StableDiffusionImage(this._directive.next(index));
  }
  /** Returns the result for `StableDiffusionXLControlNetOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionXLControlNetOutOutputs, "StableDiffusionXLControlNetOutOutputs");
var StableDiffusionXLControlNetOutOutputs = _StableDiffusionXLControlNetOutOutputs;
var _StableVideoDiffusionOutFrameUris = class _StableVideoDiffusionOutFrameUris extends FutureArray {
  /** Returns `FutureString` at given index. */
  at(index) {
    return new FutureString(this._directive.next(index));
  }
  /** Returns the result for `StableVideoDiffusionOutFrameUris` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableVideoDiffusionOutFrameUris, "StableVideoDiffusionOutFrameUris");
var StableVideoDiffusionOutFrameUris = _StableVideoDiffusionOutFrameUris;
var _InterpolateFramesOutFrameUris = class _InterpolateFramesOutFrameUris extends FutureArray {
  /** Returns `FutureString` at given index. */
  at(index) {
    return new FutureString(this._directive.next(index));
  }
  /** Returns the result for `InterpolateFramesOutFrameUris` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_InterpolateFramesOutFrameUris, "InterpolateFramesOutFrameUris");
var InterpolateFramesOutFrameUris = _InterpolateFramesOutFrameUris;
var _MultiInpaintImageOutOutputs = class _MultiInpaintImageOutOutputs extends FutureArray {
  /** Returns `InpaintImageOut` at given index. */
  at(index) {
    return new InpaintImageOut(this._directive.next(index));
  }
  /** Returns the result for `MultiInpaintImageOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiInpaintImageOutOutputs, "MultiInpaintImageOutOutputs");
var MultiInpaintImageOutOutputs = _MultiInpaintImageOutOutputs;
var _StableDiffusionXLInpaintOutOutputs = class _StableDiffusionXLInpaintOutOutputs extends FutureArray {
  /** Returns `StableDiffusionImage` at given index. */
  at(index) {
    return new StableDiffusionImage(this._directive.next(index));
  }
  /** Returns the result for `StableDiffusionXLInpaintOutOutputs` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionXLInpaintOutOutputs, "StableDiffusionXLInpaintOutOutputs");
var StableDiffusionXLInpaintOutOutputs = _StableDiffusionXLInpaintOutOutputs;
var _TranscribedSegmentWords = class _TranscribedSegmentWords extends FutureArray {
  /** Returns `TranscribedWord` at given index. */
  at(index) {
    return new TranscribedWord(this._directive.next(index));
  }
  /** Returns the result for `TranscribedSegmentWords` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_TranscribedSegmentWords, "TranscribedSegmentWords");
var TranscribedSegmentWords = _TranscribedSegmentWords;
var _TranscribeSpeechOutSegments = class _TranscribeSpeechOutSegments extends FutureArray {
  /** Returns `TranscribedSegment` at given index. */
  at(index) {
    return new TranscribedSegment(this._directive.next(index));
  }
  /** Returns the result for `TranscribeSpeechOutSegments` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_TranscribeSpeechOutSegments, "TranscribeSpeechOutSegments");
var TranscribeSpeechOutSegments = _TranscribeSpeechOutSegments;
var _TranscribeSpeechOutChapters = class _TranscribeSpeechOutChapters extends FutureArray {
  /** Returns `ChapterMarker` at given index. */
  at(index) {
    return new ChapterMarker(this._directive.next(index));
  }
  /** Returns the result for `TranscribeSpeechOutChapters` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_TranscribeSpeechOutChapters, "TranscribeSpeechOutChapters");
var TranscribeSpeechOutChapters = _TranscribeSpeechOutChapters;
var _EmbeddingVector = class _EmbeddingVector extends FutureArray {
  /** Returns `FutureNumber` at given index. */
  at(index) {
    return new FutureNumber(this._directive.next(index));
  }
  /** Returns the result for `EmbeddingVector` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_EmbeddingVector, "EmbeddingVector");
var EmbeddingVector = _EmbeddingVector;
var _MultiEmbedTextOutEmbeddings = class _MultiEmbedTextOutEmbeddings extends FutureArray {
  /** Returns `Embedding` at given index. */
  at(index) {
    return new Embedding(this._directive.next(index));
  }
  /** Returns the result for `MultiEmbedTextOutEmbeddings` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiEmbedTextOutEmbeddings, "MultiEmbedTextOutEmbeddings");
var MultiEmbedTextOutEmbeddings = _MultiEmbedTextOutEmbeddings;
var _JinaV2OutEmbeddings = class _JinaV2OutEmbeddings extends FutureArray {
  /** Returns `Embedding` at given index. */
  at(index) {
    return new Embedding(this._directive.next(index));
  }
  /** Returns the result for `JinaV2OutEmbeddings` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_JinaV2OutEmbeddings, "JinaV2OutEmbeddings");
var JinaV2OutEmbeddings = _JinaV2OutEmbeddings;
var _MultiEmbedImageOutEmbeddings = class _MultiEmbedImageOutEmbeddings extends FutureArray {
  /** Returns `Embedding` at given index. */
  at(index) {
    return new Embedding(this._directive.next(index));
  }
  /** Returns the result for `MultiEmbedImageOutEmbeddings` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiEmbedImageOutEmbeddings, "MultiEmbedImageOutEmbeddings");
var MultiEmbedImageOutEmbeddings = _MultiEmbedImageOutEmbeddings;
var _CLIPOutEmbeddings = class _CLIPOutEmbeddings extends FutureArray {
  /** Returns `Embedding` at given index. */
  at(index) {
    return new Embedding(this._directive.next(index));
  }
  /** Returns the result for `CLIPOutEmbeddings` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_CLIPOutEmbeddings, "CLIPOutEmbeddings");
var CLIPOutEmbeddings = _CLIPOutEmbeddings;
var _ListVectorStoresOutItems = class _ListVectorStoresOutItems extends FutureArray {
  /** Returns `FindOrCreateVectorStoreOut` at given index. */
  at(index) {
    return new FindOrCreateVectorStoreOut(this._directive.next(index));
  }
  /** Returns the result for `ListVectorStoresOutItems` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_ListVectorStoresOutItems, "ListVectorStoresOutItems");
var ListVectorStoresOutItems = _ListVectorStoresOutItems;
var _VectorVector = class _VectorVector extends FutureArray {
  /** Returns `FutureNumber` at given index. */
  at(index) {
    return new FutureNumber(this._directive.next(index));
  }
  /** Returns the result for `VectorVector` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_VectorVector, "VectorVector");
var VectorVector = _VectorVector;
var _FetchVectorsOutVectors = class _FetchVectorsOutVectors extends FutureArray {
  /** Returns `Vector` at given index. */
  at(index) {
    return new Vector(this._directive.next(index));
  }
  /** Returns the result for `FetchVectorsOutVectors` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_FetchVectorsOutVectors, "FetchVectorsOutVectors");
var FetchVectorsOutVectors = _FetchVectorsOutVectors;
var _VectorStoreQueryResultVector = class _VectorStoreQueryResultVector extends FutureArray {
  /** Returns `FutureNumber` at given index. */
  at(index) {
    return new FutureNumber(this._directive.next(index));
  }
  /** Returns the result for `VectorStoreQueryResultVector` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_VectorStoreQueryResultVector, "VectorStoreQueryResultVector");
var VectorStoreQueryResultVector = _VectorStoreQueryResultVector;
var _QueryVectorStoreOutResults = class _QueryVectorStoreOutResults extends FutureArray {
  /** Returns `QueryVectorStoreOutResultsItem` at given index. */
  at(index) {
    return new QueryVectorStoreOutResultsItem(this._directive.next(index));
  }
  /** Returns the result for `QueryVectorStoreOutResults` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_QueryVectorStoreOutResults, "QueryVectorStoreOutResults");
var QueryVectorStoreOutResults = _QueryVectorStoreOutResults;
var _QueryVectorStoreOutResultsItem = class _QueryVectorStoreOutResultsItem extends FutureArray {
  /** Returns `VectorStoreQueryResult` at given index. */
  at(index) {
    return new VectorStoreQueryResult(this._directive.next(index));
  }
  /** Returns the result for `QueryVectorStoreOutResultsItem` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_QueryVectorStoreOutResultsItem, "QueryVectorStoreOutResultsItem");
var QueryVectorStoreOutResultsItem = _QueryVectorStoreOutResultsItem;
var _SplitDocumentOutItems = class _SplitDocumentOutItems extends FutureArray {
  /** Returns `EmbedTextItem` at given index. */
  at(index) {
    return new EmbedTextItem(this._directive.next(index));
  }
  /** Returns the result for `SplitDocumentOutItems` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_SplitDocumentOutItems, "SplitDocumentOutItems");
var SplitDocumentOutItems = _SplitDocumentOutItems;
var _ExperimentalOut = class _ExperimentalOut extends FutureObject {
  /** Response. */
  get output() {
    return new FutureAnyObject(this._directive.next("output"));
  }
  /** returns the result for `ExperimentalOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_ExperimentalOut, "ExperimentalOut");
var ExperimentalOut = _ExperimentalOut;
var _BoxOut = class _BoxOut extends FutureObject {
  /** The evaluated result. */
  get value() {
    return new FutureAnyObject(this._directive.next("value"));
  }
  /** returns the result for `BoxOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_BoxOut, "BoxOut");
var BoxOut = _BoxOut;
var _IfOut = class _IfOut extends FutureObject {
  /** Result. Null if `value_if_false` is not provided and `condition` is false. */
  get result() {
    return new FutureAnyObject(this._directive.next("result"));
  }
  /** returns the result for `IfOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_IfOut, "IfOut");
var IfOut = _IfOut;
var _ComputeTextOut = class _ComputeTextOut extends FutureObject {
  /** Text response. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** returns the result for `ComputeTextOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_ComputeTextOut, "ComputeTextOut");
var ComputeTextOut = _ComputeTextOut;
var _ComputeJSONOut = class _ComputeJSONOut extends FutureObject {
  /** JSON response. */
  get json_object() {
    return new FutureAnyObject(this._directive.next("json_object"));
  }
  /** If the model output could not be parsed to JSON, this is the raw text output. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** returns the result for `ComputeJSONOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_ComputeJSONOut, "ComputeJSONOut");
var ComputeJSONOut = _ComputeJSONOut;
var _MultiComputeTextOut = class _MultiComputeTextOut extends FutureObject {
  /** Response choices. */
  get choices() {
    return new MultiComputeTextOutChoices(this._directive.next("choices"));
  }
  /** returns the result for `MultiComputeTextOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiComputeTextOut, "MultiComputeTextOut");
var MultiComputeTextOut = _MultiComputeTextOut;
var _BatchComputeTextOut = class _BatchComputeTextOut extends FutureObject {
  /** Batch outputs. */
  get outputs() {
    return new BatchComputeTextOutOutputs(this._directive.next("outputs"));
  }
  /** returns the result for `BatchComputeTextOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_BatchComputeTextOut, "BatchComputeTextOut");
var BatchComputeTextOut = _BatchComputeTextOut;
var _MultiComputeJSONOut = class _MultiComputeJSONOut extends FutureObject {
  /** Response choices. */
  get choices() {
    return new MultiComputeJSONOutChoices(this._directive.next("choices"));
  }
  /** returns the result for `MultiComputeJSONOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiComputeJSONOut, "MultiComputeJSONOut");
var MultiComputeJSONOut = _MultiComputeJSONOut;
var _BatchComputeJSONOut = class _BatchComputeJSONOut extends FutureObject {
  /** Batch outputs. */
  get outputs() {
    return new BatchComputeJSONOutOutputs(this._directive.next("outputs"));
  }
  /** returns the result for `BatchComputeJSONOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_BatchComputeJSONOut, "BatchComputeJSONOut");
var BatchComputeJSONOut = _BatchComputeJSONOut;
var _Mistral7BInstructChoice = class _Mistral7BInstructChoice extends FutureObject {
  /** Text response, if `json_schema` was not provided. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** JSON response, if `json_schema` was provided. */
  get json_object() {
    return new FutureAnyObject(this._directive.next("json_object"));
  }
  /** returns the result for `Mistral7BInstructChoice` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Mistral7BInstructChoice, "Mistral7BInstructChoice");
var Mistral7BInstructChoice = _Mistral7BInstructChoice;
var _Mistral7BInstructOut = class _Mistral7BInstructOut extends FutureObject {
  /** Response choices. */
  get choices() {
    return new Mistral7BInstructOutChoices(this._directive.next("choices"));
  }
  /** returns the result for `Mistral7BInstructOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Mistral7BInstructOut, "Mistral7BInstructOut");
var Mistral7BInstructOut = _Mistral7BInstructOut;
var _Mixtral8x7BChoice = class _Mixtral8x7BChoice extends FutureObject {
  /** Text response, if `json_schema` was not provided. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** JSON response, if `json_schema` was provided. */
  get json_object() {
    return new FutureAnyObject(this._directive.next("json_object"));
  }
  /** returns the result for `Mixtral8x7BChoice` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Mixtral8x7BChoice, "Mixtral8x7BChoice");
var Mixtral8x7BChoice = _Mixtral8x7BChoice;
var _Mixtral8x7BInstructOut = class _Mixtral8x7BInstructOut extends FutureObject {
  /** Response choices. */
  get choices() {
    return new Mixtral8x7BInstructOutChoices(this._directive.next("choices"));
  }
  /** returns the result for `Mixtral8x7BInstructOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Mixtral8x7BInstructOut, "Mixtral8x7BInstructOut");
var Mixtral8x7BInstructOut = _Mixtral8x7BInstructOut;
var _Llama3Instruct8BChoice = class _Llama3Instruct8BChoice extends FutureObject {
  /** Text response. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** JSON response, if `json_schema` was provided. */
  get json_object() {
    return new FutureAnyObject(this._directive.next("json_object"));
  }
  /** returns the result for `Llama3Instruct8BChoice` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Llama3Instruct8BChoice, "Llama3Instruct8BChoice");
var Llama3Instruct8BChoice = _Llama3Instruct8BChoice;
var _Llama3Instruct8BOut = class _Llama3Instruct8BOut extends FutureObject {
  /** Response choices. */
  get choices() {
    return new Llama3Instruct8BOutChoices(this._directive.next("choices"));
  }
  /** returns the result for `Llama3Instruct8BOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Llama3Instruct8BOut, "Llama3Instruct8BOut");
var Llama3Instruct8BOut = _Llama3Instruct8BOut;
var _Llama3Instruct70BChoice = class _Llama3Instruct70BChoice extends FutureObject {
  /** Text response. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** returns the result for `Llama3Instruct70BChoice` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Llama3Instruct70BChoice, "Llama3Instruct70BChoice");
var Llama3Instruct70BChoice = _Llama3Instruct70BChoice;
var _Llama3Instruct70BOut = class _Llama3Instruct70BOut extends FutureObject {
  /** Response choices. */
  get choices() {
    return new Llama3Instruct70BOutChoices(this._directive.next("choices"));
  }
  /** returns the result for `Llama3Instruct70BOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Llama3Instruct70BOut, "Llama3Instruct70BOut");
var Llama3Instruct70BOut = _Llama3Instruct70BOut;
var _Firellava13BOut = class _Firellava13BOut extends FutureObject {
  /** Text response. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** returns the result for `Firellava13BOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Firellava13BOut, "Firellava13BOut");
var Firellava13BOut = _Firellava13BOut;
var _GenerateImageOut = class _GenerateImageOut extends FutureObject {
  /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get image_uri() {
    return new FutureString(this._directive.next("image_uri"));
  }
  /** returns the result for `GenerateImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_GenerateImageOut, "GenerateImageOut");
var GenerateImageOut = _GenerateImageOut;
var _MultiGenerateImageOut = class _MultiGenerateImageOut extends FutureObject {
  /** Generated images. */
  get outputs() {
    return new MultiGenerateImageOutOutputs(this._directive.next("outputs"));
  }
  /** returns the result for `MultiGenerateImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiGenerateImageOut, "MultiGenerateImageOut");
var MultiGenerateImageOut = _MultiGenerateImageOut;
var _StableDiffusionImage = class _StableDiffusionImage extends FutureObject {
  /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get image_uri() {
    return new FutureString(this._directive.next("image_uri"));
  }
  /** The random noise seed used for generation. */
  get seed() {
    return new FutureNumber(this._directive.next("seed"));
  }
  /** returns the result for `StableDiffusionImage` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionImage, "StableDiffusionImage");
var StableDiffusionImage = _StableDiffusionImage;
var _StableDiffusionXLLightningOut = class _StableDiffusionXLLightningOut extends FutureObject {
  /** Generated images. */
  get outputs() {
    return new StableDiffusionXLLightningOutOutputs(
      this._directive.next("outputs")
    );
  }
  /** returns the result for `StableDiffusionXLLightningOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionXLLightningOut, "StableDiffusionXLLightningOut");
var StableDiffusionXLLightningOut = _StableDiffusionXLLightningOut;
var _StableDiffusionXLControlNetOut = class _StableDiffusionXLControlNetOut extends FutureObject {
  /** Generated images. */
  get outputs() {
    return new StableDiffusionXLControlNetOutOutputs(
      this._directive.next("outputs")
    );
  }
  /** returns the result for `StableDiffusionXLControlNetOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionXLControlNetOut, "StableDiffusionXLControlNetOut");
var StableDiffusionXLControlNetOut = _StableDiffusionXLControlNetOut;
var _StableVideoDiffusionOut = class _StableVideoDiffusionOut extends FutureObject {
  /** Generated video. */
  get video_uri() {
    return new FutureString(this._directive.next("video_uri"));
  }
  /** Generated frames. */
  get frame_uris() {
    return new StableVideoDiffusionOutFrameUris(
      this._directive.next("frame_uris")
    );
  }
  /** returns the result for `StableVideoDiffusionOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableVideoDiffusionOut, "StableVideoDiffusionOut");
var StableVideoDiffusionOut = _StableVideoDiffusionOut;
var _InterpolateFramesOut = class _InterpolateFramesOut extends FutureObject {
  /** Generated video. */
  get video_uri() {
    return new FutureString(this._directive.next("video_uri"));
  }
  /** Output frames. */
  get frame_uris() {
    return new InterpolateFramesOutFrameUris(
      this._directive.next("frame_uris")
    );
  }
  /** returns the result for `InterpolateFramesOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_InterpolateFramesOut, "InterpolateFramesOut");
var InterpolateFramesOut = _InterpolateFramesOut;
var _InpaintImageOut = class _InpaintImageOut extends FutureObject {
  /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get image_uri() {
    return new FutureString(this._directive.next("image_uri"));
  }
  /** returns the result for `InpaintImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_InpaintImageOut, "InpaintImageOut");
var InpaintImageOut = _InpaintImageOut;
var _MultiInpaintImageOut = class _MultiInpaintImageOut extends FutureObject {
  /** Generated images. */
  get outputs() {
    return new MultiInpaintImageOutOutputs(this._directive.next("outputs"));
  }
  /** returns the result for `MultiInpaintImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiInpaintImageOut, "MultiInpaintImageOut");
var MultiInpaintImageOut = _MultiInpaintImageOut;
var _StableDiffusionXLInpaintOut = class _StableDiffusionXLInpaintOut extends FutureObject {
  /** Generated images. */
  get outputs() {
    return new StableDiffusionXLInpaintOutOutputs(
      this._directive.next("outputs")
    );
  }
  /** returns the result for `StableDiffusionXLInpaintOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_StableDiffusionXLInpaintOut, "StableDiffusionXLInpaintOut");
var StableDiffusionXLInpaintOut = _StableDiffusionXLInpaintOut;
var _EraseImageOut = class _EraseImageOut extends FutureObject {
  /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get image_uri() {
    return new FutureString(this._directive.next("image_uri"));
  }
  /** returns the result for `EraseImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_EraseImageOut, "EraseImageOut");
var EraseImageOut = _EraseImageOut;
var _RemoveBackgroundOut = class _RemoveBackgroundOut extends FutureObject {
  /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get image_uri() {
    return new FutureString(this._directive.next("image_uri"));
  }
  /** returns the result for `RemoveBackgroundOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_RemoveBackgroundOut, "RemoveBackgroundOut");
var RemoveBackgroundOut = _RemoveBackgroundOut;
var _UpscaleImageOut = class _UpscaleImageOut extends FutureObject {
  /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get image_uri() {
    return new FutureString(this._directive.next("image_uri"));
  }
  /** returns the result for `UpscaleImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_UpscaleImageOut, "UpscaleImageOut");
var UpscaleImageOut = _UpscaleImageOut;
var _SegmentUnderPointOut = class _SegmentUnderPointOut extends FutureObject {
  /** Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get mask_image_uri() {
    return new FutureString(this._directive.next("mask_image_uri"));
  }
  /** returns the result for `SegmentUnderPointOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_SegmentUnderPointOut, "SegmentUnderPointOut");
var SegmentUnderPointOut = _SegmentUnderPointOut;
var _SegmentAnythingOut = class _SegmentAnythingOut extends FutureObject {
  /** Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
  get mask_image_uri() {
    return new FutureString(this._directive.next("mask_image_uri"));
  }
  /** returns the result for `SegmentAnythingOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_SegmentAnythingOut, "SegmentAnythingOut");
var SegmentAnythingOut = _SegmentAnythingOut;
var _TranscribedWord = class _TranscribedWord extends FutureObject {
  /** Text of word. */
  get word() {
    return new FutureString(this._directive.next("word"));
  }
  /** (Optional) Start time of word, in seconds. */
  get start() {
    return new FutureNumber(this._directive.next("start"));
  }
  /** (Optional) End time of word, in seconds. */
  get end() {
    return new FutureNumber(this._directive.next("end"));
  }
  /** (Optional) ID of speaker, if `diarize` is enabled. */
  get speaker() {
    return new FutureString(this._directive.next("speaker"));
  }
  /** returns the result for `TranscribedWord` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_TranscribedWord, "TranscribedWord");
var TranscribedWord = _TranscribedWord;
var _TranscribedSegment = class _TranscribedSegment extends FutureObject {
  /** Text of segment. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** Start time of segment, in seconds. */
  get start() {
    return new FutureNumber(this._directive.next("start"));
  }
  /** End time of segment, in seconds. */
  get end() {
    return new FutureNumber(this._directive.next("end"));
  }
  /** (Optional) ID of speaker, if `diarize` is enabled. */
  get speaker() {
    return new FutureString(this._directive.next("speaker"));
  }
  /** (Optional) Aligned words, if `align` is enabled. */
  get words() {
    return new TranscribedSegmentWords(this._directive.next("words"));
  }
  /** returns the result for `TranscribedSegment` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_TranscribedSegment, "TranscribedSegment");
var TranscribedSegment = _TranscribedSegment;
var _ChapterMarker = class _ChapterMarker extends FutureObject {
  /** Chapter title. */
  get title() {
    return new FutureString(this._directive.next("title"));
  }
  /** Start time of chapter, in seconds. */
  get start() {
    return new FutureNumber(this._directive.next("start"));
  }
  /** returns the result for `ChapterMarker` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_ChapterMarker, "ChapterMarker");
var ChapterMarker = _ChapterMarker;
var _TranscribeSpeechOut = class _TranscribeSpeechOut extends FutureObject {
  /** Transcribed text. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** (Optional) Transcribed segments, if `segment` is enabled. */
  get segments() {
    return new TranscribeSpeechOutSegments(this._directive.next("segments"));
  }
  /** (Optional) Chapter markers, if `suggest_chapters` is enabled. */
  get chapters() {
    return new TranscribeSpeechOutChapters(this._directive.next("chapters"));
  }
  /** returns the result for `TranscribeSpeechOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_TranscribeSpeechOut, "TranscribeSpeechOut");
var TranscribeSpeechOut = _TranscribeSpeechOut;
var _GenerateSpeechOut = class _GenerateSpeechOut extends FutureObject {
  /** Base 64-encoded WAV audio bytes, or a hosted audio url if `store` is provided. */
  get audio_uri() {
    return new FutureString(this._directive.next("audio_uri"));
  }
  /** returns the result for `GenerateSpeechOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_GenerateSpeechOut, "GenerateSpeechOut");
var GenerateSpeechOut = _GenerateSpeechOut;
var _Embedding = class _Embedding extends FutureObject {
  /** Embedding vector. */
  get vector() {
    return new EmbeddingVector(this._directive.next("vector"));
  }
  /** (Optional) Vector store document ID. */
  get doc_id() {
    return new FutureString(this._directive.next("doc_id"));
  }
  /** (Optional) Vector store document metadata. */
  get metadata() {
    return new FutureAnyObject(this._directive.next("metadata"));
  }
  /** returns the result for `Embedding` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Embedding, "Embedding");
var Embedding = _Embedding;
var _EmbedTextOut = class _EmbedTextOut extends FutureObject {
  /** Generated embedding. */
  get embedding() {
    return new Embedding(this._directive.next("embedding"));
  }
  /** returns the result for `EmbedTextOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_EmbedTextOut, "EmbedTextOut");
var EmbedTextOut = _EmbedTextOut;
var _EmbedTextItem = class _EmbedTextItem extends FutureObject {
  /** Text to embed. */
  get text() {
    return new FutureString(this._directive.next("text"));
  }
  /** (Optional) Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
  get metadata() {
    return new FutureAnyObject(this._directive.next("metadata"));
  }
  /** (Optional) Vector store document ID. Ignored if `collection_name` is unset. */
  get doc_id() {
    return new FutureString(this._directive.next("doc_id"));
  }
  /** returns the result for `EmbedTextItem` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_EmbedTextItem, "EmbedTextItem");
var EmbedTextItem = _EmbedTextItem;
var _MultiEmbedTextOut = class _MultiEmbedTextOut extends FutureObject {
  /** Generated embeddings. */
  get embeddings() {
    return new MultiEmbedTextOutEmbeddings(this._directive.next("embeddings"));
  }
  /** returns the result for `MultiEmbedTextOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiEmbedTextOut, "MultiEmbedTextOut");
var MultiEmbedTextOut = _MultiEmbedTextOut;
var _JinaV2Out = class _JinaV2Out extends FutureObject {
  /** Generated embeddings. */
  get embeddings() {
    return new JinaV2OutEmbeddings(this._directive.next("embeddings"));
  }
  /** returns the result for `JinaV2Out` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_JinaV2Out, "JinaV2Out");
var JinaV2Out = _JinaV2Out;
var _EmbedImageOut = class _EmbedImageOut extends FutureObject {
  /** Generated embedding. */
  get embedding() {
    return new Embedding(this._directive.next("embedding"));
  }
  /** returns the result for `EmbedImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_EmbedImageOut, "EmbedImageOut");
var EmbedImageOut = _EmbedImageOut;
var _MultiEmbedImageOut = class _MultiEmbedImageOut extends FutureObject {
  /** Generated embeddings. */
  get embeddings() {
    return new MultiEmbedImageOutEmbeddings(this._directive.next("embeddings"));
  }
  /** returns the result for `MultiEmbedImageOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_MultiEmbedImageOut, "MultiEmbedImageOut");
var MultiEmbedImageOut = _MultiEmbedImageOut;
var _CLIPOut = class _CLIPOut extends FutureObject {
  /** Generated embeddings. */
  get embeddings() {
    return new CLIPOutEmbeddings(this._directive.next("embeddings"));
  }
  /** returns the result for `CLIPOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_CLIPOut, "CLIPOut");
var CLIPOut = _CLIPOut;
var _FindOrCreateVectorStoreOut = class _FindOrCreateVectorStoreOut extends FutureObject {
  /** Vector store name. */
  get collection_name() {
    return new FutureString(this._directive.next("collection_name"));
  }
  /** Selected embedding model. */
  get model() {
    return new FutureString(this._directive.next("model"));
  }
  /** (Optional) Number of leaves in the vector store. */
  get num_leaves() {
    return new FutureNumber(this._directive.next("num_leaves"));
  }
  /** returns the result for `FindOrCreateVectorStoreOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_FindOrCreateVectorStoreOut, "FindOrCreateVectorStoreOut");
var FindOrCreateVectorStoreOut = _FindOrCreateVectorStoreOut;
var _ListVectorStoresOut = class _ListVectorStoresOut extends FutureObject {
  /** List of vector stores. */
  get items() {
    return new ListVectorStoresOutItems(this._directive.next("items"));
  }
  /** returns the result for `ListVectorStoresOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_ListVectorStoresOut, "ListVectorStoresOut");
var ListVectorStoresOut = _ListVectorStoresOut;
var _DeleteVectorStoreOut = class _DeleteVectorStoreOut extends FutureObject {
  /** Vector store name. */
  get collection_name() {
    return new FutureString(this._directive.next("collection_name"));
  }
  /** Selected embedding model. */
  get model() {
    return new FutureString(this._directive.next("model"));
  }
  /** returns the result for `DeleteVectorStoreOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_DeleteVectorStoreOut, "DeleteVectorStoreOut");
var DeleteVectorStoreOut = _DeleteVectorStoreOut;
var _Vector = class _Vector extends FutureObject {
  /** Document ID. */
  get id() {
    return new FutureString(this._directive.next("id"));
  }
  /** Embedding vector. */
  get vector() {
    return new VectorVector(this._directive.next("vector"));
  }
  /** Document metadata. */
  get metadata() {
    return new FutureAnyObject(this._directive.next("metadata"));
  }
  /** returns the result for `Vector` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_Vector, "Vector");
var Vector = _Vector;
var _FetchVectorsOut = class _FetchVectorsOut extends FutureObject {
  /** Retrieved vectors. */
  get vectors() {
    return new FetchVectorsOutVectors(this._directive.next("vectors"));
  }
  /** returns the result for `FetchVectorsOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_FetchVectorsOut, "FetchVectorsOut");
var FetchVectorsOut = _FetchVectorsOut;
var _UpdateVectorsOut = class _UpdateVectorsOut extends FutureObject {
  /** Number of vectors modified. */
  get count() {
    return new FutureNumber(this._directive.next("count"));
  }
  /** returns the result for `UpdateVectorsOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_UpdateVectorsOut, "UpdateVectorsOut");
var UpdateVectorsOut = _UpdateVectorsOut;
var _DeleteVectorsOut = class _DeleteVectorsOut extends FutureObject {
  /** Number of vectors modified. */
  get count() {
    return new FutureNumber(this._directive.next("count"));
  }
  /** returns the result for `DeleteVectorsOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_DeleteVectorsOut, "DeleteVectorsOut");
var DeleteVectorsOut = _DeleteVectorsOut;
var _VectorStoreQueryResult = class _VectorStoreQueryResult extends FutureObject {
  /** Document ID. */
  get id() {
    return new FutureString(this._directive.next("id"));
  }
  /** Similarity score. */
  get distance() {
    return new FutureNumber(this._directive.next("distance"));
  }
  /** (Optional) Embedding vector. */
  get vector() {
    return new VectorStoreQueryResultVector(this._directive.next("vector"));
  }
  /** (Optional) Document metadata. */
  get metadata() {
    return new FutureAnyObject(this._directive.next("metadata"));
  }
  /** returns the result for `VectorStoreQueryResult` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_VectorStoreQueryResult, "VectorStoreQueryResult");
var VectorStoreQueryResult = _VectorStoreQueryResult;
var _QueryVectorStoreOut = class _QueryVectorStoreOut extends FutureObject {
  /** Query results. */
  get results() {
    return new QueryVectorStoreOutResults(this._directive.next("results"));
  }
  /** (Optional) Vector store name. */
  get collection_name() {
    return new FutureString(this._directive.next("collection_name"));
  }
  /** (Optional) Selected embedding model. */
  get model() {
    return new FutureString(this._directive.next("model"));
  }
  /** returns the result for `QueryVectorStoreOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_QueryVectorStoreOut, "QueryVectorStoreOut");
var QueryVectorStoreOut = _QueryVectorStoreOut;
var _SplitDocumentOut = class _SplitDocumentOut extends FutureObject {
  /** Document chunks */
  get items() {
    return new SplitDocumentOutItems(this._directive.next("items"));
  }
  /** returns the result for `SplitDocumentOut` once it's node has been run. */
  async _result() {
    return super._result();
  }
};
__name(_SplitDocumentOut, "SplitDocumentOut");
var SplitDocumentOut = _SplitDocumentOut;
var _Experimental = class _Experimental extends Node {
  /**
   * Input arguments: `name`, `args`, `timeout` (optional)
   *
   * Output fields: `output`
   *
   * https://www.substrate.run/nodes#Experimental
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Experimental";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `output`
   *
   * https://www.substrate.run/nodes#Experimental
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `output`
   *
   * https://www.substrate.run/nodes#Experimental
   */
  get future() {
    return new ExperimentalOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Experimental, "Experimental");
var Experimental = _Experimental;
var _Box = class _Box extends Node {
  /**
   * Input arguments: `value`
   *
   * Output fields: `value`
   *
   * https://www.substrate.run/nodes#Box
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Box";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `value`
   *
   * https://www.substrate.run/nodes#Box
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `value`
   *
   * https://www.substrate.run/nodes#Box
   */
  get future() {
    return new BoxOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Box, "Box");
var Box = _Box;
var _If = class _If extends Node {
  /**
   * Input arguments: `condition`, `value_if_true`, `value_if_false` (optional)
   *
   * Output fields: `result`
   *
   * https://www.substrate.run/nodes#If
   */
  constructor(args, options) {
    super(args, options);
    this.node = "LogicalIf";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `result`
   *
   * https://www.substrate.run/nodes#If
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `result`
   *
   * https://www.substrate.run/nodes#If
   */
  get future() {
    return new IfOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_If, "If");
var If = _If;
var _ComputeText = class _ComputeText extends Node {
  /**
   * Input arguments: `prompt`, `image_uris` (optional), `temperature` (optional), `max_tokens` (optional), `model` (optional)
   *
   * Output fields: `text`
   *
   * https://www.substrate.run/nodes#ComputeText
   */
  constructor(args, options) {
    super(args, options);
    this.node = "ComputeText";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `text`
   *
   * https://www.substrate.run/nodes#ComputeText
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `text`
   *
   * https://www.substrate.run/nodes#ComputeText
   */
  get future() {
    return new ComputeTextOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_ComputeText, "ComputeText");
var ComputeText = _ComputeText;
var _MultiComputeText = class _MultiComputeText extends Node {
  /**
   * Input arguments: `prompt`, `num_choices`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#MultiComputeText
   */
  constructor(args, options) {
    super(args, options);
    this.node = "MultiComputeText";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#MultiComputeText
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#MultiComputeText
   */
  get future() {
    return new MultiComputeTextOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_MultiComputeText, "MultiComputeText");
var MultiComputeText = _MultiComputeText;
var _BatchComputeText = class _BatchComputeText extends Node {
  /**
   * Input arguments: `prompts`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#BatchComputeText
   */
  constructor(args, options) {
    super(args, options);
    this.node = "BatchComputeText";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#BatchComputeText
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#BatchComputeText
   */
  get future() {
    return new BatchComputeTextOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_BatchComputeText, "BatchComputeText");
var BatchComputeText = _BatchComputeText;
var _BatchComputeJSON = class _BatchComputeJSON extends Node {
  /**
   * Input arguments: `prompts`, `json_schema`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#BatchComputeJSON
   */
  constructor(args, options) {
    super(args, options);
    this.node = "BatchComputeJSON";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#BatchComputeJSON
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#BatchComputeJSON
   */
  get future() {
    return new BatchComputeJSONOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_BatchComputeJSON, "BatchComputeJSON");
var BatchComputeJSON = _BatchComputeJSON;
var _ComputeJSON = class _ComputeJSON extends Node {
  /**
   * Input arguments: `prompt`, `json_schema`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
   *
   * Output fields: `json_object` (optional), `text` (optional)
   *
   * https://www.substrate.run/nodes#ComputeJSON
   */
  constructor(args, options) {
    super(args, options);
    this.node = "ComputeJSON";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `json_object` (optional), `text` (optional)
   *
   * https://www.substrate.run/nodes#ComputeJSON
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `json_object` (optional), `text` (optional)
   *
   * https://www.substrate.run/nodes#ComputeJSON
   */
  get future() {
    return new ComputeJSONOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_ComputeJSON, "ComputeJSON");
var ComputeJSON = _ComputeJSON;
var _MultiComputeJSON = class _MultiComputeJSON extends Node {
  /**
   * Input arguments: `prompt`, `json_schema`, `num_choices`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#MultiComputeJSON
   */
  constructor(args, options) {
    super(args, options);
    this.node = "MultiComputeJSON";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#MultiComputeJSON
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#MultiComputeJSON
   */
  get future() {
    return new MultiComputeJSONOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_MultiComputeJSON, "MultiComputeJSON");
var MultiComputeJSON = _MultiComputeJSON;
var _Mistral7BInstruct = class _Mistral7BInstruct extends Node {
  /**
   * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `json_schema` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional)
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Mistral7BInstruct
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Mistral7BInstruct";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Mistral7BInstruct
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Mistral7BInstruct
   */
  get future() {
    return new Mistral7BInstructOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Mistral7BInstruct, "Mistral7BInstruct");
var Mistral7BInstruct = _Mistral7BInstruct;
var _Mixtral8x7BInstruct = class _Mixtral8x7BInstruct extends Node {
  /**
   * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `json_schema` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional)
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Mixtral8x7BInstruct
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Mixtral8x7BInstruct";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Mixtral8x7BInstruct
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Mixtral8x7BInstruct
   */
  get future() {
    return new Mixtral8x7BInstructOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Mixtral8x7BInstruct, "Mixtral8x7BInstruct");
var Mixtral8x7BInstruct = _Mixtral8x7BInstruct;
var _Llama3Instruct8B = class _Llama3Instruct8B extends Node {
  /**
   * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional), `json_schema` (optional)
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Llama3Instruct8B
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Llama3Instruct8B";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Llama3Instruct8B
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Llama3Instruct8B
   */
  get future() {
    return new Llama3Instruct8BOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Llama3Instruct8B, "Llama3Instruct8B");
var Llama3Instruct8B = _Llama3Instruct8B;
var _Llama3Instruct70B = class _Llama3Instruct70B extends Node {
  /**
   * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional)
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Llama3Instruct70B
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Llama3Instruct70B";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Llama3Instruct70B
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `choices`
   *
   * https://www.substrate.run/nodes#Llama3Instruct70B
   */
  get future() {
    return new Llama3Instruct70BOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Llama3Instruct70B, "Llama3Instruct70B");
var Llama3Instruct70B = _Llama3Instruct70B;
var _Firellava13B = class _Firellava13B extends Node {
  /**
   * Input arguments: `prompt`, `image_uris`, `max_tokens` (optional)
   *
   * Output fields: `text`
   *
   * https://www.substrate.run/nodes#Firellava13B
   */
  constructor(args, options) {
    super(args, options);
    this.node = "Firellava13B";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `text`
   *
   * https://www.substrate.run/nodes#Firellava13B
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `text`
   *
   * https://www.substrate.run/nodes#Firellava13B
   */
  get future() {
    return new Firellava13BOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_Firellava13B, "Firellava13B");
var Firellava13B = _Firellava13B;
var _GenerateImage = class _GenerateImage extends Node {
  /**
   * Input arguments: `prompt`, `store` (optional)
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#GenerateImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "GenerateImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#GenerateImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#GenerateImage
   */
  get future() {
    return new GenerateImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_GenerateImage, "GenerateImage");
var GenerateImage = _GenerateImage;
var _MultiGenerateImage = class _MultiGenerateImage extends Node {
  /**
   * Input arguments: `prompt`, `num_images`, `store` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#MultiGenerateImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "MultiGenerateImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#MultiGenerateImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#MultiGenerateImage
   */
  get future() {
    return new MultiGenerateImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_MultiGenerateImage, "MultiGenerateImage");
var MultiGenerateImage = _MultiGenerateImage;
var _InpaintImage = class _InpaintImage extends Node {
  /**
   * Input arguments: `image_uri`, `prompt`, `mask_image_uri` (optional), `store` (optional)
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#InpaintImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "InpaintImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#InpaintImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#InpaintImage
   */
  get future() {
    return new InpaintImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_InpaintImage, "InpaintImage");
var InpaintImage = _InpaintImage;
var _MultiInpaintImage = class _MultiInpaintImage extends Node {
  /**
   * Input arguments: `image_uri`, `prompt`, `mask_image_uri` (optional), `num_images`, `store` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#MultiInpaintImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "MultiInpaintImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#MultiInpaintImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#MultiInpaintImage
   */
  get future() {
    return new MultiInpaintImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_MultiInpaintImage, "MultiInpaintImage");
var MultiInpaintImage = _MultiInpaintImage;
var _StableDiffusionXLLightning = class _StableDiffusionXLLightning extends Node {
  /**
   * Input arguments: `prompt`, `negative_prompt` (optional), `num_images` (optional), `store` (optional), `height` (optional), `width` (optional), `seeds` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLLightning
   */
  constructor(args, options) {
    super(args, options);
    this.node = "StableDiffusionXLLightning";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLLightning
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLLightning
   */
  get future() {
    return new StableDiffusionXLLightningOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_StableDiffusionXLLightning, "StableDiffusionXLLightning");
var StableDiffusionXLLightning = _StableDiffusionXLLightning;
var _StableDiffusionXLInpaint = class _StableDiffusionXLInpaint extends Node {
  /**
   * Input arguments: `image_uri`, `prompt`, `mask_image_uri` (optional), `num_images`, `output_resolution` (optional), `negative_prompt` (optional), `store` (optional), `strength` (optional), `seeds` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLInpaint
   */
  constructor(args, options) {
    super(args, options);
    this.node = "StableDiffusionXLInpaint";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLInpaint
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLInpaint
   */
  get future() {
    return new StableDiffusionXLInpaintOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_StableDiffusionXLInpaint, "StableDiffusionXLInpaint");
var StableDiffusionXLInpaint = _StableDiffusionXLInpaint;
var _StableDiffusionXLControlNet = class _StableDiffusionXLControlNet extends Node {
  /**
   * Input arguments: `image_uri`, `control_method`, `prompt`, `num_images`, `output_resolution` (optional), `negative_prompt` (optional), `store` (optional), `conditioning_scale` (optional), `strength` (optional), `seeds` (optional)
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLControlNet
   */
  constructor(args, options) {
    super(args, options);
    this.node = "StableDiffusionXLControlNet";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLControlNet
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `outputs`
   *
   * https://www.substrate.run/nodes#StableDiffusionXLControlNet
   */
  get future() {
    return new StableDiffusionXLControlNetOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_StableDiffusionXLControlNet, "StableDiffusionXLControlNet");
var StableDiffusionXLControlNet = _StableDiffusionXLControlNet;
var _StableVideoDiffusion = class _StableVideoDiffusion extends Node {
  /**
   * Input arguments: `image_uri`, `store` (optional), `output_format` (optional), `seed` (optional), `fps` (optional), `motion_bucket_id` (optional), `noise` (optional)
   *
   * Output fields: `video_uri` (optional), `frame_uris` (optional)
   *
   * https://www.substrate.run/nodes#StableVideoDiffusion
   */
  constructor(args, options) {
    super(args, options);
    this.node = "StableVideoDiffusion";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `video_uri` (optional), `frame_uris` (optional)
   *
   * https://www.substrate.run/nodes#StableVideoDiffusion
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `video_uri` (optional), `frame_uris` (optional)
   *
   * https://www.substrate.run/nodes#StableVideoDiffusion
   */
  get future() {
    return new StableVideoDiffusionOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_StableVideoDiffusion, "StableVideoDiffusion");
var StableVideoDiffusion = _StableVideoDiffusion;
var _InterpolateFrames = class _InterpolateFrames extends Node {
  /**
   * Input arguments: `frame_uris`, `store` (optional), `output_format` (optional), `fps` (optional), `num_steps` (optional)
   *
   * Output fields: `video_uri` (optional), `frame_uris` (optional)
   *
   * https://www.substrate.run/nodes#InterpolateFrames
   */
  constructor(args, options) {
    super(args, options);
    this.node = "InterpolateFrames";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `video_uri` (optional), `frame_uris` (optional)
   *
   * https://www.substrate.run/nodes#InterpolateFrames
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `video_uri` (optional), `frame_uris` (optional)
   *
   * https://www.substrate.run/nodes#InterpolateFrames
   */
  get future() {
    return new InterpolateFramesOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_InterpolateFrames, "InterpolateFrames");
var InterpolateFrames = _InterpolateFrames;
var _TranscribeSpeech = class _TranscribeSpeech extends Node {
  /**
   * Input arguments: `audio_uri`, `prompt` (optional), `language` (optional), `segment` (optional), `align` (optional), `diarize` (optional), `suggest_chapters` (optional)
   *
   * Output fields: `text`, `segments` (optional), `chapters` (optional)
   *
   * https://www.substrate.run/nodes#TranscribeSpeech
   */
  constructor(args, options) {
    super(args, options);
    this.node = "TranscribeSpeech";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `text`, `segments` (optional), `chapters` (optional)
   *
   * https://www.substrate.run/nodes#TranscribeSpeech
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `text`, `segments` (optional), `chapters` (optional)
   *
   * https://www.substrate.run/nodes#TranscribeSpeech
   */
  get future() {
    return new TranscribeSpeechOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_TranscribeSpeech, "TranscribeSpeech");
var TranscribeSpeech = _TranscribeSpeech;
var _GenerateSpeech = class _GenerateSpeech extends Node {
  /**
   * Input arguments: `text`, `store` (optional)
   *
   * Output fields: `audio_uri`
   *
   * https://www.substrate.run/nodes#GenerateSpeech
   */
  constructor(args, options) {
    super(args, options);
    this.node = "GenerateSpeech";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `audio_uri`
   *
   * https://www.substrate.run/nodes#GenerateSpeech
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `audio_uri`
   *
   * https://www.substrate.run/nodes#GenerateSpeech
   */
  get future() {
    return new GenerateSpeechOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_GenerateSpeech, "GenerateSpeech");
var GenerateSpeech = _GenerateSpeech;
var _RemoveBackground = class _RemoveBackground extends Node {
  /**
   * Input arguments: `image_uri`, `return_mask` (optional), `invert_mask` (optional), `background_color` (optional), `store` (optional)
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#RemoveBackground
   */
  constructor(args, options) {
    super(args, options);
    this.node = "RemoveBackground";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#RemoveBackground
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#RemoveBackground
   */
  get future() {
    return new RemoveBackgroundOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_RemoveBackground, "RemoveBackground");
var RemoveBackground = _RemoveBackground;
var _EraseImage = class _EraseImage extends Node {
  /**
   * Input arguments: `image_uri`, `mask_image_uri`, `store` (optional)
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#EraseImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "EraseImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#EraseImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#EraseImage
   */
  get future() {
    return new EraseImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_EraseImage, "EraseImage");
var EraseImage = _EraseImage;
var _UpscaleImage = class _UpscaleImage extends Node {
  /**
   * Input arguments: `prompt` (optional), `image_uri`, `output_resolution` (optional), `store` (optional)
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#UpscaleImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "UpscaleImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#UpscaleImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `image_uri`
   *
   * https://www.substrate.run/nodes#UpscaleImage
   */
  get future() {
    return new UpscaleImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_UpscaleImage, "UpscaleImage");
var UpscaleImage = _UpscaleImage;
var _SegmentUnderPoint = class _SegmentUnderPoint extends Node {
  /**
   * Input arguments: `image_uri`, `point`, `store` (optional)
   *
   * Output fields: `mask_image_uri`
   *
   * https://www.substrate.run/nodes#SegmentUnderPoint
   */
  constructor(args, options) {
    super(args, options);
    this.node = "SegmentUnderPoint";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `mask_image_uri`
   *
   * https://www.substrate.run/nodes#SegmentUnderPoint
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `mask_image_uri`
   *
   * https://www.substrate.run/nodes#SegmentUnderPoint
   */
  get future() {
    return new SegmentUnderPointOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_SegmentUnderPoint, "SegmentUnderPoint");
var SegmentUnderPoint = _SegmentUnderPoint;
var _SegmentAnything = class _SegmentAnything extends Node {
  /**
   * Input arguments: `image_uri`, `point_prompts` (optional), `box_prompts` (optional), `store` (optional)
   *
   * Output fields: `mask_image_uri`
   *
   * https://www.substrate.run/nodes#SegmentAnything
   */
  constructor(args, options) {
    super(args, options);
    this.node = "SegmentAnything";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `mask_image_uri`
   *
   * https://www.substrate.run/nodes#SegmentAnything
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `mask_image_uri`
   *
   * https://www.substrate.run/nodes#SegmentAnything
   */
  get future() {
    return new SegmentAnythingOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_SegmentAnything, "SegmentAnything");
var SegmentAnything = _SegmentAnything;
var _SplitDocument = class _SplitDocument extends Node {
  /**
   * Input arguments: `uri`, `doc_id` (optional), `metadata` (optional), `chunk_size` (optional), `chunk_overlap` (optional)
   *
   * Output fields: `items`
   *
   * https://www.substrate.run/nodes#SplitDocument
   */
  constructor(args, options) {
    super(args, options);
    this.node = "SplitDocument";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `items`
   *
   * https://www.substrate.run/nodes#SplitDocument
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `items`
   *
   * https://www.substrate.run/nodes#SplitDocument
   */
  get future() {
    return new SplitDocumentOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_SplitDocument, "SplitDocument");
var SplitDocument = _SplitDocument;
var _EmbedText = class _EmbedText extends Node {
  /**
   * Input arguments: `text`, `collection_name` (optional), `metadata` (optional), `embedded_metadata_keys` (optional), `doc_id` (optional), `model` (optional)
   *
   * Output fields: `embedding`
   *
   * https://www.substrate.run/nodes#EmbedText
   */
  constructor(args, options) {
    super(args, options);
    this.node = "EmbedText";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `embedding`
   *
   * https://www.substrate.run/nodes#EmbedText
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `embedding`
   *
   * https://www.substrate.run/nodes#EmbedText
   */
  get future() {
    return new EmbedTextOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_EmbedText, "EmbedText");
var EmbedText = _EmbedText;
var _MultiEmbedText = class _MultiEmbedText extends Node {
  /**
   * Input arguments: `items`, `collection_name` (optional), `embedded_metadata_keys` (optional), `model` (optional)
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#MultiEmbedText
   */
  constructor(args, options) {
    super(args, options);
    this.node = "MultiEmbedText";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#MultiEmbedText
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#MultiEmbedText
   */
  get future() {
    return new MultiEmbedTextOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_MultiEmbedText, "MultiEmbedText");
var MultiEmbedText = _MultiEmbedText;
var _EmbedImage = class _EmbedImage extends Node {
  /**
   * Input arguments: `image_uri`, `collection_name` (optional), `doc_id` (optional), `model` (optional)
   *
   * Output fields: `embedding`
   *
   * https://www.substrate.run/nodes#EmbedImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "EmbedImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `embedding`
   *
   * https://www.substrate.run/nodes#EmbedImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `embedding`
   *
   * https://www.substrate.run/nodes#EmbedImage
   */
  get future() {
    return new EmbedImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_EmbedImage, "EmbedImage");
var EmbedImage = _EmbedImage;
var _MultiEmbedImage = class _MultiEmbedImage extends Node {
  /**
   * Input arguments: `items`, `collection_name` (optional), `model` (optional)
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#MultiEmbedImage
   */
  constructor(args, options) {
    super(args, options);
    this.node = "MultiEmbedImage";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#MultiEmbedImage
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#MultiEmbedImage
   */
  get future() {
    return new MultiEmbedImageOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_MultiEmbedImage, "MultiEmbedImage");
var MultiEmbedImage = _MultiEmbedImage;
var _JinaV2 = class _JinaV2 extends Node {
  /**
   * Input arguments: `items`, `collection_name` (optional), `embedded_metadata_keys` (optional)
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#JinaV2
   */
  constructor(args, options) {
    super(args, options);
    this.node = "JinaV2";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#JinaV2
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#JinaV2
   */
  get future() {
    return new JinaV2Out(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_JinaV2, "JinaV2");
var JinaV2 = _JinaV2;
var _CLIP = class _CLIP extends Node {
  /**
   * Input arguments: `items`, `collection_name` (optional), `embedded_metadata_keys` (optional)
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#CLIP
   */
  constructor(args, options) {
    super(args, options);
    this.node = "CLIP";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#CLIP
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `embeddings`
   *
   * https://www.substrate.run/nodes#CLIP
   */
  get future() {
    return new CLIPOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_CLIP, "CLIP");
var CLIP = _CLIP;
var _FindOrCreateVectorStore = class _FindOrCreateVectorStore extends Node {
  /**
   * Input arguments: `collection_name`, `model`
   *
   * Output fields: `collection_name`, `model`, `num_leaves` (optional)
   *
   * https://www.substrate.run/nodes#FindOrCreateVectorStore
   */
  constructor(args, options) {
    super(args, options);
    this.node = "FindOrCreateVectorStore";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `collection_name`, `model`, `num_leaves` (optional)
   *
   * https://www.substrate.run/nodes#FindOrCreateVectorStore
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `collection_name`, `model`, `num_leaves` (optional)
   *
   * https://www.substrate.run/nodes#FindOrCreateVectorStore
   */
  get future() {
    return new FindOrCreateVectorStoreOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_FindOrCreateVectorStore, "FindOrCreateVectorStore");
var FindOrCreateVectorStore = _FindOrCreateVectorStore;
var _ListVectorStores = class _ListVectorStores extends Node {
  /**
   * Input arguments:
   *
   * Output fields: `items` (optional)
   *
   * https://www.substrate.run/nodes#ListVectorStores
   */
  constructor(args, options) {
    super(args, options);
    this.node = "ListVectorStores";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `items` (optional)
   *
   * https://www.substrate.run/nodes#ListVectorStores
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `items` (optional)
   *
   * https://www.substrate.run/nodes#ListVectorStores
   */
  get future() {
    return new ListVectorStoresOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_ListVectorStores, "ListVectorStores");
var ListVectorStores = _ListVectorStores;
var _DeleteVectorStore = class _DeleteVectorStore extends Node {
  /**
   * Input arguments: `collection_name`, `model`
   *
   * Output fields: `collection_name`, `model`
   *
   * https://www.substrate.run/nodes#DeleteVectorStore
   */
  constructor(args, options) {
    super(args, options);
    this.node = "DeleteVectorStore";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `collection_name`, `model`
   *
   * https://www.substrate.run/nodes#DeleteVectorStore
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `collection_name`, `model`
   *
   * https://www.substrate.run/nodes#DeleteVectorStore
   */
  get future() {
    return new DeleteVectorStoreOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_DeleteVectorStore, "DeleteVectorStore");
var DeleteVectorStore = _DeleteVectorStore;
var _QueryVectorStore = class _QueryVectorStore extends Node {
  /**
   * Input arguments: `collection_name`, `model`, `query_strings` (optional), `query_image_uris` (optional), `query_vectors` (optional), `query_ids` (optional), `top_k` (optional), `ef_search` (optional), `num_leaves_to_search` (optional), `include_values` (optional), `include_metadata` (optional), `filters` (optional)
   *
   * Output fields: `results`, `collection_name` (optional), `model` (optional)
   *
   * https://www.substrate.run/nodes#QueryVectorStore
   */
  constructor(args, options) {
    super(args, options);
    this.node = "QueryVectorStore";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `results`, `collection_name` (optional), `model` (optional)
   *
   * https://www.substrate.run/nodes#QueryVectorStore
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `results`, `collection_name` (optional), `model` (optional)
   *
   * https://www.substrate.run/nodes#QueryVectorStore
   */
  get future() {
    return new QueryVectorStoreOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_QueryVectorStore, "QueryVectorStore");
var QueryVectorStore = _QueryVectorStore;
var _FetchVectors = class _FetchVectors extends Node {
  /**
   * Input arguments: `collection_name`, `model`, `ids`
   *
   * Output fields: `vectors`
   *
   * https://www.substrate.run/nodes#FetchVectors
   */
  constructor(args, options) {
    super(args, options);
    this.node = "FetchVectors";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `vectors`
   *
   * https://www.substrate.run/nodes#FetchVectors
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `vectors`
   *
   * https://www.substrate.run/nodes#FetchVectors
   */
  get future() {
    return new FetchVectorsOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_FetchVectors, "FetchVectors");
var FetchVectors = _FetchVectors;
var _UpdateVectors = class _UpdateVectors extends Node {
  /**
   * Input arguments: `collection_name`, `model`, `vectors`
   *
   * Output fields: `count`
   *
   * https://www.substrate.run/nodes#UpdateVectors
   */
  constructor(args, options) {
    super(args, options);
    this.node = "UpdateVectors";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `count`
   *
   * https://www.substrate.run/nodes#UpdateVectors
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `count`
   *
   * https://www.substrate.run/nodes#UpdateVectors
   */
  get future() {
    return new UpdateVectorsOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_UpdateVectors, "UpdateVectors");
var UpdateVectors = _UpdateVectors;
var _DeleteVectors = class _DeleteVectors extends Node {
  /**
   * Input arguments: `collection_name`, `model`, `ids`
   *
   * Output fields: `count`
   *
   * https://www.substrate.run/nodes#DeleteVectors
   */
  constructor(args, options) {
    super(args, options);
    this.node = "DeleteVectors";
  }
  /**
   * Retrieve this node's output from a response.
   *
   * Output fields: `count`
   *
   * https://www.substrate.run/nodes#DeleteVectors
   */
  async result() {
    return Promise.resolve(
      this._response ? this._response.get(this) : void 0
    );
  }
  /**
   * Future reference to this node's output.
   *
   * Output fields: `count`
   *
   * https://www.substrate.run/nodes#DeleteVectors
   */
  get future() {
    return new DeleteVectorsOut(new Trace([], this));
  }
  output() {
    return super.output();
  }
};
__name(_DeleteVectors, "DeleteVectors");
var DeleteVectors = _DeleteVectors;

// src/EventSource.ts
function createParser() {
  let isFirstChunk;
  let buffer;
  let startingPosition;
  let startingFieldLength;
  let eventId;
  let eventName;
  let data;
  reset();
  return { getMessages, reset };
  function reset() {
    isFirstChunk = true;
    buffer = "";
    startingPosition = 0;
    startingFieldLength = -1;
    eventId = void 0;
    eventName = void 0;
    data = "";
  }
  __name(reset, "reset");
  function* getMessages(chunk) {
    buffer = buffer ? buffer + chunk : chunk;
    if (isFirstChunk && hasBom(buffer)) {
      buffer = buffer.slice(BOM.length);
    }
    isFirstChunk = false;
    const length = buffer.length;
    let position = 0;
    let discardTrailingNewline = false;
    while (position < length) {
      if (discardTrailingNewline) {
        if (buffer[position] === "\n") {
          ++position;
        }
        discardTrailingNewline = false;
      }
      let lineLength = -1;
      let fieldLength = startingFieldLength;
      let character;
      for (let index = startingPosition; lineLength < 0 && index < length; ++index) {
        character = buffer[index];
        if (character === ":" && fieldLength < 0) {
          fieldLength = index - position;
        } else if (character === "\r") {
          discardTrailingNewline = true;
          lineLength = index - position;
        } else if (character === "\n") {
          lineLength = index - position;
        }
      }
      if (lineLength < 0) {
        startingPosition = length - position;
        startingFieldLength = fieldLength;
        break;
      } else {
        startingPosition = 0;
        startingFieldLength = -1;
      }
      for (let event of parseEventStreamLine(
        buffer,
        position,
        fieldLength,
        lineLength
      )) {
        if (event) yield event;
      }
      position += lineLength + 1;
    }
    if (position === length) {
      buffer = "";
    } else if (position > 0) {
      buffer = buffer.slice(position);
    }
  }
  __name(getMessages, "getMessages");
  function* parseEventStreamLine(lineBuffer, index, fieldLength, lineLength) {
    if (lineLength === 0) {
      if (data.length > 0) {
        yield {
          type: "event",
          id: eventId,
          event: eventName || void 0,
          data: data.slice(0, -1)
          // remove trailing newline
        };
        data = "";
        eventId = void 0;
      }
      eventName = void 0;
      yield null;
    }
    const noValue = fieldLength < 0;
    const field = lineBuffer.slice(
      index,
      index + (noValue ? lineLength : fieldLength)
    );
    let step = 0;
    if (noValue) {
      step = lineLength;
    } else if (lineBuffer[index + fieldLength + 1] === " ") {
      step = fieldLength + 2;
    } else {
      step = fieldLength + 1;
    }
    const position = index + step;
    const valueLength = lineLength - step;
    const value = lineBuffer.slice(position, position + valueLength).toString();
    if (field === "data") {
      data += value ? `${value}
` : "\n";
    } else if (field === "event") {
      eventName = value;
    } else if (field === "id" && !value.includes("\0")) {
      eventId = value;
    } else if (field === "retry") {
      const retry = parseInt(value, 10);
      if (!Number.isNaN(retry)) {
        yield { type: "reconnect-interval", value: retry };
      }
    }
  }
  __name(parseEventStreamLine, "parseEventStreamLine");
}
__name(createParser, "createParser");
var BOM = [239, 187, 191];
function hasBom(buffer) {
  return BOM.every(
    (charCode, index) => buffer.charCodeAt(index) === charCode
  );
}
__name(hasBom, "hasBom");

// src/SubstrateStreamingResponse.ts
var _StreamingResponse = class _StreamingResponse {
  constructor(response, iterator) {
    this.apiResponse = response;
    this.iterator = iterator;
  }
  [Symbol.asyncIterator]() {
    return this.iterator;
  }
  tee(n = 2) {
    return tee(n, this.iterator).map(
      (iterator) => new _StreamingResponse(this.apiResponse, iterator)
    );
  }
  static async fromReponse(response) {
    if (!response.body) {
      throw new SubstrateError("Response body must be present");
    }
    const decoder = new TextDecoder("utf-8");
    const parser = createParser();
    async function* iterator() {
      for await (const chunk of readableStreamAsyncIterable(response.body)) {
        for (const message of parser.getMessages(
          decoder.decode(chunk)
        )) {
          if (message.data) {
            try {
              const sseMessage = JSON.parse(message.data);
              yield sseMessage;
            } catch (_err) {
              throw new SubstrateError(
                `Bad Server-Sent Event message: ${message}`
              );
            }
          }
        }
      }
    }
    __name(iterator, "iterator");
    return new _StreamingResponse(response, iterator());
  }
};
__name(_StreamingResponse, "StreamingResponse");
var StreamingResponse = _StreamingResponse;
var _SubstrateStreamingResponse = class _SubstrateStreamingResponse extends StreamingResponse {
  constructor(request, response, iterator) {
    super(response, iterator);
    this.apiRequest = request;
  }
  async *get(node) {
    for await (let message of this) {
      if (_optionalChain([message, 'optionalAccess', _14 => _14.node_id]) === node.id) {
        yield message;
      }
    }
  }
  tee(n = 2) {
    return tee(n, this.iterator).map(
      (iterator) => new _SubstrateStreamingResponse(
        this.apiRequest,
        this.apiResponse,
        iterator
      )
    );
  }
  static async fromRequestReponse(request, response) {
    const streamingResponse = await StreamingResponse.fromReponse(response);
    return new _SubstrateStreamingResponse(
      request,
      response,
      streamingResponse.iterator
    );
  }
};
__name(_SubstrateStreamingResponse, "SubstrateStreamingResponse");
var SubstrateStreamingResponse = _SubstrateStreamingResponse;
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator]) return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (_optionalChain([result, 'optionalAccess', _15 => _15.done])) reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
__name(readableStreamAsyncIterable, "readableStreamAsyncIterable");
function tee(n = 2, iterator) {
  const queues = [];
  for (let i = 0; i < n; i++) {
    queues.push([]);
  }
  const teeIterator = /* @__PURE__ */ __name((queue) => {
    return {
      next: /* @__PURE__ */ __name(() => {
        if (queue.length === 0) {
          const result = iterator.next();
          for (let q of queues) q.push(result);
        }
        return queue.shift();
      }, "next")
    };
  }, "teeIterator");
  return queues.map((q) => teeIterator(q));
}
__name(tee, "tee");

// src/sb.ts
var sb = {
  concat: FutureString.concat,
  jq: FutureAnyObject.jq,
  interpolate: FutureString.interpolate,
  streaming: {
    fromSSEResponse: StreamingResponse.fromReponse
  }
};

// src/version.ts
var VERSION = "120240617.1.9";

// src/openapi.json
var openapi_default = {
  openapi: "3.1.0",
  info: {
    title: "Substrate API",
    version: "2024-06-17",
    contact: {
      email: "support@substrate.run"
    },
    description: "Substrate API"
  },
  servers: [
    {
      url: "https://api.substrate.run",
      description: "Substrate API"
    }
  ],
  components: {
    schemas: {
      ErrorOut: {
        title: "ErrorOut",
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["api_error", "invalid_request_error", "dependency_error"],
            description: "The type of error returned."
          },
          message: {
            type: "string",
            description: "A message providing more details about the error."
          },
          status_code: {
            type: "integer",
            default: 500,
            description: "The HTTP status code for the error."
          }
        },
        required: ["type", "message"]
      },
      ExperimentalIn: {
        title: "ExperimentalIn",
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Identifier.",
            "x-loggable": true
          },
          args: {
            type: "object",
            description: "Arguments.",
            additionalProperties: true,
            "x-loggable": true
          },
          timeout: {
            type: "integer",
            description: "Timeout in seconds.",
            default: 60,
            "x-loggable": true
          }
        },
        required: ["name", "args"]
      },
      ExperimentalOut: {
        title: "ExperimentalOut",
        type: "object",
        properties: {
          output: {
            type: "object",
            description: "Response.",
            additionalProperties: true
          }
        },
        required: ["output"]
      },
      BoxIn: {
        title: "BoxIn",
        type: "object",
        properties: {
          value: {
            description: "Values to box.",
            "x-loggable": false
          }
        },
        required: ["value"]
      },
      BoxOut: {
        title: "BoxOut",
        type: "object",
        properties: {
          value: {
            description: "The evaluated result.",
            "x-loggable": false
          }
        },
        required: ["value"]
      },
      IfIn: {
        title: "IfIn",
        type: "object",
        properties: {
          condition: {
            type: "boolean",
            description: "Condition.",
            "x-loggable": false
          },
          value_if_true: {
            description: "Result when condition is true.",
            "x-loggable": false
          },
          value_if_false: {
            description: "Result when condition is false.",
            "x-loggable": false
          }
        },
        required: ["condition", "value_if_true"]
      },
      IfOut: {
        title: "IfOut",
        type: "object",
        properties: {
          result: {
            description: "Result. Null if `value_if_false` is not provided and `condition` is false."
          }
        },
        required: ["result"]
      },
      RunPythonIn: {
        title: "RunPythonIn",
        type: "object",
        properties: {
          pkl_function: {
            type: "string",
            description: "Pickled function.",
            "x-loggable": true
          },
          kwargs: {
            type: "object",
            description: "Keyword arguments to your function.",
            additionalProperties: true,
            "x-loggable": true
          },
          python_version: {
            type: "string",
            description: "Python version.",
            "x-loggable": true
          },
          pip_install: {
            description: "Python packages to install. You must import them in your code.",
            type: "array",
            items: {
              type: "string"
            },
            "x-loggable": true
          }
        },
        required: ["kwargs"]
      },
      RunPythonOut: {
        title: "RunPythonOut",
        type: "object",
        properties: {
          output: {
            description: "Return value of your function."
          },
          pkl_output: {
            type: "string",
            description: "Pickled return value."
          },
          stdout: {
            type: "string",
            description: "Everything printed to stdout while running your code."
          },
          stderr: {
            type: "string",
            description: "Contents of stderr if your code did not run successfully."
          }
        },
        required: ["stdout", "stderr"]
      },
      ComputeTextIn: {
        title: "ComputeTextIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          image_uris: {
            description: "Image prompts.",
            type: "array",
            items: {
              type: "string"
            }
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.4,
            description: "Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: [
              "Mistral7BInstruct",
              "Mixtral8x7BInstruct",
              "Llama3Instruct8B",
              "Llama3Instruct70B",
              "Llama3Instruct405B",
              "Firellava13B",
              "gpt-4o",
              "gpt-4o-mini",
              "claude-3-5-sonnet-20240620"
            ],
            description: "Selected model. `Firellava13B` is automatically selected when `image_uris` is provided.",
            default: "Llama3Instruct8B",
            "x-loggable": true
          }
        },
        required: ["prompt"]
      },
      ComputeTextOut: {
        title: "ComputeTextOut",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text response."
          }
        },
        required: ["text"]
      },
      ComputeJSONIn: {
        title: "ComputeJSONIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          json_schema: {
            type: "object",
            description: "JSON schema to guide `json_object` response.",
            additionalProperties: true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.4,
            description: "Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: [
              "Mistral7BInstruct",
              "Mixtral8x7BInstruct",
              "Llama3Instruct8B"
            ],
            description: "Selected model.",
            default: "Llama3Instruct8B",
            "x-loggable": true
          }
        },
        required: ["prompt", "json_schema"]
      },
      ComputeJSONOut: {
        title: "ComputeJSONOut",
        type: "object",
        properties: {
          json_object: {
            type: "object",
            description: "JSON response.",
            additionalProperties: true
          },
          text: {
            type: "string",
            description: "If the model output could not be parsed to JSON, this is the raw text output."
          }
        },
        required: []
      },
      MultiComputeTextIn: {
        title: "MultiComputeTextIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          num_choices: {
            type: "integer",
            description: "Number of choices to generate.",
            minimum: 1,
            maximum: 8,
            default: 1,
            "x-loggable": true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.4,
            description: "Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: [
              "Mistral7BInstruct",
              "Mixtral8x7BInstruct",
              "Llama3Instruct8B",
              "Llama3Instruct70B"
            ],
            description: "Selected model.",
            default: "Llama3Instruct8B"
          }
        },
        required: ["prompt", "num_choices"]
      },
      MultiComputeTextOut: {
        title: "MultiComputeTextOut",
        type: "object",
        properties: {
          choices: {
            type: "array",
            description: "Response choices.",
            items: {
              $ref: "#/components/schemas/ComputeTextOut"
            }
          }
        },
        required: ["choices"]
      },
      BatchComputeTextIn: {
        title: "BatchComputeTextIn",
        type: "object",
        properties: {
          prompts: {
            description: "Batch input prompts.",
            type: "array",
            items: {
              type: "string"
            }
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.4,
            description: "Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: ["Mistral7BInstruct", "Llama3Instruct8B"],
            description: "Selected model.",
            default: "Llama3Instruct8B",
            "x-loggable": true
          }
        },
        required: ["prompts"]
      },
      BatchComputeTextOut: {
        title: "BatchComputeTextOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Batch outputs.",
            items: {
              $ref: "#/components/schemas/ComputeTextOut"
            }
          }
        },
        required: ["outputs"]
      },
      MultiComputeJSONIn: {
        title: "MultiComputeJSONIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          json_schema: {
            type: "object",
            description: "JSON schema to guide `json_object` response.",
            additionalProperties: true
          },
          num_choices: {
            type: "integer",
            description: "Number of choices to generate.",
            minimum: 1,
            maximum: 8,
            default: 2,
            "x-loggable": true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.4,
            description: "Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: [
              "Mistral7BInstruct",
              "Mixtral8x7BInstruct",
              "Llama3Instruct8B"
            ],
            description: "Selected model.",
            default: "Llama3Instruct8B",
            "x-loggable": true
          }
        },
        required: ["prompt", "num_choices", "json_schema"]
      },
      MultiComputeJSONOut: {
        title: "MultiComputeJSONOut",
        type: "object",
        properties: {
          choices: {
            type: "array",
            description: "Response choices.",
            items: {
              $ref: "#/components/schemas/ComputeJSONOut"
            }
          }
        },
        required: ["choices"]
      },
      BatchComputeJSONIn: {
        title: "BatchComputeJSONIn",
        type: "object",
        properties: {
          prompts: {
            description: "Batch input prompts.",
            type: "array",
            items: {
              type: "string"
            }
          },
          json_schema: {
            type: "object",
            description: "JSON schema to guide `json_object` response.",
            additionalProperties: true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.4,
            description: "Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: ["Mistral7BInstruct", "Llama3Instruct8B"],
            description: "Selected model.",
            default: "Llama3Instruct8B",
            "x-loggable": true
          }
        },
        required: ["prompts", "json_schema"]
      },
      BatchComputeJSONOut: {
        title: "BatchComputeJSONOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Batch outputs.",
            items: {
              $ref: "#/components/schemas/ComputeJSONOut"
            }
          }
        },
        required: ["outputs"]
      },
      Mistral7BInstructIn: {
        title: "Mistral7BInstructIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          system_prompt: {
            type: "string",
            description: "System prompt."
          },
          num_choices: {
            type: "integer",
            description: "Number of choices to generate.",
            minimum: 1,
            maximum: 8,
            default: 1,
            "x-loggable": true
          },
          json_schema: {
            type: "object",
            description: "JSON schema to guide response.",
            additionalProperties: true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            description: "Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          frequency_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 0,
            description: "Higher values decrease the likelihood of repeating previous tokens.",
            "x-loggable": true
          },
          repetition_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1,
            description: "Higher values decrease the likelihood of repeated sequences.",
            "x-loggable": true
          },
          presence_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1.1,
            description: "Higher values increase the likelihood of new topics appearing.",
            "x-loggable": true
          },
          top_p: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.95,
            description: "Probability below which less likely tokens are filtered out.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          }
        },
        required: ["prompt"]
      },
      Mistral7BInstructChoice: {
        title: "Mistral7BInstructChoice",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text response, if `json_schema` was not provided."
          },
          json_object: {
            type: "object",
            description: "JSON response, if `json_schema` was provided.",
            additionalProperties: true
          }
        }
      },
      Mistral7BInstructOut: {
        title: "Mistral7BInstructOut",
        type: "object",
        properties: {
          choices: {
            type: "array",
            description: "Response choices.",
            items: {
              $ref: "#/components/schemas/Mistral7BInstructChoice"
            }
          }
        },
        required: ["choices"]
      },
      Mixtral8x7BInstructIn: {
        title: "Mixtral8x7BInstructIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          system_prompt: {
            type: "string",
            description: "System prompt."
          },
          num_choices: {
            type: "integer",
            description: "Number of choices to generate.",
            minimum: 1,
            maximum: 8,
            default: 1,
            "x-loggable": true
          },
          json_schema: {
            type: "object",
            description: "JSON schema to guide response.",
            additionalProperties: true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            description: "Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          frequency_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 0,
            description: "Higher values decrease the likelihood of repeating previous tokens.",
            "x-loggable": true
          },
          repetition_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1,
            description: "Higher values decrease the likelihood of repeated sequences.",
            "x-loggable": true
          },
          presence_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1.1,
            description: "Higher values increase the likelihood of new topics appearing.",
            "x-loggable": true
          },
          top_p: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.95,
            description: "Probability below which less likely tokens are filtered out.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          }
        },
        required: ["prompt"]
      },
      Mixtral8x7BChoice: {
        title: "Mixtral8x7BChoice",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text response, if `json_schema` was not provided."
          },
          json_object: {
            type: "object",
            description: "JSON response, if `json_schema` was provided.",
            additionalProperties: true
          }
        }
      },
      Mixtral8x7BInstructOut: {
        title: "Mixtral8x7BInstructOut",
        type: "object",
        properties: {
          choices: {
            type: "array",
            description: "Response choices.",
            items: {
              $ref: "#/components/schemas/Mixtral8x7BChoice"
            }
          }
        },
        required: ["choices"]
      },
      Llama3Instruct8BIn: {
        title: "Llama3Instruct8BIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          system_prompt: {
            type: "string",
            description: "System prompt."
          },
          num_choices: {
            type: "integer",
            description: "Number of choices to generate.",
            minimum: 1,
            maximum: 8,
            default: 1,
            "x-loggable": true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            description: "Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          frequency_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 0,
            description: "Higher values decrease the likelihood of repeating previous tokens.",
            "x-loggable": true
          },
          repetition_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1,
            description: "Higher values decrease the likelihood of repeated sequences.",
            "x-loggable": true
          },
          presence_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1.1,
            description: "Higher values increase the likelihood of new topics appearing.",
            "x-loggable": true
          },
          top_p: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.95,
            description: "Probability below which less likely tokens are filtered out.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          },
          json_schema: {
            type: "object",
            description: "JSON schema to guide response.",
            additionalProperties: true
          }
        },
        required: ["prompt"]
      },
      Llama3Instruct8BChoice: {
        title: "Llama3Instruct8BChoice",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text response."
          },
          json_object: {
            type: "object",
            description: "JSON response, if `json_schema` was provided.",
            additionalProperties: true
          }
        }
      },
      Llama3Instruct8BOut: {
        title: "Llama3Instruct8BOut",
        type: "object",
        properties: {
          choices: {
            type: "array",
            description: "Response choices.",
            items: {
              $ref: "#/components/schemas/Llama3Instruct8BChoice"
            }
          }
        },
        required: ["choices"]
      },
      Llama3Instruct70BIn: {
        title: "Llama3Instruct70BIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Input prompt."
          },
          system_prompt: {
            type: "string",
            description: "System prompt."
          },
          num_choices: {
            type: "integer",
            description: "Number of choices to generate.",
            minimum: 1,
            maximum: 8,
            default: 1,
            "x-loggable": true
          },
          temperature: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            description: "Higher values make the output more random, lower values make the output more deterministic.",
            "x-loggable": true
          },
          frequency_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 0,
            description: "Higher values decrease the likelihood of repeating previous tokens.",
            "x-loggable": true
          },
          repetition_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1,
            description: "Higher values decrease the likelihood of repeated sequences.",
            "x-loggable": true
          },
          presence_penalty: {
            type: "number",
            format: "float",
            minimum: -2,
            maximum: 2,
            default: 1.1,
            description: "Higher values increase the likelihood of new topics appearing.",
            "x-loggable": true
          },
          top_p: {
            type: "number",
            format: "float",
            minimum: 0,
            maximum: 1,
            default: 0.95,
            description: "Probability below which less likely tokens are filtered out.",
            "x-loggable": true
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          }
        },
        required: ["prompt"]
      },
      Llama3Instruct70BChoice: {
        title: "Llama3Instruct70BChoice",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text response."
          }
        }
      },
      Llama3Instruct70BOut: {
        title: "Llama3Instruct70BOut",
        type: "object",
        properties: {
          choices: {
            type: "array",
            description: "Response choices.",
            items: {
              $ref: "#/components/schemas/Llama3Instruct70BChoice"
            }
          }
        },
        required: ["choices"]
      },
      Firellava13BIn: {
        title: "Firellava13BIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          image_uris: {
            description: "Image prompts.",
            type: "array",
            items: {
              type: "string"
            }
          },
          max_tokens: {
            type: "integer",
            description: "Maximum number of tokens to generate.",
            "x-loggable": true
          }
        },
        required: ["prompt", "image_uris"]
      },
      Firellava13BOut: {
        title: "Firellava13BOut",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text response."
          }
        },
        required: ["text"]
      },
      GenerateImageIn: {
        title: "GenerateImageIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["prompt"]
      },
      GenerateImageOut: {
        title: "GenerateImageOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      MultiGenerateImageIn: {
        title: "MultiGenerateImageIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            minimum: 1,
            default: 2,
            maximum: 8,
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["prompt", "num_images"]
      },
      MultiGenerateImageOut: {
        title: "MultiGenerateImageOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/GenerateImageOut"
            }
          }
        },
        required: ["outputs"]
      },
      StableDiffusionXLIn: {
        title: "StableDiffusionXLIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          negative_prompt: {
            type: "string",
            description: "Negative input prompt."
          },
          steps: {
            type: "integer",
            description: "Number of diffusion steps.",
            default: 30,
            minimum: 0,
            maximum: 150,
            "x-loggable": true
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            minimum: 1,
            default: 1,
            maximum: 8,
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          },
          height: {
            type: "integer",
            description: "Height of output image, in pixels.",
            minimum: 256,
            maximum: 1536,
            default: 1024,
            "x-loggable": true
          },
          width: {
            type: "integer",
            description: "Width of output image, in pixels.",
            minimum: 256,
            maximum: 1536,
            default: 1024,
            "x-loggable": true
          },
          seeds: {
            type: "array",
            items: {
              type: "integer"
            },
            description: "Seeds for deterministic generation. Default is a random seed.",
            "x-loggable": true
          },
          guidance_scale: {
            type: "number",
            format: "float",
            description: "Higher values adhere to the text prompt more strongly, typically at the expense of image quality.",
            minimum: 0,
            default: 7,
            maximum: 30,
            "x-loggable": true
          }
        },
        required: ["prompt", "num_images"]
      },
      StableDiffusionImage: {
        title: "StableDiffusionImage",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          },
          seed: {
            type: "integer",
            description: "The random noise seed used for generation."
          }
        },
        required: ["image_uri", "seed"]
      },
      StableDiffusionXLOut: {
        title: "StableDiffusionXLOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/StableDiffusionImage"
            }
          }
        },
        required: ["outputs"]
      },
      StableDiffusionXLLightningIn: {
        title: "StableDiffusionXLLightningIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          negative_prompt: {
            type: "string",
            description: "Negative input prompt."
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            default: 1,
            minimum: 1,
            maximum: 8,
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          },
          height: {
            type: "integer",
            description: "Height of output image, in pixels.",
            minimum: 256,
            maximum: 1536,
            default: 1024,
            "x-loggable": true
          },
          width: {
            type: "integer",
            description: "Width of output image, in pixels.",
            minimum: 256,
            maximum: 1536,
            default: 1024,
            "x-loggable": true
          },
          seeds: {
            type: "array",
            items: {
              type: "integer"
            },
            description: "Seeds for deterministic generation. Default is a random seed.",
            "x-loggable": true
          }
        },
        required: ["prompt"]
      },
      StableDiffusionXLLightningOut: {
        title: "StableDiffusionXLLightningOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/StableDiffusionImage"
            }
          }
        },
        required: ["outputs"]
      },
      StableDiffusionXLIPAdapterIn: {
        title: "StableDiffusionXLIPAdapterIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          image_prompt_uri: {
            type: "string",
            description: "Image prompt."
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            default: 1,
            minimum: 1,
            maximum: 8,
            "x-loggable": true
          },
          ip_adapter_scale: {
            type: "number",
            format: "float",
            description: "Controls the influence of the image prompt on the generated output.",
            minimum: 0,
            maximum: 1,
            default: 0.5,
            "x-loggable": true
          },
          negative_prompt: {
            type: "string",
            description: "Negative input prompt."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          },
          width: {
            type: "integer",
            description: "Width of output image, in pixels.",
            minimum: 640,
            maximum: 1536,
            default: 1024,
            "x-loggable": true
          },
          height: {
            type: "integer",
            description: "Height of output image, in pixels.",
            minimum: 640,
            maximum: 1536,
            default: 1024,
            "x-loggable": true
          },
          seeds: {
            description: "Random noise seeds. Default is random seeds for each generation.",
            type: "array",
            items: {
              type: "integer"
            },
            "x-loggable": true
          }
        },
        required: ["prompt", "image_prompt_uri", "num_images"]
      },
      StableDiffusionXLIPAdapterOut: {
        title: "StableDiffusionXLIPAdapterOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/StableDiffusionImage"
            }
          }
        },
        required: ["outputs"]
      },
      StableDiffusionXLControlNetIn: {
        title: "StableDiffusionXLControlNetIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          control_method: {
            type: "string",
            enum: ["edge", "depth", "illusion", "tile"],
            description: "Strategy to control generation using the input image.",
            "x-loggable": true
          },
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            default: 1,
            minimum: 1,
            maximum: 8,
            "x-loggable": true
          },
          output_resolution: {
            type: "integer",
            description: "Resolution of the output image, in pixels.",
            default: 1024,
            minimum: 512,
            maximum: 2048,
            "x-loggable": true
          },
          negative_prompt: {
            type: "string",
            description: "Negative input prompt."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          },
          conditioning_scale: {
            type: "number",
            format: "float",
            description: "Controls the influence of the input image on the generated output.",
            minimum: 0,
            maximum: 1,
            default: 0.5,
            "x-loggable": true
          },
          strength: {
            type: "number",
            format: "float",
            description: "Controls how much to transform the input image.",
            minimum: 0,
            maximum: 1,
            default: 0.5,
            "x-loggable": true
          },
          seeds: {
            description: "Random noise seeds. Default is random seeds for each generation.",
            type: "array",
            items: {
              type: "integer"
            },
            "x-loggable": true
          }
        },
        required: ["image_uri", "control_method", "prompt", "num_images"]
      },
      StableDiffusionXLControlNetOut: {
        title: "StableDiffusionXLControlNetOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/StableDiffusionImage"
            }
          }
        },
        required: ["outputs"]
      },
      StableVideoDiffusionIn: {
        title: "StableVideoDiffusionIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Original image."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return a video URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the video data will be returned as a base64-encoded string.',
            "x-loggable": true
          },
          output_format: {
            type: "string",
            enum: ["gif", "webp", "mp4", "frames"],
            description: "Output video format.",
            default: "gif",
            "x-loggable": true
          },
          seed: {
            type: "integer",
            description: "Seed for deterministic generation. Default is a random seed.",
            "x-loggable": true
          },
          fps: {
            type: "integer",
            description: "Frames per second of the generated video. Ignored if output format is `frames`.",
            default: 7,
            "x-loggable": true,
            minimum: 1
          },
          motion_bucket_id: {
            type: "integer",
            description: "The motion bucket id to use for the generated video. This can be used to control the motion of the generated video. Increasing the motion bucket id increases the motion of the generated video.",
            default: 180,
            "x-loggable": true
          },
          noise: {
            type: "number",
            format: "float",
            description: "The amount of noise added to the conditioning image. The higher the values the less the video resembles the conditioning image. Increasing this value also increases the motion of the generated video.",
            default: 0.1,
            "x-loggable": true
          }
        },
        required: ["image_uri"]
      },
      StableVideoDiffusionOut: {
        title: "StableVideoDiffusionOut",
        type: "object",
        properties: {
          video_uri: {
            type: "string",
            description: "Generated video."
          },
          frame_uris: {
            type: "array",
            description: "Generated frames.",
            items: {
              type: "string"
            }
          }
        },
        required: []
      },
      InterpolateFramesIn: {
        title: "InterpolateFramesIn",
        type: "object",
        properties: {
          frame_uris: {
            type: "array",
            description: "Frames.",
            items: {
              type: "string"
            },
            minItems: 2
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return a video URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the video data will be returned as a base64-encoded string.',
            "x-loggable": true
          },
          output_format: {
            type: "string",
            enum: ["gif", "webp", "mp4", "frames"],
            description: "Output video format.",
            default: "gif",
            "x-loggable": true
          },
          fps: {
            type: "integer",
            description: "Frames per second of the generated video. Ignored if output format is `frames`.",
            default: 7,
            minimum: 1,
            "x-loggable": true
          },
          num_steps: {
            type: "integer",
            description: "Number of interpolation steps. Each step adds an interpolated frame between adjacent frames. For example, 2 steps over 2 frames produces 5 frames.",
            default: 2,
            minimum: 1,
            "x-loggable": true
          }
        },
        required: ["frame_uris"]
      },
      InterpolateFramesOut: {
        title: "InterpolateFramesOut",
        type: "object",
        properties: {
          video_uri: {
            type: "string",
            description: "Generated video."
          },
          frame_uris: {
            type: "array",
            description: "Output frames.",
            items: {
              type: "string"
            }
          }
        },
        required: []
      },
      InpaintImageIn: {
        title: "InpaintImageIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Original image."
          },
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          mask_image_uri: {
            type: "string",
            description: "Mask image that controls which pixels are inpainted. If unset, the entire image is edited (image-to-image)."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri", "prompt"]
      },
      InpaintImageOut: {
        title: "InpaintImageOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      MultiInpaintImageIn: {
        title: "MultiInpaintImageIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Original image."
          },
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          mask_image_uri: {
            type: "string",
            description: "Mask image that controls which pixels are edited (inpainting). If unset, the entire image is edited (image-to-image)."
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            minimum: 1,
            default: 2,
            maximum: 8,
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri", "prompt", "num_images"]
      },
      MultiInpaintImageOut: {
        title: "MultiInpaintImageOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/InpaintImageOut"
            }
          }
        },
        required: ["outputs"]
      },
      StableDiffusionXLInpaintIn: {
        title: "StableDiffusionXLInpaintIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Original image."
          },
          prompt: {
            type: "string",
            description: "Text prompt."
          },
          mask_image_uri: {
            type: "string",
            description: "Mask image that controls which pixels are edited (inpainting). If unset, the entire image is edited (image-to-image)."
          },
          num_images: {
            type: "integer",
            description: "Number of images to generate.",
            default: 1,
            minimum: 1,
            maximum: 8,
            "x-loggable": true
          },
          output_resolution: {
            type: "integer",
            description: "Resolution of the output image, in pixels.",
            default: 1024,
            minimum: 512,
            maximum: 2048,
            "x-loggable": true
          },
          negative_prompt: {
            type: "string",
            description: "Negative input prompt."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          },
          strength: {
            type: "number",
            format: "float",
            description: "Controls the strength of the generation process.",
            minimum: 0,
            maximum: 1,
            default: 0.8,
            "x-loggable": true
          },
          seeds: {
            description: "Random noise seeds. Default is random seeds for each generation.",
            type: "array",
            items: {
              type: "integer"
            },
            "x-loggable": true
          }
        },
        required: ["image_uri", "prompt", "num_images"]
      },
      StableDiffusionXLInpaintOut: {
        title: "StableDiffusionXLInpaintOut",
        type: "object",
        properties: {
          outputs: {
            type: "array",
            description: "Generated images.",
            items: {
              $ref: "#/components/schemas/StableDiffusionImage"
            }
          }
        },
        required: ["outputs"]
      },
      BoundingBox: {
        title: "BoundingBox",
        type: "object",
        properties: {
          x1: {
            type: "number",
            format: "float",
            description: "Top left corner x."
          },
          y1: {
            type: "number",
            format: "float",
            description: "Top left corner y."
          },
          x2: {
            type: "number",
            format: "float",
            description: "Bottom right corner x."
          },
          y2: {
            type: "number",
            format: "float",
            description: "Bottom right corner y."
          }
        },
        required: ["x1", "y1", "x2", "y2"]
      },
      Point: {
        title: "Point",
        type: "object",
        properties: {
          x: {
            type: "integer",
            description: "X position."
          },
          y: {
            type: "integer",
            description: "Y position."
          }
        },
        required: ["x", "y"]
      },
      EraseImageIn: {
        title: "EraseImageIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          mask_image_uri: {
            type: "string",
            description: "Mask image that controls which pixels are inpainted."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri", "mask_image_uri"]
      },
      EraseImageOut: {
        title: "EraseImageOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      BigLaMaIn: {
        title: "BigLaMaIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          mask_image_uri: {
            type: "string",
            description: "Mask image that controls which pixels are inpainted."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri", "mask_image_uri"]
      },
      BigLaMaOut: {
        title: "BigLaMaOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      RemoveBackgroundIn: {
        title: "RemoveBackgroundIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          return_mask: {
            type: "boolean",
            description: "Return a mask image instead of the original content.",
            default: false
          },
          invert_mask: {
            type: "boolean",
            description: "Invert the mask image. Only takes effect if `return_mask` is true.",
            default: false
          },
          background_color: {
            type: "string",
            description: "Hex value background color. Transparent if unset.",
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri"]
      },
      RemoveBackgroundOut: {
        title: "RemoveBackgroundOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      DISISNetIn: {
        title: "DISISNetIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri"]
      },
      DISISNetOut: {
        title: "DISISNetOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      UpscaleImageIn: {
        title: "UpscaleImageIn",
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Prompt to guide model on the content of image to upscale."
          },
          image_uri: {
            type: "string",
            description: "Input image."
          },
          output_resolution: {
            type: "integer",
            description: "Resolution of the output image, in pixels.",
            default: 1024,
            minimum: 512,
            maximum: 2048,
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri"]
      },
      UpscaleImageOut: {
        title: "UpscaleImageOut",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["image_uri"]
      },
      SegmentUnderPointIn: {
        title: "SegmentUnderPointIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          point: {
            description: "Point prompt.",
            type: "object",
            $ref: "#/components/schemas/Point",
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri", "point"]
      },
      SegmentUnderPointOut: {
        title: "SegmentUnderPointOut",
        type: "object",
        properties: {
          mask_image_uri: {
            type: "string",
            description: "Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["mask_image_uri"]
      },
      SegmentAnythingIn: {
        title: "SegmentAnythingIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Input image."
          },
          point_prompts: {
            description: "Point prompts, to detect a segment under the point. One of `point_prompts` or `box_prompts` must be set.",
            type: "array",
            items: {
              $ref: "#/components/schemas/Point"
            },
            "x-loggable": true
          },
          box_prompts: {
            description: "Box prompts, to detect a segment within the bounding box. One of `point_prompts` or `box_prompts` must be set.",
            type: "array",
            items: {
              $ref: "#/components/schemas/BoundingBox"
            },
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string.'
          }
        },
        required: ["image_uri"]
      },
      SegmentAnythingOut: {
        title: "SegmentAnythingOut",
        type: "object",
        properties: {
          mask_image_uri: {
            type: "string",
            description: "Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided."
          }
        },
        required: ["mask_image_uri"]
      },
      TranscribeSpeechIn: {
        title: "TranscribeSpeechIn",
        type: "object",
        properties: {
          audio_uri: {
            type: "string",
            description: "Input audio."
          },
          prompt: {
            type: "string",
            description: "Prompt to guide model on the content and context of input audio."
          },
          language: {
            type: "string",
            default: "en",
            description: "Language of input audio in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) format.",
            "x-loggable": true
          },
          segment: {
            type: "boolean",
            default: false,
            description: "Segment the text into sentences with approximate timestamps.",
            "x-loggable": true
          },
          align: {
            type: "boolean",
            default: false,
            description: "Align transcription to produce more accurate sentence-level timestamps and word-level timestamps. An array of word segments will be included in each sentence segment.",
            "x-loggable": true
          },
          diarize: {
            type: "boolean",
            default: false,
            description: "Identify speakers for each segment. Speaker IDs will be included in each segment.",
            "x-loggable": true
          },
          suggest_chapters: {
            type: "boolean",
            default: false,
            description: "Suggest automatic chapter markers.",
            "x-loggable": true
          }
        },
        required: ["audio_uri"]
      },
      TranscribedWord: {
        title: "TranscribedWord",
        type: "object",
        properties: {
          word: {
            type: "string",
            description: "Text of word."
          },
          start: {
            type: "number",
            format: "float",
            description: "Start time of word, in seconds."
          },
          end: {
            type: "number",
            format: "float",
            description: "End time of word, in seconds."
          },
          speaker: {
            type: "string",
            description: "ID of speaker, if `diarize` is enabled."
          }
        },
        required: ["word"]
      },
      TranscribedSegment: {
        title: "TranscribedSegment",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text of segment."
          },
          start: {
            type: "number",
            format: "float",
            description: "Start time of segment, in seconds."
          },
          end: {
            type: "number",
            format: "float",
            description: "End time of segment, in seconds."
          },
          speaker: {
            type: "string",
            description: "ID of speaker, if `diarize` is enabled."
          },
          words: {
            type: "array",
            description: "Aligned words, if `align` is enabled.",
            items: {
              $ref: "#/components/schemas/TranscribedWord"
            }
          }
        },
        required: ["text", "start", "end"]
      },
      ChapterMarker: {
        title: "ChapterMarker",
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Chapter title."
          },
          start: {
            type: "number",
            format: "float",
            description: "Start time of chapter, in seconds."
          }
        },
        required: ["title", "start"]
      },
      TranscribeSpeechOut: {
        title: "TranscribeSpeechOut",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Transcribed text."
          },
          segments: {
            type: "array",
            description: "Transcribed segments, if `segment` is enabled.",
            items: {
              $ref: "#/components/schemas/TranscribedSegment"
            }
          },
          chapters: {
            type: "array",
            description: "Chapter markers, if `suggest_chapters` is enabled.",
            items: {
              $ref: "#/components/schemas/ChapterMarker"
            }
          }
        },
        required: ["text"]
      },
      GenerateSpeechIn: {
        title: "GenerateSpeechIn",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Input text."
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an audio URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the audio data will be returned as a base64-encoded string.'
          }
        },
        required: ["text"]
      },
      GenerateSpeechOut: {
        title: "GenerateSpeechOut",
        type: "object",
        properties: {
          audio_uri: {
            type: "string",
            description: "Base 64-encoded WAV audio bytes, or a hosted audio url if `store` is provided."
          }
        },
        required: ["audio_uri"]
      },
      XTTSV2In: {
        title: "XTTSV2In",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Input text."
          },
          audio_uri: {
            type: "string",
            description: "Reference audio used to synthesize the speaker. If unset, a default speaker voice will be used."
          },
          language: {
            type: "string",
            default: "en",
            description: "Language of input text. Supported languages: `en, de, fr, es, it, pt, pl, zh, ar, cs, ru, nl, tr, hu, ko`.",
            "x-loggable": true
          },
          store: {
            type: "string",
            description: 'Use "hosted" to return an audio URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the audio data will be returned as a base64-encoded string.'
          }
        },
        required: ["text"]
      },
      XTTSV2Out: {
        title: "XTTSV2Out",
        type: "object",
        properties: {
          audio_uri: {
            type: "string",
            description: "Base 64-encoded WAV audio bytes, or a hosted audio url if `store` is provided."
          }
        },
        required: ["audio_uri"]
      },
      Embedding: {
        title: "Embedding",
        type: "object",
        properties: {
          vector: {
            type: "array",
            description: "Embedding vector.",
            items: {
              type: "number",
              format: "float"
            }
          },
          doc_id: {
            type: "string",
            description: "Vector store document ID.",
            "x-loggable": true
          },
          metadata: {
            type: "object",
            description: "Vector store document metadata.",
            additionalProperties: true
          }
        },
        required: ["vector"]
      },
      EmbedTextIn: {
        title: "EmbedTextIn",
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text to embed."
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          metadata: {
            type: "object",
            description: "Metadata that can be used to query the vector store. Ignored if `collection_name` is unset.",
            additionalProperties: true
          },
          embedded_metadata_keys: {
            type: "array",
            description: "Choose keys from `metadata` to embed with text.",
            items: {
              type: "string"
            }
          },
          doc_id: {
            type: "string",
            description: "Vector store document ID. Ignored if `store` is unset."
          },
          model: {
            type: "string",
            enum: ["jina-v2", "clip"],
            description: "Selected embedding model.",
            default: "jina-v2",
            "x-loggable": true
          }
        },
        required: ["text"]
      },
      EmbedTextOut: {
        title: "EmbedTextOut",
        type: "object",
        properties: {
          embedding: {
            type: "object",
            description: "Generated embedding.",
            $ref: "#/components/schemas/Embedding"
          }
        },
        required: ["embedding"]
      },
      EmbedTextItem: {
        type: "object",
        title: "EmbedTextItem",
        properties: {
          text: {
            type: "string",
            description: "Text to embed."
          },
          metadata: {
            type: "object",
            description: "Metadata that can be used to query the vector store. Ignored if `collection_name` is unset.",
            additionalProperties: true
          },
          doc_id: {
            type: "string",
            description: "Vector store document ID. Ignored if `collection_name` is unset."
          }
        },
        required: ["text"]
      },
      MultiEmbedTextIn: {
        title: "MultiEmbedTextIn",
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "Items to embed.",
            items: {
              $ref: "#/components/schemas/EmbedTextItem"
            }
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          embedded_metadata_keys: {
            type: "array",
            description: "Choose keys from `metadata` to embed with text.",
            items: {
              type: "string"
            }
          },
          model: {
            type: "string",
            enum: ["jina-v2", "clip"],
            description: "Selected embedding model.",
            default: "jina-v2",
            "x-loggable": true
          }
        },
        required: ["items"]
      },
      MultiEmbedTextOut: {
        title: "MultiEmbedTextOut",
        type: "object",
        properties: {
          embeddings: {
            type: "array",
            description: "Generated embeddings.",
            items: {
              $ref: "#/components/schemas/Embedding"
            }
          }
        },
        required: ["embeddings"]
      },
      JinaV2In: {
        title: "JinaV2In",
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "Items to embed.",
            items: {
              $ref: "#/components/schemas/EmbedTextItem"
            }
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          embedded_metadata_keys: {
            type: "array",
            description: "Choose keys from `metadata` to embed with text.",
            items: {
              type: "string"
            }
          }
        },
        required: ["items"]
      },
      JinaV2Out: {
        title: "JinaV2Out",
        type: "object",
        properties: {
          embeddings: {
            type: "array",
            description: "Generated embeddings.",
            items: {
              $ref: "#/components/schemas/Embedding"
            }
          }
        },
        required: ["embeddings"]
      },
      EmbedImageIn: {
        title: "EmbedImageIn",
        type: "object",
        properties: {
          image_uri: {
            type: "string",
            description: "Image to embed."
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          doc_id: {
            type: "string",
            description: "Vector store document ID. Ignored if `collection_name` is unset.",
            "x-loggable": true
          },
          model: {
            type: "string",
            enum: ["clip"],
            description: "Selected embedding model.",
            default: "clip",
            "x-loggable": true
          }
        },
        required: ["image_uri"]
      },
      EmbedImageOut: {
        title: "EmbedImageOut",
        type: "object",
        properties: {
          embedding: {
            type: "object",
            description: "Generated embedding.",
            $ref: "#/components/schemas/Embedding"
          }
        },
        required: ["embedding"]
      },
      EmbedImageItem: {
        type: "object",
        title: "EmbedImageItem",
        properties: {
          image_uri: {
            type: "string",
            description: "Image to embed."
          },
          doc_id: {
            type: "string",
            description: "Vector store document ID. Ignored if `collection_name` is unset."
          }
        },
        required: ["image_uri"]
      },
      EmbedTextOrImageItem: {
        type: "object",
        title: "EmbedTextOrImageItem",
        properties: {
          image_uri: {
            type: "string",
            description: "Image to embed."
          },
          text: {
            type: "string",
            description: "Text to embed."
          },
          metadata: {
            type: "object",
            description: "Metadata that can be used to query the vector store. Ignored if `collection_name` is unset.",
            additionalProperties: true
          },
          doc_id: {
            type: "string",
            description: "Vector store document ID. Ignored if `collection_name` is unset."
          }
        },
        required: []
      },
      MultiEmbedImageIn: {
        title: "MultiEmbedImageIn",
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "Items to embed.",
            items: {
              $ref: "#/components/schemas/EmbedImageItem"
            }
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            enum: ["clip"],
            description: "Selected embedding model.",
            default: "clip",
            "x-loggable": true
          }
        },
        required: ["items"]
      },
      MultiEmbedImageOut: {
        title: "MultiEmbedImageOut",
        type: "object",
        properties: {
          embeddings: {
            type: "array",
            description: "Generated embeddings.",
            items: {
              $ref: "#/components/schemas/Embedding"
            }
          }
        },
        required: ["embeddings"]
      },
      CLIPIn: {
        title: "CLIPIn",
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "Items to embed.",
            items: {
              $ref: "#/components/schemas/EmbedTextOrImageItem"
            }
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          embedded_metadata_keys: {
            type: "array",
            description: "Choose keys from `metadata` to embed with text. Only applies to text items.",
            items: {
              type: "string"
            }
          }
        },
        required: ["items"]
      },
      CLIPOut: {
        title: "CLIPOut",
        type: "object",
        properties: {
          embeddings: {
            type: "array",
            description: "Generated embeddings.",
            items: {
              $ref: "#/components/schemas/Embedding"
            }
          }
        },
        required: ["embeddings"]
      },
      FindOrCreateVectorStoreIn: {
        title: "FindOrCreateVectorStoreIn",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name.",
            minLength: 1,
            maxLength: 63
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"],
            "x-loggable": true
          }
        },
        required: ["collection_name", "model"]
      },
      FindOrCreateVectorStoreOut: {
        title: "FindOrCreateVectorStoreOut",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name.",
            minLength: 1,
            maxLength: 63
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"]
          },
          num_leaves: {
            type: "integer",
            description: "Number of leaves in the vector store.",
            minimum: 1
          }
        },
        required: ["collection_name", "model"]
      },
      ListVectorStoresIn: {
        title: "ListVectorStoresIn",
        type: "object",
        properties: {}
      },
      ListVectorStoresOut: {
        title: "ListVectorStoresOut",
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "List of vector stores.",
            items: {
              $ref: "#/components/schemas/FindOrCreateVectorStoreOut"
            }
          }
        }
      },
      DeleteVectorStoreIn: {
        title: "DeleteVectorStoreIn",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"],
            "x-loggable": true
          }
        },
        required: ["collection_name", "model"]
      },
      DeleteVectorStoreOut: {
        title: "DeleteVectorStoreOut",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"]
          }
        },
        required: ["collection_name", "model"]
      },
      Vector: {
        title: "Vector",
        type: "object",
        description: "Canonical representation of document with embedding vector.",
        properties: {
          id: {
            type: "string",
            description: "Document ID."
          },
          vector: {
            type: "array",
            description: "Embedding vector.",
            items: {
              type: "number",
              format: "float"
            }
          },
          metadata: {
            type: "object",
            description: "Document metadata.",
            additionalProperties: true
          }
        },
        required: ["id", "vector", "metadata"]
      },
      FetchVectorsIn: {
        title: "FetchVectorsIn",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"],
            "x-loggable": true
          },
          ids: {
            type: "array",
            description: "Document IDs to retrieve.",
            items: {
              type: "string"
            },
            "x-loggable": true
          }
        },
        required: ["collection_name", "model", "ids"]
      },
      FetchVectorsOut: {
        title: "FetchVectorsOut",
        type: "object",
        properties: {
          vectors: {
            type: "array",
            description: "Retrieved vectors.",
            items: {
              $ref: "#/components/schemas/Vector"
            }
          }
        },
        required: ["vectors"]
      },
      UpdateVectorsOut: {
        title: "UpdateVectorsOut",
        type: "object",
        properties: {
          count: {
            type: "integer",
            description: "Number of vectors modified."
          }
        },
        required: ["count"]
      },
      DeleteVectorsOut: {
        title: "DeleteVectorsOut",
        type: "object",
        properties: {
          count: {
            type: "integer",
            description: "Number of vectors modified."
          }
        },
        required: ["count"]
      },
      UpdateVectorParams: {
        title: "UpdateVectorParams",
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Document ID."
          },
          vector: {
            type: "array",
            description: "Embedding vector.",
            items: {
              type: "number",
              format: "float"
            }
          },
          metadata: {
            type: "object",
            description: "Document metadata.",
            additionalProperties: true
          }
        },
        required: ["id"]
      },
      UpdateVectorsIn: {
        title: "UpdateVectorsIn",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"],
            "x-loggable": true
          },
          vectors: {
            type: "array",
            description: "Vectors to upsert.",
            items: {
              $ref: "#/components/schemas/UpdateVectorParams"
            }
          }
        },
        required: ["collection_name", "model", "vectors"]
      },
      DeleteVectorsIn: {
        title: "DeleteVectorsIn",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"],
            "x-loggable": true
          },
          ids: {
            type: "array",
            description: "Document IDs to delete.",
            items: {
              type: "string"
            },
            "x-loggable": true
          }
        },
        required: ["collection_name", "model", "ids"]
      },
      QueryVectorStoreIn: {
        title: "QueryVectorStoreIn",
        type: "object",
        properties: {
          collection_name: {
            type: "string",
            description: "Vector store to query against."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"],
            "x-loggable": true
          },
          query_strings: {
            type: "array",
            description: "Texts to embed and use for the query.",
            items: {
              type: "string"
            }
          },
          query_image_uris: {
            type: "array",
            description: "Image URIs to embed and use for the query.",
            items: {
              type: "string"
            }
          },
          query_vectors: {
            type: "array",
            description: "Vectors to use for the query.",
            items: {
              type: "array",
              items: {
                type: "number",
                format: "float"
              }
            }
          },
          query_ids: {
            type: "array",
            description: "Document IDs to use for the query.",
            items: {
              type: "string"
            },
            "x-loggable": true
          },
          top_k: {
            type: "integer",
            minimum: 1,
            maximum: 1e3,
            default: 10,
            description: "Number of results to return.",
            "x-loggable": true
          },
          ef_search: {
            type: "integer",
            minimum: 1,
            maximum: 1e3,
            default: 40,
            description: "The size of the dynamic candidate list for searching the index graph.",
            "x-loggable": true
          },
          num_leaves_to_search: {
            type: "integer",
            minimum: 1,
            maximum: 1e3,
            default: 40,
            description: "The number of leaves in the index tree to search.",
            "x-loggable": true
          },
          include_values: {
            type: "boolean",
            default: false,
            description: "Include the values of the vectors in the response.",
            "x-loggable": true
          },
          include_metadata: {
            type: "boolean",
            default: false,
            description: "Include the metadata of the vectors in the response.",
            "x-loggable": true
          },
          filters: {
            type: "object",
            description: "Filter metadata by key-value pairs.",
            additionalProperties: true
          }
        },
        required: ["collection_name", "model"]
      },
      VectorStoreQueryResult: {
        title: "VectorStoreQueryResult",
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Document ID.",
            "x-loggable": true
          },
          distance: {
            type: "number",
            format: "float",
            description: "Similarity score.",
            "x-loggable": true
          },
          vector: {
            type: "array",
            description: "Embedding vector.",
            items: {
              type: "number",
              format: "float"
            }
          },
          metadata: {
            type: "object",
            description: "Document metadata.",
            additionalProperties: true
          }
        },
        required: ["id", "distance"]
      },
      QueryVectorStoreOut: {
        title: "QueryVectorStoreOut",
        type: "object",
        properties: {
          results: {
            type: "array",
            description: "Query results.",
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/VectorStoreQueryResult"
              }
            }
          },
          collection_name: {
            type: "string",
            description: "Vector store name."
          },
          model: {
            type: "string",
            description: "Selected embedding model.",
            enum: ["jina-v2", "clip"]
          }
        },
        required: ["results"]
      },
      SplitDocumentIn: {
        title: "SplitDocumentIn",
        type: "object",
        properties: {
          uri: {
            type: "string",
            description: "URI of the document."
          },
          doc_id: {
            type: "string",
            description: "Document ID."
          },
          metadata: {
            type: "object",
            description: "Document metadata.",
            additionalProperties: true
          },
          chunk_size: {
            type: "integer",
            minimum: 1,
            description: "Maximum number of units per chunk. Defaults to 1024 tokens for text or 40 lines for code."
          },
          chunk_overlap: {
            type: "integer",
            minimum: 0,
            description: "Number of units to overlap between chunks. Defaults to 200 tokens for text or 15 lines for code."
          }
        },
        required: ["uri"]
      },
      SplitDocumentOut: {
        title: "SplitDocumentOut",
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "Document chunks",
            items: {
              $ref: "#/components/schemas/EmbedTextItem"
            }
          }
        },
        required: ["items"]
      }
    }
  },
  paths: {
    "/Experimental": {
      post: {
        summary: "Experimental",
        operationId: "Experimental",
        tags: ["category:utility"],
        description: "Experimental node.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ExperimentalIn"
              },
              example: {
                name: "some_name",
                args: {
                  foo: "bar"
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ExperimentalOut"
                },
                example: {
                  output: {
                    foo: "bar"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/Box": {
      post: {
        summary: "Box",
        operationId: "Box",
        tags: ["category:utility"],
        description: "Combine multiple values into a single output.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BoxIn"
              },
              example: {
                value: {
                  a: "b",
                  c: {
                    d: [1, 2, 3]
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BoxOut"
                },
                example: {
                  value: {
                    a: "b",
                    c: {
                      d: [1, 2, 3]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/If": {
      post: {
        summary: "If",
        operationId: "If",
        "x-node": "LogicalIf",
        tags: ["category:utility"],
        description: "Return one of two options based on a condition.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/IfIn"
              },
              example: {
                condition: true,
                value_if_true: "yes",
                value_if_false: "no"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/IfOut"
                },
                example: {
                  result: "yes"
                }
              }
            }
          }
        }
      }
    },
    "/RunPython": {
      post: {
        summary: "RunPython",
        operationId: "RunPython",
        tags: ["category:utility"],
        description: "Run code using a Python interpreter.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RunPythonIn"
              },
              example: {
                pkl_function: "g2UjA5fX2t3ZGVmYXVsdHNfX5ROjAxfX2RlZmF1bHRzX1+UTowKX19tb2R1bGVfX5SMCF9fbWFpbl9flIwHX19kb2NfX5ROjAtfX2Nsb3N1cmVfX5ROjBdfY2xvdWRwaWNrbGVfc3VibW9kdWxlc5RdlIwLX19nbG9iYWxzX1+UfZR1hpSGUjAu",
                kwargs: {},
                pip_install: ["numpy"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RunPythonOut"
                },
                example: {
                  stdout: "foo\n",
                  stderr: ""
                }
              }
            }
          }
        }
      }
    },
    "/ComputeText": {
      post: {
        summary: "ComputeText",
        operationId: "ComputeText",
        tags: ["category:language"],
        description: "Compute text using a language model.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ComputeTextIn"
              },
              example: {
                prompt: "Who is Don Quixote?",
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ComputeTextOut"
                },
                example: {
                  text: "Don Quixote is a fictional character in the novel of the same name by Miguel de Cervantes."
                }
              }
            }
          }
        }
      }
    },
    "/MultiComputeText": {
      post: {
        summary: "MultiComputeText",
        operationId: "MultiComputeText",
        tags: ["category:language"],
        description: "Generate multiple text choices using a language model.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MultiComputeTextIn"
              },
              example: {
                prompt: "Who is Don Quixote?",
                num_choices: 2,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultiComputeTextOut"
                },
                example: {
                  choices: [
                    {
                      text: "Don Quixote is a fictional character and the protagonist of the novel Don Quixote by Miguel..."
                    },
                    {
                      text: "Don Quixote is a fictional character created by the Spanish author Miguel de Cervantes..."
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/BatchComputeText": {
      post: {
        summary: "BatchComputeText",
        operationId: "BatchComputeText",
        tags: ["category:language"],
        description: "Compute text for multiple prompts in batch using a language model.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BatchComputeTextIn"
              },
              example: {
                prompts: ["Who is Don Quixote?", "Who is Sancho Panza?"],
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BatchComputeTextOut"
                },
                example: {
                  outputs: [
                    {
                      text: "Don Quixote is a fictional character and the protagonist of the novel Don Quixote by Miguel..."
                    },
                    {
                      text: "Don Quixote is a fictional character created by the Spanish author Miguel de Cervantes..."
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/BatchComputeJSON": {
      post: {
        summary: "BatchComputeJSON",
        operationId: "BatchComputeJSON",
        tags: ["category:language"],
        description: "Compute JSON for multiple prompts in batch using a language model.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BatchComputeJSONIn"
              },
              example: {
                prompts: ["Who is Don Quixote?", "Who is Sancho Panza?"],
                max_tokens: 800,
                json_schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the character."
                    },
                    bio: {
                      type: "string",
                      description: "Concise biography of the character."
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BatchComputeJSONOut"
                },
                example: {
                  outputs: [
                    {
                      json_object: {}
                    },
                    {
                      json_object: {}
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/ComputeJSON": {
      post: {
        summary: "ComputeJSON",
        operationId: "ComputeJSON",
        tags: ["category:language"],
        description: "Compute JSON using a language model.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ComputeJSONIn"
              },
              example: {
                prompt: "Who wrote Don Quixote?",
                json_schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the author."
                    },
                    bio: {
                      type: "string",
                      description: "Concise biography of the author."
                    }
                  }
                },
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ComputeJSONOut"
                },
                example: {
                  json_object: {}
                }
              }
            }
          }
        }
      }
    },
    "/MultiComputeJSON": {
      post: {
        summary: "MultiComputeJSON",
        operationId: "MultiComputeJSON",
        tags: ["category:language"],
        description: "Compute multiple JSON choices using a language model.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MultiComputeJSONIn"
              },
              example: {
                prompt: "Who wrote Don Quixote?",
                json_schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the author."
                    },
                    bio: {
                      type: "string",
                      description: "Concise biography of the author."
                    }
                  }
                },
                num_choices: 2,
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultiComputeJSONOut"
                },
                example: {
                  choices: [
                    {
                      json_object: {}
                    },
                    {
                      json_object: {}
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/Mistral7BInstruct": {
      post: {
        summary: "Mistral7BInstruct",
        operationId: "Mistral7BInstruct",
        tags: ["category:language", "type:low-level"],
        description: "Compute text using [Mistral 7B Instruct](https://mistral.ai/news/announcing-mistral-7b).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Mistral7BInstructIn"
              },
              example: {
                prompt: "Who is Don Quixote?",
                num_choices: 2,
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mistral7BInstructOut"
                },
                example: {
                  choices: [
                    {
                      text: "Don Quixote is a fictional character and the protagonist of the novel Don Quixote by Miguel..."
                    },
                    {
                      text: "Don Quixote is a fictional character created by the Spanish author Miguel de Cervantes..."
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/Mixtral8x7BInstruct": {
      post: {
        summary: "Mixtral8x7BInstruct",
        operationId: "Mixtral8x7BInstruct",
        tags: ["category:language", "type:low-level"],
        description: "Compute text using instruct-tuned [Mixtral 8x7B](https://mistral.ai/news/mixtral-of-experts/).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Mixtral8x7BInstructIn"
              },
              example: {
                prompt: "Who is Don Quixote?",
                num_choices: 2,
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mixtral8x7BInstructOut"
                },
                example: {
                  choices: [
                    {
                      text: "Don Quixote is a fictional character and the protagonist of the novel Don Quixote by Miguel..."
                    },
                    {
                      text: "Don Quixote is a fictional character created by the Spanish author Miguel de Cervantes..."
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/Llama3Instruct8B": {
      post: {
        summary: "Llama3Instruct8B",
        operationId: "Llama3Instruct8B",
        tags: ["category:language", "type:low-level"],
        description: "Compute text using instruct-tuned [Llama 3 8B](https://llama.meta.com/llama3/).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Llama3Instruct8BIn"
              },
              example: {
                prompt: "Who is Don Quixote?",
                num_choices: 2,
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Llama3Instruct8BOut"
                },
                example: {
                  choices: [
                    {
                      text: "Don Quixote is a fictional character and the protagonist of the novel Don Quixote by Miguel..."
                    },
                    {
                      text: "Don Quixote is a fictional character created by the Spanish author Miguel de Cervantes..."
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/Llama3Instruct70B": {
      post: {
        summary: "Llama3Instruct70B",
        operationId: "Llama3Instruct70B",
        tags: ["category:language", "type:low-level"],
        description: "Compute text using instruct-tuned [Llama 3 70B](https://llama.meta.com/llama3/).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Llama3Instruct70BIn"
              },
              example: {
                prompt: "Who is Don Quixote?",
                num_choices: 2,
                temperature: 0.4,
                max_tokens: 800
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Llama3Instruct70BOut"
                },
                example: {
                  choices: [
                    {
                      text: "Don Quixote is a fictional character and the protagonist of the novel Don Quixote by Miguel..."
                    },
                    {
                      text: "Don Quixote is a fictional character created by the Spanish author Miguel de Cervantes..."
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/Firellava13B": {
      post: {
        summary: "Firellava13B",
        operationId: "Firellava13B",
        tags: ["category:language", "type:low-level"],
        description: "Compute text with image input using [FireLLaVA 13B](https://fireworks.ai/blog/firellava-the-first-commercially-permissive-oss-llava-model).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Firellava13BIn"
              },
              example: {
                prompt: "what are these paintings of and who made them?",
                image_uris: [
                  "https://media.substrate.run/docs-fuji-red.jpg",
                  "https://media.substrate.run/docs-fuji-blue.jpg"
                ]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Firellava13BOut"
                },
                example: {
                  text: "The artist who created these paintings is Hokusai Katsushika, a renowned Japanese artist known for his woodblock prints and paintings."
                }
              }
            }
          }
        }
      }
    },
    "/GenerateImage": {
      post: {
        summary: "GenerateImage",
        operationId: "GenerateImage",
        tags: ["category:image"],
        description: "Generate an image.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GenerateImageIn"
              },
              example: {
                prompt: "hokusai futuristic supercell spiral cloud with glowing core over turbulent ocean",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenerateImageOut"
                },
                example: {
                  image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/MultiGenerateImage": {
      post: {
        summary: "MultiGenerateImage",
        operationId: "MultiGenerateImage",
        tags: ["category:image"],
        description: "Generate multiple images.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MultiGenerateImageIn"
              },
              example: {
                prompt: "hokusai futuristic supercell spiral cloud with glowing core over turbulent ocean",
                num_images: 2,
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultiGenerateImageOut"
                },
                example: {
                  outputs: [
                    {
                      image_uri: "https://assets.substrate.run/84848484.jpg"
                    },
                    {
                      image_uri: "https://assets.substrate.run/48484848.jpg"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/InpaintImage": {
      post: {
        summary: "InpaintImage",
        operationId: "InpaintImage",
        tags: ["category:image"],
        description: "Edit an image using image generation inside part of the image or the full image.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InpaintImageIn"
              },
              example: {
                image_uri: "https://media.substrate.run/docs-klimt-park.jpg",
                mask_image_uri: "https://media.substrate.run/spiral-logo.jpeg",
                prompt: "large tropical colorful bright anime birds in a dark jungle full of vines, high resolution",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InpaintImageOut"
                },
                example: {
                  image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/MultiInpaintImage": {
      post: {
        summary: "MultiInpaintImage",
        operationId: "MultiInpaintImage",
        tags: ["category:image"],
        description: "Edit multiple images using image generation.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MultiInpaintImageIn"
              },
              example: {
                image_uri: "https://media.substrate.run/docs-klimt-park.jpg",
                mask_image_uri: "https://media.substrate.run/spiral-logo.jpeg",
                prompt: "large tropical colorful bright anime birds in a dark jungle full of vines, high resolution",
                num_images: 2,
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultiInpaintImageOut"
                },
                example: {
                  outputs: [
                    {
                      image_uri: "https://assets.substrate.run/84848484.jpg"
                    },
                    {
                      image_uri: "https://assets.substrate.run/48484848.jpg"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/StableDiffusionXLLightning": {
      post: {
        summary: "StableDiffusionXLLightning",
        operationId: "StableDiffusionXLLightning",
        tags: ["category:image", "type:low-level"],
        description: "Generate an image using [Stable Diffusion XL Lightning](https://arxiv.org/abs/2402.13929).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StableDiffusionXLLightningIn"
              },
              example: {
                prompt: "hokusai futuristic supercell spiral cloud with glowing core over turbulent ocean",
                negative_prompt: "night, moon",
                num_images: 2,
                seeds: [330699, 136464],
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StableDiffusionXLLightningOut"
                },
                example: {
                  outputs: [
                    {
                      image_uri: "https://assets.substrate.run/84848484.jpg",
                      seed: 330418
                    },
                    {
                      image_uri: "https://assets.substrate.run/48484848.jpg",
                      seed: 1364164
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/StableDiffusionXLInpaint": {
      post: {
        summary: "StableDiffusionXLInpaint",
        operationId: "StableDiffusionXLInpaint",
        tags: ["category:image", "type:low-level"],
        description: "Edit an image using [Stable Diffusion XL](https://arxiv.org/abs/2307.01952). Supports inpainting (edit part of the image with a mask) and image-to-image (edit the full image).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StableDiffusionXLInpaintIn"
              },
              example: {
                image_uri: "https://media.substrate.run/docs-klimt-park.jpg",
                mask_image_uri: "https://media.substrate.run/spiral-logo.jpeg",
                prompt: "large tropical colorful bright birds in a jungle, high resolution oil painting",
                negative_prompt: "dark, cartoon, anime",
                strength: 0.8,
                num_images: 2,
                store: "hosted",
                seeds: [1607280, 1720395]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StableDiffusionXLInpaintOut"
                },
                example: {
                  outputs: [
                    {
                      image_uri: "https://assets.substrate.run/84848484.jpg",
                      seed: 1607326
                    },
                    {
                      image_uri: "https://assets.substrate.run/48484848.jpg",
                      seed: 1720398
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/StableDiffusionXLControlNet": {
      post: {
        summary: "StableDiffusionXLControlNet",
        operationId: "StableDiffusionXLControlNet",
        tags: ["category:image"],
        description: "Generate an image with generation structured by an input image, using Stable Diffusion XL with [ControlNet](https://arxiv.org/abs/2302.05543).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StableDiffusionXLControlNetIn"
              },
              example: {
                image_uri: "https://media.substrate.run/spiral-logo.jpeg",
                prompt: "the futuristic solarpunk city of atlantis at sunset, cinematic bokeh HD",
                control_method: "illusion",
                conditioning_scale: 1,
                strength: 1,
                store: "hosted",
                num_images: 2,
                seeds: [1607226, 1720395]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StableDiffusionXLControlNetOut"
                },
                example: {
                  outputs: [
                    {
                      image_uri: "https://assets.substrate.run/84848484.jpg",
                      seed: 1607266
                    },
                    {
                      image_uri: "https://assets.substrate.run/48484848.jpg",
                      seed: 1720398
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/StableVideoDiffusion": {
      post: {
        summary: "StableVideoDiffusion",
        operationId: "StableVideoDiffusion",
        tags: ["category:image", "type:low-level"],
        description: "Generates a video using a still image as conditioning frame.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StableVideoDiffusionIn"
              },
              example: {
                image_uri: "https://media.substrate.run/apple-forest.jpeg",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StableVideoDiffusionOut"
                },
                example: {
                  video_uri: "https://assets.substrate.run/84848484.mp4"
                }
              }
            }
          }
        }
      }
    },
    "/InterpolateFrames": {
      post: {
        summary: "InterpolateFrames",
        operationId: "InterpolateFrames",
        tags: ["category:image", "type:low-level"],
        description: "Generates a interpolation frames between each adjacent frames.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InterpolateFramesIn"
              },
              example: {
                frame_uris: [
                  "https://media.substrate.run/apple-forest2.jpeg",
                  "https://media.substrate.run/apple-forest3.jpeg"
                ],
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InterpolateFramesOut"
                },
                example: {
                  video_uri: "https://assets.substrate.run/84848484.mp4"
                }
              }
            }
          }
        }
      }
    },
    "/TranscribeSpeech": {
      post: {
        summary: "TranscribeSpeech",
        operationId: "TranscribeSpeech",
        tags: ["category:audio"],
        description: "Transcribe speech in an audio or video file.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TranscribeSpeechIn"
              },
              example: {
                audio_uri: "https://media.substrate.run/dfw-clip.m4a",
                prompt: "David Foster Wallace interviewed about US culture, and Infinite Jest",
                segment: true,
                align: true,
                diarize: true,
                suggest_chapters: true
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TranscribeSpeechOut"
                },
                example: {
                  text: "language like that, the wounded inner child, the inner pain, is part of a kind of pop psychological movement in the United States that is a sort of popular Freudianism that ...",
                  segments: [
                    {
                      start: 0.874,
                      end: 15.353,
                      speaker: "SPEAKER_00",
                      text: "language like that, the wounded inner child, the inner pain, is part of a kind of pop psychological movement in the United States that is a sort of popular Freudianism that",
                      words: [
                        {
                          word: "language",
                          start: 0.874,
                          end: 1.275,
                          speaker: "SPEAKER_00"
                        },
                        {
                          word: "like",
                          start: 1.295,
                          end: 1.455,
                          speaker: "SPEAKER_00"
                        }
                      ]
                    }
                  ],
                  chapters: [
                    {
                      title: "Introduction to the Wounded Inner Child and Popular Psychology in US",
                      start: 0.794
                    },
                    {
                      title: "The Paradox of Popular Psychology and Anger in America",
                      start: 16.186
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/GenerateSpeech": {
      post: {
        summary: "GenerateSpeech",
        operationId: "GenerateSpeech",
        tags: ["category:audio", "backend:v1"],
        description: "Generate speech from text.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GenerateSpeechIn"
              },
              example: {
                text: "Substrate: an underlying substance or layer.",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenerateSpeechOut"
                },
                example: {
                  audio_uri: "https://assets.substrate.run/84848484.wav"
                }
              }
            }
          }
        }
      }
    },
    "/RemoveBackground": {
      post: {
        summary: "RemoveBackground",
        operationId: "RemoveBackground",
        tags: ["category:segmentation"],
        description: "Remove the background from an image and return the foreground segment as a cut-out or a mask.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RemoveBackgroundIn"
              },
              example: {
                image_uri: "https://media.substrate.run/apple-forest.jpeg",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RemoveBackgroundOut"
                },
                example: {
                  image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/EraseImage": {
      post: {
        summary: "EraseImage",
        operationId: "EraseImage",
        tags: ["category:image"],
        description: "Erase the masked part of an image, e.g. to remove an object by inpainting.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EraseImageIn"
              },
              example: {
                image_uri: "https://media.substrate.run/apple-forest.jpeg",
                mask_image_uri: "https://media.substrate.run/apple-forest-mask.jpeg",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/EraseImageOut"
                },
                example: {
                  image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/UpscaleImage": {
      post: {
        summary: "UpscaleImage",
        operationId: "UpscaleImage",
        tags: ["category:image"],
        description: "Upscale an image using image generation.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpscaleImageIn"
              },
              example: {
                prompt: "high resolution detailed spiral shell",
                image_uri: "https://media.substrate.run/docs-shell-emoji.jpg",
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpscaleImageOut"
                },
                example: {
                  image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/SegmentUnderPoint": {
      post: {
        summary: "SegmentUnderPoint",
        operationId: "SegmentUnderPoint",
        tags: ["category:segmentation"],
        description: "Segment an image under a point and return the segment.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SegmentUnderPointIn"
              },
              example: {
                image_uri: "https://media.substrate.run/docs-vg-bedroom.jpg",
                point: {
                  x: 189,
                  y: 537
                },
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SegmentUnderPointOut"
                },
                example: {
                  mask_image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/SegmentAnything": {
      post: {
        summary: "SegmentAnything",
        operationId: "SegmentAnything",
        tags: ["category:segmentation", "type:low-level"],
        description: "Segment an image using [SegmentAnything](https://github.com/facebookresearch/segment-anything).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SegmentAnythingIn"
              },
              example: {
                image_uri: "https://media.substrate.run/docs-vg-bedroom.jpg",
                point_prompts: [
                  {
                    x: 189,
                    y: 537
                  }
                ],
                store: "hosted"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SegmentAnythingOut"
                },
                example: {
                  mask_image_uri: "https://assets.substrate.run/84848484.jpg"
                }
              }
            }
          }
        }
      }
    },
    "/SplitDocument": {
      post: {
        summary: "SplitDocument",
        operationId: "SplitDocument",
        tags: ["category:embedding"],
        description: "Split document into text segments.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SplitDocumentIn"
              },
              example: {
                doc_id: "example_pdf",
                uri: "https://arxiv.org/pdf/2405.07945",
                metadata: {
                  title: "GRASS II: Simulations of Potential Granulation Noise Mitigation Methods"
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SplitDocumentOut"
                },
                example: {
                  items: [
                    {
                      text: "This is the first chunk of the pdf",
                      metadata: {
                        title: "GRASS II: Simulations of Potential Granulation Noise Mitigation Methods",
                        chunk_id: "chk_asd897asdhnad0j8qd8qnd98"
                      },
                      doc_id: "example_pdf"
                    },
                    {
                      text: "This is the second chunk of the pdf",
                      metadata: {
                        title: "GRASS II: Simulations of Potential Granulation Noise Mitigation Methods",
                        chunk_id: "chk_nvsiusd89adsy89dahd9abs8"
                      },
                      doc_id: "example_pdf"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/EmbedText": {
      post: {
        summary: "EmbedText",
        operationId: "EmbedText",
        tags: ["category:embedding"],
        description: "Generate embedding for a text document.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EmbedTextIn"
              },
              example: {
                text: "Argon is the third most abundant gas in Earth's atmosphere, at 0.934% (9340 ppmv). It is more than twice as abundant as water vapor.",
                model: "jina-v2",
                collection_name: "smoke_tests",
                metadata: {
                  group: "18"
                },
                embedded_metadata_keys: ["group"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/EmbedTextOut"
                },
                example: {
                  embedding: {
                    vector: [
                      -0.035030052065849304,
                      -0.04128379374742508,
                      0.05782046541571617
                    ],
                    doc_id: "c9de81fb98804ce0afb2b8ac17c0799b",
                    metadata: {
                      group: "18",
                      doc_id: "c9de81fb98804ce0afb2b8ac17c0799b",
                      doc: "group: 18\n\nArgon is the third most abundant gas in Earth's atmosphere, at 0.934% (9340 ppmv). It is more than twice as abundant as water vapor."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/MultiEmbedText": {
      post: {
        summary: "MultiEmbedText",
        operationId: "MultiEmbedText",
        tags: ["category:embedding"],
        description: "Generate embeddings for multiple text documents.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MultiEmbedTextIn"
              },
              example: {
                model: "jina-v2",
                items: [
                  {
                    text: "Osmium is the densest naturally occurring element. When experimentally measured using X-ray crystallography, it has a density of 22.59 g/cm3. Manufacturers use its alloys with platinum, iridium, and other platinum-group metals to make fountain pen nib tipping, electrical contacts, and in other applications that require extreme durability and hardness.",
                    metadata: {
                      group: "8"
                    }
                  },
                  {
                    text: "Despite its abundant presence in the universe and Solar System\u2014ranking fifth in cosmic abundance following hydrogen, helium, oxygen, and carbon\u2014neon is comparatively scarce on Earth.",
                    metadata: {
                      group: "18"
                    }
                  }
                ],
                collection_name: "smoke_tests",
                embedded_metadata_keys: ["group"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultiEmbedTextOut"
                },
                example: {
                  embeddings: [
                    {
                      vector: [
                        -0.035030052065849304,
                        -0.04128379374742508,
                        0.05782046541571617
                      ],
                      doc_id: "c9de81fb98804ce0afb2b8ac17c0799b",
                      metadata: {
                        group: "8",
                        doc_id: "c9de81fb98804ce0afb2b8ac17c0799b",
                        doc: "group: 8\n\nOsmium is the densest naturally occurring element. When experimentally measured using X-ray crystallography, it has a density of 22.59 g/cm3. Manufacturers use its alloys with platinum, iridium, and other platinum-group metals to make fountain pen nib tipping, electrical contacts, and in other applications that require extreme durability and hardness."
                      }
                    },
                    {
                      vector: [
                        3024724137503654e-19,
                        -0.025219274684786797,
                        -0.009984994307160378
                      ],
                      doc_id: "c4464f69c93946a896925589681d38b4",
                      metadata: {
                        group: "18",
                        doc_id: "c4464f69c93946a896925589681d38b4",
                        doc: "group: 18\n\nDespite its abundant presence in the universe and Solar System\u2014ranking fifth in cosmic abundance following hydrogen, helium, oxygen, and carbon\u2014neon is comparatively scarce on Earth."
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/EmbedImage": {
      post: {
        summary: "EmbedImage",
        operationId: "EmbedImage",
        tags: ["category:embedding"],
        description: "Generate embedding for an image.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EmbedImageIn"
              },
              example: {
                image_uri: "https://media.substrate.run/docs-fuji-red.jpg",
                collection_name: "smoke_tests"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/EmbedImageOut"
                },
                example: {
                  embedding: {
                    vector: [
                      3024724137503654e-19,
                      -0.025219274684786797,
                      -0.009984994307160378
                    ],
                    doc_id: "c4464f69c93946a896925589681d38b4"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/MultiEmbedImage": {
      post: {
        summary: "MultiEmbedImage",
        operationId: "MultiEmbedImage",
        tags: ["category:embedding"],
        description: "Generate embeddings for multiple images.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MultiEmbedImageIn"
              },
              example: {
                items: [
                  {
                    image_uri: "https://media.substrate.run/docs-fuji-red.jpg"
                  },
                  {
                    image_uri: "https://media.substrate.run/docs-fuji-blue.jpg"
                  }
                ],
                collection_name: "smoke_tests"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultiEmbedImageOut"
                },
                example: {
                  embeddings: [
                    {
                      vector: [
                        -0.035030052065849304,
                        -0.04128379374742508,
                        0.05782046541571617
                      ],
                      doc_id: "c9de81fb98804ce0afb2b8ac17c0799b"
                    },
                    {
                      vector: [
                        3024724137503654e-19,
                        -0.025219274684786797,
                        -0.009984994307160378
                      ],
                      doc_id: "c4464f69c93946a896925589681d38b4"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/JinaV2": {
      post: {
        summary: "JinaV2",
        operationId: "JinaV2",
        tags: ["category:embedding", "type:low-level"],
        description: "Generate embeddings for multiple text documents using [Jina Embeddings 2](https://arxiv.org/abs/2310.19923).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JinaV2In"
              },
              example: {
                items: [
                  {
                    text: "Hassium is a superheavy element; it has been produced in a laboratory only in very small quantities by fusing heavy nuclei with lighter ones. Natural occurrences of the element have been hypothesised but never found.",
                    metadata: {
                      group: "8"
                    }
                  },
                  {
                    text: "Xenon is also used to search for hypothetical weakly interacting massive particles and as a propellant for ion thrusters in spacecraft.",
                    metadata: {
                      group: "18"
                    }
                  }
                ],
                collection_name: "smoke_tests",
                embedded_metadata_keys: ["group"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JinaV2Out"
                },
                example: {
                  embeddings: [
                    {
                      vector: [
                        -0.035030052065849304,
                        -0.04128379374742508,
                        0.05782046541571617
                      ],
                      doc_id: "c9de81fb98804ce0afb2b8ac17c0799b",
                      metadata: {
                        group: "8",
                        doc_id: "c9de81fb98804ce0afb2b8ac17c0799b",
                        doc: "group: 8\n\nHassium is a superheavy element; it has been produced in a laboratory only in very small quantities by fusing heavy nuclei with lighter ones. Natural occurrences of the element have been hypothesised but never found."
                      }
                    },
                    {
                      vector: [
                        3024724137503654e-19,
                        -0.025219274684786797,
                        -0.009984994307160378
                      ],
                      doc_id: "c4464f69c93946a896925589681d38b4",
                      metadata: {
                        group: "18",
                        doc_id: "c4464f69c93946a896925589681d38b4",
                        doc: "group: 18\n\nXenon is also used to search for hypothetical weakly interacting massive particles and as a propellant for ion thrusters in spacecraft."
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/CLIP": {
      post: {
        summary: "CLIP",
        operationId: "CLIP",
        tags: ["category:embedding", "type:low-level"],
        description: "Generate embeddings for text or images using [CLIP](https://openai.com/research/clip).",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CLIPIn"
              },
              example: {
                items: [
                  {
                    image_uri: "https://media.substrate.run/docs-fuji-red.jpg"
                  },
                  {
                    image_uri: "https://media.substrate.run/docs-fuji-blue.jpg"
                  }
                ],
                collection_name: "smoke_tests"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CLIPOut"
                },
                example: {
                  embeddings: [
                    {
                      vector: [
                        -0.035030052065849304,
                        -0.04128379374742508,
                        0.05782046541571617
                      ],
                      doc_id: "c9de81fb98804ce0afb2b8ac17c0799b"
                    },
                    {
                      vector: [
                        3024724137503654e-19,
                        -0.025219274684786797,
                        -0.009984994307160378
                      ],
                      doc_id: "c4464f69c93946a896925589681d38b4"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/FindOrCreateVectorStore": {
      post: {
        tags: ["category:vector-store"],
        summary: "FindOrCreateVectorStore",
        operationId: "FindOrCreateVectorStore",
        description: "Find a vector store matching the given collection name, or create a new vector store.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FindOrCreateVectorStoreIn"
              },
              example: {
                collection_name: "smoke_tests",
                model: "jina-v2"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Vector store created.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FindOrCreateVectorStoreOut"
                },
                example: {
                  collection_name: "smoke_tests",
                  model: "jina-v2"
                }
              }
            }
          }
        }
      }
    },
    "/ListVectorStores": {
      post: {
        tags: ["category:vector-store"],
        summary: "ListVectorStores",
        operationId: "ListVectorStores",
        description: "List all vector stores.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ListVectorStoresIn"
              },
              example: {}
            }
          }
        },
        responses: {
          "200": {
            description: "List of vector stores.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ListVectorStoresOut"
                },
                example: {
                  items: [
                    {
                      collection_name: "comments",
                      model: "jina-v2"
                    },
                    {
                      collection_name: "images",
                      model: "jina-v2"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/DeleteVectorStore": {
      post: {
        tags: ["category:vector-store"],
        summary: "DeleteVectorStore",
        operationId: "DeleteVectorStore",
        description: "Delete a vector store.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteVectorStoreIn"
              },
              example: {
                collection_name: "fake_store",
                model: "jina-v2"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DeleteVectorStoreOut"
                },
                example: {
                  collection_name: "comments",
                  model: "jina-v2"
                }
              }
            }
          }
        }
      }
    },
    "/QueryVectorStore": {
      post: {
        tags: ["category:vector-store"],
        summary: "QueryVectorStore",
        operationId: "QueryVectorStore",
        description: "Query a vector store for similar vectors.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QueryVectorStoreIn"
              },
              example: {
                collection_name: "smoke_tests",
                model: "jina-v2",
                query_strings: ["gas", "metal"],
                top_k: 1,
                include_metadata: true
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Query results.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QueryVectorStoreOut"
                },
                example: {
                  results: [
                    [
                      {
                        id: "483e75021c9d4ad69c3d78ace76da2ea",
                        distance: -0.78324556350708,
                        metadata: {
                          doc: "group: 18\n\nArgon is the third most abundant gas in Earth's atmosphere, at 0.934% (9340 ppmv). It is more than twice as abundant as water vapor.",
                          group: "18",
                          doc_id: "483e75021c9d4ad69c3d78ace76da2ea"
                        }
                      }
                    ],
                    [
                      {
                        id: "dd8f3774e05d42caa53cfbaa7389c08f",
                        distance: -0.74278724193573,
                        metadata: {
                          doc: "group: 8\n\nOsmium is the densest naturally occurring element. When experimentally measured using X-ray crystallography, it has a density of 22.59 g/cm3. Manufacturers use its alloys with platinum, iridium, and other platinum-group metals to make fountain pen nib tipping, electrical contacts, and in other applications that require extreme durability and hardness.",
                          group: "8",
                          doc_id: "dd8f3774e05d42caa53cfbaa7389c08f"
                        }
                      }
                    ]
                  ],
                  collection_name: "comments",
                  model: "jina-v2"
                }
              }
            }
          }
        }
      }
    },
    "/FetchVectors": {
      post: {
        tags: ["category:vector-store"],
        summary: "FetchVectors",
        operationId: "FetchVectors",
        description: "Fetch vectors from a vector store.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FetchVectorsIn"
              },
              example: {
                collection_name: "smoke_tests",
                model: "jina-v2",
                ids: ["dd8f3774e05d42caa53cfbaa7389c08f"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Vector data.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FetchVectorsOut"
                },
                example: {
                  vectors: [
                    {
                      id: "dd8f3774e05d42caa53cfbaa7389c08f",
                      vector: [0.036658343, -0.0066040196, 0.028221145],
                      metadata: {
                        doc: "group: 8\n\nOsmium is the densest naturally occurring element. When experimentally measured using X-ray crystallography, it has a density of 22.59 g/cm3. Manufacturers use its alloys with platinum, iridium, and other platinum-group metals to make fountain pen nib tipping, electrical contacts, and in other applications that require extreme durability and hardness.",
                        group: "8",
                        doc_id: "dd8f3774e05d42caa53cfbaa7389c08f"
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/UpdateVectors": {
      post: {
        tags: ["category:vector-store"],
        summary: "UpdateVectors",
        operationId: "UpdateVectors",
        description: "Update vectors in a vector store.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateVectorsIn"
              },
              example: {
                collection_name: "smoke_tests",
                model: "jina-v2",
                vectors: [
                  {
                    id: "dd8f3774e05d42caa53cfbaa7389c08f",
                    metadata: {
                      appearance: "silvery, blue cast"
                    }
                  }
                ]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Count of updated vectors.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateVectorsOut"
                },
                example: {
                  count: 1
                }
              }
            }
          }
        }
      }
    },
    "/DeleteVectors": {
      post: {
        tags: ["category:vector-store"],
        summary: "DeleteVectors",
        operationId: "DeleteVectors",
        description: "Delete vectors in a vector store.",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DeleteVectorsIn"
              },
              example: {
                collection_name: "smoke_tests",
                model: "jina-v2",
                ids: [
                  "ac32b9a133dd4e3689004f6e8f0fd6cd",
                  "629df177c7644062a68bceeff223cefa"
                ]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Count of deleted vectors.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DeleteVectorsOut"
                },
                example: {
                  count: 2
                }
              }
            }
          }
        }
      }
    }
  }
};

// src/SubstrateResponse.ts
var _SubstrateResponse = class _SubstrateResponse {
  constructor(request, response, json = null) {
    this.apiRequest = request;
    this.apiResponse = response;
    this.json = json;
  }
  get requestId() {
    return this.apiRequest.headers.get("x-substrate-request-id");
  }
  /**
   * Returns an error from the `Node` if there was one.
   */
  getError(node) {
    return node.output() instanceof NodeError ? node.output() : void 0;
  }
  /**
   * Returns the result for given `Node`.
   *
   *  @throws {NodeError} when there was an error running the node.
   */
  get(node) {
    const err = this.getError(node);
    if (err) throw err;
    return node.output();
  }
};
__name(_SubstrateResponse, "SubstrateResponse");
var SubstrateResponse = _SubstrateResponse;

// src/Platform.ts
var getPlatformProperties = /* @__PURE__ */ __name(() => {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return {
      os: normalizePlatform(Deno.build.os),
      arch: normalizeArch(Deno.build.arch),
      runtime: "deno",
      runtimeVersion: typeof Deno.version === "string" ? Deno.version : _nullishCoalesce(_optionalChain([Deno, 'access', _16 => _16.version, 'optionalAccess', _17 => _17.deno]), () => ( "unknown"))
    };
  }
  if (typeof EdgeRuntime !== "undefined") {
    return {
      os: "Unknown",
      arch: `other:${EdgeRuntime}`,
      runtime: "edge",
      runtimeVersion: process.version
    };
  }
  if (Object.prototype.toString.call(
    typeof process !== "undefined" ? process : 0
  ) === "[object process]") {
    return {
      os: normalizePlatform(process.platform),
      arch: normalizeArch(process.arch),
      runtime: "node",
      runtimeVersion: process.version
    };
  }
  if (typeof navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers") {
    return {
      os: "Unknown",
      arch: "unknown",
      runtime: "workerd",
      runtimeVersion: "unknown"
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      os: "Unknown",
      arch: "unknown",
      runtime: `browser:${browserInfo.browser}`,
      runtimeVersion: browserInfo.version
    };
  }
  return {
    os: "Unknown",
    arch: "unknown",
    runtime: "unknown",
    runtimeVersion: "unknown"
  };
}, "getPlatformProperties");
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    {
      key: "ie",
      pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "chrome",
      pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "firefox",
      pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
    },
    {
      key: "safari",
      pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
    }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec(navigator.userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
__name(getBrowserInfo, "getBrowserInfo");
var normalizeArch = /* @__PURE__ */ __name((arch) => {
  if (arch === "x32") return "x32";
  if (arch === "x86_64" || arch === "x64") return "x64";
  if (arch === "arm") return "arm";
  if (arch === "aarch64" || arch === "arm64") return "arm64";
  if (arch) return `other:${arch}`;
  return "unknown";
}, "normalizeArch");
var normalizePlatform = /* @__PURE__ */ __name((platform) => {
  platform = platform.toLowerCase();
  if (platform.includes("ios")) return "iOS";
  if (platform === "android") return "Android";
  if (platform === "darwin") return "MacOS";
  if (platform === "win32") return "Windows";
  if (platform === "freebsd") return "FreeBSD";
  if (platform === "openbsd") return "OpenBSD";
  if (platform === "linux") return "Linux";
  if (platform) return `Other:${platform}`;
  return "Unknown";
}, "normalizePlatform");

// src/Substrate.ts
var _pako = require('pako');
var _Substrate = class _Substrate {
  /**
   * Initialize the Substrate SDK.
   */
  constructor({
    apiKey,
    baseUrl,
    apiVersion,
    timeout,
    secrets,
    additionalHeaders
  }) {
    if (!apiKey) {
      console.warn(
        "[Substrate] An API Key is required. Specify it when constructing the client: `new Substrate({ apiKey: 'API_KEY' })`"
      );
    }
    this.apiKey = apiKey;
    this.baseUrl = _nullishCoalesce(baseUrl, () => ( "https://api.substrate.run"));
    this.apiVersion = _nullishCoalesce(apiVersion, () => ( openapi_default["info"]["version"]));
    this.timeout = _nullishCoalesce(timeout, () => ( 3e5));
    this.additionalHeaders = _nullishCoalesce(additionalHeaders, () => ( {}));
    if (secrets) {
      if (secrets.openai) {
        this.additionalHeaders["x-substrate-openai-api-key"] = secrets.openai;
      }
      if (secrets.anthropic) {
        this.additionalHeaders["x-substrate-anthropic-api-key"] = secrets.anthropic;
      }
    }
  }
  /**
   *  Run the given nodes.
   *
   *  @throws {SubstrateError} when the server response is an error.
   *  @throws {RequestTimeoutError} when the client has timed out (Configured by `Substrate.timeout`).
   *  @throws {Error} when the client encounters an error making the request.
   */
  async run(...nodes) {
    return this.runSerialized(nodes);
  }
  /**
   *  Stream the given nodes.
   */
  async stream(...nodes) {
    const serialized = _Substrate.serialize(...nodes);
    return this.streamSerialized(serialized);
  }
  /**
   *  Run the given nodes, serialized using `Substrate.serialize`.
   *
   *  @throws {SubstrateError} when the server response is an error.
   *  @throws {RequestTimeoutError} when the client has timed out (Configured by `Substrate.timeout`).
   *  @throws {Error} when the client encounters an error making the request.
   */
  async runSerialized(nodes, endpoint = "/compose") {
    const serialized = _Substrate.serialize(...nodes);
    const url = this.baseUrl + endpoint;
    const req = { dag: serialized };
    const abortController = new AbortController();
    const { signal } = abortController;
    const timeout = setTimeout(() => abortController.abort(), this.timeout);
    const request = new Request(url, this.requestOptions(req, signal));
    const requestId = request.headers.get("x-substrate-request-id");
    try {
      const apiResponse = await fetch(request);
      if (apiResponse.ok) {
        const json = await apiResponse.json();
        const res = new SubstrateResponse(request, apiResponse, json);
        for (let node of _Substrate.findAllNodes(nodes)) node.response = res;
        return res;
      } else {
        throw new SubstrateError(
          `[Request failed] status=${apiResponse.status} statusText=${apiResponse.statusText} requestId=${requestId}`
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new RequestTimeoutError(
            `Request timed out after ${this.timeout}ms requestId=${requestId}`
          );
        }
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
  /**
   *  Stream the given nodes, serialized using `Substrate.serialize`.
   */
  async streamSerialized(serialized, endpoint = "/compose") {
    const url = this.baseUrl + endpoint;
    const req = { dag: serialized };
    const abortController = new AbortController();
    const { signal } = abortController;
    const timeout = setTimeout(() => abortController.abort(), this.timeout);
    const requestOptions = this.requestOptions(req, signal);
    requestOptions.headers.set("Accept", "text/event-stream");
    requestOptions.headers.set("X-Substrate-Streaming", "1");
    const request = new Request(url, requestOptions);
    const requestId = request.headers.get("x-substrate-request-id");
    try {
      const response = await fetch(request);
      return await SubstrateStreamingResponse.fromRequestReponse(
        request,
        response
      );
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new RequestTimeoutError(
            `Request timed out after ${this.timeout}ms requestId=${requestId}`
          );
        }
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
  /**
   *  Return a set of all nodes and their dependent nodes.
   */
  static findAllNodes(fromNodes) {
    const allNodes = /* @__PURE__ */ new Set();
    for (let node of fromNodes) {
      const refs = node.references();
      for (let n of refs.nodes) {
        allNodes.add(n);
      }
    }
    return allNodes;
  }
  /**
   *  Return a set of all futures and their dependent futures.
   */
  static findAllFutures(fromNodes) {
    const allFutures = /* @__PURE__ */ new Set();
    for (let node of fromNodes) {
      const refs = node.references();
      for (let f of refs.futures) {
        allFutures.add(f);
      }
    }
    return allFutures;
  }
  /**
   *  Transform an array of nodes into JSON for the Substrate API
   */
  static serialize(...nodes) {
    const allFutures = this.findAllFutures(nodes);
    const allNodes = this.findAllNodes(nodes);
    const allEdges = {};
    for (let n of allNodes) {
      allEdges[n.id] = /* @__PURE__ */ new Set();
      for (let d of n.depends) {
        allEdges[n.id].add(d.id);
      }
    }
    return {
      nodes: Array.from(allNodes).map((node) => node.toJSON()),
      futures: Array.from(allFutures).map((future) => future.toJSON()),
      edges: Object.keys(allEdges).flatMap((toId) => {
        let fromIds = Array.from(allEdges[toId]);
        return fromIds.map((fromId) => [fromId, toId, {}]);
      }),
      initial_args: {}
      // @deprecated
    };
  }
  /**
   *  Returns a url to visualize the given nodes.
   */
  static visualize(...nodes) {
    const serialized = this.serialize(...nodes);
    const compressed = _pako.deflate.call(void 0, JSON.stringify(serialized), {
      level: 9
    });
    const numArray = Array.from(compressed);
    const base64 = btoa(String.fromCharCode.apply(null, numArray));
    const urlEncoded = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const baseURL = "https://explore.substrate.run/s/";
    return baseURL + urlEncoded;
  }
  requestOptions(body, signal) {
    return {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      signal
    };
  }
  headers() {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("User-Agent", `APIClient/JS ${VERSION}`);
    headers.append("X-Substrate-Version", this.apiVersion);
    headers.append("X-Substrate-Request-Id", randomString(32));
    headers.append("X-Substrate-Backend", "v1");
    headers.append("Authorization", `Bearer ${this.apiKey}`);
    headers.append("X-Substrate-Lang", "js");
    headers.append("X-Substrate-Package-Version", VERSION);
    const props = getPlatformProperties();
    headers.append("X-Substrate-OS", props.os);
    headers.append("X-Substrate-Arch", props.arch);
    headers.append("X-Substrate-Runtime", props.runtime);
    headers.append("X-Substrate-Runtime-Version", props.runtimeVersion);
    for (const [name, value] of Object.entries(this.additionalHeaders)) {
      headers.set(name, value);
    }
    return headers;
  }
};
__name(_Substrate, "Substrate");
var Substrate = _Substrate;

// src/index.ts
var src_default = Substrate;


















































exports.SubstrateError = SubstrateError; exports.Experimental = Experimental; exports.Box = Box; exports.If = If; exports.ComputeText = ComputeText; exports.MultiComputeText = MultiComputeText; exports.BatchComputeText = BatchComputeText; exports.BatchComputeJSON = BatchComputeJSON; exports.ComputeJSON = ComputeJSON; exports.MultiComputeJSON = MultiComputeJSON; exports.Mistral7BInstruct = Mistral7BInstruct; exports.Mixtral8x7BInstruct = Mixtral8x7BInstruct; exports.Llama3Instruct8B = Llama3Instruct8B; exports.Llama3Instruct70B = Llama3Instruct70B; exports.Firellava13B = Firellava13B; exports.GenerateImage = GenerateImage; exports.MultiGenerateImage = MultiGenerateImage; exports.InpaintImage = InpaintImage; exports.MultiInpaintImage = MultiInpaintImage; exports.StableDiffusionXLLightning = StableDiffusionXLLightning; exports.StableDiffusionXLInpaint = StableDiffusionXLInpaint; exports.StableDiffusionXLControlNet = StableDiffusionXLControlNet; exports.StableVideoDiffusion = StableVideoDiffusion; exports.InterpolateFrames = InterpolateFrames; exports.TranscribeSpeech = TranscribeSpeech; exports.GenerateSpeech = GenerateSpeech; exports.RemoveBackground = RemoveBackground; exports.EraseImage = EraseImage; exports.UpscaleImage = UpscaleImage; exports.SegmentUnderPoint = SegmentUnderPoint; exports.SegmentAnything = SegmentAnything; exports.SplitDocument = SplitDocument; exports.EmbedText = EmbedText; exports.MultiEmbedText = MultiEmbedText; exports.EmbedImage = EmbedImage; exports.MultiEmbedImage = MultiEmbedImage; exports.JinaV2 = JinaV2; exports.CLIP = CLIP; exports.FindOrCreateVectorStore = FindOrCreateVectorStore; exports.ListVectorStores = ListVectorStores; exports.DeleteVectorStore = DeleteVectorStore; exports.QueryVectorStore = QueryVectorStore; exports.FetchVectors = FetchVectors; exports.UpdateVectors = UpdateVectors; exports.DeleteVectors = DeleteVectors; exports.sb = sb; exports.Substrate = Substrate; exports.src_default = src_default;
//# sourceMappingURL=chunk-RXDQ7URZ.cjs.map