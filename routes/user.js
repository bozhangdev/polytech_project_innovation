let express = require('express');
let router = express.Router();
let connections = require('../database/connection');
let userTool = require('../tools/user_tools');

router.use('/', function (req, res, next) {
    let session = req.session;
    if (!session.hasLoggedIn) {
        req.session.urlHistory = req.baseUrl;
        res.redirect('/login');
    }
    else {
        next();
    }
});
router.get('/', function (req, res) {
    let session = req.session;
    let connection = connections.getUsersConnection();
    connection.query("select * from USERS where id = ?", [session.userId],
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                let user = results[0];
                res.locals.status = req.session.hasLoggedIn;
                res.render('user', {user});
            }
        });
});

router.post('/', function (req, res) {
    let session = req.session;
    let userId = req.session.userId;
    let connection = connections.getUsersConnection();
    var sentence = "";
    sentence = "UPDATE USERS SET firstname ='" + req.body.user_fname + "', lastname = '" + req.body.user_lname + "', email = '" + req.body.user_email + "' WHERE id = ?";
    connection.query(sentence, [userId], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results.affectedRows);
        }
    });
    connection.query("select * from USERS where id = ?", [session.userId],
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                let user = results[0];
                res.locals.status = req.session.hasLoggedIn;
                res.render('user', {user});
            }
        });
})
router.get('/orders', function (req, res) {
    let userId = req.session.userId;
    let connection = connections.getUsersConnection();
    connection.query('select * from orders where fk_user = ?', [userId], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.render('orders', {results: results});
        }
    });
});

router.get('/orders/:orderId', function (req, res) {
    let orderId = req.params.orderId;
    let connection = connections.getUsersConnection();
    connection.query('select * from orders where id = ?', [orderId], function (err, results) {
        if (err) {
            console.log(err);
        } else if (results.length === 0) {
            res.send("No such order");
        } else {
            let order = results[0];
            res.render('order', order);
        }
    });
});

router.get('/items-published/:product', function (req, res) {
    let dataBase = userTool.fromParamProductTypeToTableType(req.params.product);
    let userId = req.session.userId;
    let connection = connections.getUsersConnection();
    connection.query('select * from ' + dataBase + ' where fk_user = ?', [userId], function (err, results) {
        if (err) {
            console.log(err.toString());
        } else {
            res.render('items-published', {searchresult: results});
        }
    })
});


module.exports = router;
