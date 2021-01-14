const fileSystem = require("fs");
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000,
    "Content-Type": "",
  };

async function getReviewPicture(req, res, id) {
  if (!id) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Bad request.",
      },
    });
  }
  
  try {
   
    let filePath =
      "C:\\Users\\siham\\Desktop\\Projects\\E-commerce-vanilla-Nodejs-API\\src\\public\\images\\reviews\\"+id;
    let stat = fileSystem.statSync(filePath);
    let readStream = fileSystem.createReadStream(filePath);
    headers["Content-Type"] = "image/jpg";
    headers["Content-Length"] = stat.size;
    res.writeHead(200, headers);
    readStream.on("data", function (data) {
      res.write(data);
    });

    readStream.on("end", function () {
      res.end();
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports={getReviewPicture}