<template>
	<view class="content">
		<view class="top">
		</view> 
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="scroll-item" v-for="(item,index) in list" :key="index">
			<uni-list-item :border="false" :clickable="true" @click="tapItem(item,index)">
				<view slot="body">
					<listItem :value="item"></listItem>
				</view>
			</uni-list-item>

		</uni-list>
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>

<script>
	import listItem from '../self-service/self-service-item.vue' //列表item
	export default {
		components: {
			listItem
		},
		data() {
			return {
				item: {},
				video_title: "心理音乐",
				list: [],				
				currentPage: 0,				
				musicAcachePosition: 0,
				musicAcacheList: [],
				itemIndex: 0,
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}
		},

		mounted() {
			this.getData();
			let _this = this
			uni.$on("collectionStateChange",function(){
				_this.getData()
			})
		},
		
		unmounted() {
			uni.$off("collectionStateChange",{})
		},

		onLoad(option) {
			if (option.item != null) {
				let _this = this;
				let item = JSON.parse(option.item);
				_this.item = item;
				// console.log(item)
			}
		},

		onPullDownRefresh() {
			this.currentPage = 0;
			this.getData();
		},

		onReachBottom() {
			if (this.haveMore) {
				this.getData();
			}

		},

		methods: {

			tapItem: function(item1,index) {
				this.musicAcachePosition = index;
				this.itemIndex = index;
				this.musicAcacheList = this.list;
				let item = this.list[index];
				uni.setStorageSync('musicAcachePosition',this.musicAcachePosition)
				uni.setStorageSync('musicAcacheList',this.musicAcacheList)				
				
				this.navigate.navigateTo({
					url:'../science/science_music_detail?item=' + JSON.stringify(item)
				})				
			},

			getData: function() {
				let _this = this;
				

				// if (!_this.haveMore) {
				// 	uni.showToast({
				// 		title: '没有更多数据了'
				// 	});
				// 	return;
				// }

				// console.log("音乐"+_this.utils.getUserData().UserID);
				this.request.startRequest({
					url: _this.api.PostGetMyFavorite,
					data: {
						'UserID': _this.user.getUserId(),
						'Type': "02",
					},
					showLoading:true
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
						if(_this.list == null || _this.papers.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
				}).catch(reason =>{
					if(_this.list == null || _this.papers.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError					}
					
				})
			},

			loadMore: function() {
				console.log("加载更多111");
				this.getData();
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
	
	}
	.top {
		height: 40px;
	}
	.scroll {
		/* margin-top: 10rpx; */
		width: 100%;
		height: calc(100vh - 40px);
		background-color: rgba(0, 0, 0, 0.03);
	}
	
	.list {
		/*  display: flex;  
	  flex-direction: row; */
		width: 100%;
		height: 100%;
	}
	
	.list-item {
		display: inline-block;
		width: 49.5%;
		/* height: 300rpx; */
		margin-top: 1vw;
		/* font-size: 30rpx; */
	}
	
	.left {
		/* margin-right: 2%; */
	}
	
	.right {
		margin-left: 1vw;
	}
	
	.scroll-item {
		display: flex;
		flex-direction: row;
		width: 100%;
		/* height: 300rpx; */
		background-color: #FFFFFF;
	}
	
	/deep/.uni-list-item__container {
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
