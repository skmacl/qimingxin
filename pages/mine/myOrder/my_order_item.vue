<template>
	<view class="item-content">
		
		<view class="top_text">
			<view>下单时间：{{value.CreatedDate}}</view>
			<view style="color: #3399FF;">{{getButtonShow().order_state_show}}</view>
		</view>
		<view class="order_info_group" @tap="goToDetail()">
			<image class="headPhoto" :src="value.HeadPhotoURL||defaultIcon"></image>
			<view class="order_info">
				<view class="info_first">
					<view class="name">{{value.RealName}}</view>
					<view v-show="user.getVersion() != '0'" class="price">{{getPrice()}}</view>
				</view>
				<view class="info_time">{{value.ConsultingType+"："+value.SchedulingDateTime}}</view>
				<view class="info_time">预约号：{{value.AppointInfoID}}</view>
			</view>
		</view>
		<view v-show="linShow" class="line_horizontal"></view>
		<view :class="[getButtonShow().cancel_reason?'bottom_text':'bottom_text_single']">
			<image src="../../../static/img/consult/icon_comment.png" class="icon"
				v-show="getButtonShow(value).cancel_reason" @tap="itemChange('CANCELREASON')"></image>
			<view class="button_group">
				<view v-show="getButtonShow().cancel_show" class="delete_button" @tap="itemChange('PC')">取消订单</view>
				<view v-show="getButtonShow().cancel_apply_show" class="delete_button" @tap="itemChange('PAC')">申请取消
				</view>
				<view v-show="getButtonShow().delete_botton_show" class="delete_button" @tap="itemChange('DEL')">删除订单
				</view>
				<view v-show="getButtonShow().order_again_button_show" class="delete_button"
					@tap="itemChange('ORDERAGAIN')">再次预约</view>
				<view v-show="getButtonShow().ensure_complete_show" class="evaluation_button" @tap="itemChange('CE')">
					确认完成</view>
				<view v-show="getButtonShow().evaluation_button_show" class="evaluation_button"
					@tap="itemChange('EVALUATE')">评价</view>
				<view v-show="getButtonShow().pay_button_show" class="evaluation_button" @tap="itemChange('PAY')">付款
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {}
		},
		data() {
			return {
				defaultIcon: '../../../static/img/consult/order_profle.png',
				linShow:true,
			}
		},
		mounted() {},
		methods: {
			getButtonShow: function() { //申请取消按钮
				let option = {
					"order_state_show": "",
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
				if (_this.value.State == 0) {
					if (_this.value.IsNeedPrice == 1 && _this.value.OrderState != 0 && _this.value.OrderState == 0) {
						option.order_state_show = '等待付款';
						option.pay_button_show = true;
					} else {
						option.order_state_show = '待接受';
					}
					option.cancel_show = true;
				} else if (_this.value.State == 1) {
					if (_this.value.Status == -2) {
						option.order_state_show = '取消申请中';
						_this.linShow = false;
					} else if (_this.value.IsConsult == 0) {
						option.order_state_show = '等待咨询';
						option.cancel_apply_show = true;
						option.ensure_complete_show = true;
					} else {
						option.order_state_show = '已咨询';
					}
				} else if (_this.value.State == 2) {
					if (_this.value.IsComment == 0) {
						option.order_state_show = '待评价';
						option.evaluation_button_show = true;
					} else {
						option.order_state_show = '已完成';
					}
					option.delete_botton_show = true;
					option.order_again_button_show = true;
				} else if (_this.value.State == 3) {
					if (_this.value.CancelState == 1) option.order_state_show = '咨询师取消';
					if (_this.value.CancelState == 2) option.order_state_show = '来访者取消';
					if (_this.value.CancelState == 3) option.order_state_show = '咨询师未接受';
					if (_this.value.CancelState == 4) option.order_state_show = '支付关闭';
					option.cancel_reason = true;
					option.delete_botton_show = true;
				}
				return option;
			},
			getPrice: function() {
				let _this = this;
				if (_this.value.Fee == 0) {
					return "免费";
				} else {
					let str = "￥" + _this.value.Fee / 100 + "." + _this.value.Fee % 100 /
						10 + _this.value.Fee % 10;
					return str;
				}

			},
			itemChange: function(event) {
				let _this = this;
				let reason = '';
				let data = {};
				if (_this.value.StatusReason == "") {
					reason = "支付超时";
				} else {
					reason = _this.value.StatusReason;
				}
				if (event == "ORDERAGAIN") {
					data = {
						"UserID": _this.value.DoctorID,
						"HeadPhotoURL": _this.value.HeadPhotoURL,
						"CancelOp": event,
					};
				} else {
					data = {
						"AppointInfoID": _this.value.AppointInfoID,
						"CancelOp": event,
						"StatusReason": reason,
						"IsNeedPrice": _this.value.IsNeedPrice,
						"Out_trade_no": _this.value.Out_trade_no
					};
				}
				_this.$emit("itemChange", data);
			},
			goToDetail: function() {
				let _this = this
				// let id = this.utils.createUUID();
				let info = {
					"publishid": '0',
					"item": this.value
				}
				//此处等待修改
				try {
					// uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: './my_order_detail',
						data:info
					})					
				} catch (e) {
					console.log(e.message)
				}
			}
		}
	}
</script>

<style>
	.item-content {
		width: 100%;
		height: auto;
		max-height: 195px;
		display: flex;
		flex-direction: column;
		font-size: 15px;
		/* padding-left: 20rpx;
		padding-right: 20rpx; */
		/* padding-top: 20rpx; */
		/* padding-bottom: 20rpx; */
		/* margin-bottom: 20rpx; */

		background-color: #FFFFFF;
		/* background-color: #4CD964; */
		margin-top: 5px;
	}

	.top_text {
		width: calc(100% - 16px);
		height: 30px;
		font-size: 12.5px;
		line-height: 30px;
		color: #767676;
		display: flex;
		flex-direction: row;
		/* align-items: center; */
		justify-content: space-between;
		/* margin-left: 16rpx; */
		padding-left: 8px;
		
		
	}

	.order_info_group {
		width: 100%;
		height: 125px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: rgba(0,0,0,0.03);
	}

	.headPhoto {
		width: 50px;
		height: 50px;
		border-radius: 40px;
		margin-left: 20px;
	}

	.order_info {
		width: calc(100% - 88px);
		height: calc(100% - 20px);
		margin-left: 15px;
		margin-top: 10px;
		margin-bottom: 10px;
		font-size: 12.5px;
		line-height: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #767676;

	}

	.info_first {
		width: 100%;
		height: 25px;
		font-size: 15px;
		color: #000000;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: space-between;
	}

	.name {
		width: calc(50% - 5px);
		height: 100%;
		margin-right: 5px;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.price {
		width: calc(50% - 7.5px);;
		height: 100%;
		font-size: 12.5px;
		color: #fe4235;
		text-align: right;
		margin-right: 5px;
	}

	.info_time {
		width: 100%;
		height: 20px;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-top: 5px;
	}

	.line_horizontal {
		width: 100%;
		height: 1rpx;
		background-color: #eeeeee;
	}

	.bottom_text {
		width: calc(100% - 16px);
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.bottom_text_single {
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.icon {
		width: 30px;
		height: 25px;
		border-radius: 5px;
		margin-top: 7.5px;
		margin-left: 8px;
	}

	.button_group {
		width: auto;
		height:30px;
		line-height: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: end;
		font-size: 15px;
		margin-top: 7.5px;
		color: #767676;
	}

	.delete_button {
		margin-left: 10px;
		margin-right: 10px;
	}

	.evaluation_button {
		color: #007AFF;
		border: 1px solid #007AFF;
		width: auto;
		height: 17.5px;
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
		margin-right: 10px;
		border-radius: 5px;
	}
</style>
