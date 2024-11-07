'use strict'

const rpc = require('./src/rpc')
const base = require('./src/base')
const simple = require('./src/simple')
const coins = require('./src/coins')
const contract = require('./src/contract')
const categories = require('./src/categories')
const exchanges = require('./src/exchanges')
const indexes = require('./src/indexes')
const derivatives = require('./src/derivatives')
const nfts = require('./src/nfts')
const search = require('./src/search')


let baseobj = base()
module.exports = function(apikey) {
    this.ping = baseobj.ping
    this.simple = simple(apikey)
    this.coins = coins(apikey)
    this.contract = contract(apikey)
    this.getAssetPlatforms = baseobj.getAssetPlatforms
    this.categories = categories(apikey)
    this.exchanges = exchanges(apikey)
    this.indexes = indexes(apikey)
    this.derivatives = derivatives(apikey)
    this.nfts = nfts(apikey)
    this.getExchangeRates = baseobj.getExchangeRates
    this.search = search(apikey)
    this.getGlobalData = baseobj.getGlobalData
    this.getGlobalDefiData = baseobj.getGlobalDefiData
    this.getPublicCompanyData = baseobj.getPublicCompanyData
}


module.exports.ping = baseobj.ping
module.exports.simple = simple()
module.exports.coins = coins()
module.exports.contract = contract()
module.exports.getAssetPlatforms = baseobj.getAssetPlatforms
module.exports.categories = categories()
module.exports.exchanges = exchanges()
module.exports.indexes = indexes()
module.exports.derivatives = derivatives()
module.exports.nfts = nfts()
module.exports.getExchangeRates = baseobj.getExchangeRates
module.exports.search = search()
module.exports.getGlobalData = baseobj.getGlobalData
module.exports.getGlobalDefiData = baseobj.getGlobalDefiData
module.exports.getPublicCompanyData = baseobj.getPublicCompanyData
