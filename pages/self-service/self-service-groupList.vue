
<template>
	<view class="content">
		<!-- #ifdef H5 -->
		<sknavigate class="navigate" :title="title"></sknavigate>
		<!-- #endif -->
		<view class="topImg" style="background-image: url(item.ItemCover);">
			<view class="group-name">{{item.ItemName}}</view>
		</view>

		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="scroll-item" v-for="(item,index) in list"
			:key="index">
			<uni-list-item class="list-item" :border="false" :clickable="true" @click="itemClick(item,index)">
				<view class="list-item" slot="body">							
					<view class="a-left">
						<view class="a-top">{{item.MaterialName}}</view>
						<view class="a-bottom">阅读量{{item.Hits}}  点赞量{{item.Thumbs}}</view>
					</view>
					<image class="a-img" src="https://www.bcxl.cn:9224/CMS/Material/ItemMng/ItemPicture/636344249389215164.jpg" mode="scaleToFill"></image>
					
				</view>
			</uni-list-item>
		</uni-list>
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType=dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				video_title: '',
				icon: "https://www.bcxl.cn:9224/CMS/Material/ItemMng/ItemPicture/636344249389215164.jpg",
				list: [],
				type: '',
				item:{},
				title:'11',
				dataStatus:1,//this.common.DataStatus.Unload,
				force:false
			}
		},
	
		onPullDownRefresh() {
			this.getData();
		},
		
		onLoad(option) {
			// #ifdef H5
			if (option) {
				let _this = this;
				this.type = option.type;
				this.item.ItemID = option.itemID
				this.getData();
				// console.log(item)
			} else {
				this.dataStatus = this.common.DataStatus.LoadError
			}
			// #endif
			// #ifndef H5
			if (option.data) {
				let info = JSON.parse(option.data)
				this.item = info.item;
				this.video_title = this.item.ItemName;
				this.getData();
			} else {
				this.dataStatus = this.common.DataStatus.LoadError
			}
			// #endif
		},

		methods: {
				itemClick: function(item,index) {
				if(this.type == '01'){
					// this.itemIndex = index;
					// var item1 = this.article[index];
					
					let info = {					
						item: item
					};
								
						this.navigate.navigateTo({
							url: './self-service-art?src='+item.MaterialPath+'&title='+item.ItemName,
							data:info
						})		
				}else if(this.type == '03'){
					let _this = this;
					// console.log(JSON.stringify(item));
					var musicAcacheItem = {};
					
					var musicAcacheList = [];
					for (var i = 0; i < _this.list.length; i++) {
						var it = _this.list[i];
						// musicAcacheItem.OwnerShow_rowNum = it.OwnerShow_rowNum;
						musicAcacheItem.HitsCount = it.Hits;
						// musicAcacheItem.FavoriteStatus = it.FavoriteStatus;
						musicAcacheItem.InfoID = it.MaterialID;
						musicAcacheItem.InfoTitle = it.ItemName;
						// musicAcacheItem.InfoType = it.InfoType;
						musicAcacheItem.InfoCover = it.MaterialCoverPath;
						musicAcacheItem.InfoOrigin = it.MaterialPath;
						// musicAcacheItem.CreatedDate = it.CreatedDate;
						// musicAcacheItem.Remark = it.Remark;
						// musicAcacheItem.MaterialAllRights = it.MaterialAllRights;
						console.log("item标题： " + JSON.stringify(it))
						musicAcacheList.push(musicAcacheItem);
					}
					let ite = {"HitsCount":item.Hits,"InfoID":item.MaterialID,"InfoTitle":item.ItemName,"InfoCover":item.MaterialCoverPath,"InfoOrigin":item.MaterialPath}
					let info = {
						"item":ite
					}
					let id = this.utils.createUUID()
					uni.setStorageSync(id,info)							
					uni.setStorageSync('musicAcachePosition',index)
					uni.setStorageSync('musicAcacheList',musicAcacheList)
					this.navigate.navigateTo({
						url: './self-service-music?id=' +id
					})	
				}else if(this.type == '04'){
					// this.itemIndex = index;
					// var item1 = this.list[index]
					let info = {
						"item":item
					}				
					this.navigate.navigateTo({
						url: './self-service-video',
						data:info
					})	
				}
						
			},

			getData: function() {
				let _this = this;
				this.request.startRequest({
						url: _this.api.GetMaterialByItemID,
						data: {							
							'ItemID': _this.item.ItemID,
							'ItemType':_this.type,
							"pageSize": 100, 
							"pageIndex": 0
						},
						showLoading: true,
						storageType: 600,
						force: _this.force
					})
					.then(res => {
						if (res.data.Code == 0) {
							_this.item = res.data.Data
							_this.list = _this.item.MaterialList
							if (_this.list.length >= 10) {
			
								_this.dataStatus = _this.common.DataStatus.Normal
							} else {
			
								// if (_this.list.length == 0) {
								// 	_this.dataStatus = _this.common.DataStatus.NoData
								// } else {
								// 	_this.dataStatus = _this.common.DataStatus.NoMoreData
								// }
							}													
						} else {
							if (_this.list == null || _this.list.length == 0) {
								_this.dataStatus = _this.common.DataStatus.LoadError
							}
						}
			
					})
					.catch(reason => {
						if (_this.list == null || _this.list.length == 0) {
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					})
			}

		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;		
	}
	.topImg{
		display: flex;
		width: 100%;
		height: 150px;
		background-color: #4CD964;
		align-items: center;
		justify-content: center;
	}
	.list-item{
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 90px;		
		margin-top: 5px;
	}

	.a-left{
		width: calc(100% - 120px);
		height: 100%;
	}
	.a-top{
		margin-top: 10px;
		margin-left: 10px;
		text-overflow: -o-ellipsis-lastline;  
		overflow: hidden;  
		text-overflow: ellipsis;  
		display: -webkit-box;  
		-webkit-line-clamp: 2;  
		-webkit-box-orient: vertical; 
		font-size: 14px;
		margin-top: 8px;
	}
	.a-bottom{
		position: absolute;
		margin-left: 10px;
		font-size: 12px;
		bottom: 10px;
	}
	.a-img{
		width: 105px;
		height: 74px;
		margin-left: 5px;
		margin-top: 8px;
		background-color: #007AFF;
	}
	.groupItem{
		width: 100%;
		height: 150px;
		background-color: #000000;
		/* background-image: url(../../static/img/science/self_group.png);		 */
	}
	.groupItem-view{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		/* justify-content: center; */
		align-items: center;
		
	}
	.group-name{
		width: 150px;
		height: 40px;	
		line-height: 40px;
		text-align: center;
		border-radius: 3px;
		border-style:solid;
		border-width: 1px;
		border-color: #FFFFFF;
		width: 150px;
		
		color: #FFFFFF;
		
	}
	
	.group-count{
		width: 100%;
		font-size: 12px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		color: #FFFFFF;
		margin-top: 10px;
		/* background-color: #4CD964; */
	}
	/deep/.uni-list-item__container {
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
<!--
<script>	

	export default {		
		data() {
			return {
				itemID,
				title: '心理测试',
				list: [],
				currentPage: 0,
				type: '',
				musicAcachePosition: 0,
				musicAcacheList: [],
				itemIndex: 0,
				dataStatus: this.common.DataStatus.Unload,
				force: false
			}
		},


		onLoad(option) {
			// #ifdef H5
			if (option) {
				let _this = this;
				this.type = option.type;
				this.itemID = option.ItemID
				this.getData();
				// console.log(item)
			} else {
				this.dataStatus = this.common.DataStatus.LoadError
			}
			// #endif
			// #ifndef H5
			if (option.data) {
				let info = JSON.parse(option.data)
				this.item = info.item;
				this.video_title = this.item.ItemName;
				this.getData();
			} else {
				this.dataStatus = this.common.DataStatus.LoadError
			}
			// #endif


		},
		onPullDownRefresh() {
			this.force = true
			this.getData();
		},

		onReachBottom() {
			this.loadMore();

		},


		onShow: function() {
			let _this = this
			// uni.$on('saveData', function(data) {
			// 	_this.list[_this.itemIndex] = data.msg
			// 	console.log('监听到事件来自 updateData ，携带参数为：' + _this.itemIndex + "  " + JSON.stringify(_this.list[
			// 		_this.itemIndex].msg));
			// })

			// uni.$on('saveMusicData', function(data) {
			// 	_this.list = data.msg
			// 	_this.musicAcacheList = data.msg
			// })
			uni.removeStorage({
				key: 'musicAcachePosition'
			})
			uni.removeStorage({
				key: 'musicAcacheList'
			})
		},

		onUnload: function() {
			// uni.$off('saveData')
			// uni.$off('saveMusicData')
		},

		methods: {

			tapItem: function(item1, index) {
				let _this = this
				// console.log('点击了第'+index+'个')
				this.musicAcachePosition = index;
				this.itemIndex = index;
				let item = this.list[index];
				let info = {
					"item": item
				}
				// let id = this.utils.createUUID();
				// uni.setStorageSync(id,info)	
				// console.log('记录了第'+this.musicAcachePosition+'个')
				if (item.InfoOrigin.endsWith(".mp3")) {
					uni.setStorageSync('musicAcachePosition', _this.musicAcachePosition)
					uni.setStorageSync("musicAcacheList", _this.list)
					// this.navigate.navigateTo({
					// 	url: './science_music_detail',
					// 	data: info
					// })



				} else {
					this.navigate.navigateTo({
						url: './science_video_detail',
						data: info
					})
				}
			},

			getData: function() {
				let _this = this;
				this.request.startRequest({
						url: _this.api.GetMaterialByMaterialID,
						data: {
							'UserID': _this.user.getUserId(),
							'MaterialID': _this.ItemID,
							'ItemType':_this.type							
						},
						showLoading: true,
						storageType: 600,
						force: _this.force
					})
					.then(res => {
						if (res.data.Code == 0) {
							_this.list = res.data.Data
							if (_this.list.length >= 10) {

								_this.dataStatus = _this.common.DataStatus.Normal
							} else {

								if (_this.list.length == 0) {
									_this.dataStatus = _this.common.DataStatus.NoData
								} else {
									_this.dataStatus = _this.common.DataStatus.NoMoreData
								}
							}													
						} else {
							if (_this.list == null || _this.list.length == 0) {
								_this.dataStatus = _this.common.DataStatus.LoadError
							}
						}

					})
					.catch(reason => {
						if (_this.list == null || _this.list.length == 0) {
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					})
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		/* #ifdef H5 */
		margin-top: 44px;
		/* #endif */
	}

	.scroll {
		/* margin-top: 10rpx; */
		width: 100%;
		height: calc(100vh - 100rpx);
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
		height: 300rpx;
		margin-top: 1vw;
		font-size: 30rpx;
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
		background-color: #FFFFFF;
	}

	/deep/.uni-list-item__container {
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
	
</style>
-->