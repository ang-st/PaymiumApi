var Paymium = require('../')
var config = require('../config')
var client = new Paymium(config.token, config.secret)

const success = ( data ) => { console.log("Sucess"); console.log(data) }
const failure = ( data ) => { console.log("Error"); console.log(data.response.toJSON()||data.message) }


//client.marketSellBtcBased({amount_btc: 0.001}).then(success).catch(failure)  
//client.accountHistory().then(success)
//
//client.Balance().then(success)
client.BuyAtMarketAndCheck(10).then(success)
