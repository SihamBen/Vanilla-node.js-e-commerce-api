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
  headers["Content-Type"] = "application/json";
  getDocument(req, res, id, Review, headers);
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
        let route = "http://localhost:3000/api/reviews/pictures/";
        for (const file in files) {
          let filename = files[file].path.split("\\").pop();
          reviewData["reviewPictures"].push(route + filename);
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
