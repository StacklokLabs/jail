"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapters = void 0;
const SECRET_HEADER = "X-Telegram-Bot-Api-Secret-Token";
const SECRET_HEADER_LOWERCASE = SECRET_HEADER.toLowerCase();
const WRONG_TOKEN_ERROR = "secret token is wrong";
const ok = () => new Response(null, { status: 200 });
const okJson = (json) => new Response(json, {
    status: 200,
    headers: { "Content-Type": "application/json" },
});
const unauthorized = () => new Response('"unauthorized"', {
    status: 401,
    statusText: WRONG_TOKEN_ERROR,
});
/** AWS lambda serverless functions */
const awsLambda = (event, _context, callback) => {
    var _a;
    return ({
        update: JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}"),
        header: event.headers[SECRET_HEADER],
        end: () => callback(null, { statusCode: 200 }),
        respond: (json) => callback(null, {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: json,
        }),
        unauthorized: () => callback(null, { statusCode: 401 }),
    });
};
/** AWS lambda async/await serverless functions */
const awsLambdaAsync = (event, _context) => {
    var _a;
    // deno-lint-ignore no-explicit-any
    let resolveResponse;
    return {
        update: JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}"),
        header: event.headers[SECRET_HEADER],
        end: () => resolveResponse({ statusCode: 200 }),
        respond: (json) => resolveResponse({
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: json,
        }),
        unauthorized: () => resolveResponse({ statusCode: 401 }),
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** Azure Functions v3 and v4 */
const azure = (context, request) => {
    var _a, _b;
    return ({
        update: Promise.resolve(request.body),
        header: (_b = (_a = context.res) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b[SECRET_HEADER],
        end: () => (context.res = {
            status: 200,
            body: "",
        }),
        respond: (json) => {
            var _a, _b, _c, _d;
            (_b = (_a = context.res) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 ? void 0 : _b.call(_a, "Content-Type", "application/json");
            (_d = (_c = context.res) === null || _c === void 0 ? void 0 : _c.send) === null || _d === void 0 ? void 0 : _d.call(_c, json);
        },
        unauthorized: () => {
            var _a, _b;
            (_b = (_a = context.res) === null || _a === void 0 ? void 0 : _a.send) === null || _b === void 0 ? void 0 : _b.call(_a, 401, WRONG_TOKEN_ERROR);
        },
    });
};
const azureV4 = (request) => {
    let resolveResponse;
    return {
        update: Promise.resolve(request.json()),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => resolveResponse({ status: 204 }),
        respond: (json) => resolveResponse({ jsonBody: json }),
        unauthorized: () => resolveResponse({ status: 401, body: WRONG_TOKEN_ERROR }),
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** Bun.serve */
const bun = (request) => {
    let resolveResponse;
    return {
        update: request.json(),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(ok());
        },
        respond: (json) => {
            resolveResponse(okJson(json));
        },
        unauthorized: () => {
            resolveResponse(unauthorized());
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** Native CloudFlare workers (service worker) */
const cloudflare = (event) => {
    let resolveResponse;
    event.respondWith(new Promise((resolve) => {
        resolveResponse = resolve;
    }));
    return {
        update: event.request.json(),
        header: event.request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(ok());
        },
        respond: (json) => {
            resolveResponse(okJson(json));
        },
        unauthorized: () => {
            resolveResponse(unauthorized());
        },
    };
};
/** Native CloudFlare workers (module worker) */
const cloudflareModule = (request) => {
    let resolveResponse;
    return {
        update: request.json(),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            resolveResponse(ok());
        },
        respond: (json) => {
            resolveResponse(okJson(json));
        },
        unauthorized: () => {
            resolveResponse(unauthorized());
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** express web framework */
const express = (req, res) => ({
    update: Promise.resolve(req.body),
    header: req.header(SECRET_HEADER),
    end: () => res.end(),
    respond: (json) => {
        res.set("Content-Type", "application/json");
        res.send(json);
    },
    unauthorized: () => {
        res.status(401).send(WRONG_TOKEN_ERROR);
    },
});
/** fastify web framework */
const fastify = (request, reply) => ({
    update: Promise.resolve(request.body),
    header: request.headers[SECRET_HEADER_LOWERCASE],
    end: () => reply.status(200).send(),
    respond: (json) => reply.headers({ "Content-Type": "application/json" }).send(json),
    unauthorized: () => reply.code(401).send(WRONG_TOKEN_ERROR),
});
/** hono web framework */
const hono = (c) => {
    let resolveResponse;
    return {
        update: c.req.json(),
        header: c.req.header(SECRET_HEADER),
        end: () => {
            resolveResponse(c.body(""));
        },
        respond: (json) => {
            resolveResponse(c.json(json));
        },
        unauthorized: () => {
            c.status(401);
            resolveResponse(c.body(""));
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** Node.js native 'http' and 'https' modules */
const http = (req, res) => {
    const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
    return {
        update: new Promise((resolve, reject) => {
            const chunks = [];
            req.on("data", (chunk) => chunks.push(chunk))
                .once("end", () => {
                // @ts-ignore `Buffer` is Node-only
                // deno-lint-ignore no-node-globals
                const raw = Buffer.concat(chunks).toString("utf-8");
                resolve(JSON.parse(raw));
            })
                .once("error", reject);
        }),
        header: Array.isArray(secretHeaderFromRequest)
            ? secretHeaderFromRequest[0]
            : secretHeaderFromRequest,
        end: () => res.end(),
        respond: (json) => res
            .writeHead(200, { "Content-Type": "application/json" })
            .end(json),
        unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
    };
};
/** koa web framework */
const koa = (ctx) => ({
    update: Promise.resolve(ctx.request.body),
    header: ctx.get(SECRET_HEADER) || undefined,
    end: () => {
        ctx.body = "";
    },
    respond: (json) => {
        ctx.set("Content-Type", "application/json");
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.status = 401;
    },
});
/** Next.js Serverless Functions */
const nextJs = (request, response) => ({
    update: Promise.resolve(request.body),
    header: request.headers[SECRET_HEADER_LOWERCASE],
    end: () => response.end(),
    respond: (json) => response.status(200).json(json),
    unauthorized: () => response.status(401).send(WRONG_TOKEN_ERROR),
});
/** nhttp web framework */
const nhttp = (rev) => ({
    update: Promise.resolve(rev.body),
    header: rev.headers.get(SECRET_HEADER) || undefined,
    end: () => rev.response.sendStatus(200),
    respond: (json) => rev.response.status(200).send(json),
    unauthorized: () => rev.response.status(401).send(WRONG_TOKEN_ERROR),
});
/** oak web framework */
const oak = (ctx) => ({
    update: ctx.request.body.json(),
    header: ctx.request.headers.get(SECRET_HEADER) || undefined,
    end: () => {
        ctx.response.status = 200;
    },
    respond: (json) => {
        ctx.response.type = "json";
        ctx.response.body = json;
    },
    unauthorized: () => {
        ctx.response.status = 401;
    },
});
/** Deno.serve */
const serveHttp = (requestEvent) => ({
    update: requestEvent.request.json(),
    header: requestEvent.request.headers.get(SECRET_HEADER) || undefined,
    end: () => requestEvent.respondWith(ok()),
    respond: (json) => requestEvent.respondWith(okJson(json)),
    unauthorized: () => requestEvent.respondWith(unauthorized()),
});
/** std/http web server */
const stdHttp = (req) => {
    let resolveResponse;
    return {
        update: req.json(),
        header: req.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse)
                resolveResponse(ok());
        },
        respond: (json) => {
            if (resolveResponse)
                resolveResponse(okJson(json));
        },
        unauthorized: () => {
            if (resolveResponse)
                resolveResponse(unauthorized());
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** Sveltekit Serverless Functions */
const sveltekit = ({ request }) => {
    let resolveResponse;
    return {
        update: Promise.resolve(request.json()),
        header: request.headers.get(SECRET_HEADER) || undefined,
        end: () => {
            if (resolveResponse)
                resolveResponse(ok());
        },
        respond: (json) => {
            if (resolveResponse)
                resolveResponse(okJson(json));
        },
        unauthorized: () => {
            if (resolveResponse)
                resolveResponse(unauthorized());
        },
        handlerReturn: new Promise((resolve) => {
            resolveResponse = resolve;
        }),
    };
};
/** worktop Cloudflare workers framework */
const worktop = (req, res) => {
    var _a;
    return ({
        update: Promise.resolve(req.json()),
        header: (_a = req.headers.get(SECRET_HEADER)) !== null && _a !== void 0 ? _a : undefined,
        end: () => res.end(null),
        respond: (json) => res.send(200, json),
        unauthorized: () => res.send(401, WRONG_TOKEN_ERROR),
    });
};
const elysia = (ctx) => {
    // @note upgrade target to use modern code?
    // const { promise, resolve } = Promise.withResolvers<string>();
    let resolve;
    const handlerReturn = new Promise((res) => resolve = res);
    return {
        // @note technically the type shouldn't be limited to Promise, because it's fine to await plain values as well
        update: Promise.resolve(ctx.body),
        header: ctx.headers[SECRET_HEADER_LOWERCASE],
        end() {
            resolve("");
        },
        respond(json) {
            // @note since json is passed as string here, we gotta define proper content-type
            ctx.set.headers["content-type"] = "application/json";
            resolve(json);
        },
        unauthorized() {
            ctx.set.status = 401;
            resolve("");
        },
        handlerReturn,
    };
};
// Please open a pull request if you want to add another adapter
exports.adapters = {
    "aws-lambda": awsLambda,
    "aws-lambda-async": awsLambdaAsync,
    azure,
    "azure-v4": azureV4,
    bun,
    cloudflare,
    "cloudflare-mod": cloudflareModule,
    elysia,
    express,
    fastify,
    hono,
    http,
    https: http,
    koa,
    "next-js": nextJs,
    nhttp,
    oak,
    serveHttp,
    "std/http": stdHttp,
    sveltekit,
    worktop,
};
