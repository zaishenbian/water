var request = require('request');
var config = require('../public/config.json');
var appId = config.appId;
var appSecret = config.appSecret;
var pageUrl = config.pageUrl;

function getAccessToken(){
  var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  request.get(url, function(error, res, body){
    console.log(body);
  })
}

module.exports.signature = function signature(){
  getAccessToken();
}