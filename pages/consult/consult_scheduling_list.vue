<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate"></sknavigate>
		<!-- #endif -->
		<scroll-view class="scrollview" scroll-y="true" :show-scrollbar="false">
			<!-- 咨询师信息 -->
			<view class="counselor_info">
				<image :src="headPhoto||defaultIcon" class="headPhoto"></image>
				<view class="counselor_info_group1">
					<view class="counselor_info_group2">
						<view class="counselor_name">{{userInfo[0].RealName}}</view>
						<text class="counselor_otherinfo">{{userInfo[0].Sex}}</text>
						<text class="counselor_otherinfo">{{userInfo[0].Age+"岁"}}</text>
					</view>
					<view class="counselor_address">{{userInfo[0].ResidenceAddress}}</view>
					<view class="counselor_level">{{userInfo[0].PsyVocaQualification}}</view>
				</view>
			</view>
			<view style="background-color: #FFFFFF;">
				<!-- 咨询方式选择 -->
				<view class="price_stand">
					<block v-for="(item,index) in priseStand" :key="index">
						<view :class="[dic_key==item.DicKey? 'select':'unselect']" @click="tapItem(item)">
							<view class="dic_value">{{item.DicValue}}</view>
							<image :src="geticon(item)" class="icon"></image>
							<view class="dic_value" style="font-size: 11px;">{{getPrice(item.PriceStandard)}}</view>
						</view>
					</block>
				</view>
				<view class="line_horizontal"></view>
				<!-- 介绍选中的方式 -->
				<view class="remark_dic">
					<image :src="chatIcon" class="icon_little"></image>
					<view class="remark_text">{{remark}}</view>
				</view>
			</view>
			<!-- 问诊须知 -->
			<view class="wzxz">{{wzxzText}}</view>
			<view class="line_horizontal2"></view>
			<!-- 排班列表 -->
			<view v-show="!islistshow" class="empty" @tap="getScheduleListForBCDoctor(dic_key);">
				<image src="../../static/img/no_data.png" mode="aspectFit"></image>
				<view>{{holderText}}</view>
			</view>
			<view v-show="islistshow" v-for="(item,index) in scheduleList" :key="index">
				<scheduleListItem :value="item" class="schedulelist_item" @orderClick="itemOrderClick(index,item)">
				</scheduleListItem>
				<view class="line_horizontal2"></view>
			</view>
		</scroll-view>
		<uni-popup ref="popup" type="right" :maskClick="true" @change="popupChange">
			<view class="popup_group">
				<view class="popup_choose_title">
					<view class="popup_date_title">
						{{scheduleList.length==0?'1900-01-01':scheduleList[choosenum].SchedulingDate}}
					</view>
					<view class="popup_choose_close" @click="closePopup">关闭</view>
				</view>
				<radio-group @change="boxChange">
					<view v-for="(item,index) in (scheduleList.length==0?scheduleList:scheduleList[choosenum].ListItem)"
						:key="index"
						:class="[getOrderState(item).isCanOrder? 'popup_choose_list_select' : 'popup_choose_list_unselect']">
						<view class="list_time">
							<radio ref="radio" class="list_time_group" :disabled="!getOrderState(item).isCanOrder"
								:value="item.SchedulingTime+'***'+item.SchedulingID" :checked="false">
								<view>{{item.SchedulingTime}}</view>
							</radio>
							<view class="list_time_state">
								{{getOrderState(item).orderState}}
							</view>
						</view>
						<view class="line_horizontal2"></view>
					</view>
				</radio-group>
				<view class="next_step" @click="goToNext()">下一步</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import scheduleListItem from './schedule_list_item.vue';
	export default {
		components: {
			scheduleListItem,
		},
		onLoad(option) {
			// #ifdef H5
				if (option.id != null) {
					let thisid = option.id;
					try {
						let info = uni.getStorageSync(thisid);
						this.userInfo = info.item;
					} catch (e) {
						console.log(e.message)
					}
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.userInfo = info.item;
				}
			// #endif
			
		},
		data() {
			return {
				islistshow: true,
				holderText: "该咨询师还未发布排班哦",
				defaultIcon: '../../static/img/consult/order_profle.png',
				chatIcon: '../../static/img/consult/icon_counselor_details_liaotian.png',
				wzxzText: "问诊须知：专家实行预约制问诊，请选择具体排班。到达问诊时间后，医生将主动发起聊天，请保证所提供信息准确。",
				headPhoto: '',
				dic_key: "C01",
				dic_value: "面询",
				dic_money: 0,
				schedulingDate: "",
				schedulingTime: "",
				remark: '介绍选中的方式',
				scheduleList: [],
				choosenum: 0,
				orderValue: '',
				PatientID: "",
				userInfo: [{
					"UserID": "",
					"Sex": "男",
					"Age": "0",
					"RealName": "姓名",
					"HeadPhotoURL": "",
					"Degree": "",
					"PsyVocaQualification": "心理咨询师",
					"skill": "",
					"WorkLevel": "",
					"Profession": "",
					"SelfIntroduction": "",
					"FavoriteStatus": "0",
					"ConsultNum": "",
					"CommentScore": "",
					"YearsOfWorking": "",
					"PriceStandard": "",
					"ResidenceAddress": "地址"
				}], //咨询师信息
				priseStand: [{
						"DicKey": "C01",
						"DicValue": "面询",
						"PriceStandard": "0",
						"TimeLength": "60",
						"Remark": "",
					},
					{
						"DicKey": "C02",
						"DicValue": "电话咨询",
						"PriceStandard": "0",
						"TimeLength": "60",
						"Remark": ""
					},
					{
						"DicKey": "C03",
						"DicValue": "在线咨询",
						"PriceStandard": "0",
						"TimeLength": "60",
						"Remark": ""
					},
					{
						"DicKey": "C04",
						"DicValue": "视频咨询",
						"PriceStandard": "0",
						"TimeLength": "60",
						"Remark": ""
					}
				]
			}
		},
		mounted() {
			uni.setNavigationBarTitle({
				title: "预约咨询"
			})
			this.PatientID = this.user.getLoginState() ? this.user.getUserId() : "";
			this.getPriceStand();
			this.getScheduleListForBCDoctor(this.dic_key);
			this.headPhoto = this.userInfo[0].HeadPhotoURL;

		},
		onShow() {
			uni.setNavigationBarTitle({
				title: "预约咨询"
			})
			this.getPriceStand();
			this.getScheduleListForBCDoctor(this.dic_key);
			this.headPhoto = this.userInfo[0].HeadPhotoURL;
		},
		methods: {
			tapItem: function(item) {
				let _this = this;
				_this.dic_key = item.DicKey;
				_this.dic_value = item.DicValue;
				_this.dic_money = item.PriceStandard;
				if (item.Remark != "" && item.Remark != null) {
					_this.remark = item.Remark;
				}
				_this.getScheduleListForBCDoctor(item.DicKey);
			},
			getPriceStand: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostPriceStand,
					data: {
						"UserID": _this.userInfo[0].UserID
					},
					showLoading:true
				}).then(res =>{
					let newdata = res.data.Data;
					if (res.data.Code == 0) {
						if (newdata != null && newdata.length != 0) {
							_this.priseStand = newdata;
							_this.setDicMoney(_this.dic_key.toString());
						}
					} else {
						uni.showToast({
							title: request.data.Message,
							icon: 'none',
							duration: 1500
						})
					}
				}).catch(reason =>{
					console.log(JSON.stringify(reason))
				})
			
			},
			getPrice: function(priceStandard) {
				if (priceStandard == 0) {
					return "免费";
				} else {
					return "￥" + (priceStandard / 100).toFixed(0) + "." + (priceStandard % 100 / 10).toFixed(0) + (
						priceStandard % 10).toFixed(0) + "元/时"
				}
			},
			setDicMoney: function(dickey) {
				let _this = this;
				for (var i = 0; i < _this.priseStand.length; i++) {
					if (_this.priseStand[i].DicKey == dickey) {
						_this.dic_money = _this.priseStand[i].PriceStandard;
					}
				}
			},
			getScheduleListForBCDoctor: function(query) {
				let _this = this;
				uni.showLoading({
					title:"数据加载中..."
				});
				uni.request({
					url: _this.api.PostScheduleList,
					method: 'POST',
					header: {
						'Content-Type': 'application/json;charset=utf-8'
					},
					timeout: 60000,
					data: {
						'UserID': _this.userInfo[0].UserID,
						'PatientID': _this.PatientID,
						'Query': query
					},
					success(request) {
						if (request.data.Code == 0) {
							let list = request.data.Data;
							_this.scheduleList = [];
							if (list != null && list != 0) {
								for (var i = 0; i < list.length; i++) {
									let isRepeat = false;
									let num = 0;
									let listnum = 0;
									if (_this.scheduleList == null) {
										_this.scheduleList.push({
											"SchedulingDate": list[i].SchedulingDate,
											"ListItem": [list[i]]
										})
									} else {
										for (var j = 0; j < _this.scheduleList.length; j++) {
											if (list[i].SchedulingDate > _this.scheduleList[j].SchedulingDate)
												listnum = j + 1;
											if (list[i].SchedulingDate == _this.scheduleList[j]
												.SchedulingDate) {
												isRepeat = true;
												num = j;
											}
										}
										if (isRepeat) {
											_this.scheduleList[num].ListItem.push(list[i])
										} else {
											let a = {
												"SchedulingDate": list[i].SchedulingDate,
												"ListItem": [list[i]]
											};
											for (var k = listnum; k < _this.scheduleList.length; k++) {
												let b = _this.scheduleList[k];
												_this.scheduleList.splice(k, 1, a);
												a = b;
											}
											_this.scheduleList.push(a);
										}
									}
								}
							} 
							_this.islistshow = list.length <=0? false:true;
							_this.holderText = list.length <=0? "该咨询师还未发布排班哦":"";
						} else {
							_this.islistshow = false;
							_this.holderText = "数据获取失败，请点击重试！";
							uni.showToast({
								title: request.data.Message,
								icon: 'none',
								duration: 1500
							});
						}
					},
					fail(e) {
						_this.islistshow = false;
						_this.holderText = "数据获取失败，请点击重试！";
						console.log("错误：" + e.errMsg);
						uni.showToast({
							title: "数据获取失败",
							icon: 'none',
							duration: 1500
						});
					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			itemOrderClick: function(index, item) {
				let _this = this;
				_this.schedulingDate = item.SchedulingDate
				_this.choosenum = index;
				_this.$refs.popup.open('');
			},
			getOrderState: function(item) {
				let a = {
					'isCanOrder': true,
					'orderState': "可预约"
				}
				if (item != null) {
					if (item.IsCanAppoint == 0) {
						a.orderState = "不可预约";
						a.isCanOrder = false;
					}
					if (item.MyNum > 0) {
						a.orderState = "已预约";
						a.isCanOrder = false;
					}
					if (item.RemainNum <= 0) {
						a.orderState = "已满员";
						a.isCanOrder = false;
					}
				}
				return a
			},
			boxChange: function(e) {
				let array = e.detail.value.split("***")
				this.schedulingTime = array[0];
				this.orderValue = array[1];
			},
			closePopup: function() {
				this.$refs.popup.close();
			},
			popupChange: function(e) {
				if (!e.show) this.orderValue = '';
			},
			goToNext: function() {
				let _this = this;
				let OrderShowBean = {
					"counselor_headPhoto": _this.userInfo[0].HeadPhotoURL,
					"counselor_realName": _this.userInfo[0].RealName,
					"counselor_sex": _this.userInfo[0].Sex,
					"counselor_age": _this.userInfo[0].Age,
					"counselor_residenceAddress": _this.userInfo[0].ResidenceAddress,
					"counselor_psyVocaQualification": _this.userInfo[0].PsyVocaQualification,
					"orderWay": _this.dic_value,
					"ConModeID": _this.dic_key,
					"money": _this.dic_money,
					"schedulingDate": _this.schedulingDate,
					"schedulingTime": _this.schedulingTime,
					"psyMobile": "",
				};
				let submitConsultRequest = {
					"TerminalType": "APP",
					"SchedulingID": _this.orderValue, //必填
					"UserID": _this.PatientID, //必填
					"ConModeID": _this.dic_key, //必填
					"PsyMobile": "", //必填
					"EmergentPerson": "",
					"EmergentPersonMobile": "",
					"EmergentPersonRelationship": "",
					"Family": "",
					"Issue": "",
					"Purpose": "",
					"Somatization": "",
					"ConHistory": "",
					"PsyTest": "",
					"Remark": "",
				}
				if (_this.orderValue != "" && _this.orderValue != null) {
					let info = {
						'publish': '0',
						'OrderShowBean': OrderShowBean,
						'submitConsultRequest': submitConsultRequest
					}
					// let id = _this.utils.createUUID();
					try {
						// uni.setStorageSync(id, info);
						_this.navigate.navigateTo({
							url: './order_information',
							data:info
						})
						
					} catch (e) {
						console.log(e.message)
					}
				} else {
					uni.showToast({
						title: "请先选择排班",
						icon: 'none',
						duration: 1500
					})
				}
			},
			geticon: function(item) {
				switch (item.DicKey) {
					case "C01": {
						return "../../static/img/consult/order_cosTypt_03.png"
						break;
					}
					case "C02": {
						return "../../static/img/consult/order_cosTypt_01.png"
						break;
					}
					case "C03": {
						return "../../static/img/consult/order_cosTypt_00.png"
						break;
					}
					case "C04": {
						return "../../static/img/consult/order_cosTypt_02.png"
						break;
					}
				}
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh - var(--window-top);
		display: flex;
		flex-direction: column;
	}

	.scrollview {
		width: 100%;
		height: 100%;
		background-color: #e3e3e3;
		margin-bottom: 50px;
	}

	.counselor_info {
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

	.counselor_info_group1 {
		width: calc(100% - 110px);
	}

	.counselor_info_group2 {
		margin-top: 10px;
		margin-bottom: 7.5px;
		display: flex;
		flex-direction: row;
	}

	.counselor_name {
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

	.counselor_otherinfo {
		font-size: 14px;
		margin-right: 10px;
		width: 75px;
		word-break: break-all;
		margin-top: auto;
		margin-bottom: auto;
	}

	.counselor_address {
		font-size: 12px;
		margin-right: 10px;
		width: auto;
		word-break: break-all;
	}

	.counselor_level {
		font-size: 14px;
		margin-top: 7.5px;
		margin-bottom: 7.5px;
	}

	.price_stand {
		display: flex;
		flex-direction: row;
		width: 98%;
		justify-content: space-around;
		padding-top: 10px;
		margin-bottom: 10px;
		margin-left: auto;
		margin-right: auto;
	}

	.dic_value {
		font-size: 14px;
		color: #5b5b5b;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 10px;
		width: 100%;
		height: auto;
	}

	.select {
		background-color: #d0fcff;
		width: 23%;
		display: flex;
		padding-left: 1%;
		padding-right: 1%;
		border-radius: 5px;
		flex-direction: column;
	}

	.unselect {
		background-color: #FFFFFF;
		width: 23%;
		display: flex;
		padding-left: 1%;
		padding-right: 1%;
		border-radius: 5px;
		flex-direction: column;
	}

	.icon {
		width: 25px;
		height: 25px;
		margin-left: auto;
		margin-right: auto;
		border-radius: 5px;
	}

	.icon_little {
		width: 20px;
		height: 15px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 5px;
	}

	.line_horizontal {
		width: 100vw;
		height: .5px;
		background-color: #e6e6e6;
	}

	.line_horizontal2 {
		width: 100%;
		height: .5px;
		background-color: #e6e6e6;
	}

	.remark_dic {
		display: flex;
		flex-direction: row;
		height: auto;
		width: 100%;
		padding-left: 15px;
		padding-right: 15px;
		margin-bottom: 10px;
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.remark_text {
		margin-top: 7.5px;
		margin-bottom: 7.5px;
		margin-left: 5px;
		font-size: 12px;
		color: #000000;
		width: calc(100% - 20px - 20px - 15px);
		height: auto;
		word-break: break-all;
	}

	.wzxz {
		padding-left: 10px;
		padding-right: 10px;
		word-break: break-all;
		font-size: 12px;
		color: #9e9e9e;
		line-height: 17.5px;
		padding-bottom: 10px;
		background-color: #FFFFFF;
		padding-top: 10px;
		text-indent: 25px;
	}

	.schedulelist_empty {
		width: 100%;
		height: 100px;
		background-color: #FFFFFF;
		font-size: 15px;
		color: #868686;
		padding-top: 50px;
		text-align: center;
	}

	.schedulelist_item {
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 90%;
		padding-left: 5%;
		padding-right: 5%;
	}

	.popup_group {
		width: 80vw;
		height: 100vh;
		background-color: #FFFFFF;
	}

	.popup_choose_title {
		width: calc(100% - 20px);
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 10px;
		padding-right: 10px;
		background-color: #cccccc;
	}

	.popup_date_title {
		font-size: 15px;
		font-weight: bold;
		color: #000000;
	}

	.popup_choose_close {
		font-size: 14px;
		margin-right: 10px;
		color: #000000;
	}

	.popup_choose_list_select {
		font-size: 14px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 50px;
		align-items: center;
		background-color: #ffffff;
	}

	.popup_choose_list_unselect {
		font-size: 14px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 50px;
		align-items: center;
		background-color: #cccccc;
	}

	.next_step {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50px;
		background-color: #3399FF;
		position: fixed;
		bottom: 0;
		color: #FFFFFF;
		font-size: 14px;
	}

	.list_time_group {
		display: flex;
		flex-direction: row;
		width: calc(100% - 75px);
	}

	.list_time_state {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 75px;
	}

	.list_time {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
	}

	.empty {
		width: 100%;
		height: 300px;
		font-size: 15px;
		color: #b9b9b9;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 15px;
		background-color: #ffffff;
	}
</style>
