<template>
	<view>
		<uni-popup ref="popup" type="dialog" :maskClick="true">
			<view class="pay-back">
				<view class="pay-title">{{title}}</view>
				<view class="pay-line"></view>
				<view class="pay-info">{{content}}</view>
				<view class="pay-price">{{money}}</view>
				<view class="pay-buttom">
					<view class="pay-cancel" @click="hideInfo()">取消</view>
					
					<uni-link class="pay-confirm" :href="link" :showUnderLine="false" :color="color" text="确定"></uni-link>
					
				</view>
				
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default:"支付确认"
			},
			link:{
				type:String,
				default:''
			},
			content:{
				type:String,
				default:''
			},
			money:{
				type:String,
				default:'0'
			}
			
		},
		data(){
			return{
				show:true,		
				ref:'',
				color:'#000000'
			}
		},
		mounted() {
			this.ref = this.link
			
		},
		unmounted() {
			
		},
		methods:{
			showInfo:function(){
				this.$refs.popup.open()				
			},
			hideInfo:function(){		
				this.$refs.popup.close()
			},
			confirm:function(){
				
				// if(this.ref){
					
				// 		window.open(this.ref)
					
				// }
			},
			abolish:function(){
				this.hideInfo()()
				// this.$emit("abolish",{})
			},
		}		
	}
</script>

<style>
	.pay-back{
		width: 275px;
		/* height: 750rpx; */
		background-color: #FFFFFF;
		border-radius: 10px;
		/* min-height: 150px; */
	}
	.pay-title{
		padding-top: 6px;
		text-align: center;
		font-size: 18px;
		padding-bottom: 5px;
	}
	.pay-line{
		width: 100%;
		height: 1px;
		background-color: #CCCCCC;
	}
	.pay-info{
		margin-top: 10rpx;
		margin-left: 10px;
		font-size: 14px;
		color: #3399FF;
	}
	.pay-info::before{
		color: #000000;
		font-size: 15px;
		content: '您将购买: ';
	}
	.pay-price{
		margin-top: 5px;
		text-align: center;
		color: #FF0000;
	}
	.pay-buttom{
		display: flex;
		flex-direction: row;
		width: 100%;		
		height: 50px;
		/* align-content: space-between; */
	}
	.pay-cancel{
		margin-top: 5px;
		margin-left: 15px;
		width: 30%;
		text-align: center;
		height: 35px;
		line-height: 35px;
		background-color: #FF5A5F;
		border-radius: 5px;
	}
	.pay-confirm{
		margin-top: 5px;
		margin-right: 15px;
		width: 30%;
		text-align: center;
		height: 35px;
		line-height: 35px;
		background-color: #3399FF;
		border-radius: 5px;
		margin-left: calc(40% - 30px);
	}
</style>
