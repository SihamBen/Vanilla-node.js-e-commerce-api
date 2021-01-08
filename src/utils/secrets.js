const logger = require("./logger") ;
const dotenv = require( "dotenv");
const {Logger}=require('winston')

const fs = require("fs") ;

if (fs.existsSync(".env")) {
 
  dotenv.config({ path: ".env" });
} else {
 
  dotenv.config({ path: ".env.example" }); // you can delete this after you create your own .env file!
}
const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'
 const MONGODB_URI = prod
  ? process.env["MONGODB_URI"]
  : process.env["MONGODB_URI_LOCAL"];

if (!MONGODB_URI) {
  logger.error(
    "No mongo connection string. Set MONGODB_URI environment variable."
  );
  process.exit(1);
}
module.exports={MONGODB_URI,ENVIRONMENT}