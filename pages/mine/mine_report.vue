<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="item.PaperName"></sknavigate>
		<!-- #endif -->
		<web-view class="report" :src="item.PaperReportURL"></web-view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				item:{}
			}
		},
		onLoad(option) {
			if(option.report != null){
				let _this = this
				// console.log(option.report)
				this.item =  JSON.parse(decodeURIComponent(option.report))		
				uni.setNavigationBarTitle({
					title:_this.item.PaperName
				})
			}
		},
		methods:{
			
		}
	}
</script>

<style>
	.content{
		width: 100vw;
		height: 100vh;	
	}
	.report{
		width: 100%;
		height: 100%;	
	}
</style>
