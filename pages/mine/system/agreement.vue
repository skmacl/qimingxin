<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="item.InfoTitle"></sknavigate>
		<!-- #endif -->
		<web-view style="width: 100vw;" :src="item.InfoOrigin"></web-view>
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
			// #ifdef H5
				if(option.id){
					this.item = uni.getStorageSync(option.id).item
					let _this = this
					uni.setNavigationBarTitle({
						title:_this.item.InfoTitle
					})
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.item = info.item
					let _this = this
					uni.setNavigationBarTitle({
						title:_this.item.InfoTitle
					})
				}
			// #endif
			
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
	}
</style>
