<template>
	<view class="org-content">
		<view class="organization_main">
			<image :src="value.OrgLogo" class="organization_logo"></image>
			<view class="organization_info">
				<view class="organization_name">{{value.DeptName}}</view>
				<view class="organization_info_text">{{value.DeptRecommand}}</view>
				<view class="organization_info_text" style="font-size: 14px;">{{value.Remark}}</view>
			</view>
		</view>
		<view class="line_horizontal"></view>
		<view class="consult_score">
			<image class="consult_score_icon" src="@/static/img/consult/icon_order_message.png"></image>
			<view class="consult_score_text">{{value.ConsultNum+"人咨询过"}}</view>
			<image class="consult_score_icon" src="@/static/img/consult/icon_order_grade.png"></image>
			<view class="consult_score_text">{{"评分"+value.CommentScore}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{},
		},
		data() {
			return {
				// defaulticon:"@/static/img/NODate.png",
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.org-content{
		width: 100vw;
		height: auto;
		max-height: 175px;
		display: flex;
		flex-direction: column;
		padding-top: 10px;
		background-color: #ffffff;
		margin-top: 10px;
	}
	.line_horizontal{
		width: 100%;
		height: .5px;
		background-color: #cbcbcb;
	}
	.organization_main{
		width: 100%;
		height: 100px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.organization_logo{
		width: 75px;
		height: 75px;
		margin-left: 10px;
		margin-right: 15px;
		border-radius: 40px;
	}
	.organization_info{
		width: calc(100% - 125px);
		height: 100%;
		display: flex;
		padding-right: 10px;
		padding-top: 10px;
		padding-bottom: 7.5px;
		flex-direction: column;
		justify-content: space-around;
	}
	.consult_score{
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.consult_score_icon{
		width: 15px;
		height: 15px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 3px;
		margin-left: 25px;
	}
	.consult_score_text{
		text-align: center;
		color: #8F8F94;
		font-size: 12px;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 7.5px;
	}
	.organization_name{
		width: 100%;
		height: 35%;
		font-size: 18px;
		font-weight: bold;
		white-space: nowrap;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.organization_info_text{
		width: 100%;
		height: 30%;
		font-size: 11px;
		white-space: nowrap;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
