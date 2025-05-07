# fast-utilz

**fast-utilz** is a lightweight utility library designed to provide essential operations for strings, arrays, numbers, and even console manipulation. It's fast, reliable, and easy to integrate into your projects.

---

## Features

- **`reverseString(string)`**  
  Reverses the given string.  

- **`capitalize(string)`**  
  Capitalizes the first letter of the provided string.  

- **`average(array)`**  
  Calculates the average of an array of numbers.  

- **`uniqueArray(array)`**  
  Removes duplicate elements from an array and returns only the unique values.  

- **`setConsoleTitle(title)`**  
  Sets the title of the console window (Windows only).  

---

## Installation

Install **fast-utilz** via npm:

```bash
npm install fast-utilz
```

---

## Usage Examples

### Reverse a String
```javascript
const fastUtils = require("fast-utilz");
console.log(fastUtils.reverseString("hello")); 
// Output: "olleh"
```

### Capitalize the First Letter
```javascript
console.log(fastUtils.capitalize("world")); 
// Output: "World"
```

### Calculate the Average of Numbers
```javascript
console.log(fastUtils.average([1, 2, 3, 4])); 
// Output: 2.5
```

### Remove Duplicates from an Array
```javascript
console.log(fastUtils.uniqueArray([1, 2, 2, 3, 4, 4])); 
// Output: [1, 2, 3, 4]
```

### Set the Console Title (Windows Only)
```javascript
fastUtils.setConsoleTitle("My Custom Title");
// The console window title is now "My Custom Title"
```

> **Note**: The `setConsoleTitle` function is supported only on Windows systems. For non-Windows platforms, a message will be logged indicating that the operation is not supported.

---


## License

This project is licensed under the ISC License.