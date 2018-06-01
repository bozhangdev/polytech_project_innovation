let express = require('express');
let router = express.Router(),
    connections = require('../database/connection');


router.get('/', function (req, res) {
    res.render('signup');
});

router.post('/', function (req, res) {
    let email = req.body.user_email,
        password = req.body.user_pwd,
        firstname = req.body.user_fname,
        lastname = req.body.user_lname;
    let connection = connections.getUsersConnection();
    connection.query("select * from USERS where email = ?", [email], function (error, results) {
        if (error != null) {
            console.log(error.toString());
        }
        if (results.length === 0) {
            let regEmail = /^[a-zA-Z\d]+([- \.][a-zA-Z\d]+)*@etu+(\.[a-zA-Z\d]+)\.fr$/;
            if(!regEmail.test(email)){
                res.send("Please use your university email account");
            }
            else {
            connection.query("INSERT INTO USERS SET?", {
                    email: email,
                    psword: password,
                    firstname: firstname,
                    lastname: lastname,
                    school: 'polytech'
                },
                function (error, results) {
                    if (error != null) {
                        console.log(error.toString());
                    }
                    res.locals.status ='success';
                    console.log('New user: '+ results.insertId);
                    res.render('signup')
                });
            }
        } else {
            res.send("double");
        }

    })

});

module.exports = router;