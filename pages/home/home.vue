<template>
	<view class="content">	
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="首页" :showBack="false" :showBackText="false"></sknavigate>
		<!-- #endif -->
		
		<swiper class="swiperStyle" :indicator-dots="true"
		indicator-color="#CCC" indicator-active-color="#FFF"
		autoplay="true" :interval="3000" :duration="1000" :circular="true" >
			<swiper-item v-for="(item,index) in banners" :key="index" @click="bannerItemClick(item, index)">
				<image class="swiperImgStyle" :src="item.BannerImgURL" mode="aspectFill" :draggable="false" ></image>
			</swiper-item>
		</swiper>
		<view v-show="headline == true"  class="toutiao">
			<view class="toutiao-title" v-on:click="toMorningList()">心理头条</view >
			<view class="toutiao-line"></view>
			<view  class="toutiao-info" @click="dailyClick">{{topLineBean.DailyContent}}</view>
		</view>
		<view v-show="s_evaluation != true">
			<image  class="xdt" :style="{'margin-top':headline == true?10:0 + 'px'}"  mode="scaleToFill" :draggable="false" :src="topLineBean.MorningPicture" v-show="isShowXdt" v-on:click="xdtClick"></image>
		</view>
		<view v-show="evaluation == true" class="section-header">
			<text class="section-header-l font-size-title" style="padding: 10px;">心理测评</text>
			<text class="section-header-r font-size-subtitle" v-on:click="showPaper(true)">换一批</text>
		</view>
		<view v-show="evaluation == true" class="home-eva">
			<view class="home-eva-item" v-for="(item,index) in paper_show" :key="index" @click="paperItemClick(item, index)">
				<image class="home-eva-img" :draggable="false" :src="item.PaperCoverURL" mode="scaleToFill"></image>
				<text class="home-eva-title">{{item.PaperName}}</text>
				<text class="home-eva-count">{{item.TestCount}}人测过</text>
			</view>
		</view>
		
		<view v-show="science == true" class="section-header">
			<text class="section-header-l font-size-title" style="padding: 10px;">心理自助</text>
			<text class="section-header-r font-size-subtitle" v-on:click="selfMore()">换一批</text>
		</view>
		<uni-list v-show="science == true" v-for="(item,index) in selfs" :key="index">		
			<uni-list-item :clickable="true" @click="selfItemClick(item,index)">
				<view slot="header" class="self-item">
					<listItem class="item" :value="item"></listItem>
				</view>
			</uni-list-item>
		</uni-list>
			<view>
				<uni-popup ref="dailyDialog" type="dialog" :maskClick="true">
					<scroll-view v-if="topLineBean.MorningPicture != null && topLineBean.MorningPicture.length > 0" class="daily" scroll-y="true">
						<image class="daily-img" :src="topLineBean.MorningPicture" mode="widthFix"></image>
						<view class="daily-info">{{topLineBean.MorningAnalysis}}</view>						
					</scroll-view>
					<scroll-view v-else class="daily-concise" scroll-y="true">		
						<view class="daily-title">每日一句</view>
						<view class="daily-info">{{topLineBean.DailyContent}}</view>
					</scroll-view>
				
				</uni-popup>
			</view>
	</view>
</template>

<script>
	import listItem from '../self-service/self-service-item.vue' //列表item
	import dailyDialog from "./dailyDialog/dailyDialog.vue"
	export default {
		components: {
			dailyDialog,
			listItem
		},
		data() {
			return {
				evaluation:false,
				s_evaluation:false,
				headline:false,
				science:false,
				title: '我的',				
				banners:[],
				selfs: [],
				papers: [],
				paper_show: [],
				paperShowNum: 0,
				xdt: [
					{MorningPicture: ""}
				],
				topLineBean: {},
				isShowXdt: false,
				imgEye: "../../static/img/home/home_readCount.png",
				musicAcachePosition: 0,
				musicAcacheList: [],
				force:false, //下拉刷新数据时改为true				
			}
		},
		onLoad() {			
			this.loadData()
			//小程序
			this.s_evaluation = this.config.s_evaluation
			this.headline = this.config.headline
			this.science = this.config.science
			this.evaluation = this.config.home_evaluation
			console.log(this.config.evaluation)
			if(this.user.isFirst() == true){
				this.navigate.navigateTo({
					url:"../mine/system/login"
				})
			}
		},
		onShow() {
			uni.removeStorage({
				key:'musicAcachePosition'
			})
			uni.removeStorage({
				key:'musicAcacheList'
			})			
			// this.navigate.clearnStack()
		},

		onPullDownRefresh() {
			this.force = true
			this.loadData()
		},
		methods: {			
			setSelfItemType: function(infoType) {
				if (infoType == "00") {
					return "文章"
				} else if (infoType == "0001") {
					return "文章"
				} else if (infoType == "02") {
					return "音乐"
				} else if (infoType == "03") {
					return "视频"
				} else {
					return "未知"
				}
			},
			dailyClick: function(){
				// this.$refs.dailyDialog.open()
				// this.$refs.popup.open("center")
				this.$refs.dailyDialog.open()
			},
			xdtClick: function() {
				this.navigate.navigateTo({
					url: "./xdt_list/xdt_list"
				})				
			},
			toMorningList:function(){
				this.navigate.navigateTo({
					url:'./morning_list'
				})
			
			},
			bannerItemClick: function(item, index){
				// console.log("bannerItemClick " + index)
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
				if (newItem.InfoType == "00" || newItem.InfoType == "01" || newItem.InfoType == "07") {//文章类型
					this.navigate.navigateTo({
						url: "../science/webCommonView?url=" + item.Http+ item.BannerLinkURL + "&title=" + item.BannerTitle
					})					
					
				} else if (newItem.InfoType == "04") {//量表类型
					var paperInfo = {
						"PaperID":item.PaperID,"PaperCode":"","PaperName":"","LineNumber":"","Remark":"","Introduction":"","Money":"",
						"TestCount":"","PaperCoverURL":"","PaperContentURL":"","PaperRecommend":"","TestState":"","QuestionCount":"","FavoriteState":"","CreatedDate":"","PaperResultID":"",
						"IsTest":"","IsCanTest":"","PublishID":"0","BannerTitle":"","CanTestState":"","State":"","PaperState":"",
						"Out_trade_no":"","Nonce_str":"","prepay_id":"","Sign":"","timestamp":"","MCHID":"","invalidtime":"","PaperReportURL":"","IsReport":"","IsShowReport":"","ShareURL":""
					}
					let info = {
						"publishId":'0',
						"item":item
					}
					
					// let id = this.utils.createUUID()
					// uni.setStorageSync(id,info)
					this.navigate.navigateTo({
						url:'../evaluation/evaluation_detail',
						data:info
					})								
				}else if (newItem.InfoType == "09") {
					uni.setStorageSync('musicAcachePosition',0)
					uni.setStorageSync('musicAcacheList',_this.musicAcacheList)
					let info = {
						"item":newItem
					}
					let id = this.utils.createUUID()
					uni.setStorageSync(id,info)
					this.navigate.navigateTo({
						url: '../science/science_music_detail?fromBanner=true',
						data:info
					})	
					

				} else if (newItem.InfoType == "10") {
					let info = {
						"item":newItem
					}
					// let id = this.utils.createUUID()
					// u ni.setStorageSync(id,info)
					this.navigate.navigateTo({
						url: '../science/science_video_detail_tmp?fromBanner=true',
						data:info
					})					
				}
				
			},
			paperItemClick: function(item, index){
				let info = {
					"publishId":'0',
					"item":item
				}
				
				// let id = this.utils.createUUID()
				// uni.setStorageSync(id,info)		
				this.navigate.navigateTo({
					url:'../evaluation/evaluation_detail',
					data:info
				})						
			},
			selfItemClick: function(item, index){
				var targetUrl = "";
				let _this = this;
				let info = {
					'item':item
				}
				let id = this.utils.createUUID()
				
				if (item.InfoType == "00") {
					targetUrl = '../science/science_art_detail'
				} else if (item.InfoType == "0001") {
					targetUrl = '../science/science_art_detail'
				} else if (item.InfoType == "02") {
					targetUrl = '../science/science_music_detail'
					_this.musicAcacheList = [];
					_this.musicAcacheList.push(item);
					uni.setStorageSync('musicAcachePosition',0)
					uni.setStorageSync('musicAcacheList',_this.musicAcacheList)
					
					
				} else if (item.InfoType == "03") {
					let id = this.utils.createUUID();
					let info = {
						"item":item
					}
					
					// uni.setStorageSync(id, info);
					
					targetUrl = '../science/science_video_detail'
					
								
				} 		
					try{
						// uni.setStorageSync(id,info)
						_this.navigate.navigateTo({
							url:targetUrl,
							data:info
						})	
					}catch(err){
						
					}
			},
			selfMore: function(){
				this.force = true
				this.loadData()
			},
			showPaper: function(refresh){
				if (refresh) {
					this.paperShowNum ++
				}
				console.log("~~length=" + this.papers.length)
				if (this.papers.length == 0){
					return
				} else if (this.papers.length <= 2){
					this.paper_show = this.papers
				} else {
					this.paper_show = []
					this.paper_show.push(this.papers[0 + (this.paperShowNum*2) % this.papers.length])
					this.paper_show.push(this.papers[1 + (this.paperShowNum*2) % this.papers.length])
					// console.log("push!!!" + this.paper_show.length)
				}
			},
			loadData: function(){
				let _this = this
				
				this.request.startRequest({
					url:_this.api.PostMain,
					data: {
						'UserID': _this.user.getUserId(),
						'Version': _this.user.getVersion()
					},
					showLoading:true,
					storage:60,
					force:_this.force
				}).then(res =>{
					if (res.data.Code == 0){
						_this.banners = res.data.Data[0].Banner
						_this.selfs = res.data.Data[0].Material
						_this.papers = res.data.Data[0].Paper
						_this.xdt = res.data.Data[0].XDT
						_this.isShowXdt = res.data.Data[0].DailyTip[0] != ""
						_this.topLineBean = res.data.Data[0].DailyTip[0]
						_this.showPaper(false)
					}else{
						alert("服务器错误，请稍后再试")
					}
				}).catch(reason =>{
					
				})		
			}

		},
		
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
	}
/* 	.scrollStyle {
		width: 100%;
		height: calc(100vh - 100rpx - 88rpx);
		background-color: rgba(0,0,0,0.03);
	} */
	
	.swiperStyle{		
		width: 100%;
		height: 187px;
		margin-top: 0;
		background-color: #431a27;
	}
	.swiper-item{
		width: 100%;
		height: 100%;
	}
	.swiperImgStyle{
		width: 100%;
		height: 100%;		
	}
	.swiper-item-title{
		display: flex;
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 25px;		
		background: rgba(0,0,0,0.3);
		padding-left: 8px;
		padding-top: 5px;
		color: #FFFFFF;
		opacity: 1;
	}
	
	.toutiao{
		display: flex;
		flex-direction: row; 
		width: 100%;
		height: 30px;
		padding: 10px 0 10px 0;
		background-color: #FFFFFF;
	}
	.toutiao-line{
		width: 1px;
		height: 27.5px;
		background: #939393;
		margin-left: 10px;
	
	}
	.toutiao-title{
		font-size: 16px;
		color: #007AFF; 
		font-weight: bold;
		height: 22.5px;
		line-height: 22.5px;
		margin-left: 10px;
	}
	.toutiao-info {
		margin-left: 10px;
		margin-right: 10px;
		width: calc(100% - 110px);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 22.5px;
		line-height: 22.5px;
	}
	
	.xdt{
		width: 100%;
		height: 75px;
		background-color: #FFFFFF;		
	}
	
	.section-header{
		display: flex;
		flex-direction: row;
		justify-content: space-between;		
		width: 100%;
		background-color: #FFFFFF;			
	}
	.section-header-l{
	}
	.section-header-r {
		margin-right: 20px;
		align-self: center;
		height: fit-content;
	}
	.home-eva{
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;	
		margin-bottom: 10px; 
		width: 100%;		
	} 
	.home-eva-item{
		display: flex;
		flex-direction: column;
		/* margin-right: 10px; */
		width: 175px;
		height: auto;
		margin-left: 10px;
	}
	.home-eva-img{
		width: 173.5px;
		height: 114px;
		border-radius: 1.5px;		
	}
	.home-eva-title{
		font-size: 14px; 
		margin-top: 10px
	}
	.home-eva-count{
		font-size: 9px; 
		color: #8f8f94;
		margin-top: 15px;
	}
	.self {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}
	.self-item {
		display: flex;
		flex-direction: row;		
		/* height: 150px; */
		background-color: #FFFFFF;		
		border-style: none none solid none;	
		border-width: thin;
	}
	.self-item-img {
		width: 150px;
		height: 114px;
		border-radius: 3px;
		margin-left: 10px;
	}
	.self-item-info {
		display: flex;
		flex-direction: column;
		margin-right: 10px;
		width: calc(100% - 150px - 10px - 10px);
		margin-left: 10px;
		justify-content: space-between;
	}
	.self-item-title {
		overflow:hidden;
		text-overflow:ellipsis; 		
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		
	}
	.self-item-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;		
	}
	.self-item-eye {
		width: 10px;
		height: 10px;
		align-self: center;
	}
	.v-count{
		font-size: 11px;
		 color: #8F8F94;
		  margin-left: 5px; 
		  align-self: center;
	}
	.self-item-type{
		font-size: 14px; color: #007AFF;
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
	.daily-concise{
		width: 80vw;
		max-width: 225px;
		height: auto;
		border-radius: 7.5px; 
		background-color: #fff;
		max-width: 80vw;
		max-height: 60vh;
	}
	.daily-title{
		width: 80vw;
		font-size: 18px;
		/* max-width: 450rpx; */
		text-align: center;
		height: 30px;
	}
	.daily-img{
		width: 100%;
		border-radius: 7.5px;
	}
	.daily-info{
		font-size: 13px;
		height: calc(100% - 16px);
		width: calc(100% - 16px);
		color: #6e6e6e;
		padding: 5px 5px 5px 5px;
	}
	.count{
		display: flex;
		flex-direction: row;
	}
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
