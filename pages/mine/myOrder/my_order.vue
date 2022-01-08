<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="我的预约"></sknavigate>
		<!-- #endif -->
		<view class="top_bar">
			<view v-for="(item,index) in values" :key=index :class="[curr==index?'top_bar_item_line':'top_bar_item']" :data-index= index @click="setCurr">{{values[index]}}</view>
		</view>
		<swiper class="swiper_group"  :style="sheight[curr]" :current="curr" @change="setCurr" :circular="false">
			<swiper-item v-for="(item,index) in values" :key = "index">
				<uni-list v-show="dataStatus[index] == common.DataStatus.Normal || dataStatus[index] == common.DataStatus.NoMoreData" class="scroll_list" style="height:100%">				
						<uni-list-item v-for="(it,idx) in list[index]" :key="idx" direction="column" :clickable="true">
							<myOrderItem slot="body" :value="it" class="forVItem" @itemChange="buttonClick">
							</myOrderItem>
						</uni-list-item>					
				</uni-list>
				<view v-show="dataStatus[curr] != common.DataStatus.Unload && dataStatus[curr] != common.DataStatus.Normal">
					<emptyStatus style="z-index: 100;" :emptyType = dataStatus[curr] @refresh="curr == 0?getData():getOrderData()"></emptyStatus>
				</view>
			</swiper-item>			
		</swiper>
		
		<uni-popup ref="popup" type="center" :maskClick="true" @change="popupChange">
			<view class="dialog_content">
				<view class="dialog_title">{{dialoggroup[0]}}</view>
				<view class="line_horizontal"></view>
				<scroll-view v-show="dialoggroup[4]" class="dialog_main">{{dialoggroup[1]}}</scroll-view>
				<scroll-view v-show="dialoggroup[2]" class="dialog_main">
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
				<scroll-view v-show="dialoggroup[3]" class="dialog_main">
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
				<view class="button_group">
					<view class="button_left" @click="clickDialog(false)">取消</view>
					<view class="line_vertical"></view>
					<view class="button_right" @click="clickDialog(true)">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import myOrderItem from './my_order_item.vue';
	export default {
		components: {
			myOrderItem,
		},
		data() {
			return {
				values:['全部','预约中','已预约','已完成','已关闭'],
				sheight: ["height: calc(100% - 120rpx);", "height: calc(100% - 120rpx);", "height: calc(100% - 120rpx);",
					"height: calc(100% - 120rpx);", "height: calc(100% - 120rpx);"
				],
				defaultImage: ["", "", "", "", ""],
				isEmpty: [false, false, false, false, false],
				dataStatus:[0,0,0,0,0],
				holderText: ["", "", "", "", ""],
				curr: 0,
				pageIndex: [0,0,0,0,0],				
				// allData: [],
				// listData0: [],
				// listData1: [],
				// listData2: [],
				// listData3: [],
				list:[[],[],[],[],[]],
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
				type: '',
				changerOrderPara: {
					"AppointInfoID": "",
					"CancelOp": "",
					"StatusReason": "",
					"IsNeedPrice": "",
					"Out_trade_no": ""
				},
				dialoggroup: ["title", "contentText", false, true, false],
				//[标题,提示文本内容,取消订单,申请取消订单,文字提示]
			}
		},
	
		onLoad() {
			uni.setNavigationBarTitle({
				title: '我的预约'
			});
			this.getAllOrderData();
		},
		onShow() {
			let index = uni.getStorageSync("appointmentIndex")
			if(index){
				this.curr = index
			}
			if (this.curr == 0) {
				this.getAllOrderData();
			} else {
				this.getOrderData(this.curr - 1);
			}
		},
		methods: {
			setCurr(e) {				
				let thisCurr = e.detail.current || e.currentTarget.dataset.index || 0;				
				this.curr = thisCurr;
				if (thisCurr == 0) {
					let all = this.list[0]
					if(all == null || all == undefined || all.length ==0){
						this.getAllOrderData();
					}					
				} else {
					let single = this.list[thisCurr]
					if(single == null || single == undefined || single.length ==0){
						this.getOrderData(thisCurr - 1);
					}
					
				}
				// #ifdef H5
					uni.setStorageSync("appointmentIndex",thisCurr)
				// #endif
			},
			getAllOrderData: function() {
				let _this = this;
				uni.getNetworkType({
					fail() {
						_this.dataStatus.splice(0,1,_this.common.DataStatus.NetworkError)
						
						return;
					}
				})
				this.request.startRequest({
					url: _this.api.PostMyConsultOrderForBCDoctor,
					data: {
						"UserID": _this.user.getUserId(),
						"PageCount": "10",
						"PageIndex": '0'
					},
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						let newData = res.data.Data;	
						if(newData.length >= 10){							
							_this.dataStatus.splice(0,1,_this.common.DataStatus.Normal)
						}else{						
							if(newData.length == 0){
								_this.dataStatus.splice(0,1,_this.common.DataStatus.NoData)
							}else{
								_this.dataStatus.splice(0,1,_this.common.DataStatus.NoMoreData)
							}
						}
						_this.sheight[0] = "height:" + (newData.length == 0 ? "calc(100% - 10rpx);" : ((
							newData.length * 390 + 120) + "rpx;"));
						_this.pageIndex.splice(0,1,0)
						_this.list.splice(0,1,newData)
					}else{
						if(_this.list[0] == null || _this.list[0].length == 0){
							_this.dataStatus.splice(0,1,_this.common.DataStatus.LoadError)
						}
					}
				}).catch(reason =>{
					if(_this.list[0] == null || _this.list[0].length == 0){
						_this.dataStatus.splice(0,1,_this.common.DataStatus.LoadError)
					}
				})
				
			},
			loadAllMore: function() {
				let _this = this;
				
				if(this.dataStatus[0] != this.common.DataStatus.Normal){
					if(this.dataStatus[0] == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了',
							icon:"none"
						});
					}					
					return;
				}
				let index = this.pageIndex[0]
				index +=1;
				this.pageIndex.splice(0,1,index)
				this.request.startRequest({
					url: _this.api.PostMyConsultOrderForBCDoctor,
					data: {
						"UserID": _this.user.getUserId(),
						"PageCount": "10",
						"PageIndex": index.toString()
					},
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						let newList = res.data.Data;	
						let old = _this.list[0]
						if(newList == null){								
							_this.dataStatus.splice(0,1,_this.common.DataStatus.NoMoreData)
						}else{
							old = old.concat(newList);
							if(newList.length < 10){									
								_this.dataStatus.splice(0,1,_this.common.DataStatus.NoMoreData)
							}else{									
								_this.dataStatus.splice(0,1,_this.common.DataStatus.Normal)
							}
							_this.list.splice(0,1,old)
							_this.sheight[0] = "height:" + (old.length * 390 + 120) + "rpx;";
						}											
					}
				}).catch(reson =>{
					
				})
				
			},
			getOrderData: function() {
				let _this = this;
				let num = this.curr-1
				uni.getNetworkType({
					fail() {						
						_this.dataStatus.splice(this.curr,1,_this.common.DataStatus.NetworkError)
						return;
					}
				})
				
				this.request.startRequest({
					url: _this.api.PostMyConsultOrderForBCDoctor,
					data: {
						"UserID": _this.user.getUserId(),
						"PageCount": "10",
						"PageIndex": "0",
						"Query": num
					},
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						let newdata = res.data.Data;							
						if(newdata.length >= 10){							
							_this.dataStatus.splice(num+1,1,_this.common.DataStatus.Normal)
						}else{						
							if(newdata.length == 0){
								_this.dataStatus.splice(num+1,1,_this.common.DataStatus.NoData)
							}else{
								_this.dataStatus.splice(num+1,1,_this.common.DataStatus.NoMoreData)
							}
						}
						_this.sheight[num+1] = "height:" + (newdata.length == 0 ? "calc(100% - 10rpx);" : ((
							newdata.length * 390 + 120) + "rpx;"));
						_this.pageIndex.splice(num+1,1,0)												
						_this.list.splice(num+1,1,newdata)
					}else{
						if(_this.list[num+1] == null || _this.list[num+1].length == 0){
							_this.dataStatus.splice(num+1,1,_this.common.DataStatus.LoadError)
						}
					}
				}).catch(reson =>{
					if(_this.list[num+1] == null || _this.list[num+1].length == 0){
						_this.dataStatus.splice(num+1,1,_this.common.DataStatus.LoadError)
					}
				})				
			
			},
			loadOrderMore: function() {
				let _this = this;
				let num = this.curr-1
				if(this.dataStatus[this.curr] != this.common.DataStatus.Normal){
					if(this.dataStatus[this.curr] == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了'
						});
					}				
					return;
				}
				let index = this.pageIndex[num+1]
				index +=1;
				this.pageIndex.splice(num+1,1,index)
				this.request.startRequest({
					url: _this.api.PostMyConsultOrderForBCDoctor,
					data: {
						"UserID": _this.user.getUserId(),
						"PageCount": "10",
						"PageIndex": index.toString(),
						"Query": num
					},
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						let newList = res.data.Data;	
						let old = _this.list[num+1]
						if(newList == null){								
							_this.dataStatus.splice(num+1,1,_this.common.DataStatus.NoMoreData)
						}else{
							old = old.concat(newList);
							if(newList.length < 10){									
								_this.dataStatus.splice(num+1,1,_this.common.DataStatus.NoMoreData)
							}else{									
								_this.dataStatus.splice(num+1,1,_this.common.DataStatus.Normal)
							}
							_this.list.splice(num+1,1,old)
							_this.sheight[num+1] = "height:" + (old.length * 390 + 120) + "rpx;";
						}											
					}
				}).catch(reson =>{
					
				})			
			},
		
			buttonClick: function(da) {
				let _this = this;
				console.log(da.CancelOp);
				_this.changerOrderPara = da;
				switch (da.CancelOp) {
					case "PC": {
						_this.dialoggroup = ['取消原因', '', true, false, false];
						_this.$refs.popup.open();
						break;
					}
					case "CE": {
						_this.dialoggroup = ['确认提示', '您确定当前咨询已经完成', false, false, true];
						_this.$refs.popup.open();
						break;
					}
					case "PAC": {
						_this.dialoggroup = ['取消原因', '', false, true, false];
						_this.$refs.popup.open();
						break;
					}
					case "DEL": {
						_this.dialoggroup = ['删除提示', '您确定要删除此订单吗？', false, false, true];
						_this.$refs.popup.open();
						break;
					}
					case "CANCELREASON": {
						uni.showToast({
							title: da.StatusReason,
							icon: 'none',
							duration: 1500
						})
						break;
					}
					case "ORDERAGAIN": {
						let info = {
							'publish': '0',
							'item': da
						};
						// let id = _this.utils.createUUID();
						try {
							// uni.setStorageSync(id, info);
							_this.navigate.navigateTo({
								url: '../../consult/consult_detail',
								data:info
							})							
						} catch (e) {
							console.log(e.message)
						}
						break;
					}
					case "EVALUATE": {
						let info = {
							'publish': '0',
							'item': da
						}
						let id = _this.utils.createUUID();
						try {
							uni.setStorageSync(id, info);
							_this.navigate.navigateTo({
								url: './submit_comments?id=' + id
							})
							
						} catch (e) {
							console.log(e.message)
						}
						break;
					}
					case "PAY": { //付款
						break;
					}
				}
			},
			changeOrder: function(para) { //修改我的咨询订单
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostModifyMyConsultOrderForBCDoctor,
					data: para,
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						let text = para.CancelOp == "PC" ? "取消订单成功" : (para.CancelOp == "CE" ? "咨询已完成" :
							"已提交申请")
						uni.showToast({
							title: text,
							icon: 'none',
							duration: 1500
						});
						_this.getData();
					} else {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(reason =>{
					
				})				
			},
			delOrder: function(orderID) {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostDelMyConsultOrder,
					data: [{
						"AppointInfoID": orderID
					}],
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						uni.showToast({
							title: "订单删除成功",
							icon: 'none',
							duration: 1500
						})
						_this.getData()
					}
				}).catch(reason =>{
					
				})				
			},
			reasonChange: function(e) {
				this.changerOrderPara.StatusReason = e.detail.value;
			},
			popupChange: function(e) {
				if (!e.show) {
					this.changerOrderPara.StatusReason = "";
				}
			},
			clickDialog: function(c) {
				let _this = this;
				if (c) {
					if (_this.changerOrderPara.CancelOp == "DEL") _this.delOrder(_this.changerOrderPara.AppointInfoID);
					else _this.changeOrder(_this.changerOrderPara);
				} else {
					_this.changerOrderPara.StatusReason = "";
				}
				_this.$refs.popup.close();
			},

			tapItem: function(item) {
				let _this = this
				let info = {					
					"item": item
				}
				let id = this.utils.createUUID();
				try {
					uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: './my_order_detail?id=' + id
					})					
				} catch (e) {
					console.log(e.message)
				}
			},
			onPullDownRefresh: function() {
				this.getData()
			},
			getData(){
				if(this.curr == 0){
					this.getAllOrderData()
				}else{
					this.getOrderData()
				}
			},
			/**
			 * 上拉加载更多
			 */
			onReachBottom() {							
				if(this.curr == 0){
					this.loadAllMore()
				}else{
					this.loadOrderMore()
				}
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: calc(100vh - var(--window-top));
		background-color: #FFFFFF;
		/* #ifdef H5 */
			margin-top: 80px;
		/* #endif */
		
	}

	.top_bar {
		height: 40px;
		width: 100%;
		transform: translateZ(0);
		position: fixed;
		top: var(--window-top);
		z-index: 3;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* #ifdef H5 */
			margin-top: 44px;
		/* #endif */
	}

	.top_bar_item_line {
		width: 20%;
		height: 80%;
		border-bottom: 2.5px solid #08B6F2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 2.5px;
		font-size: 15px;
		color: #55aaff;
	}

	.top_bar_item {
		width: 20%;
		height: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 2.5px;
		font-size: 15px;
		color: #767676;
	}

	.swiper_group {
		width: 100%;
		height: auto;
		min-height: 100%;
		margin-top: 60px;
		display: block;
		background-color: #f1f1f1;
	}

	.scroll_list {
		width: 100%;
		height: auto;
		background-color: #e5e5e5;
		/* background-color: #ffaaff; */
	}

	.forV {
		width: 100%;
		height: auto;
	}

	.forVItem {
		width: 100%;
		height: auto;
		background-color: #FFFFFF;
	}

	.line_horizontal {
		width: 100%;
		height: .5px;
		background-color: #d3d3d3;
		margin-bottom: 5px;
	}

	.line_vertical {
		height: calc(100% - 5px);
		width: 1rpx;
		margin-top: 2.5px;
		margin-bottom: 2.5px;
		background-color: #d3d3d3;
	}

	.dialog_content {
		width: calc(80vw - 0rpx);
		height: auto;
		max-height: 60vh;
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
		padding-top: 25px;
		padding-bottom: 7.5px;
	}

	.dialog_main {
		width: calc(100% - 10px);
		height: auto;
		max-height: 70vh;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		padding-left: 5px;
		padding-right: 5px;
		text-align: center;
		font-size: 15px;
		color: #000000;
	}

	.button_group {
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
		width: calc(50% - 1px);
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

	.empty {
		width: 100%;
		height: calc(100vh - var(--window-top) - 300px);
		font-size: 15px;
		color: #b9b9b9;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 15px;
		background-color: #e5e5e5;
	}
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
