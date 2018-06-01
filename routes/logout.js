var express = require('express');
var router = express.Router(),
    connections = require('../database/connection');


// GET /signout 登出
router.get('/', function(req, res, next) {
    // 清空 session 中用户信息
    req.session.user = null;
    req.session.hasLoggedIn=false;
    // 登出成功后跳转到主页
    res.locals.status = false;
    res.redirect("/");
});

module.exports = router;