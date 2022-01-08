<!-- 个体测试 -->

<template>
	<view class="content">

		<swiper class="swiper" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF"
			:circular="true" :autoplay="true" :interval="3000" :duration="1000">
		 <swiper-item v-for="(item,index) in banners" :key='index'>
				<view class="swiper-item" v-on:click="bannerClick(item)">
					<text class="swiper-item-title font-size-banner">{{item}}</text>
				</view>
			</swiper-item>
		</swiper>
		<view class="section">
			<view class="section-title">每日推荐</view>
			<view class="section-change">换一换</view>
		</view>
		<view class="recommend-card">
			<view class="recommend-card-item" v-for="(item,index) in recommend" :key="index">
				<view class="recommend-img">
					<view class="recommend-card-top">
						<image class="recommend-icon" src="../../static/img/evaluation/evaluation_already.png" mode="scaleToFill">
						</image>
						<view class="recommend-count">122已测</view>
					</view>
					<view class="recommend-title">{{item}}</view>
				</view>
			</view>
		</view>
		<view class="dyn-card">
			<view class="middle-card-item" v-for="(item,index) in evaluation_group" :key = "index">
				<image class="middle-card-item-icon" src="../../static/img/main/home_all.png" mode="scaleToFill"></image>
				<view class="middle-card-item-title">{{item}}</view>
			</view>
		</view>
		<view class="middle-recomment"></view>
		<view class="section">
			<view class="section-title">全部测试</view>
		</view>
		<view class="evaluation-card" v-for="(item,index) in evaluation_recomment" :key="index">
			<view class="evaluation-info">
				<view class="evaluation-recomment-title">综合检查你的心理健康水平</view>
				<view class="line"></view>
				<view class="evaluation-name">{{item}}</view>
				<view class="evaluation-count-section">
					<image class="evaluation-count-icon" src="../../static/img/evaluation/test_list.png" mode="scaleToFill"></image>
					<view class="evaluation-count-info">5000人已测</view>
				</view>
			</view>
			<image class="evaluation-img" src="../../static/img/placeholder/test_list_place.png" mode="scaleToFill"></image>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				banners: ["第一张", "第二张", "第三张"],
				recommend: ["第一个推荐", "第二个推荐", "第三个推荐"],
				evaluation_group:["职业发展","认知测试","情感家庭","智力测试","社会功能","人格测试","康复评定","压力应激","儿童青少年","全部"],
				evaluation_recomment:["SCL90","16PF","SAS","SDS","EPQ"]
			}
		},
		onLoad() {

		},
		onShow() {

		},
		methods: {
			getData: function() {

			},
			loadMore: function() {

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
</style>

<!--
<template>
 <view class="content" :style="{'margin-top':top + 44 + 'px'}">  
   <swiper class="swiper" 
   :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF" 
   :circular="true" :autoplay="true" :interval="3000" :duration="1000">
    <swiper-item v-for="(item,index) in banners" :key='index'>
     <view class="swiper-item" v-on:click="bannerClick(item)">
      <image class="swiper-item-img" :src= "item.PaperContentURL" mode="aspectFill" :draggable="false"></image>
       <text class="swiper-item-title font-size-banner">{{item.BannerTitle}}</text>   
     </view>
    </swiper-item>   
   </swiper>
   <view class="quick-module">
    <view class="quick-module-item" v-for="(item, index) in quickItems" v-bind:key="index" v-on:click="toQuick(index)">
     <image class="quick-module-item-img" :draggable="false" mode="aspectFit" :src="item.icon"></image>
     <text class="quick-module-item-title font-size-subtitle">{{ item.title }}</text>
    </view>
   </view>
   <view class="section-header"><text class="section-title font-size-title">全部测试</text></view>
   <uni-list v-show="dataStatus == 1 || dataStatus == 5" 
   v-for="(item,index) in papers" :key = "index">
     <uni-list-item  class="scroll-item" :clickable="true"  @click="tapItem(item)">
      <view slot="header" class="scroll-item" style="padding-left: 0px;">
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
import listItem from './evaluation_item.vue'; //测评列表item


export default { 
 props:{
  
 },
 components: {
  listItem
 },
 data() {
  return {
   
   quickItems: [
    { title: '热门', icon: '../../static/img/evaluation/test_hot.png' },
    { title: '精选', icon: '../../static/img/evaluation/test_sel.png' },
    { title: '免费', icon: '../../static/img/evaluation/test_free.png' },
    { title: '分类', icon: '../../static/img/evaluation/test_cat.png' }
   ],
   
   userInfo:{},
   banners: [],
   papers: [],   
   currentPage: 0,
   dataStatus:this.common.DataStatus.Unload,
   force:false,
   top:0
   
  };
 },

 mounted() { 
	 let info = uni.getSystemInfoSync()
	 this.top = info.safeArea.top	
	// this.getData()
 },
 onShow() {
 	
 },
 onLoad(){
	
 },
 
 methods: {
  
	  tapItem: function(item) {
	   let _this = this
	   let info = {
	      'publishId': '0',
	      'item': item,	   		
	     };

	   // let id = this.utils.createUUID();
	   
	   
	   try {
		// uni.setStorageSync(id, info);
			_this.navigate.navigateTo({
				url: './evaluation_detail',
				data:info
			})
		
	   } catch (e) {
		// console.log(e)
	   }
	  },
	  //获取数据
		getData: function() {

		 
		 let _this = this;	  
		 let userId = this.user.getUserId()
		 this.request.startRequest({
			  url:_this.api.PostHomeList,
			  data: {
			   UserID: userId,
			   PageCount: '10',
			   PageIndex: '0',
			   Version: '1'
			  },
			  showLoading:true,
			  storage:6000,
			  force:_this.force
		 }).then(res =>{
		  if (res.data.Code == 0) {
		   _this.banners = res.data.Data[0].Banner;
		   _this.papers = res.data.Data[0].Paper;
		   if(_this.papers.length >= 10){
			
			_this.dataStatus = _this.common.DataStatus.Normal
		   }else{
		   
			if(_this.papers.length == 0){
			 _this.dataStatus = _this.common.DataStatus.NoData
			}else{
			 _this.dataStatus = _this.common.DataStatus.NoMoreData
			}
		   }
		   _this.currentPage = 0;
		  }else{
		   if(_this.papers == null || _this.papers.length == 0){
			_this.dataStatus = _this.common.DataStatus.LoadError
		   }
		  }
		  _this.force = true
		 }).catch(reason =>{
		  if(_this.papers == null || _this.papers.length == 0){
		   _this.dataStatus = _this.common.DataStatus.LoadError
		  }
		 }) 
		},
		loadMore: function(pageIndex) {
		 console.log('加载更多111');
		 if(this.dataStatus != this.common.DataStatus.Normal){
		  if(this.dataStatus == this.common.DataStatus.NoMoreData){
		   uni.showToast({
			title:'没有更多数据了',
			icon:"none"
		   });
		  }     
		  return;
		 }
		 console.log('加载更多222');
		 //获取数据
		 let _this = this
		 let userId = this.user.getUserId()
		
		 // console.log(getApp().globalData.defaultUser);
		
		 this.currentPage += 1;
		 this.request.startRequest({
				  url: _this.api.PostHomeList,
				  data:
				  {
					   UserID: userId,
					   PageCount: '10',
					   PageIndex: this.currentPage.toString(),
					   Version: '1'
				  }
			 }).then(res =>{
			  if (res.data.Code == 0) {
			   let newPapers = res.data.Data[0].Paper;
			   if(newPapers == null){        
				_this.dataStatus = _this.common.DataStatus.NoMoreData
			   }else{
				_this.papers = _this.papers.concat(newPapers);
				if(newPapers.length < 10){         
				 _this.dataStatus = _this.common.DataStatus.NoMoreData
				}else{         
				 _this.dataStatus = _this.common.DataStatus.Normal
				}
			   }
			   console.log(_this.papers.length);
			   
			  }
			 }).catch(reson =>{
			  
			 }) 
		},
	    bannerImageError: function(e) {
	     console.error('image发生error事件，携带值为' + e.detail.errMsg);
	    },
		bannerClick: function(item) {
			let href = location.href
		 let info = {
		    'publishId': '0',
		    'item': item,
			'href':href
		   };
		
		   let id = this.utils.createUUID();
		   try {
		    uni.setStorageSync(id, info);
			this.navigate.navigateTo({
				url: './evaluation_detail?id=' + id
			})			
		   } catch (e) {
		    // console.log(e)
		   }
		  },
		  toQuick: function(index) {	
		   switch (index) {
		    case 0: {	
				
				this.navigate.navigateTo({
					url:'./evaluation_quick?type=0'
				})
		     break;
		    }
		    case 1: {
				this.navigate.navigateTo({
					url:'./evaluation_quick?type=1'
				})

		     break;
		    }
		    case 2: {
				this.navigate.navigateTo({
					url:'./evaluation_quick?type=2'
				})
		   
		     break;
		    }
		    case 3: {
				this.navigate.navigateTo({
					url:'./evaluation_group'
				})		     
		     break;
		    }
		   }
		  } 		 		 
		 }
		}
	</script>
<style>
	.content {
	 width: 100%;
	 height: calc(100% - 40px);
	 margin-top: 44px;
	 /* #ifdef APP-NVUE */
		margin-top: 88px;
	 /* #endif */
	 /* top: 100rpx; */
	 /* max-width: 750rpx; */
	}
	.swiper {
	 width: 100%;
	 height: 155px;	
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
	 height: 25px;
	 background: rgba(0, 0, 0, 0.3);
	 padding-left: 8px;
	 padding-top: 5px;
	 color: #ffffff;
	 opacity: 1;
	}
	.quick-module {
	 display: flex;
	 flex-direction: row;
	 background-color: #ffffff;
	 width: 100%;
	 height: 70px;
	}
	.quick-module-item {
	 display: flex;
	 flex-direction: column;
	 top: 0;
	 width: 25%;
	 height: 100%;
	 background-color: #ffffff;
	 align-items: center;
	 justify-content: center;
	}
	.quick-module-item-img {
	 /* left: 35%;
	  top: 15%; */
	 width: 24px;
	 height: 24px;
	}.quick-module-item-title {
	/* display: flex;
	flex-direction: row; */
	text-align: center;
	margin-top: 15px;
	width: 100%;
	height: 15px;
	}
	.section-header {
	margin-top: 5px;
	width: 100%;
	height: 40px;
	background-color: #ffffff;
	}
	.section-title {
	position: absolute;
	margin-left: 16px;
	height: 18px;
	margin-top: 5px;
	}
	.scroll {
	margin-top: 5px;
	width: 100%;
	height: calc(100% - 297px);
	background-color: rgba(0, 0, 0, 0.03);
	}
	.scroll-item {
	display: flex;
	margin-top: 0rpx;
	flex-direction: row;
	width: 100%;
	/* height: 150px; */
	background-color: #ffffff;
	/* padding: 0rpx 0rpx 0rpx 0rpx; */

	}
	.scroll-item-img {
	margin-top: 36rpx;
	margin-left: 30rpx;
	width: 150px;
	height: 114px;
	border-radius: 3px;
	background-color: #007aff;
	}
	.scroll-item-info {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	margin-top: 18px;
	margin-left: 0rpx;
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
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
-->
</style>

