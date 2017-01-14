var Paymium = require('../')
var config = require('../config')
var client = new Paymium(config.token, config.secret)

client.publicRequest("data/eur/ticker").then(( w => { console.log(w) })).catch(( err => {console.log('errr', err) }))

client.privateRequest("GET", "user").then(( w => { console.log(w) })).catch(( err => {console.log('errr', err) }))
