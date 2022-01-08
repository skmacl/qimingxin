<!-- 测评列表item -->
<template>
	<view class="item-content">
		<image class="scroll-item-img" :src="value.PaperCover" mode="aspectFill" :draggable="false"></image>
		<view class="scroll-item-info">
			<!-- <text class="scroll-item-title font-size-title">{{value.PaperRecommend}}</text> -->
			<text class="scroll-item-subtitle font-size-subtitle">{{value.PaperName}}</text>
			<image v-show="value.IsTest > 0" class="mark" src="../../static/img/evaluation/finishT.png" mode="scaleToFill"></image>
			<view class="test_info">
				<image class="test_pen" :src="place" mode="aspectFill"></image>
				<view class="test_count">{{value.TestCount}}</view>
				<view v-show="config.charge == true" class="price" :style="{'text-decoration': user.getVersion() == '0'?'line-through':'none'}">{{formatPrice(value.Money)}}</view>
				
			</view>
			
		</view>
	</view>
</template>

<script>	
	export default{
		name: "skevaluation",
		props: {
			value: {							
			}
			
		},
		data(){
			return{
				place:'../../static/img/evaluation/test_pen.png'
			}
		},
		mounted() {
			
		},
		methods:{
			formatPrice:function(price){
				if(parseInt(price) == 0){
					return "免费"
				}else{
					return '¥' + parseInt(price)/100 + '.00'
				}				
			}
		}
	}
</script>

<style scoped>
	.item-content{		
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		border-style:none none solid none; 
		border-width: thin;
		border-color: #FFFFFF;
		margin-top: 0px;
	}
	.scroll-item-img{
		margin-top: 18px;		
		margin-left: 15px;		
		margin-bottom: 18px;
		width: 150px;
		height: 114px;
		border-radius:3px;
		background-color: #007AFF;
	}
	.scroll-item-info{
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		margin-top: 18px;
		margin-left: 0px;
		/* padding-right: 10rpx; */
		/* width: max-content; */
		width: calc(100% - 150px - 15px);
		/* width: auto; */
		/* right: 10rpx; */
		height: 114px;
	}
	.scroll-item-title{		
		width: calc(100% - 16px);
		margin-top: 5px;
		margin-left: 8px;
	}
	.scroll-item-subtitle{
		margin-top: 10px;
		margin-left: 8px;
		/* line-height: 30rpx; */
		width: calc(100% - 16px);
		overflow:hidden;		
		text-overflow:ellipsis; 		
		white-space:nowrap;
	}
	.mark{
		position: absolute;
		width: 30px;
		height: 30px;
		right: 0;
		top: 0;
	}
	.test_info{
		display: flex;
		flex-direction: row;
		margin-top: 10px;
	}
	.test_pen{
		margin-left: 5px;
		width: 12px;
		height: 12px;
	}
	.test_count{
		height: 12px;
		line-height: 10px;
		margin-left: 7.5px;
		font-size: 12px;
		color: #808080;
	}
	.price{
		font-size: 12px;
		height: 12px;		
		color:#FF0000;
		margin-left: 100px;
		
	}
</style>
