<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="title" :showBack="true" :showBackText="false"></sknavigate>
		<!-- #endif -->
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				src:'',
				title:''
			}
		},
		onLoad(option) {
			this.src = option.src,
			this.title = option.title
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
