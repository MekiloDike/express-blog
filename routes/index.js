// import { Router } from 'express';
const { Router } = require("express");
const { login, signUp, getOneBlogById } = require("../controllers/middleware/jwt.middleware");
var router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", login);
router.post("/signup", signUp);

router.post('/blogs/:id', getOneBlogById)

module.exports = router;
