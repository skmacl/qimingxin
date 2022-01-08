<template>
	<view class=".consult-content">
		<image class="consult_similar_headphoto" :draggable="false" :src="value.HeadPhotoURL||defaultIcon"></image>
		<view class="consult_similar_name">{{value.RealName}}</view>
		<view class="consult_similar_PsyVocaQualification">{{value.PsyVocaQualification}}</view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{}
		},
		data() {
			return {
				defaultIcon:'../../static/img/consult/order_profle.png',
			}
		},
		methods: {}
	}
</script>

<style>
	.consult-content{
		display: flex;
		flex-direction: column;		
		height: 150px;
	 	justify-content: center;
		align-items: center; 
	
	}
	.consult_similar_headphoto{
		width: 50px;
		height: 50px;
		margin-left: calc(50% - 25px);
		/* margin-left: auto;
		margin-right: auto; */
		/* margin-left: 35rpx; */
		margin-top: 10px;
		border-radius: 25px;
		
	}
	.consult_similar_name{
		width: auto;
		height: 17.5px;
		margin-left: 5px;
		margin-right: 5px;
		margin-top: 5px;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 14px;
		font-weight: bold;
		word-break: break-all;
	}
	.consult_similar_PsyVocaQualification{
		margin-left: 5px;
		margin-right: 5px;
		margin-top: 7.5px;
		font-size: 10px;
		width: auto;
		max-height: calc(100% - 75px - 10px - 5px - 17.5px - 7.5px - 5px);
		color: #717171;
		word-break: break-all;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
	}
</style>
