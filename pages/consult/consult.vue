<!-- 咨询师页面 -->
<template>
	<view class="content">
		<view class="status" :style="{'height':top + 'px'}"></view>
			<segment class="nav" :style="{'top':top + 'px'}" :current="current" :values="values" @clickItem="selectPage"></segment>
		<view class="content_consult">
			<view v-show="current === 0">
				<consult ref="consult"></consult>
			</view>
			<view v-show="current === 1">
				<organization ref="organization"></organization>
			</view>
		</view>
		
		<view v-show="s_evaluation == true" class="nava">
			<view class="title">咨询</view>
		</view>
	</view>
</template>

<script>
	import organization from "./consult_organization.vue"
	import consult from "./consult_list.vue"
	import common from '../../common/common.js'
	import segment from '../../components/sk-segmentControl/sk-segmentControl.vue'
	export default {
		components: {
			organization,
			consult,
			segment
		},
		data() {
			return {
				title: '咨询',
				values: ['咨询师', '机构'],				
				current: 0,
				s_evaluation:false,
				top:0
			}
		},
		onLoad() {
			//
			this.s_evaluation = this.config.s_evaluation
			if(this.config.s_evaluation == true){
				this.values = ['咨询师']
			}
			if(this.config.home == false && this.config.evaluation == false){
				if(this.user.isFirst() == true){
					this.navigate.navigateTo({
						url:"../mine/system/login"
					})
				}
			}
		},	
		onShow() {
			let info = uni.getSystemInfoSync()
			this.top = info.safeArea.top	
			this.navigate.clearnStack()	
			let index = uni.getStorageSync("consult_index")
			if(index){
				this.current = index
			}
		},
		methods: {
			selectPage: function(e) {
				if(this.current != e.currentIndex){
					this.current = e.currentIndex;
					uni.setStorageSync("consult_index",e.currentIndex)
				}
			},
			//下拉刷新
			onPullDownRefresh: function() {
				let _this = this;
				if (_this.current == 0){
					_this.$refs.consult.getData();
					} 
				else{ 
					_this.$refs.organization.getData();
					}
			},
			//上拉加载更多
			onReachBottom() {
				let _this = this;
				if (_this.current == 0) {
						_this.$refs.consult.loadMore();
					}
				else {
						_this.$refs.organization.loadMore();
					}
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;		
	}

	.content_consult {
		width: 100%;
		height: calc(100% - 44px);
		display: flex;
		flex-direction: column;
		/* margin-top: 40px; */
	}

	.nav {
		position: fixed;
		top: 0;
		width: 100%;
		height: 44px;
		z-index: 999999;
	}
	.nava{
		position: fixed;
		top: 0;
		width: 100%;
		height: 40px;
		background-color: #3399FF;			
	}
	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 16px;
		color: #FFFFFF;
		margin-top: 10px;
		width: 100%;
		text-align: center;
	}
	
</style>
