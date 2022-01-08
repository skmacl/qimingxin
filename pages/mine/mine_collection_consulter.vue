//咨询师列表
<template>
	<view class="content" >
			<view class="top"></view>
			<uni-list v-show="dataStatus == 1 || dataStatus == 5" v-for="(item,index) in list" :key="index">
				<!-- <view> -->
					<uni-list-item @click="tapItem(item)" :clickable="true">
						<view slot="body">
							<consulorItem :value="item" defaultImage="../../static/img/consult/order_profle.png" style="height: auto;width: 92%;"></consulorItem>
						</view>
					</uni-list-item>
				<!-- </view> -->
			</uni-list>
			<view v-show="dataStatus != 0 && dataStatus != 1">
				<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
			</view>
	</view>
</template>

<script>
	import consulorItem from "../consult/consult_item.vue"; //咨询师列表item
	import utils from "../../common/utils.js"
	export default {
	
		components: {
			consulorItem,
		},
		data() {
			return {				
				list:[],
				ConsultPage: 0,				
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}
		},
		mounted() {
			this.getData();
			let _this = this
			uni.$on("collectionStateChange",function(){
				_this.getData()
			})
		},
		
		unmounted() {
			uni.$off("collectionStateChange",{})
		},
		methods: {
			getData: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostGetMyFavorite,
					data: {
						'UserID': _this.user.getUserId(),
						'Type': "12",
					},
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						_this.list = res.data.Data;	
						if(_this.list.length >= 10){
							
							_this.dataStatus = _this.common.DataStatus.Normal
						}else{
						
							if(_this.list.length == 0){
								_this.dataStatus = _this.common.DataStatus.NoData
							}else{
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}
						}
						_this.currentPage = 0;
					}else{
						if(_this.list == null || _this.papers.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
				}).catch(reason =>{
					if(_this.list == null || _this.papers.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError					}
					
				})
			},
			loadMore: function(pageIndex) {
				
				
			},
			
			tapItem: function(item) {
				let _this = this
				console.log(item.RealName);
				let info = {
					'publish': '0',
					'item': item
				};
				// let id = this.utils.createUUID();
				// console.log(id)
				try {
					// uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: '../consult/consult_detail',
						data:info
					})					
				} catch (e) {
					console.log(e.message)
				}
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		/* display: flex; */
		/* flex-direction: column; */
		background-color: #ffffff;

	}
	
	.top{
		height: 40px;
	}
	.list {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #e2e2e2;
		
	}
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
