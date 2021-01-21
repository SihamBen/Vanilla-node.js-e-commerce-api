const http = require("http");
const morgan = require("morgan");
const logger = morgan("combined");
const finalhandler = require("finalhandler");
const mongoose = require("mongoose");
const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("./controllers/userController");
const { register ,login,me} = require("./controllers/authController");
const { MONGODB_URI } = require("./utils/secrets");
const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} = require("./controllers/productsController");
const {
  addReview,
  getAllReviews,
  getReviewById,
  deleteReview,
} = require("./controllers/reviewController");
const { getReviewPicture } = require("./controllers/reviewPictureController");
const { getProductPicture } = require("./controllers/productPictureController");

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
  const done = finalhandler(req, res);
  logger(req, res, function (err) {
    if (err) return done(err);

    if (req.url === "/api/products" && req.method === "GET") {
      getAllProducts(req, res);
    } else if (
      req.url.match(/\/api\/products\/pictures\/[a-zA-Z0-9]+/) &&
      req.method === "GET"
    ) {
      const id = req.url.split("/")[4];
      getProductPicture(req, res, id);
    } else if (
      req.url.match(/\/api\/products\/[a-zA-Z0-9]+/) &&
      req.method === "GET"
    ) {
      const id = req.url.split("/")[3];
      getProductById(req, res, id);
    } else if (
      req.url.match(/\/api\/products\/[a-zA-Z0-9]+/) &&
      req.method === "DELETE"
    ) {
      const id = req.url.split("/")[3];
      deleteProduct(req, res, id);
    } else if (req.url === "/api/products" && req.method === "POST") {
      addProduct(res, req);
    } else if (req.url === "/api/users" && req.method === "GET") {
      getAllUsers(req, res);
    } else if (req.url === "/api/users" && req.method === "POST") {
      createUser(req, res);
    } else if (
      req.url.match(/\/api\/users\/[a-zA-Z0-9]+/) &&
      req.method === "GET"
    ) {
      const id = req.url.split("/")[3];
      getUserById(req, res, id);
    } else if (
      req.url.match(/\/api\/users\/[a-zA-Z0-9]+/) &&
      req.method === "PUT"
    ) {
      const id = req.url.split("/")[3];
      updateUser(req, res, id);
    } else if (
      req.url.match(/\/api\/users\/[a-zA-Z0-9]+/) &&
      req.method === "DELETE"
    ) {
      const id = req.url.split("/")[3];
      deleteUser(req, res, id);
    } else if (req.url === "/api/reviews" && req.method === "POST") {
      addReview(res, req);
    } else if (req.url === "/api/reviews" && req.method === "GET") {
      getAllReviews(req, res);
    } else if (
      req.url.match(/\/api\/reviews\/pictures\/[a-zA-Z0-9]+/) &&
      req.method === "GET"
    ) {
      const id = req.url.split("/")[4];
      getReviewPicture(req, res, id);
    } else if (
      req.url.match(/\/api\/reviews\/[a-zA-Z0-9]+/) &&
      req.method === "GET"
    ) {
      const id = req.url.split("/")[3];
      getReviewById(req, res, id);
    } else if (
      req.url.match(/\/api\/reviews\/[a-zA-Z0-9]+/) &&
      req.method === "DELETE"
    ) {
      const id = req.url.split("/")[3];
      deleteReview(req, res, id);
    } else if (req.url === "/api/auth/register" && req.method === "POST") {
      register(req, res);
    } 
    else if (req.url === "/api/auth/login" && req.method === "POST") {
      login(req, res);
    } 
    else if (req.url === "/api/auth/me" && req.method === "GET") {
      me(req, res);
    } else {
      res.statusCode = 404;
      res.writeHead(404, { "Content-Type": "text/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
