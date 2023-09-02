// Question 1: Create a MySQL database by the name "myDB" and create a database user by
// the name "myDBuser" with a permissions to connect with the "myDB" database. Use the
// "mysql" module to create a connection with the newly created database. Display console
// message if the connection is successful or if it has an error.
// Please find further instructions under the “Instructions for question 1” below.

const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

var app = express();

app.listen(3001, () => console.log("listening on port 3001"));



app.use(
  express.urlencoded({
    extended: true,
  })
);

// for private use only
const corsOptions = {
  origin:[
    "http://localhost:3000",
],
}

// Middle ware to have access to the frontend
app.use(cors(corsOptions));



var mysqlConnection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "myDBuser",
  password: "1234",
  database: "myDB",
});

mysqlConnection.connect((err) => {
  if (err) console.log(err);
  else console.log("connected");
});

//   console.log(__filename)
// Question 2: Here is a link to a document that contains the tables we need to create and
// convert the apple.com/iphones page into a dynamic page with a database. As you can see
// from the document, there are 5 tables that are needed (please scroll horizontally and
// vertically over the document to see all the 5 tables). Write a SQL query to create the
// apple.com tables inside of the "myDB" database you created above. Once you write the
// queries, use the "mysql" module to execute the queries on the database. Try both of these
// methods to initiate the execution of the queries:
// ● Include the execution code directly in the module to be executed as you run the app
// ● Use the Express module to receive requests. Configure your module in a way that it
// executes the queries when the "/install" URL is visited.
// Please find further instructions under the “Instructions for question 2” below.

// app.get("/install", (req, res) => {});

app.get("/install", (req, res) => {
  let message = "Tables Created";

  let createProducts = `CREATE TABLE if not exists products(
        product_id int auto_increment,
        product_url varchar(255) not null,
        product_name varchar(255) not null,
        PRIMARY KEY (product_id)
    )`;

  let createProductDescription = `CREATE TABLE if not exists ProductDescription(
        description_id int auto_increment,
        product_id int(11) not null,
        product_brief_description TEXT not null,
        product_description TEXT not null,
        product_img varchar(255) not null,
        product_link varchar(255) not null,
        PRIMARY KEY (description_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
      )`;

  let createProductPrice = `CREATE TABLE if not exists ProductPrice(
        price_id int auto_increment,
        product_id int(11) not null,    
        starting_price varchar(255) not null,
        price_range varchar(255) not null,
        PRIMARY KEY (price_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
      )`;

  let createUser = `CREATE TABLE if not exists User(
        user_id int auto_increment,
        user_name varchar(255) not null,
        user_password varchar(255) not null,
        PRIMARY KEY (user_id)
      )`;

  let createOrders = `CREATE TABLE if not exists Orders(
        order_id int auto_increment,
        product_id int(11) not null,
        user_id int(11) not null,
        PRIMARY KEY (order_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id)
        )`;

  mysqlConnection.query(createProducts, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createProductDescription, (err, results, fields) => {
    if (err) console.log(err);
  });
  mysqlConnection.query(createProductPrice, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createUser, (err, results, fields) => {
    if (err) console.log(err);
  });

  mysqlConnection.query(createOrders, (err, results, fields) => {
    if (err) console.log(err);
  });

  res.end(message);
});

// Insert data

app.post("/add-product", (req, res) => {
  console.table(req.body);
  
  const {product_url, product_name, product_brief_description, product_description, product_img, product_link, starting_price, price_range, user_name, user_password  } = req.body;
 

  let insertProducts = `INSERT INTO products (product_url, product_name) VALUES(?, ?)`;
  let insertProductDescription = `INSERT INTO ProductDescription (product_id, product_brief_description, product_description, product_img, product_link) VALUES(?, ?, ?, ?, ?)`;
  let insertProductPrice = `INSERT INTO ProductPrice (product_id, starting_price, price_range) VALUES(?, ?, ?)`;
  let insertUser = `INSERT INTO User (user_name, user_password) VALUES(?, ?)`;
  let insertOrders = `INSERT INTO Orders (product_id, user_id) VALUES(?, ?)`;

  mysqlConnection.query(insertProducts, [product_url, product_name], (err, results, fields) => {
    if (err) console.log(`Error Found: ${err}`);
    console.table(results);

    const id = results.insertId;
    console.log(
      "id from products table to be used as a foreign key on the other tables>>>",
      id
    );

    mysqlConnection.query(insertProductDescription, [id, product_brief_description, product_description, product_img, product_link], (err, results, fields) => {
      if (err) console.log(`Error Found: ${err}`);
    });

    mysqlConnection.query(insertProductPrice, [id, starting_price, price_range], (err, results, fields) => {
      if (err) console.log(`Error Found: ${err}`);
    });

    mysqlConnection.query(insertUser, [user_name, user_password], (err, results, fields) => {
      if (err) console.log(`Error Found: ${err}`);

      console.table(results);

      const id2 = results.insertId;

      mysqlConnection.query(insertOrders, [id, id2], (err, results, fields) => {
        if (err) console.log(`Error Found: ${err}`);
      });
    });

  });

  res.end("Data inserted successfully");
  console.log("Data inserted successfully");
 
});


// Select 

app.get("/customers-detail-info", (req, res) => {
  mysqlConnection.query(
    `SELECT *
     FROM products
     JOIN ProductDescription ON products.product_id = ProductDescription.product_id
     JOIN ProductPrice ON products.product_id = ProductPrice.product_id
     JOIN Orders ON products.product_id = Orders.product_id
     JOIN User ON Orders.user_id = User.user_id 
`,
    (err, results, fields) => {
      if (err) {
        console.log("Error during selection", err);
      } else {
        console.table(results);
        res.send(results); // Send the results as a response
      }
    }
  );
});

// for iphones

 app.get("/iphones", (req, res) => {
  mysqlConnection.query(
    `SELECT *
     FROM products
     JOIN ProductDescription ON products.product_id = ProductDescription.product_id
     JOIN ProductPrice ON products.product_id = ProductPrice.product_id


`,
    (err, rows, fields) => {

      let iphones = {products: []};
      iphones.products = rows;
      var stringIphones = JSON.stringify(iphones);
      if (!err) res.end(stringIphones);
      else console.log(err);
      
    }
  );
});

//iphones.products = rows; - The rows variable contains the result rows returned by the query. Here, it assigns the result rows to the products property of the iphones object.

// let products = app.get("/iphones", (req, res) => {
//   mysqlConnection.query(
//     `SELECT *
//      FROM products
//      JOIN ProductDescription ON products.product_id = ProductDescription.product_id
//      JOIN ProductPrice ON products.product_id = ProductPrice.product_id
// `,
//     (err, results, fields) => {
//       if (err) {
//         console.log("Error during selection", err);
//       } else {
//         const products = results.map((result) => {
//           return {
//             product_id: result.product_id,
//             product_url: result.product_url,
//             product_name: result.product_name,
//             description_id: result.description_id,
//             product_brief_description: result.product_brief_description,
//             product_description: result.product_description,
//             product_img: result.product_img,
//             product_link: result.product_link,
//             price_id: result.price_id,
//             starting_price: result.starting_price,
//             price_range: result.price_range,
//           };
//         });
//         const response = { products };
//         console.table(response.products);
//         res.send(response); // Send the response with the "products" key
//       }
//     }
//   );
// });






// Route: /customers => To retrieve customized data from the tables
app.get("/customers", (req, res) => {
  const query = `
    SELECT products.product_id AS id, products.product_url, products.product_name,
           ProductDescription.product_brief_description, ProductDescription.product_description,
           ProductDescription.product_img, ProductDescription.product_link,
           ProductPrice.starting_price, ProductPrice.price_range,
           Orders.user_id,
           User.user_name, User.user_password
    FROM products
    JOIN ProductDescription ON products.product_id = ProductDescription.product_id
    JOIN ProductPrice ON products.product_id = ProductPrice.product_id
    JOIN Orders ON products.product_id = Orders.product_id
    JOIN User ON Orders.user_id = User.user_id
  `;

  mysqlConnection.query(query, (err, results, fields) => {
    if (err) {
      console.log("Error during selection", err);
      res.sendStatus(500); // Send an HTTP 500 status code to indicate an internal server error
    } else {
      console.table(results);
      res.send(results); // Send the results as a response
    }
  });
});


// Route: /update => To adjust or update data from the tables
app.put("/update", (req, res) => {
	const { newName, id } = req.body;
	let updateName = `UPDATE products SET product_url = ? WHERE product_id = ?`;
	mysqlConnection.query(updateName, [newName, id], (err, results, fields) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) updated");
		res.send(results);
	});
});


// Route: /remove-user => To delete all data from the tables
app.delete("/remove-user", (req, res) => {
	const { id } = req.body;
	let removerPoducts = `DELETE FROM products WHERE product_id = ?`;
	let removeProductDescription = `DELETE FROM ProductDescription WHERE product_id = ?`;
	let removeProductPrice = `DELETE FROM ProductPrice WHERE product_id = ?`;
  let removeUser = `DELETE FROM User WHERE user_id = ?`;
  let removeOrders = `DELETE FROM Orders WHERE product_id = ?`;

  
	mysqlConnection.query(removeOrders, [id], (err, results) => {
    if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});
  
  mysqlConnection.query(removeUser, [id], (err, results) => {
    if (err) throw err;
    console.log(results.affectedRows + " record(s) Deleted");
  });
	mysqlConnection.query(removeProductPrice, [id], (err, results) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});

  mysqlConnection.query(removeProductDescription, [id], (err, results) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});
  mysqlConnection.query(removerPoducts, [id], (err, results) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});

  res.end("Deleted");
});






// for react class
// app.get("/iphones", (req, res) => {
//   mysqlConnection.query(
//       "SELECT * FROM Products INNER JOIN ProductDescription INNER JOIN ProductPrice ON Products.product_id = ProductDescription.product_id AND Products.product_id = ProductPrice.product_id",
//       (err, rows) => {
//           // let iphones = { products: [] };
//           // iphones.products = rows;
//           // var stringIphones = JSON.stringify(iphones);
//           if (!err) res.json(rows);
//           else console.log(err);
//       }
//   );
// });






