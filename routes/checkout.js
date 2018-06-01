let express = require('express');
let router = express.Router();
let connections = require('../database/connection');
let userTool = require('../tools/user_tools');

router.use('/', function (req, res, next) {
    let session = req.session;
    if (!session.hasLoggedIn) {
        res.redirect('/login');
    }
    else {
        next();
    }
});

router.post('/', function (req, res) {
    let productId = req.body.productId;
    let productType = req.body.productType;
    let connection = connections.getUsersConnection();
    connection.query("select * from " + userTool.fromParamProductTypeToTableType(productType) + " where id = ?", [productId], function (err, results) {
        if (err) {
            console.log(err);
        } else if (results.length === 0) {
            res.send("No such product");
        } else if (results[0].fk_user === req.session.userId) {
            res.send("You can't buy your own product");
        } else {
            let product = results[0];
            console.log(product.name);

            res.render('checkout', {
                name: product.name,
                price: product.price,
                productId: productId,
                productType: productType
            });
        }
    });
});

router.post('/result', function (req, res) {
    let productId = req.body.productId;
    let connection = connections.getUsersConnection();
    connection.query('select * from ' + userTool.fromParamProductTypeToTableType(req.body.productType) + ' where id = ?', [productId], function (err, results) {
        if (err) {
            console.log(err);
        } else if (results.length === 0) {
            res.send("No such item");
        } else if (results[0].status === 'sold' || results[0].status === 'paid') {
            res.send("This item has been sold");
        } else {
            connection.query("update " + userTool.fromParamProductTypeToTableType(req.body.productType) + " set status = 'paid' where id = ?", [productId], function () {
                if (err) {
                    console.log(err);
                } else {
                    let userId = req.session.userId;
                    let date = new Date();
                    let dateNow = date.toLocaleDateString();
                    let order = {
                        fk_product: productId,
                        productType: req.body.productType,
                        fk_user: userId,
                        date: dateNow,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        telephone: req.body.telephone,
                        street: req.body.street,
                        city: req.body.city,
                        postalCode: req.body.postalCode
                    };
                    let connection = connections.getUsersConnection();
                    connection.query('insert into orders set?', order, function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/user/orders/' + results.insertId);
                        }
                    });

                }
            });

        }
    })
});

module.exports = router;