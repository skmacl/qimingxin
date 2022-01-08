<template>
	<view class="content">
		<!-- <view class="text_list">
			<input type="text" :password="true" value="" class="pwd" maxlength="12" v-model="OldPWD"
				placeholder="请输入旧密码" />
			<input type="text" :password="true" value="" class="new-pwd" maxlength="12" v-model="NewPWD"
				placeholder="请输入新密码" />
			<input type="text" :password="true" value="" class="sure-pwd" maxlength="12" v-model="NewPWDAgain"
				placeholder="请确认新密码" />
			<button type="primary" @click="changePwd" class="sure-button">确认提交</button>
		</view> -->
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="修改密码"></sknavigate>
		<!-- #endif -->
		<view class="input-item">
			<view class="input-label">旧密码</view>
			<view class="input-body">
				<input v-model="OldPWD" type="text" :password="true" 
					style="margin-right: 50upx;" placeholder="请输入旧密码" maxlength="20" class="input" />				
			</view>			
		</view>
		<view class="input-item">
			<view class="input-label">新密码</view>
			<view class="input-body">
				<input v-model="NewPWD" type="text" :password="true" 
					style="margin-right: 50upx;" placeholder="新密码" maxlength="20" class="input" />				
			</view>			
		</view>
		<view class="input-item">
			<view class="input-label">确认密码</view>
			<view class="input-body">
				<input v-model="NewPWDAgain" type="text" :password="true"
					style="margin-right: 50upx;" placeholder="确认密码" maxlength="20" class="input" />				
			</view>			
		</view>
		<button class="submit-btn"  @click="changePwd" type="primary">提交</button>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				OldPWD: "",
				NewPWD: "",
				NewPWDAgain: ""
			}
		},
		methods: {
			changePwd() {
				let _this = this
				if (!_this.common.checkPwd(_this.OldPWD) ||
					!_this.common.checkPwd(_this.NewPWD) ||
					!_this.common.checkPwd(_this.NewPWDAgain)
				) {
					uni.showToast({
						title: "密码至少6位长度",
						icon:"none"
					})
					return
				}

				if (!_this.common.checkCode(_this.NewPWD, _this.NewPWDAgain)) {
					uni.showToast({
						title: "新密码两次不一致"
					})
					return
				}
				let info = this.user.getUserData()
				let data = {
						"OldPWD": this.OldPWD,//this.utils.encrypt(this.OldPWD),
						"NewPWD": this.NewPWD,//this.utils.encrypt(this.NewPWD),
						"Account": this.user.getUserData().Account,
						"Type": "0",
					}
				// console.log(_this.OldPWD);
				this.request.startRequest({
					url: _this.api.PostUpdatePWDForBC,
					data: data,
					showLoading:true
				}).then(res =>{
					
					if (res.data.Code == 0) {
						uni.showToast({
							title: "密码修改成功"
						})
						// #ifdef H5
							_this.navigate.naviBack(1)
						// #endif
						// #ifndef H5
							uni.navigateBack({})
						// #endif
						
					} else {
						uni.showToast({
							title: "密码修改失败"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title: "密码修改失败"
					})
				})				
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.03);
		padding-top: 25px;
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
		padding-left: 10px;
	}
	
	.submit-btn{
		margin-top: 25px;
		height: 40px;
		line-height: 40px;
		width: 90%;
		margin-left: 5%;
	}
	.privacy {
		position: absolute;
		bottom: 25px;
		margin-left: 15px;
	}
	
	.radio-size {
		transform: scale(0.7)
	}
</style>
