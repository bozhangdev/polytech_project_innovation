let express = require('express'),
    router = express.Router(),
    connections = require('../database/connection');


router.get('/', function (req, res) {
    res.render('login');
});

router.post('/', function (req, res) {
    let email = req.body.user_email,
        password = req.body.user_pwd;

    let connection = connections.getUsersConnection();
    connection.query("select * from USERS where email = ?", [email], function (error, results) {
        if (error != null) {
            console.log(error.toString());
        }
        if (results.length === 0) {
            res.send("This email doesn't exist")
        }
        else {
            let user = results[0];
            if (user.psword === password) {
                req.session.userId = user.id;
                console.log(user.id);
                req.session.hasLoggedIn = true;
                console.log(req.sessionID);
                res.locals.status = req.session.hasLoggedIn;
                if (req.session.urlHistory){
                    let url = req.session.urlHistory;
                    console.log(url);
                    req.session.urlHostory = null;
                    res.redirect(url);
                } else {
                    res.render('index');
                }
            }
            else {
                res.redirect('/login');
            }


        }

    });
});

module.exports = router;