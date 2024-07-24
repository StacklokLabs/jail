Dom between React and Next

## Getting started

```sh
npm install --save react-next-dom
```

## Usage/Examples

```js
const dom = require('react-next-dom');
const assert = require('assert');
const callBind = require('call-bind');
const callBound = require('call-bind/callBound');

function f(a, b) {
	assert.equal(this, 1);
	assert.equal(a, 2);
	assert.equal(b, 3);
	assert.equal(arguments.length, 2);
}

const fBound = callBind(f);

const slice = callBound('Array.prototype.slice');

delete Function.prototype.call;
delete Function.prototype.bind;

fBound(1, 2, 3);

assert.deepEqual(slice([1, 2, 3, 4], 1, -1), [2, 3]);
```

## Tests

Clone the repo, `npm install`, and run `npm test`


