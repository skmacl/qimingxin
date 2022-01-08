import CryptoJS from 'crypto-js';
import config from '../config/config.js'


export default {
	//浏览器内核
	getBrowserKernel:function(){
		var u = navigator.userAgent;
		　　　　　　 var ua = navigator.userAgent.toLocaleLowerCase();
		　　　　　　 var app = navigator.appVersion;
		　　　　　　 return {
		　　　　　　　　trident: u.indexOf('Trident') > -1, /*IE内核*/
		　　　　　　　　presto: u.indexOf('Presto') > -1, /*opera内核*/
		　　　　　　　　webKit: u.indexOf('AppleWebKit') > -1, /*苹果、谷歌内核*/
		　　　　　　　　gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, /*火狐内核*/
		　　　　　　　　mobile: !!u.match(/AppleWebKit.*Mobile.*/), /*是否为移动终端*/
		　　　　　　　　ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), /*ios终端*/
		　　　　　　　　android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, /*android终端或者uc浏览器*/
		　　　　　　　　iPhone: u.indexOf('iPhone') > -1, /*是否为iPhone或者QQHD浏览器*/
		　　　　　　　　iPad: u.indexOf('iPad') > -1, /*是否iPad*/
		　　　　　　　　webApp: u.indexOf('Safari') == -1, /*是否web应该程序，没有头部与底部*/
		　　　　　　　　souyue: u.indexOf('souyue') > -1,
		　　　　　　　　superapp: u.indexOf('superapp') > -1,
		　　　　　　　　weixin:u.toLowerCase().indexOf('micromessenger') > -1, 
		　　　　　　　　qq: ua.match(/QQ/i) == "qq", // QQ 
		　　　　　　　　weiBo: ua.match(/WeiBo/i) == "weibo", // 微博 
		　　　　　　　　Safari:u.indexOf('Safari') > -1, 
		　　　　　　　　QQbrw: u.indexOf('MQQBrowser') > -1, // QQ浏览器 
		　　　　　　　　webview: !(u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/)) && u.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/), 
		　　　　　　　　ucweb: function () {
		　　　　　　　　　　try {
		　　　　　　　　　　　　return parseFloat(u.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2
		　　　　　　　　　　} catch (e) {
		　　　　　　　　　　　　if (u.indexOf('UC') > -1) {
		　　　　　　　　　　　　　　return true;
		　　　　　　　　　　　　}
		　　　　　　　　　　　　return false;
		　　　　　　　　　　}
		　　　　　　　　}(),
		
		　　　　　　　　Symbian: u.indexOf('Symbian') > -1,
		　　　　　　　　ucSB: u.indexOf('Firofox/1.') > -1,
		　　　　　　};
	},
	//加密
	encrypt(word) {
		let key = config.KEY
		var ecodeKey = CryptoJS.enc.Utf8.parse(key);
		var srcs = CryptoJS.enc.Utf8.parse(word);
		var encrypted = CryptoJS.AES.encrypt(srcs, ecodeKey, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});

		let result = encrypted.toString();
		return result;
	},
	//解密
	decrypt(word) {
		let key = config.KEY
		var ecodeKey = CryptoJS.enc.Utf8.parse(key);
		var decrypt = CryptoJS.AES.decrypt(word, ecodeKey, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		let result = CryptoJS.enc.Utf8.stringify(decrypt).toString();
		return result;
	},
	createUUID() {
		let len = 10
		let radix = 10
		var chars = '0123456789'.split('');
		var uuid = [],
			i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) {
				uuid[i] = chars[0 | Math.random() * radix];
			}
		}
		return uuid.join('');
	},

	
	/**
	 * 加密算法：加密（加密（时间戳（13位ms））+key）
	 * key = 37213849078E7AFDA8361524C74853AB
	 */
	getCrypt() {
		//北京时间在东8区，要加8小时
		var myDate = new Date();
		var mytime=myDate.getTime();   
		var crypt = this.encrypt(this.encrypt(mytime + 8 * 3600 * 1000 + "") +
			"37213849078E7AFDA8361524C74853AB");
		return crypt;
	},
	
	 getWindowInfo: function(){
		return getSystemInfo().window
	},
	getScreenInfo: function(){
		return getSystemInfo().screen
	},
	getSafeArea: function(){		
			return getSystemInfo().safeArea			
	},
	getSafeAreaInsets: function(){
			 return getSystemInfo().safeAreaInsets
	},
	getDeviceInfo: function(){
			 return {
				 "model":getSystemInfo().model,
				 "platform":getSystemInfo().platform,
				 "deviceId":getSystemInfo().deviceId,
				 "system":getSystemInfo().system			 
			 }
	},
	initCodeImg: function() {
				console.log('start');
				var context = uni.createCanvasContext('imgcanvas', this),
					w = this.width,
					h = this.height;
				context.setFillStyle("white");
				context.setLineWidth(5);
				context.fillRect(0, 0, w, h);
				var pool = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "I", "M", "N", "O", "P", "Q", "R", "S",
						"T", "U", "V", "W", "S", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
					],
					str = '';
				for (var i = 0; i < 4; i++) {
					var c = pool[this.rn(0, pool.length - 1)];
					var deg = this.rn(-30, 30);
					context.setFontSize(18);
					context.setTextBaseline("top");
					context.setFillStyle(this.rc(80, 150));
					context.save();
					context.translate(30 * i + 15, parseInt(h / 1.5));
					context.rotate(deg * Math.PI / 180);
					context.fillText(c, -15 + 5, -15);
					context.restore();
					str += c;
				}
				uni.setStorageSync('imgcode',str)
				
				for (var i = 0; i < 40; i++) {
					context.beginPath();
					context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
					context.closePath();
					context.setFillStyle(this.rc(150, 200));
					context.fill();
				}
				context.draw();
				console.log('end');
			},
			rc: function(min, max) {
				var r = this.rn(min, max);
				var g = this.rn(min, max);
				var b = this.rn(min, max);
				return "rgb(" + r + "," + g + "," + b + ")";
			},
			rn: function(max, min) {
				return parseInt(Math.random() * (max - min)) + min;
			},
			refresh: function() {
				this.init();
			},
			canvasIdErrorCallback: function(e) {
				console.error(e.detail.errMsg)
			}
};

let systemInfo = {}
let canUseState = false
const getSystemInfo = function(){
	if(canUseState == true){
		return systemInfo
	}else{
		
			let info = uni.getSystemInfoSync()
			let pr = info.pixelRatio
			let window = {"top":info.windowTop*pr,"bottom":info.windowBottom*pr,"width":info.windowWidth*pr,"height":info.windowHeight*pr}
			let screen = {"width":info.screenWidth,"height":info.screenHeight}
			let model = info.model
			let ISA = info.safeArea
			let safeArea = {"left":ISA.left*pr,"right":ISA.right*pr,"top":ISA.top*pr,"bottom":ISA.bottom*pr,"width":ISA.width*pr,"height":ISA.height*pr}
			let deviceId = info.deviceId
			let system = info.system
			let platform = info.platform
			let ISAI = info.safeAreaInsets
			let safeAreaInsets = {"left":ISAI.left*pr,"right":ISAI.right,"top":ISAI.top*pr,"bottom":ISAI.bottom}
			let statusBarHeight = info.statusBarHeight*pr
			systemInfo = {
				"window":window,
				"screen":screen,
				"PR":pr,
				"safeArea":safeArea,
				"safeAreaInsets":safeAreaInsets,
				"model":model,
				"platfore":platform,
				"deviceId":deviceId,
				"statusBarHeight":statusBarHeight
			}
			canUseState = true
			
			return systemInfo
		
	}	
}