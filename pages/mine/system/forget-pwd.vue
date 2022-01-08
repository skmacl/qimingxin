<template>
	<view class="content">
		<sknavigate class="navigate" title="找回密码"></sknavigate>
		<view class="input-box">
			<view class="input-item">
				<view class="input-label">手机号</view>
				<view class="input-body">
					<input v-model="phone" maxlength="11" type="number" style="margin-right: 160upx;"
						placeholder="请输入手机号" class="input">
					<button :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button>
				</view>
			</view>

			<view class="input-item">
				<view class="input-label">验证码</view>
				<view class="input-body">
					<input placeholder="请输入验证码" type="number" v-model="code" maxlength="6" class="input">
				</view>
			</view>
			<view class="input-item">
				<view class="input-label">密码</view>
				<view class="input-body">
					<input v-model="password" type="text" :password="isHidePassword?true:false"
						style="margin-right: 50upx;" placeholder="请输入密码" maxlength="20" class="input" />
					<image @click="isHidePasswordClick" class="eye"
						:src="isHidePassword?'/static/img/attention.png':'/static/img/attention_forbid.png'"></image>
				</view>
			</view>

			<view class="input-item">
				<view class="input-label">密码</view>
				<view class="input-body">
					<input v-model="passwordAgain" type="text" :password="isHidePassword?true:false"
						style="margin-right: 50upx;" placeholder="请再次输入密码" maxlength="20" class="input" />
					<image @click="isHidePasswordClick" class="eye"
						:src="isHidePassword?'/static/img/attention.png':'/static/img/attention_forbid.png'"></image>
				</view>
			</view>
		</view>
		<button class="button" @click="submit">确定</button>

	</view>
</template>

<script>
	import common from "@/common/common.js";
	let timer = '';

	export default {
		data() {
			return {
				sendMsg: "发送验证码",
				isCanSendCode: true,
				isHidePassword: true,
				phone: "",
				password: "",
				passwordAgain:"",
				code: "",
				getCode: "",
				isChecked: false
			};
		},
		onLoad() {

		},
		methods: {

			isHidePasswordClick() {
				this.isHidePassword = !this.isHidePassword
			},

			check() {
				this.isChecked = !this.isChecked
			},

			setCodeInterval() {
				//设置验证码重新发送定时器
				let time = 60;
				clearInterval(timer);
				timer = setInterval(() => {
					time--;
					this.isCanSendCode = false;
					this.sendMsg = time + "s"
					if (time <= 0) {
						this.isCanSendCode = true;
						this.sendMsg = "重新获取";
						clearInterval(timer);
					}
				}, 1000)
			},
			clearCodeInterval() {
				clearInterval(timer);
				this.codemsg = "获取验证码";
			},
			sendCode() {
				let _this = this;
				//发送验证码
				if (!common.checkPhone(_this.phone)) {
					
					uni.showToast({
						title:"请输入正确的手机号",
						icon:"none"
					})
					return
				}

				/*
				 * 发送验证码逻辑
				 */
				this.request.startRequest({
					url: _this.api.PostSendSMSForPrint,
					data: {
						'Mobile': _this.phone,
						'pwdtype': "1",
					},
					showLoading:true
				}).then(res =>{
					_this.setCodeInterval();
					console.log("Code=" + res.data.Message)
					if (res.data.Code == 0) {
						_this.getCode = res.data.Data[0].code
					} else {
						alert(res.data.Message)
					}
				}).catch(reason =>{
					
				})				

			},
			submit() {

				if (!common.checkPhone(this.phone)) {
					uni.showToast({
						title:"手机号格式错误",
						icon:"none"
					})
				
					return;
				};
				if (!common.checkPwd(this.password)) {
					uni.showToast({
						title:"密码至少6位长度",
						icon:"none"
					})
					
					return;
				};
				if (!common.checkCode(this.code, this.getCode)) {
					
					uni.showToast({
						title:"验证码错误",
						icon:"none"
					})
					return;
				};

				this.changePsw();
			},

			changePsw() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostUpdatePWDForBC,
					data: {
						'Account': _this.phone,
						'OldPWD': "",
						'NewPWD': _this.password,
						'Type': "1",
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						uni.reLaunch({
							url: '/pages/mine/login',
						})
					}
				}).catch(reason =>{
					
				})				
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
	}
	.input-label {
		width: 75px;
		height: 50px;
		line-height: 50px;
		margin-top: 10px;
	}

	.input {
		line-height: 50px;
		height: 50px;
		position: relative;
		font-size: 14px;
		margin-top: 10px;
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
		background-color: #08B6F2;
		color: #DFDFDF;
		width: 80px;
		font-size: 12px;
		box-sizing: border-box;
		text-align: center;
		padding: 0;
		height: 30px;
		line-height: 30px;
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
		border-bottom: .25px solid #eeeeee;
		line-height: 50px;
		height: 50px;

	}

	.button {
		margin: 0 15px;
		background: #08B6F2;
		border-radius: 25px;
		line-height: 40px;
		height: 40px;
		color: white;
		font-size: 16px;
	}

	.privacy {
		position: absolute;
		bottom: 25px;
		margin-left: 7.5px;
	}

	.radio-size {
		transform: scale(0.7)
	}
</style>
