<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate"></sknavigate>
		<!-- #endif -->
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="section" v-for="(item,index) in list" :key="index">
			<uni-list-chat :title="item.MessageNM" avatar="../../static/img/mine/icon_n_nofication.png"
				:note="item.Remark" :time="item.CreatedDate" badge-positon="left" :avatarCircle="true"
				:badge-text="isClick" :clickable="true" @click="tapItem(item)">
			</uni-list-chat>
		</uni-list>
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>

<script>
	import utils from "../../common/utils.js"
	export default {
		data() {
			return {
				list: [],			
				currentPage: 0,				
				isClick: "",				
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}

		},
		onLoad() {

		},
		mounted() {
			this.getData()
		},

		onPullDownRefresh() {
			this.force = true
			this.getData()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			tapItem: function(item) {
				uni.showModal({
					title:item.MessageNM,
					content:item.Remark,
					showCancel:false
				})

			},
			//获取数据
			getData: function() {
				
				if(this.user.getLoginState() == true){
					this.userInfo = this.user.getUserData()
				}
				let _this = this;
				
				let userId = this.user.getUserId()
				this.request.startRequest({
					url:_this.api.PostMessage,
					data: {
						'UserID': userId,
						'PageCount': '10',
						'PageIndex': '0',
					},
					showLoading:true,
					storage:60,
					force:_this.force
				}).then(res =>{
					if(res.data.Code == 0){
						_this.list = res.data.Data;	
						if(_this.list.length >= 10){
							
							_this.dataStatus = _this.common.DataStatus.Normal
						}else{
						
							if(_this.list.length == 0){
								_this.dataStatus = _this.common.DataStatus.NoData
							}else{
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}
						}
						_this.currentPage = 0;
					}else{
						if(_this.list == null || _this.list.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}				
					
				
				}).catch(reson =>{
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}					
				})						
			},
			loadMore: function() {
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了',
							icon:"none"
						});
					}					
					return;
				}			
				let _this = this
				let userId = this.user.getUserId()
				// console.log(getApp().globalData.defaultUser);
				this.currentPage+=1;
				
				this.request.startRequest({
					url:_this.api.PostPaperReportListByConfig,
					data: {
						'UserID': this.user.getUserId(),
						'PageCount': '10',
						'PageIndex': _this.currentPage.toString(),
					},
					// showLoading:true,
					// force:_this.force
				}).then(res =>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data;	
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.list = _this.plist.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}					
						
					}					
				}).catch(reson =>{
					
				})
			},

		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		/* background-color: #4CD964; */
	}

	.section-header {
		margin-top: 5px;
		width: 100%;
		height: 40px;
		background-color: #FFFFFF;
		line-height: 40px;
		padding-left: 10px;
		font-size: 13px;
		border-style: none none solid none;
		border-width: .25px;
		border-color: #EEEEEE;
	}

	.section-footer {
		margin-top: 5px;
		width: 100%;
		height: 5px;
		background-color: rgba(0, 0, 0, .03);
	}

	.section-title {
		position: absolute;
		margin-left: 16px;
		height: 18px;
		margin-top: 5px;

	}

	.scroll {
		/* margin-top: 10rpx; */
		width: 100%;
		height: calc(100vh - 50px);
		background-color: rgba(0, 0, 0, 0.03);
	}

	.section {
		background-color: #FFFFFF;
	}

	.item {
		margin-top: 5px;
		padding-bottom: 5px;
	}

	.scroll-item {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 150px;
		background-color: #FFFFFF;
	}
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
	
</style>
