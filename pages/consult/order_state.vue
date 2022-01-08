<template>
	<view class="content">
		<sknavigate class="navigate" 
		:isShow="false"
		:showBackText="false"
		:showBack="false"
		 title="预约成功"		 		 
		 @navi-Back="back"
		 ></sknavigate>
		<view class="back">
			<view>
				<image class="success-image" src="../../static/img/consult/Feinished.png"></image>
				<view class="success-text">预约成功</view>
			</view>
			<view class="tips-text">
				<text>如12小时内咨询师未接受本次预约</text>
				<text>预约自动失效</text>
				<text v-show="config.charge == true">费用将于24小时内原路退还</text>
			</view>
			<view class="button-group">
				<view class="check-order" @click="checkOrder()">查看预约</view>
				<view class="back-main" @click="backToMain()">返回主页</view>
			</view>
		</view>
	</view>
</template>

<script>
	import sknavigate from '../../components/sk-navigationBar/sk-navigationBar.vue'
	export default {
		components:{
			sknavigate
		},
		onLoad(option) {
			// #ifdef H5
				if(option.id!=null){
					let thisid = option.id;
					this.id = thisid
					try{
						let info = uni.getStorageSync(thisid);
						this.appointInfoID = info.AppointInfoID;
						console.log(info.AppointInfoID)
					}catch(e){
						console.log(e.message)
					}
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.appointInfoID = info.AppointInfoID;
				}
			// #endif
		},
		onUnload() {
			
		},
		data() {
			return {
				id:'',
				finish_image: '../../static/img/consult/Feinished.png',
				appointInfoID:'',
				PatientID:"",
			}
		},
		mounted() {
			uni.setNavigationBarTitle({
				title: "支付状态"
			})
			if(this.utils.getLoginState()){
				this.PatientID = this.user.getUserId();
			}
		},
		methods: {
			checkOrder: function() {
				let _this = this;
				if(!_this.utils.getLoginState()){
					uni.showToast({
						title:"请先登录",
						icon:'none',
						duration:1500
					});
					return;
				}
				let item = {
					"AppointInfoID":_this.appointInfoID,
					"PatientID":_this.PatientID
				};
				let info = {
					'publish':'0',
					'item':item
				};
				// let id = _this.utils.createUUID();
				try{
					// uni.setStorageSync(id,info);
					this.navigate.navigateTo({
						url: '../mine/myOrder/my_order_detail',
						data:info
					})					
				}catch(e){
					console.log(e.message)
				}
			},
			backToMain: function() {
				uni.reLaunch({
					url:'./consult'
				})
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh;
		background-color: #f4f4f4;
		
	}
	.back{		
		display: flex; 
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		 padding-top: 10vh;
		padding-bottom: 10vh;
	}
	.navigate{
		position: fixed;
		width: 100%;
		height: 40px;
		top: 0px;
		z-index: 3;
	}
	.success-image {
		height: 100px;
		width: 100px;
		border-radius: 50px;
		margin-top: 20%;
	}

	.success-text {
		font-size: 17px;
		color: #000000;
		margin-top: 5px;
		margin-bottom: 5px;
		text-align: center;
		width: auto;
		height: auto;
	}

	.tips-text {
		display: flex;
		flex-direction: column;
		font-size: 15px;
		color: #a8a8a8;
		text-align: center;
		line-height: 25px;
		width: auto;
		height: auto;
		margin-top: 5px;
		margin-bottom: 25px;
	}

	.button-group {
		width: calc(100% - 50px);
		height: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		padding-left: 25px;
		padding-right: 25px;
		font-size: 15px;
		color: #FFFFFF;

	}

	.check-order {
		background-color: #007AFF;
		width: 100px;
		height: 35px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
	}

	.back-main {
		background-color: #b5b5b5;
		width: 100px;
		height: 35px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
	}
</style>
