<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate"></sknavigate>
		<!-- #endif -->
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" v-for="(item,index) in list" :key = "index">
			<uni-list-item class="item" :clickable="true" v-on:click="itemClick(item)">
				<view slot = "header">
					<image class="item-img" :src="item.InfoCover" mode="aspectFill"></image>
				</view>
				<view slot = "body" class="item-info">
					<view class="item-title font-size-title">{{item.InfoTitle}}</view>
					<view class="item-date">{{item.CreatedDate.slice(0,10)}}</view>
				</view>
			</uni-list-item>
			
		</uni-list>
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				currentPage:0,
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}
		},
		onLoad() {
			this.getData()
		},
		onPullDownRefresh() {
			this.force = true,
			this.getData()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			getItemTypes: function(types) {
				return types.split(',')
			},
			getCreateTime: function(time) {
				return time.split(' ')[0]
			},
			itemClick: function(item) {
				this.navigate.navigateTo({
					url: "../../../components/webCommonView/webCommonView?url=" + item.InfoOrigin + "&title=" + item.InfoTitle
				})				
			},
			getData: function() {
				let _this = this
				
				this.request.startRequest({
					url: _this.api.PostInfoForXDT,
					data: {
						'PageCount': '10',
						'PageIndex': '0'
					},
					showLoading:true,
					storage:600,
					force:_this.force
				}).then(res =>{
					if(res.data.Code == 0){
						_this.list = res.data.Data[0].Info;	
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
					console.log(_this.list.length)
					
					// _this.changeHeight()
					_this.force = true
				}).catch(reason =>{
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
					_this.force = true
				})									
			},
			loadMore: function(){
				console.log("加载更多111");
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
					url: _this.api.PostInfoForXDT,
					data: {
						'PageCount': '10',
						'PageIndex': this.currentPage.toString()
					},
					// showLoading:true,
					storage:600,
					force:_this.force				
				}).then(res =>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data[0].Info;	
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.list = _this.list.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}
						console.log(_this.papers.length);
						
					}
					// _this.changeHeight()
				}).catch(reson =>{
					
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}
	.item{
		width: 100%;
		height: 100px;
	}
	.item-img{
		border-radius: 4px;
		margin-top: 7.5px;
		margin-left: 10px;
		width: 112px;
		height: 84px;
	}
	.item-info{
		margin-left: 8px;
		margin-right: 8px;
		width: calc(100% - 128px);
		
	}
	.item-title{
		width: 100%;
	}
	.item-date{		
		width: 100%;	
		text-align: right;
		font-size: 12px;
		opacity: .6;
		/* top: 200rpx; */
		position: absolute;
		bottom: 5px;
		right: 5px;
	}
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
	
</style>
