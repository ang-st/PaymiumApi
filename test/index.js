var Paymium = require('../')
var config = require('../config')
var client = new Paymium(config.token, config.secret)


const success = ( data ) => { console.log("Sucess"); console.log(data) }
const failure = ( data ) => { console.log("Error"); console.log(data.error) }

client.publicRequest('data/eur/ticker').then( success ).catch( failure )

client.privateRequest('GET', 'user').then(success ).catch( failure )
//client.privateRequest('GET', 'users').then(success ).catch( failure )

client.orderBook().then(success).catch(failure)
client.accountHistory().then(success).catch(failure)
