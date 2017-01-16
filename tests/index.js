var Paymium = require('../')
var config = require('../config')
var client = new Paymium(config.token, config.secret)
var assert = require('assert');

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


const success = ( data ) => { console.log("Sucess"); console.log(data) }
const failure = ( data ) => { console.log("Error"); console.log(data.response.toJSON()||data.message) }

//client.publicRequest('data/eur/ticker').then( success ).catch( failure )

//client.privateRequest('GET', 'user').then(success ).catch( failure )
//client.privateRequest('GET', 'users').then(success ).catch( failure )

describe("Public Methods", () => {
  it("Promise should return Orderbook without error", () => {

    return  expect(client.orderBook()).to.eventually.have.property('bids')

  })
})
//client.accountHistory().then(success).catch(failure)

describe("Private Method", ()=>{
  it("should successufuly open a market sell order", () => {
      return expect(client.marketSellBtcBased({amount_btc: 0.001})).to.eventually.have.property("uuid")  
  })

  it("should successufuly open a market Buy order", () => {

      return expect(client.marketBuyEurBased({amount_eur: 10})).to.eventually.have.property("uuid")  
  })


})


//client.marketSellBtcBased({amount_btc: 0.001}).then(success).catch(failure)  
