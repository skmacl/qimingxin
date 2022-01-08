import config from "../config/config.js"
import utils from "./utils.js"
import md5 from './md5.js'

const storageType = {
	storageTypeNone:0,
	storageTypeTmp:180,
	storageTypeLone:180000000
}

export default{
	storageType,
	/**
	 *option{
		 * url:string,			接口地址  必填
		 * data:{},				接口参数 	非必填
		 * showLoading:bool 	是否显示加载框 default is false 非必填
		 * force:bool 			是否强制刷新  default is false 非必填
		 * storage:integer  缓存方式/时长 default is 0s 非必填
		 * timeout:int,			请求超时时间 default is 60000ms 非必填
		 * header:{}, 			请求头    非必填
		 * method:string 		请求方式  非必填
		 * 
		 * 
	 }
	 */
	startRequest(option){		
		let storage = option.storage?option.storage:0
		let key =	md5.hex_md5(JSON.stringify(option)+JSON.stringify(option.url))
		let time = new Date().getTime()/1000
		let force = option.force?option.force:false
		return new Promise((resolve,reject) => {
			
			var res;
			if(storage != 0 && force == false){
				//看缓存是否过期
				let stTime = uni.getStorageSync(key+'time')
				if(stTime && time - stTime < storage){
					res = uni.getStorageSync(key)					
				}
			}
			if(res != null || res != undefined){
				uni.stopPullDownRefresh()
				uni.hideLoading()
				resolve(JSON.parse(res))
				
			}else{
				if(option.showLoading == true){
					uni.showLoading({
						title:config.loading
					})
				}
				uni.request({
					url: option.url,
					method: option.method?option.method:"POST",
					timeout: option.timeout?option.timeout:60000,
					header:option.header?option.header: {'Content-Type': "application/json;charset=utf-8",'Basic': utils.getCrypt()},
					data:option.data?option.data:{},
					success(res) {
						if(storage !=0 || res.data.Code == 0){
							// #ifdef APP-PLUS
								uni.setStorageSync(key + 'time',time)
								uni.setStorageSync(key,JSON.stringify(res))	
							// #endif
													
						}
						resolve(res)
					},
					fail(err) {
						reject(err)
					},
					complete(res) {
						uni.stopPullDownRefresh()
						uni.hideLoading()
					}
				})
			}
			
		})
	}
}