<template>
	<view class="content">
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="scroll">
			<view v-for="(item,index) in comment" :key="index" class="for_item">
				<uni-list-item class="uni-list-item__container" direction="column">
					<view slot="body">
						<evaluationItem :value="item" style="height: auto;width: 100%;"></evaluationItem>
						<view class="line_horizontal"></view>
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
	import evaluationItem from "./consult_evaluation_item.vue"
	export default {
		components: {
			evaluationItem,
		},
		
		data() {
			return {						
				userId: '',
				comment: [],								
				currentPage:0,
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: "咨询评价"
			})
			// #ifdef H5
				if(option.id){
					this.userId = uni.getStorageSync(option.id).id
					this.getData()				
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.userId = info.id
					this.getData()
				}
			// #endif
			
			// let thisid = option.id;
			// if (thisid != null) {
			// 	try {
			// 		let info = uni.getStorageSync(thisid);
			// 		this.userId = info.item[0].UserID;
			// 	} catch (e) {
			// 		console.log(e.message)
			// 	}
			// }
		},
		onPullDownRefresh: function() {
			this.force = true
			this.getData();
		},
		
		onReachBottom() {				
			this.loadMore()
		},
		methods: {
			getData: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostMoreComment,
					data: {
						'UserID': _this.userId,
						'PageCount': "10",
						'PageIndex': '0',
					},
					showLoading:true,
					force:_this.force
				}).then(res =>{
					if(res.data.Code == 0){
						_this.comment = res.data.Data;	
						if(_this.comment.length >= 10){
							
							_this.dataStatus = _this.common.DataStatus.Normal
						}else{
						
							if(_this.comment.length == 0){
								_this.dataStatus = _this.common.DataStatus.NoData
							}else{
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}
						}
						_this.currentPage = 0;
					}else{
						if(_this.comment == null || _this.comment.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}					
				}).catch(reason =>{
					if(_this.comment == null || _this.comment.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})
			
			},
			loadMore: function() {
				
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了',
							icon:"none"
						});
					}					
					return;
				}			
				
				let userId = this.user.getUserId()
				
				this.currentPage+=1;
				let _this = this
				this.request.startRequest({
					url:_this.api.PostMoreComment,
					data: {
						'UserID': _this.userId,
						'PageCount': "10",
						'PageIndex': this.currentPage.toString()
					}
				}).then(res =>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data;	
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.comment = _this.comment.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}						
						
					}					
				}).catch(reson =>{
					
				})				
			
			},

			
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		width: 100vw;
		/* height: calc(100vh - var(--window-top)); */
		height: auto;
		background-color: ##FFFFFF;
	}

	.scroll {
		width: calc(100% - 20px);
		height: auto;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 15px;
		padding-bottom: 15px;
		background-color: #FFFFFF;
	}

	.for_item {
		background-color: #FFFFFF;
		margin-bottom: 5px;
		height: auto;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	/deep/.uni-list-item__container {
		padding: 0px 0px 0px 0px !important;
	}

	.noComment {
		width: 100%;
		height: calc(100vh - var(--window-top) - 50px);
		font-size: 15px;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #717171;
	}

	.empty {
		width: 100%;
		height: calc(100vh - var(--window-top) - 300px);
		font-size: 15px;
		color: #b9b9b9;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 15px;
		background-color: #FFFFFF;
	}

	.line_horizontal {
		height: 1px;
		width: 100%;
		background-color: #dddddd;
	}
</style>
