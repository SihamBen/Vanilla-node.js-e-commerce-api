const formidable = require("formidable");
const Review = require("../models/reviewModel");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "text/json",
};

// @desc get all reviews
async function getAllReviews(req, res) {
  try {
    const reviews = await review.find({});
    res.statusCode = 200;
    
    res.writeHead(200,headers);

    res.end(JSON.stringify(reviews));
  } catch (error) {
    console.log(error);
  }
}
// @desc get one review
async function getReview(req, res, id) {
  if (!id) {
    return res.status(400).json({
        error: {
            status: 400,
            message: "Bad request."
        }
    });
}
  try {
   
  const review = await review.findById(id).exec();
    if (!review) {
        res.statusCode = 404;
        res.writeHead(404,headers);
        res.end(JSON.stringify({message:"review Not Found"}));
    }
    else {
        res.statusCode = 200;
        res.writeHead(200,headers);
      res.end(JSON.stringify(review));
        
    }
  } catch (error) {
    console.log(error);
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
        let reviewData = {};
        reviewData = Object.assign(reviewData, fields);
        reviewData["images"] = [];
        for (const file in files) {
          reviewData["images"].push(file.path);
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
async function deleteReview(req, res, id) {
  if (!id) {
    return res.status(400).json({
        error: {
            status: 400,
            message: "Bad request."
        }
    });
}
  try {
   
  const review = await review.findByIdAndRemove(id).exec();
    if (!review) {
        res.statusCode = 404;
        res.writeHead(404,headers);
        res.end(JSON.stringify({message:"review Not Found"}));
    }
    else {
        res.status(204)
        res.writeHead(200,headers);
      res.end('Review was removed');
        
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = { addReview };
