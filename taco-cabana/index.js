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
    getMenus: getMenus
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
        customerId: locationMenuModel.menuId,
        hour: locationMenuModel.serviceTypeId,
        minute: locationMenuModel.serviceTypeId,
        day: locationMenuModel.serviceTypeId,
        month: locationMenuModel.serviceTypeId,
        year: locationMenuModel.serviceTypeId,
        serviceId: locationMenuModel.serviceTypeId,
        return_order: locationMenuModel.serviceTypeId,
        is_asap: locationMenuModel.serviceTypeId
    };
    return callTacoCabana('startOrder', data);
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