<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="注册"></sknavigate>
		<!-- #endif -->
		<view class="input-box">
			<view class="input-item">
				<view class="input-label">{{accountName}}</view>
				<view class="input-body">
					<input v-model="phone" maxlength="20" style="margin-right: 80px;"
						:placeholder="getPlace()" class="input">
					<button v-show="phoneCode" :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button>
				</view>
			</view>
			<view class="input-item">
				<view class="input-label">密码</view>
				<view class="input-body">
					<input v-model="password" type="text" :password="isHidePassword?true:false"
						style="margin-right: 25px;" placeholder="请输入密码" maxlength="20" class="input" />
					<image @click="isHidePasswordClick" class="eye"
						:src="isHidePassword?'/static/img/attention.png':'/static/img/attention_forbid.png'"></image>
				</view>
			</view>
			<view class="input-item">
				<view class="input-label">确认密码</view>
				<view class="input-body">
					<input v-model="surePassword" type="text" :password="isHidePassword?true:false"
						style="margin-right: 25px;" placeholder="再次输入密码" maxlength="20" class="input" />
					<image @click="isHidePasswordClick" class="eye"
						:src="isHidePassword?'/static/img/attention.png':'/static/img/attention_forbid.png'"></image>
				</view>
			</view>
			<view v-show="showName" class="input-item">
				<view class="input-label">姓名</view>
				<view class="input-body">
					<input v-model="name" type="text" 
						style="margin-right: 25x;" placeholder="请输入姓名" maxlength="20" class="input" />
				</view>
			</view>
			<view v-show="showSex" class="input-item">
				<view class="input-label">性别</view>
				<view class="input-body">
					<combox class="input-body" :candidates ="candidates" v-model="sex" placeholder="选择性别"></combox>
				</view>
			</view>
			<view  v-show="showBirthDate == true" class="input-item">
				<view class="input-label">出生日期</view>
				<view class="input-body" @tap="birthDateClick()">
					<view v-show="isFireFox() == true">
						<label >{{birthDate}}</label>
					</view>
					<view v-show="isFireFox() == false">
						<input v-model="birthDate" disabled="disabled" type="text"
							style="margin-right: 25px;" placeholder="选择出生日期" maxlength="20" class="input" />
					</view>
					
					
					<!-- <button class= "popButton" size="mini" type="default" v-on:click="birthDateClick()">选择出生日期</button> -->
				</view>
				
			</view>
			<view v-show="showDept == true" class="input-item">
				<view class="input-label">机构部门</view>
				<view class="input-body" v-on:click="deptClick()">
					<view v-show="isFireFox() == true">
						<label> {{dept.DeptName}}</label>
					</view>
					<view v-show="isFireFox() == false">
						<input v-model="dept.DeptName" disabled="true" type="text"
							style="margin-right: 25px;" placeholder="请选择部门" maxlength="20" class="input" />
					</view>
					
				</view>
			</view>
			
			<view v-show="phoneCode == true" class="input-item">
				<view class="input-label">验证码</view>
				<view class="input-body">
					<input placeholder="请输入验证码" type="number" v-model="code" maxlength="6" class="input">
				</view>
			</view>
		</view>
		<button class="button" @click="submit">注册</button>
		<view v-show="agree == true" class="privacy">
			<label class="radio">
				<radio class="radio-size" :checked="isChecked" value="" @click="check()" /><text>我已阅读并遵循</text>
			</label>
			<text style="color: #007AFF;" @click="userAgreement()">用户协议</text>
			<text>与</text>
			<text style="color: #007AFF;" @click="privacy()">隐私政策</text>
		</view>
		<view>
			<uni-datetime-picker ref="picker" returnType="date" type="date" @change="dateChange"
				start="1900-06-01 06:30:30" end="2030-6-1" return-type="timestamp"
				style="width: 0;height: 0;"					
				></uni-datetime-picker>
			<tki-tree ref="tkitree" :range="depts" rangeKey = "OrgName"  :selectParent = 'true' idKey = "OrgID" @confirm="deptSelect" confirmColor="#4e8af7" />
		</view>
	</view>
</template>

<script>	

	let timer = '';
	import combox from "components/sk-combox/sk-combox.vue"
	import tkiTree from "components/tki-tree/tki-tree.vue"
	export default {
		components:{
			combox,
			tkiTree
		},
		data() {
			return {
				sendMsg: "发送验证码",
				isCanSendCode: true,
				isHidePassword: true,
				phone: "",
				password: "",
				surePassword:"",
				code: "",
				getCode: "",
				isChecked: false,
				agree:true,
				phoneCode:true,
				accountName:"",
				showName:true,
				showBirthDate:true,
				showSex:true,
				showDept:true,
				showPhone:true,
				
				candidates:["男","女"],
				name:'',
				sex:'男',
				birthDate:'',
				depts:[],
				dept:{}
			};
		},
		onLoad() {
			this.agree = this.config.agree
			this.phoneCode = this.config.phoneCode
			this.accountName = this.config.accountName
			this.showName = this.config.realName
			this.showBirthDate = this.config.birthDate
			this.showSex = this.config.sex
			this.showDept = this.config.dept
			this.showPhone = this.config.showPhone
		},
		methods: {
			isFireFox:function(){
				// #ifdef H5
					let u = navigator.userAgent.toLocaleLowerCase()
					return u.indexOf('gecko') > -1 && u.indexOf('KHTML') == -1
				// #endif
				// #ifndef H5
					return false
				// #endif
				
			},
			isHidePasswordClick() {
				this.isHidePassword = !this.isHidePassword
			},
			birthDateClick:function(){
				this.$refs.picker.show()
			},
			deptClick:function(){
				if(this.depts.length == 0){
					this.getDept()					
				}else{
					this.$refs.tkitree._show()
					// console.log(JSON.stringify(this.depts))
				}				
			},
			setDepts:function(deptsData){
				let json = JSON.stringify(deptsData)			
				let jsRes = json.replace(new RegExp('Children','g'),"children")
				this.depts = JSON.parse(jsRes)				
				this.$refs.tkitree._show()
			},
			deptSelect:function(e){
				if(e.length > 0){
					this.dept = e[0]
				}
				
				console.log(JSON.stringify(e))
			},
			getDept:function(){
				let dept = this.config.deptId
				let _this = this
				this.request.startRequest({
					url: _this.api.getDep,
					data:JSON.stringify(dept),
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						if(res.data.Data.length > 0){
							_this.setDepts(res.data.Data)
							// _this.deptData = res.data.Data	
							// console.log(JSON.stringify(res.data.Data))
						}else{
							uni.showToast({
								title: "获取信息失败",
								icon:"none"
							})
						}
												
					} else {
						uni.showToast({
							title: "获取机构失败",
							icon:"none"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title: "获取机构失败"
					})
				})			
			},
			check() {
				this.isChecked = !this.isChecked
			},
			getPlace:function(){
				return "输入"+this.accountName
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
			dateChange: function(e) {
				console.log("返回值" + e);
				this.birthDate = e
			},
			sendCode() {
				let _this = this;
				//发送验证码
				if (!this.common.checkPhone(_this.phone)) {
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
					if (res.data.Code == 0) {
						_this.setCodeInterval();
						_this.getCode = res.data.Data[0].code
					} else {
						alert(res.data.Message)
					}
				}).catch(reason =>{
					alert("服务器错误，请稍后再试")
				})				

			},
			submit() {
				if (!this.isChecked && this.agree) {
					uni.showToast({
						title:"请勾选用户协议",
						icon:"none"
					})					
					return;
				};

				if (this.config.phoneCode == true && !this.common.checkPhone(this.phone)) {
					uni.showToast({
						title:"手机号格式错误",
						icon:"none"
					})	
					return;
				};
				if (!this.common.checkPwd(this.password)) {
					uni.showToast({
						title:"密码至少6位长度",
						icon:"none"
					})	
					
					return;
				};
				if(this.password != this.surePassword){
					uni.showToast({
						title:"两次密码不一致",
						icon:"none"
					})					
					return;
				}
				if(this.phoneCode){
					if (!this.common.checkCode(this.code, this.getCode)) {
						uni.showToast({
							title:"验证码错误",
							icon:"none"
						})	
						
						return;
					};
				}
				if(this.checkOtherInfo() == false){
					return;
				}
				/*
				 * 注册逻辑
				 */
				// if(this.config.s_evaluation == true){
					this.registerCommon()
				// }else{
				// 	this.register();
				// }				
			},
			checkOtherInfo:function(){
				if(this.showName){
					if(this.name.length == 0){
						uni.showToast({
							title:"请输入姓名",
							icon:"none"
						})
						return false
					}
				}				
				if(this.showBirthDate){
					if(this.birthDate.length == 0){
						uni.showToast({
							title:"请选择出生日期",
							icon:"none"
						})
						return false
					}
				}
				if(this.showDept){
					if(this.dept.DeptID == undefined || this.dept.DeptID.length == 0){
						uni.showToast({
							title:"请选择部门",
							icon:"none"
						})
						// return false
					}
				}
				return true
			},
			registerCommon(){
				let _this = this;
				let data = {
						'Account': _this.phone,
						'Pwd': _this.password,
						// 'UserType': "RegUT0101",
						'OrgID':_this.dept.DeptID == undefined?"030333b2-3797-4fc1-ba75-bad553ae76ca":_this.dept.DeptID,
						"Name":_this.name.length>0?_this.name:"",
						"Sex":_this.sex=="男"?"1":"0",
						"Birthday":_this.birthDate.length>0?_this.birthDate:"1990-01-01",
					}
				this.request.startRequest({
					url: _this.api.PostRegisterForCommon,
					data:data,
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {					
							uni.showToast({
								title:"注册成功"
							})
							// #ifdef H5
								_this.navigate.naviBack(1)
							// #endif
							// #ifndef H5
								uni.navigateBack()	
							// #endif
										
					
					}else {
						uni.showToast({
							title: res.data.Message
						})
					}
					
				}).catch(reason =>{
					uni.showToast({
						title: "服务器错误，请稍后再试"
					})
				})
			},
			register() {
				let _this = this;
				
				this.request.startRequest({
					url: _this.api.PostRegisterFor,
					data: {
						'Account': _this.phone,
						'PWD': _this.password,
						'UserType': "RegUT0101",
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {					
							uni.showToast({
								title:"注册成功"
							})
							// #ifdef H5
								_this.navigate.naviBack(1)
							// #endif
							// #ifndef H5
								uni.navigateBack()	
							// #endif
										
					
					}else {
						uni.showToast({
							title: res.data.Message
						})
					}
					
				}).catch(reason =>{
					uni.showToast({
						title: "服务器错误，请稍后再试"
					})
				})
				
				
			},

			getUserAgreementOrPrivacy(AgreeType) {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostAgreementManagement,
					data: {
						'AgreeType': AgreeType,
					},
				}).then(res =>{
					if (res.data.Code == 0) {
						var newItem = {};
						var item = res.data.Data[0];
						if (AgreeType == "MyDoctor") {
							newItem.InfoTitle =  "用户协议"
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
					
				})				
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
	.content{
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
		display: flex;
		flex-direction: row;
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
		margin-left: 15px;
	}

	.radio-size {
		transform: scale(0.7)
	}
	.popButton{
		margin-top: 5px; 
		height: 40px; 
		line-height: 40px;
		background-color: #FFFFFF;
	
	}
	/deep/.uni-date-editor--logo{
		width: 0px !important;
		height: 0px !important;
	}
	/deep/.uni-calendar{
		width: 80vw;
		margin-left: 10vw;
	}
</style>
