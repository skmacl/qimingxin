<!-- 机构列表 -->
<template>
	<view class="content" :style="{'margin-top':top + 'px'}">	
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="scroll" @scrolltolower="lower()" :scroll-y="true">
			<view v-for="(item,index) in organizationList" :key="index"	class="item_style">
				<uni-list-item class="item" direction="column" :clickable="true" @click="toOrganizationDetail(item)">
					<view slot="body">
						<organizationItem :value="item" style="height: auto;"></organizationItem>
					</view>

				</uni-list-item>
			</view>
		</uni-list>
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>

<script>
	import organizationItem from '@/pages/consult/organization_item.vue'
	export default {
		components: {
			organizationItem,
		},
		data() {
			return {				
				currentPage: 0,				
				organizationList: [],
				dataStatus:this.common.DataStatus.Unload,
				force:false,
				top:0
			}
		},
		mounted() {
			this.getData();
			let info = uni.getSystemInfoSync()
			// #ifdef H5 
				this.top = info.safeArea.top
			// #endif
			 // #ifdef APP-PLUS
				this.top = info.safeArea.top + 44		
			// #endif
				
		},
		methods: {
			getData: function() {
				let _this = this;
				
				this.request.startRequest({
					url: _this.api.PostOrganization,
					data: {
						"PageCount": "10",
						"PageIndex": "0"
					},
					showLoading:true,
					storage:600,
					force:_this.force,
				}).then(res =>{
					if(res.data.Code == 0){
						_this.organizationList = res.data.Data
						if(_this.organizationList.length >= 10){
														
								_this.dataStatus = _this.common.DataStatus.Normal
							}else{
							
								if(_this.Counselor.length == 0){
									_this.dataStatus = _this.common.DataStatus.NoData
								}else{
									_this.dataStatus = _this.common.DataStatus.NoMoreData
								}
							}
						_this.currentPage = 0						
						res.data.Data.forEach(function(item) {
						
							if (item.InfoType == "02") {
								_this.musicAcacheList.push(item)
							}
						})
					}else{
						if(_this.organizationList == null || _this.Counselor.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
					_this.force = true
				}).catch(reason =>{
					_this.force = true
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})				
			
			},
			loadMore: function(pageIndex) {
				
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了',
							icon:"none"
						});
					}					
					return;
				}
				console.log('加载更多222');
				//获取数据
				
				let _this = this;				
				this.currentPage += 1;
				
				this.request.startRequest({
					url: _this.api.PostOrganization,
					data: {
						"PageCount": "10",
						"PageIndex": this.currentPage.toString()
					},
					showLoading:true,
					storage:600,
					force:_this.force
				})
				.then(res =>{
					if (res.data.Code == 0) {
						let newPapers = res.data.Data;
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.organizationList = _this.organizationList.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}						
						
					}
				})
				.catch(reson => {
					console.log("ddd")
				});					
			},
			toOrganizationDetail: function(item) {
				let _this = this
				let info = {
					'publish': '0',
					'item': item
				};
				// let id = this.utils.createUUID();
				try {
					// uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: './organization_detail',
						data:info
					})					
				} catch (e) {
					console.log(e.message)
				}
				//去到机构详情页面
			},
	

		
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		/* height: calc(100vh - 100rpx); */
		height: auto;	
		margin-top: 0px;
	}

	.scroll {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #dfdfdf;
	}

	.item_style {
		width: 100%;
		height: auto;
	}
	.item{
		margin-top: 10px;
	}
	/deep/.uni-list-item__container {
		padding: 0px 0px 0px 0px !important;
		/* margin-top: 10px; */
	}
</style>
