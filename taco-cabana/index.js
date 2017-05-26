var qs = require('qs');
var https = require('https');
var Promise = require('promise');
var fs = require('fs');
var _cookie = '';
var servicesNotRequiringAuth = [
    'login',
    'searchByGeoCode',
    'getLocationInformation',
    'getLocationMenus',
    'getLocationMenuCategories'
];

var tacoCabana = {
    login: login,
    getPaymentMethods: getPaymentMethods,
    searchByGeoCode: searchByGeoCode,
    getLocationInformation: getLocationInformation,
    // getMenus: getMenus,
    startOrder: startOrder,
    updateOrderItems: updateOrderItems,
    addPayment: addPayment,
    checkPayment: checkPayment
}

/////////////////////

function login(username, password) {
    var data = {
        ac_name: '"' + username + '"',
        ac_password: '"' + password + '"'
    };
    return callTacoCabana('login', data)
        .then(function (data) {
            _cookie = '__ac=' + data[1];
            var customerId = data[0];
            if (customerId === -1) {
                throw 'Invalid login credentials'
            }
            return data[0];
        });
}

function getPaymentMethods(customerId) {
    var data = {
        restaurantId: 313,
        serviceTypeId: 2,
        customerId: customerId
    };
    return callTacoCabana('getPaymentMethods', data);
}

function searchByGeoCode(geoSearchModel) {
    var data = {
        latitude: geoSearchModel.latitude,
        longitude: geoSearchModel.longitude,
        distanceInMiles: geoSearchModel.distanceToSearch,
        notActive: geoSearchModel.notActive
    };
    return callTacoCabana('searchByGeoCode', data);
}

function getLocationInformation(getLocationModel) {
    var data = {
        restaurantId: getLocationModel.restaurantId,
        serviceTypeId: getLocationModel.serviceTypeId,
        serviceHours: 1,
        legacy_hours: 1
    };
    return callTacoCabana('getLocationInformation', data);
}

function getLocationMenus(restaurantId) {
    var data = {
        restaurantId: restaurantId
    };
    return callTacoCabana('getLocationMenus', data);
}

function getLocationMenuCategories(locationMenuModel) {
    var data = {
        restaurantId: locationMenuModel.restaurantId,
        menuId: locationMenuModel.menuId,
        serviceTypeId: locationMenuModel.serviceTypeId
    };
    return callTacoCabana('getLocationMenuCategories', data);
}

function startOrder(locationMenuModel) {
    var data = {
        restaurantId: locationMenuModel.restaurantId,
        customerId: locationMenuModel.customerId,
        hour: locationMenuModel.hour,
        minute: locationMenuModel.minute,
        day: locationMenuModel.day,
        month: locationMenuModel.month,
        year: locationMenuModel.year,
        serviceId: locationMenuModel.serviceId,
        return_order: locationMenuModel.return_order,
        is_asap: locationMenuModel.is_asap
    };
    return callTacoCabana('startOrder', data);
}

function updateOrderItems(updateModel) {
    // Not sure if all of these are needed, but idk which aren't
    var data = {
        customerId: updateModel.customerId,
        // items: JSON.stringify([{
        //     basePrice: 1269,
        //     categoryId: 763,
        //     childItems: null,
        //     comment: "Will be picked up by " + updateModel.customerName,
        //     itemId: 562,
        //     menuId: 113,
        //     menuSelected: 763,
        //     name: "Dozen Breakfast Taco Box - TC's Way",
        //     orderItemId: null,
        //     parentCategory: "113",
        //     quantity: "2",
        //     refName: updateModel.customerName,
        //     uniqueId: 1473899687334
        // }]),
        items: JSON.stringify([{
            basePrice: 129,
            categoryId: 1727,
            childItems: [{
                categoryId: 1737,
                itemId: 13331,
                level: "child",
                menuId: 113,
                name: "Flour Tortilla",
                pickListId: 770,
                price: 0,
                quantity: "1"
            }],
            comment: "Will be picked up by " + updateModel.customerName,
            itemId: 177,
            menuId: 113,
            menuSelected: 1727,
            name: "Bacon & Egg Taco",
            orderItemId: null,
            parentCategory: "113",
            quantity: "1",
            refName: updateModel.customerName,
            sizeId: 30000000,
            sizeName: "Single Taco",
            sizePrice: 129,
            uniqueId: 1473984795400,
        }]),
        orderId: updateModel.orderId
    }
    return callTacoCabana('updateOrderItems', data)
        .then(order => {
            order.coupons = order.coupons || [];
            order.coupons.push({
                appliedValue: -25,
                applyToTotal: false,
                clu: "25offTC",
                couponId: 20633,
                description: "25% Off First Online Order up to $50 off  Does not include alcohol. Not valid with other offers.",
                name: "25% Off First Order",
                orderItemCouponId: 238797,
                startDate: "2015-07-27",
                value: 0
            });
            return order;
        });
}

function addPayment(paymentModel) {
    return callTacoCabana('addPayment', paymentModel)
        .then(paymentInfo => {
            return paymentInfo.pendingPayment;
        });
}

function checkPayment(checkPaymentModel) {
    return callTacoCabana('checkPayment', checkPaymentModel);
}



function callTacoCabana(serviceName, data) {

    if (servicesNotRequiringAuth.indexOf(serviceName) === -1 && !_cookie) {
        throw 'Not logged in';
    }

    var dString = qs.stringify({
        'params': data,
        'service': serviceName,
    });

    // We will use the Promise paradigm
    return new Promise(function (resolve, reject) {
        var options = {
            host: 'order.tacocabana.com',
            path: '/lib/novadine-controller.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(dString),
                Cookie: _cookie,
                'Accept': 'application/json'
            }
        };

        var req = https.request(options, function (res) {
            var bigChunk = '';
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                bigChunk += chunk;
            });

            res.on('end', function () {
                var data = JSON.parse(bigChunk);
                resolve(data);
            })
        });

        req.on('error', function (e) {
            reject(e);
        })

        req.write(dString);
        req.end();
    })
}

module.exports = tacoCabana;