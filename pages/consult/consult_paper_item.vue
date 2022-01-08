<template>
	<view class="content">
		<view class="paper_part">
			<image class="paper_image" :src="value.InfoCover"></image>
			<!-- <image class="paper_image"></image> -->
			<view class="paper_info">
				<view class="paper_title">{{value.InfoTitle}}</view>
				<view class="others">
					<view class="reader_number">
						<image class="icon" src="../../static/img/consult/icon_view_num.png"></image>
						<view>{{value.HitsCount}}</view>
					</view>
					<view class="paper_author">{{value.InfoAuthor}}</view>
				</view>
			</view>
		</view>
		<view class="line"></view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		width: auto;
		height: 100px;
		padding-top: 10px;
		padding-bottom: 15px;
		justify-content: space-between;
	}

	.paper_part {
		display: flex;
		flex-direction: row;
	}
	
	.line{
		width: 100%;
		height: .5px;
		margin-top: 10px;
		background-color: #d3d3d3;
	}

	.paper_image {
		width: 125px;
		height: 90px;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 2.5px;
	}

	.paper_info {
		display: flex;
		flex-direction: column;
		width: calc(100% - 125px - 10px - 10px);
		height: 90px;
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 10px;
		justify-content: space-between;
	}

	.paper_title {
		font-size: 17px;
		color: #000000;
		width: auto;
		height: auto;
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.paper_introduction {
		font-size: 12.5px;
		color: #717171;
		margin-top: 7.5px;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.icon {
		width: 12.5px;
		height: 12.5px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 4px;
		margin-left: 5px;
		margin-right: 5px;
	}

	.others {
		display: flex;
		flex-direction: row;
		margin-top: 7.5px;
		font-size: 12px;
		margin-right: 5px;
		margin-bottom: 5px;
		justify-content: space-between;
	}

	.reader_number {
		display: flex;
		flex-direction: row;
		color: #717171;
	}

	.paper_author {
		color: #007AFF;
	}
</style>
