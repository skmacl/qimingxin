<template>
	<view class="content">	
			<uni-list v-show="dataStatus == 1 || dataStatus == 5" v-for="(item,index) in papers" :key = "index">
				<uni-list-item v-show="s_evaluation == false" direction="column" :clickable="true">
					<view slot="header" @click="applyRefund(item)">
						<view class="item-state">
							<view class="state">{{getPayState(item)}}</view>
							<view class="control" v-show="item.PayType == 1 &&item.State == 1 && item.Out_trade_no.length > 0">申请退款</view>
						</view>	
					</view>
					<view slot="body"  @click="tapItem(item)">
											
						<listItem :value="item"></listItem>	
					</view>					
				</uni-list-item>	
				<uni-list-item  v-show="s_evaluation == true" :clickable="true">					
					<view slot="body"  @click="tapItem(item)">											
						<listItem :value="item"></listItem>	
					</view>					
				</uni-list-item>
			</uni-list>
			<view v-show="dataStatus != 0 && dataStatus != 1">
				<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
			</view>
			<uni-popup ref="popup" type="center">
				<view class="pop-back">
					<view class="reson-title">退款原因</view>
					<!-- <input type="text" value=""  class="input-item" maxlength="50"/> -->
					<textarea v-model="reason" placeholder="" class="input-item" maxlength="50"/>
					<view class="pop-bottom">
						<button type="default" class="button" v-on:click="refundCancel()">取消</button>
						<button type="default" class="button" v-on:click="refundSure()">确定</button>
					</view>
				</view>				
				
			</uni-popup>
	</view>
</template>

<script>
	import listItem from "../evaluation/evaluation_item.vue"//测评列表item
	export default{
		components:{
		listItem	
		},
		data(){
			return{
				papers:[],				
				currentPage:0,
				dataStatus:this.common.DataStatus.Unload,
				reason:"",
				selectItem:{},
				s_evaluation:false
			}
			
		},
		onLoad() {
			
		},
		mounted() {
			this.s_evaluation = this.config.s_evaluation
			this.getData()
			let _this = this
			uni.$on('paperFinish',function(){
				_this.getData()
			})
		},
		unmounted() {
			uni.$off('paperFinish')
		},
		methods:{
			refundCancel:function(){
				this.$refs.popup.close()
			},
			refundSure:function(){
				let _this = this
				let otn = this.selectItem.Out_trade_no
				let data = {
					"out_trade_no":otn,
					"refund_desc":this.reason, 
					"UserID":this.user.getUserId(),
					"ObjectID":this.selectItem.PaperID,
					"PublishID":this.selectItem.PublishID
				}
				this.request.startRequest({
					url:this.api.PostBackstageRefundOrder,
					data:data,
					showLoding:true
				}).then(res =>{
					if(res.data.Code == 0){
						this.$refs.popup.close()
						_this.getData()
					}else{
						uni.showToast({
							title:res.data.Message,
							icon:"none"
						})
					}
					// console.log(JSON.stringify(res.data))
				}).catch(reason =>{
					uni.showToast({
						title:"系统错误，请稍后再试"
					})
					
				})
				console.log(this.reason)
				
			},
			
			 applyRefund:function(item){
				 let _this = this
				if(item.PayType == 1 && item.State == 1){
					this.selectItem = item
					this.$refs.popup.open()
				}
			},
			getPayState:function(item){
				if(item.PayType == 1){//微信支付
					switch(parseInt(item.State)){
						case 0:{
							return "待付款"
						}break;
						case 1:{
							return "已付款"
						}break;
						case 2:{
							return "已完成"
						}break;
						case 3:{
							return "已失效"
						}break;
						case 4:{
							return "测试过期"
						}break;
						case 5:{
							return "退款审核中"
						}break;
						case 6:{
							return "退款中"
						}break;
						case 7:{
							return "退款被拒绝"
						}break;
						case 7:{
							return "已退款"
						}break;
						case 9:{
							return "已关闭"
						}break;
						case 10:{
							return "退款失败"
						}break;	
						default: return "状态异常"
					}
				}
			},
			tapItem: function(item){
				let _this = this
				let info = {
					"publishId":'0',
					"item":item
				}
				
				// let id = this.utils.createUUID()
				try {
					// uni.setStorageSync(id,info)
					_this.navigate.navigateTo({
						url:'../evaluation/evaluation_detail',
						data:info
					})					
				} catch (e){
					console.log(e)
				}				
			},
			//获取数据
			getData: function(){
				return
				if(this.user.getLoginState() == true){
					this.userInfo = this.user.getUserData()
				}
				let _this = this;
				
				let userId = this.user.getUserId()
				this.request.startRequest({
					url:_this.api.PostPaperReportTmpList,
					data: {
						'UserID':userId,
						'PageCount':'10',
						'PageIndex':'0',
						'Version' : _this.user.getVersion()
						},
						showLoading:true,
				}).then(res =>{
					if(res.data.Code == 0){
						_this.papers = res.data.Data;	
						console.log(JSON.stringify(_this.papers))
						if(_this.papers.length == 10){								
							_this.dataStatus = _this.common.DataStatus.Normal
						}else{							
							if(_this.papers.length == 0){
									_this.dataStatus = _this.common.DataStatus.NoData
								}else{
									_this.dataStatus = _this.common.DataStatus.NoMoreData
								}
							}
						_this.currentPage = 0;
					}else{
						if(_this.papers == null || _this.papers.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
					
				}).catch(reason =>{
					if(_this.papers == null || _this.papers.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})				
			},
			loadMore:function(){					
				
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了'
						});
					}					
					return;
				}
				let _this = this
				//获取数据					
				if(this.user.getLoginState() == true){
					this.userInfo = this.user.getUserData()
				}
				_this.currentPage+=1;							
				
				let userId = this.user.getUserId()
				
				this.request.startRequest({
					url:_this.api.PostPaperReportTmpList,
					data: {
						'UserID':userId,
						'PageCount':'10',
						'PageIndex':pageIndex.toString(),
						'Version' : '1'
					},
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data;	
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.papers = _this.papers.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}
						console.log(_this.papers.length);
						
					}
					
				}).catch(reson =>{
					
				})				
			}						
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;	
		/* #ifdef APP-PLUS */
			margin-top: 44px;
		/* #endif */
		/* #ifdef H5 */
		margin-top: 84px;
		/* #endif */
	}
	.item-state{
		display: flex;
		flex-direction: row;
		height: 35px;		
		width: 100%;
		border-style: none none solid none;
		border-color: #EEEEEE;
		border-width: .5px;
	}
	.state{
		width: 50%;
		height: 35px;
		line-height: 35px;
		font-size: 14px;
		padding-left: 10px;
		color: #666666;
	}
	.control{
		height: 35px;
		line-height: 35px;
		color: #FF0000;
		font-size: 14px;
		text-align: right;
		padding-right: 20px;
		width: 50%;
		border-style: none none solid none;
		border-color: #EEEEEE;
		border-width: .5px;
	}
	
	.pop-back{
		width: 260px;
		height: 200px;
		max-width: 500px;
		background-color: #FFFFFF;
		border-radius: 5px;
	}
	.reson-title{
		width: 100%;
		height: 20px;
		line-height: 20px;
		text-align: center;
		padding-top: 5px;
		border-style: none none solid none;
		 border-width: .5px;
		 border-color: #EEEEEE;
		 padding-bottom: 5px;
	}
	.input-item{
		width: 80%;
		margin-left: 10%;
		height: 50px;
		background-color: #EEEEEE;
		margin-top: 30px;
		padding: 2px;
		font-size: 14px;
		color: #666666;
	}
	.pop-bottom{
		margin-top: 20px;
		display: flex;
		flex-direction: row;
	}
	.button{
		height: 35px;
		line-height: 35px;
		width: 30%;
		background-color: #3399FF;
		color: #FFFFFF;
	}
	
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}

</style>
