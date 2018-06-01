var express = require('express');
var router = express.Router();
var connections = require('../database/connection');

/* GET home page. */
router.get('/', function (req, res, next) {
        let productId = req.query.id;
        let producttype = req.query.type;
        let connection = connections.getUsersConnection();
        var sentence = "select * from " + producttype + " where id = ?";
        connection.query(sentence, [productId], function (err, results) {
            if (err) {
                console.log(err);
            } else if (results.length === 0) {
                res.send("No such product");
            } else {
                res.locals.product = results[0];
                next();
            }
        });
    },

    function (req, res) {
        let product = res.locals.product;
        product.productType = req.query.type;
        res.render('product', {product: product});
    });

module.exports = router;