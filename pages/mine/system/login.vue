
<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title=title @navi-Back="back()"></sknavigate>
		<!-- #endif -->
		<view class="input-box">
			<view class="input-item">
				<view class="input-label">{{accountName}}</view>
				<view class="input-body">
					<input v-model="phone" maxlength="20" type="text" :placeholder="getPlace()" class="input">
				</view>
			</view>
			<view class="input-item">
				<view class="input-label">密码</view>
				<view class="input-body">
					<input v-model="password" type="text" :password="isHidePassword?true:false"
						style="margin-right: 25px;" placeholder="请输入密码" maxlength="20" class="input" />
					<image @click="isHidePasswordClick" class="eye"
						:src="isHidePassword?'/static/img/mine/icon_login_password_eyecolse':'/static/img/mine/icon_login_password_eye.png'">
					</image>
				</view>
			</view>
			<view class="select">
				<view class="" v-on:click="toRegister()">注册</view>
				<view class="" v-on:click="forgotPwd()">忘记密码</view>
			
			</view>
		</view>
		<!-- <view class="canvas">
				<canvas :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas" @error="canvasIdErrorCallback"></canvas>
		</view> -->
		<view v-show="verification_code == true" class="img-code">
			<input class="img-code-input" type="text" v-model="img_code_input" value="" placeholder="输入右侧图片内容"/>
			<imgcode @codeClick = "newCode" style="width: 150px; margin-left: 60px;"></imgcode>
		</view>
		
		<button class="button" @click="submit">登录</button>
		<!-- <view class="not-login" @tap="noLogin()">先不登录</view> -->
		<view v-show="agree == true" class="privacy">
			<label class="radio">
				<radio class="radio-size" :checked="isChecked" value="" @click="check()" /><text>我已阅读并遵循</text>
			</label>
			<text style="color: #007AFF;" @click="userAgreement()">用户协议</text>
			<text>与</text>
			<text style="color: #007AFF;" @click="privacy()">隐私政策</text>
		</view>

	</view>
</template>
<script>
	import common from "@/common/common.js"
	import imgcode from "components/image-code/image-code.vue"

	export default {
		components:{
				imgcode
		},
		data() {
			return {
				isHidePassword: true,
				phone: "",
				password: "",
				isChecked: false,
				title:"登录",
				agree:true,
				width:120,
				height:30,
				verification_code:true,
				img_code_input:'',
				img_code:'',
				accountName:''
			};
		},
		onLoad() {
			this.agree = this.config.agree	
			this.verification_code = this.config.verification_code
			this.accountName = this.config.accountName
		},
		
		onReady() {
			let _this = this
			// #ifdef H5
				this.title = this.config.login_str
			// #endif
			// #ifdef APP-PLUS
				uni.setNavigationBarTitle({
					title:_this.config.login_str
				})
			// #endif			
		},
		methods: {	
			newCode(e){
				this.img_code = e.codeStr			
			},
			back:function(){
				let _this = this
				if(getCurrentPages().length > 1){
					
				}else{
					setTimeout(function(){
						if(_this.config.home == true){
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}else if(_this.config.evaluation == true){
							uni.reLaunch({
								url: '/pages/evaluation/evaluation'
							})
						}else{
							uni.reLaunch({
								url: '/pages/mine/mine'
							})
						}
					},10)
					
					return true
				}
			},
			getPlace:function(){
				return "请输入"+this.accountName
			},
			isHidePasswordClick() {
				this.isHidePassword = !this.isHidePassword
			},
			check() {
					this.isChecked = !this.isChecked
			},
			submit: function() {
				let _this = this;
				if (!_this.isChecked && this.agree) {
					uni.showToast({
						title:"请勾选用户协议",
						icon:"none"
					})
					return;
				};
				if (_this.phone.length == 0) {
					uni.showToast({
						title:"账号不能为空",
						icon:"none"
					})
					return;
				};
				if (!common.checkPwd(_this.password)) {
					uni.showToast({
						title:"密码错误",
						icon:"none"
					})
					// return;
				};
				if(this.verification_code == true){
					if(this.img_code_input.toLocaleLowerCase() != this.img_code){
						uni.showToast({
							title:"验证码错误",
							icon:"none"
						})
						return;
					}
				}
				var password = this.utils.encrypt(_this.password);
				this.request.startRequest({
					url: _this.api.PostLogin,
					data: {
						'account': _this.phone,
						'pwd': _this.password
						
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
					
						// var data = JSON.parse(this.utils.decrypt(res.data.Data))
						try {
							_this.user.setUserData(res.data.Data)
							_this.user.setLoginState(true)		
							let pages = getCurrentPages()
							if(pages.length > 1){
								_this.navigate.naviBack(1)
							}else{
								if(_this.config.home == true){
									uni.reLaunch({
										url: '/pages/main/main'
									})
								}else if(_this.config.evaluation == true){
									uni.reLaunch({
										url: '/pages/evaluation/evaluation'
									})
								}else{
									uni.reLaunch({
										url: '/pages/mine/mine'
									})
								}
								
							}
							
							
						} catch (e) {
							console.log(e)
						}
					
					} else {
						uni.showToast({
							title: res.data.Message
						})
					}
				}).catch(reason =>{
					// if(getCurrentPages() > 1){
						
					// }else{						
					// 		if(_this.config.home == true){
					// 			uni.reLaunch({
					// 				url: '/pages/home/home'
					// 			})
					// 		}else{
					// 			uni.reLaunch({
					// 				url: '/pages/mine/mine'
					// 			})
					// 		}											
					// }
				})				

			},
			noLogin:function(){				
				if(getCurrentPages() > 1){
					this.navigate.naviBack(1)
				}else{					
					if(this.config.home == true){
						uni.reLaunch({
							url: '/pages/home/home'
						})
					}else if(_this.config.evaluation == true){
						uni.reLaunch({
							url: '/pages/evaluation/evaluation'
						})
					}else{
						uni.reLaunch({
							url: '/pages/mine/mine'
						})
					}
			
				}
			},
			getUserAgreementOrPrivacy(AgreeType) {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostAgreementManagement,
					data: {
						'AgreeType': AgreeType,
					}
				}).then(res =>{
					if (res.data.Code == 0) {
						var newItem = {};
						var item = res.data.Data[0];
						if (AgreeType == "MyDoctor") {
							newItem.InfoTitle = "用户协议"
						} else {
							newItem.InfoTitle = "隐私政策"
						};
						newItem.InfoType = item.AgreeType;
						newItem.InfoOrigin = item.AgreeHtml;
						let info = {
							"item":newItem
						}
						// let id = _this.utils.createUUID()
						// uni.setStorageSync(id,info)
						_this.navigate.navigateTo({
							url: '/pages/mine/system/agreement',
							data:info
						})						
					
					}
				}).catch(reason =>{
					console.log("")
				})				
			},
			toRegister:function(){
				if(this.config.register == true){
					this.navigate.navigateTo({
						url:"/pages/mine/system/register"
					})
				}else{
					uni.showToast({
						title:"暂不支持注册，请联系管理员"
					})
				}
				
			},
			forgotPwd:function(){
				if(this.config.phoneCode == true){
					this.navigate.navigateTo({
						url:"/pages/mine/system/forget-pwd"
					})	
				}else{
					uni.showToast({
						title:"请联系管理员重置密码",
						icon:"none"
					})					
				}
							
			},
			privacy() {
				this.getUserAgreementOrPrivacy("MyDoctorPrivate")
			},

			userAgreement() {
				this.getUserAgreementOrPrivacy("MyDoctor")
			}
		}
	}
</script>
<style>
	.contnet{
		width: 100%;
		height: 100%;
	}
	.input-label {
		width: 75px;
	}

	.input {
		line-height: 50px;
		height: 50px;
		position: relative;
		font-size: 14px;
	}

	.eye {
		position: absolute;
		height: 25px;
		width: 25px;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.btn-code {
		position: absolute;
		right: 0px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		color: #205592;
		width: 80px;
		font-size: 12px;
		box-sizing: border-box;
		text-align: right;
		padding: 0;
		height: 50px;
		line-height: 50px;
	}

	.input-box {
		padding: 25px;
		font-size: 15px;
	}

	.input-body {
		position: relative;
		height: 50px;
		width: calc(100% - 75px);
	}

	.select {
		padding-top: 20px;
		display: flex;
		justify-content: space-between;
		color: #003B67;
	}

	.input-item {
		display: flex;
		background: white;
		border-bottom: .5px solid #eeeeee;
		line-height: 50px;
		height: 50px;

	}

	.button {
		margin: 30px 15px;
		background: #2fe670;
		border-radius: 25px;
		line-height: 40px;
		height: 40px;
		color: white;
		font-size: 16px;
	
	}

	.privacy {
		position: absolute;
		bottom: 55px;
		margin-left: 15px;
	}

	.radio-size {
		transform: scale(0.7)
	}
	.not-login{
		margin-top: 10px;
		text-align: right;
		margin-left: 10%;
		width: 80%;
		color: #3399FF;
		font-size: 15px;
	}
	.canvas{
		width: 100%;		
		height: 50px;
	}
	.img-code{
		display: flex;
		flex-direction: row;
	}
	.img-code-input{
		margin-left: 20px;
		font-size: 14px;
		/* padding-top: 6px; */
		border-bottom: .5px solid #eeeeee;
		line-height: 30px;
		height: 30px;
		width: 60%;
	}
</style>
