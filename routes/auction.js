let express = require('express');
let router = express.Router(),
    connections = require('../database/connection');

/* GET home page. */
router.use('/', function (req, res, next) {
    let session = req.session;
    if (!session.hasLoggedIn) {
        req.session.urlHistory = req.originalUrl;
        res.redirect('/login');
    }
    else {
        next();
    }
});

router.get('/:id',
    function (req, res, next) {
        let auctionId = req.params.id;
        let connection = connections.getUsersConnection();
        connection.query('select * from Auctions where id = ?', [auctionId], function (err, results) {
            if (err) {
                console.log(err);
            } else if (results.length === 0) {
                res.send('No such auction');
            } else {
                res.locals.auction = results[0];
                next();
            }
        })
    },

    function (req, res) {
        let auction = res.locals.auction;
        let connection = connections.getUsersConnection();
        connection.query('select * from AuctionHistory where fk_auction = ?', [req.params.id], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                let renderTarget = {
                    auction: auction,
                    histories: results,
                    canJoin: req.session.userId !== auction.fk_user,
                    isTheFinalUser: false
                };
                let timeDifference = (new Date()).getTime() - res.locals.auction.endtime.getTime();
                if (timeDifference > 0 && timeDifference < 1000*60*30) {
                    if (auction.finalPrice === auction.price){
                        connection.query('update Auctions set status = ? where id = ?', ['fail', req.params.id], function (err, results) {
                            if (err){
                                console.log(err);
                            }
                        });
                    } else {
                        if (auction.status === 'published') {
                            connection.query('update Auctions set status = ? where id = ?', ['ready_to_pay', req.params.id], function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    }
                    if (req.session.userId === res.locals.auction.finalUser) {
                        renderTarget.isTheFinalUser = true;
                    }else {
                        renderTarget.isTheFinalUser = false;
                    }
                } else if (timeDifference > 1000*60*30) {
                    renderTarget.isTheFinalUser = false;
                    connection.query('update Auctions set status = ? where id = ?', ['fail', req.params.id], function (err, results) {
                        if (err){
                            console.log(err);
                        }
                    });
                }
                res.render('auction', renderTarget);
            }
        })
    });

router.post('/:id', function (req, res, next) {
    res.locals.auctionId = req.params.id;
    let connection = connections.getUsersConnection();
    connection.query('select * from Auctions where id = ?', [res.locals.auctionId], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            let auctionToChange = results[0];
            if (auctionToChange.finalPrice >= req.body.new_price) {
                res.send("Your price must be bigger than current price.")
            } else {
                connection.query('update Auctions set FinalPrice = ?, FinalUser = ? where id = ?', [req.body.new_price, req.session.userId, res.locals.auctionId],
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            next();
                        }
                    });
            }
        }
    })

}, function (req, res) {
    let connection = connections.getUsersConnection();
    let date = new Date();
    let newAuctionHostory = {
        fk_auction: res.locals.auctionId,
        fk_user: req.session.userId,
        date: date,
        price: req.body.new_price
    };
    connection.query('insert into AuctionHistory set?', newAuctionHostory, function (err, results) {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/auction/' + res.locals.auctionId);
        }
    })
});

module.exports = router;