<template>
	<view v-show="show" class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="预约详情"></sknavigate>
		<!-- #endif -->
		<view v-show="isEmpty" class="empty" @tap="getOrderDetailInfo()">
			<image :src="defaultImage" mode="aspectFit"></image>
			<view>{{emptyText}}</view>
		</view>
		<scroll-view class="scroll" :scroll-x="true" v-show="!isEmpty">
			<view class="order_state">
				<image :src="iconMyOrderTitle" class="headPhoto"></image>
				<view class="state_info_group">
					<view class="title">{{getButtonShow().order_detail_title}}</view>
					<view class="tips">{{getButtonShow().tips}}</view>
				</view>
			</view>
			<view class="doctor_info">
				<image :src="iconMyOrderAddress" class="icon2"></image>
				<view class="doctor_group">
					<view>咨询师：{{orderDetailInfo.RealName}}</view>
					<view>咨询电话：{{orderDetailInfo.DoctorMobile}}</view>
					<view>咨询地址：{{orderDetailInfo.ResidenceAddress}}</view>
				</view>
			</view>
			<view class="patient_info">
				<image :src="iconMyOrderInfo" class="icon2"></image>
				<view class="patient_info_group">
					<view>来访者：{{orderDetailInfo.PatientName}}</view>
					<view>联系电话：{{orderDetailInfo.Mobile}}</view>
				</view>
			</view>
			<view class="order">
				<view class="order_status">
					<view>预约状态：</view>
					<view style="color: #007AFF;">{{getButtonShow().order_state_show}}</view>
				</view>
				<view class="line_horizontal"></view>
				<view class="order_info">
					<image :src="orderDetailInfo.HeadPhotoURL||defaultIcon" class="headPhoto"></image>
					<view class="order_info_group">
						<view class="name_group">
							<view>{{orderDetailInfo.RealName}}</view>
							<view class="shifu">{{getPrice()}}</view>
						</view>
						<view>{{orderDetailInfo.ConsultingType+"："+orderDetailInfo.SchedulingDateTime}}</view>
						<view class="shifu" style="width: 100%;">实付：￥{{orderDetailInfo.Cash_fee}}</view>
					</view>
				</view>
			</view>
			<view class="order_num">
				<view>预约编号：{{orderDetailInfo.AppointInfoID}}</view>
				<view>创建时间：{{orderDetailInfo.CreatedDate}}</view>
			</view>
			<view :class="[getButtonShow().cancel_reason?'bottom_bar':'bottom_bar_single']">
				<image src="../../../static/img/consult/icon_comment.png" v-show="getButtonShow().cancel_reason"
					class="icon" @tap="itemChange('CANCELREASON')"></image>
				<view class="button_group">
					<view v-show="getButtonShow().cancel_show" class="delete_button" @tap="itemChange('PC')">取消订单</view>
					<view v-show="getButtonShow().cancel_apply_show" class="delete_button" @tap="itemChange('PAC')">申请取消
					</view>
					<view v-show="getButtonShow().delete_botton_show" class="delete_button" @tap="itemChange('DEL')">
						删除订单</view>
					<view v-show="getButtonShow().order_again_button_show" class="delete_button"
						@tap="itemChange('ORDERAGAIN')">再次预约
					</view>
					<view v-show="getButtonShow().ensure_complete_show" class="evaluation_button"
						@tap="itemChange('CE')">确认完成</view>
					<view v-show="getButtonShow().evaluation_button_show" class="evaluation_button"
						@tap="itemChange('EVALUATE')">评价
					</view>
					<view v-show="getButtonShow().pay_button_show" class="evaluation_button" @tap="itemChange('PAY')">付款
					</view>
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="popup" type="center" :maskClick="true" @change="popupChange">
			<view class="dialog_content">
				<view class="dialog_title">{{dialoggroup[0]}}</view>
				<view class="line_horizontal"></view>
				<scroll-view v-show="dialoggroup[4]" class="dialog_main">{{dialoggroup[1]}}</scroll-view>
				<scroll-view v-show="dialoggroup[2]">
					<radio-group style="padding-left: 20px; padding-right: 15px;" @change="reasonChange">
						<label v-for="(item,index) in CancelReasonList" :key="index" class="relationshipItem"
							style="display: flex;justify-content: space-between;">
							<view>{{item.text}}</view>
							<view>
								<radio style="transform: scale(0.7);" :value="item.text" />
							</view>
						</label>
					</radio-group>
				</scroll-view>
				<scroll-view v-show="dialoggroup[3]">
					<radio-group style="padding-left: 40rpx; padding-right: 30rpx;" @change="reasonChange">
						<label v-for="(item,index) in CancelApplyReasonList" :key="index" class="relationshipItem"
							style="display: flex;justify-content: space-between;">
							<view>{{item.text}}</view>
							<view>
								<radio style="transform: scale(0.7);" :value="item.text" />
							</view>
						</label>
					</radio-group>
				</scroll-view>
				<view class="line_horizontal"></view>
				<view class="dialog_button_group">
					<view class="button_left" @click="clickDialog(false)">取消</view>
					<view class="line_vertical"></view>
					<view class="button_right" @click="clickDialog(true)">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				defaultImage: "../../../static/img/no_data.png",
				defaultIcon: '../../../static/img/consult/order_profle.png',
				iconMyOrderAddress: '../../../static/img/consult/icon_my_order_address.png',
				iconMyOrderInfo: '../../../static/img/consult/icon_my_order_info.png',
				iconMyOrderTitle: '../../../static/img/consult/icon_my_order_title.png',
				isEmpty: false,
				emptyText: '暂无评论',
				appointInfoID: "",
				userID: "",
				orderDetailInfo: {},
				dialoggroup: ["title", "contentText", false, true, false],
				cancelOp: "",
				statusReason: "",
				show:false,
				changerOrderPara: {
					"AppointInfoID": "",
					"CancelOp": "",
					"StatusReason": "",
					"IsNeedPrice": "",
					"Out_trade_no": ""
				},
				CancelReasonList: [{
						"value": "不想预约了",
						"text": "不想预约了"
					},
					{
						"value": "预约咨询师错误",
						"text": "预约咨询师错误"
					},
					{
						"value": "预约时间错误",
						"text": "预约时间错误"
					},
					{
						"value": "个人信息有误",
						"text": "个人信息有误"
					},
					{
						"value": "其它原因",
						"text": "其它原因"
					},
				],
				CancelApplyReasonList: [{
						"value": "不想预约了",
						"text": "不想预约了"
					},
					{
						"value": "预约咨询师错误",
						"text": "预约咨询师错误"
					},
					{
						"value": "预约时间错误",
						"text": "预约时间错误"
					},
					{
						"value": "个人信息有误",
						"text": "个人信息有误"
					},
					{
						"value": "想退钱",
						"text": "想退钱"
					},
					{
						"value": "其它原因",
						"text": "其它原因"
					},
				],
			}
		},
		onLoad(option) {
			// #ifdef H5
				if (option.id != null) {
					let thisid = option.id;
					this.id = thisid
					try {
						let info = uni.getStorageSync(thisid);
						this.appointInfoID = info.item.AppointInfoID;
						this.userID = info.item.PatientID;
					} catch (e) {
						console.log(e.message)
					}
				
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.appointInfoID = info.item.AppointInfoID;
					this.userID = info.item.PatientID;
				}
			// #endif
			
		},
		onUnload() {
				
		},
		mounted() {
			uni.setNavigationBarTitle({
				title: "咨询详情"
			});
			this.getOrderDetailInfo();
		},
		onShow() {
			this.getOrderDetailInfo();
		},
		methods: {
			delOrder: function(orderID) { //删除订单
				let _this = this;
				
				this.request.startRequest({
					url: _this.api.PostDelMyConsultOrder,
					data: [{
						"AppointInfoID": orderID
					}],
				}).then(res =>{
					if(res.data.Code == '0'){
						uni.showToast({
							title: "订单删除成功",
							icon: 'none',
							duration: 1500
						});
						// #ifdef H5
							this.navigate.naviBack(1)
						// #endif
						// #ifndef H5
							uni.navigateBack();
						// #endif
						
					}else{
						uni.showToast({
							title:'操作失败，请稍后再试!'
						})
					}
					
				}).catch(reason =>{
					uni.showToast({
						title:'操作失败，请稍后再试!'
					})
				})				
				
			},
			changeOrder: function() { //修改我的咨询订单
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostModifyMyConsultOrderForBCDoctor,
					data: {
						"AppointInfoID": _this.orderDetailInfo.AppointInfoID,
						"CancelOp": _this.cancelOp,
						"StatusReason": _this.statusReason,
						"IsNeedPrice": _this.orderDetailInfo.IsNeedPrice,
						"Out_trade_no": _this.orderDetailInfo.Out_trade_no
					},
					showLoading:true
					
				}).then(res =>{
					if (res.data.Code == 0) {
						_this.getOrderDetailInfo();
					} else {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(reason =>{
					uni.showToast({
						title: "修改失败",
						icon: 'none',
						duration: 1500
					});
				})
				
			},
			getButtonShow: function() { //申请取消按钮
				let option = {
					"order_state_show": "",
					"order_detail_title": "",
					"tips": "",
					"cancel_reason": false,
					"cancel_show": false,
					"cancel_apply_show": false,
					"evaluation_button_show": false,
					"ensure_complete_show": false,
					"delete_botton_show": false,
					"order_again_button_show": false,
					"pay_button_show": false,
				}
				let _this = this;
				let info = _this.orderDetailInfo;
				if (info.State == 0) {
					if (info.IsNeedPrice == 1 && info.OrderState != 0 && _this
						.orderDetailInfo.OrderState == 0) {
						option.order_state_show = '等待付款';
						option.order_detail_title = '请于' + info.EndPayTime + '之前完成付款';
						option.tips = "超时未支付将自动取消订单"
						option.pay_button_show = true;
					} else {
						option.order_state_show = '待接受';
						option.order_detail_title = '等待咨询师接受订单';
						option.tips = "二十四小时内咨询师未接受自动取消"
					}
					option.cancel_show = true;
				} else if (info.State == 1) {
					if (info.Status == -2) {
						option.order_state_show = '取消申请中';
						option.order_detail_title = '等待取消确认';
						option.tips = "取消正在审核中，请耐心等待"
					} else if (info.IsConsult == 0) {
						option.order_state_show = '等待咨询';
						option.order_detail_title = '请保持手机畅通';
						option.tips = "咨询师将在预约时间前主动联系你，如需取消，最晚请在咨询前1小时申请取消"
						option.cancel_apply_show = true;
						option.ensure_complete_show = true;
					} else {
						option.order_state_show = '已咨询';
						option.tips = ""
					}
				} else if (info.State == 2) {
					if (info.IsComment == 0) {
						option.order_state_show = '待评价';
						option.order_detail_title = '请对本次咨询进行评价';
						option.tips = "请表达你对本次咨询的看法及意见"
						option.evaluation_button_show = true;
					} else {
						option.order_state_show = '已完成';
						option.order_detail_title = '评价完成';
						option.tips = "待补充"
					}
					option.delete_botton_show = true;
					option.order_again_button_show = true;
				} else if (info.State == 3) {
					switch (info.CancelState) {
						case "1": {
							option.order_state_show = '咨询师取消';
							option.order_detail_title = '咨询师取消订单';
							option.tips = '特殊原因，咨询师取消了订单'
							break;
						}
						case "2": {
							option.order_state_show = '来访者取消';
							option.order_detail_title = '本人取消订单';
							option.tips = "风里雨里我就在那里，如有问题请记得再次预约噢~"
							break;
						}
						case "3": {
							option.order_state_show = '咨询师未接受';
							option.order_detail_title = '咨询师拒绝本订单';
							option.tips = "未接受原因：" + info.StatusReason;
							break;
						}
						case "4": {
							option.order_state_show = '支付关闭';
							option.order_detail_title = '订单超时关闭';
							option.tips = "十五分钟内未成功付款，订单已超时自动关闭"
							break;
						}
					}
					option.cancel_reason = true;
					option.delete_botton_show = true;
				}
				return option;
			},
			getPrice: function() {
				let _this = this;
				let info = _this.orderDetailInfo;
				return (info.Fee == 0 || info.Fee == null) ? "免费" : ("￥" + (info.PriceStandard / 100).toFixed(0) +
					"." + (info.PriceStandard % 100 / 10).toFixed(0) + (info.PriceStandard % 10).toFixed(0));
			},
			getOrderDetailInfo: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostMyConsultOrderDetailForBCDoctor,
					data: {
						"AppointInfoID": _this.appointInfoID,
						"UserID": _this.userID,
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						_this.orderDetailInfo = res.data.Data[0];
						_this.isEmpty = res.data.Data.length == 0 ? true : false;
						_this.show = true
						_this.defaultImage = "../../../static/img/no_data.png";
					} else {
						_this.isEmpty = true;
						_this.defaultImage = "../../../static/img/load_error.png";
						_this.emptyText = "获取数据失败"
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(reason =>{
					_this.isEmpty = true;
					_this.defaultImage = "../../../static/img/load_error.png";
					_this.emptyText = "获取数据失败"
					console.log(e.errMsg);
					uni.showToast({
						title: "数据获取失败",
						icon: 'none',
						duration: 1500
					})
				})				
			},
			itemChange: function(da) {
				let _this = this;
				_this.cancelOp = da;
				switch (da) {
					case "PC": {
						_this.dialoggroup = ["取消原因", "", true, false, false];
						_this.$refs.popup.open();
						break;
					}
					case "CE": {
						_this.dialoggroup = ["确认提示", "您确定当前咨询已经完成？", false, false, true];
						_this.$refs.popup.open();
						break;
					}
					case "PAC": {
						_this.dialoggroup = ["退款原因", "", false, true, false];
						_this.$refs.popup.open();
						break;
					}
					case "DEL": {
						_this.dialoggroup = ['删除提示', '您确定要删除此订单吗？', false, false, true];
						_this.$refs.popup.open();
						break;
					}
					case "CANCELREASON": {
						let reason = _this.orderDetailInfo.StatusReason == "" ? "支付关闭" : _this.orderDetailInfo
							.StatusReason;
						uni.showToast({
							title: reason,
							icon: 'none',
							duration: 1500
						})
						break;
					}
					case "ORDERAGAIN": {
						let data = {
							"UserID": _this.orderDetailInfo.DoctorID,
							"HeadPhotoURL": _this.orderDetailInfo.HeadPhotoURL
						}
						this.navigate.navigateTo({
							url: '../../consult/consult_detail?item=' + JSON.stringify(data)
						})						
						break;
					}
					case "EVALUATE": {
						this.navigate.navigateTo({
							url: './submit_comments?item=' + JSON.stringify(_this.orderDetailInfo
								.AppointInfoID)
						})							
						break;
					}
					case "PAY": { //付款
						break;
					}
				}
			},
			popupChange: function(e) {
				if (!e.show) {
					this.statusReason = "";
				}
			},
			reasonChange: function(e) {
				this.statusReason = e.detail.value;
			},
			clickDialog: function(c) {
				let _this = this;
				if (c) {
					if (_this.cancelOp == "DEL") _this.delOrder(_this.orderDetailInfo.AppointInfoID);
					else _this.changeOrder();
				} else {
					_this.statusReason = "";
				}
				_this.$refs.popup.close();
			},
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: calc(100vh - var(--window-top));
		/* display: flex;
		flex-direction: column;
		font-size: 15px; */
		/* color: #000000; */
	}

	.scroll {
		width: 100%;
		height: calc(100% - 50px);
		background-color: #e7e7e7;
		padding-bottom: 50px;
	}

	.empty {
		width: 100vw;
		height: 70%;
		background-color: #f3f3f3;
		padding-top: 15px;
		font-size: 17.5px;
		color: #9d9d9d;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.order_state {
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
		height: 80px;
		padding-top: 10px;
		padding-bottom: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 10px;
	}

	.headPhoto {
		width: 50px;
		height: 50px;
		border-radius: 40px;
		margin-right: 10px;
	}

	.order_info_group {
		width: calc(100% - 60px);
		height: calc(100% - 20px);
		padding-top: 10px;
		padding-bottom: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 15px;
		word-wrap: break-word;
		word-break: break-all;
		background-color: #ffffff;

	}

	.name_group {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.shifu {
		height: auto;
		text-align: end;
		color: #fd4234;
	}

	.order_num {
		width: calc(100% - 20px);
		height: 55px;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 10px;
		padding-bottom: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 12.5px;
		color: #767676;
		word-wrap: break-word;
		word-break: break-all;
		background-color: #ffffff;
	}

	.state_info_group {
		width: calc(100% - 60px);
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		background-color: #ffffff;
	}

	.title {
		width: 100%;
		height: 60%;
		font-size: 15px;
		font-weight: bold;
		color: #000000;
		display: flex;
		flex-direction: column;
		justify-content: center;
		word-break: break-all;
		word-wrap: break-word;
	}

	.tips {
		width: 100%;
		height: 40%;
		font-size: 12.5px;
		color: #767676;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		word-wrap: break-word;
		word-break: break-all;
	}

	.doctor_info {
		width: calc(100% - 20px);
		height: 80px;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 5px;
		padding-bottom: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 12.5px;
		line-height: 20px;
		word-wrap: break-word;
		word-break: break-all;
		color: #767676;
		margin-bottom: 10px;

		background-color: #ffffff;
	}

	.doctor_group {
		width: calc(100% - 40px);
		height: 100%;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		background-color: #ffffff;
	}

	.patient_info {
		width: calc(100% - 20px);
		height: 55px;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 12.5px;
		line-height: 20px;
		word-wrap: break-word;
		word-break: break-all;
		color: #767676;
		margin-bottom: 40px;

		background-color: #ffffff;
	}

	.patient_info_group {
		width: calc(100% - 20px);
		height: 100%;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		background-color: #ffffff;
	}

	.order {
		width: calc(100% - 20px);
		height: 165px;
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;

		background-color: #ffffff;
	}

	.order_status {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 15px;
		color: #767676;
		line-height: 20px;
	}

	.line_horizontal {
		width: 100%;
		height: 2.5px;
		background-color: #bababa;
		margin-top: 2.5px;
		margin-bottom: 2.5px;
	}

	.order_info {
		width: 100%;
		height: calc(100% - 55px);
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 15px;
		color: #000000;
		background-color: #ffffff;
	}

	.bottom_bar {
		position: fixed;
		bottom: 0;
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
		height: auto;
		max-height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: #ffffff;
	}

	.bottom_bar_single {
		position: fixed;
		bottom: 0;
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
		height: auto;
		max-height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		border: 1px;

		background-color: #ffffff;
	}

	.icon {
		width: 30px;
		height: 30px;
	}

	.icon2 {
		width: 30px;
		height: 30px;
	}

	.button_group {
		width: auto;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: end;
		font-size: 25px;
		color: #767676;
	}

	.delete_button {
		margin-left: 10px;
		font-size: 15px;
		height: 25px;
		line-height: 20px;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 4.5px;
		padding-bottom: 5px;
		margin-top: 12.5px;
		margin-bottom: 10px;
	}

	.evaluation_button {
		color: #007AFF;
		border: 1px solid #007AFF;
		width: auto;
		height: 25px;
		display: flex;
		font-size: 15px;
		flex-direction: column;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 4.5px;
		padding-bottom: 5px;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
		border-radius: 5px;
		margin-top: 12.5px;
		margin-bottom: 10px;
	}

	.dialog_content {
		width: calc(80vw - 20px);
		height: auto;
		max-height: 60%;
		background-color: #FFFFFF;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
	}

	.dialog_title {
		width: 100%;
		height: auto;
		font-size: 17.5px;
		font-weight: bold;
		color: #55aaff;
		line-height: 25px;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 7.5px;
	}

	.dialog_main {
		width: calc(100% - 10px);
		height: auto;
		max-height: 50vh;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		padding-left: 5px;
		padding-right: 5px;
		text-align: center;
		font-size: 15px;
		color: #000000;
	}

	.dialog_button_group {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 15px;
		color: #000000;
	}

	.button_left {
		width: calc(50% - .5px);
		height: calc(100% - 7.5px);
		padding-top: 7.5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		color: #000000;
	}

	.button_right {
		width: calc(50% - .5px);
		height: calc(100% - 7.5px);
		padding-top: 7.5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #55aaff;
		font-size: 15px;
	}

	.relationshipItem {
		display: flex;
		flex-direction: row;
		font-size: 15px;
		margin-top: 7.5px;
		margin-bottom: 7.5px;
	}
</style>
