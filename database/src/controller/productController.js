const product = require("../model/productModel");

const getAllProducts = async (req, res) => {
  const _products = await product.find().lean();

  if (!_products?.length) {
    return res.status(400).json({ message: "products not found" });
  }

  console.log(`Fetched data of ${_products.length} products`);
  return res.json(_products);
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Product id is required" });

  const _product = await product.findById(id).exec();

  if (!_product) {
    return res.status(400).json({ message: "product not found" });
  }

  console.log(`Fetched data of ${_product.title}.`);
  return res.json(_product);
};

const newProduct = async (req, res) => {
  const { title, desc, price, stock } = req.body;

  if (!title || !desc || !price)
    return res
      .status(400)
      .json({ message: "title, Descreption and price are required" });

  const duplicate = await product.findOne({ title }).lean().exec();
  if (duplicate)
    return res.sendStatus(409).json({ message: `${title} is already used` });

  try {
    const result = await product.create({
      title: title,
      desc: desc,
      price: price,
      stock: stock,
    });

    console.log(`New product created with id: ${result._id}`);
    return res.status(201).json({ message: `New product ${title} created` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, desc, price, stock } = req.body;

  if (!title || !desc || !price)
    return res
      .status(400)
      .json({ message: "title, Descreption and price are required" });

  const _product = await product.findById(id).exec();
  const duplicate = await product.findOne({ title }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Title already used" });
  }

  _product.title = title;
  _product.desc = desc;
  _product.price = price;
  _product.stock = stock;

  const updatedProduct = await _product.save();

  console.log(`Product: ${updatedProduct.title} updated`);
  res.json({ message: `Product: ${updatedProduct.title} updated` });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Product id is required" });

  const _product = await product.findById(id).exec();
  if (!_product) {
    return res.status(400).json({ message: "Product with id not found" });
  }

  const result = await _product.deleteOne();

  console.log(`Product with id: ${id} deleted successfully`);
  res.json({ message: `Product with id: ${id} deleted successfully` });
};

module.exports = {
  getAllProducts,
  getOneProduct,
  newProduct,
  updateProduct,
  deleteProduct,
};
