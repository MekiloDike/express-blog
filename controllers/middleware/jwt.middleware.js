const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var debug = require("debug")("express-blog:server");
const {
  createUser,
  getUserForLogin,
  getUser,
  getBlogById,
} = require("../../repositories");

function allowLoggedIn(req, res, next) {
  const token = req.get("Authorization");
  const authorization = token.split("Bearer ")[1];
  if (!token) {
    res.status(401).send("User is not logged in");
  } else {
    jwt.verify(authorization, "Secret", function (err, resp) {
      if (err) {
        res.status(401).send("User is not logged in");
      } else {
        res.locals.user = jwt.decode(authorization);
        // debug("E blog", req.body);
        next();
      }
    });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { password: pass, ...user } = await getUserForLogin(email);
    const isUser = await bcrypt.compare(password, pass);
    if (!isUser) res.status(401).send("Provide a correct password");

    res.append(
      "Authorization",
      "Bearer " + jwt.sign(user._doc, "Secret", { expiresIn: "1h" })
    );
    res.send(isUser ? user._doc : null);
  } catch (err) {
    res.status(401).send(err.message);
  }
}

async function signUp(req, res, next) {
  const { first_name, last_name, email, password } = req.body;
  const newUser = await createUser(first_name, last_name, email, password);
  if (!newUser) res.status(403).send("No content to sign up");
  res.status(200).send(newUser);
}

async function createBlog(req, res, next) {
  // debug("creating blog", req.body)
  if (req.body) {
    try {
      const { content, title, tags, description } = req?.body;
      const author = res.locals.user._id;
      const blog = await createBlog(content, author, title, tags, description);
      res.send(blog);
    } catch (err) {
      res?.status(401).send(err.message);
    }
  }
}

async function getOneBlogById(req, res, next) {
  try {
    const { id } = req.params;
    const blog = await getBlogById(id);
    if (blog) res.status(200).send(blog);
    res.status(403).send("No content to get blog");
  } catch (err) {
    res.status(403).send(err.message);
  }
}

module.exports = {
  signUp,
  login,
  allowLoggedIn,
  createBlog,
  getOneBlogById,
};
