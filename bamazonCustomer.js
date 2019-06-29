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
                } else {
                  connection.query("SELECT price FROM products WHERE item_id = " + answers.selectID, function (err, result) {
                    var ID = answers.selectID;
                    var quantity = answers.howMany;
                    var totalCost = (result[0].price * answers.howMany).toFixed(2);
                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "confirm",
                          message: "Are you sure you'd like to purchase " + answers.howMany + " of this item for $" + totalCost + "?",
                          choices: ["Yes", "No"]
                        }
                      ]).then(answers => {
                        if(answers.confirm === "Yes") {
                          connection.query("UPDATE products SET stock_quantity = stock_quantity - " + quantity + " WHERE item_id = " + ID, function (err, result) {
                            if (err) throw err;
                            console.log(("You have been charged $" + totalCost + " for this purchase").bgGreen.black);
                            viewProducts();
                            })
                        } else {
                          viewProducts();
                        }
                      })
                  })
          }
        });
      })
    })
}

