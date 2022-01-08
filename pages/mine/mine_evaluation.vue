<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="我的测试"></sknavigate>
		<!-- #endif -->
		<view class="top_bar">
			<view v-for="(item,index) in values" :key=index :class="[current==index?'top_bar_item_line':'top_bar_item']" :data-index= index @click="setCurrent">{{values[index]}}</view>	
		</view>
		<view v-show="current == 0">
			<paperUnFinished  ref="finished"></paperUnFinished>
		</view>
		<view v-show="current == 1">
			<paperFinished ref="unFinished"></paperFinished>
		</view>	
	</view>
</template>


<script>
	import paperFinished from './mine_evaluation_finished.vue'
	import paperUnFinished from './mine_evaluation_unFinish.vue'
	export default{
		components:{
			paperFinished,
			paperUnFinished
		},
		data(){
			return{
				values:['未完成','已完成'],
				current:1,
				swiperHeight:1334
				
			}
		},
		onLoad() {
			uni.startPullDownRefresh({
				
			})
		},
		onPullDownRefresh() {
			if(this.current == 0){				
				this.$refs.finished.getData()
			}else{
				this.$refs.unFinished.getData()
			
			}
			
		},
		onReachBottom() {
			if(this.current == 0){
				this.$refs.finished.loadMore()
				
			}else{
				this.$refs.unFinished.loadMore()
			}
		},
		onNavigationBarButtonTap() {
			console.log("123")
			uni.scrollTo()
		},
		
		methods:{
			heightChange(e){
				this.swiperHeight = e.height
			console.log(JSON.stringify(e))	
			},
			setCurrent(e) {
				let thisCurrent = e.detail.current || e.currentTarget.dataset.index || 0;
				this.pageIndex = 0;
				
				if (thisCurrent == 0) {
				
				} else {
					
				}
				this.current = thisCurrent;
				
			},
			selectPage: function(e){
				this.current = e.currentIndex
			}
		}
	}
</script>
<style>
	.content{
		width: 100%;
		height: 100vh;
	}

	uni-swiper{
		position: absolute;
		top: 40px;
	}
	.swiper{
		width: 100%;
		/* height: 100%;	 */
		display: flex;
		flex-direction: row;
	}

	.first{
		width: 50px;
		height: 50px;
		background-color: #4CD964;
	}
	.second{
		width: 50px;
		height: 50px;
		background-color: #4CD964;
		margin-left: 10px;
	}
	
	
	.top_bar {
		position: fixed;
		/* #ifdef H5 */
			top: 40px;
		/* #endif */	
			/* #ifdef APP-PLUS */
			top: 0px;
			/* #endif */
		height: 40px;
		width: 100%;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 3;
	}
	
	.top_bar_item_line {
		width: 50%;
		height: 80%;
		border-bottom: 2.5px solid #08B6F2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 2.5px;
		font-size: 15px;
		color: #55aaff;
	}
	.top_bar_item_line:before{
		left: 20%;
	}
	
	.top_bar_item {
		width: 50%;
		height: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 2.5px;
		font-size: 15px;
		color: #767676;
	}
</style>