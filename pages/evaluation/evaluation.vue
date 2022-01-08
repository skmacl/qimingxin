<template>
	<view class="content">
	<!-- #ifdef H5 -->
		<sknavigate class="navigate" title="心理测评" :showBack="false" :showBackText="false"></sknavigate>
	<!-- #endif -->
		<swiper class="swiper" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF"
			:circular="true" :autoplay="true" :interval="3000" :duration="1000">
		 <swiper-item v-for="(item,index) in BannerList" :key='index'>
				<view class="swiper-item" v-on:click="bannerClick(item)" style="background-image: url(item.ObjectImgURL);">
					<text class="swiper-item-title font-size-banner">{{item.Name}}</text>
				</view>
			</swiper-item>
		</swiper>
		<view class="section">
			<view class="section-title">每日推荐</view>
			<view class="section-change" v-on:click="change()">换一换</view>
		</view>
		<view class="recommend-card">
			<view class="recommend-card-item" v-for="(item,index) in Recommend" :key="index"  v-on:click="toDetail(item)">
				<view class="recommend-img">
					<view class="recommend-card-top">
						<image class="recommend-icon" src="../../static/img/evaluation/evaluation_already.png" mode="scaleToFill">
						</image>
						<view class="recommend-count">{{item.TestCount}}人已测</view>
					</view>
					<view class="recommend-title">{{item.PaperName}}</view>
				</view>
			</view>
		</view>
		<view class="dyn-card">
			<view class="middle-card-item" v-for="(item,index) in Category" :key = "index" v-if="index<=9" v-on:click="toPaper(item,index)">
				<image class="middle-card-item-icon" src="../../static/img/main/home_all.png" mode="scaleToFill"></image>
				<view class="middle-card-item-title">
					<!-- <view v-show="index <9"> -->
						{{item.CategoryName}}
					<!-- </view> -->
					<!-- <view v-show="index==9">全部</view> -->
				</view>
			</view>
		</view>
		<view class="middle-recomment"></view>
		<view class="section">
			<view class="section-title">全部测试</view>
		</view>
		<uni-list v-show="dataStatus == 1 || dataStatus == 5">
			<uni-list-item  v-for="(item,index) in PaperList" :key="index" v-on:click="toDetail(item)" :clickable="true">
				<view slot="body" class="evaluation-card">
					<view class="evaluation-info">
						<view class="evaluation-recomment-title">综合检查你的心理健康水平</view>
						<view class="line"></view>
						<view class="evaluation-name">{{item.PaperName}}</view>
						<view class="evaluation-count-section">
							<image class="evaluation-count-icon" src="../../static/img/evaluation/test_list.png" mode="scaleToFill"></image>
							<view class="evaluation-count-info">{{item.TestCount}}人已测</view>
						</view>
					</view>
					<image class="evaluation-img" :src="item.PaperCover.length>0?item.PaperCover:place" mode="scaleToFill"></image>
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
				BannerList:[],// "BannerID,Name,ObjectID,ObjectImgURL,ObjectType,LineNumber,CreatedDate
				Recommends:[],//PaperID,PaperName,PaperCoverURL,TestCount
				Recommend:[],
				Category:[],//CategoryID,CategoryIcon,CategoryName
				PaperList:[],//PaperID,PaperName,PaperCoverURL,TestCount
				dataStatus:this.common.DataStatus.NoData,
				currentPage: 0,
				place:'../../static/img/placeholder/test_list_place.png'
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {

		},
		onPullDownRefresh() {
			this.getData()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {		
			
			toPaper:function(item,index){
				let _this = this				
				// if(index == 9){
					this.navigate.navigateTo({
						url:'../evaluation/evalaution_allList?index='+index,
						data:_this.Category
					})
				// }
			},
			change:function(){
				
				this.Recommend = this.getRandomArrayElements(this.Recommends, 3)
			},
			getRandomArrayElements:function(arr, count) {
			    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
			    while (i-- > min) {
			        index = Math.floor((i + 1) * Math.random());
			        temp = shuffled[index];
			        shuffled[index] = shuffled[i];
			        shuffled[i] = temp;
			    }
			    return shuffled.slice(min);
			},
			bannerClick:function(banner){				
				let item = {
					"PaperID":banner.ObjectID,
					"PaperName":banner.name					
				}
				this.navigate.navigateTo({
					url:"evaluation_detail",
					data:{"item":item}
				})
			},
			toDetail:function(item){
				this.navigate.navigateTo({
					url:"evaluation_detail",
					data:{"item":item}
				})
			},
			getData: function() {
				let _this = this
				let url = this.api.PostHomePaperList
				let data = {pageIndex:0,pageSize:10}
				this.request.startRequest({
					url:url,
					data:data,
					showLoading:true
				}).then(res=>{
					if(res.data.Code == 0){
						let info = res.data.Data
						_this.BannerList = info.BannerList
						_this.Category = info.Category
						_this.PaperList = info.AllPaperList
						_this.Recommends = info.PaperList
						_this.Recommend = _this.getRandomArrayElements(_this.Recommends,3)
						if(_this.PaperList.length >= 5){
							
							_this.dataStatus = _this.common.DataStatus.Normal
						}else{
						
							if(_thisPaperList.length == 0){
								_this.dataStatus = _this.common.DataStatus.NoData
							}else{
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}
						}
					}else{
						if(_this.List == null || _this.List.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
					console.log(JSON.stringify(res))
				}).catch(reson=>{
					console.log(JSON.stringify(reson))
				})
			},
			loadMore: function() {
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了'
						});
					}					
					return;
				}
				console.log('加载更多222');
				//获取数据
				if(this.user.getLoginState() != true){
					return;
				}
				let _this = this;
				
				let userId = this.user.getUserId()				
				
				this.currentPage+=1
				
				
				let url = this.api.PostHomePaperList
				let data = {pageIndex:_this.currentPage,pageSize:10}
				this.request.startRequest({
					url:url,
					data:data,
					showLoading:true
				}).then(res=>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data.AllPaperList;
						if(newPapers == null){
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.PaperList = _this.PaperList.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}	
					}
					console.log(JSON.stringify(res))
				}).catch(reson=>{
					console.log(JSON.stringify(reson))
				})
			}

		}
	}
</script>
<style>
	.content {
		width: 100%;
		height: 100%;
		margin-top: 44px;
		background-color: rgba(0,0,0,.03);
	}

	.swiper {
		width: 100%;
		height: 160px;
		margin-top: 0;
		background-color: #431a27;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		background-color: #F0AD4E;
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
		height: 25px;
		background: rgba(0, 0, 0, 0.3);
		padding-left: 8px;
		padding-top: 5px;
		color: #ffffff;
		opacity: 1;
	}

	.section {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 40px;
		background-color: #FFFFFF;
		margin-top: 10px;
	}

	.section-title {
		margin-left: 20px;
		line-height: 25px;
		height: 25px;
		font-size: 18px;
		font-weight: bold;
	}

	.section-change {
		font-size: 12px;
		color: rgba(0, 0, 0, .5);
		margin-right: 15px;
	}

	.recommend-card {
		display: flex;
		width: 100%;
		height: 135px;
		margin-top: 5px;
		
	}

	.recommend-card-item {
		margin-top: 2px;
		margin-left: 10px;
		height: 130px;
		border-radius: 10px;
		background-color: #FFFFFF;
		width: calc(100% - 40px)/3;		
	}

	.recommend-title {
		margin-top: 75px;
		height: 20px;
		font-size: 14px;
		line-height: 20px;
		width: 100%;
		text-align: center;
		overflow: hidden;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		box-orient: vertical;
		display: -webkit-box;
		display: box;		
	}

	.recommend-img {
		width: 110px;
		height: 90px;
		background-image: url("../../static/img/placeholder/single_recommend.png");	
		background-size: cover;
	}
	.recommend-card-top {
		display: flex;
		align-items: center;
		width: 100%;
		height: 25px;
	}
	.recommend-icon {
		width: 8px;
		height: 8px;
		margin-left: 8px;
	}
	.recommend-count {
		font-size: 12px;
		height: 15px;
		line-height: 15px;
		color: #FFFFFF;		
		margin-left: 5px;
	}
	.dyn-card {
		display: flex;		
		margin-left: 4%;
		width: 92vw;
		height: 160px;
		background-color: #FFFFFF;
		margin-top: 15px;
		border-radius: 10px;
		flex-flow: row wrap;
	}
	.middle-card-item{
		display: flex;
		flex-direction: column;
		width: 20%;	
		height: 50%;	
		align-items: center;
	}
	
	.middle-card-item-icon{
		width: 26px;
		height: 26px;
		margin-top: 12px;
	}
	.middle-card-item-title{
		font-size: 12px;
		margin-top: 12px;
	}
	.middle-recomment{
		width: 100%;
		height: 115px;
		background-image: url("../../static/img/placeholder/middle_card_place.png");
		background-size: 100%;
		margin-top: 15px;
	}
	.evaluation-card{
		display: flex;
		width: 100%;
		height: 90px;
		background-color: #FFFFFF;
		margin-top: 5px;
	}
	.evaluation-img{
		width: 108px;
		height: 74px;
		margin-top: 8px;
		border-radius: 8px;
	}
	.evaluation-info{
		height: 100%;
		width: calc(100% - 125px - 20px);
		margin-left: 20px;
		display: flex;
		flex-direction: column;
	}
	.evaluation-recomment-title{
		margin-top: 6px;
		width: 100%;
		height: 20px;
		line-height: 20px;
		font-size: 14px;
	}
	.line{
		width: 90%;
		border-bottom: dotted;
		border-width: 1px;
		border-color: #979797 ;
		margin-top: 5px;
	}	
	.evaluation-name{
		margin-top: 5px;
		font-size: 13px;
		height: 18px;
		line-height: 18px;
		color: rgba(0,0,0,.5);
	}
	.evaluation-count-section{
		display: flex;
		margin-top: 10px;
		align-items: center;
	}
	.evaluation-count-icon{
		width: 8px;
		height: 8px;
	}
	.evaluation-count-info{
		margin-left: 5px;
		font-size: 12px;
		height: 17px;
		line-height: 17px;
	}
	/deep/.uni-list-item__container{
		padding: 0px 0px 0px 0px !important;
	}
</style>




<!--
<template>
	<view class="content">		
	
	<view class="status" :style="{'height':top + 'px'}"></view>
		<segment class="nav" :style="{'top':top + 'px'}" :current=0 :values=values @clickItem="selectPage"></segment>
	
		<view class="content">
			<view v-show="current == 0">
				<view v-show="s_evaluation == true">
					<groupPage ref="group"></groupPage>
				</view>
				<view v-show="s_evaluation == false">
					<singlePage  ref="single"></singlePage>
				</view>
			</view>
			<view v-show="current == 1">
				<pushPage ref="publish"></pushPage>
			</view>			
		</view>
	</view>
</template>

<script>
	//插件使用
	import singlePage from "./evaluation_single.vue"
	import pushPage from "./evaluation_push.vue"	
	import groupPage from './evaluation_group.vue'
	import segment from '../../components/sk-segmentControl/sk-segmentControl.vue'
	
	
	export default {
		components:{
			singlePage,
			pushPage,	
			groupPage,
			segment
		},
		data() {
			return {
				title: '测评',
				values:['个体','发布'],
				current:0,
				s_evaluation:"false",
				top:0
				// singlePaper:[],
				// singleBanner:[],
				// singlePage:0,
				// singleHaveMore:true,
				
				// publishPaper:[],				
				// publishPage:0,				
				// publishHaveMore:true
			}
		},
		onLoad() {			
			this.s_evaluation = this.config.s_evaluation
			if(this.config.home == false){
				if(this.user.isFirst() == true){
					this.navigate.navigateTo({
						url:"../mine/system/login"
					})
				}
			}
			// uni.startPullDownRefresh({
				
			// })
		},
		onShow() {	
			let info = uni.getSystemInfoSync()
			this.top = info.safeArea.top	
			this.navigate.clearnStack()
			// #ifdef H5
				let index = uni.getStorageSync("eva_index")
				if(index != null){
					this.current = index
				}
				
			// #endif
					
			// uni.setStorageSync("force",this.user.getUserId())
			// if(uni.getStorageSync("force") == "1")
			uni.startPullDownRefresh({
				
			})
		},
		onPullDownRefresh() {
			// if(this.current == 0){
				// this.getSinglePaper()
				if(this.config.s_evaluation == true){
					this.$refs.group.getData()					
				}else{
					this.$refs.single.getData()
				}
				
			// }else{
				this.$refs.publish.getData()
				// this.getPublishPaper()
			// }
			
		},
		onReachBottom() {
			if(this.current == 0){
				if(this.config.s_evaluation == false){
						this.$refs.single.loadMore()
					}				
				// this.loadMoreSinglePaper()
			}else{
				this.$refs.publish.loadMore()
			}
		},
		onPageScroll(e) {
			// console.log(JSON.stringify(e))
			// console.log('ddd')
		},
		
		methods: {
			selectPage:function(e){
				if(this.current != e.currentIndex){
					this.current = e.currentIndex;
					// #ifdef H5
						uni.setStorageSync("eva_index",e.currentIndex)
					// #endif
					
				}			
					
			},
		
		}
	}
</script>

<style>
	.content {
		width: auto;
		/* display: flex;
		flex-direction: column; */
		/* height: 100vh;
		width: 56.2vh; */
		/* max-width: 750rpx;
		max-height: 1334rpx; */
		/* align-items: center;
		justify-content: center; */
		/* background-color: #DD524D; */
		/* max-width: 750rpx; */
		
	}
.nav{
	position: fixed;
	top: 0px;
	width: 100%;
	/* #ifdef H5 */
		height: 44px;
	/* #endif */
	/* #ifdef MP-WEIXIN */
		height: 64px;
	/* #endif */
	/* #ifdef APP-PLUS */
		height: 44px;
	/* #endif */
	z-index: 15;
}
	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

</style>
-->