<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class = "navigate" :title="title_bar"
			@rightClick="rightClick()" 			
			@navi-Back="back()"></sknavigate>
		<!-- #endif -->
		<view class="bg">
			<view class="left-list">
				
				<uni-list>
					<uni-list-item class = "left-list-item" v-for="(item,index) in groupList" :key = "index">
						<view class="left-list-item" slot="header" v-on:click="selectGroup(item,index)">
							<view :class= "['left-list-mark',currentGroupIndex == index?'active':'normal']"></view>
							<view class="left-list-font">{{item.CategoryName}}</view>
						</view>					
					</uni-list-item>
				
				</uni-list>
			</view>
			<view class="right-list">
				<scroll-view scroll-y="true" class="scroll">
					<view class="right-list-item" v-for="(item,index) in list" :key="index+100" :clickable="true" v-on:click="toDetail(item)">
						<view class="evaluation-card">
							<view class="evaluation-info">
								<view class="evaluation-recomment-title">综合检查你的心理健康水平</view>								
								<view class="evaluation-name">{{item.PaperName}}</view>
								<view class="evaluation-count-section">
									<image class="evaluation-count-icon" src="../../static/img/evaluation/test_list.png" mode="scaleToFill"></image>
									<view class="evaluation-count-info">{{item.TestCount}}人已测</view>
								</view>
							</view>
							<image class="evaluation-img" :src="item.PaperCoverURL" mode="scaleToFill"></image>
						</view>
						<view class="line"></view>
					</view>
					
				</scroll-view>
				<!-- <uni-list>
					<uni-list-item class="right-list-item" v-for="(item,index) in list" :key="index+100" :clickable="true" v-on:click="toDetail(item)">
						<view slot="body" class="evaluation-card">
							<view class="evaluation-info">
								<view class="evaluation-recomment-title">综合检查你的心理健康水平</view>								
								<view class="evaluation-name">{{item.PaperName}}</view>
								<view class="evaluation-count-section">
									<image class="evaluation-count-icon" src="../../static/img/evaluation/test_list.png" mode="scaleToFill"></image>
									<view class="evaluation-count-info">{{item.TestCount}}人已测</view>
								</view>
							</view>
							<image class="evaluation-img" src="../../static/img/placeholder/test_list_place.png" mode="scaleToFill"></image>
						</view>
					</uni-list-item>					
				</uni-list>		 -->		
				
			</view>			
		</view>
	</view>
</template>

<script>
	import listItem from "./evaluation_list_item.vue";
	export default{
		components: {
		 listItem
		},
		
		data(){
			return{
				groupList:[],
				currentGroupIndex:0,
				evaluation_info:{},
				list:[],
				title_bar:"全部测试"
			}
		},
		onLoad(option) {
			if(option.id){
				let info = uni.getStorageSync(option.id)
				this.groupList = info
				if(option.index){
					this.currentGroupIndex = option.index					
				}else{
					this.currentGroupIndex = 0
				}				
				let item = this.groupList[this.currentGroupIndex]
				this.getPaperList(item.CategoryID)
			}
		},
		onShow() {
			
		},
		methods:{
			back:function(){
				
			},
			selectGroup:function(item,index){
				this.currentGroupIndex = index
				let info = this.groupList[index]
				this.getPaperList(info.CategoryID)
			},
			toDetail:function(item){
				this.navigate.navigateTo({
					url:"evaluation_detail",
					data:{"item":item}
				})
			},
			getPaperList:function(groupId){
				let _this = this
				let list = this.evaluation_info[groupId]
				if(!list || list == undefined || list == null){
					let url = this.api.GetPaperListByCategoryID
					let data = groupId
					
					this.request.startRequest({
						url:url,
						data:JSON.stringify(groupId),
						showLoading:true
					}).then(res=>{
						if(res.data.Code == 0){
							let info = res.data.Data
							if(info && info.length > 0){
								_this.evaluation_info[groupId] = info
								_this.list = info
							}
						}
						
					}).catch(reson=>{
						console.log(reson)
					})
				}else{
					_this.list = list
				}
			}
		}
	}
</script>

<style>
	.contnet{
		width: 100%;
		height: 100%;			
		background-color: rgba(0,0,0,.05);
	}
	.bg{
		width: 100%;
		height: 100%;
		display: flex;
		padding-top: 10px;
	}
	.left-list{
		display: flex;
		width: 28%;
		height: 100%;	
		background-color: rgba(0,0,0,.05);
		
	}
	.right-list{		
		width: 72%;
		height: 100%;
		background-color:rgba(0,0,0,0.03);
		 
	}
	.scroll{
		width: 100%;
		height: 100vh;
	}
	.left-list-item{
		width: 100%;
		height: 40px;	
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.left-list-mark{		
		width: 1.5px;
		height: 100%;
		height: 16px;
		border-radius: 1px;
		margin-left: 10px;
	}
	.normal{
		background-color: #FFFFFF;
	}
	.active{
		background-color: #1F70FD;
	}
	.left-list-font{
		font-size: 14px;
		margin-left: 1px;
		height: 22px;
		line-height: 22px;
	}
	.right-list-item{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100px;
	}
	.evaluation-card{
		display: flex;
		
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		/* margin-top: 5px; */
	}
	.evaluation-img{
		width: 108px;
		height: 74px;
		margin-top: 8px;
		border-radius: 8px;
	}
	.evaluation-info{
		height: 100%;
		width: calc(100% - 125px - 20px);
		margin-left: 20px;
		display: flex;
		flex-direction: column;
	}
	.evaluation-recomment-title{
		margin-top: 6px;
		width: 100%;
		/* height: 20px; */
		line-height: 15px;
		font-size: 14px;
		
		overflow: hidden;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		box-orient: vertical;
		display: -webkit-box;
		display: box;		
	}
	.line{
		width: 100%;
		border-bottom: dotted;
		border-width: 1px;
		border-color: #979797 ;
		/* margin-top: 5px; */
	}	
	.evaluation-name{
		margin-top: 5px;
		font-size: 12px;
		/* height: 18px; */
		line-height: 15px;
		color: rgba(0,0,0,.5);
		overflow: hidden;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		box-orient: vertical;
		display: -webkit-box;
		display: box;	
	}
	.evaluation-count-section{
		display: flex;
		margin-top: 10px;
		align-items: center;
	}
	.evaluation-count-icon{
		width: 8px;
		height: 8px;
	}
	.evaluation-count-info{
		margin-left: 5px;
		font-size: 12px;
		height: 17px;
		line-height: 17px;
	}	
	/deep/.uni-list-item__container{
		padding: 0px 0px 0px 0px !important;
	}
</style>
