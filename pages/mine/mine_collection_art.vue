<template>
	<view class="content">
		<view class="top">

		</view>
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="scroll-item" v-for="(item,index) in list" :key="index">
			<uni-list-item :border="false" :clickable="true" @click="tapItem(item)">
				<template slot="body">
					<listItem :value="item"></listItem>
				</template>
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
				video_title: "心理文章",
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
		methods: {

			tapItem: function(item) {
				let info = {
					"item":item
				}
				// let id = this.utils.createUUID()
				// uni.setStorageSync(id,info)
				this.navigate.navigateTo({
					url: '../science/science_art_detail',
					data:info
				})				
			},

			getData: function() {
				let _this = this;						

				/**
				 * 173.获取我的收藏（自助）
				 *
				 * @param UserID
				 * @param Type   类别
				 *               00 心理文章 0001 图片新闻
				 *               01 心理图片 02 心理音乐 03 心理视频
				 *               11 测评
				 *               12 咨询师
				 * @return 获取自助收藏和测评、咨询师返回字段不同
				 */
				// console.log(getApp().globalData.defaultUser);
				this.request.startRequest({
					url: _this.api.PostGetMyFavorite,
					data: {
						'UserID': _this.user.getUserId(),
						'Type': "0001",
						
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

	.scroll-item {
		display: flex;
		flex-direction: row;
		width: 100%;
		/* height: 300rpx; */
		background-color: #FFFFFF;
	}
sss
	/deep/.uni-list-item__container {
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
