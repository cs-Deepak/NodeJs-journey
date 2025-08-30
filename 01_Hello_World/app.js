const fs = require("fs");

// //Sunc.... Blocking......
// fs.writeFileSync("./test2.txt", "Hello, How Nodejs work");

// //Async... Non-Blocking...
// fs.writeFile("./test2.txt", "Hello, How Nodejs work", (err) => {});



//Blocking 
// console.log('1')
// const result = fs.readFileSync('contacts.txt','utf-8');
// console.log(result)
// console.log('2')


//Non-Blocking

console.log('1')
fs.readFile('./contacts.txt', "utf-8", (err, result)=>{
    console.log(result)
});
console.log('2')