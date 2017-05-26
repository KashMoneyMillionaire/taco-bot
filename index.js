
var restify = require('restify');
var builder = require('botbuilder');
var config = require('./config');

// Setup Restify Server
var server = restify.createServer();
server.listen(config.port, function () { });

// Create chat bot
var connector = new builder.ChatConnector({
    appId: config.microsoft.appId,
    appPassword: config.microsoft.appPassword
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.dialog('/', function (session) {
    console.log('received message: ' + session.message.source);
    console.log(session.message.address.channelId);
    console.log(session.message.address.serviceUrl);
    session.send("Hello World");
    console.log('response sent');
});

//-------------------------------------------------------


var order = {
    customerId: null,
    name: 'Kash',
    username: 'kashleec@gmail.com',
    password: 'tacok@sh',
    userCreditCardSecurityCode: 293,
    geo: {
        latitude: 32.9587226,
        longitude: -96.82187729999998,
        distanceToSearch: 25,
        notActive: true
    }
}

var tacoCabana = require('./taco-cabana');

tacoCabana
    // Log in
    .login(order.username, order.password)
    // Set customerId
    .then(userId => order.customerId = userId)
    // Find the nearest location to the office
    .then(() => tacoCabana.searchByGeoCode(order.geo))
    // Start an order for this location
    .then(locations => {
        var closestLocation = locations[0];
        var model = {
            restaurantId: closestLocation.restaurantid,
            customerId: order.customerId,
            hour: 9,
            minute: 0,
            day: 16,
            month: 9,
            year: 2016,
            serviceId: closestLocation.services[0].service_type_id,
            return_order: true, // idk what this is?
            is_asap: false // I think this means future order
        };
        return tacoCabana.startOrder(model);
    })
    // Add items to the order
    .then(orderInfo => tacoCabana.updateOrderItems({
        customerId: order.customerId,
        customerName: order.name,
        orderId: orderInfo.order_id
    }))
    // Get payment info
    .then(orderInfo => {
        return tacoCabana.getPaymentMethods(order.customerId)
            .then(cards => {
                var myCard = cards[cards.length - 1];
                return {
                    orderInfo: orderInfo,
                    myCard: myCard
                }
            })
    })
    // Add payment info (this actually starts the payment process)
    .then(info => {
        return tacoCabana.addPayment({
            orderId: info.orderInfo.order.orderId,
            payProcId: info.myCard.payProcId,
            paymentCents: info.orderInfo.order.charges.totalCents,
            ccAccountId: info.myCard.ccAccountId,
            securityCode: order.userCreditCardSecurityCode
        })
    })
    // Check the payment info, which confirms it I think
    .then(pendingPayment => {
        return tacoCabana.checkPayment(pendingPayment);
    })
    .then((data) => {
        console.log(data);
    })
    .catch(function (e) {
        console.log(e);
    })