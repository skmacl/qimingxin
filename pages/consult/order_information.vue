<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate"></sknavigate>
		<!-- #endif -->
		<scroll-view class="scroll" :scroll-y="true">
			<!-- 咨询师信息部分 -->
			<view class="counselor-info">
				<image :src="OrderShowBean.counselor_headPhoto||defaultIcon" class="headPhoto"></image>
				<view class="counselor-info-group1">
					<view class="counselor-info-group2">
						<view class="counselor-name">{{OrderShowBean.counselor_realName}}</view>
						<text class="counselor-otherinfo">{{OrderShowBean.counselor_sex}}</text>
						<text class="counselor-otherinfo">{{OrderShowBean.counselor_age}}</text>
					</view>
					<view class="counselor-address">{{OrderShowBean.counselor_residenceAddress}}</view>
					<view class="counselor-level">{{OrderShowBean.counselor_psyVocaQualification}}</view>
				</view>
			</view>
			<!-- 问诊须知 -->
			<view class="wzxz">
				问诊须知：专家实行预约制问诊，请选择具体排班。到达问诊时间后，医生将主动发起聊天，请保证所提供信息准确。
			</view>
			<!-- 基本资料 -->
			<view class="base-info">
				<view class="info-title">基本资料<view class="tips">仅咨询师可见</view>
				</view>
				<view class="line-horizontal2"></view>
				<view v-for="(item,index) in infoOfPaient" :key="index">
					<view class="base-info-item">
						<view class="common-horizontal">
							<view class="tips">*</view>
							<view>{{item.name}}</view>
						</view>
						<view>{{item.value}}</view>
					</view>
					<view class="line-horizontal2"></view>
				</view>
				<view class="consult-theme">
					<view class="common-horizontal">
						<view class="tips">*</view>
						<view>咨询主题</view>
					</view>
					<uni-data-checkbox max="3" :localdata="theme" mode="tag" :multiple="true" class="consult_theme_tag"
						@change="themeChange"></uni-data-checkbox>
				</view>
				<view class="line-horizontal2"></view>
				<view class="consult-theme">
					<view class="common-horizontal">
						<view class="tips">*</view>
						<view>请输入个人问题</view>
					</view>
					<textarea @input="inputIssu" class="input-box" :auto-height="true" maxlength="500"
						placeholder="请输入"></textarea>
				</view>
				<view class="line-horizontal2"></view>
				<view class="base-info-item">
					<view class="common-horizontal">
						<view class="tips">*</view>
						<view>是否有咨询历史</view>
					</view>
					<uni-data-checkbox value="否" :localdata="consultHistory" :multiple="false" mode="default"
						@change="consultHistotyChange"></uni-data-checkbox>
				</view>
				<textarea @input="inputConHistory" v-show="isHaveConsultHistory" class="input-box" :auto-height="true"
					maxlength="500" placeholder="请输入"></textarea>
			</view>
			<!-- 紧急联系人 -->
			<view class="emergency-contact-info">
				<view class="info-title">紧急联系人</view>
				<view class="line-horizontal2"></view>
				<view class="base-info-item">
					<view class="common-horizontal">
						<view class="tips">*</view>
						<view>姓名</view>
					</view>
					<input @input="inputName" :value="submitConsultRequest.EmergentPerson"
						placeholder-class="emergency-contact-placeholder" class="emergency-contact" placeholder="请输入"
						type="text" maxlength="30" />
				</view>
				<view class="line-horizontal2"></view>
				<view class="base-info-item">
					<view class="common-horizontal">
						<view class="tips">*</view>
						<view>与本人关系</view>
					</view>
					<view
						:class="[submitConsultRequest.EmergentPersonRelationship==''? 'emergency-contact-placeholder' : 'emergency-contact']"
						@click="openRelationshipDialog">
						{{submitConsultRequest.EmergentPersonRelationship==''?'请选择':submitConsultRequest.EmergentPersonRelationship}}
					</view>
				</view>
				<view class="line-horizontal2"></view>
				<view class="base-info-item">
					<view class="common-horizontal">
						<view class="tips">*</view>
						<view>联系电话</view>
					</view>
					<input :value="submitConsultRequest.EmergentPersonMobile" @input="inputEmergentPersonMobile"
						placeholder-class="emergency-contact-placeholder" class="emergency-contact" placeholder="请输入"
						type="number" maxlength="11" :verify-number="true" />
				</view>
			</view>
			<!-- 用户协议&隐私政策 -->
			<view class="common-horizontal">
				<view class="tips">*</view>
				<view class="agreement">预约即代表阅读并同意<view class="link-text" @click="gotoAgreementPage('UserAgreement')">
						用户协议</view>和<view class="link-text" @click="gotoAgreementPage('SecretAgreement')">隐私政策</view>
				</view>
			</view>
		</scroll-view>
		<view class="next-step" @click="nextStep">下一步</view>
		<!-- 关系选择弹窗 -->
		<uni-popup ref="relationshipChoose" type="dialog" :maskClick="true">
			<view class="relationshipDialog">
				<view class="relationshipDialog-title">与本人关系</view>
				<view class="line-horizontal2"></view>
				<scroll-view class="relationshipDialog-content">
					<radio-group style="padding-left: 20px; padding-right: 15px;" @change="relationshipChange">
						<label v-for="(item,index) in relationshipList" :key="index" class="relationshipItem"
							style="display: flex;justify-content: space-between;">
							<view>{{item.text}}</view>
							<view>
								<radio style="transform: scale(0.7);" :value="item.text" />
							</view>
						</label>
					</radio-group>
				</scroll-view>
				<view class="line-horizontal2"></view>
				<view class="relationshipDialog-button">
					<view class="relationshipDialog-button-item" @click="getRelationship(false)">取消</view>
					<view class="line-vertical"></view>
					<view class="relationshipDialog-button-item" @click="getRelationship(true)">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 提示弹窗 -->
		<uni-popup ref="reminder" type="dialog">
			<view class="relationshipDialog" style="background-color: #FFFFFF;">
				<scroll-view class="reminderContent">{{reminder_text}}</scroll-view>
				<view class="line-horizontal2"></view>
				<view class="relationshipDialog-button-text" @click="reminderClick">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			// #ifdef H5
				if (eoption.id != null) {
					let thisid = option.id;
					try {
						let info = uni.getStorageSync(thisid);
						this.OrderShowBean = info.OrderShowBean;
						this.submitConsultRequest = info.submitConsultRequest;
					} catch (e) {
						console.log(e.message)
					}
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.OrderShowBean = info.OrderShowBean;
					this.submitConsultRequest = info.submitConsultRequest;
				}
			// #endif
		},
		onUnload() {
		
		},
		data() {
			return {
				id:'',
				reminder_text: "",
				defaultIcon: '../../static/img/consult/order_profle.png',
				headPhoto: '',
				clickable: true,
				infoOfPaient: [{
						"name": '姓名',
						"value": ''
					},
					{
						"name": '性别',
						"value": ''
					},
					{
						"name": '出生日期',
						"value": ''
					},
					{
						"name": '婚姻状况',
						"value": ''
					},
					{
						"name": '联系方式',
						"value": ''
					},
				],
				theme: [],
				consultHistory: [{
						"value": "是",
						"text": "是"
					},
					{
						"value": "否",
						"text": "否"
					}
				],
				isHaveConsultHistory: false,
				OrderShowBean: {
					"counselor_headPhoto": "",
					"counselor_realName": "",
					"counselor_sex": "",
					"counselor_age": "",
					"counselor_residenceAddress": "",
					"counselor_psyVocaQualification": "",
					"orderWay": "",
					"ConModeID": "",
					"money": "",
					"schedulingDate": "",
					"schedulingTime": "",
					"PsyMobile": "",
				},
				tempRelationship: "",
				submitConsultRequest: {
					"TerminalType": "APP",
					"SchedulingID": "",
					"UserID": "", //来访者userID
					"ConModeID": "",
					"PsyMobile": "", //来访者手机号
					"EmergentPerson": "", //紧急联系人
					"EmergentPersonMobile": "", //紧急联系人电话
					"EmergentPersonRelationship": "", //紧急联系人关系
					"Family": "",
					"Issue": "", //个人问题描述
					"Purpose": "", //咨询主题
					"Somatization": "",
					"ConHistory": "", //咨询历史
					"PsyTest": "",
					"Remark": "",
				},
				relationshipList: [{
						"value": "法定监护人",
						"text": "法定监护人"
					},
					{
						"value": "抚养人",
						"text": "抚养人"
					},
					{
						"value": "配偶",
						"text": "配偶"
					},
					{
						"value": "赡养人",
						"text": "赡养人"
					},
					{
						"value": "亲友",
						"text": "亲友"
					},
					{
						"value": "好友",
						"text": "好友"
					}
				],
				consultTheme: [],

			}
		},
		mounted() {
			this.getVisitingIssues()
			let userData = this.user.getUserData();
			this.infoOfPaient[0].value = userData.RealName;
			this.infoOfPaient[1].value = userData.Sex;
			this.infoOfPaient[2].value = userData.BirthDate;
			this.infoOfPaient[3].value = userData.MarriageStateValue;
			this.infoOfPaient[4].value = userData.Mobile;
			this.submitConsultRequest.UserID = userData.UserID;
			this.submitConsultRequest.PsyMobile = userData.Mobile;
			this.OrderShowBean.PsyMobile = userData.Mobile;

			if (
				userData.RealName == "" ||
				userData.Sex == "" ||
				userData.BirthDate == "" ||
				userData.MarriageStateValue == "" ||
				userData.Mobile == "") {
				uni.showToast({
					title: "请先到个人中心完善个人基本信息",
					icon: 'none',
					duration: 1500
				});
			} else {
				// this.ConHistory.PsyMobile = userData.Mobile;
			}
		},
		methods: {
			consultHistotyChange: function(e) { //是否有咨询历史选择
				if (e.detail.value == "是") this.isHaveConsultHistory = true;
				if (e.detail.value == "否") this.isHaveConsultHistory = false;
			},
			themeChange: function(e) { //咨询主题选择
				this.submitConsultRequest.Purpose = e.detail.value.toString();
			},
			inputIssu: function(e) { //输入个人问题
				this.submitConsultRequest.Issue = e.detail.value.trim()
			},
			inputConHistory: function(e) { //输入咨询历史
				this.submitConsultRequest.ConHistory = e.detail.value.trim()
			},
			inputName: function(e) { //输入紧急联系人姓名
				this.submitConsultRequest.EmergentPerson = e.detail.value.trim()
			},
			inputEmergentPersonMobile: function(e) { //输入紧急联系人电话
				this.submitConsultRequest.EmergentPersonMobile = e.detail.value.trim()
			},
			getUserAgreementOrPrivacy(AgreeType) {
				let _this = this;
				_this.clickable = false;
				this.request.startRequest({
					url: _this.api.PostAgreementManagement,
					data: {
						'AgreeType': AgreeType,
					},
					showLoading:true
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
						_this.navigate.navigateTo({
							url: '/pages/mine/system/agreement?item=' + JSON.stringify(newItem)
						})
						
					} else {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
					_this.clickable = true;
				}).catch(reason =>{
					_this.clickable = true;
				})				
			},
			gotoAgreementPage: function(type) { //用户协议and隐私政策
				if (!this.clickable) {
					uni.showToast({
						title: "加载数据中~",
						icon: 'none',
						duration: 1500
					});
					return;
				}
				if (type == "UserAgreement") {
					this.getUserAgreementOrPrivacy("MyDoctor")
				}
				if (type == "SecretAgreement") {
					this.getUserAgreementOrPrivacy("MyDoctorPrivate")
				}
			},
			openRelationshipDialog: function() { //显示关系选择弹窗
				this.$refs.relationshipChoose.open()
			},
			getRelationship: function(c) { //选择与紧急联系人的关系
				if (c) {
					this.submitConsultRequest.EmergentPersonRelationship = this.tempRelationship;
				}
				this.tempRelationship = "";
				this.$refs.relationshipChoose.close()
			},
			relationshipChange: function(e) {
				this.tempRelationship = e.detail.value.trim();
			},
			checkInfo: function() {
				let _this = this;
				let data = _this.submitConsultRequest;
				if (data.Purpose == "") { //检查咨询主题
					_this.reminder_text = "请至少选择一个咨询主题！";
				} else if (data.Issue.trim() == "") {
					_this.reminder_text = "请填写个人问题！";
				} else if (this.isHaveConsultHistory && data.ConHistory.trim() == "") {
					_this.reminder_text = "请填写咨询历史！";
				} else if (data.EmergentPerson == "") {
					_this.reminder_text = "请填写紧急联系人姓名！";
				} else if (data.EmergentPersonRelationship == "") {
					_this.reminder_text = "请选择紧急联系人与本人的关系！";
				} else if (data.EmergentPersonMobile == "") {
					_this.reminder_text = "请填写紧急联系人联系电话！";
				} else if (data.EmergentPersonMobile.length != 11) {
					_this.reminder_text = "请填写正确的联系电话！";
				} else _this.reminder_text = "";
				return _this.reminder_text == "" ? true : false;
			},
			reminderClick: function() {
				this.$refs.reminder.close();
			},
			nextStep: function() { //下一步
				let _this = this;
				let data = _this.submitConsultRequest;
				if (this.checkInfo()) {
					let info = {
						'publish': '0',
						'OrderShowBean': _this.OrderShowBean,
						'submitConsultRequest': data
					}
					// let id = _this.utils.createUUID();
					try {
						// uni.setStorageSync(id, info);
						_this.navigate.navigateTo({
							url: './order_form',
							data:info
						})						
					} catch (e) {
						console.log(e.message)
					}
				} else _this.$refs.reminder.open();
			},
			getVisitingIssues: function() { //获取咨询主题
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostDictionaryClass,
					data: {
						"DicTypCode": "VisitingIssues"
					}
				}).then(res =>{
					let newdata = res.data.Data;
					if (res.data.Code == 0) {
						for (var i = 0; i < newdata.length; i++) {
							_this.theme.push({
								"value": newdata[i].DicValue,
								"text": newdata[i].DicValue
							})
						}
					} else {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(reason =>{
					
				})				
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: calc(100vh - var(--window-top));
	}

	.scroll {
		width: 100%;
		height: calc(100% - 50px);
		background-color: #f1f1f1;
	}

	.counselor-info {
		display: flex;
		flex-direction: row;
		background-color: #3399FF;
		color: #FFFFFF;
		font-size: 14px;
	}

	.headPhoto {
		width: 75px;
		height: 75px;
		border-radius: 37.5px;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 15px;
		margin-right: 20px;
	}

	.counselor-info-group1 {
		width: calc(100% - 110px);
	}

	.counselor-info-group2 {
		margin-top: 10px;
		margin-bottom: 7.5px;
		display: flex;
		flex-direction: row;
	}

	.counselor-name {
		font-size: 17px;
		width: 125px;
		font-weight: bold;
		height: auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 10px;
		margin-top: auto;
		margin-bottom: auto;
	}

	.counselor-otherinfo {
		font-size: 14px;
		margin-right: 10px;
		width: 75px;
		word-break: break-all;
		margin-top: auto;
		margin-bottom: auto;
	}

	.counselor-address {
		font-size: 12.5px;
		margin-right: 10px;
		width: auto;
		word-break: break-all;
	}

	.counselor-level {
		font-size: 14px;
		margin-top: 7.5px;
		margin-bottom: 7.5px;
	}

	.wzxz {
		padding-left: 10px;
		padding-right: 10px;
		word-break: break-all;
		font-size: 12.5px;
		color: #939393;
		line-height: 20px;
		padding-bottom: 10px;
		background-color: #f1f1f1;
		padding-top: 10px;
	}

	.line-horizontal2 {
		width: 100%;
		height: 1px;
		background-color: #e3e3e3;
	}

	.line-vertical {
		width: 1px;
		height: 100%;
		background-color: #e3e3e3;
	}

	.base-info {
		display: flex;
		flex-direction: column;
		width: auto;
		height: auto;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #FFFFFF;
		padding-left: 10px;
		padding-right: 10px;
	}

	.info-title {
		display: flex;
		flex-direction: row;
		font-size: 20px;
		margin-left: 10px;
		padding-top: 10px;
		margin-bottom: 7.5px;
		font-weight: bold;
		align-items: baseline;
	}

	.tips {
		font-size: 12.5px;
		color: #D1372C;
		font-weight: normal;
		margin-left: 7.5px;
	}

	.base-info-item {
		width: calc(100% - 10px);
		height: 45px;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		display: flex;
		flex-direction: row;
		font-size: 15px;
		color: #000000;
		align-items: center;
		justify-content: space-between;
		padding-right: 10px;
	}

	.consult-theme_tag {
		width: auto;
		height: auto;
		font-size: 15px;
		margin-top: 5px;
		margin-bottom: 7.5px;
		margin-left: auto;
		margin-right: auto;
	}

	.common-horizontal {
		display: flex;
		flex-direction: row;
	}

	.consult-theme {
		width: calc(100% - 10px);
		height: auto;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		display: flex;
		flex-direction: column;
		font-size: 15px;
		color: #000000;
		padding-right: 10px;
	}

	.input-box {
		width: 94%;
		min-height: 50px;
		font-size: 15px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 7.5px;
		line-height: 20px;
	}

	.emergency-contact-info {
		display: flex;
		flex-direction: column;
		width: auto;
		height: auto;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #FFFFFF;
		margin-top: 20px;
		margin-bottom: 10px;
	}


	.emergency-contact {
		width: auto;
		text-align: right;
		font-size: 15px;
		color: #000000;
	}

	.emergency-contact-placeholder {
		color: #bebebe;
		text-align: right;
		font-size: 15px;
	}

	.agreement {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: auto;
		padding-left: 10rpx;
		font-size: 14px;
		color: #9e9e9e;
		word-wrap: break-word;
		word-break: break-all;
		font-style: italic;
		margin-bottom: 20px;
	}

	.link-text {
		color: #3399FF;
	}

	.next-step {
		position: sticky;
		bottom: 0;
		width: 100vw;
		height: 50px;
		background-color: #3399FF;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 17px;
	}

	.relationshipDialog {
		background-color: #eaeaea;
		width: 80vw;
		height: auto;
		max-height: calc(100vh - var(--window-top) - 120px);
		border-radius: 10px;
		padding-top: 10px;
	}

	.relationshipDialog-title {
		font-size: 20px;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 7.5px;
	}

	.relationshipDialog-content {
		width: 100%;
		height: auto;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #FFFFFF;
	}

	.relationshipDialog-button {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		height: 50px;
		background-color: #FFFFFF;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.relationshipDialog-button-text {
		justify-content: center;
		align-items: center;
		font-size: 15px;
		color: #3399FF;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 50px;
		background-color: #FFFFFF;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.relationshipDialog-button-item {
		width: calc(50% - .5px);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		color: #3399FF;
	}

	.relationshipItem {
		display: flex;
		flex-direction: row;
		font-size: 15px;
		margin-top: 7.5px;
		margin-bottom: 7.5px;
	}

	.reminderContent {
		width: 86%;
		height: auto;
		margin-left: auto;
		margin-right: auto;
		padding-top: 17.5px;
		padding-bottom: 17.5px;
		font-size: 15px;
		word-wrap: break-word;
		word-break: break-all;
		text-align: center;
		/* text-indent: 60rpx; */
		line-height: 25px;
	}
</style>
