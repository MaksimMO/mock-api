// Import the slugify library
var slugify = require('slugify');

// Get the input string from the command line arguments
var inputString = process.argv[2];

// Create a slug version of the input string using '-' as separator
var slug = slugify(inputString, {
    strict:true,
    lower:true
});

// Print the result to the console
console.log(slug);
