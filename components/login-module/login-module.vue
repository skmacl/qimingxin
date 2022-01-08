<template>
	<view>
		<uni-popup ref="popup" type="dialog" :maskClick="true">
			<view class="login-back">
				<view class="login-title">登录</view>
				<view class="login-line"></view>
				<input class="login-account" 
					@input="accountInput" placeholder="账号" maxlength="50" :value="acc" />
				<input class="login-password" 
					@input="passwordInput"
					@confirm="confirm" 
					 type="text" placeholder="密码" :password = "true" maxlength="50" :value="pwd" />
				<button class="login-sure" type="primary" @click="confirm()">登录</button>
				<!-- <view class="login-bottom">					
					<view class="login-register" @click="toRegister()">还没有账号</view>
				</view> -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default:"登录"
			},
			account:{
				type:String,
				default:"输入账号"
			},
			password:{
				type:String,
				default:"输入密码"
			},
			sure:{
				type:String,
				default:"登录"
			},
			cancel:{
				type:String,
				default:"取消"
			},
			account:{
				type:String,
				default:""
			},
			password:{
				type:String,
				default:""
			}
		},
		data(){
			return{
				show:true,		
				acc:"",
				pwd:""
			}
		},
		mounted() {
			this.acc = this.account
			this.pwd = this.password
		},
		unmounted() {
			
		},
		methods:{
			showLogin:function(){
				this.$refs.popup.open()				
			},
			hideLogin:function(){		
				this.$refs.popup.close()
			},
			confirm:function(){
				if(this.acc.length == 0 || this.pwd.length == 0){
					alert("没输入")
					return
				}
				let data = {
					"acc":this.acc,
					"pwd":this.pwd
				}
				this.login()
				// this.$emit("confirm",data)
			},
			abolish:function(){
				this.hideModal()
				// this.$emit("abolish",{})
			},
			accountInput:function(account){			
				// console.log(account.detail.value)
				this.acc = account.detail.value
			},
			passwordInput:function(password){
				this.pwd = password.detail.value
			},
			toRegister:function(){
				this.navigate.navigateTo({
					url:"../../pages/mine/system/register"
				})				
				// this.$emit("register",{})
			},
			
			login:function(){
				let _this = this
				// var password = this.utils.encrypt(_this.pwd);
								
				this.request.startRequest({
					url: _this.api.PostLogin,
					data: {
						'account': _this.acc,
						'pwd': _this.pwd						
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {					
						
						try {
							_this.user.setUserData(res.data.Data)
							_this.user.setLoginState(true)							
							_this.$emit("success",{})	
							_this.hideLogin()
						} catch (e) {							
							console.log(e)
						}
					
					} else {
						uni.showToast({
							title: res.data.Message,
							icon:"none"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title: "服务器错误，请稍后再试"
					})
				})			
			}
		}
	}
</script>

<style>
	.login-back{
		width: 275px;
		/* height: 750rpx; */
		background-color: #FFFFFF;
		border-radius: 10px;
	}
	.login-title{		
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.login-line{
		width: 100%;
		height: .5px;
		background-color: #aaaaaa;
		/* margin-top: 30rpx; */
	}
	.login-account{
		width: 90%;
		margin-left: 5%;
		height: 35px;
		background-color:rgba(0,0,0,.08);
		border-radius: 3px;
		margin-top: 40px;
		align-content: center;
		font-size: 14px;
	}
	.login-password{
		width: 90%;
		margin-left: 5%;
		height: 35px;
		background-color: rgba(0,0,0,.08);
		border-radius: 3px;
		margin-top: 25px;
		align-content: center;
		font-size: 14px;
		
	}
	.login-sure{
		width: 90%;
		margin-left: 5%;
		margin-top: 40px;
		height: 35px;
		line-height: 35px;
		background-color: #2fe670;
		padding-bottom: 20px;
		bottom: 20px;
	}
	.login-register{
		width: 100%;
		height: 25px;
		line-height: 25px;
		text-align: center;
		margin-top: 15px;
		font-size: 15px;
		padding-bottom: 10px;
		
	}
	.login-register::after{
		color: #3399FF;
		font-size: 15px;
		content: " 去注册";
	}		
</style>
