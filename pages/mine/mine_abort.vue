<template>
<view class="content">
	<!-- #ifdef H5 -->
		<sknavigate class="navigate" title="关于我们"></sknavigate>
	<!-- #endif -->
	<view class="viewClass">
		<image class="img-img" :src="imgSrc" mode=""></image>
		<text class="Version">{{Version}}</text>
		<text class="name">{{orName}}</text>
		
	</view>
        <view class="viewClass-down">
        	 <text class="down">{{VersionName}}</text>
			 <text class="down">{{VersionName1}}</text>
        </view>
</view>
</template>

<script>
export default {
	data(){
		return{
			orName:'北辰科技',
			Version:'v1.0.0',
			imgSrc:'../../static/img/icon.jpg',
			VersionName:'上海北辰软件股份有限公司',
			VersionName1:'Shanghai Polestar Software Co.Ltd.'
		      }
	      },
		  onLoad() {
		  	uni.getSystemInfo({
		  		success(res) {
		  			this.wh=res.windowHeight;
		  		}
		  	})
		  },
		  computed: {
		 
		  }
	} 
</script>

<style>
	.content{
		width: 100%;
		height: 100%;  
		display: flex;
		
	}
	.viewClass{
		width: 100%;
		height: 80%;  
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 50px;
		
	}
	.viewClass-down{
		width: 100%;
		height: 20%; 
		display: flex;
		position: absolute;
		top: calc(100% - 20%);
		flex-direction: column;
		align-items: center;
		
	}
	.img-img{
		height: 70px;
		width: 70px;
	}
	
	.name{
		font-size: 12px;
		padding-top: 10px;
		color: #555555;
	}
    .Version{
		font-size: 12px;
		padding-top: 10px;
        color: #3399FF;
	}
	.down{
		color: #999999;
		font-size: 12px;
	}
</style>
