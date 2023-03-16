const connectDB = require("./config/connectDB");
const mongoose = require("mongoose");
const productController = require("./controller/productController");
const customerController = require("./controller/customerController");

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3500;

app
  .route("/products/:id")
  .get(productController.getOneProduct)
  .delete(productController.deleteProduct)
  .patch(productController.updateProduct);

app
  .route("/products")
  .get(productController.getAllProducts)
  .post(productController.newProduct);

app
  .route("/customers/:id")
  .get(customerController.getOneCustomer)
  .delete(customerController.deleteCustomer)
  .patch(customerController.updateCustomer);

app
  .route("/customers")
  .get(customerController.getAllCustomers)
  .post(customerController.newCustomer);

connectDB();

const myDB = mongoose.connection.useDb("merch");

mongoose.connection.once("open", () => {
  console.log("-----------------------------");
  console.log("Connected to Database");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log("-----------------------------");
});
