const place = "../../static/img/placeholder/1_1.1.png"
const DataStatus = {
	Unload:0,
	Normal:1,
	NoData:2,
	NetworkError:3,
	LoadError:4,
	NoMoreData:5
	
}

export default {
	DataStatus,
	checkPhone: function(phone) {
		if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
			return true
		}
	},
	checkPwd: function(psw) {
		if (psw.length >= 6) {
			return true
		}
	},
	checkCode: function(s1,s2) {
		if(s1 == s2){
			return true
		}
	},
}
