var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', function (req, res, next) {
    let session = req.session;
    if (session.hasLoggedIn){
        res.locals.status = true;
    } else {
        res.locals.status = false;
    }
    next();
});

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
