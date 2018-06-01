let tool = {};

tool.fromProductTypeToTableForAddProduct = function (product, body) {
    let type = body.product_type;
    if (type === 'auction' || type === 'AUCTION' || type === 'Auction') {
        product.startTime = body.start_time;
        product.finalPrice = product.price;
        product.endTime = body.end_time;
        return 'auctions';
    } else if (type === 'two_hand' || type === 'TwoHand' || type === 'twohand') {
        return 'products';
    } else if (type === 'consignment' || type === 'CONSIGNMENT' || type === 'Consignment') {
        return 'consignments';
    } else {
        return '';
    }
};

tool.fromParamProductTypeToTableType = function (productType) {
    if (productType === 'auctions' || productType === 'auction' || productType === 'Auctions' || productType === 'Auction') {
        return 'Auctions';
    } else if (productType === 'two-hands' || productType === 'PRODUCTS' || productType === 'two_hand') {
        return 'PRODUCTS';
    } else if (productType === 'consignments' || productType === 'Consignments' || productType === 'consignment' || productType === 'Consignment') {
        return 'Consignments';
    } else {
        return '';
    }
};

tool.fromDataBaseTypeToUrl = function (productType) {
    if (productType === 'auctions' || productType === 'Auctions' || productType === 'AUCTIONS' || productType === 'auction') {
        return 'auctions';
    } else if (productType === 'two-hands' || productType === 'products' || productType === 'PRODUCTS' || productType === 'two_hand') {
        return 'two-hands';
    } else if (productType === 'Consignments' || productType === 'consignments' || productType === 'consignment') {
        return 'consignments';
    } else {
        return '';
    }
};



module.exports = tool;