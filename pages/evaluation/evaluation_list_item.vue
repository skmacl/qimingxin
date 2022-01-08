<template>
	<view class="item-content">
		<!-- <view class="evaluation-card"> -->
			<view class="evaluation-info">
				<view class="evaluation-recomment-title">综合检查你的心理健康水平</view>
				<view class="line"></view>
				<view class="evaluation-name"></view>
				<view class="evaluation-count-section">
					<image class="evaluation-count-icon" src="../../static/img/evaluation/test_list.png" mode="scaleToFill"></image>
					<view class="evaluation-count-info">5000人已测</view>
				</view>
			</view>
			<image class="evaluation-img" src="../../static/img/placeholder/test_list_place.png" mode="scaleToFill"></image>
		<!-- </view> -->
	</view>
	
</template>

<script>
	export default{
		name:"listItem",
		props:{
			item:{}
		},
		data(){
			return{
				// item:{}
			}			
			
		},
		mounted(){
			
		},
		methods:{
			
		}
	}
</script>

<style>
	.item-content{
		display: flex;
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		margin-top: 5px;
	}
	.evaluation-card{
		display: flex;
		width: 100%;
		height: 100%;
		
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
