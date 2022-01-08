<script>	
// import config from "common/config.js"
	export default {		
		globalData: {
			// defaultUser: "0049582a-77fe-4cf6-892c-19be45b1c6db"			 
		},					
		onLaunch: function() {			
			/* #ifdef H5 */
				// window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(e){
					// alert(JSON.stringify(e))
					// alert("屏幕旋转")
					// let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
					// let curRoute = routes[routes.length - 1].route
					// location.reload()
					// alert("1111")
				// })
				
				// #ifdef H5
					if(this.config.loginStorage == false){
						this.user.setLoginState(false)	
						this.user.setUserData({})
					}
				// #endif
				
				if(this.user.getLoginState() == true){				
					
				}else{	
					this.navigate.navigateTo({
						url:'/page/mine/system/login'
					})					
				}
				
			/* #endif */
			
		// this.navigate.clearnStack()
		
			if(this.config.loginStorage == false){
				uni.removeStorageSync("userData")
				uni.removeStorageSync("loginState")
			}
			// plus.screen.lockOrientation('landscape-primary')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import './common/common.css';
	/*每个页面公共css */	
		
		button::after{
			border: none;
		}
		uni-page-refresh{
			top: 0rpx;
		}	
		.content{
			background-color: #FFFFFF;
			max-width: 100%;
			max-height: 100%;
			min-width: 320px;
			min-height: 480px;
			// top: var(--window-top);
			// bottom:var(–-window-bottom);
		
			/* #ifdef H5 */
				margin-top: 40px;
			/* #endif */
			/* #ifdef APP-PLUS */
				margin-top: 0px;
			/* #endif */
			/* padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom); */
		} 
		.navigate{
			position: fixed;
			width: 100%;
			height: 44px;		
			z-index: 9999999;
			/* #ifdef H5 */
			top: 0px;
			/* #endif */
		}
		.status{
			position: fixed;
			top: 0px;
			width: 100%;
			background-color: #3399FF;
			z-index: 9999999;
		}
</style>
