const { Review } = require("../models/reviewModel");
const url = require("url");
// Get all documents
async function getAll(req, res, model, headers) {
  try {
    const data = await model.find({});
    res.statusCode = 200;

    res.writeHead(200, headers);

    res.end(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}
// Get Document By Id

async function getDocument(req, res, id, model, headers) {
  if (!id) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Bad request.",
      },
    });
  }
  try {
    const data = await model.findById(id).exec();
    if (!data) {
      res.statusCode = 404;
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: "Not Found" }));
    } else {
      res.statusCode = 200;
      res.writeHead(200, headers);
      res.end(JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
  }
}
// Filter documents

async function filterDocuments(req, res, model, headers) {
  let condition = url.parse(req.url, true).query;

  try {
    const data = await model.find(condition).exec();
    if (!data) {
      res.statusCode = 404;
      res.writeHead(404, headers);
      res.end(JSON.stringify({ message: "Not Found" }));
    } else {
      res.statusCode = 200;
      res.writeHead(200, headers);
      res.end(JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
  }
}

// @desc add a  document
async function createDocument(req, res, model,document, headers) {
  try {
   
    req.on("end", async () => {
      let newDocument = new model(document);
      newDocument = await newDocument.save();
      res.statusCode = 201;
      res.writeHead(201, headers);
      res.end(JSON.stringify(newDocument));
    });
  } catch (error) {
    console.log(error);
  }
}

// @desc modify a  document
async function updateDocument(req, res, model,id, document, headers) {
  try {
    req.on("end", async () => {
      let newDocument = model.findByIdAndUpdate(id,document,{new:true})
      res.statusCode = 201;
      res.writeHead(201, headers);
      res.end(JSON.stringify(newDocument));
    });
  } catch (error) {
    console.log(error);
  }
}

// delete a document
async function deleteDocument(req, res, id, model, headers) {
  try {
    const data = await model.findByIdAndDelete(id);

    res.statusCode = 200;
    res.writeHead(200, headers);
    res.end(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getAll,
  getDocument,
  filterDocuments,
  deleteDocument,
  createDocument,
  updateDocument,
};
