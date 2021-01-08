const Product = require("../models/productModel");
// @desc get all products
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "text/json"
};
async function getProducts(req, res) {
  try {
    const products = await Product.find({});
    res.statusCode = 200;
    
    res.writeHead(200,headers);

    res.end(JSON.stringify(products));
  } catch (error) {
    console.log(error);
  }
}
// @desc get one product

async function getProduct(req, res, id) {

  if (!id) {
    return res.status(400).json({
        error: {
            status: 400,
            message: "Bad request."
        }
    });
}
  try {
   
  const product = await Product.findById(id).exec();
    if (!product) {
        res.statusCode = 404;
        res.writeHead(404,headers);
        res.end(JSON.stringify({message:"Product Not Found"}));
    }
    else {
        res.statusCode = 200;
        res.writeHead(200,headers);
      res.end(JSON.stringify(product));
        
    }
  } catch (error) {
    console.log(error);
  }
}
// @desc add a  product
async function createProduct(req,res)
{
    try{
      const body=""
      req.on('data',(chunk)=>{
              body+=chunk.toString()
      })
      req.on('end',async ()=>{
        const {productName,category,image,description,price,reviews}=JSON.parse(body)
        const product={productName,category,image,description,price,reviews}
        let newProduct = new Product(product);
        newProduct = await newProduct.save();
        res.statusCode = 201;
        res.writeHead(201, headers);
        res.end(JSON.stringify(newProduct));
      })
      
    }
    catch(error)
    {console.log(error)}
}
// @desc updated product
async function updateProduct(req,res,product)
{
    try{
        const products=await Products.updateProduct(products)
        res.statusCode = 200;
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(products));
    }
    catch(error)
    {console.log(error)}
}
// @desc delete a product 
async function deleteProduct(req, res, id) {
    try {
      const products = await Products.deleteProduct(id);
    
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/json");
        res.end(JSON.stringify(products));
     
    } catch (error) {
      console.log(error);
    }
  }
module.exports = { getProducts, getProduct,createProduct};
