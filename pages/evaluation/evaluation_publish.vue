<!-- 推送测试 -->
<template>
	<view class="content" :style="{'margin-top':top + 44 + 'px'}">	
	<!-- #ifdef H5 -->
		<sknavigate class="navigate" title="发布测试" :showBack="true" :showBackText="true"></sknavigate>
	<!-- #endif -->
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" v-for="(item,index) in List" :key="index">			
			<uni-list-item direction="column">
				<view slot="header" class="group-header">
					<view class="header-back">
						<view class="header-date">{{item.ReleaseDate.slice(0,10)}}</view>
					</view>
					
					<view class="header-them">{{item.Subject}}</view>
				</view>
								
				<view slot="body">
					
					<!-- <view v-for="(cItem,cIndex) in item.List" :key="cIndex+100">						
						<list-item class="scroll-item" :value="cItem"></list-item>
					</view> -->
					<uni-list v-for="(cItem,cIndex) in item.PaperList" :key="cIndex">
						<uni-list-item :clickable="true" @click="tapItem(cItem)">
							<view slot="body">								
								<list-item class="scroll-item" :value="cItem"></list-item>
							</view>
						</uni-list-item>						
					</uni-list>
					
				</view>	
			
				<view slot="footer" class="group-footer">
					{{'有效时间: ' + item.ValidStartDate+'~'+item.ValidEndDate}}
				</view>
			</uni-list-item>
		
		</uni-list>
		
		
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
		
		
	</view>
</template>

<script>
	import listItem from "./evaluation_item.vue"//测评列表item
	export default{
		props:{
			
		},
		components:{
			listItem
		},
		data(){
			return{
				List:[],
				currentPage: 0,
				dataStatus:this.common.DataStatus.NoData,		
				top:0
			}
		},
		onLoad() {
			this.getData()
		},
		onPullDownRefresh() {
			this.getData()
		},
		onReachBottom() {
			this.loadMore()
		},
		mounted() {
			let info = uni.getSystemInfoSync()
			this.top = info.safeArea.top	
			// this.getData()
		},
		methods:{
			tapItem: function(item){		
		
		
			// if(item.IsCanTest == 0){
			// 	if(item.IsTest == 0){
			// 		uni.showToast({
			// 			title:"该发布未开始或已过期，请在发布规定时间内完成测试",
			// 			icon:"none"
			// 		})
			// 	}else{
			// 		uni.showToast({
			// 			title:"您已完成该测试，请不要重复测试",
			// 			icon:"none"
			// 		})
			// 	}
			// 	return
			// }
		
				let info = {
					"publishId":item.PublishID,
					"item":item
				}
				
				// let id = this.utils.createUUID()
				// // this.page_transfer.transfer = {[id]:info}
				// uni.setStorageSync(id,info)
				this.navigate.navigateTo({
					url:'./evaluation_detail',
					data:info
				})						
				
			},
			getData: function(){
				// console.log("123321")
				if(this.user.getLoginState() != true){
					this.dataStatus = this.common.DataStatus.NoData
					uni.stopPullDownRefresh()
					return;
				}
				
				let _this = this;
				
				let userId = this.user.getUserId()		
					this.request.startRequest({
						url:_this.api.GetReleasePaperList,
						data:{"UserID":userId,"pageIndex":"0","pageSize":"5"},
						showLoading:true,						
						
					}).then(res =>{
						if(res.data.Code == 0){
							_this.List = res.data.Data
							// console.log(JSON.stringify(res))
							if(_this.List.length >= 5){
								
								_this.dataStatus = _this.common.DataStatus.Normal
							}else{
							
								if(_this.List.length == 0){
									_this.dataStatus = _this.common.DataStatus.NoData
								}else{
									_this.dataStatus = _this.common.DataStatus.NoMoreData
								}
							}
							
						}else{
							if(_this.List == null || _this.List.length == 0){
								_this.dataStatus = _this.common.DataStatus.LoadError
							}						
							
						}
						
						_this.currentPage = 0;
					})
					.catch(reason =>{
						if(_this.List == null || _this.List.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					})					
			},
			loadMore: function(pageIndex) {
				console.log('加载更多111');
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了'
						});
					}					
					return;
				}
				console.log('加载更多222');
				//获取数据
				if(this.user.getLoginState() != true){
					return;
				}
				let _this = this;
				
				let userId = this.user.getUserId()
				
				
				this.currentPage+=1
				// console.log(getApp().globalData.defaultUser);
				this.request.startRequest({
					url:_this.api.GetReleasePaperList,
					data:{
						"UserID":userId,"pageSize":"5","pageIndex":(_this.currentPage).toString()
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						let newPapers = res.data.Data;
						if(newPapers == null){
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.List = _this.List.concat(newPapers);
							if(newPapers.length < 5){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}					
						
					}
				}).catch(res =>{
					
				})			
			},
		}
	}
</script>

<style>
	
	.content{
		width: 100%;
		height: 100%;
		background-color:rgba(0,0,0,.03);
		margin-top: 40px;
	}	
	
	.header-back{
		display: flex;
		width: 100vw;
		height: 60px;		
		background-color:rgba(0,0,0,.03);
		align-items: center;
		justify-content: center;
		margin-top: 5px;
		/* background-color: #08B6F2; */
		margin-left: 0px;
		
	}
	.header-date{
		width: 80px;
		height: 17.5px;
		background-color: rgba(0,0,0,.2);
		text-align: center;
		font-size: 14px;
		line-height: 17.5px;
		border-radius: 2.5px;
		/* margin-left: 25px; */
		margin-top: 20px;
		color: #FFFFFF;
	}
	.header-them{
		width: 100%;
		height: 30px;
		line-height: 30px;
		padding-left: 8px;
		background-color: #FFFFFF;
		border-width: .5px;
		border-color: #CCCCCC;
		border-style: none none solid none;
		font-size: 15px;
	}
	.group-footer{
		width: 100%;
		height: 30px;
		line-height: 30px;
		padding-left: 8px;
		background-color: #FFFFFF;
		color:#666666;
		font-size: 13px;
	}
	.scroll-item {
		display: flex;
		margin-top: 0px;
		flex-direction: row;
		width: 100%;
		height: 150px;
		background-color: #ffffff;
		border-width: .5px;
		border-color: #EEEEEE;
		/* border-style: none none solid none; */
		/* padding: 0rpx 0rpx 0rpx 0rpx; */
		
	}
	

	/deep/.uni-list-item__container{
		padding: 0px 0px 0px 0px !important;
	}
</style>
