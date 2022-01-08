<template>
	<view class="empty-content" :style="{'height':emptyType == 5?'auto':'100vh'}">
	<!-- 	<view v-show="emptyType == 0"></view>
		<view v-show="emptyType == 1"></view>
		<view v-show="emptyType == 2">
			<image class="no-data-img" :draggable="false" src="../../static/img/status/noData.png" mode="widthFix"></image>
			<view class="no-data-title">暂无相关数据</view>
		</view>
		<view v-show="emptyType == 3">
			<image class="no-data-img" :draggable="false" src="../../static/img/status/networkError.png" mode="widthFix"></image>
			<view class="no-data-title">网络不稳定,请检查网络 </view>	
			<button class="button" @click="refresh()">点击重试</button>
		</view>
		<view v-show="emptyType == 4">
			<image class="no-data-img" :draggable="false" src="../../static/img/status/dataError.png" mode="widthFix"></image>
			<view class="no-data-title">系统繁忙,请稍后再试 </view>		
			<button class="button"  @click="refresh()">点击重试</button>
		</view>
		<view v-show="emptyType == 5">
			<view class="no-more">没有更多数据了</view>
		</view> -->
	</view>
</template>

<script>
	export default{
		props:{
			emptyType: {
				type: Number,
				default: 0
			},
			offset:{
				type:Number,
				default:0
			}			
		},
		data(){
			return{
				
			}
		},
		methods:{
			refresh:function(){				
				this.$emit("refresh",{})
			}
		}
	}
</script>

<style>
	.empty-content{		
		align-content: center;
		justify-content: center;		
		display: flex;
		/* background-color: #FAB;
		position: absolute; */
		background-color: #FFF;
		/* height: 100vh; */
		/* max-width: 100%; */
		width: 100%;
	}
	
	.no-data-img{		
		width:50%;
		min-width: 200px;
		/* min-height: 200px;
		max-width: 500px; */
		/* margin-left: 25%; */
		height: auto;		
		margin-top: 20%;
	}
	.no-data-title{
		margin-top: 10px;
		text-align: center;
		opacity: .8;
	}
	.button{
		margin-top: 15px;
		margin-left: 30%;
		width: 40%;
		height: 36px;
		text-align: center;
		background-color: #3399FF;
		line-height: 36px;
		color: #FFFFFF;
		border-radius: 18px;
	}
	.no-more{
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		text-align: center;
		opacity: .6;
	}
</style>
