const rp = require("request-promise")
const querystring = require("querystring")
const crypto = require('crypto')

//rp.debug = true
//const BASEURL='https://paymium.com/api/v1/'
const BASEURL='https://sandbox.paymium.com/api/v1/'

function Paymium(apiKey, apiSecret){
  this.apiKey = apiKey || ''
  this.apiSecret = apiSecret || ''


}

// The API signature is a HMAC-SHA256 hash of
// the nonce concatenated with the full URL and body of the HTTP request, 
// encoded using your API secret key,
Paymium.prototype.sign = function(url, body) {
  var nonce = new Date().getTime().toString()
  var post  = JSON.stringify(body) || ''
  //var post  = querystring.stringify(body)
 // console.log(post)
  var payload = nonce+url+post
  var hmac = crypto.createHmac('sha256',this.apiSecret )  
  return { nonce : nonce, hmac : hmac.update(payload).digest("hex") }
}

/// PUBLIC MEthod only GET, no paramater
Paymium.prototype.publicRequest = function(endpoint ) {
  var self = this
  ///var method = method || 'GET'
  return  rp({ uri:BASEURL+endpoint, json:true})
    .then((res => { 
      return Promise.resolve(res) }))
    .catch((err => { 
      return Promise.reject(err) }))
  
}

Paymium.prototype.privateRequest = function (method, endpoint, params){
  //var method = method || 'GET'
  var sig = this.sign(BASEURL+endpoint, params)
  
  var request =  {
    method: method,
    uri: BASEURL+endpoint,
    body: params,
    headers : {
      'Api-Key': this.apiKey,
      'Api-Signature': sig.hmac,
      'Api-Nonce': sig.nonce

    },
    json:true
  }
 // console.log( request) 
  return rp(request)
    .then((res => { 
      
      return Promise.resolve(res) }))
    .catch((err => { 
      
      return Promise.reject(err) }))

}

Paymium.prototype.getPrivateRequest = function (endpoint, params) {
  return this.privateRequest("GET", endpoint, params)

}

Paymium.prototype.postPrivateRequest = function (endpoint, params) {
  return this.privateRequest("POST", endpoint, params)

}
Paymium.prototype.Ticker = function() {
  return this.publicRequest('data/eur/ticker')
}

Paymium.prototype.lastTrades = function() {
  return this.publicRequest("data/eur/trades")

}

Paymium.prototype.orderBook = function() {
  return this.publicRequest("data/eur/depth")

}

Paymium.prototype.accountHistory = function (options) {
  var opts = options || {}
  return this.getPrivateRequest( "user/orders", opts ) 

}

Paymium.prototype.marketBuyEurBased =  function (options){

  var amount_eur = options.amount_eur
  var order = { type:'MarketOrder', currency :"EUR", direction: "buy", currency_amount: amount_eur }


  return this.postPrivateRequest("user/orders", order)

}

Paymium.prototype.marketSellBtcBased =  function (options){

  var amount_btc = options.amount_btc
  var order = { type:'MarketOrder', currency :"EUR", direction: "sell", amount: amount_btc }


  return this.postPrivateRequest("user/orders", order)

}

Paymium.prototype.getOrderStatus = function( options ) {
  var order_uuid = options.uuid
  return this.getPrivateRequest("user/orders/"+order_uuid)

}

Paymium.prototype.Balance  = function(){
  return this.getPrivateRequest("user")
}

Paymium.prototype.BuyAtMarketAndCheck = function(amount, pair){

  var tx = null
  var order_req = { amount_eur:amount }
  return this.marketBuyEurBased( order_req )
    .then( (o) => {
       var txid=o.uuid
       var check = () => new Promise( ( resolve, reject) => {
        setTimeout(() =>{
          this.getOrderStatus(o)
            .then((order) =>{
              console.log("state ", order.state)
              if(order.state === "filled"){
                tx=order
                return resolve(o)
              }
            })
            .catch(e => console.log('ERRR ', e))
        }, 1500)
    
      })
       return check().then((x=> Promise.resolve(tx)))
      })
    .catch(e =>{
      if ( e.message)
        err = e.message
      else
        err = e
      return Promise.reject("Error Paymium BuyAtMarketAndCheck buy",err)
      
    })


}

module.exports = Paymium
