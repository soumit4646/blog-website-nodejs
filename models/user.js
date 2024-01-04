const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");
const { createToken } = require("../utils/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "img/default_user.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPass;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const providedPassHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== providedPassHash)
      throw new Error("Invaid username and password");

    const token = createToken(user);
    return token;
  }
);

const User = model("user", userSchema);
module.exports = User;
