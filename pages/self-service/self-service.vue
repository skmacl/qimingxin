<!-- 自助首页 -->
<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="科普" :showBack="false" :showBackText="false"></sknavigate>
		<!-- #endif -->
		
		<view class="scroll">
			<!-- banner -->
			<swiper class="swiper" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF"
				:circular="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,swiperindex) in banners" :key='swiperindex'>
					<view class="swiper-item" v-on:click="bannerClick(item)">
						<image class="swiper-item-img" :src="item.ObjectImgURL" mode="aspectFill" :draggable="false">
						</image>
						<text class="swiper-item-title font-size-banner">{{item.ObjectTitle}}</text>
					</view>
				</swiper-item>
			</swiper>
			<!-- 分类 -->
			
			<view class="quick-module">
				<view class="quick-module-item" v-for="(item,index) in quickItems" :key="item.InfoID"
					v-on:click="toQuick(index)">
					<image class="quick-module-item-img" :draggable="false" mode="scaleToFill" :src="item.icon"></image>
					<view class="quick-module-item-right">
						<text class="quick-module-item-title font-size-type">{{item.title}}</text>
						<text class="quick-module-item-introduce">{{item.introduce}}</text>
					</view>

				</view>
			</view>
			<!-- 文章列表 -->
			<view class="section-header">
				<text class="section-header-l font-size-title" style="padding: 10px;">最新文章</text>
				<text class="section-header-r font-size-subtitle" v-on:click="toMoreArticle()">更多</text>
			</view>
			<view class="scroll-item" v-for="(item,artindex) in article" :key="item.InfoID" @tap="tapItemArt(item,artindex)" link>
				<listItem :value="item"></listItem>
			</view>
			<!-- 音乐列表 -->
			<view class="section-header">
				<text class="section-header-l font-size-title" style="padding: 10px;">最新音乐</text>
				<text class="section-header-r font-size-subtitle" v-on:click="toMoreMusic()">更多</text>
			</view>
			<view class="scroll-item" v-for="(item,musicindex) in music" :key="item.InfoID" @tap="tapItemMusic(item)"
				link>
				<listItem :value="item"></listItem>
			</view>
			
			<view class="section-header">
				<text class="section-header-l font-size-title" style="padding: 10px;">最新视频</text>
				<text class="section-header-r font-size-subtitle"  v-on:click="toMoreVideo()">更多</text>
			</view>
			<view class="scroll-item" v-for="(item,videoindex) in video" :key="item.InfoID"
				@tap="tapItemVideo(item,videoindex)" link>
				<listItem :value="item"></listItem>
			</view>
		</view>
	</view>
</template>

<script>
	import listItem from "./self-service-item.vue" //列表item

	export default {
		components: {
			listItem
		},
		data() {
			return {
				banners: [],
				quickItems: [{
					"title": "文章",
					"introduce": "心理学习会",
					"icon": "../../static/img/science/help_art.png"
				}, {
					"title": "音乐",
					"introduce": "如水般静心",
					"icon": "../../static/img/science/help_music.png"
				}, {
					"title": "视频",
					"introduce": "健康知识学习",
					"icon": "../../static/img/science/help_video.png"
				}, ],
				article: [],
				music: [],
				video: [],							
				currentPage: 0,				
				musicAcachePosition: 0,
				musicAcacheList: [],
				itemIndex: 0,
				force:false
			}

		},


		onShow: function() {			
			uni.removeStorage({
				key:'musicAcachePosition'
			})
			uni.removeStorage({
				key:'musicAcacheList'
			})	
		},
		onLoad() {
			this.getData()
			let _this = this
			// uni.$on('saveArtData', function(data) {
			// 		_this.article.splice(_this.itemIndex,1,data.msg);					
			// })
			
			// console.log('监听到事件来itemIndex携带参数为' + _this.itemIndex)
			// uni.$on('saveData', function(data) {
			// 		_this.video.splice(_this.itemIndex,1,data.msg);					
			// })
			
			// uni.$on('saveMusicData', function(data) {
			// 	_this.music = data.msg
			// 	_this.musicAcacheList = data.msg
			// })
			if(this.config.home == false && this.config.evaluation == false && this.config.consult == false){
				if(this.user.isFirst() == true){
					this.navigate.navigateTo({
						url:"../mine/system/login"
					})
				}
			}
		},
		onUnload: function() {
			// uni.$off('saveArtData')
			// uni.$off('saveData')
			// uni.$off('saveMusicData')
		},


		// mounted() {
		// 	this.triggered = true;
		// 	this.getData();
		// 	console.log("scienc登录状态： " + this.utils.getLoginState())
		// },
		onPullDownRefresh() {
			this.force = true
			this.getData()
		},

		methods: {
			tapItemArt: function(item,index) {
				
				// console.log(JSON.stringify(item));
				this.itemIndex = index;
				var item1 = this.article[index];
				
				let info = {					
					item: item1
				};
							
					this.navigate.navigateTo({
						url: './self-service-art?src='+item.MaterialPath+'&title='+item.ItemName,
						data:info
					})					
				

			},
			tapItemMusic: function(item) {
			
				let _this = this;
				// console.log(JSON.stringify(item));
				var musicAcacheItem = {};
				// _this.music.forEach(function(it) {
				// 	musicAcacheItem.OwnerShow_rowNum = it.OwnerShow_rowNum;
				// 	musicAcacheItem.HitsCount = it.HitsCount;
				// 	musicAcacheItem.FavoriteStatus = it.FavoriteStatus;
				// 	musicAcacheItem.InfoID = it.InfoID;
				// 	musicAcacheItem.InfoTitle = it.InfoTitle;
				// 	musicAcacheItem.InfoType = it.InfoType;
				// 	musicAcacheItem.InfoCover = it.InfoCover;
				// 	musicAcacheItem.InfoOrigin = it.InfoOrigin;
				// 	musicAcacheItem.CreatedDate = it.CreatedDate;
				// 	musicAcacheItem.Remark = it.Remark;
				// 	musicAcacheItem.MaterialAllRights = it.MaterialAllRights;
				// 	console.log("item标题： " +JSON.stringify(it))
				// 	_this.musicAcacheList.push(it);
				// });

				_this.musicAcacheList = [];
				for (var i = 0; i < _this.music.length; i++) {
					var it = _this.music[i];
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
					_this.musicAcacheList.push(musicAcacheItem);
				}
				let ite = {"HitsCount":item.Hits,"InfoID":item.MaterialID,"InfoTitle":item.ItemName,"InfoCover":item.MaterialCoverPath,"InfoOrigin":item.MaterialPath}
				let info = {
					"item":ite
				}
				let id = this.utils.createUUID()
				uni.setStorageSync(id,info)							
				uni.setStorageSync('musicAcachePosition',_this.music.indexOf(item))
				uni.setStorageSync('musicAcacheList',_this.musicAcacheList)
				this.navigate.navigateTo({
					url: './self-service-music?id=' +id
				})	
				
			},
			tapItemVideo: function(item, index) {
				console.log("tapItemVideo" + index);
				this.itemIndex = index;
				var item1 = this.video[index]
				let info = {
					"item":item1
				}				
				this.navigate.navigateTo({
					url: './self-service-video',
					data:info
				})				
			},
			//获取数据
			getData: function() {
				let _this = this;				
				this.request.startRequest({
					url: _this.api.PostZZPage,
					// data: {
					// 	'UserID': _this.user.getUserId(),
					// },
					showLoading:true,
					storage:600,
					force:_this.force
				}).then(res =>{
					if (res.data.Code == 0) {
						_this.banners = res.data.Data.Banners;
						_this.article = res.data.Data.Articles;
						_this.music = res.data.Data.Musics;
						_this.video = res.data.Data.Videos;		
						console.log(JSON.stringify(_this.banners))
					}
				}).catch(reason =>{
					
				})			
			},
	
			bannerImageError: function(e) {
				console.error('image发生error事件，携带值为' + e.detail.errMsg)
			},

			bannerClick: function(item) {
				// console.log(item);
				
				var newItem = {};
				let _this = this;
				newItem.OwnerShow_rowNum = item.OwnerShow_rowNum;
				newItem.FavoriteStatus = item.BannerFavoriteStatus;
				newItem.InfoID = item.BannerID;
				newItem.InfoTitle = item.BannerTitle;
				newItem.InfoType = item.BannerType;
				newItem.InfoCover = item.BannerImgURL;
				newItem.InfoOrigin = item.Http + item.BannerLinkURL;
				_this.musicAcacheList = [];
				_this.musicAcacheList.push(newItem);
				if (newItem.InfoType == "00" || newItem.InfoType == "01" || newItem.InfoType == "07") {									
					this.navigate.navigateTo({
						url: "webCommonView?url=" + item.Http+ item.BannerLinkURL + "&title=" + item.BannerTitle
					})					
					
				} else if (newItem.InfoType == "09") {
					uni.setStorageSync('musicAcachePosition',0)
					uni.setStorageSync('musicAcacheList',_this.musicAcacheList)
					let info = {
						"item":newItem
					}
					let id = this.utils.createUUID()
					uni.setStorageSync(id,info)
					this.navigate.navigateTo({
						url: '../science/science_music_detail?id=' + id
					})	
					

				} else if (newItem.InfoType == "10") {
					let info = {
						"item":newItem
					}
					let id = this.utils.createUUID()
					uni.setStorageSync(id,info)
					this.navigate.navigateTo({
						url: '../science/science_video_detail_tmp?id=' + id
					})					
				}
			},
			toQuick: function(index) {
				
				switch (index) {
					case 0: {
						console.log("点击文章")
						this.navigate.navigateTo({
							url: "./self-service-group?type=01"
						})						
						break;
					}
					case 1: {
						console.log("点击音乐")
						this.navigate.navigateTo({
							url: './self-service-group?type=03'
						})						
						break;
					}
					case 2: {
						console.log("点击视频")
						this.navigate.navigateTo({
							url: './self-service-group?type=04'
						})						
						break;
					}
				}
			},

			toMoreArticle() {
				this.navigate.navigateTo({
					url: './science_all_art_list?type=01'
				})				
			},

			toMoreMusic() {
				this.navigate.navigateTo({
					url: './science_all_music_list?type=03'
				})				
			},

			toMoreVideo() {
				this.navigate.navigateTo({
					url: './science_all_video_list?type=04'
				})				
			},

		}

	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100%;
	}

	.scroll {
		/* margin-top: 10rpx; */
		width: 100%;
		/* height: calc(100vh - 100rpx); */
		background-color: #ebebeb;
	}

	.swiper {
		width: 100%;
		height: 187.5px;
		margin-top: 0;
		background-color: #431a27;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
	}

	.swiper-item-img {
		width: 100%;
		height: 100%;
	}

	.swiper-item-title {
		display: flex;
		position: absolute;
		bottom: 0rpx;
		width: 100%;
		height: 50px;
		background: rgba(0, 0, 0, 0.3);
		padding-left: 16rpx;
		padding-top: 10rpx;
		color: #FFFFFF;
		opacity: 1;
	}

	.quick-module {
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		width: 100%;
		height: 70px;
	}

	.quick-module-item {
		display: flex;
		flex-direction: row;
		top: 0;
		width: 33%;
		height: 100%;
		background-color: #FFFFFF;
		align-items: center;
		/* justify-content: center; */
	}
	.quick-module-item-right{
		display: flex;
		flex-direction: column;
		height: 40px;
		margin-left: 5px;
		/* width: 50%; */
		/* height: 25px; */
		/* margin-top: 10px; */	
		/* justify-content: center; */
	}
	.quick-module-item-img {
		/* left: 35%;
		top: 15%; */
		width: 28px;
		height: 28px;
		margin-left: 10px;
		/* margin-top: 25rpx; */

	}
	.quick-module-item-title {	
		height: 18px;
		line-height: 18px;
		margin-left: 10px;
		color: #000000;
		font-size: 15px;
		
	}

	.quick-module-item-introduce {
		
		text-align: center;
		margin-top: 5px;
		width: 100%;
		height: 15px;
		line-height: 15px;
		font-size: 12px;
	}


	.section-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;		
		margin-top: 10px;
		width: 100%;
		background-color: #FFFFFF;
	}

	.section-header-l {}

	.section-header-r {
		margin-right: 20px;
		align-self: center;
		height: fit-content;
	}

	.scroll-item {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 150px;
		background-color: #FFFFFF;
	}

	.scroll-item-img {
		margin-top: 18px;
		margin-left: 15px;
		width: 150px;
		height: 114px;
		border-radius: 3px;
		background-color: #007AFF;
	}

	.scroll-item-info {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		margin-top: 18px;
		margin-left: 0px;
		width: calc(100% - 150px - 15px - 10px);
		right: 5px;
		height: 114px;
	}

	.scroll-item-title {
		margin-top: 5px;
		margin-left: 8px;
	}

	.scroll-item-subtitle {
		margin-top: 10px;
		margin-left: 8px;
		line-height: 15px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
