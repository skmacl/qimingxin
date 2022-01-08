<template>
	<view class="content">
		<uni-list  :border="false"  v-for="(item,index) in list" :key="index">
			<uni-list-item :clickable="true" @click="itemTap(item)">
				<view slot="header" class="list-item">
					<image class="img" :src="item.MorningPicture" mode="widthFix" :draggable="false"></image>
				</view>
			</uni-list-item>			
		</uni-list>
		<view>
			<uni-popup ref="dailyDialog" type="dialog" :maskClick="true">
				<scroll-view class="daily" scroll-y="true">
					<image class="daily-img" :src="tapItem.MorningPicture" mode="widthFix"></image>
					<view class="daily-info">{{tapItem.MorningAnalysis}}</view>
				</scroll-view>
			
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[],
				force:false,
				currentPage:0,
				dataStatus:this.common.DataStatus.Unload,
				tap:false,
				tapItem:{}
			}
		},
		onLoad() {
			this.getData()
		},
		onUnload() {
			
		},
		onShow() {
			
		},
		methods:{
			itemTap:function(item){
				this.tapItem = item
				this.$refs.dailyDialog.open()					
			},
			getData:function(){
				let _this = this
				
				this.request.startRequest({
					url:this.api.PostMorningList,
					data:{
						"PageCount":"10",
						"PageIndex":"0"
					},
					showLoading:true,
					force:_this.force,
					storage:600
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
				}).catch(reason =>{
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})
			},
			loadMore:function(){
				let _this = this
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了',
							icon:"none"
						});
					}					
					return;
				}			
				
				let userId = this.user.getUserId()
				// console.log(getApp().globalData.defaultUser);
				this.currentPage+=1;
				
				this.request.startRequest({
					url:this.api.PostMorningList,
					data:{
						"PageCount":"10",
						"PageIndex":_this.currentPage.toString()
					}					
				}).then(res =>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data;	
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
						
					}
					// _this.changeHeight()
				}).catch(reson =>{
					
				})
			}
		},
		onPullDownRefresh() {
			this.force = true
			this.getData()
		},
		onReachBottom() {
			this.loadMore()
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
	}
	.list-item{
		width: 100%;
		margin-top: 5px;
	}
	.img{
		width: 100%;	
	
	}
	
	.daily{
		width: 80vw; 
		max-width: 225px;
		height: 60vh;
		border-radius: 7.5px; 
		background-color: #fff;
		max-width: 80vw;
		max-height: 60vh;
	}
	.daily-img{
		width: 100%;
		border-radius: 7.5px;
	}
	.daily-info{
		font-size: 13px;
		height: calc(100% - 16px);
		width: calc(100% - 6px);
		color: #6e6e6e;
		padding: 5px 5px 5px 5px;
	}
	/deep/.uni-list-item__container{
		padding: 0px 0px 0px 0px !important;
	}
</style>
