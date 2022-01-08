<template>
	<view class="content">
		<!-- 昵称+咨询方式+评分 -->
		<view class="title">
			<view class="title_text_group">
				<view class="nickname">
					<text>{{value.VirtualName}}</text>
				</view>
				<text
					style="font-size: 12px; color: #3399FF;">{{value.ConsultingType}}</text>
			</view>
			<uni-rate class="star" :size="13" color="#ffb638" margin="2" activeColor="#ffb638" :readonly="true" max="5"
				:isFill="false" v-model="value.CommentScore/2"></uni-rate>
		</view>
		<!-- 评价内容 -->
		<view class="common">
			<text class="text">
				{{value.CommentContent}}
			</text>
		</view>
		<!-- 评价时间 -->
		<view class="date">{{value.CreatedDate}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {}
		},
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		padding-top: 10px;
		padding-bottom: 10px;
		align-items: flex-start;
		font-size: 15px;
		background-color: #FFFFFF;
	}

	.title {
		width: calc(100% - 20px);
		height: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
	}

	.title_text_group {
		width: 60%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}

	.common {
		width: 100%;
		height: auto;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.text {
		font-size: 15px;
		color: #181818;
		word-break: break-all;
		width: 100%;
		height: auto;
		/* text-overflow: ellipsis; */
		/* display: -webkit-box; */
		/* -webkit-line-clamp: 4; */
		/* -webkit-box-orient: vertical; */
		/* overflow: hidden; */
	}

	.date {
		font-size: 11px;
		color: #717171;
		margin-top: 5px;
		margin-bottom: 7.5px;
	}

	.nickname {
		font-size: 14px;
		width: auto;
		margin-right: 0px;
		margin-bottom: 7.5px;
		max-width: 150px;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #717171;
	}

	.star {
		width: 40%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
</style>
