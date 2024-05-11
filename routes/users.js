var express = require('express');
const { allowLoggedIn, createBlog } = require('../controllers/middleware/jwt.middleware');
var router = express.Router();

// router.use()

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/blog', allowLoggedIn,createBlog)

module.exports = router;
