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


describe("Public Methods", () => {
  it("Promise should return Orderbook without error", () => {

    return  expect(client.orderBook()).to.eventually.have.property('bids')

  })
})

describe("Private Method", ()=>{
/*  it("should successufuly open a market sell order", () => {
      return expect(client.marketSellBtcBased({amount_btc: 0.001})).to.eventually.have.property("uuid")  
  })
*/
  it("should successufuly open a market Buy order", () => {

      return expect(client.marketBuyEurBased({amount_eur: 10})).to.eventually.have.property("uuid")  
  })
  it("should retrieve balance",() => {
  
    return expect(client.Balance()).to.eventually.have.property("balance_btc")
  
  })

  it("should open a market buy then retrieve order status", () =>{
    return expect(  
      client.marketBuyEurBased({amount_eur: 10})
      .then((o) =>{
        //console.log(o)
        return client.getOrderStatus(o)
        })
      ) 
      .to.eventually.have.property("uuid") 
  
  })
}) 


//client.marketSellBtcBased({amount_btc: 0.001}).then(success).catch(failure)  
