<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="我的收藏"></sknavigate>
		<!-- #endif -->
		<view class="top_bar">
			<view v-for="(item,index) in tmpValues" :key=index :class="[current==index?'top_bar_item_line':'top_bar_item']"
				:data-index=index @click="setCurrent">{{tmpValues[index]}}</view>
		</view>
		<view v-if="config.science == true && config.consult == true">
			<view v-show="current == 0">
				<collectArt ref="collectArt"></collectArt>
			</view>
			<view v-show="current == 1">
				<collectMusic ref="collectMusic"></collectMusic>
			</view>
			<view v-show="current == 2">
				<collectVideo ref="collectVideo"></collectVideo>
			</view>
			<view v-show="current == 3">
				<collectConsulter ref="collectConsulter"></collectConsulter>
			</view>
		</view>
		<view v-else-if="config.science == true || config.consult == false">
			<view v-show="current == 0">
				<collectArt ref="collectArt"></collectArt>
			</view>
			<view v-show="current == 1">
				<collectMusic ref="collectMusic"></collectMusic>
			</view>
			<view v-show="current == 2">
				<collectVideo ref="collectVideo"></collectVideo>
			</view>			
		</view>
		<view v-else>			
			<view>
				<collectConsulter ref="collectConsulter"></collectConsulter>
			</view>
		</view>
	</view>
</template>

<script>
	import collectArt from './mine_collection_art.vue'
	import collectMusic from './mine_collection_music.vue'
	import collectVideo from './mine_collection_video.vue'
	import collectConsulter from './mine_collection_consulter.vue'
	export default {
		components: {
			collectArt,
			collectMusic,
			collectVideo,
			collectConsulter,
		},
		data() {
			return {
				values: ["文章", "音乐", "视频", "咨询师"],
				tmpValues:[],
				current: 0,
			}
		},
		onLoad() {
			console.log("onLoad")
			if(this.config.science == true){
				this.tmpValues = this.tmpValues.concat(this.values.slice(0,3))
			}
			if(this.config.consult == true){
				this.tmpValues = this.tmpValues.concat(this.values.slice(-1))
				
			}
			uni.startPullDownRefresh({

			})
		},
		onShow() {
				let index = uni.getStorageSync("collectionIndex")
				if(index){
					this.current = index
				}
		},
		onPullDownRefresh() {
			console.log("onPullDownRefresh" + this.current)
			if(this.config.science == false){
				this.$refs.collectConsulter.getData()
			}else{
				switch (this.current) {
					case 0: {
						console.log("第一collectArt次执行");
						this.$refs.collectArt.getData()
					}
					break;
				case 1: {
					console.log("collectMusic次执行");
					this.$refs.collectMusic.getData()
				}
				break;
				case 2: {
					this.$refs.collectVideo.getData()
				
				}
				break;
				case 3: {
					this.$refs.collectConsulter.getData()
				}
				break;
				
				}
			}
			
		},
		// onReachBottom() {
		// 	console.log("onReachBottom"+ this.current)

		// 	switch (this.current) {
		// 		case 0: {
		// 			this.$refs.collectArt.loadMore()
		// 		}
		// 		break;
		// 	case 1: {
		// 		this.$refs.collectMusic.loadMore()

		// 	}
		// 	break;
		// 	case 2: {
		// 		this.$refs.collectVideo.loadMore()

		// 	}
		// 	break;			
		// 	case 3: {
		// 		this.$refs.collectConsulter.loadMore()

		// 	}
		// 	break;

		// 	}
		// },
		methods: {
			setCurrent(e) {
				let thisCurrent = e.detail.current || e.currentTarget.dataset.index || 0;
				this.pageIndex = 0;
				this.current = thisCurrent;
				// #ifdef H5
					uni.setStorageSync("collectionIndex",this.current)
				// #endif
			},
			selectPage: function(e) {
				this.current = e.currentIndex
			}
		}



	}
</script>

<style>
	.content {
		width: 100%;
		height: 100vh;	
	}

	.top_bar {
		position: fixed;
		/* margin-top: 40px; */
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
		width: 20%;
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

	.top_bar_item_line:before {
		left: 20%;
	}

	.top_bar_item {
		width: 20%;
		height: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 2.5px;
		font-size:15px;
		color: #767676;
	}
</style>
