var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router(),
    connections = require('../database/connection');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/result-sort', function (req, res) {
    var name = req.session.searchname,
        type = req.session.searchtype;
        order = req.query.select_product_order;

    var sentence = "";
    var param;

    if(type === "all type"){
        sentence = "SELECT id,name,description,price,status,fk_user,image , 'PRODUCTS' as type FROM PRODUCTS where name like '%' ? '%' and status = 'published' UNION ALL SELECT id,name,description,price,status,fk_user,image , 'Consignments' as type FROM Consignments where name like '%' ? '%' and status = 'published' UNION ALL SELECT id,name,description,price,status,fk_user,image , 'Auctions' as type FROM Auctions where name like '%' ? '%' and status = 'published' ORDER by " + order;
        param = [name,name,name];
    }else if(type !== "all type") {
        if(type === "two_hand"){type="PRODUCTS";}
        else if(type ==="consignment") {type = "Consignments";}
        else{type = "Auctions";}
        sentence = "select * , '" + type + "' as type from " + type + " where name like '%' ? '%' and status = 'published' ORDER by " + order;
        param = [name];
    }

    var connection = connections.getUsersConnection();
    connection.query(sentence, param, function (error, results) {
        if (error != null) {
            console.log(error.toString());
        }
        if (results.length === 0) {
            res.send("Sorry, we don't have this product now")
        }
        else {
            res.render('search-results', {searchresult: results, productname: name, producttype: type, productsort: order});
        }
    });
});

router.get('/index-result', function (req, res,next) {
    req.session.searchname = req.query.product_name;
    req.session.searchtype = req.query.select_product_type;
    var name = req.query.product_name,
        type = req.query.select_product_type,
        order = "no sort";
    var sentence = "";
    var param;

    if(type === "all type"){
        sentence = "SELECT id,name,description,price,status,fk_user,image , 'PRODUCTS' as type FROM PRODUCTS where name like '%' ? '%' and status = 'published' UNION ALL SELECT id,name,description,price,status,fk_user,image , 'Consignments' as type FROM Consignments where name like '%' ? '%' and status = 'published' UNION ALL SELECT id,name,description,price,status,fk_user,image , 'Auctions' as type FROM Auctions where name like '%' ? '%' and status = 'published'";
        param = [name,name,name];
    }else if(type !== "all type") {
        if(type === "two_hand"){type="PRODUCTS";}
        else if(type ==="consignment") {type = "Consignments";}
        else{type = "Auctions";}
        sentence = "select * , '" + type + "' as type from " + type + " where name like '%' ? '%' and status = 'published'";
        param = [name];
    }

    var connection = connections.getUsersConnection();
    connection.query(sentence, param, function (error, results) {
        if (error != null) {
            console.log(error.toString());
        }
        if (results.length === 0) {
            res.send("Sorry, we don't have this product now")
        }
        else {
            // var string = JSON.stringify(results);
            // var json = JSON.parse(string);
            // json.forEach(function (item) {
            //     let id = item.id;
            //     let pt;
            //     if(item.type === "PRODUCTS"){
            //         pt = 'two_hand';
            //     }else if(item.type === "Consignments"){
            //         pt = 'consignment';
            //     }else if(item.type === "Auctions"){
            //         pt = 'auction';
            //     }
            //     var connectionn = connections.getUsersConnection();
            //     var p = "";
            //     connectionn.query("select * from Images where fk_product = ? and productType = ?", [id, pt], function (error, resultss) {
            //         if (error) {
            //             console.log(error);
            //         } else if (resultss.length === 0){
            //
            //         } else {
            //             let a = resultss[0];
            //             console.log(a.path);
            //         }
            //     });
            // });
            res.render('search-results', {searchresult: results, productname: name, producttype: type, productsort: order});
        }
    });
}
);

module.exports = router;