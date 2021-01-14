const formidable = require("formidable");
const Product = require("../models/productModel");
const {
  getAll,
  getDocument,
  filterDocuments,
  deleteDocument,
  updateDocument,
} = require("./queries");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "",
};

// @desc get all reviews
function getAllProducts(req, res) {
  headers["Content-Type"] = "application/json";
  getAll(req, res, Product, headers);
}
// @desc get all reviews
async function getProductById(req, res, id) {
  headers["Content-Type"] = "application/json";
  getDocument(req, res, id, Product, headers);
}

// Add review
function addProduct(res, req) {
  try {
    let uploadDir = "src\\public\\images\\products";
    let form = formidable({ multiples: true, uploadDir, keepExtensions: true });
    form.parse(req, async function (err, fields, files) {
      if (err) throw err;
      if (fields === null) {
        res.statusCode = 400;
        res.write("Bad Request");
        res.end();
      }
      try {
        const { productName, category, price, description } = fields;
        let productData = { productName, category, price, description };
        productData["productPictures"] = [];
        let route = "http://localhost:3000/api/products/pictures/";
        for (const file in files) {
          let filename = files[file].path.split("\\").pop();
          productData["productPictures"].push(route + filename);
        }
        let newProduct = new Product(productData);
        newProduct = await newProduct.save();
        res.statusCode = 201;
        res.write(JSON.stringify(newProduct));
        res.end();
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// @desc remove one review
function deleteProduct(req, res, id) {
  headers["Content-Type"] = "application/json";
  deleteDocument(req, res, id, Product, headers);
}
module.exports = { addProduct, getAllProducts, getProductById, deleteProduct };
