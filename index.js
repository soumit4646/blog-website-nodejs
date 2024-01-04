const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectToDb = require("./db");
const { checkForAuthCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

// route
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

// config
connectToDb();
const app = express();
dotenv.config();
const port = process.env.PORT;

// view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static("./public"));

//
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.use("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.get("*", function (req, res) {
  res.render("404");
});

app.listen(port, () => console.log(`Server started at port: ${port}`));
