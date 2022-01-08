<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate"></sknavigate>
		<!-- #endif -->
		<scroll-view class="scroll" :scroll-y="true" :show-scrollbar="false">
			<!-- 咨询师信息 -->
			<view class="order_info_list">
				<view class="order_item">
					<view class="order_item_title">{{config.charge != true?"预约信息":"订单信息"}}</view>
					<view class="order_list_text">{{submitConsultRequest.SchedulingID}}</view>
				</view>
				<view class="line_horizontal2"></view>
				<view class="order_item_content">
					<!-- 头像 -->
					<image :src="OrderShowBean.counselor_headPhoto||defaultIcon" class="headPhoto"></image>
					<!-- 信息列表 -->
					<view class="order_item_infolist">
						<view class="name">
							<view class="zixunshi_name">{{OrderShowBean.counselor_realName}}</view>
							<view class="price" :style="{'text-decoration':user.getVersion() == 0?'line-through':'none'}">{{order_money}}</view>
						</view>
						<view class="orther_info">
							{{OrderShowBean.orderWay + "：" + OrderShowBean.schedulingDate + "  " + OrderShowBean.schedulingTime}}
						</view>
					</view>
				</view>
			</view>
			<!-- 个人信息 -->
			<view class="order_info_list">
				<view class="order_item">个人信息</view>
				<view class="line_horizontal2"></view>
				<view class="order_item_content">
					<!-- 头像 -->
					<image :src="userHeadPhoto||defaultIcon" class="headPhoto"></image>
					<!-- 信息列表 -->
					<view class="order_item_infolist">
						<view class="name">{{laifangzhe_name}}</view>
						<view class="orther_info">{{"联系电话：" + laifangzhe_phone}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom_menu" @click="submitOrder">
			<view v-show="config.charge == true" class="menu_item_left">
				<view>合计：</view>
				<view class="price" style="font-size: 15px;">{{user.getUserData().Version == 0?'¥0':order_money}}</view>
			</view>
			<view class="menu_item_right" :style="{'width':config.charge == true?'50%':'100%'}">{{config.charge != true?"提交预约":"提交订单"}}</view>
		</view>
		<!-- 提示弹窗 -->
		<uni-popup ref="reminder" type="dialog">
			<view class="relationshipDialog" style="background-color: #FFFFFF;">
				<scroll-view class="reminderContent">{{reminder_text}}</scroll-view>
				<view class="line_horizontal2"></view>
				<view class="relationshipDialog_button"
					style="display: flex;justify-content: center;align-items: center;font-size: 15px;color: #3399FF;"
					@click="closeDialog()">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			// #ifdef H5
				if (option.id != null) {
					let thisid = option.id;
					this.id = thisid
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
				userHeadPhoto: "",
				defaultIcon: '../../static/img/consult/order_profle.png',
				order_money: "免费",
				userInfo: {},
				order_time: "",
				laifangzhe_name: "",
				laifangzhe_phone: "",
				reminder_text: "",
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
					"psyMobile": "",
				},
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
			}
		},
		mounted() {
			let ordershowdata = this.OrderShowBean;
			this.userInfo = this.user.getUserData();
			uni.setNavigationBarTitle({
				title: "确认订单"
			})
			this.userHeadPhoto = this.userInfo.headimgurl;
			this.order_money = ordershowdata.money == 0 ? "免费" : ("￥" + (ordershowdata.money / 100).toFixed(0) + "." + (
				ordershowdata.money % 100 / 10).toFixed(0) + (ordershowdata.money % 10).toFixed(0));
			this.laifangzhe_name = this.userInfo.RealName;
			this.laifangzhe_phone = this.userInfo.Mobile;
		},
		methods: {
			submitOrder: function() {
				let _this = this;
				if (_this.submitConsultRequest.UserID == "") {
					uni.showToast({
						title: "请先完善信息后再提交",
						icon: 'none',
						duration: 1500
					});
					return;
				}
				if(this.config.charge != true || this.user.getVersion() == 0){
					this.request.startRequest({
						url: _this.api.PostSubmitConsult,
						data: _this.submitConsultRequest,
					}).then(res =>{
						if (res.data.Code == 0) {
							let info = {
								'publish': '0',
								'AppointInfoID': res.data.Data[0].AppointInfoID
							}
							// let id = _this.utils.createUUID();
							try {
								// uni.setStorageSync(id, info);
								_this.navigate.hasOwnProperty()
								_this.navigate.navigateTo({
									url: './order_state',
									data:info
								})
								
							} catch (e) {
								console.log(e.message)
							}
						} else {						
							_this.reminder_text = res.data.Message;
							_this.$refs.reminder.open();
						}
					}).catch(reason =>{
						
					})	
				}else{
					//to pay
				}
						
			},
			closeDialog: function() {
				this.$refs.reminder.close();
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: calc(100vh - var(--window-top));
		display: flex;
		flex-direction: column;
	}

	.scroll {
		width: 100%;
		height: calc(100% - 50px);
		background-color: #e7e7e7;		
	}

	.line_horizontal2 {
		width: 100%;
		height: 1px;
		background-color: #e3e3e3;
	}

	.order_info_list {
		width: 100%;
		height: 140px;
		margin-bottom: 15px;
		display: flex;
		flex-direction: column;
		font-size: 15px;
		color: #000000;
		background-color: #FFFFFF;
	}

	.order_item {
		height: 40px;
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
		font-size: 16px;
		font-weight: bold;
		color: #000000;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #ffffff;
	}

	.order_item_title {
		width: 100px;
	}

	.order_list_text {
		text-align: right;
		width: auto;
		height: auto;
		font-size: 11px;
		/* font-weight: 400; */
		word-wrap: break-word;
		word-break: break-all;

	}

	.order_item_content {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: calc(100% - 41px);
		width: 100%;
	}

	.headPhoto {
		width: 65px;
		height: 65px;
		border-radius: 32.5px;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 15px;
		margin-right: 15px;
		background-color: #000000;
	}

	.order_item_infolist {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: calc(100% - 30px);
		width: calc(100% - 110px);
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.name {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 25px;
		font-size: 15px;
		line-height: 20px;
		color: #000000;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.zixunshi_name {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: calc(100% - 75px);
	}

	.price {
		height: 100%;
		width: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #f84033;
		text-align: right;
		font-size: 12.5px;
	}

	.orther_info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 25px;
		font-size: 15px;
		line-height: 20px;
		color: #000000;

	}

	.bottom_menu {
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 0;
		height: 50px;
		width: 100%;
		background-color: #3399FF;
	}

	.menu_item_left {
		width: 42%;
		height: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #646464;
		word-break: break-all;
	}

	.menu_item_right {
		
		height: 100%;
		background-color: #3399FF;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 18px;
	}

	.relationshipDialog {
		background-color: #eaeaea;
		width: 80vw;
		height: auto;
		max-height: calc(100vh - var(--window-top) - 120px);
		border-radius: 10px;
		padding-top: 10px;
	}

	.relationshipDialog_title {
		font-size: 20px;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 7.5px;
	}

	.relationshipDialog_content {
		width: 100%;
		height: auto;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #FFFFFF;
	}

	.relationshipDialog_button {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		height: 50px;
		background-color: #FFFFFF;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.relationshipDialog_button_item {
		width: calc(50% - 1rpx);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		color: #3399FF;
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
