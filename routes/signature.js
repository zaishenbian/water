var express = require('express');
var request = require('request');
var crypto = require('crypto');
var config = require('../public/config.json');
var router = express.Router();
var appId = config.appId;
var appSecret = config.appSecret;
var pageUrl = config.pageUrl;
var access_token;
var jsapi_ticket;

//定时刷新获取access_token和jsapi_ticket
function getTokenAndTicket(){
  var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  request.get(url, function(error, res, body){
    access_token = JSON.parse(body).access_token;
    var getTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    request.get(getTicketUrl, function(ticketError, ticketRes, ticketBody){
      jsapi_ticket = JSON.parse(ticketBody).ticket;
      console.log('jsapi_ticket:'+jsapi_ticket);
    })
  })
}

//获取随机字符串
function createNonceStr(){
  return Math.random().toString(36).substr(2,15);
}

//获取时间戳
function createTimeStamp(){
  return parseInt(new Date().getTime() / 1000) + '';
}

//计算签名算法
function calcSignature(ticket, nonceStr, ts, url){
  var str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${ts}&url=${url}`;
  var sha1 = crypto.createHash('sha1');   //定义加密方式
  sha1.update(str);
  var res = sha1.digest('hex');   //加密后的值
  return res;
}

//获取签名接口
router.get('/', function(req, res){
  var url = req.query.url;
  console.log(url);
  var nonceStr = createNonceStr();
  console.log(nonceStr);
  var ts = createTimeStamp();
  console.log(ts);
  var signature = calcSignature(jsapi_ticket, nonceStr, ts, url);
  console.log(signature);
  res.send({
    nonceStr: nonceStr,
    timeStamp: ts,
    signature: signature
  });
})

module.exports.signature = function signature(){
  getTokenAndTicket();
  setInterval(getTokenAndTicket, 6900000);
}

module.exports.router = router;