<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class = "navigate" :title="item.ItemName"
			@rightClick="rightClick()" 
			:rightSelect="getState()"
			:rightStyle = "showCollection()?1:0"
			@navi-Back="back()"></sknavigate>
		<!-- #endif -->
		
		
		<view>
			<video class="video" id="myVideo" :autoplay="true" :src="encodeURI(item.MaterialPath)" object-fit=contain play-btn-position=center
				@error="videoErrorCallback" controls>
			</video>
		</view>
		<!-- <view class="name_boder">
			<text>{{title_bar}}</text>
			<image class="iconbtn" :src="collection(videoItem.FavoriteStatus)" @click="save()"></image>
		</view> -->
		<!-- <view class="introduce">
			<view class="line_vertical"></view>
			<text class="class_introduce">课程介绍</text>
		</view>
		<scroll-view class="introduce_content">
			<text> {{videoItem.Remark}}</text>
		</scroll-view>
		<view class="introduce">
			<image class="img_tort" src="../../static/img/evaluation/vip.png"></image>
			<text class="introduce-tort">数据来源于网络，如有侵权请联系删除</text>
		</view> -->
		<loginModule ref="login" @success="loginSuccess"></loginModule>
	</view>
</template>

<script>
	import sknavigate from '../../components/sk-navigationBar/sk-navigationBar.vue'
	export default {
		components:{
			sknavigate
		},
		data() {
			return {				
				item: {
					
				},
				color:"#3399ff"
			
			}
		},
		onLoad(option) {
			// #ifdef H5
				if (option.id != null) {
					let _this = this;
					let id = option.id;
					let info = uni.getStorageSync(id)
					this.item = info.item;
					
					this.getData()
					
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.videoItem = info.item;
					if (this.videoItem.MaterialPath == undefined) {
						this.title_bar = this.videoItem.InfoTitle
					} else {
						this.title_bar = this.videoItem.MaterialPath
					}
					this.getData()
					this.fromBanner = option.fromBanner
				}
			// #endif
			
		},
		mounted() {

		},
		// #ifdef APP-PLUS
		onNavigationBarButtonTap(e) {				
			if(this.config.collection == true){
				if(e.index == 0){
						if(this.user.getLoginState() == true){
							if(this.videoItem.FavoriteStatus == "0"){
								
								this.Favorite()
							}else{
								this.CancleFavorite()
							}
						}else{
							this.login()
						}		
				}
			}
			
				
		},
		// #endif
		

	
		onReady: function(res) {
			// this.videoContext = uni.createVideoContext('myVideo')
		},

		onBackPress: function() {			
			console.log("返回视频列表页")
		},
		methods: {
		
			getState:function(){
				return false
				if(this.videoItem.FavoriteStatus == "1"){
					return true
				}else{
					return false
				}
			},
			rightClick:function(){
				return
				if(this.user.getLoginState() == true){
					if(this.videoItem.FavoriteStatus == "0"){
						this.Favorite()
					}else{
						this.CancleFavorite()
					}
				}else{
					this.login()
				}				
			},
			loginSuccess:function(){
				
			},
			showCollection:function(){
				return false// (this.config.collection && !this.fromBanner);
			},
			login:function(){
				let _this = this
					uni.showModal({
						title:"用户未登录",
						content:"检测到您尚未登录，是否去登录？",
						success(e) {
							if(e.confirm == true){							
								_this.$refs.login.showLogin()						
							}
						}
					})				
			},
			getData:function(){
				return
				let item = this.videoItem
				let id = item.InfoID
				let _this = this
				this.request.startRequest({
					url:_this.api.PostMusicInfoByID,
					data:{
						"UserID":_this.user.getUserId(),
						"InfoID":id
					}
				}).then(res =>{
					if(res.data.Code == 0){
						let newItem = res.data.Data[0]
						console.log(JSON.stringify(newItem))
						_this.videoItem.FavoriteStatus = newItem.FavoriteStatus
						
						// #ifdef APP-PLUS
						let text = "收藏"
						if(_this.videoItem.FavoriteStatus == 1){
							text = "取消收藏"
						}
						if(_this.config.collection == false){
							text = ""
						}
							var na = _this.$mp.page.$getAppWebview()
							na.setTitleNViewButtonStyle(0,{
								text:text
							})
						// #endif
					}
				}).catch(reason =>{
					
				})
			},
		
			videoErrorCallback: function(e) {
				console.log(JSON.stringify(e))
				// uni.showModal({
				// 	content: JSON.stringify(e),
				// 	showCancel: false
				// })
			},
	

			Favorite: function(status) {
				let _this = this;
				// console.log(getApp().globalData.defaultUser);
				this.request.startRequest({
					url: _this.api.PostFavorite,
					data: [{
						'UserID': _this.user.getUserId(),
						'ObjectID': _this.videoItem.InfoID,
					}],
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {						
						_this.videoItem.FavoriteStatus = 1								
								// #ifdef APP-PLUS
									var na = _this.$mp.page.$getAppWebview()
									na.setTitleNViewButtonStyle(0,{
										text:"取消收藏"
									})
								// #endif
					}
				}).catch(res =>{
					
				})			
			},
			CancleFavorite: function(status) {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostCancelFavorite,
					data: [{
						'UserID': _this.user.getUserId(),
						'ObjectID': _this.videoItem.InfoID,
					}],
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						_this.videoItem.FavoriteStatus = 0	
						// #ifdef APP-PLUS
							var na = _this.$mp.page.$getAppWebview()
							na.setTitleNViewButtonStyle(0,{
								text:"收藏"
							})
						// #endif
					}
				}).catch(res =>{
					
				})	
				
			},

		}

	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
	}
	.navigate{
		position: fixed;
		width: 100%;
		height: 40px;		
		z-index: 3;
	}
	.video {
		width: 100%;
		height: auto;
		min-height: 250px;		
	}

	.name_boder {
		border-style: solid;
		border-width: 0 0 1px 0;
		border-corlor: #EEEEEE;
		margin-left: 10px;
		margin-right: 10px;
		/* padding: 10px; */
		display: flex;
		justify-content: space-between;
		flex-direction: row;
	}

	.line_vertical {
		width: 1px;
		background-color: #007AFF;
		margin-left: 10px;
		margin-top: 10px;
		height: 15px;
	}

	.introduce {
		width: 100vw;
		height: 40px;
		display: flex;
		flex-direction: row;
	}

	.class_introduce {
		margin-left: 12px;
		font-size: 12p;
		color: #007AFF;
		margin-top: 5px;
	}

	.introduce_content {
		margin-top: 10px;
		/* margin-left: 10px; */
		font-size: 14px;
	}

	.uni-bottom {
		position: fixed;
		bottom: 10px;
	}

	.img_tort {
		width: 15px;
		height: 15px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 3px;
		margin-left: 10px;
	}

	.introduce-tort {
		text-align: center;
		color: #8F8F94;
		font-size: 10px;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 7.5px;
	}

	.iconbtn {
		width: 30px;
		height: 30px;
		margin-left: 15px;
		margin-right: 15px;
		text-align: end;

	}
</style>
