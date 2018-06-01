let express = require('express');
let router = express.Router(),
    userTools = require('../tools/user_tools'),
    fs = require('fs'),
    multer = require('multer'),
    connections = require('../database/connection');

let upload = multer({
    dest: '../public/images'
});

router.get('/', function (req, res) {
    let hasLoggedIn = req.session.hasLoggedIn;
    if (!hasLoggedIn) {
        req.session.urlHistory = req.originalUrl;
        res.redirect('/login');

    } else {
        res.render('new-product');
    }
});

router.post('/', upload.array('product_images', 3),
    function (req, res, next) {
        let userId = req.session.userId;
        let newProduct = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            fk_user: userId,
        };
        let connection = connections.getUsersConnection();
        let productType = userTools.fromProductTypeToTableForAddProduct(newProduct, req.body);
        connection.query('INSERT INTO ' + productType + ' SET?', newProduct, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results.insertId);
                res.locals.newProductId = results.insertId;
                if (req.files.length !== 0) {
                    let defaultImage = "/images/" + req.body.product_type + res.locals.newProductId + 'N1.' + req.files[0].originalname.replace(/.+\./, "");
                    connection.query('update ' + productType + ' set image = ? where id = ?', [defaultImage, results.insertId], function (err, results) {
                        if (err) {
                            console.log(err);
                            res.end();
                        }
                    });
                }
                next();
            }
        });
    },
    function (req, res) {
        let connection = connections.getUsersConnection();
        let productType = req.body.product_type;
        for (let i = 0; i < req.files.length; i++) {
            let newPath = "public/images/" + req.body.product_type + res.locals.newProductId + 'N' + (i + 1) + '.' + req.files[i].originalname.replace(/.+\./, "");
            let newPathForPublic = "/images/" + req.body.product_type + res.locals.newProductId + 'N' + (i + 1) + '.' + req.files[i].originalname.replace(/.+\./, "");
            fs.rename(req.files[i].path, newPath,
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {

                        let newImage = {
                            path: newPathForPublic,
                            fk_product: res.locals.newProductId,
                            productType: productType
                        };
                        connection.query('insert into images set?', newImage, function (err, results) {
                            if (err) {
                                console.log(err);
                            } else {

                            }
                        });
                    }
                })
        }
        if (req.files.length === 0){
            let defaultImage = '/picture.jpg';
            connection.query('update '+ userTools.fromParamProductTypeToTableType(productType) +' set image = ? where id = ?', [defaultImage ,res.locals.newProductId], function (err, results) {
                if (err){
                    console.log(err);
                    res.end();
                }
            });
        }
        res.redirect('user/items-published/' + userTools.fromDataBaseTypeToUrl(req.body.product_type));
    });

module.exports = router;