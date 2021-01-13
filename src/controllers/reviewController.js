const formidable = require("formidable");
const fileSystem = require("fs");
const path = require("path");
const Review = require("../models/reviewModel");
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
function getAllReviews(req, res) {
  headers["Content-Type"] = "application/json";
  getAll(req, res, Review, headers);
}
// @desc get all reviews
async function getReviewById(req, res, id) {
  if (!id) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Bad request.",
      },
    });
  }
  const data = await Review.findById(id).exec();
  if (!data) {
    res.statusCode = 404;
    headers["Content-Type"] = "application/json";
    res.writeHead(404, headers);
    res.end(JSON.stringify({ message: "Not Found" }));
  }
try{
  const { rating, comment, author, product } = data;
  //let filePath = path.join(__dirname, data.reviewPictures[0]);
  let filePath ="C:\\Users\\siham\\Desktop\\Projects\\E-commerce-vanilla-Nodejs-API\\src\\public\\images\\reviews\\picture1.jpg";
  let stat = fileSystem.statSync(filePath);
  let readStream = fileSystem.createReadStream(filePath);
  headers["Content-Type"] = "multipart/form-data";
  headers["Content-Length"] = stat.size;
  res.writeHead(200, headers);

  readStream.on("data", function (data) {
    res.write(data);
  });

  readStream.on("end", function () {
    res.end(JSON.stringify(rating, comment, author, product));
  });}
  catch(err){
    console.log(err)
  }
}

// Add review
function addReview(res, req) {
  try {
    let uploadDir = "src\\public\\images\\reviews";
    let form = formidable({ multiples: true, uploadDir, keepExtensions: true });
    form.parse(req, async function (err, fields, files) {
      if (err) throw err;
      if (fields === null) {
        res.statusCode = 400;
        res.write("Bad Request");
        res.end();
      }
      try {
        const { rating, comment, author, product } = fields;
        let reviewData = { rating, comment, author, product };
        reviewData["reviewPictures"] = [];
        for (const file in files) {
          reviewData["reviewPictures"].push(files[file].path);
        }
        let newReview = new Review(reviewData);
        newReview = await newReview.save();
        res.statusCode = 201;
        res.write(JSON.stringify(newReview));
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
function deleteReview(req, res, id) {
  headers["Content-Type"] = "application/json";
  deleteDocument(req, res, id, Review, headers);
}
module.exports = { addReview, getAllReviews, getReviewById, deleteReview };
