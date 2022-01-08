<template>
	<view class="content" :style="{'margin-top':getMargin() + 'px'}">
		<!-- #ifdef H5 -->
			<sknavigate v-show="s_evaluation == false" class="navigate" title="测评分类"></sknavigate>
		<!-- #endif -->
			<view v-show="dataStatus == 1 || dataStatus == 5" 
			class="list-item" v-for="(item, index) in list" :key="index" v-on:click="itemClick(item)">
			<groupItem :class="[index%2==0?'left':'right']" :title="item.PaperName" :imgUrl="item.PaperCoverURL"></groupItem>
				<!-- <groupItem v-if="index%2==0" class="left" :title="item.PaperName" :imgUrl="item.PaperCoverURL"></groupItem>	
				<groupItem v-else class="right" :title="item.PaperName" :imgUrl="item.PaperCoverURL"></groupItem> -->
			</view>		
			<view v-show="dataStatus == 2">暂无相关数据</view>
			<view class="no-more-data" v-show="dataStatus == 5">没有更多数据了</view>
			<view v-show="dataStatus == 4">加载失败，请点击重试</view>
			<view v-show="dataStatus == 3">网络连接失败，请检查网络</view>
	</view>
		
</template>

<script>
	import groupItem from '../../common/groupItem.vue'
	
	
	export default {
		components:{
			groupItem
		},
		data() {
			return{
				list:[],
				dataStatus:this.common.DataStatus.Unload,
				force:false	,
				s_evaluation:"false",				
			}
		},
		onLoad() {
			this.s_evaluation = this.config.s_evaluation
		},
		mounted() {
			this.getData()
		},
		onPullDownRefresh() {
			this.force = true
			this.getData()
		},
		methods:{
			getMargin:function(){					
				let info = uni.getSystemInfoSync()
				let top = info.safeArea.top
				return this.config.s_evaluation == true?44+top:top					
			},
			itemClick: function(item){
				 // let id = this.utils.createUUID();
				 let info = {
					 "item":item
				 }
				 // uni.setStorageSync(id,info)
				this.navigate.navigateTo({
					url:'./evaluation_list',
					data:info
				})							
			},		
			getData: function(){
				let _this = this;
				this.request.startRequest({
					url:_this.api.PostPaperList,
					data:{"Type":"3", "ChargingType":"0", "PageCount":'50',
					 "PageIndex":"0", "PaperID":'0',"UserID":_this.user.getUserId(),"Version":_this.user.getVersion()},
					 showLoading:true,
					 storage:6000,
					 force:_this.force
				}).then(res =>{
					if(res.data.Code == 0){
						_this.list = res.data.Data
						if(_this.list == null || _this.list.length == 0){
							_this.dataStatus = _this.common.DataStatus.NoData
						}else{
							_this.dataStatus = _this.common.DataStatus.Normal
						}
						// console.log(_this.list)
					}else{
						if(_this.list == null || _this.list.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
				}).catch(reason =>{
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				});			
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;		
	}
	.list{		
	/* 	display: flex;		
		flex-direction: row; */
		width: 100%;
		height: 100%;
		
	}
	.list-item{	
		display: inline-block;		
		width: calc(50% - 5px);
		height: 150px;
		margin-top: 10px;		
	}
	.left{
		/* margin-right: 2%; */
	}
	.right{
		margin-left: 10px;	
	}
</style>
