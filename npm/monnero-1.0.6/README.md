[npm-url]: https://npmjs.org/package/monero

[downloads-url]: https://npmjs.org/package/monero

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: http://standardjs.com

node-monero is a simple tool for all things related to the cryptocurrency.
  

## Install

`npm install monero`

## Examples

```js
// Current price
const monero = require('monero');

monero.price(function(p) {
  console.log(p)
})
```