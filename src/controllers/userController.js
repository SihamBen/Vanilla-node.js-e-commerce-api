const formidable = require("formidable");
const User = require("../models/userModel");
const {
  getAll,
  getDocument,
  createDocument,
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

// @desc get all users
function getAllUsers(req, res) {
  headers["Content-Type"] = "application/json";
  getAll(req, res, User, headers);
}
// @desc get user
async function getUserById(req, res, id) {
  headers["Content-Type"] = "application/json";
  getDocument(req, res, id, User, headers);
}
// @desc create new user

async function createUser(req,res)
{
    headers["Content-Type"] = "application/json";
    createDocument(req, res, User, headers);
}
// @desc update  user

async function updateUser(req,res,id)
{
    headers["Content-Type"] = "application/json";
    updateDocument(req, res,id, User, headers);
}


// @desc remove one User
function deleteUser(req, res, id) {
  headers["Content-Type"] = "application/json";
  deleteDocument(req, res, id, User, headers);
}
module.exports = { createUser, getAllUsers, getUserById, deleteUser,updateUser };
