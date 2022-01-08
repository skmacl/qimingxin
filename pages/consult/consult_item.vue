<!-- 咨询师列表item -->
<template>
	<view class="item-content">
		<!-- 咨询师信息 -->
		<view class="zixunshi_item">
			<!-- 咨询师头像 -->
			<image class="consult_headphoto" mode="aspectFill" :src="value.HeadPhotoURL||defaultImage"></image>
			<!-- <image class="consult_headphoto" mode="aspectFill" src="../../static/img/consult/order_profle.png"></image> -->
			<view class="zixunshi_introction">
				<view class="zixunshi_title">
					<!-- 咨询师姓名 -->
					<text class="zixunshi_name">{{value.RealName}}</text>
					<!-- 咨询师专业级 -->
					<text class="zixunshi_price">{{value.PsyVocaQualification}}</text>
					<!-- 咨询价格 -->
					<text v-show="config.charge == true" class="price" :style="{'text-decoration':user.getVersion() == 0?'line-through':'none'}">{{getPrice(value.PriceStandard)}}</text>
				</view>
				<!-- 擅长 -->
				<view class="zixunshi_skill">{{value.Skill}}</view>
				<!-- 专业领域 -->
				<view class="zixunshi_skill">{{value.Profession}}</view>
			</view>
		</view>
		<!-- 分割线 -->
		<view style="width: auto; height: 0.5px; background-color: #EEEEEE;"></view>
		<!-- 评分 -->
		<view class="evaluation">
			<image class="evaluation_icon" src="@/static/img/consult/icon_order_message.png"></image>
			<text class="evaluation_text">{{value.ConsultNum}}人咨询过</text>				
			<image class="evaluation_icon" src="@/static/img/consult/icon_order_grade.png"></image>
			<text class="evaluation_text">评分{{value.CommentScore}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			value:{},
			defaultImage:String,
		},
		data(){
			return {
				defaultconsultIcon: "../../static/img/consult/order_profle.png",
			}
		},
		methods:{
			getPrice:function(priceStandard){
				if(priceStandard==0||priceStandard==null){
					return "免费";
				}else{
					return "￥"+(priceStandard/100).toFixed(0)+"."+(priceStandard%100/10).toFixed(0)+(priceStandard%10).toFixed(0);
				}
			}
		}
	}
</script>

<style>
	.item-content{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		max-height: 200px;		
		background-color: #ffffff;		
	}
	.zixunshi_item{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: auto;
	}
	.zixunshi_introction{
		width: calc(100% - 105px);
		height: auto;
		margin-left: 0px;
		margin-right: 10px;
		margin-bottom: 10px;
		margin-top: 10px;
	}
	.zixunshi_title{
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
	}
	.zixunshi_name{
		font-size: 17px;
		font-weight:bold;
		text-align: left;
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow: hidden;
		width: 75px;
		margin-right: 25px;
		text-wrap:none;
	}
	.zixunshi_price{
		text-align: right;
		width: auto;
		font-size: 12px;
		margin-top: auto;
		margin-bottom: auto;
		max-lines: 1;
		color: #999999;
		width: calc(100% - 120px);
	}
	.price{
		font-size: 12px; 
		white-space: nowrap;
		margin-top: auto;
		margin-bottom: auto;
		display: flex;
		flex-direction: row;
		color: #FF5A5F;
	}
	.zixunshi_skill{
		margin-top: 7.5px;
		height: auto;
		max-height: 100px;
		font-size: 14px;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.consult_headphoto{
		width: 75px;
		height: 75px;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 40px;
	}
	.evaluation{
		width: 100vw;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.evaluation_icon{
		width: 15px;
		height: 15px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 3px;
		margin-left: 25px;
	}
	.evaluation_text{
		text-align: center;
		color: #8F8F94;
		font-size: 12.5px;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 7.5px;
	}
</style>
