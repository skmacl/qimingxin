<template>
	<view class="content">			
			<!-- #ifdef H5 -->
				<sknavigate class="navigate" :title="title"></sknavigate>
			<!-- #endif -->
			<uni-list v-show="dataStatus == 1 || dataStatus == 5" v-for="(item,index) in papers" :key = "index">
				<uni-list-item class="scroll-item" :clickable="true" @click="tapItem(item)">
					<view slot="header" class="scroll-item">
						<listItem :value="item"></listItem>	
					</view>
				</uni-list-item>				
			</uni-list>
			<view v-show="dataStatus != 0 && dataStatus != 1">
				<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
			</view>
	</view>
</template>

<script>
	
	import sknavigate from '../../components/sk-navigationBar/sk-navigationBar.vue'
	import listItem from "./evaluation_item.vue"//测评列表item
	export default{
		components:{
		sknavigate,
		listItem		
		},
		data() {
			return{				
				papers: [],
				currentPage: 0,
				dataStatus:this.common.DataStatus.Unload,
				color:"#3399ff",
				navigateOpacity: 0.0,		
				height:460,
				unfold:false,
				type:0,
				userId:'',
				title:"",
				force:false //下拉刷新数据时改为true
			}
		},
		onReady() {
		
		},
		
		onLoad(option) {							
			if(option.type != null){	

				this.type = JSON.parse(option.type)
				if(this.type == "0"){
					this.title = "热门量表"
				}else if(this.type == "1"){
					this.title = "精选量表"
				}else if(this.type == "2"){
					this.title = "免费量表"
				}
				this.getData()
			}
		},
		onPullDownRefresh() {		
			this.force = true
			this.getData()			
		},
		onReachBottom() {
			this.loadMore()
		},
		onPageScroll(obj) {
		
		},
		methods:{
			imageTap: function(){
				this.unfold = !this.unfold;
				let _this = this
				setTimeout(function() {
					let info = uni.createSelectorQuery().select(".remark")
					info.boundingClientRect(function(data){						
						_this.height = data.height*2 + 160
					}).exec()
				}, 10);
			},
		
			back:function(){				
				
			},
			tapItem: function(item){
				let _this = this
				let info = {
					"publishId":'0',
					"item":item
				}
				
				// let id = this.utils.createUUID()
				try {
					// uni.setStorageSync(id,info)
					_this.navigate.navigateTo({
						url:'./evaluation_detail',
						data:info
					})					
				} catch (e){
					console.log(e)
				}				
			
				
				
			},
			getData: function(){					
				let _this = this;
				this.request.startRequest({
					url:_this.api.PostPaperList,
					data:{'Type':_this.type, 'ChargingType':"0", 'PageCount':"10", 'PageIndex':"0", 'PaperID':"0",'UserID':_this.user.getUserId()},
					showLoading:true,
					storageType:600,
					force:_this.force
				})
				.then(res=>{
					if(res.data.Code == 0){
						_this.papers = res.data.Data
						if(_this.papers.length >= 10){
														
								_this.dataStatus = _this.common.DataStatus.Normal
							}else{
							
								if(_this.papers.length == 0){
									_this.dataStatus = _this.common.DataStatus.NoData
								}else{
									_this.dataStatus = _this.common.DataStatus.NoMoreData
								}
							}
						_this.currentPage = 0
						_this.force = true
						// console.log(_this.paperList)
					}else{
						if(_this.papers == null || _this.papers.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
					// console.log(JSON.stringify(res))	
				})
				.catch(reason => {					
					if(_this.papers == null || _this.papers.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})
				
			},
			loadMore: function() {
				console.log('加载更多111');
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
					url:_this.api.PostPaperList,
					data:{Type:_this.type, ChargingType:"0", PageCount:"10", PageIndex:_this.currentPage.toString(), PaperID:"0",UserID:_this.user.getUserId()},
					storage:600,					
					force:_this.force
				})
				.then(res =>{
					if (res.data.Code == 0) {
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
						console.log(_this.papers.length);
						
					}
				})
				.catch(reson => {
					
				});	
			},
		}
	}
</script>

<style>

.content{
	width: 100%;
	height: 100%;
	margin-top: 0;
}

.scroll-item {
	display: flex;
	margin-top: 0px;
	flex-direction: row;
	width: 100%;
	height: 150px;
	background-color: #ffffff;
	/* padding: 0rpx 0rpx 0rpx 0rpx; */
	
}
/deep/.uni-list-item__container{
	padding: 0rpx 0rpx 0rpx 0rpx !important;
}
</style>

