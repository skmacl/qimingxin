<!-- 自助、测评分类使用 -->
<template>
	<view class="group-content">
		<image class="img" :src="imgUrl" mode="aspectFill"></image>
		<view class="mask"></view>
		<view class="title">{{title}}</view>
	</view>
</template>

<script>
	export default{
		name:"groupItem",
		props: {
			title:'',
			imgUrl:''
		},
		data() {
			return{
				
			}
		},
		mounted() {
			
		},
		methods:{
			
		}
	}
</script>

<style>
	.group-content{
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #4CD964;
		align-items: center;
		justify-content: center;
	}
	.img{
		/* position: relative; */
		width: 100%;
		height: 100%;		
	}
	.mask{
		position: absolute;		
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		/* margin: auto; */
		z-index: 2;
		background-color: rgba(0,0,0,.3);
	}
	.title{
		position: absolute;
		left: 0;
		top: calc(50% - 10px);
		text-align: center;
		width: 100%;
		height: 20px;
		font-size: 18px;
		z-index: 3;
		color: #FFFFFF;
	}
</style>
