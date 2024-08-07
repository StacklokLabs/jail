import * as discord_js from 'discord.js';
import { Snowflake, Message, GuildTextBasedChannel, VoiceBasedChannel, VoiceState, Guild, GuildMember, Interaction, Client, Collection, ClientOptions } from 'discord.js';
import { TypedEmitter } from 'tiny-typed-emitter';
import { AudioPlayer, VoiceConnection, AudioResource } from '@discordjs/voice';
import { Transform, TransformCallback } from 'stream';
import { ChildProcess } from 'child_process';

type Awaitable<T = any> = T | PromiseLike<T>;
declare enum Events {
    ERROR = "error",
    ADD_LIST = "addList",
    ADD_SONG = "addSong",
    PLAY_SONG = "playSong",
    FINISH_SONG = "finishSong",
    EMPTY = "empty",
    FINISH = "finish",
    INIT_QUEUE = "initQueue",
    NO_RELATED = "noRelated",
    DISCONNECT = "disconnect",
    DELETE_QUEUE = "deleteQueue",
    FFMPEG_DEBUG = "ffmpegDebug",
    DEBUG = "debug"
}
type DisTubeEvents = {
    [Events.ADD_LIST]: [queue: Queue, playlist: Playlist];
    [Events.ADD_SONG]: [queue: Queue, song: Song];
    [Events.DELETE_QUEUE]: [queue: Queue];
    [Events.DISCONNECT]: [queue: Queue];
    [Events.ERROR]: [error: Error, queue: Queue, song: Song | undefined];
    [Events.FFMPEG_DEBUG]: [debug: string];
    [Events.DEBUG]: [debug: string];
    [Events.FINISH]: [queue: Queue];
    [Events.FINISH_SONG]: [queue: Queue, song: Song];
    [Events.INIT_QUEUE]: [queue: Queue];
    [Events.NO_RELATED]: [queue: Queue, error: DisTubeError];
    [Events.PLAY_SONG]: [queue: Queue, song: Song];
};
type TypedDisTubeEvents = {
    [K in keyof DisTubeEvents]: (...args: DisTubeEvents[K]) => Awaitable;
};
type DisTubeVoiceEvents = {
    disconnect: (error?: Error) => Awaitable;
    error: (error: Error) => Awaitable;
    finish: () => Awaitable;
};
/**
 * An FFmpeg audio filter object
 * ```ts
 * {
 *   name:  "bassboost",
 *   value: "bass=g=10"
 * }
 * ```ts
 */
interface Filter {
    /**
     * Name of the filter
     */
    name: string;
    /**
     * FFmpeg audio filter argument
     */
    value: string;
}
/**
 * Data that resolves to give an FFmpeg audio filter. This can be:
 * - A name of a default filters or custom filters (`string`)
 * - A {@link Filter} object
 * @see {@link defaultFilters}
 * @see {@link DisTubeOptions|DisTubeOptions.customFilters}
 */
type FilterResolvable = string | Filter;
/**
 * FFmpeg Filters
 * ```ts
 * {
 *   "Filter Name": "Filter Value",
 *   "bassboost":   "bass=g=10"
 * }
 * ```
 * @see {@link defaultFilters}
 */
type Filters = Record<string, string>;
/**
 * DisTube options
 */
type DisTubeOptions = {
    /**
     * DisTube plugins.
     * The order of this effects the priority of the plugins when verifying the input.
     */
    plugins?: DisTubePlugin[];
    /**
     * Whether or not emitting {@link Events.PLAY_SONG} event when looping a song
     * or next song is the same as the previous one
     */
    emitNewSongOnly?: boolean;
    /**
     * Whether or not saving the previous songs of the queue and enable {@link
     * DisTube#previous} method. Disable it may help to reduce the memory usage
     */
    savePreviousSongs?: boolean;
    /**
     * Override {@link defaultFilters} or add more ffmpeg filters
     */
    customFilters?: Filters;
    /**
     * Whether or not playing age-restricted content and disabling safe search in
     * non-NSFW channel
     */
    nsfw?: boolean;
    /**
     * Whether or not emitting `addSong` event when creating a new Queue
     */
    emitAddSongWhenCreatingQueue?: boolean;
    /**
     * Whether or not emitting `addList` event when creating a new Queue
     */
    emitAddListWhenCreatingQueue?: boolean;
    /**
     * Whether or not joining the new voice channel when using {@link DisTube#play}
     * method
     */
    joinNewVoiceChannel?: boolean;
    /**
     * FFmpeg options
     */
    ffmpeg?: {
        /**
         * FFmpeg path
         */
        path?: string;
        /**
         * FFmpeg default arguments
         */
        args?: Partial<FFmpegArgs>;
    };
};
/**
 * Data that can be resolved to give a guild id string. This can be:
 * - A guild id string | a guild {@link https://discord.js.org/#/docs/main/stable/class/Snowflake|Snowflake}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Guild | Guild}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Message | Message}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/BaseGuildVoiceChannel
 *   | BaseGuildVoiceChannel}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/BaseGuildTextChannel
 *   | BaseGuildTextChannel}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/VoiceState |
 *   VoiceState}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/GuildMember |
 *   GuildMember}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Interaction |
 *   Interaction}
 * - A {@link DisTubeVoice}
 * - A {@link Queue}
 */
type GuildIdResolvable = Queue | DisTubeVoice | Snowflake | Message | GuildTextBasedChannel | VoiceBasedChannel | VoiceState | Guild | GuildMember | Interaction | string;
interface SongInfo {
    plugin: DisTubePlugin | null;
    source: string;
    playFromSource: boolean;
    id: string;
    name?: string;
    isLive?: boolean;
    duration?: number;
    url?: string;
    thumbnail?: string;
    views?: number;
    likes?: number;
    dislikes?: number;
    reposts?: number;
    uploader?: {
        name?: string;
        url?: string;
    };
    ageRestricted?: boolean;
}
interface PlaylistInfo {
    source: string;
    songs: Song[];
    id?: string;
    name?: string;
    url?: string;
    thumbnail?: string;
}
type RelatedSong = Omit<Song, "related">;
type PlayHandlerOptions = {
    /**
     * [Default: false] Skip the playing song (if exists) and play the added playlist
     * instantly
     */
    skip?: boolean;
    /**
     * [Default: 0] Position of the song/playlist to add to the queue, \<= 0 to add to
     * the end of the queue
     */
    position?: number;
    /**
     * The default text channel of the queue
     */
    textChannel?: GuildTextBasedChannel;
};
interface PlayOptions<T = unknown> extends PlayHandlerOptions, ResolveOptions<T> {
    /**
     * Called message (For built-in search events. If this is a {@link
     * https://developer.mozilla.org/en-US/docs/Glossary/Falsy | falsy value}, it will
     * play the first result instead)
     */
    message?: Message;
}
interface ResolveOptions<T = unknown> {
    /**
     * Requested user
     */
    member?: GuildMember;
    /**
     * Metadata
     */
    metadata?: T;
}
interface ResolvePlaylistOptions<T = unknown> extends ResolveOptions<T> {
    /**
     * Source of the playlist
     */
    source?: string;
}
interface CustomPlaylistOptions {
    /**
     * A guild member creating the playlist
     */
    member?: GuildMember;
    /**
     * Whether or not fetch the songs in parallel
     */
    parallel?: boolean;
    /**
     * Metadata
     */
    metadata?: any;
    /**
     * Playlist name
     */
    name?: string;
    /**
     * Playlist source
     */
    source?: string;
    /**
     * Playlist url
     */
    url?: string;
    /**
     * Playlist thumbnail
     */
    thumbnail?: string;
}
/**
 * The repeat mode of a {@link Queue}
 * - `DISABLED` = 0
 * - `SONG` = 1
 * - `QUEUE` = 2
 */
declare enum RepeatMode {
    DISABLED = 0,
    SONG = 1,
    QUEUE = 2
}
/**
 * All available plugin types:
 * - `EXTRACTOR` = `"extractor"`: {@link ExtractorPlugin}
 * - `INFO_EXTRACTOR` = `"info-extractor"`: {@link InfoExtractorPlugin}
 * - `PLAYABLE_EXTRACTOR` = `"playable-extractor"`: {@link PlayableExtractorPlugin}
 */
declare enum PluginType {
    EXTRACTOR = "extractor",
    INFO_EXTRACTOR = "info-extractor",
    PLAYABLE_EXTRACTOR = "playable-extractor"
}
type DisTubePlugin = ExtractorPlugin | InfoExtractorPlugin | PlayableExtractorPlugin;
type FFmpegArg = Record<string, string | number | boolean | Array<string | null | undefined> | null | undefined>;
/**
 * FFmpeg arguments for different use cases
 */
type FFmpegArgs = {
    global: FFmpegArg;
    input: FFmpegArg;
    output: FFmpegArg;
};
/**
 * FFmpeg options
 */
type FFmpegOptions = {
    /**
     * Path to the ffmpeg executable
     */
    path: string;
    /**
     * Arguments
     */
    args: FFmpegArgs;
};

/**
 * Default DisTube audio filters.
 */
declare const defaultFilters: Filters;
declare const defaultOptions: {
    plugins: never[];
    emitNewSongOnly: false;
    savePreviousSongs: true;
    nsfw: false;
    emitAddSongWhenCreatingQueue: true;
    emitAddListWhenCreatingQueue: true;
    joinNewVoiceChannel: true;
};

declare const ERROR_MESSAGES: {
    INVALID_TYPE: (expected: (number | string) | readonly (number | string)[], got: any, name?: string) => string;
    NUMBER_COMPARE: (name: string, expected: string, value: number) => string;
    EMPTY_ARRAY: (name: string) => string;
    EMPTY_FILTERED_ARRAY: (name: string, type: string) => string;
    EMPTY_STRING: (name: string) => string;
    INVALID_KEY: (obj: string, key: string) => string;
    MISSING_KEY: (obj: string, key: string) => string;
    MISSING_KEYS: (obj: string, key: string[], all: boolean) => string;
    MISSING_INTENTS: (i: string) => string;
    DISABLED_OPTION: (o: string) => string;
    ENABLED_OPTION: (o: string) => string;
    NOT_IN_VOICE: string;
    VOICE_FULL: string;
    VOICE_ALREADY_CREATED: string;
    VOICE_CONNECT_FAILED: (s: number) => string;
    VOICE_MISSING_PERMS: string;
    VOICE_RECONNECT_FAILED: string;
    VOICE_DIFFERENT_GUILD: string;
    VOICE_DIFFERENT_CLIENT: string;
    FFMPEG_EXITED: (code: number) => string;
    FFMPEG_NOT_INSTALLED: (path: string) => string;
    NO_QUEUE: string;
    QUEUE_EXIST: string;
    QUEUE_STOPPED: string;
    PAUSED: string;
    RESUMED: string;
    NO_PREVIOUS: string;
    NO_UP_NEXT: string;
    NO_SONG_POSITION: string;
    NO_PLAYING_SONG: string;
    NO_RELATED: string;
    CANNOT_PLAY_RELATED: string;
    UNAVAILABLE_VIDEO: string;
    UNPLAYABLE_FORMATS: string;
    NON_NSFW: string;
    NOT_SUPPORTED_URL: string;
    NOT_SUPPORTED_SONG: (song: string) => string;
    NO_VALID_SONG: string;
    CANNOT_RESOLVE_SONG: (t: any) => string;
    CANNOT_GET_STREAM_URL: (song: string) => string;
    CANNOT_GET_SEARCH_QUERY: (song: string) => string;
    NO_RESULT: (query: string) => string;
    NO_STREAM_URL: (song: string) => string;
    EMPTY_FILTERED_PLAYLIST: string;
    EMPTY_PLAYLIST: string;
};
type ErrorMessage = typeof ERROR_MESSAGES;
type ErrorCode = keyof ErrorMessage;
type StaticErrorCode = {
    [K in ErrorCode]-?: ErrorMessage[K] extends string ? K : never;
}[ErrorCode];
type TemplateErrorCode = Exclude<keyof typeof ERROR_MESSAGES, StaticErrorCode>;
declare class DisTubeError<T extends string = any> extends Error {
    errorCode: string;
    constructor(code: T extends StaticErrorCode ? T : never);
    constructor(code: T extends TemplateErrorCode ? T : never, ...args: Parameters<ErrorMessage[typeof code]>);
    constructor(code: TemplateErrorCode, _: never);
    constructor(code: T extends ErrorCode ? never : T, message: string);
    get name(): string;
    get code(): string;
}

/**
 * Task queuing system
 */
declare class TaskQueue {
    #private;
    /**
     * Waits for last task finished and queues a new task
     */
    queuing(): Promise<void>;
    /**
     * Removes the finished task and processes the next task
     */
    resolve(): void;
    /**
     * The remaining number of tasks
     */
    get remaining(): number;
}

/**
 * Class representing a playlist.
 */
declare class Playlist<T = unknown> implements PlaylistInfo {
    #private;
    /**
     * Playlist source.
     */
    source: string;
    /**
     * Songs in the playlist.
     */
    songs: Song[];
    /**
     * Playlist ID.
     */
    id?: string;
    /**
     * Playlist name.
     */
    name?: string;
    /**
     * Playlist URL.
     */
    url?: string;
    /**
     * Playlist thumbnail.
     */
    thumbnail?: string;
    /**
     * Create a Playlist
     * @param playlist  - Raw playlist info
     * @param options   - Optional data
     */
    constructor(playlist: PlaylistInfo, { member, metadata }?: ResolveOptions<T>);
    /**
     * Playlist duration in second.
     */
    get duration(): number;
    /**
     * Formatted duration string `hh:mm:ss`.
     */
    get formattedDuration(): string;
    /**
     * User requested.
     */
    get member(): GuildMember | undefined;
    set member(member: GuildMember | undefined);
    /**
     * User requested.
     */
    get user(): discord_js.User | undefined;
    /**
     * Optional metadata that can be used to identify the playlist.
     */
    get metadata(): T;
    set metadata(metadata: T);
    toString(): string;
}

/**
 * Class representing a song.
 */
declare class Song<T = unknown> {
    #private;
    /**
     * The source of this song info
     */
    source: string;
    /**
     * Song ID.
     */
    id: string;
    /**
     * Song name.
     */
    name?: string;
    /**
     * Indicates if the song is an active live.
     */
    isLive?: boolean;
    /**
     * Song duration.
     */
    duration: number;
    /**
     * Formatted duration string (`hh:mm:ss`, `mm:ss` or `Live`).
     */
    formattedDuration: string;
    /**
     * Song URL.
     */
    url?: string;
    /**
     * Song thumbnail.
     */
    thumbnail?: string;
    /**
     * Song view count
     */
    views?: number;
    /**
     * Song like count
     */
    likes?: number;
    /**
     * Song dislike count
     */
    dislikes?: number;
    /**
     * Song repost (share) count
     */
    reposts?: number;
    /**
     * Song uploader
     */
    uploader: {
        name?: string;
        url?: string;
    };
    /**
     * Whether or not an age-restricted content
     */
    ageRestricted?: boolean;
    /**
     * Stream info
     */
    stream: {
        /**
         * The stream of this song will be played from source
         */
        playFromSource: true;
        /**
         * Stream URL of this song
         */
        url?: string;
    } | {
        /**
         * The stream of this song will be played from another song
         */
        playFromSource: false;
        /**
         * The song that this song will be played from
         */
        song?: Song<T>;
    };
    /**
     * The plugin that created this song
     */
    plugin: DisTubePlugin | null;
    /**
     * Create a Song
     *
     * @param info      - Raw song info
     * @param options   - Optional data
     */
    constructor(info: SongInfo, { member, metadata }?: ResolveOptions<T>);
    /**
     * The playlist this song belongs to
     */
    get playlist(): Playlist | undefined;
    set playlist(playlist: Playlist | undefined);
    /**
     * User requested to play this song.
     */
    get member(): GuildMember | undefined;
    set member(member: GuildMember | undefined);
    /**
     * User requested to play this song.
     */
    get user(): discord_js.User | undefined;
    /**
     * Optional metadata that can be used to identify the song. This is attached by the
     * {@link DisTube#play} method.
     */
    get metadata(): T;
    set metadata(metadata: T);
    toString(): string;
}

declare abstract class DisTubeBase {
    distube: DisTube;
    constructor(distube: DisTube);
    /**
     * Emit the {@link DisTube} of this base
     * @param eventName - Event name
     * @param args      - arguments
     */
    emit(eventName: keyof DisTubeEvents, ...args: any): boolean;
    /**
     * Emit error event
     * @param error   - error
     * @param queue   - The queue encountered the error
     * @param song    - The playing song when encountered the error
     */
    emitError(error: Error, queue: Queue, song?: Song): void;
    /**
     * Emit debug event
     * @param message - debug message
     */
    debug(message: string): void;
    /**
     * The queue manager
     */
    get queues(): QueueManager;
    /**
     * The voice manager
     */
    get voices(): DisTubeVoiceManager;
    /**
     * Discord.js client
     */
    get client(): Client;
    /**
     * DisTube options
     */
    get options(): Options;
    /**
     * DisTube handler
     */
    get handler(): DisTubeHandler;
    /**
     * DisTube plugins
     */
    get plugins(): DisTubePlugin[];
}

/**
 * Create a voice connection to the voice channel
 */
declare class DisTubeVoice extends TypedEmitter<DisTubeVoiceEvents> {
    #private;
    readonly id: Snowflake;
    readonly voices: DisTubeVoiceManager;
    readonly audioPlayer: AudioPlayer;
    connection: VoiceConnection;
    emittedError: boolean;
    isDisconnected: boolean;
    stream?: DisTubeStream;
    constructor(voiceManager: DisTubeVoiceManager, channel: VoiceBasedChannel);
    /**
     * The voice channel id the bot is in
     */
    get channelId(): string | undefined;
    get channel(): VoiceBasedChannel;
    set channel(channel: VoiceBasedChannel);
    /**
     * Join a voice channel with this connection
     * @param channel - A voice channel
     */
    join(channel?: VoiceBasedChannel): Promise<DisTubeVoice>;
    /**
     * Leave the voice channel of this connection
     * @param error - Optional, an error to emit with 'error' event.
     */
    leave(error?: Error): void;
    /**
     * Stop the playing stream
     * @param force - If true, will force the {@link DisTubeVoice#audioPlayer} to enter the Idle state even
     *                if the {@link DisTubeStream#audioResource} has silence padding frames.
     */
    stop(force?: boolean): void;
    /**
     * Play a {@link DisTubeStream}
     * @param dtStream - DisTubeStream
     */
    play(dtStream: DisTubeStream): void;
    set volume(volume: number);
    /**
     * Get or set the volume percentage
     */
    get volume(): number;
    /**
     * Playback duration of the audio resource in seconds
     */
    get playbackDuration(): number;
    pause(): void;
    unpause(): void;
    /**
     * Whether the bot is self-deafened
     */
    get selfDeaf(): boolean;
    /**
     * Whether the bot is self-muted
     */
    get selfMute(): boolean;
    /**
     * Self-deafens/undeafens the bot.
     * @param selfDeaf - Whether or not the bot should be self-deafened
     * @returns true if the voice state was successfully updated, otherwise false
     */
    setSelfDeaf(selfDeaf: boolean): boolean;
    /**
     * Self-mutes/unmutes the bot.
     * @param selfMute - Whether or not the bot should be self-muted
     * @returns true if the voice state was successfully updated, otherwise false
     */
    setSelfMute(selfMute: boolean): boolean;
    /**
     * The voice state of this connection
     */
    get voiceState(): VoiceState | undefined;
}

/**
 * Options for {@link DisTubeStream}
 */
interface StreamOptions {
    /**
     * FFmpeg options
     */
    ffmpeg: FFmpegOptions;
    /**
     * Seek time (in seconds).
     * @default 0
     */
    seek?: number;
}
declare const checkFFmpeg: (distube: DisTube) => void;
/**
 * Create a stream to play with {@link DisTubeVoice}
 */
declare class DisTubeStream extends TypedEmitter<{
    debug: (debug: string) => Awaitable;
    error: (error: Error) => Awaitable;
}> {
    #private;
    process?: ChildProcess;
    stream: VolumeTransformer;
    audioResource: AudioResource;
    /**
     * Create a DisTubeStream to play with {@link DisTubeVoice}
     * @param url     - Stream URL
     * @param options - Stream options
     */
    constructor(url: string, options: StreamOptions);
    spawn(): void;
    private debug;
    setVolume(volume: number): void;
    kill(): void;
}
declare class VolumeTransformer extends Transform {
    private buffer;
    private readonly extrema;
    vol: number;
    _transform(newChunk: Buffer, _encoding: BufferEncoding, done: TransformCallback): void;
}

/**
 * DisTube's Handler
 */
declare class DisTubeHandler extends DisTubeBase {
    #private;
    resolve<T = unknown>(song: Song<T>, options?: Omit<ResolveOptions, "metadata">): Promise<Song<T>>;
    resolve<T = unknown>(song: Playlist<T>, options?: Omit<ResolveOptions, "metadata">): Promise<Playlist<T>>;
    resolve<T = unknown>(song: string, options?: ResolveOptions<T>): Promise<Song<T> | Playlist<T>>;
    resolve<T = unknown>(song: Song, options: ResolveOptions<T>): Promise<Song<T>>;
    resolve<T = unknown>(song: Playlist, options: ResolveOptions<T>): Promise<Playlist<T>>;
    resolve(song: string | Song | Playlist, options?: ResolveOptions): Promise<Song | Playlist>;
    _getPluginFromURL(url: string): Promise<DisTubePlugin | null>;
    _getPluginFromSong(song: Song): Promise<DisTubePlugin | null>;
    _getPluginFromSong<T extends PluginType>(song: Song, types: T[], validate?: boolean): Promise<(DisTubePlugin & {
        type: T;
    }) | null>;
    /**
     * Get {@link Song}'s stream info and attach it to the song.
     * @param song - A Song
     */
    attachStreamInfo(song: Song): Promise<void>;
    followRedirectLink(url: string, maxRedirect?: number): Promise<string>;
}

declare class Options {
    #private;
    plugins: DisTubePlugin[];
    emitNewSongOnly: boolean;
    savePreviousSongs: boolean;
    customFilters?: Filters;
    nsfw: boolean;
    emitAddSongWhenCreatingQueue: boolean;
    emitAddListWhenCreatingQueue: boolean;
    joinNewVoiceChannel: boolean;
    ffmpeg: FFmpegOptions;
    constructor(options: DisTubeOptions);
}

/**
 * Manages the collection of a data model.
 */
declare abstract class BaseManager<V> extends DisTubeBase {
    /**
     * The collection of items for this manager.
     */
    collection: Collection<string, V>;
    /**
     * The size of the collection.
     */
    get size(): number;
}

/**
 * Manages the collection of a data model paired with a guild id.
 */
declare abstract class GuildIdManager<V> extends BaseManager<V> {
    add(idOrInstance: GuildIdResolvable, data: V): this;
    get(idOrInstance: GuildIdResolvable): V | undefined;
    remove(idOrInstance: GuildIdResolvable): boolean;
    has(idOrInstance: GuildIdResolvable): boolean;
}

/**
 * Manages voice connections
 */
declare class DisTubeVoiceManager extends GuildIdManager<DisTubeVoice> {
    /**
     * Create a {@link DisTubeVoice} instance
     * @param channel - A voice chann el to join
     */
    create(channel: VoiceBasedChannel): DisTubeVoice;
    /**
     * Join a voice channel and wait until the connection is ready
     * @param channel - A voice channel to join
     */
    join(channel: VoiceBasedChannel): Promise<DisTubeVoice>;
    /**
     * Leave the connected voice channel in a guild
     * @param guild - Queue Resolvable
     */
    leave(guild: GuildIdResolvable): void;
}

/**
 * Manage filters of a playing {@link Queue}
 */
declare class FilterManager extends BaseManager<Filter> {
    #private;
    /**
     * The queue to manage
     */
    queue: Queue;
    constructor(queue: Queue);
    /**
     * Enable a filter or multiple filters to the manager
     * @param filterOrFilters - The filter or filters to enable
     * @param override        - Wether or not override the applied filter with new filter value
     */
    add(filterOrFilters: FilterResolvable | FilterResolvable[], override?: boolean): this;
    /**
     * Clear enabled filters of the manager
     */
    clear(): this;
    /**
     * Set the filters applied to the manager
     * @param filters - The filters to apply
     */
    set(filters: FilterResolvable[]): this;
    /**
     * Disable a filter or multiple filters
     * @param filterOrFilters - The filter or filters to disable
     */
    remove(filterOrFilters: FilterResolvable | FilterResolvable[]): this;
    /**
     * Check whether a filter enabled or not
     * @param filter - The filter to check
     */
    has(filter: FilterResolvable): boolean;
    /**
     * Array of enabled filter names
     */
    get names(): string[];
    /**
     * Array of enabled filters
     */
    get values(): Filter[];
    get ffmpegArgs(): FFmpegArg;
    toString(): string;
}

/**
 * Queue manager
 */
declare class QueueManager extends GuildIdManager<Queue> {
    #private;
    /**
     * Create a {@link Queue}
     * @param channel     - A voice channel
     * @param textChannel - Default text channel
     * @returns Returns `true` if encounter an error
     */
    create(channel: VoiceBasedChannel, textChannel?: GuildTextBasedChannel): Promise<Queue>;
    /**
     * Play a song on voice connection with queue properties
     * @param queue         - The guild queue to play
     * @param emitPlaySong  - Whether or not emit {@link Events.PLAY_SONG} event
     */
    playSong(queue: Queue, emitPlaySong?: boolean): Promise<void>;
}

/**
 * Represents a queue.
 */
declare class Queue extends DisTubeBase {
    #private;
    /**
     * Queue id (Guild id)
     */
    readonly id: Snowflake;
    /**
     * Voice connection of this queue.
     */
    voice: DisTubeVoice;
    /**
     * List of songs in the queue (The first one is the playing song)
     */
    songs: Song[];
    /**
     * List of the previous songs.
     */
    previousSongs: Song[];
    /**
     * Whether stream is currently stopped.
     */
    stopped: boolean;
    /**
     * Whether or not the stream is currently playing.
     */
    playing: boolean;
    /**
     * Whether or not the stream is currently paused.
     */
    paused: boolean;
    /**
     * Type of repeat mode (`0` is disabled, `1` is repeating a song, `2` is repeating
     * all the queue). Default value: `0` (disabled)
     */
    repeatMode: RepeatMode;
    /**
     * Whether or not the autoplay mode is enabled. Default value: `false`
     */
    autoplay: boolean;
    /**
     * FFmpeg arguments for the current queue. Default value is defined with {@link DisTubeOptions}.ffmpeg.args.
     * `af` output argument will be replaced with {@link Queue#filters} manager
     */
    ffmpegArgs: FFmpegArgs;
    /**
     * The text channel of the Queue. (Default: where the first command is called).
     */
    textChannel?: GuildTextBasedChannel;
    /**
     * What time in the song to begin (in seconds).
     */
    _beginTime: number;
    /**
     * Whether or not the last song was skipped to next song.
     */
    _next: boolean;
    /**
     * Whether or not the last song was skipped to previous song.
     */
    _prev: boolean;
    /**
     * Task queuing system
     */
    _taskQueue: TaskQueue;
    /**
     * {@link DisTubeVoice} listener
     */
    _listeners?: DisTubeVoiceEvents;
    /**
     * Create a queue for the guild
     * @param distube     - DisTube
     * @param voice       - Voice connection
     * @param textChannel - Default text channel
     */
    constructor(distube: DisTube, voice: DisTubeVoice, textChannel?: GuildTextBasedChannel);
    /**
     * The client user as a `GuildMember` of this queue's guild
     */
    get clientMember(): discord_js.GuildMember | undefined;
    /**
     * The filter manager of the queue
     */
    get filters(): FilterManager;
    /**
     * Formatted duration string.
     */
    get formattedDuration(): string;
    /**
     * Queue's duration.
     */
    get duration(): number;
    /**
     * What time in the song is playing (in seconds).
     */
    get currentTime(): number;
    /**
     * Formatted {@link Queue#currentTime} string.
     */
    get formattedCurrentTime(): string;
    /**
     * The voice channel playing in.
     */
    get voiceChannel(): discord_js.VoiceBasedChannel | null;
    /**
     * Get or set the stream volume. Default value: `50`.
     */
    get volume(): number;
    set volume(value: number);
    /**
     * @throws {DisTubeError}
     * @param song     - Song to add
     * @param position - Position to add, \<= 0 to add to the end of the queue
     * @returns The guild queue
     */
    addToQueue(song: Song | Song[], position?: number): Queue;
    /**
     * Pause the guild stream
     * @returns The guild queue
     */
    pause(): Queue;
    /**
     * Resume the guild stream
     * @returns The guild queue
     */
    resume(): Queue;
    /**
     * Set the guild stream's volume
     * @param percent - The percentage of volume you want to set
     * @returns The guild queue
     */
    setVolume(percent: number): Queue;
    /**
     * Skip the playing song if there is a next song in the queue. <info>If {@link
     * Queue#autoplay} is `true` and there is no up next song, DisTube will add and
     * play a related song.</info>
     * @returns The song will skip to
     */
    skip(): Promise<Song>;
    /**
     * Play the previous song if exists
     * @returns The guild queue
     */
    previous(): Promise<Song>;
    /**
     * Shuffle the queue's songs
     * @returns The guild queue
     */
    shuffle(): Promise<Queue>;
    /**
     * Jump to the song position in the queue. The next one is 1, 2,... The previous
     * one is -1, -2,...
     * if `num` is invalid number
     * @param position - The song position to play
     * @returns The new Song will be played
     */
    jump(position: number): Promise<Song>;
    /**
     * Set the repeat mode of the guild queue.
     * Toggle mode `(Disabled -> Song -> Queue -> Disabled ->...)` if `mode` is `undefined`
     * @param mode - The repeat modes (toggle if `undefined`)
     * @returns The new repeat mode
     */
    setRepeatMode(mode?: RepeatMode): RepeatMode;
    /**
     * Set the playing time to another position
     * @param time - Time in seconds
     * @returns The guild queue
     */
    seek(time: number): Queue;
    /**
     * Add a related song of the playing song to the queue
     * @returns The added song
     */
    addRelatedSong(): Promise<Song>;
    /**
     * Stop the guild stream and delete the queue
     */
    stop(): Promise<void>;
    /**
     * Remove the queue from the manager
     */
    remove(): void;
    /**
     * Toggle autoplay mode
     * @returns Autoplay mode state
     */
    toggleAutoplay(): boolean;
    /**
     * Play the queue
     * @param emitPlaySong - Whether or not emit {@link Events.PLAY_SONG} event
     */
    play(emitPlaySong?: boolean): Promise<void>;
}

/**
 * DisTube Plugin
 */
declare abstract class Plugin {
    /**
     * Type of the plugin
     */
    abstract readonly type: PluginType;
    /**
     * DisTube
     */
    distube: DisTube;
    init(distube: DisTube): void;
    /**
     * Get related songs from a supported url.
     * @param song - Input song
     */
    abstract getRelatedSongs(song: Song): Awaitable<Song[]>;
}

/**
 * This plugin can extract the info, search, and play a song directly from its source
 */
declare abstract class ExtractorPlugin extends Plugin {
    readonly type = PluginType.EXTRACTOR;
    /**
     * Check if the url is working with this plugin
     * @param url - Input url
     */
    abstract validate(url: string): Awaitable<boolean>;
    /**
     * Resolve the validated url to a {@link Song} or a {@link Playlist}.
     * @param url     - URL
     * @param options - Optional options
     */
    abstract resolve<T>(url: string, options: ResolveOptions<T>): Awaitable<Song<T> | Playlist<T>>;
    /**
     * Search for a Song which playable from this plugin's source
     * @param query   - Search query
     * @param options - Optional options
     */
    abstract searchSong<T>(query: string, options: ResolveOptions<T>): Awaitable<Song<T> | null>;
    /**
     * Get the stream url from {@link Song#url}. Returns {@link Song#url} by default.
     * Not needed if the plugin plays song from YouTube.
     * @param song - Input song
     */
    abstract getStreamURL<T>(song: Song<T>): Awaitable<string>;
}

/**
 * This plugin only can extract the info from supported links, but not play song directly from its source
 */
declare abstract class InfoExtractorPlugin extends Plugin {
    readonly type = PluginType.INFO_EXTRACTOR;
    /**
     * Check if the url is working with this plugin
     * @param url - Input url
     */
    abstract validate(url: string): Awaitable<boolean>;
    /**
     * Resolve the validated url to a {@link Song} or a {@link Playlist}.
     * @param url     - URL
     * @param options - Optional options
     */
    abstract resolve<T>(url: string, options: ResolveOptions<T>): Awaitable<Song<T> | Playlist<T>>;
    /**
     * Create a search query to be used in {@link ExtractorPlugin#searchSong}
     * @param song - Input song
     */
    abstract createSearchQuery<T>(song: Song<T>): Awaitable<string>;
}

/**
 * This plugin can extract and play song from supported links, but cannot search for songs from its source
 */
declare abstract class PlayableExtractorPlugin extends Plugin {
    readonly type = PluginType.PLAYABLE_EXTRACTOR;
    /**
     * Check if the url is working with this plugin
     * @param url - Input url
     */
    abstract validate(url: string): Awaitable<boolean>;
    /**
     * Resolve the validated url to a {@link Song} or a {@link Playlist}.
     * @param url     - URL
     * @param options - Optional options
     */
    abstract resolve<T>(url: string, options: ResolveOptions<T>): Awaitable<Song<T> | Playlist<T>>;
    /**
     * Get the stream url from {@link Song#url}. Returns {@link Song#url} by default.
     * Not needed if the plugin plays song from YouTube.
     * @param song - Input song
     */
    abstract getStreamURL<T>(song: Song<T>): Awaitable<string>;
}

/**
 * Format duration to string
 * @param sec - Duration in seconds
 */
declare function formatDuration(sec: number): string;
declare const SUPPORTED_PROTOCOL: readonly ["https:", "http:", "file:"];
/**
 * Check if the string is an URL
 * @param input - input
 */
declare function isURL(input: any): input is `${(typeof SUPPORTED_PROTOCOL)[number]}//${string}`;
/**
 * Check if the Client has enough intents to using DisTube
 * @param options - options
 */
declare function checkIntents(options: ClientOptions): void;
/**
 * Check if the voice channel is empty
 * @param voiceState - voiceState
 */
declare function isVoiceChannelEmpty(voiceState: VoiceState): boolean;
declare function isSnowflake(id: any): id is Snowflake;
declare function isMemberInstance(member: any): member is GuildMember;
declare function isTextChannelInstance(channel: any): channel is GuildTextBasedChannel;
declare function isMessageInstance(message: any): message is Message<true>;
declare function isSupportedVoiceChannel(channel: any): channel is VoiceBasedChannel;
declare function isGuildInstance(guild: any): guild is Guild;
declare function resolveGuildId(resolvable: GuildIdResolvable): Snowflake;
declare function isClientInstance(client: any): client is Client;
declare function checkInvalidKey(target: Record<string, any>, source: Record<string, any> | string[], sourceName: string): void;
declare function isObject(obj: any): obj is object;
type KeyOf<T> = T extends object ? (keyof T)[] : [];
declare function objectKeys<T>(obj: T): KeyOf<T>;
declare function isNsfwChannel(channel?: GuildTextBasedChannel): boolean;
type Falsy = undefined | null | false | 0 | "";
declare const isTruthy: <T>(x: T | Falsy) => x is T;

declare const version: string;
/**
 * DisTube class
 */
declare class DisTube extends TypedEmitter<TypedDisTubeEvents> {
    #private;
    /**
     * @event
     * Emitted after DisTube add a new playlist to the playing {@link Queue}.
     * @param queue    - The guild queue
     * @param playlist - Playlist info
     */
    static readonly [Events.ADD_LIST]: (queue: Queue, playlist: Playlist) => Awaitable;
    /**
     * @event
     * Emitted after DisTube add a new song to the playing {@link Queue}.
     * @param queue - The guild queue
     * @param song  - Added song
     */
    static readonly [Events.ADD_SONG]: (queue: Queue, song: Song) => Awaitable;
    /**
     * @event
     * Emitted when a {@link Queue} is deleted with any reasons.
     * @param queue - The guild queue
     */
    static readonly [Events.DELETE_QUEUE]: (queue: Queue) => Awaitable;
    /**
     * @event
     * Emitted when the bot is disconnected to a voice channel.
     * @param queue - The guild queue
     */
    static readonly [Events.DISCONNECT]: (queue: Queue) => Awaitable;
    /**
     * @event
     * Emitted when DisTube encounters an error while playing songs.
     * @param error   - error
     * @param queue   - The queue encountered the error
     * @param song    - The playing song when encountered the error
     */
    static readonly [Events.ERROR]: (error: Error, queue: Queue, song?: Song) => Awaitable;
    /**
     * @event
     * Emitted for logging FFmpeg debug information.
     * @param debug - Debug message string.
     */
    static readonly [Events.FFMPEG_DEBUG]: (debug: string) => Awaitable;
    /**
     * @event
     * Emitted to provide debug information from DisTube's operation.
     * Useful for troubleshooting or logging purposes.
     *
     * @param debug - Debug message string.
     */
    static readonly [Events.DEBUG]: (debug: string) => Awaitable;
    /**
     * @event
     * Emitted when there is no more song in the queue and {@link Queue#autoplay} is `false`.
     * @param queue - The guild queue
     */
    static readonly [Events.FINISH]: (queue: Queue) => Awaitable;
    /**
     * @event
     * Emitted when DisTube finished a song.
     * @param queue - The guild queue
     * @param song  - Finished song
     */
    static readonly [Events.FINISH_SONG]: (queue: Queue, song: Song) => Awaitable;
    /**
     * @event
     * Emitted when DisTube initialize a queue to change queue default properties.
     * @param queue - The guild queue
     */
    static readonly [Events.INIT_QUEUE]: (queue: Queue) => Awaitable;
    /**
     * @event
     * Emitted when {@link Queue#autoplay} is `true`, {@link Queue#songs} is empty, and
     * DisTube cannot find related songs to play.
     * @param queue - The guild queue
     */
    static readonly [Events.NO_RELATED]: (queue: Queue) => Awaitable;
    /**
     * @event
     * Emitted when DisTube play a song.
     * If {@link DisTubeOptions}.emitNewSongOnly is `true`, this event is not emitted
     * when looping a song or next song is the previous one.
     * @param queue - The guild queue
     * @param song  - Playing song
     */
    static readonly [Events.PLAY_SONG]: (queue: Queue, song: Song) => Awaitable;
    /**
     * DisTube internal handler
     */
    readonly handler: DisTubeHandler;
    /**
     * DisTube options
     */
    readonly options: Options;
    /**
     * Discord.js v14 client
     */
    readonly client: Client;
    /**
     * Queues manager
     */
    readonly queues: QueueManager;
    /**
     * DisTube voice connections manager
     */
    readonly voices: DisTubeVoiceManager;
    /**
     * DisTube plugins
     */
    readonly plugins: DisTubePlugin[];
    /**
     * DisTube ffmpeg audio filters
     */
    readonly filters: Filters;
    /**
     * Create a new DisTube class.
     * @throws {@link DisTubeError}
     * @param client - Discord.JS client
     * @param opts   - Custom DisTube options
     */
    constructor(client: Client, opts?: DisTubeOptions);
    static get version(): string;
    /**
     * DisTube version
     */
    get version(): string;
    /**
     * Play / add a song or playlist from url.
     * Search and play a song (with {@link ExtractorPlugin}) if it is not a valid url.
     * @throws {@link DisTubeError}
     * @param voiceChannel - The channel will be joined if the bot isn't in any channels, the bot will be
     *                       moved to this channel if {@link DisTubeOptions}.joinNewVoiceChannel is `true`
     * @param song         - URL | Search string | {@link Song} | {@link Playlist}
     * @param options      - Optional options
     */
    play<T = unknown>(voiceChannel: VoiceBasedChannel, song: string | Song | Playlist, options?: PlayOptions<T>): Promise<void>;
    /**
     * Create a custom playlist
     * @param songs   - Array of url or Song
     * @param options - Optional options
     */
    createCustomPlaylist(songs: (string | Song)[], { member, parallel, metadata, name, source, url, thumbnail }?: CustomPlaylistOptions): Promise<Playlist>;
    /**
     * Get the guild queue
     * @param guild - The type can be resolved to give a {@link Queue}
     */
    getQueue(guild: GuildIdResolvable): Queue | undefined;
    /**
     * Pause the guild stream
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns The guild queue
     */
    pause(guild: GuildIdResolvable): Queue;
    /**
     * Resume the guild stream
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns The guild queue
     */
    resume(guild: GuildIdResolvable): Queue;
    /**
     * Stop the guild stream
     * @param guild - The type can be resolved to give a {@link Queue}
     */
    stop(guild: GuildIdResolvable): Promise<void>;
    /**
     * Set the guild stream's volume
     * @param guild   - The type can be resolved to give a {@link Queue}
     * @param percent - The percentage of volume you want to set
     * @returns The guild queue
     */
    setVolume(guild: GuildIdResolvable, percent: number): Queue;
    /**
     * Skip the playing song if there is a next song in the queue. <info>If {@link
     * Queue#autoplay} is `true` and there is no up next song, DisTube will add and
     * play a related song.</info>
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns The new Song will be played
     */
    skip(guild: GuildIdResolvable): Promise<Song>;
    /**
     * Play the previous song
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns The new Song will be played
     */
    previous(guild: GuildIdResolvable): Promise<Song>;
    /**
     * Shuffle the guild queue songs
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns The guild queue
     */
    shuffle(guild: GuildIdResolvable): Promise<Queue>;
    /**
     * Jump to the song number in the queue. The next one is 1, 2,... The previous one
     * is -1, -2,...
     * @param guild - The type can be resolved to give a {@link Queue}
     * @param num   - The song number to play
     * @returns The new Song will be played
     */
    jump(guild: GuildIdResolvable, num: number): Promise<Song>;
    /**
     * Set the repeat mode of the guild queue.
     * Toggle mode `(Disabled -> Song -> Queue -> Disabled ->...)` if `mode` is `undefined`
     * @param guild - The type can be resolved to give a {@link Queue}
     * @param mode  - The repeat modes (toggle if `undefined`)
     * @returns The new repeat mode
     */
    setRepeatMode(guild: GuildIdResolvable, mode?: RepeatMode): RepeatMode;
    /**
     * Toggle autoplay mode
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns Autoplay mode state
     */
    toggleAutoplay(guild: GuildIdResolvable): boolean;
    /**
     * Add related song to the queue
     * @param guild - The type can be resolved to give a {@link Queue}
     * @returns The guild queue
     */
    addRelatedSong(guild: GuildIdResolvable): Promise<Song>;
    /**
     * Set the playing time to another position
     * @param guild - The type can be resolved to give a {@link Queue}
     * @param time  - Time in seconds
     * @returns Seeked queue
     */
    seek(guild: GuildIdResolvable, time: number): Queue;
    /**
     * Emit error event
     * @param error   - error
     * @param queue   - The queue encountered the error
     * @param song    - The playing song when encountered the error
     */
    emitError(error: Error, queue: Queue, song?: Song): void;
    /**
     * Emit debug event
     * @param message - debug message
     */
    debug(message: string): void;
}

export { type Awaitable, BaseManager, type CustomPlaylistOptions, DisTube, DisTubeBase, DisTubeError, type DisTubeEvents, DisTubeHandler, type DisTubeOptions, type DisTubePlugin, DisTubeStream, DisTubeVoice, type DisTubeVoiceEvents, DisTubeVoiceManager, Events, ExtractorPlugin, type FFmpegArg, type FFmpegArgs, type FFmpegOptions, type Falsy, type Filter, FilterManager, type FilterResolvable, type Filters, GuildIdManager, type GuildIdResolvable, InfoExtractorPlugin, type KeyOf, Options, type PlayHandlerOptions, type PlayOptions, PlayableExtractorPlugin, Playlist, type PlaylistInfo, Plugin, PluginType, Queue, QueueManager, type RelatedSong, RepeatMode, type ResolveOptions, type ResolvePlaylistOptions, Song, type SongInfo, type StreamOptions, TaskQueue, type TypedDisTubeEvents, checkFFmpeg, checkIntents, checkInvalidKey, DisTube as default, defaultFilters, defaultOptions, formatDuration, isClientInstance, isGuildInstance, isMemberInstance, isMessageInstance, isNsfwChannel, isObject, isSnowflake, isSupportedVoiceChannel, isTextChannelInstance, isTruthy, isURL, isVoiceChannelEmpty, objectKeys, resolveGuildId, version };
