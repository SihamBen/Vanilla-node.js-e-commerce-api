const winston =require ("winston");
const { ENVIRONMENT } =require ("./secrets");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug"
    }),
    new winston.transports.File({ filename: "debug.log", level: "debug" })
  ]
});

module.exports={logger};
