"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const filter_js_1 = require("./filter.js");
const checker = {
    filterQuery(filter) {
        const pred = (0, filter_js_1.matchFilter)(filter);
        return (ctx) => pred(ctx);
    },
    text(trigger) {
        const hasText = checker.filterQuery([":text", ":caption"]);
        const trg = triggerFn(trigger);
        return (ctx) => {
            var _a, _b;
            if (!hasText(ctx))
                return false;
            const msg = (_a = ctx.message) !== null && _a !== void 0 ? _a : ctx.channelPost;
            const txt = (_b = msg.text) !== null && _b !== void 0 ? _b : msg.caption;
            return match(ctx, txt, trg);
        };
    },
    command(command) {
        const hasEntities = checker.filterQuery(":entities:bot_command");
        const atCommands = new Set();
        const noAtCommands = new Set();
        toArray(command).forEach((cmd) => {
            if (cmd.startsWith("/")) {
                throw new Error(`Do not include '/' when registering command handlers (use '${cmd.substring(1)}' not '${cmd}')`);
            }
            const set = cmd.includes("@") ? atCommands : noAtCommands;
            set.add(cmd);
        });
        return (ctx) => {
            var _a, _b;
            if (!hasEntities(ctx))
                return false;
            const msg = (_a = ctx.message) !== null && _a !== void 0 ? _a : ctx.channelPost;
            const txt = (_b = msg.text) !== null && _b !== void 0 ? _b : msg.caption;
            return msg.entities.some((e) => {
                if (e.type !== "bot_command")
                    return false;
                if (e.offset !== 0)
                    return false;
                const cmd = txt.substring(1, e.length);
                if (noAtCommands.has(cmd) || atCommands.has(cmd)) {
                    ctx.match = txt.substring(cmd.length + 1).trimStart();
                    return true;
                }
                const index = cmd.indexOf("@");
                if (index === -1)
                    return false;
                const atTarget = cmd.substring(index + 1).toLowerCase();
                const username = ctx.me.username.toLowerCase();
                if (atTarget !== username)
                    return false;
                const atCommand = cmd.substring(0, index);
                if (noAtCommands.has(atCommand)) {
                    ctx.match = txt.substring(cmd.length + 1).trimStart();
                    return true;
                }
                return false;
            });
        };
    },
    reaction(reaction) {
        const hasMessageReaction = checker.filterQuery("message_reaction");
        const normalized = typeof reaction === "string"
            ? [{ type: "emoji", emoji: reaction }]
            : (Array.isArray(reaction) ? reaction : [reaction]).map((emoji) => typeof emoji === "string" ? { type: "emoji", emoji } : emoji);
        const emoji = new Set(normalized.filter((r) => r.type === "emoji")
            .map((r) => r.emoji));
        const customEmoji = new Set(normalized.filter((r) => r.type === "custom_emoji")
            .map((r) => r.custom_emoji_id));
        const paid = normalized.some((r) => r.type === "paid");
        return (ctx) => {
            if (!hasMessageReaction(ctx))
                return false;
            const { old_reaction, new_reaction } = ctx.messageReaction;
            // try to find a wanted reaction that is new and not old
            for (const reaction of new_reaction) {
                // first check if the reaction existed previously
                let isOld = false;
                if (reaction.type === "emoji") {
                    for (const old of old_reaction) {
                        if (old.type !== "emoji")
                            continue;
                        if (old.emoji === reaction.emoji) {
                            isOld = true;
                            break;
                        }
                    }
                }
                else if (reaction.type === "custom_emoji") {
                    for (const old of old_reaction) {
                        if (old.type !== "custom_emoji")
                            continue;
                        if (old.custom_emoji_id === reaction.custom_emoji_id) {
                            isOld = true;
                            break;
                        }
                    }
                }
                else if (reaction.type === "paid") {
                    for (const old of old_reaction) {
                        if (old.type !== "paid")
                            continue;
                        isOld = true;
                        break;
                    }
                }
                else {
                    // always regard unsupported emoji types as new
                }
                // disregard reaction if it is not new
                if (isOld)
                    continue;
                // check if the new reaction is wanted and short-circuit
                if (reaction.type === "emoji") {
                    if (emoji.has(reaction.emoji))
                        return true;
                }
                else if (reaction.type === "custom_emoji") {
                    if (customEmoji.has(reaction.custom_emoji_id))
                        return true;
                }
                else if (reaction.type === "paid") {
                    if (paid)
                        return true;
                }
                else {
                    // always regard unsupported emoji types as new
                    return true;
                }
                // new reaction not wanted, check next one
            }
            return false;
        };
    },
    chatType(chatType) {
        const set = new Set(toArray(chatType));
        return (ctx) => { var _a; return ((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.type) !== undefined && set.has(ctx.chat.type); };
    },
    callbackQuery(trigger) {
        const hasCallbackQuery = checker.filterQuery("callback_query:data");
        const trg = triggerFn(trigger);
        return (ctx) => hasCallbackQuery(ctx) && match(ctx, ctx.callbackQuery.data, trg);
    },
    gameQuery(trigger) {
        const hasGameQuery = checker.filterQuery("callback_query:game_short_name");
        const trg = triggerFn(trigger);
        return (ctx) => hasGameQuery(ctx) &&
            match(ctx, ctx.callbackQuery.game_short_name, trg);
    },
    inlineQuery(trigger) {
        const hasInlineQuery = checker.filterQuery("inline_query");
        const trg = triggerFn(trigger);
        return (ctx) => hasInlineQuery(ctx) && match(ctx, ctx.inlineQuery.query, trg);
    },
    chosenInlineResult(trigger) {
        const hasChosenInlineResult = checker.filterQuery("chosen_inline_result");
        const trg = triggerFn(trigger);
        return (ctx) => hasChosenInlineResult(ctx) &&
            match(ctx, ctx.chosenInlineResult.result_id, trg);
    },
    preCheckoutQuery(trigger) {
        const hasPreCheckoutQuery = checker.filterQuery("pre_checkout_query");
        const trg = triggerFn(trigger);
        return (ctx) => hasPreCheckoutQuery(ctx) &&
            match(ctx, ctx.preCheckoutQuery.invoice_payload, trg);
    },
    shippingQuery(trigger) {
        const hasShippingQuery = checker.filterQuery("shipping_query");
        const trg = triggerFn(trigger);
        return (ctx) => hasShippingQuery(ctx) &&
            match(ctx, ctx.shippingQuery.invoice_payload, trg);
    },
};
// === Context class
/**
 * When your bot receives a message, Telegram sends an update object to your
 * bot. The update contains information about the chat, the user, and of course
 * the message itself. There are numerous other updates, too:
 * https://core.telegram.org/bots/api#update
 *
 * When grammY receives an update, it wraps this update into a context object
 * for you. Context objects are commonly named `ctx`. A context object does two
 * things:
 * 1. **`ctx.update`** holds the update object that you can use to process the
 *    message. This includes providing useful shortcuts for the update, for
 *    instance, `ctx.msg` is a shortcut that gives you the message object from
 *    the update—no matter whether it is contained in `ctx.update.message`, or
 *    `ctx.update.edited_message`, or `ctx.update.channel_post`, or
 *    `ctx.update.edited_channel_post`.
 * 2. **`ctx.api`** gives you access to the full Telegram Bot API so that you
 *    can directly call any method, such as responding via
 *    `ctx.api.sendMessage`. Also here, the context objects has some useful
 *    shortcuts for you. For instance, if you want to send a message to the same
 *    chat that a message comes from (i.e. just respond to a user) you can call
 *    `ctx.reply`. This is nothing but a wrapper for `ctx.api.sendMessage` with
 *    the right `chat_id` pre-filled for you. Almost all methods of the Telegram
 *    Bot API have their own shortcut directly on the context object, so you
 *    probably never really have to use `ctx.api` at all.
 *
 * This context object is then passed to all of the listeners (called
 * middleware) that you register on your bot. Because this is so useful, the
 * context object is often used to hold more information. One example are
 * sessions (a chat-specific data storage that is stored in a database), and
 * another example is `ctx.match` that is used by `bot.command` and other
 * methods to keep information about how a regular expression was matched.
 *
 * Read up about middleware on the
 * [website](https://grammy.dev/guide/context) if you want to know more
 * about the powerful opportunities that lie in context objects, and about how
 * grammY implements them.
 */
class Context {
    constructor(
    /**
     * The update object that is contained in the context.
     */
    update, 
    /**
     * An API instance that allows you to call any method of the Telegram
     * Bot API.
     */
    api, 
    /**
     * Information about the bot itself.
     */
    me) {
        this.update = update;
        this.api = api;
        this.me = me;
    }
    // UPDATE SHORTCUTS
    // Keep in sync with types in `filter.ts`.
    /** Alias for `ctx.update.message` */
    get message() {
        return this.update.message;
    }
    /** Alias for `ctx.update.edited_message` */
    get editedMessage() {
        return this.update.edited_message;
    }
    /** Alias for `ctx.update.channel_post` */
    get channelPost() {
        return this.update.channel_post;
    }
    /** Alias for `ctx.update.edited_channel_post` */
    get editedChannelPost() {
        return this.update.edited_channel_post;
    }
    /** Alias for `ctx.update.business_connection` */
    get businessConnection() {
        return this.update.business_connection;
    }
    /** Alias for `ctx.update.business_message` */
    get businessMessage() {
        return this.update.business_message;
    }
    /** Alias for `ctx.update.edited_business_message` */
    get editedBusinessMessage() {
        return this.update.edited_business_message;
    }
    /** Alias for `ctx.update.deleted_business_messages` */
    get deletedBusinessMessages() {
        return this.update.deleted_business_messages;
    }
    /** Alias for `ctx.update.message_reaction` */
    get messageReaction() {
        return this.update.message_reaction;
    }
    /** Alias for `ctx.update.message_reaction_count` */
    get messageReactionCount() {
        return this.update.message_reaction_count;
    }
    /** Alias for `ctx.update.inline_query` */
    get inlineQuery() {
        return this.update.inline_query;
    }
    /** Alias for `ctx.update.chosen_inline_result` */
    get chosenInlineResult() {
        return this.update.chosen_inline_result;
    }
    /** Alias for `ctx.update.callback_query` */
    get callbackQuery() {
        return this.update.callback_query;
    }
    /** Alias for `ctx.update.shipping_query` */
    get shippingQuery() {
        return this.update.shipping_query;
    }
    /** Alias for `ctx.update.pre_checkout_query` */
    get preCheckoutQuery() {
        return this.update.pre_checkout_query;
    }
    /** Alias for `ctx.update.poll` */
    get poll() {
        return this.update.poll;
    }
    /** Alias for `ctx.update.poll_answer` */
    get pollAnswer() {
        return this.update.poll_answer;
    }
    /** Alias for `ctx.update.my_chat_member` */
    get myChatMember() {
        return this.update.my_chat_member;
    }
    /** Alias for `ctx.update.chat_member` */
    get chatMember() {
        return this.update.chat_member;
    }
    /** Alias for `ctx.update.chat_join_request` */
    get chatJoinRequest() {
        return this.update.chat_join_request;
    }
    /** Alias for `ctx.update.chat_boost` */
    get chatBoost() {
        return this.update.chat_boost;
    }
    /** Alias for `ctx.update.removed_chat_boost` */
    get removedChatBoost() {
        return this.update.removed_chat_boost;
    }
    /** Alias for `ctx.update.purchased_paid_media` */
    get purchasedPaidMedia() {
        return this.update.purchased_paid_media;
    }
    // AGGREGATION SHORTCUTS
    /**
     * Get the message object from wherever possible. Alias for `this.message ??
     * this.editedMessage ?? this.channelPost ?? this.editedChannelPost ??
     * this.businessMessage ?? this.editedBusinessMessage ??
     * this.callbackQuery?.message`.
     */
    get msg() {
        var _a, _b, _c, _d, _e, _f, _g;
        // Keep in sync with types in `filter.ts`.
        return ((_f = (_e = (_d = (_c = (_b = (_a = this.message) !== null && _a !== void 0 ? _a : this.editedMessage) !== null && _b !== void 0 ? _b : this.channelPost) !== null && _c !== void 0 ? _c : this.editedChannelPost) !== null && _d !== void 0 ? _d : this.businessMessage) !== null && _e !== void 0 ? _e : this.editedBusinessMessage) !== null && _f !== void 0 ? _f : (_g = this.callbackQuery) === null || _g === void 0 ? void 0 : _g.message);
    }
    /**
     * Get the chat object from wherever possible. Alias for `(this.msg ??
     * this.deletedBusinessMessages ?? this.messageReaction ??
     * this.messageReactionCount ?? this.myChatMember ??  this.chatMember ??
     * this.chatJoinRequest ?? this.chatBoost ??  this.removedChatBoost)?.chat`.
     */
    get chat() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // Keep in sync with types in `filter.ts`.
        return (_j = ((_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = this.msg) !== null && _a !== void 0 ? _a : this.deletedBusinessMessages) !== null && _b !== void 0 ? _b : this.messageReaction) !== null && _c !== void 0 ? _c : this.messageReactionCount) !== null && _d !== void 0 ? _d : this.myChatMember) !== null && _e !== void 0 ? _e : this.chatMember) !== null && _f !== void 0 ? _f : this.chatJoinRequest) !== null && _g !== void 0 ? _g : this.chatBoost) !== null && _h !== void 0 ? _h : this.removedChatBoost)) === null || _j === void 0 ? void 0 : _j.chat;
    }
    /**
     * Get the sender chat object from wherever possible. Alias for
     * `ctx.msg?.sender_chat`.
     */
    get senderChat() {
        var _a;
        // Keep in sync with types in `filter.ts`.
        return (_a = this.msg) === null || _a === void 0 ? void 0 : _a.sender_chat;
    }
    /**
     * Get the user object from wherever possible. Alias for
     * `(this.businessConnection ?? this.messageReaction ??
     * (this.chatBoost?.boost ?? this.removedChatBoost)?.source)?.user ??
     * (this.callbackQuery ?? this.msg ?? this.inlineQuery ??
     * this.chosenInlineResult ?? this.shippingQuery ?? this.preCheckoutQuery ??
     * this.myChatMember ?? this.chatMember ?? this.chatJoinRequest ??
     * this.purchasedPaidMedia)?.from`.
     */
    get from() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        // Keep in sync with types in `filter.ts`.
        return (_g = (_f = ((_b = (_a = this.businessConnection) !== null && _a !== void 0 ? _a : this.messageReaction) !== null && _b !== void 0 ? _b : (_e = ((_d = (_c = this.chatBoost) === null || _c === void 0 ? void 0 : _c.boost) !== null && _d !== void 0 ? _d : this.removedChatBoost)) === null || _e === void 0 ? void 0 : _e.source)) === null || _f === void 0 ? void 0 : _f.user) !== null && _g !== void 0 ? _g : (_s = ((_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = this.callbackQuery) !== null && _h !== void 0 ? _h : this.msg) !== null && _j !== void 0 ? _j : this.inlineQuery) !== null && _k !== void 0 ? _k : this.chosenInlineResult) !== null && _l !== void 0 ? _l : this.shippingQuery) !== null && _m !== void 0 ? _m : this.preCheckoutQuery) !== null && _o !== void 0 ? _o : this.myChatMember) !== null && _p !== void 0 ? _p : this.chatMember) !== null && _q !== void 0 ? _q : this.chatJoinRequest) !== null && _r !== void 0 ? _r : this.purchasedPaidMedia)) === null || _s === void 0 ? void 0 : _s.from;
    }
    /**
     * Get the message identifier from wherever possible. Alias for
     * `this.msg?.message_id ?? this.messageReaction?.message_id ??
     * this.messageReactionCount?.message_id`.
     */
    get msgId() {
        var _a, _b, _c, _d, _e;
        // Keep in sync with types in `filter.ts`.
        return (_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id;
    }
    /**
     * Gets the chat identifier from wherever possible. Alias for `this.chat?.id
     * ?? this.businessConnection?.user_chat_id`.
     */
    get chatId() {
        var _a, _b, _c;
        // Keep in sync with types in `filter.ts`.
        return (_b = (_a = this.chat) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_c = this.businessConnection) === null || _c === void 0 ? void 0 : _c.user_chat_id;
    }
    /**
     * Get the inline message identifier from wherever possible. Alias for
     * `(ctx.callbackQuery ?? ctx.chosenInlineResult)?.inline_message_id`.
     */
    get inlineMessageId() {
        var _a, _b, _c;
        return ((_b = (_a = this.callbackQuery) === null || _a === void 0 ? void 0 : _a.inline_message_id) !== null && _b !== void 0 ? _b : (_c = this.chosenInlineResult) === null || _c === void 0 ? void 0 : _c.inline_message_id);
    }
    /**
     * Get the business connection identifier from wherever possible. Alias for
     * `this.msg?.business_connection_id ?? this.businessConnection?.id ??
     * this.deletedBusinessMessages?.business_connection_id`.
     */
    get businessConnectionId() {
        var _a, _b, _c, _d, _e;
        return (_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.business_connection_id) !== null && _b !== void 0 ? _b : (_c = this.businessConnection) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : (_e = this.deletedBusinessMessages) === null || _e === void 0 ? void 0 : _e.business_connection_id;
    }
    entities(types) {
        var _a, _b;
        const message = this.msg;
        if (message === undefined)
            return [];
        const text = (_a = message.text) !== null && _a !== void 0 ? _a : message.caption;
        if (text === undefined)
            return [];
        let entities = (_b = message.entities) !== null && _b !== void 0 ? _b : message.caption_entities;
        if (entities === undefined)
            return [];
        if (types !== undefined) {
            const filters = new Set(toArray(types));
            entities = entities.filter((entity) => filters.has(entity.type));
        }
        return entities.map((entity) => ({
            ...entity,
            text: text.substring(entity.offset, entity.offset + entity.length),
        }));
    }
    /**
     * Find out which reactions were added and removed in a `message_reaction`
     * update. This method looks at `ctx.messageReaction` and computes the
     * difference between the old reaction and the new reaction. It also groups
     * the reactions by emoji reactions and custom emoji reactions. For example,
     * the resulting object could look like this:
     * ```ts
     * {
     *   emoji: ['👍', '🎉']
     *   emojiAdded: ['🎉'],
     *   emojiKept: ['👍'],
     *   emojiRemoved: [],
     *   customEmoji: [],
     *   customEmojiAdded: [],
     *   customEmojiKept: [],
     *   customEmojiRemoved: ['id0123'],
     *   paid: true,
     *   paidAdded: false,
     *   paidRemoved: false,
     * }
     * ```
     * In the above example, a tada reaction was added by the user, and a custom
     * emoji reaction with the custom emoji 'id0123' was removed in the same
     * update. The user had already reacted with a thumbs up reaction and a paid
     * star reaction, which they left both unchanged. As a result, the current
     * reaction by the user is thumbs up, tada, and a paid reaction. Note that
     * the current reaction (all emoji reactions regardless of type in one list)
     * can also be obtained from `ctx.messageReaction.new_reaction`.
     *
     * Remember that reaction updates only include information about the
     * reaction of a specific user. The respective message may have many more
     * reactions by other people which will not be included in this update.
     *
     * @returns An object containing information about the reaction update
     */
    reactions() {
        const emoji = [];
        const emojiAdded = [];
        const emojiKept = [];
        const emojiRemoved = [];
        const customEmoji = [];
        const customEmojiAdded = [];
        const customEmojiKept = [];
        const customEmojiRemoved = [];
        let paid = false;
        let paidAdded = false;
        const r = this.messageReaction;
        if (r !== undefined) {
            const { old_reaction, new_reaction } = r;
            // group all current emoji in `emoji` and `customEmoji`
            for (const reaction of new_reaction) {
                if (reaction.type === "emoji") {
                    emoji.push(reaction.emoji);
                }
                else if (reaction.type === "custom_emoji") {
                    customEmoji.push(reaction.custom_emoji_id);
                }
                else if (reaction.type === "paid") {
                    paid = paidAdded = true;
                }
            }
            // temporarily move all old emoji to the *Removed arrays
            for (const reaction of old_reaction) {
                if (reaction.type === "emoji") {
                    emojiRemoved.push(reaction.emoji);
                }
                else if (reaction.type === "custom_emoji") {
                    customEmojiRemoved.push(reaction.custom_emoji_id);
                }
                else if (reaction.type === "paid") {
                    paidAdded = false;
                }
            }
            // temporarily move all new emoji to the *Added arrays
            emojiAdded.push(...emoji);
            customEmojiAdded.push(...customEmoji);
            // drop common emoji from both lists and add them to `emojiKept`
            for (let i = 0; i < emojiRemoved.length; i++) {
                const len = emojiAdded.length;
                if (len === 0)
                    break;
                const rem = emojiRemoved[i];
                for (let j = 0; j < len; j++) {
                    if (rem === emojiAdded[j]) {
                        emojiKept.push(rem);
                        emojiRemoved.splice(i, 1);
                        emojiAdded.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }
            // drop common custom emoji from both lists and add them to `customEmojiKept`
            for (let i = 0; i < customEmojiRemoved.length; i++) {
                const len = customEmojiAdded.length;
                if (len === 0)
                    break;
                const rem = customEmojiRemoved[i];
                for (let j = 0; j < len; j++) {
                    if (rem === customEmojiAdded[j]) {
                        customEmojiKept.push(rem);
                        customEmojiRemoved.splice(i, 1);
                        customEmojiAdded.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }
        }
        return {
            emoji,
            emojiAdded,
            emojiKept,
            emojiRemoved,
            customEmoji,
            customEmojiAdded,
            customEmojiKept,
            customEmojiRemoved,
            paid,
            paidAdded,
        };
    }
    /**
     * Returns `true` if this context object matches the given filter query, and
     * `false` otherwise. This uses the same logic as `bot.on`.
     *
     * @param filter The filter query to check
     */
    has(filter) {
        return Context.has.filterQuery(filter)(this);
    }
    /**
     * Returns `true` if this context object contains the given text, or if it
     * contains text that matches the given regular expression. It returns
     * `false` otherwise. This uses the same logic as `bot.hears`.
     *
     * @param trigger The string or regex to match
     */
    hasText(trigger) {
        return Context.has.text(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given command, and
     * `false` otherwise. This uses the same logic as `bot.command`.
     *
     * @param command The command to match
     */
    hasCommand(command) {
        return Context.has.command(command)(this);
    }
    hasReaction(reaction) {
        return Context.has.reaction(reaction)(this);
    }
    /**
     * Returns `true` if this context object belongs to a chat with the given
     * chat type, and `false` otherwise. This uses the same logic as
     * `bot.chatType`.
     *
     * @param chatType The chat type to match
     */
    hasChatType(chatType) {
        return Context.has.chatType(chatType)(this);
    }
    /**
     * Returns `true` if this context object contains the given callback query,
     * or if the contained callback query data matches the given regular
     * expression. It returns `false` otherwise. This uses the same logic as
     * `bot.callbackQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasCallbackQuery(trigger) {
        return Context.has.callbackQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given game query, or
     * if the contained game query matches the given regular expression. It
     * returns `false` otherwise. This uses the same logic as `bot.gameQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasGameQuery(trigger) {
        return Context.has.gameQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given inline query, or
     * if the contained inline query matches the given regular expression. It
     * returns `false` otherwise. This uses the same logic as `bot.inlineQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasInlineQuery(trigger) {
        return Context.has.inlineQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the chosen inline result,
     * or if the contained chosen inline result matches the given regular
     * expression. It returns `false` otherwise. This uses the same logic as
     * `bot.chosenInlineResult`.
     *
     * @param trigger The string or regex to match
     */
    hasChosenInlineResult(trigger) {
        return Context.has.chosenInlineResult(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given pre-checkout
     * query, or if the contained pre-checkout query matches the given regular
     * expression. It returns `false` otherwise. This uses the same logic as
     * `bot.preCheckoutQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasPreCheckoutQuery(trigger) {
        return Context.has.preCheckoutQuery(trigger)(this);
    }
    /**
     * Returns `true` if this context object contains the given shipping query,
     * or if the contained shipping query matches the given regular expression.
     * It returns `false` otherwise. This uses the same logic as
     * `bot.shippingQuery`.
     *
     * @param trigger The string or regex to match
     */
    hasShippingQuery(trigger) {
        return Context.has.shippingQuery(trigger)(this);
    }
    // API
    /**
     * Context-aware alias for `api.sendMessage`. Use this method to send text messages. On success, the sent Message is returned.
     *
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendmessage
     */
    reply(text, other, signal) {
        return this.api.sendMessage(orThrow(this.chatId, "sendMessage"), text, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.forwardMessage`. Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#forwardmessage
     */
    forwardMessage(chat_id, other, signal) {
        return this.api.forwardMessage(chat_id, orThrow(this.chatId, "forwardMessage"), orThrow(this.msgId, "forwardMessage"), other, signal);
    }
    /**
     * Context-aware alias for `api.forwardMessages`. Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of MessageId of the sent messages is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages in the current chat to forward. The identifiers must be specified in a strictly increasing order.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#forwardmessages
     */
    forwardMessages(chat_id, message_ids, other, signal) {
        return this.api.forwardMessages(chat_id, orThrow(this.chatId, "forwardMessages"), message_ids, other, signal);
    }
    /**
     * Context-aware alias for `api.copyMessage`. Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#copymessage
     */
    copyMessage(chat_id, other, signal) {
        return this.api.copyMessage(chat_id, orThrow(this.chatId, "copyMessage"), orThrow(this.msgId, "copyMessage"), other, signal);
    }
    /**
     * Context-aware alias for `api.copyMessages`. Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_id is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of MessageId of the sent messages is returned.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages in the current chat to copy. The identifiers must be specified in a strictly increasing order.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#copymessages
     */
    copyMessages(chat_id, message_ids, other, signal) {
        return this.api.copyMessages(chat_id, orThrow(this.chatId, "copyMessages"), message_ids, other, signal);
    }
    /**
     * Context-aware alias for `api.sendPhoto`. Use this method to send photos. On success, the sent Message is returned.
     *
     * @param photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendphoto
     */
    replyWithPhoto(photo, other, signal) {
        return this.api.sendPhoto(orThrow(this.chatId, "sendPhoto"), photo, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendAudio`. Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.
     *
     * For sending voice messages, use the sendVoice method instead.
     *
     * @param audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendaudio
     */
    replyWithAudio(audio, other, signal) {
        return this.api.sendAudio(orThrow(this.chatId, "sendAudio"), audio, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendDocument`. Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddocument
     */
    replyWithDocument(document, other, signal) {
        return this.api.sendDocument(orThrow(this.chatId, "sendDocument"), document, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendVideo`. Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvideo
     */
    replyWithVideo(video, other, signal) {
        return this.api.sendVideo(orThrow(this.chatId, "sendVideo"), video, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendAnimation`. Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param animation Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendanimation
     */
    replyWithAnimation(animation, other, signal) {
        return this.api.sendAnimation(orThrow(this.chatId, "sendAnimation"), animation, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendVoice`. Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
     *
     * @param voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvoice
     */
    replyWithVoice(voice, other, signal) {
        return this.api.sendVoice(orThrow(this.chatId, "sendVoice"), voice, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendVideoNote`. Use this method to send video messages. On success, the sent Message is returned.
     * As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long.
     *
     * @param video_note Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data.. Sending video notes by a URL is currently unsupported
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvideonote
     */
    replyWithVideoNote(video_note, other, signal) {
        return this.api.sendVideoNote(orThrow(this.chatId, "sendVideoNote"), video_note, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendMediaGroup`. Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of Messages that were sent is returned.
     *
     * @param media An array describing messages to be sent, must include 2-10 items
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendmediagroup
     */
    replyWithMediaGroup(media, other, signal) {
        return this.api.sendMediaGroup(orThrow(this.chatId, "sendMediaGroup"), media, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendLocation`. Use this method to send point on the map. On success, the sent Message is returned.
     *
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendlocation
     */
    replyWithLocation(latitude, longitude, other, signal) {
        return this.api.sendLocation(orThrow(this.chatId, "sendLocation"), latitude, longitude, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.editMessageLiveLocation`. Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagelivelocation
     */
    editMessageLiveLocation(latitude, longitude, other, signal) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageLiveLocationInline(inlineId, latitude, longitude, { business_connection_id: this.businessConnectionId, ...other }, signal)
            : this.api.editMessageLiveLocation(orThrow(this.chatId, "editMessageLiveLocation"), orThrow(this.msgId, "editMessageLiveLocation"), latitude, longitude, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.stopMessageLiveLocation`. Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stopmessagelivelocation
     */
    stopMessageLiveLocation(other, signal) {
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.stopMessageLiveLocationInline(inlineId, { business_connection_id: this.businessConnectionId, ...other }, signal)
            : this.api.stopMessageLiveLocation(orThrow(this.chatId, "stopMessageLiveLocation"), orThrow(this.msgId, "stopMessageLiveLocation"), { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendPaidMedia`. Use this method to send paid media. On success, the sent Message is returned.
     *
     * @param star_count The number of Telegram Stars that must be paid to buy access to the media
     * @param media An array describing the media to be sent; up to 10 items
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendpaidmedia
     */
    sendPaidMedia(star_count, media, other, signal) {
        return this.api.sendPaidMedia(orThrow(this.chatId, "sendPaidMedia"), star_count, media, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendVenue`. Use this method to send information about a venue. On success, the sent Message is returned.
     *
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendvenue
     */
    replyWithVenue(latitude, longitude, title, address, other, signal) {
        return this.api.sendVenue(orThrow(this.chatId, "sendVenue"), latitude, longitude, title, address, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendContact`. Use this method to send phone contacts. On success, the sent Message is returned.
     *
     * @param phone_number Contact's phone number
     * @param first_name Contact's first name
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendcontact
     */
    replyWithContact(phone_number, first_name, other, signal) {
        return this.api.sendContact(orThrow(this.chatId, "sendContact"), phone_number, first_name, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendPoll`. Use this method to send a native poll. On success, the sent Message is returned.
     *
     * @param question Poll question, 1-300 characters
     * @param options A list of answer options, 2-10 strings 1-100 characters each
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendpoll
     */
    replyWithPoll(question, options, other, signal) {
        return this.api.sendPoll(orThrow(this.chatId, "sendPoll"), question, options, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendDice`. Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.
     *
     * @param emoji Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, “🏀”, “⚽”, “🎳”, or “🎰”. Dice can have values 1-6 for “🎲”, “🎯” and “🎳”, values 1-5 for “🏀” and “⚽”, and values 1-64 for “🎰”. Defaults to “🎲”
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#senddice
     */
    replyWithDice(emoji, other, signal) {
        return this.api.sendDice(orThrow(this.chatId, "sendDice"), emoji, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.sendChatAction`. Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.
     *
     * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
     *
     * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
     *
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendchataction
     */
    replyWithChatAction(action, other, signal) {
        return this.api.sendChatAction(orThrow(this.chatId, "sendChatAction"), action, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.setMessageReaction`. Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.
     *
     * @param reaction A list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmessagereaction
     */
    react(reaction, other, signal) {
        return this.api.setMessageReaction(orThrow(this.chatId, "setMessageReaction"), orThrow(this.msgId, "setMessageReaction"), typeof reaction === "string"
            ? [{ type: "emoji", emoji: reaction }]
            : (Array.isArray(reaction) ? reaction : [reaction])
                .map((emoji) => typeof emoji === "string"
                ? { type: "emoji", emoji }
                : emoji), other, signal);
    }
    /**
     * Context-aware alias for `api.getUserProfilePhotos`. Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getuserprofilephotos
     */
    getUserProfilePhotos(other, signal) {
        return this.api.getUserProfilePhotos(orThrow(this.from, "getUserProfilePhotos").id, other, signal);
    }
    /**
     * Contex-aware alias for `api.serUserEmojiStatus`. Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setuseremojistatus
     */
    setUserEmojiStatus(other, signal) {
        return this.api.setUserEmojiStatus(orThrow(this.from, "setUserEmojiStatus").id, other, signal);
    }
    /**
     * Context-aware alias for `api.getUserChatBoosts`. Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.
     *
     * @param chat_id Unique identifier for the chat or username of the channel (in the format @channelusername)
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getuserchatboosts
     */
    getUserChatBoosts(chat_id, signal) {
        return this.api.getUserChatBoosts(chat_id, orThrow(this.from, "getUserChatBoosts").id, signal);
    }
    /**
     * Context-aware alias for `api.getBusinessConnection`. Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getbusinessconnection
     */
    getBusinessConnection(signal) {
        return this.api.getBusinessConnection(orThrow(this.businessConnectionId, "getBusinessConnection"), signal);
    }
    /**
     * Context-aware alias for `api.getFile`. Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
     *
     * Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getfile
     */
    getFile(signal) {
        var _a, _b, _c, _d, _e, _f;
        const m = orThrow(this.msg, "getFile");
        const file = m.photo !== undefined
            ? m.photo[m.photo.length - 1]
            : (_f = (_e = (_d = (_c = (_b = (_a = m.animation) !== null && _a !== void 0 ? _a : m.audio) !== null && _b !== void 0 ? _b : m.document) !== null && _c !== void 0 ? _c : m.video) !== null && _d !== void 0 ? _d : m.video_note) !== null && _e !== void 0 ? _e : m.voice) !== null && _f !== void 0 ? _f : m.sticker;
        return this.api.getFile(orThrow(file, "getFile").file_id, signal);
    }
    /** @deprecated Use `banAuthor` instead. */
    kickAuthor(...args) {
        return this.banAuthor(...args);
    }
    /**
     * Context-aware alias for `api.banChatMember`. Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatmember
     */
    banAuthor(other, signal) {
        return this.api.banChatMember(orThrow(this.chatId, "banAuthor"), orThrow(this.from, "banAuthor").id, other, signal);
    }
    /** @deprecated Use `banChatMember` instead. */
    kickChatMember(...args) {
        return this.banChatMember(...args);
    }
    /**
     * Context-aware alias for `api.banChatMember`. Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatmember
     */
    banChatMember(user_id, other, signal) {
        return this.api.banChatMember(orThrow(this.chatId, "banChatMember"), user_id, other, signal);
    }
    /**
     * Context-aware alias for `api.unbanChatMember`. Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unbanchatmember
     */
    unbanChatMember(user_id, other, signal) {
        return this.api.unbanChatMember(orThrow(this.chatId, "unbanChatMember"), user_id, other, signal);
    }
    /**
     * Context-aware alias for `api.restrictChatMember`. Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     *
     * @param permissions An object for new user permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#restrictchatmember
     */
    restrictAuthor(permissions, other, signal) {
        return this.api.restrictChatMember(orThrow(this.chatId, "restrictAuthor"), orThrow(this.from, "restrictAuthor").id, permissions, other, signal);
    }
    /**
     * Context-aware alias for `api.restrictChatMember`. Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param permissions An object for new user permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#restrictchatmember
     */
    restrictChatMember(user_id, permissions, other, signal) {
        return this.api.restrictChatMember(orThrow(this.chatId, "restrictChatMember"), user_id, permissions, other, signal);
    }
    /**
     * Context-aware alias for `api.promoteChatMember`. Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#promotechatmember
     */
    promoteAuthor(other, signal) {
        return this.api.promoteChatMember(orThrow(this.chatId, "promoteAuthor"), orThrow(this.from, "promoteAuthor").id, other, signal);
    }
    /**
     * Context-aware alias for `api.promoteChatMember`. Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#promotechatmember
     */
    promoteChatMember(user_id, other, signal) {
        return this.api.promoteChatMember(orThrow(this.chatId, "promoteChatMember"), user_id, other, signal);
    }
    /**
     * Context-aware alias for `api.setChatAdministratorCustomTitle`. Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     *
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatadministratorcustomtitle
     */
    setChatAdministratorAuthorCustomTitle(custom_title, signal) {
        return this.api.setChatAdministratorCustomTitle(orThrow(this.chatId, "setChatAdministratorAuthorCustomTitle"), orThrow(this.from, "setChatAdministratorAuthorCustomTitle").id, custom_title, signal);
    }
    /**
     * Context-aware alias for `api.setChatAdministratorCustomTitle`. Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatadministratorcustomtitle
     */
    setChatAdministratorCustomTitle(user_id, custom_title, signal) {
        return this.api.setChatAdministratorCustomTitle(orThrow(this.chatId, "setChatAdministratorCustomTitle"), user_id, custom_title, signal);
    }
    /**
     * Context-aware alias for `api.banChatSenderChat`. Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#banchatsenderchat
     */
    banChatSenderChat(sender_chat_id, signal) {
        return this.api.banChatSenderChat(orThrow(this.chatId, "banChatSenderChat"), sender_chat_id, signal);
    }
    /**
     * Context-aware alias for `api.unbanChatSenderChat`. Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param sender_chat_id Unique identifier of the target sender chat
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unbanchatsenderchat
     */
    unbanChatSenderChat(sender_chat_id, signal) {
        return this.api.unbanChatSenderChat(orThrow(this.chatId, "unbanChatSenderChat"), sender_chat_id, signal);
    }
    /**
     * Context-aware alias for `api.setChatPermissions`. Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.
     *
     * @param permissions New default chat permissions
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatpermissions
     */
    setChatPermissions(permissions, other, signal) {
        return this.api.setChatPermissions(orThrow(this.chatId, "setChatPermissions"), permissions, other, signal);
    }
    /**
     * Context-aware alias for `api.exportChatInviteLink`. Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
     *
     * Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using exportChatInviteLink or by calling the getChat method. If your bot needs to generate a new primary invite link replacing its previous one, use exportChatInviteLink again.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#exportchatinvitelink
     */
    exportChatInviteLink(signal) {
        return this.api.exportChatInviteLink(orThrow(this.chatId, "exportChatInviteLink"), signal);
    }
    /**
     * Context-aware alias for `api.createChatInviteLink`. Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createchatinvitelink
     */
    createChatInviteLink(other, signal) {
        return this.api.createChatInviteLink(orThrow(this.chatId, "createChatInviteLink"), other, signal);
    }
    /**
     * Context-aware alias for `api.editChatInviteLink`. Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
     *
     * @param invite_link The invite link to edit
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editchatinvitelink
     */
    editChatInviteLink(invite_link, other, signal) {
        return this.api.editChatInviteLink(orThrow(this.chatId, "editChatInviteLink"), invite_link, other, signal);
    }
    /**
     * Context-aware alias for `api.createChatSubscriptionInviteLink`. Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.
     *
     * @param subscription_period The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).
     * @param subscription_price The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-2500
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createchatsubscriptioninvitelink
     */
    createChatSubscriptionInviteLink(subscription_period, subscription_price, other, signal) {
        return this.api.createChatSubscriptionInviteLink(orThrow(this.chatId, "createChatSubscriptionInviteLink"), subscription_period, subscription_price, other, signal);
    }
    /**
     * Context-aware alias for `api.editChatSubscriptionInviteLink`. Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.
     *
     * @param invite_link The invite link to edit
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editchatsubscriptioninvitelink
     */
    editChatSubscriptionInviteLink(invite_link, other, signal) {
        return this.api.editChatSubscriptionInviteLink(orThrow(this.chatId, "editChatSubscriptionInviteLink"), invite_link, other, signal);
    }
    /**
     * Context-aware alias for `api.revokeChatInviteLink`. Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
     *
     * @param invite_link The invite link to revoke
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#revokechatinvitelink
     */
    revokeChatInviteLink(invite_link, signal) {
        return this.api.revokeChatInviteLink(orThrow(this.chatId, "editChatInviteLink"), invite_link, signal);
    }
    /**
     * Context-aware alias for `api.approveChatJoinRequest`. Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#approvechatjoinrequest
     */
    approveChatJoinRequest(user_id, signal) {
        return this.api.approveChatJoinRequest(orThrow(this.chatId, "approveChatJoinRequest"), user_id, signal);
    }
    /**
     * Context-aware alias for `api.declineChatJoinRequest`. Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#declinechatjoinrequest
     */
    declineChatJoinRequest(user_id, signal) {
        return this.api.declineChatJoinRequest(orThrow(this.chatId, "declineChatJoinRequest"), user_id, signal);
    }
    /**
     * Context-aware alias for `api.setChatPhoto`. Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param photo New chat photo, uploaded using multipart/form-data
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatphoto
     */
    setChatPhoto(photo, signal) {
        return this.api.setChatPhoto(orThrow(this.chatId, "setChatPhoto"), photo, signal);
    }
    /**
     * Context-aware alias for `api.deleteChatPhoto`. Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletechatphoto
     */
    deleteChatPhoto(signal) {
        return this.api.deleteChatPhoto(orThrow(this.chatId, "deleteChatPhoto"), signal);
    }
    /**
     * Context-aware alias for `api.setChatTitle`. Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param title New chat title, 1-255 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchattitle
     */
    setChatTitle(title, signal) {
        return this.api.setChatTitle(orThrow(this.chatId, "setChatTitle"), title, signal);
    }
    /**
     * Context-aware alias for `api.setChatDescription`. Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     *
     * @param description New chat description, 0-255 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatdescription
     */
    setChatDescription(description, signal) {
        return this.api.setChatDescription(orThrow(this.chatId, "setChatDescription"), description, signal);
    }
    /**
     * Context-aware alias for `api.pinChatMessage`. Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param message_id Identifier of a message to pin
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#pinchatmessage
     */
    pinChatMessage(message_id, other, signal) {
        return this.api.pinChatMessage(orThrow(this.chatId, "pinChatMessage"), message_id, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.unpinChatMessage`. Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param message_id Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinchatmessage
     */
    unpinChatMessage(message_id, other, signal) {
        return this.api.unpinChatMessage(orThrow(this.chatId, "unpinChatMessage"), message_id, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.unpinAllChatMessages`. Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallchatmessages
     */
    unpinAllChatMessages(signal) {
        return this.api.unpinAllChatMessages(orThrow(this.chatId, "unpinAllChatMessages"), signal);
    }
    /**
     * Context-aware alias for `api.leaveChat`. Use this method for your bot to leave a group, supergroup or channel. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#leavechat
     */
    leaveChat(signal) {
        return this.api.leaveChat(orThrow(this.chatId, "leaveChat"), signal);
    }
    /**
     * Context-aware alias for `api.getChat`. Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a Chat object on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchat
     */
    getChat(signal) {
        return this.api.getChat(orThrow(this.chatId, "getChat"), signal);
    }
    /**
     * Context-aware alias for `api.getChatAdministrators`. Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of ChatMember objects.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatadministrators
     */
    getChatAdministrators(signal) {
        return this.api.getChatAdministrators(orThrow(this.chatId, "getChatAdministrators"), signal);
    }
    /** @deprecated Use `getChatMembersCount` instead. */
    getChatMembersCount(...args) {
        return this.getChatMemberCount(...args);
    }
    /**
     * Context-aware alias for `api.getChatMemberCount`. Use this method to get the number of members in a chat. Returns Int on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmembercount
     */
    getChatMemberCount(signal) {
        return this.api.getChatMemberCount(orThrow(this.chatId, "getChatMemberCount"), signal);
    }
    /**
     * Context-aware alias for `api.getChatMember`. Use this method to get information about a member of a chat. The method is guaranteed to work only if the bot is an administrator in the chat. Returns a ChatMember object on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getAuthor(signal) {
        return this.api.getChatMember(orThrow(this.chatId, "getAuthor"), orThrow(this.from, "getAuthor").id, signal);
    }
    /**
     * Context-aware alias for `api.getChatMember`. Use this method to get information about a member of a chat. The method is guaranteed to work only if the bot is an administrator in the chat. Returns a ChatMember object on success.
     *
     * @param user_id Unique identifier of the target user
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmember
     */
    getChatMember(user_id, signal) {
        return this.api.getChatMember(orThrow(this.chatId, "getChatMember"), user_id, signal);
    }
    /**
     * Context-aware alias for `api.setChatStickerSet`. Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatstickerset
     */
    setChatStickerSet(sticker_set_name, signal) {
        return this.api.setChatStickerSet(orThrow(this.chatId, "setChatStickerSet"), sticker_set_name, signal);
    }
    /**
     * Context-aware alias for `api.deleteChatStickerSet`. Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set ly returned in getChat requests to check if the bot can use this method. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletechatstickerset
     */
    deleteChatStickerSet(signal) {
        return this.api.deleteChatStickerSet(orThrow(this.chatId, "deleteChatStickerSet"), signal);
    }
    /**
     * Context-aware alias for `api.createForumTopic`. Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns information about the created topic as a ForumTopic object.
     *
     * @param name Topic name, 1-128 characters
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#createforumtopic
     */
    createForumTopic(name, other, signal) {
        return this.api.createForumTopic(orThrow(this.chatId, "createForumTopic"), name, other, signal);
    }
    /**
     * Context-aware alias for `api.editForumTopic`. Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editforumtopic
     */
    editForumTopic(other, signal) {
        const message = orThrow(this.msg, "editForumTopic");
        const thread = orThrow(message.message_thread_id, "editForumTopic");
        return this.api.editForumTopic(message.chat.id, thread, other, signal);
    }
    /**
     * Context-aware alias for `api.closeForumTopic`. Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#closeforumtopic
     */
    closeForumTopic(signal) {
        const message = orThrow(this.msg, "closeForumTopic");
        const thread = orThrow(message.message_thread_id, "closeForumTopic");
        return this.api.closeForumTopic(message.chat.id, thread, signal);
    }
    /**
     * Context-aware alias for `api.reopenForumTopic`. Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#reopenforumtopic
     */
    reopenForumTopic(signal) {
        const message = orThrow(this.msg, "reopenForumTopic");
        const thread = orThrow(message.message_thread_id, "reopenForumTopic");
        return this.api.reopenForumTopic(message.chat.id, thread, signal);
    }
    /**
     * Context-aware alias for `api.deleteForumTopic`. Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deleteforumtopic
     */
    deleteForumTopic(signal) {
        const message = orThrow(this.msg, "deleteForumTopic");
        const thread = orThrow(message.message_thread_id, "deleteForumTopic");
        return this.api.deleteForumTopic(message.chat.id, thread, signal);
    }
    /**
     * Context-aware alias for `api.unpinAllForumTopicMessages`. Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallforumtopicmessages
     */
    unpinAllForumTopicMessages(signal) {
        const message = orThrow(this.msg, "unpinAllForumTopicMessages");
        const thread = orThrow(message.message_thread_id, "unpinAllForumTopicMessages");
        return this.api.unpinAllForumTopicMessages(message.chat.id, thread, signal);
    }
    /**
     * Context-aware alias for `api.editGeneralForumTopic`. Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param name New topic name, 1-128 characters
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editgeneralforumtopic
     */
    editGeneralForumTopic(name, signal) {
        return this.api.editGeneralForumTopic(orThrow(this.chatId, "editGeneralForumTopic"), name, signal);
    }
    /**
     * Context-aware alias for `api.closeGeneralForumTopic`. Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#closegeneralforumtopic
     */
    closeGeneralForumTopic(signal) {
        return this.api.closeGeneralForumTopic(orThrow(this.chatId, "closeGeneralForumTopic"), signal);
    }
    /**
     * Context-aware alias for `api.reopenGeneralForumTopic`. Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.     *
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#reopengeneralforumtopic
     */
    reopenGeneralForumTopic(signal) {
        return this.api.reopenGeneralForumTopic(orThrow(this.chatId, "reopenGeneralForumTopic"), signal);
    }
    /**
     * Context-aware alias for `api.hideGeneralForumTopic`. Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#hidegeneralforumtopic
     */
    hideGeneralForumTopic(signal) {
        return this.api.hideGeneralForumTopic(orThrow(this.chatId, "hideGeneralForumTopic"), signal);
    }
    /**
     * Context-aware alias for `api.unhideGeneralForumTopic`. Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unhidegeneralforumtopic
     */
    unhideGeneralForumTopic(signal) {
        return this.api.unhideGeneralForumTopic(orThrow(this.chatId, "unhideGeneralForumTopic"), signal);
    }
    /**
     * Context-aware alias for `api.unpinAllGeneralForumTopicMessages`. Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages
     */
    unpinAllGeneralForumTopicMessages(signal) {
        return this.api.unpinAllGeneralForumTopicMessages(orThrow(this.chatId, "unpinAllGeneralForumTopicMessages"), signal);
    }
    /**
     * Context-aware alias for `api.answerCallbackQuery`. Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     *
     * Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via @BotFather and accept the terms. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answercallbackquery
     */
    answerCallbackQuery(other, signal) {
        return this.api.answerCallbackQuery(orThrow(this.callbackQuery, "answerCallbackQuery").id, typeof other === "string" ? { text: other } : other, signal);
    }
    /**
     * Context-aware alias for `api.setChatMenuButton`. Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setchatmenubutton
     */
    setChatMenuButton(other, signal) {
        return this.api.setChatMenuButton(other, signal);
    }
    /**
     * Context-aware alias for `api.getChatMenuButton`. Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getchatmenubutton
     */
    getChatMenuButton(other, signal) {
        return this.api.getChatMenuButton(other, signal);
    }
    /**
     * Context-aware alias for `api.setMyDefaultAdministratorRights`. Use this method to the change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are are free to modify the list before adding the bot. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setmydefaultadministratorrights
     */
    setMyDefaultAdministratorRights(other, signal) {
        return this.api.setMyDefaultAdministratorRights(other, signal);
    }
    /**
     * Context-aware alias for `api.getMyDefaultAdministratorRights`. Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     */
    getMyDefaultAdministratorRights(other, signal) {
        return this.api.getMyDefaultAdministratorRights(other, signal);
    }
    /**
     * Context-aware alias for `api.editMessageText`. Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param text New text of the message, 1-4096 characters after entities parsing
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagetext
     */
    editMessageText(text, other, signal) {
        var _a, _b, _c, _d, _e;
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageTextInline(inlineId, text, { business_connection_id: this.businessConnectionId, ...other }, signal)
            : this.api.editMessageText(orThrow(this.chatId, "editMessageText"), orThrow((_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id, "editMessageText"), text, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.editMessageCaption`. Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagecaption
     */
    editMessageCaption(other, signal) {
        var _a, _b, _c, _d, _e;
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageCaptionInline(inlineId, { business_connection_id: this.businessConnectionId, ...other }, signal)
            : this.api.editMessageCaption(orThrow(this.chatId, "editMessageCaption"), orThrow((_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id, "editMessageCaption"), { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.editMessageMedia`. Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param media An object for a new media content of the message
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagemedia
     */
    editMessageMedia(media, other, signal) {
        var _a, _b, _c, _d, _e;
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageMediaInline(inlineId, media, { business_connection_id: this.businessConnectionId, ...other }, signal)
            : this.api.editMessageMedia(orThrow(this.chatId, "editMessageMedia"), orThrow((_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id, "editMessageMedia"), media, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.editMessageReplyMarkup`. Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#editmessagereplymarkup
     */
    editMessageReplyMarkup(other, signal) {
        var _a, _b, _c, _d, _e;
        const inlineId = this.inlineMessageId;
        return inlineId !== undefined
            ? this.api.editMessageReplyMarkupInline(inlineId, { business_connection_id: this.businessConnectionId, ...other }, signal)
            : this.api.editMessageReplyMarkup(orThrow(this.chatId, "editMessageReplyMarkup"), orThrow((_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id, "editMessageReplyMarkup"), { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.stopPoll`. Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#stoppoll
     */
    stopPoll(other, signal) {
        var _a, _b, _c, _d, _e;
        return this.api.stopPoll(orThrow(this.chatId, "stopPoll"), orThrow((_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id, "stopPoll"), { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Context-aware alias for `api.deleteMessage`. Use this method to delete a message, including service messages, with the following limitations:
     * - A message can only be deleted if it was sent less than 48 hours ago.
     * - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
     * - Bots can delete outgoing messages in private chats, groups, and supergroups.
     * - Bots can delete incoming messages in private chats.
     * - Bots granted can_post_messages permissions can delete outgoing messages in channels.
     * - If the bot is an administrator of a group, it can delete any message there.
     * - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
     * Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemessage
     */
    deleteMessage(signal) {
        var _a, _b, _c, _d, _e;
        return this.api.deleteMessage(orThrow(this.chatId, "deleteMessage"), orThrow((_d = (_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.message_id) !== null && _b !== void 0 ? _b : (_c = this.messageReaction) === null || _c === void 0 ? void 0 : _c.message_id) !== null && _d !== void 0 ? _d : (_e = this.messageReactionCount) === null || _e === void 0 ? void 0 : _e.message_id, "deleteMessage"), signal);
    }
    /**
     * Context-aware alias for `api.deleteMessages`. Use this method to delete multiple messages simultaneously. Returns True on success.
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_ids A list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#deletemessages
     */
    deleteMessages(message_ids, signal) {
        return this.api.deleteMessages(orThrow(this.chatId, "deleteMessages"), message_ids, signal);
    }
    /**
     * Context-aware alias for `api.sendSticker`. Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.
     *
     * @param sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. Video and animated stickers can't be sent via an HTTP URL.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendsticker
     */
    replyWithSticker(sticker, other, signal) {
        return this.api.sendSticker(orThrow(this.chatId, "sendSticker"), sticker, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
    /**
     * Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.
     *
     * @param custom_emoji_ids A list of custom emoji identifiers
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#getcustomemojistickers
     */
    getCustomEmojiStickers(signal) {
        var _a, _b;
        return this.api.getCustomEmojiStickers(((_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.entities) !== null && _b !== void 0 ? _b : [])
            .filter((e) => e.type === "custom_emoji")
            .map((e) => e.custom_emoji_id), signal);
    }
    /**
     * Context-aware alias for `api.sendGift`. Sends a gift to the given user. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.
     *
     * @param gift_id Identifier of the gift
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendgift
     */
    replyWithGift(gift_id, other, signal) {
        return this.api.sendGift(orThrow(this.from, "sendGift").id, gift_id, other, signal);
    }
    /**
     * Context-aware alias for `api.sendGift`. Sends a gift to the given channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.
     *
     * @param gift_id Identifier of the gift
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendgift
     */
    replyWithGiftToChannel(gift_id, other, signal) {
        return this.api.sendGiftToChannel(orThrow(this.chat, "sendGift").id, gift_id, other, signal);
    }
    /**
     * Context-aware alias for `api.answerInlineQuery`. Use this method to send answers to an inline query. On success, True is returned.
     * No more than 50 results per query are allowed.
     *
     * Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.
     *
     * @param results An array of results for the inline query
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerinlinequery
     */
    answerInlineQuery(results, other, signal) {
        return this.api.answerInlineQuery(orThrow(this.inlineQuery, "answerInlineQuery").id, results, other, signal);
    }
    /**
     * Context-aware alias for `api.savePreparedInlineMessage`. Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.
     *
     * @param result An object describing the message to be sent
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#savepreparedinlinemessage
     */
    savePreparedInlineMessage(result, other, signal) {
        return this.api.savePreparedInlineMessage(orThrow(this.from, "savePreparedInlineMessage").id, result, other, signal);
    }
    /**
     * Context-aware alias for `api.sendInvoice`. Use this method to send invoices. On success, the sent Message is returned.
     *
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     * @param currency Three-letter ISO 4217 currency code, see more on currencies
     * @param prices Price breakdown, a list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendinvoice
     */
    replyWithInvoice(title, description, payload, currency, prices, other, signal) {
        return this.api.sendInvoice(orThrow(this.chatId, "sendInvoice"), title, description, payload, currency, prices, other, signal);
    }
    /**
     * Context-aware alias for `api.answerShippingQuery`. If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.
     *
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param ok Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answershippingquery
     */
    answerShippingQuery(ok, other, signal) {
        return this.api.answerShippingQuery(orThrow(this.shippingQuery, "answerShippingQuery").id, ok, other, signal);
    }
    /**
     * Context-aware alias for `api.answerPreCheckoutQuery`. Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
     *
     * @param ok Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#answerprecheckoutquery
     */
    answerPreCheckoutQuery(ok, other, signal) {
        return this.api.answerPreCheckoutQuery(orThrow(this.preCheckoutQuery, "answerPreCheckoutQuery").id, ok, typeof other === "string" ? { error_message: other } : other, signal);
    }
    /**
     * Context-aware alias for `api.refundStarPayment`. Refunds a successful payment in Telegram Stars.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#refundstarpayment
     */
    refundStarPayment(signal) {
        var _a;
        return this.api.refundStarPayment(orThrow(this.from, "refundStarPayment").id, orThrow((_a = this.msg) === null || _a === void 0 ? void 0 : _a.successful_payment, "refundStarPayment")
            .telegram_payment_charge_id, signal);
    }
    /**
     * Context-aware alias for `api.editUserStarSubscription`. Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.
     *
     * @param telegram_payment_charge_id Telegram payment identifier for the subscription
     * @param is_canceled Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot.
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#edituserstarsubscription
     */
    editUserStarSubscription(telegram_payment_charge_id, is_canceled, signal) {
        return this.api.editUserStarSubscription(orThrow(this.from, "editUserStarSubscription").id, telegram_payment_charge_id, is_canceled, signal);
    }
    /**
     * Context-aware alias for `api.verifyUser`. Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#verifyuser
     */
    verifyUser(other, signal) {
        return this.api.verifyUser(orThrow(this.from, "verifyUser").id, other, signal);
    }
    /**
     * Context-aware alias for `api.verifyChat`. Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.
     *
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#verifychat
     */
    verifyChat(other, signal) {
        return this.api.verifyChat(orThrow(this.chatId, "verifyChat"), other, signal);
    }
    /**
     * Context-aware alias for `api.removeUserVerification`. Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#removeuserverification
     */
    removeUserVerification(signal) {
        return this.api.removeUserVerification(orThrow(this.from, "removeUserVerification").id, signal);
    }
    /**
     * Context-aware alias for `api.removeChatVerification`. Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.
     *
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#removechatverification
     */
    removeChatVerification(signal) {
        return this.api.removeChatVerification(orThrow(this.chatId, "removeChatVerification"), signal);
    }
    /**
     * Context-aware alias for `api.setPassportDataErrors`. Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.
     *
     * Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.
     *
     * @param errors An array describing the errors
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#setpassportdataerrors
     */
    setPassportDataErrors(errors, signal) {
        return this.api.setPassportDataErrors(orThrow(this.from, "setPassportDataErrors").id, errors, signal);
    }
    /**
     * Context-aware alias for `api.sendGame`. Use this method to send a game. On success, the sent Message is returned.
     *
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via BotFather.
     * @param other Optional remaining parameters, confer the official reference below
     * @param signal Optional `AbortSignal` to cancel the request
     *
     * **Official reference:** https://core.telegram.org/bots/api#sendgame
     */
    replyWithGame(game_short_name, other, signal) {
        return this.api.sendGame(orThrow(this.chatId, "sendGame"), game_short_name, { business_connection_id: this.businessConnectionId, ...other }, signal);
    }
}
exports.Context = Context;
// PROBING SHORTCUTS
/**
 * `Context.has` is an object that contains a number of useful functions for
 * probing context objects. Each of these functions can generate a predicate
 * function, to which you can pass context objects in order to check if a
 * condition holds for the respective context object.
 *
 * For example, you can call `Context.has.filterQuery(":text")` to generate
 * a predicate function that tests context objects for containing text:
 * ```ts
 * const hasText = Context.has.filterQuery(":text");
 *
 * if (hasText(ctx0)) {} // `ctx0` matches the filter query `:text`
 * if (hasText(ctx1)) {} // `ctx1` matches the filter query `:text`
 * if (hasText(ctx2)) {} // `ctx2` matches the filter query `:text`
 * ```
 * These predicate functions are used internally by the has-methods that are
 * installed on every context object. This means that calling
 * `ctx.has(":text")` is equivalent to
 * `Context.has.filterQuery(":text")(ctx)`.
 */
Context.has = checker;
// === Util functions
function orThrow(value, method) {
    if (value === undefined) {
        throw new Error(`Missing information for API call to ${method}`);
    }
    return value;
}
function triggerFn(trigger) {
    return toArray(trigger).map((t) => typeof t === "string"
        ? (txt) => (txt === t ? t : null)
        : (txt) => txt.match(t));
}
function match(ctx, content, triggers) {
    for (const t of triggers) {
        const res = t(content);
        if (res) {
            ctx.match = res;
            return true;
        }
    }
    return false;
}
function toArray(e) {
    return Array.isArray(e) ? e : [e];
}
