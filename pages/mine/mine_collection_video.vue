<template>
	<view>
		<view class="top">	</view>
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="scroll-item" v-for="(item,index) in list" :key="index">
			<uni-list-item :border="false" :clickable="true" @click="tapItem(item)">
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
	import utils from '../../common/utils.js'
	export default {
		components: {
			listItem
		},
		data() {
			return {
				item: {},
				video_title: "心理视频",
				list: [],				
				currentPage: 0,				
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
				// sssconsole.log(item)
			}
		},

		onPullDownRefresh() {
			this.currentPage =0;
			this.force = true
			this.getData();
		},

		onReachBottom() {		
			uni.showToast({
				title:"没有更多数据了...",
				icon:"none"
			})

		},

		methods: {

			tapItem: function(item) {
			let _this = this
				let info = {
					"item":item
				}
				// let id = this.utils.createUUID()
				// uni.setStorageSync(id,info)
				_this.navigate.navigateTo({
					url: '../science/science_video_detail',
					data:info
				})				
			},

			getData: function(pageIndex) {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostGetMyFavorite,
					data: {
						'UserID': _this.user.getUserId(),
						'Type': "03",
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
