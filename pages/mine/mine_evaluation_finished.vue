<template>
	<view class="content">			
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" v-for="(item,index) in papers" :key = "index">
			<uni-list-item direction="column" :clickable="true" @click="tapItem(item)">
				<view slot="header">
					<view class="section-header">完成时间:{{item.CreatedDate}}</view>
				</view>
				<view slot="body" class="scroll-item">
					<listItem :value="item"></listItem>	
				</view>
				<view slot="footer">
					<view class="section-footer"></view>
				</view>
			</uni-list-item>														
		</uni-list>	
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>

<script>
	import listItem from "../evaluation/evaluation_item.vue"//测评列表item
	export default{
		components:{
		listItem	
		},
		data(){
			return{
				papers:[],							
				currentPage:0,				
				dataStatus:this.common.DataStatus.Unload,
				force:false
			}
			
		},
		onLoad() {
			
		},
		mounted() {
			this.getData()
		},		
		methods:{
			tapItem: function(item){
				console.log('12345')
				let _this = this
				if(item.IsCheckReport == 1){
					let info = {"PaperName":item.PaperName,"PaperReportURL":item.ReportUrl}
					_this.navigate.navigateTo({
						url:'/pages/mine/mine_report?report=' + encodeURIComponent(JSON.stringify(info))
					})	
				// }else{
					// this.request.startRequest({
					// 	url:_this.api.GetAppReport,
					// 	data: JSON.stringify(item.PaperResult),
					// 	showLoading:true
					// }).then(res =>{
					// 	if(res.data.Code == 0){
					// 		let result = res.data.Data[0]
					// 		let info = {"PaperName":item.PaperName,"PaperReportURL":result.PaperReportURL}
					// 		_this.navigate.navigateTo({
					// 			url:'/pages/mine/mine_report?report=' + encodeURIComponent(JSON.stringify(info))
					// 		})						
					// 	}
					// }).catch(reason =>{
						
					// })
				}else{
					uni.showToast({
						title:"暂无权限，请联系管理员"
					})
				}
							
			},
			changeHeight: function(){
				let height = 0
				
				if(this.papers != null && this.papers.length > 0){
					height = 390 * this.papers.length
				}else{
					height = 0
				}
				this.$emit('heightChanged',{
					"height":height
				})
			},
			//获取数据
			getData: function(){
				if(this.user.getLoginState() == true){
					this.userInfo = this.user.getUserData()
				}
				let _this = this;
				
				let userId = this.user.getUserId()
				this.request.startRequest({
					url:_this.api.GetMyTestResultList,
					data: {
						'UserID':userId,
						'pageSize':'10',
						'pageIndex':'0'
						// 'Version' : _this.user.getVersion()
						},
						showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						_this.papers = res.data.Data;	
						if(_this.papers.length >= 10){
							
							_this.dataStatus = _this.common.DataStatus.Normal
						}else{
						
							if(_this.papers.length == 0){
								_this.dataStatus = _this.common.DataStatus.NoData
							}else{
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}
						}
						_this.currentPage = 0;
					}else{
						if(_this.papers == null || _this.papers.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
					console.log(_this.papers.length)
					
					// _this.changeHeight()
					_this.force = true
				}).catch(reson =>{
					if(_this.papers == null || _this.papers.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
					_this.force = true
				})
				
			},
			loadMore:function(pageIndex){					
				
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
					url:_this.api.PostPaperReportListByConfig,
					data: {
						'UserID':userId,
						'pageSize':'10',
						'pageIndex':(_this.currentPage).toString(),
						
					},
				}).then(res =>{
					if(res.data.Code == 0){
						let newPapers = res.data.Data;	
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.papers = _this.papers.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}						
						
					}
					// _this.changeHeight()
				}).catch(reson =>{
					
				})
			
			},
		
			
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;		
		/* #ifdef APP-PLUS */
			margin-top: 44px;
		/* #endif */
		/* #ifdef H5 */
		margin-top: 84px;
		/* #endif */
		/* background-color: #4CD964; */
	}
	.section-header{
		margin-top: 5px;
		width: 100%;
		height: 40px;
		background-color: #FFFFFF;			
		line-height: 40px;
		padding-left: 10px;
		font-size: 13px;
		border-style: none none solid none;
		border-width: .25px;
		border-color: #EEEEEE;
	}
	.section-footer{
		margin-top: 0px;
		width: 100%;
		height: 5px;
		background-color: rgba(0,0,0,.03);			
	}
	.section-title{
		position: absolute;
		margin-left: 16px;
		height: 18px;
		margin-top: 5px;
		
	}
	.scroll{
		/* margin-top: 10rpx; */
		width: 100%;
		height: calc(100vh - 50px);
		background-color:rgba(0,0,0,0.03);
	}
	.section{
		background-color: #FFFFFF;
	}
	.scroll-item{
		display: flex;
		flex-direction: row;
		width: 100%;	
	
		background-color: #FFFFFF;
	}
	/deep/.uni-list-item__container{
		padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
