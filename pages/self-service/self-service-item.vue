<!-- 测评列表item -->
<template>
	<view class="item-content">
		<image class="self-item-img" :src="value.MaterialCoverPath" mode="scaleToFill" :draggable="false"></image>
		<view class="self-item-info">
			<text class="self-item-title font-size-title">{{value.ItemName}}</text>
			<view class="self-item-bottom">
				<view style="display: flex; flex-direction: row;">
					<image class="self-item-eye" src="../../static/img/home/home_readCount.png"></image>
					<view class="v-count">{{value.Hits}}</view>
				</view>
				<!-- <view class="self-item-type">{{setScienceItemType(value.InfoType)}}</view> -->
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "skevaluation",
		props: {
			value: {}

		},
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {
			setScienceItemType: function(infoType) {
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
		}
	}
</script>

<style>
	.item-content {
		width: 100vw;
		height: 100%;
		display: flex;
		flex-direction: row;
		border-style: none none solid none;
		border-width: thin;
		border-color: #EEEEEE;
	}

	.self-item-img {
		width: 150px;
		height: 114px;
		border-radius: 3px;
		margin-left: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
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
		margin-top: 10px;
		
	}
	.self-item-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;		
		margin-bottom: 10px;
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
		font-size: 14px; 
		color: #007AFF;
		margin-right: 10px;
	}

	
</style>
