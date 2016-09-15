
var order = {
    customerId: null,
    username: 'chelsead.cline@yahoo.com',
    password: '1',
    geo: {
        latitude: 32.9587226,
        longitude: -96.82187729999998,
        distanceToSearch: 25,
        notActive: true
    }
}

var tacoCabana = require('./taco-cabana');

tacoCabana.searchByGeoCode(order.geo)
    .then(function (allLocations) {
        var closestLocation = allLocations[0];
        return {
            restaurantId: closestLocation.restaurantid,
            serviceTypeId: closestLocation.services[0].service_type_id
        }
    })
    .then(tacoCabana.getLocationInformation)
    .then(function (geoData) {
        
    })
    .catch(function(e) {
        console.log(e);
    })

// var p = tacoCabana.login(order.username, order.password)
//     .then(function (customerId) {
//         order.customerId = customerId
//         return tacoCabana.getPaymentMethods(customerId);
//     },
//     loginFailed);

// function loginFailed(e) {
//     console.log('Log in failed for ' + order.username);
// }


// var querystring = require('querystring');
// var https = require('https');

// var data =  {
//     'params': querystring.stringify({ restaurantId: 313, serviceTypeId: 2, customerId: 477967 }),
//     'service': 'getPaymentMethods',
// }

// // var dataString = JSON.stringify(data);

// var dataString2 = querystring.stringify(data);

// var options = {
//     host: 'order.tacocabana.com',
//     path: '/lib/novadine-controller.php',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Content-Length': Buffer.byteLength(dataString2),
//         Cookie:'__ac=a2FzaGxlZWNAZ21haWwuY29tOnRhY29rQHNo;'
//     }
// };

// var req = https.request(options, function(res) {
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         var data = JSON.parse(chunk);
//         var myCc = data[data.length-1];
//         console.log("body: " + chunk);
//     });
// });

// req.write(dataString2);
// req.end();


// var headers = {
//     Cookie:'__ac=a2FzaGxlZWNAZ21haWwuY29tOnRhY29rQHNo;'
// }

// var options = {
//     uri: 'https://order.tacocabana.com/lib/novadine-controller.php',
//     headers: headers,
//     body: dataString,
//     method: 'POST'
// }

// request(options,
//     function(err,httpResponse,body){
//         console.log(body);
// });

// var options = {
//   host: 'order.tacocabana.com',
//   path: '/lib/novadine-controller.php',
//   method: 'POST',
//   headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Content-Length': Buffer.byteLength(dataString)
//     }
// };

// var req = http.request(options, function(res) {
//   // response is here
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         console.log('Response: ' + chunk);
//     });
// });

// // write the request parameters
// req.write(dataString);

// req.end();