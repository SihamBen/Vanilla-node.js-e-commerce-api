const { Schema, model } = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    occupation: String,
    phoneNumber: Object, // { dialCode: string , number : string }
    identityCardNumber: String,
    address: String,
    zipCode: String,
    city: String,
    country: String,
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    delete ret["password"];
    return ret;
  },
});

userSchema.pre("save", function (next) {
  if (this.isNew) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
  }
  next();
});

userSchema.methods.validPassword = function (inputedPassword) {
  return bcrypt.compareSync(inputedPassword, this.password);
};

userSchema.methods.getJWT = function () {
  return JWT.sign({ userId : this._id}, process.env.ACCESS_TOKEN_SIGNATURE_KEY);
};

userSchema.methods.hashPassword = function () {
  this.password = bcrypt.hashSync(this.password, 8);
};

module.exports = model("User", userSchema);
