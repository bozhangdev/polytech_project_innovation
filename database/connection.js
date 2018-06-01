var config = require('./config');
var mysql = require('mysql');

var connections = {};

connections.getUsersConnection = function () {
    return mysql.createConnection(config.users);

}

module.exports = connections;