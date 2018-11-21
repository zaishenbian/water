var express = require('express');
var router = express.Router();
var config = require('../public/config.json');
var signature = require('./signature').signature;
var request = require('request');
var appId = config.appId;
var appSecret = config.appSecret;
var pageUrl = config.pageUrl;
var requestHost = config.requestHost;

/**
 * 配置页面路由
 */
router.get('/main/conf', function(req, res){
  var deviceId = req.query.deviceId;
  var url = `${requestHost}/user/get?deviceId=${deviceId}`;
  var device = {
    "deviceId": "",
    "userAddr": "",
    "userName": "",
    "userPhoneNum": "",
    "eachNum": "",
    "extra": ""
  }
  /**
   * 根据设备ID获取配置详情
   * status: 1000   表示能查到配置信息
   * 其他status表示查不到配置，属于第一次配置
   */
  request.get(url, function(deviceIdReq, deviceIdRes, deviceIdBody){
    deviceIdBody = JSON.parse(deviceIdBody);
    deviceIdBody.result = Object.assign({}, device, deviceIdBody.result);
    deviceIdBody.result.deviceId = deviceId;
    res.render('main/conf', deviceIdBody);
  })
});

/* router */
router.get('/:first?/:second?', function(req, res, next) {
  var first = req.params.first;
  var second = req.params.second?'/'+req.params.second:"";
  var redirect = first+second;
  var openId = req.query.openId;
  // if(openId){
  //   res.render(first+second);
  // }else{
  //   /* 获取openId */
  //   var redirect_uri = encodeURI(pageUrl+'/api/getopenId?page='+first+second);
  //   var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_base#wechat_redirect';
  //   res.redirect(url);
  // }
  res.render(first+second);
});

/* 获取微信签名 */
signature();

module.exports = router;
