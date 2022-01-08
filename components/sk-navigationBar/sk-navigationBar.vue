<template>
	<view class="nava-content">
		<view class="background" :style="{'background-color': bgColor,'opacity':opacity}">
			<view class="title">{{title}}</view>
		</view>
		<view class="backView" @click="backClick()">
			<image  v-show="showBack == true"  class="back" src="/static/img/system/back_black.png"></image>
			<view class="back-title" v-show="showBackText">{{backTitle}}</view>
		</view>	
		<view v-show="rightStyle == 1" class="right" v-on:click="rightClick()">
			<image class="img" :src="(rightSelect == true?collectionSelectImg:collectionUnSelectImg)"></image>
		</view>
		<view v-show="rightStyle == 3" class="right" v-on:click="rightClick()">
			<image class="img" :src="rightImg"></image>
		</view>
		<view class="save" v-show="rightStyle == 2" v-on:click="rightClick()">保存</view>
	</view>
</template>

<script>
	export default {
		props: {
			showBack:{
				type:Boolean,
				default:true
			},
			title: {
				type: String,
				default: '北辰心理'
			},
			rightStyle:{
				type:Number,
				default:0
			},
			rightBarButtonImg:{
				type:String,
				default:''
			},
			rightSelect:{
				type:Boolean,
				default:false
			},
			bgColor: {
				type: String,
				default: '#FFFFFF'
			},
			titleColor: {
				type: String,
				default: '#000000'
			},
			backTitle: {
				type: String,
				default: '返回'
			},
			opacity: {
				type: Number,
				default: 1.0
			},
			// collectUrl: {
			// 	type: String,
			// 	default: "../../static/img/science/icon_collection_selected.png"
			// },
			showCollection: {
				type: Boolean,
				default: false
			},
			showBackText: {
				type: Boolean,
				default: true
			},
			canBack:{
				type:Boolean,
				default:true
			}

		},
		data() {
			return {
				show:true,
				rightImg:'',
				shareImg:"/static/img/system/icon_share.png",
				collectionSelectImg:"/static/img/system/icon_collection_selected.png",
				collectionUnSelectImg:"/static/img/system/icon_collection_unselected.png"
			}
		},
		mounted() {
			this.show = this.showBack
		},
		methods: {			
			backClick: function() {
				let _this = this
								
				// #ifdef H5	
				let result = this.$emit("navi-Back",{})
				if(this.canBack == true){
					this.navigate.naviBack(1)
				}							
				// #endif
				// #ifndef H5
					uni.navigateBack({
						
					})
				// #endif
			
			
			},
			rightClick:function(){
				this.$emit("rightClick",{})
			}	
		}
	}
</script>

<style>
	.nava-content {
		position: fixed;
		display: flex;
		flex-direction: row;
		width: 100%;
		min-width: 375px;
		height: 44px;
		align-items: center;
		z-index: 99999;
	}

	.background {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;	
	}
	.backView{
		display: flex;
		flex-direction: row;
		position: absolute;
		left: 0px;
		top: 0px;
		height: 100%;
		width: 65px;		
		align-items: center;
		justify-content: center;
	}
	.back {
		position: absolute;		
		left: 8px;
		top: 13px;
		width: 18px;
		height: 18px;

	}
	
	.right{
		position: absolute;
		/* align-self: ; */
		right: 12px;
		width: 24px;
		height: 24px;
		/* background-color: #000000; */
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.save{
		position: absolute;
		right: 8px;
		width: 40px;
		height: 24px;
		line-height: 24px;
		color: #000000;
	}
	.back-title {
		position: absolute;
		left: 29px;	
		/* height: 40rpx; */
		/* line-height: 40rpx; */
		font-size: 16px;
		color: #000000;
		
	}

	.title {
		position: absolute;
		color: #000000;		
		/* right: 40px; */
		text-align: center;
		left: 65px;
		width: calc(100% - 130px);
		font-size: 16px;
		overflow:hidden;
		text-overflow:ellipsis; 		
		white-space:nowrap;
	}
</style>
