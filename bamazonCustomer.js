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
  viewProducts();
  //connection.end();
});

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, result) {
    if (err) throw err;
    console.table(result);
    inquirer
        .prompt([
            {
                type: "number",
                name:"selectID", 
                message: "Type the item_id number of the product you wish to purchase:"
            },
            {
                type: "number",
                name: "howMany",
                message: "How many would you like to purchase?"
            }
        ]).then(answers => {
          var item = answers.selectID;
          var quantity = answers.howMany;
          connection.query("SELECT * FROM products WHERE item_id = " + item + " AND stock_quantity >= " + quantity, function (err, result) {
            console.table(result);
            if(result.length < 1) {
              console.log("Insufficient Quantity! Please Try Again!".bgRed.black);
              viewProducts();
            } 
          else {
              inquirer
                .prompt([
                  {
                    type: "confirm",
                    name: "confirm",
                    message: "Are you sure you'd like to purchase " + answers.howMany + " of this item?"
                  }
                ]).then(answers => {
                  
                })
          }
        });
      })
    })
}

//OFFICE HOURS: Line 47. Not sure how to identify an empty table (array?) sent back from MySQL
