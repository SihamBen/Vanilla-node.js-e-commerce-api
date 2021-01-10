const http = require("http");
const morgan = require("morgan");
const logger = morgan("combined");
const finalhander = require("finalhandler");
const mongoose=require("mongoose")

const {MONGODB_URI}=require('./utils/secrets')
const {
  getProducts,
  getProduct,
  createProduct,
} = require("./controllers/productsController");
const {addReview}=require('./controllers/reviewController')

// Connect to MongoDB


  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("Mongo Connection Established");
    });
  connection.on("reconnected", () => {
    console.log("Mongo Connection Reestablished");
  });
  connection.on("disconnected", () => {
    console.log("Mongo Connection Disconnected");
    console.log("Trying to reconnect to Mongo ...");
    setTimeout(() => {
      mongoose.connect(MONGODB_URI);
    }, 3000);
  });
  connection.on("close", () => {
    console.log("Mongo Connection Closed");
  });
  connection.on("error", (error) => {
    console.log("Mongo Connection ERROR: " + error);
  });

  const run = async () => {
    await mongoose.connect(MONGODB_URI);
  };
  run().catch((error) => console.error(error));




const server = http.createServer((req, res) => {
    const done=finalhander(req,res)
    logger(req,res,function(err)
    {

        if (err) return done(err);
       
        if (req.url === "/api/products" && req.method === "GET") {
            getProducts(req, res);
          } else if (req.url.match(/\/api\/products\/[0-9]+/) && req.method === "GET") {
            const id = req.url.split("/")[3];
            getProduct(req, res, id);
          } else if (req.url === "/api/products" && req.method === "POST") {
            createProduct(res, req);
          } 
          else if (req.url === "/api/reviews" && req.method === "POST") {
            addReview(res, req);
          } 
          else if (req.url === "/api/reviews" && req.method === "GET") {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<form action="reviews" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="filetoupload"><br>');
            res.write('<input type="text" name="random"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            return res.end();
          } else {
            res.statusCode = 404;
            res.writeHead(404, { "Content-Type": "text/json" });
            res.end(JSON.stringify({ message: "Route not found" }));
          }

    }
    
    
    )
 
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
