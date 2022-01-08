<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate"></sknavigate>
		<!-- #endif -->
		<view class="">.</view>
		<view class="title">启动页</view>
	</view>
</template>

<script>
	
	export default {
		data(){
			return{
				
			}		
			
		},
		onload(){
		
			
		},
		onShow() {
			let _this = this
			setTimeout(function(){
				_this.toNext()
			},3000)
		},
		methods:{
			toNext:function(){
				if(this.user.getLoginState() == true){					
					uni.reLaunch({
						url:'../../home/home'
					})
				}else{					
					uni.reLaunch({
						url:'../../mine/system/login'
					})
				}
			}
		}
		
		
	}
	
</script>

<style>
	.content{
		width: 100vw;
		height: 100vh;
		background-color: #277CCB;
		
	}
	.title{
		text-align: center;
		margin-top: 200px;
		font-size: 30px;
	}
</style>
