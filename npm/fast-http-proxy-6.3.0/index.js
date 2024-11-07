'use strict'

const warning = require('process-warning')()
warning.create('FastifyWarning.fastify-http-proxy', 'FST_MODULE_DEP_fastify-http-proxy'.toUpperCase(), 'fastify-http-proxy has been deprecated. Use @fastify/http-proxy@7.0.0 instead.')
warning.emit('FST_MODULE_DEP_fastify-http-proxy'.toUpperCase())

module.exports = require('fastify-http-proxy-deprecated')
