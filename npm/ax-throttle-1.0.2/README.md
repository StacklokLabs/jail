# axios-throttle

Library which allows to throttle axios library request

## Installation

`npm install axios-throttle`

## Usage

```js
const axios = require('axios');
const axiosThrottle = require('axios-throttle'); 
//pass axios object and value of the delay between requests in ms
axiosThrottle.init(axios,200)
const options = {
  method: 'GET',
};
const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/todos/2',
  'https://jsonplaceholder.typicode.com/todos/3',
  'https://jsonplaceholder.typicode.com/todos/4',
  'https://jsonplaceholder.typicode.com/todos/5',
  'https://jsonplaceholder.typicode.com/todos/6',
  'https://jsonplaceholder.typicode.com/todos/7',
  'https://jsonplaceholder.typicode.com/todos/8',
  'https://jsonplaceholder.typicode.com/todos/9',
  'https://jsonplaceholder.typicode.com/todos/10'
];
const promises = [];
const responseInterceptor = response => {
  console.log(response.data);
  return response;
};

//add interceptor to work with each response seperately when it is resolved
axios.interceptors.response.use(responseInterceptor, error => {
  return Promise.reject(error);
});

for (let index = 0; index < urls.length; index++) {
  options.url = urls[index];
  promises.push(axiosThrottle.getRequestPromise(options, index));
}

//run when all promises are resolved
axios.all(promises).then(responses => {
  console.log(responses.length);
});
```

# Run example

`npm i`  
`npm run example`

# API

## init

Initializes library  
@param {any} axiosArg axios - object  
@param {number} delayBetweenRequests - delay between requests in miliseconds (If you want to send 5 requests per second you need to set value of this parameter to 200)  

## getRequestPromise  

Returns request's promise  
@param {any} options - axios options    
@param {number} index - index from urls array
