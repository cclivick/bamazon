var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password123",
    database: "bamazon"
  });

connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId);
});

inquirer
    .prompt([
        {
            type: "list",
            name: "manOptions",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(answers => {
        if(answers.manOptions === "View Products for Sale")
    })