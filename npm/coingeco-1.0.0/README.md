
# coingecko

node js coingecko api

[https://www.coingecko.com/en/api/documentation](https://www.coingecko.com/en/api/documentation)


#### notes
```
basic usage

npm i -S https://gitlab.com/brucelim/coingecko

const coingecko = require('coingecko')
const res = coingecko.ping()
console.log(res)
```


#### tests
```
- everything
npm run test

- individual modules
./node_modules/.bin/tape tests/01.simple.js
./node_modules/.bin/tape tests/02.coins.js
```
