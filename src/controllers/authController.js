const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "application/json",
};
const register = async (req, res) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      let data = JSON.parse(body);

      const user = new User(data);
      await user.save();
      const token = user.getJWT();
      res.writeHead(201, headers);
      res.end(JSON.stringify({ user, token }));
    });
  } catch (err) {
    console.log(err);
    res.writeHead(500, headers);
    res.end(JSON.stringify({ message: err.message || err }));
  }
};
const login = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end",async () => {
    let data = JSON.parse(body);
    const { email, password } = data;
    if (!(email && password)) {
      res.writeHead(400, headers);
      res.end(JSON.stringify({ message: "Bad request" }));
    }
    let user;
    try {
        user = await User.findOne({ email });
      } catch (error) {
        res.writeHead(401,headers)
        res.end(JSON.stringify({ message: "Unauthorized" }));
      }
    
      if (!user || !user.validPassword(password)) {
        res.writeHead(401,headers)
        res.end(JSON.stringify({ message: "Unauthorized" }));
      }
    
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SIGNATURE_KEY,
        { expiresIn: "1h" }
      );
      res.writeHead(200,headers)
      res.end(JSON.stringify({ user, token }));

  });

  
  
};

const changePassword = async (req, res) => {
  const id = res.locals.jwtPayload.userId;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  let data=JSON.parse(body);
  const { oldPassword, newPassword } = data;
  if (!(oldPassword && newPassword)) {
    res.writeHead(400,headers)
    res.end(JSON.stringify({ massage: "Bad  request" }));
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    res.writeHead(401,headers)
        res.end(JSON.stringify({ message: "Unauthorized" }));
  }

  if (!user || !user.validPassword(oldPassword)) {
    res.writeHead(401,headers)
    res.end(JSON.stringify({ message: "Unauthorized" }));
  }

  user.hashPassword();
  await user.save(user);

  res.status(204).json(user);
};

const me = async (req, res) => {
  let user;
  try {
    const { userId } = res.locals.jwtPayload;
    user = await User.findById(userId);
    res.writeHead(401,headers)
   res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(401,headers)
    res.end(JSON.stringify({ message: "Unauthorized" }));
  }
};

module.exports = { register, login,me};
