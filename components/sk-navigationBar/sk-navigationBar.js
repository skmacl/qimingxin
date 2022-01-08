import md5 from '../../common/md5.js'
import utils from '../../common/utils.js'
const stackKey = "stackKey"
const defaultPage = "/pages/main/main"
const RightStyle = {
	StyleNone:0,
	StyleCollection:1,
	StyleSave:2,
	StyleShare:3
}
module.exports = {
	RightStyle,
	propareToJump:function(){
		this.intoStack()
	},
	clearnStack:function(){
		uni.setStorageSync(stackKey,[])
	},
	getCurrent:function(){
		let href = location.href		
		let index = href.indexOf("/pages")
		let after = href.substring(index,href.length)
		return index == -1?defaultPage:after
	},
	intoStack:function(){	
			let after = this.getCurrent()
			
			if(after != "error"){
				let stack = uni.getStorageSync(stackKey)
				if(stack == null || stack == undefined || stack.length == 0){
					stack = []
				}
				if(stack.indexOf(after) > -1){//包含元素
					stack = stack.slice(0,stack.indexOf(after)+1)
				}else{
					stack =	stack.concat(after) //入页面栈数组
				}
				// console.log(JSON.stringify(stack))
				uni.setStorageSync(stackKey,stack)	
			}							
	},
	outStack:function(stacks){	
		let stack = stacks
		// if(stack == null || stack == undefined){
		// 	let stack = uni.getStorageSync(stackKey)
		// }		
		if(stack && stack.length >= 1){
			stack = stack.slice(0,stack.length-1)
			// uni.setStorageSync(stackKey,stack)
		}
		return stack
	},
	lastPage:function(stacks){		
		let current = this.getCurrent()	
		let stack = stacks
		if(stack == null && stack == undefined){
			uni.getStorageSync(stackKey)
		}		
		if(stack && stack.length >= 1){
			let result = (stack.slice(stack.length - 1,stack.length))
			let page = result.shift()
			return page
			// if(page != current){
			// 	return page
			// }else{
			// 	let sta = this.outStack(stacks)
			//  return	this.lastPage(sta)
			// }
		}	
		return "error"
	},
	naviBack:function(delta){//delta=-1 回到根页面
	// #ifndef H5
		uni.navigateBack({
			delta:delta
		})
	// #endif
	// #ifdef H5
		//1.去重
		//2.去当前页面
		let pages = getCurrentPages()
		let stack = uni.getStorageSync(stackKey)
		let current = this.getCurrent()
		let temp = this.removeDuplicate(stack,current)
		let _this = this
		if(delta == 100){//返回根目录
			let tar = temp[0]
			temp = temp.slice(0,1)
			uni.setStorageSync(stackKey,temp)
			// console.log(JSON.stringify(temp))
			uni.reLaunch({
				url:tar,
				success() {
					stack.forEach(function(item){
						uni.removeStorage({
							key:md5.hex_md5(JSON.stringify(item))
						})
					})
				}
			})
			return
		}
		let del = delta
		if(del < 0){
			del = temp.length - (Math.abs(del) - 1)
		}
		if(del > temp.length){
			del = temp.length
		}
		
		if(pages && pages.length > delta){
			
			
			temp = temp.slice(0,temp.length-delta)
			let st = stack.slice(temp.length,stack.length)
			if(st.length > 0){
				st.forEach(function(item){
					uni.removeStorage({
						key:md5.hex_md5(JSON.stringify(item))
					})
				})
			}
			uni.setStorageSync(stackKey,temp)
			uni.navigateBack({
				delta:delta
			})			
			
		}else{
			let target = temp[temp.length - del]
			temp = temp.slice(0, temp.indexOf(target))
			uni.setStorageSync(stackKey,temp)
			// console.log(JSON.stringify(temp))
			// alert(target)
			if(target && target.indexOf('pages') > -1){
				uni.reLaunch({
					url:target,
					success() {
						let st = stack.slice(temp.length,stack.length)
						if(st.length > 0){
							st.forEach(function(item){
								uni.removeStorage({
									key:md5.hex_md5(JSON.stringify(item))
								})
							})
						}
					}
				})
			}else{			
				uni.reLaunch({
					url:target,
					success(e) {
						
					},
					fail(reson) {
						console.log(reson)
					}
				})
		
			}
			
		}
	// #endif		
		
	},
	removeDuplicate:function(stack,current){
		let temp = []
		if(stack && stack.length >= 1){
			for (let i = 0; i < stack.length; i++) {
				let obj = stack[i]
				if(!(temp.indexOf(obj) > -1)){
					temp = temp.concat(obj)
				}
			}
		} 
		let last = this.lastPage(temp)		
		if(last == current){
			temp = temp.slice(0,temp.length-1)
		}
		return temp
	},
	navigateTo:function(option){
			let _this = this
			return new Promise((resolve,reject) => {
				let url = option.url
				// #ifdef H5
					_this.propareToJump()
					let key = md5.hex_md5(JSON.stringify(this.getCurrent()))
					uni.setStorageSync(key,option.data)
					if(url.indexOf('?') == -1){
						url = url +"?id=" + key
					}else{
						url = url +"&id=" + key
					}
				// #endif
				// #ifndef H5
				if(url.indexOf('?') == -1){
					url = url +"?data=" + JSON.stringify(option.data)
				}else{
					url = url +"&data=" + JSON.stringify(option.data)
				}	
				// #endif		
				
				uni.navigateTo({
					url:url,
					success(res) {
						resolve(res)
					},
					fail(error) {
						reject(error)
					}
				});
			})
		}	
}