"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "distube",
      version: "5.0.2",
      description: "A powerful Discord.js module for simplifying music commands and effortless playback of various sources with integrated audio filters.",
      main: "./dist/index.js",
      types: "./dist/index.d.ts",
      exports: "./dist/index.js",
      directories: {
        lib: "src",
        test: "tests"
      },
      files: [
        "dist"
      ],
      scripts: {
        test: "VITE_CJS_IGNORE_WARNING=true vitest run",
        docs: "typedoc",
        lint: "prettier --check . && eslint .",
        "lint:fix": "eslint . --fix",
        prettier: 'prettier --write "**/*.{ts,json,yml,yaml,md}"',
        build: "tsup",
        type: "tsc --noEmit",
        update: 'pnpm up -L "!eslint"',
        prepare: "husky",
        prepublishOnly: "pnpm run lint && pnpm run test",
        prepack: "pnpm run build"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/skick1234/DisTube.git"
      },
      keywords: [
        "youtube",
        "music",
        "discord",
        "discordjs",
        "bot",
        "distube",
        "queue",
        "musicbot",
        "discord-music-bot",
        "music-bot",
        "discord-js"
      ],
      author: "Skick (https://github.com/skick1234)",
      license: "MIT",
      bugs: {
        url: "https://github.com/skick1234/DisTube/issues"
      },
      funding: "https://github.com/skick1234/DisTube?sponsor",
      homepage: "https://distube.js.org/",
      dependencies: {
        "tiny-typed-emitter": "^2.1.0",
        undici: "^6.18.2"
      },
      devDependencies: {
        "@commitlint/cli": "^19.3.0",
        "@commitlint/config-conventional": "^19.2.2",
        "@discordjs/voice": "^0.17.0",
        "@types/node": "^20.14.2",
        "@types/tough-cookie": "^4.0.5",
        "@typescript-eslint/eslint-plugin": "^7.13.0",
        "@typescript-eslint/parser": "^7.13.0",
        "@vitest/coverage-v8": "^1.6.0",
        "discord.js": "^14.15.3",
        eslint: "^8.57.0",
        "eslint-config-distube": "^1.7.0",
        husky: "^9.0.11",
        "nano-staged": "^0.8.0",
        prettier: "^3.3.2",
        "sodium-native": "^4.1.1",
        "ts-node": "^10.9.2",
        tsup: "^8.1.0",
        typedoc: "^0.25.13",
        "typedoc-material-theme": "^1.0.2",
        "typedoc-plugin-extras": "^3.0.0",
        typescript: "^5.4.5",
        "vite-tsconfig-paths": "^4.3.2",
        vitest: "^1.6.0"
      },
      peerDependencies: {
        "@discordjs/voice": "*",
        "discord.js": "14"
      },
      "nano-staged": {
        "*.ts": [
          "prettier --write",
          "eslint"
        ],
        "*.{json,yml,yaml,md}": [
          "prettier --write"
        ]
      },
      engines: {
        node: ">=18.17"
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BaseManager: () => BaseManager,
  DisTube: () => DisTube,
  DisTubeBase: () => DisTubeBase,
  DisTubeError: () => DisTubeError,
  DisTubeHandler: () => DisTubeHandler,
  DisTubeStream: () => DisTubeStream,
  DisTubeVoice: () => DisTubeVoice,
  DisTubeVoiceManager: () => DisTubeVoiceManager,
  Events: () => Events,
  ExtractorPlugin: () => ExtractorPlugin,
  FilterManager: () => FilterManager,
  GuildIdManager: () => GuildIdManager,
  InfoExtractorPlugin: () => InfoExtractorPlugin,
  Options: () => Options,
  PlayableExtractorPlugin: () => PlayableExtractorPlugin,
  Playlist: () => Playlist,
  Plugin: () => Plugin,
  PluginType: () => PluginType,
  Queue: () => Queue,
  QueueManager: () => QueueManager,
  RepeatMode: () => RepeatMode,
  Song: () => Song,
  TaskQueue: () => TaskQueue,
  checkFFmpeg: () => checkFFmpeg,
  checkIntents: () => checkIntents,
  checkInvalidKey: () => checkInvalidKey,
  default: () => DisTube,
  defaultFilters: () => defaultFilters,
  defaultOptions: () => defaultOptions,
  formatDuration: () => formatDuration,
  isClientInstance: () => isClientInstance,
  isGuildInstance: () => isGuildInstance,
  isMemberInstance: () => isMemberInstance,
  isMessageInstance: () => isMessageInstance,
  isNsfwChannel: () => isNsfwChannel,
  isObject: () => isObject,
  isSnowflake: () => isSnowflake,
  isSupportedVoiceChannel: () => isSupportedVoiceChannel,
  isTextChannelInstance: () => isTextChannelInstance,
  isTruthy: () => isTruthy,
  isURL: () => isURL,
  isVoiceChannelEmpty: () => isVoiceChannelEmpty,
  objectKeys: () => objectKeys,
  resolveGuildId: () => resolveGuildId,
  version: () => version
});
module.exports = __toCommonJS(src_exports);

// src/type.ts
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["ERROR"] = "error";
  Events2["ADD_LIST"] = "addList";
  Events2["ADD_SONG"] = "addSong";
  Events2["PLAY_SONG"] = "playSong";
  Events2["FINISH_SONG"] = "finishSong";
  Events2["EMPTY"] = "empty";
  Events2["FINISH"] = "finish";
  Events2["INIT_QUEUE"] = "initQueue";
  Events2["NO_RELATED"] = "noRelated";
  Events2["DISCONNECT"] = "disconnect";
  Events2["DELETE_QUEUE"] = "deleteQueue";
  Events2["FFMPEG_DEBUG"] = "ffmpegDebug";
  Events2["DEBUG"] = "debug";
  return Events2;
})(Events || {});
var RepeatMode = /* @__PURE__ */ ((RepeatMode2) => {
  RepeatMode2[RepeatMode2["DISABLED"] = 0] = "DISABLED";
  RepeatMode2[RepeatMode2["SONG"] = 1] = "SONG";
  RepeatMode2[RepeatMode2["QUEUE"] = 2] = "QUEUE";
  return RepeatMode2;
})(RepeatMode || {});
var PluginType = /* @__PURE__ */ ((PluginType2) => {
  PluginType2["EXTRACTOR"] = "extractor";
  PluginType2["INFO_EXTRACTOR"] = "info-extractor";
  PluginType2["PLAYABLE_EXTRACTOR"] = "playable-extractor";
  return PluginType2;
})(PluginType || {});

// src/constant.ts
var defaultFilters = {
  "3d": "apulsator=hz=0.125",
  bassboost: "bass=g=10",
  echo: "aecho=0.8:0.9:1000:0.3",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  karaoke: "stereotools=mlev=0.1",
  nightcore: "asetrate=48000*1.25,aresample=48000,bass=g=5",
  reverse: "areverse",
  vaporwave: "asetrate=48000*0.8,aresample=48000,atempo=1.1",
  mcompand: "mcompand",
  phaser: "aphaser",
  tremolo: "tremolo",
  surround: "surround",
  earwax: "earwax"
};
var defaultOptions = {
  plugins: [],
  emitNewSongOnly: false,
  savePreviousSongs: true,
  nsfw: false,
  emitAddSongWhenCreatingQueue: true,
  emitAddListWhenCreatingQueue: true,
  joinNewVoiceChannel: true
};

// src/struct/DisTubeError.ts
var import_node_util = require("util");
var ERROR_MESSAGES = {
  INVALID_TYPE: /* @__PURE__ */ __name((expected, got, name) => `Expected ${Array.isArray(expected) ? expected.map((e) => typeof e === "number" ? e : `'${e}'`).join(" or ") : `'${expected}'`}${name ? ` for '${name}'` : ""}, but got ${(0, import_node_util.inspect)(got)} (${typeof got})`, "INVALID_TYPE"),
  NUMBER_COMPARE: /* @__PURE__ */ __name((name, expected, value) => `'${name}' must be ${expected} ${value}`, "NUMBER_COMPARE"),
  EMPTY_ARRAY: /* @__PURE__ */ __name((name) => `'${name}' is an empty array`, "EMPTY_ARRAY"),
  EMPTY_FILTERED_ARRAY: /* @__PURE__ */ __name((name, type) => `There is no valid '${type}' in the '${name}' array`, "EMPTY_FILTERED_ARRAY"),
  EMPTY_STRING: /* @__PURE__ */ __name((name) => `'${name}' string must not be empty`, "EMPTY_STRING"),
  INVALID_KEY: /* @__PURE__ */ __name((obj, key) => `'${key}' does not need to be provided in ${obj}`, "INVALID_KEY"),
  MISSING_KEY: /* @__PURE__ */ __name((obj, key) => `'${key}' needs to be provided in ${obj}`, "MISSING_KEY"),
  MISSING_KEYS: /* @__PURE__ */ __name((obj, key, all) => `${key.map((k) => `'${k}'`).join(all ? " and " : " or ")} need to be provided in ${obj}`, "MISSING_KEYS"),
  MISSING_INTENTS: /* @__PURE__ */ __name((i) => `${i} intent must be provided for the Client`, "MISSING_INTENTS"),
  DISABLED_OPTION: /* @__PURE__ */ __name((o) => `DisTubeOptions.${o} is disabled`, "DISABLED_OPTION"),
  ENABLED_OPTION: /* @__PURE__ */ __name((o) => `DisTubeOptions.${o} is enabled`, "ENABLED_OPTION"),
  NOT_IN_VOICE: "User is not in any voice channel",
  VOICE_FULL: "The voice channel is full",
  VOICE_ALREADY_CREATED: "This guild already has a voice connection which is not managed by DisTube",
  VOICE_CONNECT_FAILED: /* @__PURE__ */ __name((s) => `Cannot connect to the voice channel after ${s} seconds`, "VOICE_CONNECT_FAILED"),
  VOICE_MISSING_PERMS: "I do not have permission to join this voice channel",
  VOICE_RECONNECT_FAILED: "Cannot reconnect to the voice channel",
  VOICE_DIFFERENT_GUILD: "Cannot join a voice channel in a different guild",
  VOICE_DIFFERENT_CLIENT: "Cannot join a voice channel created by a different client",
  FFMPEG_EXITED: /* @__PURE__ */ __name((code) => `ffmpeg exited with code ${code}`, "FFMPEG_EXITED"),
  FFMPEG_NOT_INSTALLED: /* @__PURE__ */ __name((path) => `ffmpeg is not installed at '${path}' path`, "FFMPEG_NOT_INSTALLED"),
  NO_QUEUE: "There is no playing queue in this guild",
  QUEUE_EXIST: "This guild has a Queue already",
  QUEUE_STOPPED: "The queue has been stopped already",
  PAUSED: "The queue has been paused already",
  RESUMED: "The queue has been playing already",
  NO_PREVIOUS: "There is no previous song in this queue",
  NO_UP_NEXT: "There is no up next song",
  NO_SONG_POSITION: "Does not have any song at this position",
  NO_PLAYING_SONG: "There is no playing song in the queue",
  NO_RELATED: "Cannot find any related songs",
  CANNOT_PLAY_RELATED: "Cannot play the related song",
  UNAVAILABLE_VIDEO: "This video is unavailable",
  UNPLAYABLE_FORMATS: "No playable format found",
  NON_NSFW: "Cannot play age-restricted content in non-NSFW channel",
  NOT_SUPPORTED_URL: "This url is not supported",
  NOT_SUPPORTED_SONG: /* @__PURE__ */ __name((song) => `There is no plugin supporting this song (${song})`, "NOT_SUPPORTED_SONG"),
  NO_VALID_SONG: "'songs' array does not have any valid Song or url",
  CANNOT_RESOLVE_SONG: /* @__PURE__ */ __name((t) => `Cannot resolve ${(0, import_node_util.inspect)(t)} to a Song`, "CANNOT_RESOLVE_SONG"),
  CANNOT_GET_STREAM_URL: /* @__PURE__ */ __name((song) => `Cannot get stream url from this song (${song})`, "CANNOT_GET_STREAM_URL"),
  CANNOT_GET_SEARCH_QUERY: /* @__PURE__ */ __name((song) => `Cannot get search query from this song (${song})`, "CANNOT_GET_SEARCH_QUERY"),
  NO_RESULT: /* @__PURE__ */ __name((query) => `Cannot get song stream from this query (${query})`, "NO_RESULT"),
  NO_STREAM_URL: /* @__PURE__ */ __name((song) => `No stream url attached (${song})`, "NO_STREAM_URL"),
  EMPTY_FILTERED_PLAYLIST: "There is no valid video in the playlist\nMaybe age-restricted contents is filtered because you are in non-NSFW channel",
  EMPTY_PLAYLIST: "There is no valid video in the playlist"
};
var haveCode = /* @__PURE__ */ __name((code) => Object.keys(ERROR_MESSAGES).includes(code), "haveCode");
var parseMessage = /* @__PURE__ */ __name((m, ...args) => typeof m === "string" ? m : m(...args), "parseMessage");
var getErrorMessage = /* @__PURE__ */ __name((code, ...args) => haveCode(code) ? parseMessage(ERROR_MESSAGES[code], ...args) : args[0], "getErrorMessage");
var _DisTubeError = class _DisTubeError extends Error {
  constructor(code, ...args) {
    super(getErrorMessage(code, ...args));
    __publicField(this, "errorCode");
    this.errorCode = code;
    if (Error.captureStackTrace) Error.captureStackTrace(this, _DisTubeError);
  }
  get name() {
    return `DisTubeError [${this.errorCode}]`;
  }
  get code() {
    return this.errorCode;
  }
};
__name(_DisTubeError, "DisTubeError");
var DisTubeError = _DisTubeError;

// src/struct/TaskQueue.ts
var _Task = class _Task {
  constructor() {
    __publicField(this, "resolve");
    __publicField(this, "promise");
    this.promise = new Promise((res) => {
      this.resolve = res;
    });
  }
};
__name(_Task, "Task");
var Task = _Task;
var _tasks;
var _TaskQueue = class _TaskQueue {
  constructor() {
    /**
     * The task array
     */
    __privateAdd(this, _tasks, []);
  }
  /**
   * Waits for last task finished and queues a new task
   */
  queuing() {
    const next = this.remaining ? __privateGet(this, _tasks)[__privateGet(this, _tasks).length - 1].promise : Promise.resolve();
    __privateGet(this, _tasks).push(new Task());
    return next;
  }
  /**
   * Removes the finished task and processes the next task
   */
  resolve() {
    __privateGet(this, _tasks).shift()?.resolve();
  }
  /**
   * The remaining number of tasks
   */
  get remaining() {
    return __privateGet(this, _tasks).length;
  }
};
_tasks = new WeakMap();
__name(_TaskQueue, "TaskQueue");
var TaskQueue = _TaskQueue;

// src/struct/Playlist.ts
var _metadata, _member;
var _Playlist = class _Playlist {
  /**
   * Create a Playlist
   * @param playlist  - Raw playlist info
   * @param options   - Optional data
   */
  constructor(playlist, { member, metadata } = {}) {
    /**
     * Playlist source.
     */
    __publicField(this, "source");
    /**
     * Songs in the playlist.
     */
    __publicField(this, "songs");
    /**
     * Playlist ID.
     */
    __publicField(this, "id");
    /**
     * Playlist name.
     */
    __publicField(this, "name");
    /**
     * Playlist URL.
     */
    __publicField(this, "url");
    /**
     * Playlist thumbnail.
     */
    __publicField(this, "thumbnail");
    __privateAdd(this, _metadata);
    __privateAdd(this, _member);
    if (!Array.isArray(playlist.songs) || !playlist.songs.length) throw new DisTubeError("EMPTY_PLAYLIST");
    this.source = playlist.source.toLowerCase();
    this.songs = playlist.songs;
    this.name = playlist.name;
    this.id = playlist.id;
    this.url = playlist.url;
    this.thumbnail = playlist.thumbnail;
    this.member = member;
    this.songs.forEach((s) => s.playlist = this);
    this.metadata = metadata;
  }
  /**
   * Playlist duration in second.
   */
  get duration() {
    return this.songs.reduce((prev, next) => prev + next.duration, 0);
  }
  /**
   * Formatted duration string `hh:mm:ss`.
   */
  get formattedDuration() {
    return formatDuration(this.duration);
  }
  /**
   * User requested.
   */
  get member() {
    return __privateGet(this, _member);
  }
  set member(member) {
    if (!isMemberInstance(member)) return;
    __privateSet(this, _member, member);
    this.songs.forEach((s) => s.member = this.member);
  }
  /**
   * User requested.
   */
  get user() {
    return this.member?.user;
  }
  /**
   * Optional metadata that can be used to identify the playlist.
   */
  get metadata() {
    return __privateGet(this, _metadata);
  }
  set metadata(metadata) {
    __privateSet(this, _metadata, metadata);
    this.songs.forEach((s) => s.metadata = metadata);
  }
  toString() {
    return `${this.name} (${this.songs.length} songs)`;
  }
};
_metadata = new WeakMap();
_member = new WeakMap();
__name(_Playlist, "Playlist");
var Playlist = _Playlist;

// src/struct/Song.ts
var _metadata2, _member2, _playlist;
var _Song = class _Song {
  /**
   * Create a Song
   *
   * @param info      - Raw song info
   * @param options   - Optional data
   */
  constructor(info, { member, metadata } = {}) {
    /**
     * The source of this song info
     */
    __publicField(this, "source");
    /**
     * Song ID.
     */
    __publicField(this, "id");
    /**
     * Song name.
     */
    __publicField(this, "name");
    /**
     * Indicates if the song is an active live.
     */
    __publicField(this, "isLive");
    /**
     * Song duration.
     */
    __publicField(this, "duration");
    /**
     * Formatted duration string (`hh:mm:ss`, `mm:ss` or `Live`).
     */
    __publicField(this, "formattedDuration");
    /**
     * Song URL.
     */
    __publicField(this, "url");
    /**
     * Song thumbnail.
     */
    __publicField(this, "thumbnail");
    /**
     * Song view count
     */
    __publicField(this, "views");
    /**
     * Song like count
     */
    __publicField(this, "likes");
    /**
     * Song dislike count
     */
    __publicField(this, "dislikes");
    /**
     * Song repost (share) count
     */
    __publicField(this, "reposts");
    /**
     * Song uploader
     */
    __publicField(this, "uploader");
    /**
     * Whether or not an age-restricted content
     */
    __publicField(this, "ageRestricted");
    /**
     * Stream info
     */
    __publicField(this, "stream");
    /**
     * The plugin that created this song
     */
    __publicField(this, "plugin");
    __privateAdd(this, _metadata2);
    __privateAdd(this, _member2);
    __privateAdd(this, _playlist);
    this.source = info.source.toLowerCase();
    this.metadata = metadata;
    this.member = member;
    this.id = info.id;
    this.name = info.name;
    this.isLive = info.isLive;
    this.duration = this.isLive || !info.duration ? 0 : info.duration;
    this.formattedDuration = this.isLive ? "Live" : formatDuration(this.duration);
    this.url = info.url;
    this.thumbnail = info.thumbnail;
    this.views = info.views;
    this.likes = info.likes;
    this.dislikes = info.dislikes;
    this.reposts = info.reposts;
    this.uploader = {
      name: info.uploader?.name,
      url: info.uploader?.url
    };
    this.ageRestricted = info.ageRestricted;
    this.stream = { playFromSource: info.playFromSource };
    this.plugin = info.plugin;
  }
  /**
   * The playlist this song belongs to
   */
  get playlist() {
    return __privateGet(this, _playlist);
  }
  set playlist(playlist) {
    if (!(playlist instanceof Playlist)) throw new DisTubeError("INVALID_TYPE", "Playlist", playlist, "Song#playlist");
    __privateSet(this, _playlist, playlist);
    this.member = playlist.member;
  }
  /**
   * User requested to play this song.
   */
  get member() {
    return __privateGet(this, _member2);
  }
  set member(member) {
    if (isMemberInstance(member)) __privateSet(this, _member2, member);
  }
  /**
   * User requested to play this song.
   */
  get user() {
    return this.member?.user;
  }
  /**
   * Optional metadata that can be used to identify the song. This is attached by the
   * {@link DisTube#play} method.
   */
  get metadata() {
    return __privateGet(this, _metadata2);
  }
  set metadata(metadata) {
    __privateSet(this, _metadata2, metadata);
  }
  toString() {
    return this.name || this.url || this.id || "Unknown";
  }
};
_metadata2 = new WeakMap();
_member2 = new WeakMap();
_playlist = new WeakMap();
__name(_Song, "Song");
var Song = _Song;

// src/core/DisTubeBase.ts
var _DisTubeBase = class _DisTubeBase {
  constructor(distube) {
    __publicField(this, "distube");
    this.distube = distube;
  }
  /**
   * Emit the {@link DisTube} of this base
   * @param eventName - Event name
   * @param args      - arguments
   */
  emit(eventName, ...args) {
    return this.distube.emit(eventName, ...args);
  }
  /**
   * Emit error event
   * @param error   - error
   * @param queue   - The queue encountered the error
   * @param song    - The playing song when encountered the error
   */
  emitError(error, queue, song) {
    this.distube.emitError(error, queue, song);
  }
  /**
   * Emit debug event
   * @param message - debug message
   */
  debug(message) {
    this.distube.debug(message);
  }
  /**
   * The queue manager
   */
  get queues() {
    return this.distube.queues;
  }
  /**
   * The voice manager
   */
  get voices() {
    return this.distube.voices;
  }
  /**
   * Discord.js client
   */
  get client() {
    return this.distube.client;
  }
  /**
   * DisTube options
   */
  get options() {
    return this.distube.options;
  }
  /**
   * DisTube handler
   */
  get handler() {
    return this.distube.handler;
  }
  /**
   * DisTube plugins
   */
  get plugins() {
    return this.distube.plugins;
  }
};
__name(_DisTubeBase, "DisTubeBase");
var DisTubeBase = _DisTubeBase;

// src/core/DisTubeVoice.ts
var import_discord = require("discord.js");
var import_tiny_typed_emitter = require("tiny-typed-emitter");
var import_voice = require("@discordjs/voice");
var _channel, _volume, _DisTubeVoice_instances, join_fn;
var _DisTubeVoice = class _DisTubeVoice extends import_tiny_typed_emitter.TypedEmitter {
  constructor(voiceManager, channel) {
    super();
    __privateAdd(this, _DisTubeVoice_instances);
    __publicField(this, "id");
    __publicField(this, "voices");
    __publicField(this, "audioPlayer");
    __publicField(this, "connection");
    __publicField(this, "emittedError");
    __publicField(this, "isDisconnected", false);
    __publicField(this, "stream");
    __privateAdd(this, _channel);
    __privateAdd(this, _volume, 100);
    this.voices = voiceManager;
    this.id = channel.guildId;
    this.channel = channel;
    this.voices.add(this.id, this);
    this.audioPlayer = (0, import_voice.createAudioPlayer)().on(import_voice.AudioPlayerStatus.Idle, (oldState) => {
      if (oldState.status !== import_voice.AudioPlayerStatus.Idle) this.emit("finish");
    }).on("error", (error) => {
      if (this.emittedError) return;
      this.emittedError = true;
      this.emit("error", error);
    });
    this.connection.on(import_voice.VoiceConnectionStatus.Disconnected, (_, newState) => {
      if (newState.reason === import_voice.VoiceConnectionDisconnectReason.Manual) {
        this.leave();
      } else if (newState.reason === import_voice.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
        (0, import_voice.entersState)(this.connection, import_voice.VoiceConnectionStatus.Connecting, 5e3).catch(() => {
          if (![import_voice.VoiceConnectionStatus.Ready, import_voice.VoiceConnectionStatus.Connecting].includes(this.connection.state.status)) {
            this.leave();
          }
        });
      } else if (this.connection.rejoinAttempts < 5) {
        setTimeout(
          () => {
            this.connection.rejoin();
          },
          (this.connection.rejoinAttempts + 1) * 5e3
        ).unref();
      } else if (this.connection.state.status !== import_voice.VoiceConnectionStatus.Destroyed) {
        this.leave(new DisTubeError("VOICE_RECONNECT_FAILED"));
      }
    }).on(import_voice.VoiceConnectionStatus.Destroyed, () => {
      this.leave();
    }).on("error", () => void 0);
    this.connection.subscribe(this.audioPlayer);
  }
  /**
   * The voice channel id the bot is in
   */
  get channelId() {
    return this.connection?.joinConfig?.channelId ?? void 0;
  }
  get channel() {
    if (!this.channelId) return __privateGet(this, _channel);
    if (__privateGet(this, _channel)?.id === this.channelId) return __privateGet(this, _channel);
    const channel = this.voices.client.channels.cache.get(this.channelId);
    if (!channel) return __privateGet(this, _channel);
    for (const type of import_discord.Constants.VoiceBasedChannelTypes) {
      if (channel.type === type) {
        __privateSet(this, _channel, channel);
        return channel;
      }
    }
    return __privateGet(this, _channel);
  }
  set channel(channel) {
    if (!isSupportedVoiceChannel(channel)) {
      throw new DisTubeError("INVALID_TYPE", "BaseGuildVoiceChannel", channel, "DisTubeVoice#channel");
    }
    if (channel.guildId !== this.id) throw new DisTubeError("VOICE_DIFFERENT_GUILD");
    if (channel.client.user?.id !== this.voices.client.user?.id) throw new DisTubeError("VOICE_DIFFERENT_CLIENT");
    if (channel.id === this.channelId) return;
    if (!channel.joinable) {
      if (channel.full) throw new DisTubeError("VOICE_FULL");
      else throw new DisTubeError("VOICE_MISSING_PERMS");
    }
    this.connection = __privateMethod(this, _DisTubeVoice_instances, join_fn).call(this, channel);
    __privateSet(this, _channel, channel);
  }
  /**
   * Join a voice channel with this connection
   * @param channel - A voice channel
   */
  async join(channel) {
    const TIMEOUT = 3e4;
    if (channel) this.channel = channel;
    try {
      await (0, import_voice.entersState)(this.connection, import_voice.VoiceConnectionStatus.Ready, TIMEOUT);
    } catch {
      if (this.connection.state.status === import_voice.VoiceConnectionStatus.Ready) return this;
      if (this.connection.state.status !== import_voice.VoiceConnectionStatus.Destroyed) this.connection.destroy();
      this.voices.remove(this.id);
      throw new DisTubeError("VOICE_CONNECT_FAILED", TIMEOUT / 1e3);
    }
    return this;
  }
  /**
   * Leave the voice channel of this connection
   * @param error - Optional, an error to emit with 'error' event.
   */
  leave(error) {
    this.stop(true);
    if (!this.isDisconnected) {
      this.emit("disconnect", error);
      this.isDisconnected = true;
    }
    if (this.connection.state.status !== import_voice.VoiceConnectionStatus.Destroyed) this.connection.destroy();
    this.voices.remove(this.id);
  }
  /**
   * Stop the playing stream
   * @param force - If true, will force the {@link DisTubeVoice#audioPlayer} to enter the Idle state even
   *                if the {@link DisTubeStream#audioResource} has silence padding frames.
   */
  stop(force = false) {
    this.audioPlayer.stop(force);
  }
  /**
   * Play a {@link DisTubeStream}
   * @param dtStream - DisTubeStream
   */
  play(dtStream) {
    this.emittedError = false;
    dtStream.on("error", (error) => {
      if (this.emittedError || error.code === "ERR_STREAM_PREMATURE_CLOSE") return;
      this.emittedError = true;
      this.emit("error", error);
    });
    if (this.audioPlayer.state.status !== import_voice.AudioPlayerStatus.Paused) this.audioPlayer.play(dtStream.audioResource);
    this.stream?.kill();
    this.stream = dtStream;
    this.volume = __privateGet(this, _volume);
    dtStream.spawn();
  }
  set volume(volume) {
    if (typeof volume !== "number" || isNaN(volume)) {
      throw new DisTubeError("INVALID_TYPE", "number", volume, "volume");
    }
    if (volume < 0) {
      throw new DisTubeError("NUMBER_COMPARE", "Volume", "bigger or equal to", 0);
    }
    __privateSet(this, _volume, volume);
    this.stream?.setVolume(Math.pow(__privateGet(this, _volume) / 100, 0.5 / Math.log10(2)));
  }
  /**
   * Get or set the volume percentage
   */
  get volume() {
    return __privateGet(this, _volume);
  }
  /**
   * Playback duration of the audio resource in seconds
   */
  get playbackDuration() {
    return (this.stream?.audioResource?.playbackDuration ?? 0) / 1e3;
  }
  pause() {
    this.audioPlayer.pause();
  }
  unpause() {
    const state = this.audioPlayer.state;
    if (state.status !== import_voice.AudioPlayerStatus.Paused) return;
    if (this.stream?.audioResource && state.resource !== this.stream.audioResource) {
      this.audioPlayer.play(this.stream.audioResource);
    } else {
      this.audioPlayer.unpause();
    }
  }
  /**
   * Whether the bot is self-deafened
   */
  get selfDeaf() {
    return this.connection.joinConfig.selfDeaf;
  }
  /**
   * Whether the bot is self-muted
   */
  get selfMute() {
    return this.connection.joinConfig.selfMute;
  }
  /**
   * Self-deafens/undeafens the bot.
   * @param selfDeaf - Whether or not the bot should be self-deafened
   * @returns true if the voice state was successfully updated, otherwise false
   */
  setSelfDeaf(selfDeaf) {
    if (typeof selfDeaf !== "boolean") {
      throw new DisTubeError("INVALID_TYPE", "boolean", selfDeaf, "selfDeaf");
    }
    return this.connection.rejoin({
      ...this.connection.joinConfig,
      selfDeaf
    });
  }
  /**
   * Self-mutes/unmutes the bot.
   * @param selfMute - Whether or not the bot should be self-muted
   * @returns true if the voice state was successfully updated, otherwise false
   */
  setSelfMute(selfMute) {
    if (typeof selfMute !== "boolean") {
      throw new DisTubeError("INVALID_TYPE", "boolean", selfMute, "selfMute");
    }
    return this.connection.rejoin({
      ...this.connection.joinConfig,
      selfMute
    });
  }
  /**
   * The voice state of this connection
   */
  get voiceState() {
    return this.channel?.guild?.members?.me?.voice;
  }
};
_channel = new WeakMap();
_volume = new WeakMap();
_DisTubeVoice_instances = new WeakSet();
join_fn = /* @__PURE__ */ __name(function(channel) {
  return (0, import_voice.joinVoiceChannel)({
    channelId: channel.id,
    guildId: this.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    group: channel.client.user?.id
  });
}, "#join");
__name(_DisTubeVoice, "DisTubeVoice");
var DisTubeVoice = _DisTubeVoice;

// src/core/DisTubeStream.ts
var import_stream = require("stream");
var import_child_process = require("child_process");
var import_tiny_typed_emitter2 = require("tiny-typed-emitter");
var import_voice2 = require("@discordjs/voice");
var checked = process.env.NODE_ENV === "test";
var checkFFmpeg = /* @__PURE__ */ __name((distube) => {
  if (checked) return;
  const path = distube.options.ffmpeg.path;
  const debug = /* @__PURE__ */ __name((str) => distube.emit("ffmpegDebug" /* FFMPEG_DEBUG */, str), "debug");
  try {
    debug(`[test] spawn ffmpeg at '${path}' path`);
    const process2 = (0, import_child_process.spawnSync)(path, ["-h"], { windowsHide: true, shell: true, encoding: "utf-8" });
    if (process2.error) throw process2.error;
    if (process2.stderr && !process2.stdout) throw new Error(process2.stderr);
    const result = process2.output.join("\n");
    const version2 = /ffmpeg version (\S+)/iu.exec(result)?.[1];
    if (!version2) throw new Error("Invalid FFmpeg version");
    debug(`[test] ffmpeg version: ${version2}`);
  } catch (e) {
    debug(`[test] failed to spawn ffmpeg at '${path}': ${e?.stack ?? e}`);
    throw new DisTubeError("FFMPEG_NOT_INSTALLED", path);
  }
  checked = true;
}, "checkFFmpeg");
var _ffmpegPath, _opts;
var _DisTubeStream = class _DisTubeStream extends import_tiny_typed_emitter2.TypedEmitter {
  /**
   * Create a DisTubeStream to play with {@link DisTubeVoice}
   * @param url     - Stream URL
   * @param options - Stream options
   */
  constructor(url, options) {
    super();
    __privateAdd(this, _ffmpegPath);
    __privateAdd(this, _opts);
    __publicField(this, "process");
    __publicField(this, "stream");
    __publicField(this, "audioResource");
    const { ffmpeg, seek } = options;
    const opts = {
      reconnect: 1,
      reconnect_streamed: 1,
      reconnect_delay_max: 5,
      analyzeduration: 0,
      hide_banner: true,
      ...ffmpeg.args.global,
      ...ffmpeg.args.input,
      i: url,
      ar: 48e3,
      ac: 2,
      ...ffmpeg.args.output,
      f: "s16le"
    };
    if (typeof seek === "number" && seek > 0) opts.ss = seek.toString();
    const fileUrl = new URL(url);
    if (fileUrl.protocol === "file:") {
      opts.reconnect = null;
      opts.reconnect_streamed = null;
      opts.reconnect_delay_max = null;
      opts.i = fileUrl.hostname + fileUrl.pathname;
    }
    __privateSet(this, _ffmpegPath, ffmpeg.path);
    __privateSet(this, _opts, [
      ...Object.entries(opts).flatMap(
        ([key, value]) => Array.isArray(value) ? value.filter(Boolean).map((v) => [`-${key}`, String(v)]) : value == null || value === false ? [] : [value === true ? `-${key}` : [`-${key}`, String(value)]]
      ).flat(),
      "pipe:1"
    ]);
    this.stream = new VolumeTransformer();
    this.stream.on("close", () => this.kill()).on("error", (err) => {
      this.debug(`[stream] error: ${err.message}`);
      this.emit("error", err);
    }).on("finish", () => this.debug("[stream] log: stream finished"));
    this.audioResource = (0, import_voice2.createAudioResource)(this.stream, { inputType: import_voice2.StreamType.Raw, inlineVolume: false });
  }
  spawn() {
    this.debug(`[process] spawn: ${__privateGet(this, _ffmpegPath)} ${__privateGet(this, _opts).join(" ")}`);
    this.process = (0, import_child_process.spawn)(__privateGet(this, _ffmpegPath), __privateGet(this, _opts), {
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
      windowsHide: true
    }).on("error", (err) => {
      this.debug(`[process] error: ${err.message}`);
      this.emit("error", err);
    }).on("exit", (code, signal) => {
      this.debug(`[process] exit: code=${code ?? "unknown"} signal=${signal ?? "unknown"}`);
      if (!code || [0, 255].includes(code)) return;
      this.debug(`[process] error: ffmpeg exited with code ${code}`);
      this.emit("error", new DisTubeError("FFMPEG_EXITED", code));
    });
    if (!this.process.stdout || !this.process.stderr) {
      this.kill();
      throw new Error("Failed to create ffmpeg process");
    }
    this.process.stdout.pipe(this.stream);
    this.process.stderr.setEncoding("utf8")?.on("data", (data) => {
      const lines = data.split(/\r\n|\r|\n/u);
      for (const line of lines) {
        if (/^\s*$/.test(line)) continue;
        this.debug(`[ffmpeg] log: ${line}`);
      }
    });
  }
  debug(debug) {
    this.emit("debug", debug);
  }
  setVolume(volume) {
    this.stream.vol = volume;
  }
  kill() {
    if (!this.stream.destroyed) this.stream.destroy();
    if (this.process && !this.process.killed) this.process.kill("SIGKILL");
  }
};
_ffmpegPath = new WeakMap();
_opts = new WeakMap();
__name(_DisTubeStream, "DisTubeStream");
var DisTubeStream = _DisTubeStream;
var _VolumeTransformer = class _VolumeTransformer extends import_stream.Transform {
  constructor() {
    super(...arguments);
    __publicField(this, "buffer", Buffer.allocUnsafe(0));
    __publicField(this, "extrema", [-Math.pow(2, 16 - 1), Math.pow(2, 16 - 1) - 1]);
    __publicField(this, "vol", 1);
  }
  _transform(newChunk, _encoding, done) {
    const { vol } = this;
    if (vol === 1) {
      this.push(newChunk);
      done();
      return;
    }
    const bytes = 2;
    const chunk = Buffer.concat([this.buffer, newChunk]);
    const readableLength = Math.floor(chunk.length / bytes) * bytes;
    for (let i = 0; i < readableLength; i += bytes) {
      const value = chunk.readInt16LE(i);
      const clampedValue = Math.min(this.extrema[1], Math.max(this.extrema[0], value * vol));
      chunk.writeInt16LE(clampedValue, i);
    }
    this.buffer = chunk.subarray(readableLength);
    this.push(chunk.subarray(0, readableLength));
    done();
  }
};
__name(_VolumeTransformer, "VolumeTransformer");
var VolumeTransformer = _VolumeTransformer;

// src/core/DisTubeHandler.ts
var import_undici = require("undici");
var REDIRECT_CODES = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var _DisTubeHandler_instances, searchSong_fn;
var _DisTubeHandler = class _DisTubeHandler extends DisTubeBase {
  constructor() {
    super(...arguments);
    __privateAdd(this, _DisTubeHandler_instances);
  }
  /**
   * Resolve a url or a supported object to a {@link Song} or {@link Playlist}
   * @throws {@link DisTubeError}
   * @param input   - Resolvable input
   * @param options - Optional options
   * @returns Resolved
   */
  async resolve(input, options = {}) {
    if (input instanceof Song || input instanceof Playlist) {
      if ("metadata" in options) input.metadata = options.metadata;
      if ("member" in options) input.member = options.member;
      return input;
    }
    if (typeof input === "string") {
      if (isURL(input)) {
        const plugin = await this._getPluginFromURL(input) || await this._getPluginFromURL(await this.followRedirectLink(input));
        if (!plugin) throw new DisTubeError("NOT_SUPPORTED_URL");
        this.debug(`[${plugin.constructor.name}] Resolving from url: ${input}`);
        return plugin.resolve(input, options);
      }
      try {
        const song = await __privateMethod(this, _DisTubeHandler_instances, searchSong_fn).call(this, input, options);
        if (song) return song;
      } catch {
      }
    }
    throw new DisTubeError("CANNOT_RESOLVE_SONG", input);
  }
  async _getPluginFromURL(url) {
    for (const plugin of this.plugins) if (await plugin.validate(url)) return plugin;
    return null;
  }
  async _getPluginFromSong(song, types, validate = true) {
    if (!types || types.includes(song.plugin?.type)) return song.plugin;
    if (!song.url) return null;
    for (const plugin of this.plugins) {
      if ((!types || types.includes(plugin?.type)) && (!validate || await plugin.validate(song.url))) {
        return plugin;
      }
    }
    return null;
  }
  /**
   * Get {@link Song}'s stream info and attach it to the song.
   * @param song - A Song
   */
  async attachStreamInfo(song) {
    if (song.stream.playFromSource) {
      if (song.stream.url) return;
      this.debug(`[DisTubeHandler] Getting stream info: ${song}`);
      const plugin = await this._getPluginFromSong(song, ["extractor" /* EXTRACTOR */, "playable-extractor" /* PLAYABLE_EXTRACTOR */]);
      if (!plugin) throw new DisTubeError("NOT_SUPPORTED_SONG", song.toString());
      this.debug(`[${plugin.constructor.name}] Getting stream URL: ${song}`);
      song.stream.url = await plugin.getStreamURL(song);
      if (!song.stream.url) throw new DisTubeError("CANNOT_GET_STREAM_URL", song.toString());
    } else {
      if (song.stream.song?.stream?.playFromSource && song.stream.song.stream.url) return;
      this.debug(`[DisTubeHandler] Getting stream info: ${song}`);
      const plugin = await this._getPluginFromSong(song, ["info-extractor" /* INFO_EXTRACTOR */]);
      if (!plugin) throw new DisTubeError("NOT_SUPPORTED_SONG", song.toString());
      this.debug(`[${plugin.constructor.name}] Creating search query for: ${song}`);
      const query = await plugin.createSearchQuery(song);
      if (!query) throw new DisTubeError("CANNOT_GET_SEARCH_QUERY", song.toString());
      const altSong = await __privateMethod(this, _DisTubeHandler_instances, searchSong_fn).call(this, query, { metadata: song.metadata, member: song.member }, true);
      if (!altSong || !altSong.stream.playFromSource) throw new DisTubeError("NO_RESULT", query || song.toString());
      song.stream.song = altSong;
    }
  }
  async followRedirectLink(url, maxRedirect = 5) {
    if (maxRedirect === 0) return url;
    const res = await (0, import_undici.request)(url, {
      method: "HEAD",
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
      }
    });
    if (REDIRECT_CODES.has(res.statusCode ?? 200)) {
      let location = res.headers.location;
      if (typeof location !== "string") location = location?.[0] ?? url;
      return this.followRedirectLink(location, --maxRedirect);
    }
    return url;
  }
};
_DisTubeHandler_instances = new WeakSet();
searchSong_fn = /* @__PURE__ */ __name(async function(query, options = {}, getStreamURL = false) {
  for (const plugin of this.plugins) {
    if (plugin.type === "extractor" /* EXTRACTOR */) {
      this.debug(`[${plugin.constructor.name}] Searching for song: ${query}`);
      const result = await plugin.searchSong(query, options);
      if (result) {
        if (getStreamURL && result.stream.playFromSource) result.stream.url = await plugin.getStreamURL(result);
        return result;
      }
    }
  }
  return null;
}, "#searchSong");
__name(_DisTubeHandler, "DisTubeHandler");
var DisTubeHandler = _DisTubeHandler;

// src/core/DisTubeOptions.ts
var _Options_instances, validateOptions_fn, ffmpegOption_fn;
var _Options = class _Options {
  constructor(options) {
    __privateAdd(this, _Options_instances);
    __publicField(this, "plugins");
    __publicField(this, "emitNewSongOnly");
    __publicField(this, "savePreviousSongs");
    __publicField(this, "customFilters");
    __publicField(this, "nsfw");
    __publicField(this, "emitAddSongWhenCreatingQueue");
    __publicField(this, "emitAddListWhenCreatingQueue");
    __publicField(this, "joinNewVoiceChannel");
    __publicField(this, "ffmpeg");
    if (typeof options !== "object" || Array.isArray(options)) {
      throw new DisTubeError("INVALID_TYPE", "object", options, "DisTubeOptions");
    }
    const opts = { ...defaultOptions, ...options };
    this.plugins = opts.plugins;
    this.emitNewSongOnly = opts.emitNewSongOnly;
    this.savePreviousSongs = opts.savePreviousSongs;
    this.customFilters = opts.customFilters;
    this.nsfw = opts.nsfw;
    this.emitAddSongWhenCreatingQueue = opts.emitAddSongWhenCreatingQueue;
    this.emitAddListWhenCreatingQueue = opts.emitAddListWhenCreatingQueue;
    this.joinNewVoiceChannel = opts.joinNewVoiceChannel;
    this.ffmpeg = __privateMethod(this, _Options_instances, ffmpegOption_fn).call(this, options);
    checkInvalidKey(opts, this, "DisTubeOptions");
    __privateMethod(this, _Options_instances, validateOptions_fn).call(this);
  }
};
_Options_instances = new WeakSet();
validateOptions_fn = /* @__PURE__ */ __name(function(options = this) {
  const booleanOptions = /* @__PURE__ */ new Set([
    "emitNewSongOnly",
    "savePreviousSongs",
    "joinNewVoiceChannel",
    "nsfw",
    "emitAddSongWhenCreatingQueue",
    "emitAddListWhenCreatingQueue"
  ]);
  const numberOptions = /* @__PURE__ */ new Set();
  const stringOptions = /* @__PURE__ */ new Set();
  const objectOptions = /* @__PURE__ */ new Set(["customFilters", "ffmpeg"]);
  const optionalOptions = /* @__PURE__ */ new Set(["customFilters"]);
  for (const [key, value] of Object.entries(options)) {
    if (value === void 0 && optionalOptions.has(key)) continue;
    if (key === "plugins" && !Array.isArray(value)) {
      throw new DisTubeError("INVALID_TYPE", "Array<Plugin>", value, `DisTubeOptions.${key}`);
    } else if (booleanOptions.has(key)) {
      if (typeof value !== "boolean") {
        throw new DisTubeError("INVALID_TYPE", "boolean", value, `DisTubeOptions.${key}`);
      }
    } else if (numberOptions.has(key)) {
      if (typeof value !== "number" || isNaN(value)) {
        throw new DisTubeError("INVALID_TYPE", "number", value, `DisTubeOptions.${key}`);
      }
    } else if (stringOptions.has(key)) {
      if (typeof value !== "string") {
        throw new DisTubeError("INVALID_TYPE", "string", value, `DisTubeOptions.${key}`);
      }
    } else if (objectOptions.has(key)) {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new DisTubeError("INVALID_TYPE", "object", value, `DisTubeOptions.${key}`);
      }
    }
  }
}, "#validateOptions");
ffmpegOption_fn = /* @__PURE__ */ __name(function(opts) {
  const args = { global: {}, input: {}, output: {} };
  if (opts.ffmpeg?.args) {
    if (opts.ffmpeg.args.global) args.global = opts.ffmpeg.args.global;
    if (opts.ffmpeg.args.input) args.input = opts.ffmpeg.args.input;
    if (opts.ffmpeg.args.output) args.output = opts.ffmpeg.args.output;
  }
  const path = opts.ffmpeg?.path ?? "ffmpeg";
  if (typeof path !== "string") {
    throw new DisTubeError("INVALID_TYPE", "string", path, "DisTubeOptions.ffmpeg.path");
  }
  for (const [key, value] of Object.entries(args)) {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new DisTubeError("INVALID_TYPE", "object", value, `DisTubeOptions.ffmpeg.${key}`);
    }
    for (const [k, v] of Object.entries(value)) {
      if (typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean" && !Array.isArray(v) && v !== null && v !== void 0) {
        throw new DisTubeError(
          "INVALID_TYPE",
          ["string", "number", "boolean", "Array<string | null | undefined>", "null", "undefined"],
          v,
          `DisTubeOptions.ffmpeg.${key}.${k}`
        );
      }
    }
  }
  return { path, args };
}, "#ffmpegOption");
__name(_Options, "Options");
var Options = _Options;

// src/core/manager/BaseManager.ts
var import_discord2 = require("discord.js");
var _BaseManager = class _BaseManager extends DisTubeBase {
  constructor() {
    super(...arguments);
    /**
     * The collection of items for this manager.
     */
    __publicField(this, "collection", new import_discord2.Collection());
  }
  /**
   * The size of the collection.
   */
  get size() {
    return this.collection.size;
  }
};
__name(_BaseManager, "BaseManager");
var BaseManager = _BaseManager;

// src/core/manager/GuildIdManager.ts
var _GuildIdManager = class _GuildIdManager extends BaseManager {
  add(idOrInstance, data) {
    const id = resolveGuildId(idOrInstance);
    const existing = this.get(id);
    if (existing) return this;
    this.collection.set(id, data);
    return this;
  }
  get(idOrInstance) {
    return this.collection.get(resolveGuildId(idOrInstance));
  }
  remove(idOrInstance) {
    return this.collection.delete(resolveGuildId(idOrInstance));
  }
  has(idOrInstance) {
    return this.collection.has(resolveGuildId(idOrInstance));
  }
};
__name(_GuildIdManager, "GuildIdManager");
var GuildIdManager = _GuildIdManager;

// src/core/manager/DisTubeVoiceManager.ts
var import_voice3 = require("@discordjs/voice");
var _DisTubeVoiceManager = class _DisTubeVoiceManager extends GuildIdManager {
  /**
   * Create a {@link DisTubeVoice} instance
   * @param channel - A voice chann el to join
   */
  create(channel) {
    const existing = this.get(channel.guildId);
    if (existing) {
      existing.channel = channel;
      return existing;
    }
    if ((0, import_voice3.getVoiceConnection)(resolveGuildId(channel), this.client.user?.id) || (0, import_voice3.getVoiceConnection)(resolveGuildId(channel))) {
      throw new DisTubeError("VOICE_ALREADY_CREATED");
    }
    return new DisTubeVoice(this, channel);
  }
  /**
   * Join a voice channel and wait until the connection is ready
   * @param channel - A voice channel to join
   */
  join(channel) {
    const existing = this.get(channel.guildId);
    if (existing) return existing.join(channel);
    return this.create(channel).join();
  }
  /**
   * Leave the connected voice channel in a guild
   * @param guild - Queue Resolvable
   */
  leave(guild) {
    const voice = this.get(guild);
    if (voice) {
      voice.leave();
    } else {
      const connection = (0, import_voice3.getVoiceConnection)(resolveGuildId(guild), this.client.user?.id) ?? (0, import_voice3.getVoiceConnection)(resolveGuildId(guild));
      if (connection && connection.state.status !== import_voice3.VoiceConnectionStatus.Destroyed) {
        connection.destroy();
      }
    }
  }
};
__name(_DisTubeVoiceManager, "DisTubeVoiceManager");
var DisTubeVoiceManager = _DisTubeVoiceManager;

// src/core/manager/FilterManager.ts
var _FilterManager_instances, resolve_fn, apply_fn, removeFn_fn;
var _FilterManager = class _FilterManager extends BaseManager {
  constructor(queue) {
    super(queue.distube);
    __privateAdd(this, _FilterManager_instances);
    /**
     * The queue to manage
     */
    __publicField(this, "queue");
    this.queue = queue;
  }
  /**
   * Enable a filter or multiple filters to the manager
   * @param filterOrFilters - The filter or filters to enable
   * @param override        - Wether or not override the applied filter with new filter value
   */
  add(filterOrFilters, override = false) {
    if (Array.isArray(filterOrFilters)) {
      for (const filter of filterOrFilters) {
        const ft = __privateMethod(this, _FilterManager_instances, resolve_fn).call(this, filter);
        if (override || !this.has(ft)) this.collection.set(ft.name, ft);
      }
    } else {
      const ft = __privateMethod(this, _FilterManager_instances, resolve_fn).call(this, filterOrFilters);
      if (override || !this.has(ft)) this.collection.set(ft.name, ft);
    }
    __privateMethod(this, _FilterManager_instances, apply_fn).call(this);
    return this;
  }
  /**
   * Clear enabled filters of the manager
   */
  clear() {
    return this.set([]);
  }
  /**
   * Set the filters applied to the manager
   * @param filters - The filters to apply
   */
  set(filters) {
    if (!Array.isArray(filters)) throw new DisTubeError("INVALID_TYPE", "Array<FilterResolvable>", filters, "filters");
    this.collection.clear();
    for (const f of filters) {
      const filter = __privateMethod(this, _FilterManager_instances, resolve_fn).call(this, f);
      this.collection.set(filter.name, filter);
    }
    __privateMethod(this, _FilterManager_instances, apply_fn).call(this);
    return this;
  }
  /**
   * Disable a filter or multiple filters
   * @param filterOrFilters - The filter or filters to disable
   */
  remove(filterOrFilters) {
    if (Array.isArray(filterOrFilters)) filterOrFilters.forEach((f) => __privateMethod(this, _FilterManager_instances, removeFn_fn).call(this, f));
    else __privateMethod(this, _FilterManager_instances, removeFn_fn).call(this, filterOrFilters);
    __privateMethod(this, _FilterManager_instances, apply_fn).call(this);
    return this;
  }
  /**
   * Check whether a filter enabled or not
   * @param filter - The filter to check
   */
  has(filter) {
    return this.collection.has(typeof filter === "string" ? filter : __privateMethod(this, _FilterManager_instances, resolve_fn).call(this, filter).name);
  }
  /**
   * Array of enabled filter names
   */
  get names() {
    return [...this.collection.keys()];
  }
  /**
   * Array of enabled filters
   */
  get values() {
    return [...this.collection.values()];
  }
  get ffmpegArgs() {
    return this.size ? { af: this.values.map((f) => f.value).join(",") } : {};
  }
  toString() {
    return this.names.toString();
  }
};
_FilterManager_instances = new WeakSet();
resolve_fn = /* @__PURE__ */ __name(function(filter) {
  if (typeof filter === "object" && typeof filter.name === "string" && typeof filter.value === "string") {
    return filter;
  }
  if (typeof filter === "string" && Object.prototype.hasOwnProperty.call(this.distube.filters, filter)) {
    return {
      name: filter,
      value: this.distube.filters[filter]
    };
  }
  throw new DisTubeError("INVALID_TYPE", "FilterResolvable", filter, "filter");
}, "#resolve");
apply_fn = /* @__PURE__ */ __name(function() {
  this.queue._beginTime = this.queue.currentTime;
  this.queue.play(false);
}, "#apply");
removeFn_fn = /* @__PURE__ */ __name(function(f) {
  return this.collection.delete(__privateMethod(this, _FilterManager_instances, resolve_fn).call(this, f).name);
}, "#removeFn");
__name(_FilterManager, "FilterManager");
var FilterManager = _FilterManager;

// src/core/manager/QueueManager.ts
var _QueueManager_instances, voiceEventHandler_fn, emitPlaySong_fn, handleSongFinish_fn, handlePlayingError_fn;
var _QueueManager = class _QueueManager extends GuildIdManager {
  constructor() {
    super(...arguments);
    __privateAdd(this, _QueueManager_instances);
  }
  /**
   * Create a {@link Queue}
   * @param channel     - A voice channel
   * @param textChannel - Default text channel
   * @returns Returns `true` if encounter an error
   */
  async create(channel, textChannel) {
    if (this.has(channel.guildId)) throw new DisTubeError("QUEUE_EXIST");
    this.debug(`[QueueManager] Creating queue for guild: ${channel.guildId}`);
    const voice = this.voices.create(channel);
    const queue = new Queue(this.distube, voice, textChannel);
    await queue._taskQueue.queuing();
    try {
      checkFFmpeg(this.distube);
      this.debug(`[QueueManager] Joining voice channel: ${channel.id}`);
      await voice.join();
      __privateMethod(this, _QueueManager_instances, voiceEventHandler_fn).call(this, queue);
      this.add(queue.id, queue);
      this.emit("initQueue" /* INIT_QUEUE */, queue);
      return queue;
    } finally {
      queue._taskQueue.resolve();
    }
  }
  /**
   * Play a song on voice connection with queue properties
   * @param queue         - The guild queue to play
   * @param emitPlaySong  - Whether or not emit {@link Events.PLAY_SONG} event
   */
  async playSong(queue, emitPlaySong = true) {
    if (!queue) return;
    if (queue.stopped || !queue.songs.length) {
      queue.stop();
      return;
    }
    try {
      const song = queue.songs[0];
      this.debug(`[${queue.id}] Getting stream from: ${song}`);
      await this.handler.attachStreamInfo(song);
      const willPlaySong = song.stream.playFromSource ? song : song.stream.song;
      const stream = willPlaySong?.stream;
      if (!willPlaySong || !stream?.playFromSource || !stream.url) throw new DisTubeError("NO_STREAM_URL", `${song}`);
      this.debug(`[${queue.id}] Creating DisTubeStream for: ${willPlaySong}`);
      const streamOptions = {
        ffmpeg: {
          path: this.options.ffmpeg.path,
          args: {
            global: { ...queue.ffmpegArgs.global },
            input: { ...queue.ffmpegArgs.input },
            output: { ...queue.ffmpegArgs.output, ...queue.filters.ffmpegArgs }
          }
        },
        seek: willPlaySong.duration ? queue._beginTime : void 0
      };
      const dtStream = new DisTubeStream(stream.url, streamOptions);
      dtStream.on("debug", (data) => this.emit("ffmpegDebug" /* FFMPEG_DEBUG */, `[${queue.id}] ${data}`));
      this.debug(`[${queue.id}] Started playing: ${willPlaySong}`);
      queue.voice.play(dtStream);
      if (emitPlaySong) this.emit("playSong" /* PLAY_SONG */, queue, song);
    } catch (e) {
      __privateMethod(this, _QueueManager_instances, handlePlayingError_fn).call(this, queue, e);
    }
  }
};
_QueueManager_instances = new WeakSet();
/**
 * Listen to DisTubeVoice events and handle the Queue
 * @param queue - Queue
 */
voiceEventHandler_fn = /* @__PURE__ */ __name(function(queue) {
  queue._listeners = {
    disconnect: /* @__PURE__ */ __name((error) => {
      queue.remove();
      this.emit("disconnect" /* DISCONNECT */, queue);
      if (error) this.emitError(error, queue, queue.songs?.[0]);
    }, "disconnect"),
    error: /* @__PURE__ */ __name((error) => __privateMethod(this, _QueueManager_instances, handlePlayingError_fn).call(this, queue, error), "error"),
    finish: /* @__PURE__ */ __name(() => __privateMethod(this, _QueueManager_instances, handleSongFinish_fn).call(this, queue), "finish")
  };
  for (const event of objectKeys(queue._listeners)) {
    queue.voice.on(event, queue._listeners[event]);
  }
}, "#voiceEventHandler");
/**
 * Whether or not emit playSong event
 * @param queue - Queue
 */
emitPlaySong_fn = /* @__PURE__ */ __name(function(queue) {
  if (!this.options.emitNewSongOnly) return true;
  if (queue.repeatMode === 1 /* SONG */) return queue._next || queue._prev;
  return queue.songs[0].id !== queue.songs[1].id;
}, "#emitPlaySong");
handleSongFinish_fn = /* @__PURE__ */ __name(async function(queue) {
  this.debug(`[QueueManager] Handling song finish: ${queue.id}`);
  const song = queue.songs[0];
  this.emit("finishSong" /* FINISH_SONG */, queue, queue.songs[0]);
  await queue._taskQueue.queuing();
  try {
    if (queue.stopped) return;
    if (queue.repeatMode === 2 /* QUEUE */ && !queue._prev) queue.songs.push(song);
    if (queue._prev) {
      if (queue.repeatMode === 2 /* QUEUE */) queue.songs.unshift(queue.songs.pop());
      else queue.songs.unshift(queue.previousSongs.pop());
    }
    if (queue.songs.length <= 1 && (queue._next || queue.repeatMode === 0 /* DISABLED */)) {
      if (queue.autoplay) {
        try {
          this.debug(`[QueueManager] Adding related song: ${queue.id}`);
          await queue.addRelatedSong();
        } catch (e) {
          this.debug(`[${queue.id}] Add related song error: ${e.message}`);
          this.emit("noRelated" /* NO_RELATED */, queue, e);
        }
      }
      if (queue.songs.length <= 1) {
        this.debug(`[${queue.id}] Queue is empty, stopping...`);
        if (!queue.autoplay) this.emit("finish" /* FINISH */, queue);
        queue.remove();
        return;
      }
    }
    const emitPlaySong = __privateMethod(this, _QueueManager_instances, emitPlaySong_fn).call(this, queue);
    if (!queue._prev && (queue.repeatMode !== 1 /* SONG */ || queue._next)) {
      const prev = queue.songs.shift();
      if (this.options.savePreviousSongs) queue.previousSongs.push(prev);
      else queue.previousSongs.push({ id: prev.id });
    }
    queue._next = queue._prev = false;
    queue._beginTime = 0;
    if (song !== queue.songs[0]) {
      const playedSong = song.stream.playFromSource ? song : song.stream.song;
      if (playedSong?.stream.playFromSource) delete playedSong.stream.url;
    }
    await this.playSong(queue, emitPlaySong);
  } finally {
    queue._taskQueue.resolve();
  }
}, "#handleSongFinish");
/**
 * Handle error while playing
 * @param queue - queue
 * @param error - error
 */
handlePlayingError_fn = /* @__PURE__ */ __name(function(queue, error) {
  const song = queue.songs.shift();
  try {
    error.name = "PlayingError";
  } catch {
  }
  this.debug(`[${queue.id}] Error while playing: ${error.stack || error.message}`);
  this.emitError(error, queue, song);
  if (queue.songs.length > 0) {
    this.debug(`[${queue.id}] Playing next song: ${queue.songs[0]}`);
    queue._next = queue._prev = false;
    queue._beginTime = 0;
    this.playSong(queue);
  } else {
    this.debug(`[${queue.id}] Queue is empty, stopping...`);
    queue.stop();
  }
}, "#handlePlayingError");
__name(_QueueManager, "QueueManager");
var QueueManager = _QueueManager;

// src/struct/Queue.ts
var _filters, _Queue_instances, getRelatedSong_fn;
var _Queue = class _Queue extends DisTubeBase {
  /**
   * Create a queue for the guild
   * @param distube     - DisTube
   * @param voice       - Voice connection
   * @param textChannel - Default text channel
   */
  constructor(distube, voice, textChannel) {
    super(distube);
    __privateAdd(this, _Queue_instances);
    /**
     * Queue id (Guild id)
     */
    __publicField(this, "id");
    /**
     * Voice connection of this queue.
     */
    __publicField(this, "voice");
    /**
     * List of songs in the queue (The first one is the playing song)
     */
    __publicField(this, "songs");
    /**
     * List of the previous songs.
     */
    __publicField(this, "previousSongs");
    /**
     * Whether stream is currently stopped.
     */
    __publicField(this, "stopped");
    /**
     * Whether or not the stream is currently playing.
     */
    __publicField(this, "playing");
    /**
     * Whether or not the stream is currently paused.
     */
    __publicField(this, "paused");
    /**
     * Type of repeat mode (`0` is disabled, `1` is repeating a song, `2` is repeating
     * all the queue). Default value: `0` (disabled)
     */
    __publicField(this, "repeatMode");
    /**
     * Whether or not the autoplay mode is enabled. Default value: `false`
     */
    __publicField(this, "autoplay");
    /**
     * FFmpeg arguments for the current queue. Default value is defined with {@link DisTubeOptions}.ffmpeg.args.
     * `af` output argument will be replaced with {@link Queue#filters} manager
     */
    __publicField(this, "ffmpegArgs");
    /**
     * The text channel of the Queue. (Default: where the first command is called).
     */
    __publicField(this, "textChannel");
    __privateAdd(this, _filters);
    /**
     * What time in the song to begin (in seconds).
     */
    __publicField(this, "_beginTime");
    /**
     * Whether or not the last song was skipped to next song.
     */
    __publicField(this, "_next");
    /**
     * Whether or not the last song was skipped to previous song.
     */
    __publicField(this, "_prev");
    /**
     * Task queuing system
     */
    __publicField(this, "_taskQueue");
    /**
     * {@link DisTubeVoice} listener
     */
    __publicField(this, "_listeners");
    this.voice = voice;
    this.id = voice.id;
    this.volume = 50;
    this.songs = [];
    this.previousSongs = [];
    this.stopped = false;
    this._next = false;
    this._prev = false;
    this.playing = false;
    this.paused = false;
    this.repeatMode = 0 /* DISABLED */;
    this.autoplay = false;
    __privateSet(this, _filters, new FilterManager(this));
    this._beginTime = 0;
    this.textChannel = textChannel;
    this._taskQueue = new TaskQueue();
    this._listeners = void 0;
    this.ffmpegArgs = {
      global: { ...this.options.ffmpeg.args.global },
      input: { ...this.options.ffmpeg.args.input },
      output: { ...this.options.ffmpeg.args.output }
    };
  }
  /**
   * The client user as a `GuildMember` of this queue's guild
   */
  get clientMember() {
    return this.voice.channel.guild.members.me ?? void 0;
  }
  /**
   * The filter manager of the queue
   */
  get filters() {
    return __privateGet(this, _filters);
  }
  /**
   * Formatted duration string.
   */
  get formattedDuration() {
    return formatDuration(this.duration);
  }
  /**
   * Queue's duration.
   */
  get duration() {
    return this.songs.length ? this.songs.reduce((prev, next) => prev + next.duration, 0) : 0;
  }
  /**
   * What time in the song is playing (in seconds).
   */
  get currentTime() {
    return this.voice.playbackDuration + this._beginTime;
  }
  /**
   * Formatted {@link Queue#currentTime} string.
   */
  get formattedCurrentTime() {
    return formatDuration(this.currentTime);
  }
  /**
   * The voice channel playing in.
   */
  get voiceChannel() {
    return this.clientMember?.voice?.channel ?? null;
  }
  /**
   * Get or set the stream volume. Default value: `50`.
   */
  get volume() {
    return this.voice.volume;
  }
  set volume(value) {
    this.voice.volume = value;
  }
  /**
   * @throws {DisTubeError}
   * @param song     - Song to add
   * @param position - Position to add, \<= 0 to add to the end of the queue
   * @returns The guild queue
   */
  addToQueue(song, position = 0) {
    if (this.stopped) throw new DisTubeError("QUEUE_STOPPED");
    if (!song || Array.isArray(song) && !song.length) {
      throw new DisTubeError("INVALID_TYPE", ["Song", "Array<Song>"], song, "song");
    }
    if (typeof position !== "number" || !Number.isInteger(position)) {
      throw new DisTubeError("INVALID_TYPE", "integer", position, "position");
    }
    if (position <= 0) {
      if (Array.isArray(song)) this.songs.push(...song);
      else this.songs.push(song);
    } else if (Array.isArray(song)) {
      this.songs.splice(position, 0, ...song);
    } else {
      this.songs.splice(position, 0, song);
    }
    return this;
  }
  /**
   * Pause the guild stream
   * @returns The guild queue
   */
  pause() {
    if (this.paused) throw new DisTubeError("PAUSED");
    this.paused = true;
    this.voice.pause();
    return this;
  }
  /**
   * Resume the guild stream
   * @returns The guild queue
   */
  resume() {
    if (!this.paused) throw new DisTubeError("RESUMED");
    this.paused = false;
    this.voice.unpause();
    return this;
  }
  /**
   * Set the guild stream's volume
   * @param percent - The percentage of volume you want to set
   * @returns The guild queue
   */
  setVolume(percent) {
    this.volume = percent;
    return this;
  }
  /**
   * Skip the playing song if there is a next song in the queue. <info>If {@link
   * Queue#autoplay} is `true` and there is no up next song, DisTube will add and
   * play a related song.</info>
   * @returns The song will skip to
   */
  async skip() {
    await this._taskQueue.queuing();
    try {
      if (this.songs.length <= 1) {
        if (this.autoplay) await this.addRelatedSong();
        else throw new DisTubeError("NO_UP_NEXT");
      }
      const song = this.songs[1];
      this._next = true;
      this.voice.stop();
      return song;
    } finally {
      this._taskQueue.resolve();
    }
  }
  /**
   * Play the previous song if exists
   * @returns The guild queue
   */
  async previous() {
    await this._taskQueue.queuing();
    try {
      if (!this.options.savePreviousSongs) throw new DisTubeError("DISABLED_OPTION", "savePreviousSongs");
      if (this.previousSongs?.length === 0 && this.repeatMode !== 2 /* QUEUE */) {
        throw new DisTubeError("NO_PREVIOUS");
      }
      const song = this.repeatMode === 2 ? this.songs[this.songs.length - 1] : this.previousSongs[this.previousSongs.length - 1];
      this._prev = true;
      this.voice.stop();
      return song;
    } finally {
      this._taskQueue.resolve();
    }
  }
  /**
   * Shuffle the queue's songs
   * @returns The guild queue
   */
  async shuffle() {
    await this._taskQueue.queuing();
    try {
      const playing = this.songs.shift();
      if (playing === void 0) return this;
      for (let i = this.songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
      }
      this.songs.unshift(playing);
      return this;
    } finally {
      this._taskQueue.resolve();
    }
  }
  /**
   * Jump to the song position in the queue. The next one is 1, 2,... The previous
   * one is -1, -2,...
   * if `num` is invalid number
   * @param position - The song position to play
   * @returns The new Song will be played
   */
  async jump(position) {
    await this._taskQueue.queuing();
    try {
      if (typeof position !== "number") throw new DisTubeError("INVALID_TYPE", "number", position, "position");
      if (!position || position > this.songs.length || -position > this.previousSongs.length) {
        throw new DisTubeError("NO_SONG_POSITION");
      }
      let nextSong;
      if (position > 0) {
        const nextSongs = this.songs.splice(position - 1);
        if (this.options.savePreviousSongs) {
          this.previousSongs.push(...this.songs);
        } else {
          this.previousSongs.push(...this.songs.map((s) => ({ id: s.id })));
        }
        this.songs = nextSongs;
        this._next = true;
        nextSong = nextSongs[1];
      } else if (!this.options.savePreviousSongs) {
        throw new DisTubeError("DISABLED_OPTION", "savePreviousSongs");
      } else {
        this._prev = true;
        if (position !== -1) this.songs.unshift(...this.previousSongs.splice(position + 1));
        nextSong = this.previousSongs[this.previousSongs.length - 1];
      }
      this.voice.stop();
      return nextSong;
    } finally {
      this._taskQueue.resolve();
    }
  }
  /**
   * Set the repeat mode of the guild queue.
   * Toggle mode `(Disabled -> Song -> Queue -> Disabled ->...)` if `mode` is `undefined`
   * @param mode - The repeat modes (toggle if `undefined`)
   * @returns The new repeat mode
   */
  setRepeatMode(mode) {
    if (mode !== void 0 && !Object.values(RepeatMode).includes(mode)) {
      throw new DisTubeError("INVALID_TYPE", ["RepeatMode", "undefined"], mode, "mode");
    }
    if (mode === void 0) this.repeatMode = (this.repeatMode + 1) % 3;
    else if (this.repeatMode === mode) this.repeatMode = 0 /* DISABLED */;
    else this.repeatMode = mode;
    return this.repeatMode;
  }
  /**
   * Set the playing time to another position
   * @param time - Time in seconds
   * @returns The guild queue
   */
  seek(time) {
    if (typeof time !== "number") throw new DisTubeError("INVALID_TYPE", "number", time, "time");
    if (isNaN(time) || time < 0) throw new DisTubeError("NUMBER_COMPARE", "time", "bigger or equal to", 0);
    this._beginTime = time;
    this.play(false);
    return this;
  }
  /**
   * Add a related song of the playing song to the queue
   * @returns The added song
   */
  async addRelatedSong() {
    const current = this.songs?.[0];
    if (!current) throw new DisTubeError("NO_PLAYING_SONG");
    const prevIds = this.previousSongs.map((p) => p.id);
    const relatedSongs = (await __privateMethod(this, _Queue_instances, getRelatedSong_fn).call(this, current)).filter((s) => !prevIds.includes(s.id));
    this.debug(`[${this.id}] Getting related songs from: ${current}`);
    if (!relatedSongs.length && !current.stream.playFromSource) {
      const altSong = current.stream.song;
      if (altSong) relatedSongs.push(...(await __privateMethod(this, _Queue_instances, getRelatedSong_fn).call(this, altSong)).filter((s) => !prevIds.includes(s.id)));
      this.debug(`[${this.id}] Getting related songs from streamed song: ${altSong}`);
    }
    const song = relatedSongs[0];
    if (!song) throw new DisTubeError("NO_RELATED");
    song.metadata = current.metadata;
    song.member = this.clientMember;
    this.addToQueue(song);
    return song;
  }
  /**
   * Stop the guild stream and delete the queue
   */
  async stop() {
    await this._taskQueue.queuing();
    try {
      this.playing = false;
      this.paused = false;
      this.stopped = true;
      this.voice.stop();
      this.remove();
    } finally {
      this._taskQueue.resolve();
    }
  }
  /**
   * Remove the queue from the manager
   */
  remove() {
    this.stopped = true;
    this.songs = [];
    this.previousSongs = [];
    if (this._listeners) {
      for (const event of objectKeys(this._listeners)) {
        this.voice.off(event, this._listeners[event]);
      }
    }
    this.queues.remove(this.id);
    this.emit("deleteQueue" /* DELETE_QUEUE */, this);
  }
  /**
   * Toggle autoplay mode
   * @returns Autoplay mode state
   */
  toggleAutoplay() {
    this.autoplay = !this.autoplay;
    return this.autoplay;
  }
  /**
   * Play the queue
   * @param emitPlaySong - Whether or not emit {@link Events.PLAY_SONG} event
   */
  play(emitPlaySong = true) {
    if (this.stopped) throw new DisTubeError("QUEUE_STOPPED");
    this.playing = true;
    return this.queues.playSong(this, emitPlaySong);
  }
};
_filters = new WeakMap();
_Queue_instances = new WeakSet();
getRelatedSong_fn = /* @__PURE__ */ __name(async function(current) {
  const plugin = await this.handler._getPluginFromSong(current);
  if (plugin) return plugin.getRelatedSongs(current);
  return [];
}, "#getRelatedSong");
__name(_Queue, "Queue");
var Queue = _Queue;

// src/struct/Plugin.ts
var _Plugin = class _Plugin {
  constructor() {
    /**
     * DisTube
     */
    __publicField(this, "distube");
  }
  init(distube) {
    this.distube = distube;
  }
};
__name(_Plugin, "Plugin");
var Plugin = _Plugin;

// src/struct/ExtractorPlugin.ts
var _ExtractorPlugin = class _ExtractorPlugin extends Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "extractor" /* EXTRACTOR */);
  }
};
__name(_ExtractorPlugin, "ExtractorPlugin");
var ExtractorPlugin = _ExtractorPlugin;

// src/struct/InfoExtratorPlugin.ts
var _InfoExtractorPlugin = class _InfoExtractorPlugin extends Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "info-extractor" /* INFO_EXTRACTOR */);
  }
};
__name(_InfoExtractorPlugin, "InfoExtractorPlugin");
var InfoExtractorPlugin = _InfoExtractorPlugin;

// src/struct/PlayableExtratorPlugin.ts
var _PlayableExtractorPlugin = class _PlayableExtractorPlugin extends Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "type", "playable-extractor" /* PLAYABLE_EXTRACTOR */);
  }
};
__name(_PlayableExtractorPlugin, "PlayableExtractorPlugin");
var PlayableExtractorPlugin = _PlayableExtractorPlugin;

// src/util.ts
var import_url = require("url");
var import_discord3 = require("discord.js");
var formatInt = /* @__PURE__ */ __name((int) => int < 10 ? `0${int}` : int, "formatInt");
function formatDuration(sec) {
  if (!sec || !Number(sec)) return "00:00";
  const seconds = Math.floor(sec % 60);
  const minutes = Math.floor(sec % 3600 / 60);
  const hours = Math.floor(sec / 3600);
  if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
  return `00:${formatInt(seconds)}`;
}
__name(formatDuration, "formatDuration");
var SUPPORTED_PROTOCOL = ["https:", "http:", "file:"];
function isURL(input) {
  if (typeof input !== "string" || input.includes(" ")) return false;
  try {
    const url = new import_url.URL(input);
    if (!SUPPORTED_PROTOCOL.some((p) => p === url.protocol)) return false;
  } catch {
    return false;
  }
  return true;
}
__name(isURL, "isURL");
function checkIntents(options) {
  const intents = options.intents instanceof import_discord3.IntentsBitField ? options.intents : new import_discord3.IntentsBitField(options.intents);
  if (!intents.has(import_discord3.GatewayIntentBits.GuildVoiceStates)) throw new DisTubeError("MISSING_INTENTS", "GuildVoiceStates");
}
__name(checkIntents, "checkIntents");
function isVoiceChannelEmpty(voiceState) {
  const guild = voiceState.guild;
  const clientId = voiceState.client.user?.id;
  if (!guild || !clientId) return false;
  const voiceChannel = guild.members.me?.voice?.channel;
  if (!voiceChannel) return false;
  const members = voiceChannel.members.filter((m) => !m.user.bot);
  return !members.size;
}
__name(isVoiceChannelEmpty, "isVoiceChannelEmpty");
function isSnowflake(id) {
  try {
    return import_discord3.SnowflakeUtil.deconstruct(id).timestamp > import_discord3.SnowflakeUtil.epoch;
  } catch {
    return false;
  }
}
__name(isSnowflake, "isSnowflake");
function isMemberInstance(member) {
  return Boolean(member) && isSnowflake(member.id) && isSnowflake(member.guild?.id) && isSnowflake(member.user?.id) && member.id === member.user.id;
}
__name(isMemberInstance, "isMemberInstance");
function isTextChannelInstance(channel) {
  return Boolean(channel) && isSnowflake(channel.id) && isSnowflake(channel.guildId || channel.guild?.id) && import_discord3.Constants.TextBasedChannelTypes.includes(channel.type) && typeof channel.send === "function" && (typeof channel.nsfw === "boolean" || typeof channel.parent?.nsfw === "boolean");
}
__name(isTextChannelInstance, "isTextChannelInstance");
function isMessageInstance(message) {
  return Boolean(message) && isSnowflake(message.id) && isSnowflake(message.guildId || message.guild?.id) && isMemberInstance(message.member) && isTextChannelInstance(message.channel) && import_discord3.Constants.NonSystemMessageTypes.includes(message.type) && message.member.id === message.author?.id;
}
__name(isMessageInstance, "isMessageInstance");
function isSupportedVoiceChannel(channel) {
  return Boolean(channel) && isSnowflake(channel.id) && isSnowflake(channel.guildId || channel.guild?.id) && import_discord3.Constants.VoiceBasedChannelTypes.includes(channel.type);
}
__name(isSupportedVoiceChannel, "isSupportedVoiceChannel");
function isGuildInstance(guild) {
  return Boolean(guild) && isSnowflake(guild.id) && isSnowflake(guild.ownerId) && typeof guild.name === "string";
}
__name(isGuildInstance, "isGuildInstance");
function resolveGuildId(resolvable) {
  let guildId;
  if (typeof resolvable === "string") {
    guildId = resolvable;
  } else if (isObject(resolvable)) {
    if ("guildId" in resolvable && resolvable.guildId) {
      guildId = resolvable.guildId;
    } else if (resolvable instanceof Queue || resolvable instanceof DisTubeVoice || isGuildInstance(resolvable)) {
      guildId = resolvable.id;
    } else if ("guild" in resolvable && isGuildInstance(resolvable.guild)) {
      guildId = resolvable.guild.id;
    }
  }
  if (!isSnowflake(guildId)) throw new DisTubeError("INVALID_TYPE", "GuildIdResolvable", resolvable);
  return guildId;
}
__name(resolveGuildId, "resolveGuildId");
function isClientInstance(client) {
  return Boolean(client) && typeof client.login === "function";
}
__name(isClientInstance, "isClientInstance");
function checkInvalidKey(target, source, sourceName) {
  if (!isObject(target)) throw new DisTubeError("INVALID_TYPE", "object", target, sourceName);
  const sourceKeys = Array.isArray(source) ? source : objectKeys(source);
  const invalidKey = objectKeys(target).find((key) => !sourceKeys.includes(key));
  if (invalidKey) throw new DisTubeError("INVALID_KEY", sourceName, invalidKey);
}
__name(checkInvalidKey, "checkInvalidKey");
function isObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
__name(isObject, "isObject");
function objectKeys(obj) {
  if (!isObject(obj)) return [];
  return Object.keys(obj);
}
__name(objectKeys, "objectKeys");
function isNsfwChannel(channel) {
  if (!isTextChannelInstance(channel)) return false;
  if (channel.isThread()) return channel.parent?.nsfw ?? false;
  return channel.nsfw;
}
__name(isNsfwChannel, "isNsfwChannel");
var isTruthy = /* @__PURE__ */ __name((x) => Boolean(x), "isTruthy");

// src/DisTube.ts
var import_tiny_typed_emitter3 = require("tiny-typed-emitter");
var { version } = require_package();
var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _DisTube_instances, getQueue_fn;
var _DisTube = class _DisTube extends (_m = import_tiny_typed_emitter3.TypedEmitter, _l = "addList" /* ADD_LIST */, _k = "addSong" /* ADD_SONG */, _j = "deleteQueue" /* DELETE_QUEUE */, _i = "disconnect" /* DISCONNECT */, _h = "error" /* ERROR */, _g = "ffmpegDebug" /* FFMPEG_DEBUG */, _f = "debug" /* DEBUG */, _e = "finish" /* FINISH */, _d = "finishSong" /* FINISH_SONG */, _c = "initQueue" /* INIT_QUEUE */, _b = "noRelated" /* NO_RELATED */, _a = "playSong" /* PLAY_SONG */, _m) {
  /**
   * Create a new DisTube class.
   * @throws {@link DisTubeError}
   * @param client - Discord.JS client
   * @param opts   - Custom DisTube options
   */
  constructor(client, opts = {}) {
    super();
    __privateAdd(this, _DisTube_instances);
    /**
     * DisTube internal handler
     */
    __publicField(this, "handler");
    /**
     * DisTube options
     */
    __publicField(this, "options");
    /**
     * Discord.js v14 client
     */
    __publicField(this, "client");
    /**
     * Queues manager
     */
    __publicField(this, "queues");
    /**
     * DisTube voice connections manager
     */
    __publicField(this, "voices");
    /**
     * DisTube plugins
     */
    __publicField(this, "plugins");
    /**
     * DisTube ffmpeg audio filters
     */
    __publicField(this, "filters");
    this.setMaxListeners(1);
    if (!isClientInstance(client)) throw new DisTubeError("INVALID_TYPE", "Discord.Client", client, "client");
    this.client = client;
    checkIntents(client.options);
    this.options = new Options(opts);
    this.voices = new DisTubeVoiceManager(this);
    this.handler = new DisTubeHandler(this);
    this.queues = new QueueManager(this);
    this.filters = { ...defaultFilters, ...this.options.customFilters };
    this.plugins = [...this.options.plugins];
    this.plugins.forEach((p) => p.init(this));
  }
  static get version() {
    return version;
  }
  /**
   * DisTube version
   */
  get version() {
    return version;
  }
  /**
   * Play / add a song or playlist from url.
   * Search and play a song (with {@link ExtractorPlugin}) if it is not a valid url.
   * @throws {@link DisTubeError}
   * @param voiceChannel - The channel will be joined if the bot isn't in any channels, the bot will be
   *                       moved to this channel if {@link DisTubeOptions}.joinNewVoiceChannel is `true`
   * @param song         - URL | Search string | {@link Song} | {@link Playlist}
   * @param options      - Optional options
   */
  async play(voiceChannel, song, options = {}) {
    if (!isSupportedVoiceChannel(voiceChannel)) {
      throw new DisTubeError("INVALID_TYPE", "BaseGuildVoiceChannel", voiceChannel, "voiceChannel");
    }
    if (!isObject(options)) throw new DisTubeError("INVALID_TYPE", "object", options, "options");
    const { textChannel, member, skip, message, metadata } = {
      member: voiceChannel.guild.members.me ?? void 0,
      textChannel: options?.message?.channel,
      skip: false,
      ...options
    };
    const position = Number(options.position) || (skip ? 1 : 0);
    if (message && !isMessageInstance(message)) {
      throw new DisTubeError("INVALID_TYPE", ["Discord.Message", "a falsy value"], message, "options.message");
    }
    if (textChannel && !isTextChannelInstance(textChannel)) {
      throw new DisTubeError("INVALID_TYPE", "Discord.GuildTextBasedChannel", textChannel, "options.textChannel");
    }
    if (member && !isMemberInstance(member)) {
      throw new DisTubeError("INVALID_TYPE", "Discord.GuildMember", member, "options.member");
    }
    const queue = this.getQueue(voiceChannel) || await this.queues.create(voiceChannel, textChannel);
    await queue._taskQueue.queuing();
    try {
      this.debug(`[${queue.id}] Playing input: ${song}`);
      const resolved = await this.handler.resolve(song, { member, metadata });
      const isNsfw = isNsfwChannel(queue?.textChannel || textChannel);
      if (resolved instanceof Playlist) {
        if (!this.options.nsfw && !isNsfw) {
          resolved.songs = resolved.songs.filter((s) => !s.ageRestricted);
          if (!resolved.songs.length) throw new DisTubeError("EMPTY_FILTERED_PLAYLIST");
        }
        if (!resolved.songs.length) throw new DisTubeError("EMPTY_PLAYLIST");
        this.debug(`[${queue.id}] Adding playlist to queue: ${resolved.songs.length} songs`);
        queue.addToQueue(resolved.songs, position);
        if (queue.playing || this.options.emitAddListWhenCreatingQueue) this.emit("addList" /* ADD_LIST */, queue, resolved);
      } else {
        if (!this.options.nsfw && resolved.ageRestricted && !isNsfwChannel(queue?.textChannel || textChannel)) {
          throw new DisTubeError("NON_NSFW");
        }
        this.debug(`[${queue.id}] Adding song to queue: ${resolved.name || resolved.url || resolved.id || resolved}`);
        queue.addToQueue(resolved, position);
        if (queue.playing || this.options.emitAddSongWhenCreatingQueue) this.emit("addSong" /* ADD_SONG */, queue, resolved);
      }
      if (!queue.playing) await queue.play();
    } catch (e) {
      if (!(e instanceof DisTubeError)) {
        this.debug(`[${queue.id}] Unexpected error while playing song: ${e.stack || e.message}`);
        try {
          e.name = "PlayError";
          e.message = `${typeof song === "string" ? song : song.url}
${e.message}`;
        } catch {
        }
      }
      throw e;
    } finally {
      queue._taskQueue.resolve();
    }
  }
  /**
   * Create a custom playlist
   * @param songs   - Array of url or Song
   * @param options - Optional options
   */
  async createCustomPlaylist(songs, { member, parallel, metadata, name, source, url, thumbnail } = {}) {
    if (!Array.isArray(songs)) throw new DisTubeError("INVALID_TYPE", "Array", songs, "songs");
    if (!songs.length) throw new DisTubeError("EMPTY_ARRAY", "songs");
    const filteredSongs = songs.filter((song) => song instanceof Song || isURL(song));
    if (!filteredSongs.length) throw new DisTubeError("NO_VALID_SONG");
    if (member && !isMemberInstance(member)) {
      throw new DisTubeError("INVALID_TYPE", "Discord.Member", member, "options.member");
    }
    let resolvedSongs;
    if (parallel !== false) {
      const promises = filteredSongs.map(
        (song) => this.handler.resolve(song, { member, metadata }).catch(() => void 0)
      );
      resolvedSongs = (await Promise.all(promises)).filter((s) => s instanceof Song);
    } else {
      resolvedSongs = [];
      for (const song of filteredSongs) {
        const resolved = await this.handler.resolve(song, { member, metadata }).catch(() => void 0);
        if (resolved instanceof Song) resolvedSongs.push(resolved);
      }
    }
    return new Playlist(
      {
        source: source || "custom",
        name,
        url,
        thumbnail: thumbnail || resolvedSongs.find((s) => s.thumbnail)?.thumbnail,
        songs: resolvedSongs
      },
      { member, metadata }
    );
  }
  /**
   * Get the guild queue
   * @param guild - The type can be resolved to give a {@link Queue}
   */
  getQueue(guild) {
    return this.queues.get(guild);
  }
  /**
   * Pause the guild stream
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns The guild queue
   */
  pause(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).pause();
  }
  /**
   * Resume the guild stream
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns The guild queue
   */
  resume(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).resume();
  }
  /**
   * Stop the guild stream
   * @param guild - The type can be resolved to give a {@link Queue}
   */
  stop(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).stop();
  }
  /**
   * Set the guild stream's volume
   * @param guild   - The type can be resolved to give a {@link Queue}
   * @param percent - The percentage of volume you want to set
   * @returns The guild queue
   */
  setVolume(guild, percent) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).setVolume(percent);
  }
  /**
   * Skip the playing song if there is a next song in the queue. <info>If {@link
   * Queue#autoplay} is `true` and there is no up next song, DisTube will add and
   * play a related song.</info>
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns The new Song will be played
   */
  skip(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).skip();
  }
  /**
   * Play the previous song
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns The new Song will be played
   */
  previous(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).previous();
  }
  /**
   * Shuffle the guild queue songs
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns The guild queue
   */
  shuffle(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).shuffle();
  }
  /**
   * Jump to the song number in the queue. The next one is 1, 2,... The previous one
   * is -1, -2,...
   * @param guild - The type can be resolved to give a {@link Queue}
   * @param num   - The song number to play
   * @returns The new Song will be played
   */
  jump(guild, num) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).jump(num);
  }
  /**
   * Set the repeat mode of the guild queue.
   * Toggle mode `(Disabled -> Song -> Queue -> Disabled ->...)` if `mode` is `undefined`
   * @param guild - The type can be resolved to give a {@link Queue}
   * @param mode  - The repeat modes (toggle if `undefined`)
   * @returns The new repeat mode
   */
  setRepeatMode(guild, mode) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).setRepeatMode(mode);
  }
  /**
   * Toggle autoplay mode
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns Autoplay mode state
   */
  toggleAutoplay(guild) {
    const queue = __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild);
    queue.autoplay = !queue.autoplay;
    return queue.autoplay;
  }
  /**
   * Add related song to the queue
   * @param guild - The type can be resolved to give a {@link Queue}
   * @returns The guild queue
   */
  addRelatedSong(guild) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).addRelatedSong();
  }
  /**
   * Set the playing time to another position
   * @param guild - The type can be resolved to give a {@link Queue}
   * @param time  - Time in seconds
   * @returns Seeked queue
   */
  seek(guild, time) {
    return __privateMethod(this, _DisTube_instances, getQueue_fn).call(this, guild).seek(time);
  }
  /**
   * Emit error event
   * @param error   - error
   * @param queue   - The queue encountered the error
   * @param song    - The playing song when encountered the error
   */
  emitError(error, queue, song) {
    this.emit("error" /* ERROR */, error, queue, song);
  }
  /**
   * Emit debug event
   * @param message - debug message
   */
  debug(message) {
    this.emit("debug" /* DEBUG */, message);
  }
};
_DisTube_instances = new WeakSet();
getQueue_fn = /* @__PURE__ */ __name(function(guild) {
  const queue = this.getQueue(guild);
  if (!queue) throw new DisTubeError("NO_QUEUE");
  return queue;
}, "#getQueue");
__name(_DisTube, "DisTube");
/**
 * @event
 * Emitted after DisTube add a new playlist to the playing {@link Queue}.
 * @param queue    - The guild queue
 * @param playlist - Playlist info
 */
__publicField(_DisTube, _l);
/**
 * @event
 * Emitted after DisTube add a new song to the playing {@link Queue}.
 * @param queue - The guild queue
 * @param song  - Added song
 */
__publicField(_DisTube, _k);
/**
 * @event
 * Emitted when a {@link Queue} is deleted with any reasons.
 * @param queue - The guild queue
 */
__publicField(_DisTube, _j);
/**
 * @event
 * Emitted when the bot is disconnected to a voice channel.
 * @param queue - The guild queue
 */
__publicField(_DisTube, _i);
/**
 * @event
 * Emitted when DisTube encounters an error while playing songs.
 * @param error   - error
 * @param queue   - The queue encountered the error
 * @param song    - The playing song when encountered the error
 */
__publicField(_DisTube, _h);
/**
 * @event
 * Emitted for logging FFmpeg debug information.
 * @param debug - Debug message string.
 */
__publicField(_DisTube, _g);
/**
 * @event
 * Emitted to provide debug information from DisTube's operation.
 * Useful for troubleshooting or logging purposes.
 *
 * @param debug - Debug message string.
 */
__publicField(_DisTube, _f);
/**
 * @event
 * Emitted when there is no more song in the queue and {@link Queue#autoplay} is `false`.
 * @param queue - The guild queue
 */
__publicField(_DisTube, _e);
/**
 * @event
 * Emitted when DisTube finished a song.
 * @param queue - The guild queue
 * @param song  - Finished song
 */
__publicField(_DisTube, _d);
/**
 * @event
 * Emitted when DisTube initialize a queue to change queue default properties.
 * @param queue - The guild queue
 */
__publicField(_DisTube, _c);
/**
 * @event
 * Emitted when {@link Queue#autoplay} is `true`, {@link Queue#songs} is empty, and
 * DisTube cannot find related songs to play.
 * @param queue - The guild queue
 */
__publicField(_DisTube, _b);
/**
 * @event
 * Emitted when DisTube play a song.
 * If {@link DisTubeOptions}.emitNewSongOnly is `true`, this event is not emitted
 * when looping a song or next song is the previous one.
 * @param queue - The guild queue
 * @param song  - Playing song
 */
__publicField(_DisTube, _a);
var DisTube = _DisTube;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseManager,
  DisTube,
  DisTubeBase,
  DisTubeError,
  DisTubeHandler,
  DisTubeStream,
  DisTubeVoice,
  DisTubeVoiceManager,
  Events,
  ExtractorPlugin,
  FilterManager,
  GuildIdManager,
  InfoExtractorPlugin,
  Options,
  PlayableExtractorPlugin,
  Playlist,
  Plugin,
  PluginType,
  Queue,
  QueueManager,
  RepeatMode,
  Song,
  TaskQueue,
  checkFFmpeg,
  checkIntents,
  checkInvalidKey,
  defaultFilters,
  defaultOptions,
  formatDuration,
  isClientInstance,
  isGuildInstance,
  isMemberInstance,
  isMessageInstance,
  isNsfwChannel,
  isObject,
  isSnowflake,
  isSupportedVoiceChannel,
  isTextChannelInstance,
  isTruthy,
  isURL,
  isVoiceChannelEmpty,
  objectKeys,
  resolveGuildId,
  version
});
//# sourceMappingURL=index.js.map