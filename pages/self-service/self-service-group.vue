<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="video_title"></sknavigate>
		<!-- #endif -->		
		<uni-list>
			<uni-list-item class="groupItem"  v-for="(item,index) in list" :key="index" style="background-image: url(item.ItemCover);" v-on:click="itemClick(item)" :clickable="true">
				<view class="groupItem-view" slot="header">
					<view class="group-name">{{item.ItemName}}</view>
					<view class="group-count">{{typeName}}数{{item.MCount}}    收藏数{{item.SumHits}}</view>
				</view>
			</uni-list-item>
			
		</uni-list>
		
	</view>
</template>

<script>
	import groupItem from '../../common/groupItem.vue'
	export default {
		data() {
			return {
				video_title: '',
				icon: "https://www.bcxl.cn:9224/CMS/Material/ItemMng/ItemPicture/636344249389215164.jpg",
				list: [],
				type: '',
				typeName:'',
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}
		},
		components: {
			groupItem
		},
	
		onPullDownRefresh() {
			// this.getData();
		},
		
		onLoad(option) {
			if (option.type != null) {
				let _this = this;
				_this.type = option.type;
				console.log(_this.type)
				if (_this.type == "01") {
					_this.video_title = "心理文章"
					_this.typeName = "文章"
				} else if (_this.type == "03") {
					_this.video_title = "心理音乐"
					_this.typeName = "音乐"
				} else {
					_this.video_title = "心理视频"
					_this.typeName = "视频"
				}
				this.getData()
			};
			uni.setNavigationBarTitle({

			});
		},

		methods: {
			itemClick: function(item) {
				// console.log(JSON.stringify(item) + "***");
				let info = {
					item: item
				};			
				// let id = this.utils.createUUID();
				let _this = this
							
				this.navigate.navigateTo({
					url: "./self-service-groupList?type="+this.type + "&itemID="+item.ItemID,					
				})
					
						
			},

			getData: function() {
				let _this = this;
				this.request.startRequest({
					url:_this.api.GetItemList,
					data: JSON.stringify(_this.type),
					showLoading:true,
					storageType:600,
					force:_this.force
				})
				.then(res=>{
					if(res.data.Code == 0){
						_this.list = res.data.Data;
						_this.force = true					
					}else{
						if(_this.list == null || _this.list.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}				
				})
				.catch(reason => {					
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})
			
			}

		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
	}

	.groupItem{
		width: 100%;
		height: 150px;
		background-color: #000000;
		/* background-image: url(../../static/img/science/self_group.png);		 */
	}
	.groupItem-view{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		/* justify-content: center; */
		align-items: center;
		
	}
	.group-name{
		width: 150px;
		height: 40px;	
		line-height: 40px;
		text-align: center;
		border-radius: 3px;
		border-style:solid;
		border-width: 1px;
		border-color: #FFFFFF;
		width: 150px;
		
		color: #FFFFFF;
		
	}
	.group-count{
		width: 100%;
		font-size: 12px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		color: #FFFFFF;
		margin-top: 10px;
		/* background-color: #4CD964; */
	}
	/deep/.uni-list-item__container {
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
