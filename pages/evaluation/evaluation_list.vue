<template>
	<view class="content">
			<!-- <view class="status" :style="{'height':top + 'px'}"></view> -->
			<!-- #ifdef H5 -->
				<sknavigate class="navigate" :style="{'margin-top':top + 'px'}" :bgColor="color"  :title="groupInfo.PaperName" :opacity="navigateOpacity" @navi-Back="back()"></sknavigate>
			<!-- #endif -->

			<image class="top-img" v-on:click="imageTap()" :src="groupInfo.PaperContentURL" mode="aspectFill"
			:style="{'height':height + 'px'}"></image>
			<view class="mask" :style="{'height':height + 'px'}"></view>
			<view class="groupName">{{groupInfo.PaperName}}</view>
			<view  class="remark" v-on:click="imageTap()"  :style="{'-webkit-line-clamp':unfold==true?'unset':'7', 'height':unfold==true?'fit-content':'150px','min-height':'150px'}">{{groupInfo.Remark}}</view>


			<uni-list v-show="dataStatus == 1 || dataStatus == 5" 
				v-for="(item,index) in paperList" :key = "index">
				<uni-list-item class="scroll-item" :clickable="true" @click="tapItem(item)">
					<view slot="header" class="scroll-item">
						<listItem :value="item"></listItem>	
					</view>
				</uni-list-item>				
			</uni-list>
			<view v-show="dataStatus == 2">暂无相关数据</view>
			<view v-show="dataStatus != 0&& dataStatus != 1">
				<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
			</view>

		
		<!-- <view class="test">测试标题</view> -->
	</view>
</template>

<script>	
	
	import listItem from "./evaluation_item.vue"//测评列表item
	export default{
		components:{	
		listItem
		},
		data() {
			return{
				groupInfo:{'PaperName':''},
				paperList:[],
				color:"#3399ff",
				navigateOpacity: 0.0,		
				height:230,
				unfold:false,
				dataStatus:this.common.DataStatus.Unload,
				force:false,
				top:0,
				id:''
			}
		},
		onReady() {
		
		},
		onShow() {
			let info = uni.getSystemInfoSync()
			this.top = info.safeArea.top		
		},
		onLoad(option) {	
			// #ifdef H5
				if(option.id != null){
					let id = option.id
					this.id = id
					this.groupInfo = uni.getStorageSync(id).item;
					// console.log(JSON.stringify(this.groupInfo))
					console.log(this.groupInfo)
					this.getData(this.groupInfo.PaperID)
					let _this = this
					uni.setNavigationBarTitle({
						title:_this.groupInfo.PaperName
					})
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.groupInfo = info.item
					this.getData(this.groupInfo.PaperID)
					let _this = this
					uni.setNavigationBarTitle({
						title:_this.groupInfo.PaperName
					})
				}
			// #endif
			
		},
		onUnload() {
		
		},
		onPullDownRefresh() {
			// this.getData("82004a86-4f41-422f-88ca-e7fb18e950e2")
			this.force = true
			if(this.groupInfo != null){
				this.getData(this.groupInfo.PaperID)
			}
		},
		onPageScroll(obj) {
			let scrollTop = obj.scrollTop
			this.navigateOpacity = 1 - (240 - scrollTop)/240
			console.log(JSON.stringify(obj))
		},
		methods:{
			back:function(){
				
			},
			imageTap: function(){
				this.unfold = !this.unfold;
				let _this = this
				setTimeout(function() {
					let info = uni.createSelectorQuery().select(".remark")
					info.boundingClientRect(function(data){						
						_this.height = data.height + 80
					}).exec()
				}, 10);
			},		
		
			tapItem: function(item){
				let info = {
					"publishId":'0',
					"item":item
				}
				let _this = this
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
			getData: function(paperId){
				let userId = ""
				if(this.user.getLoginState() == true){
					let userInfo = this.user.getUserData()
					userId = userInfo.UserID
				}
				
				
				let _this = this;
				
				this.request.startRequest({
					url:_this.api.PostPaperList,
					data:{"Type":"3", "ChargingType":"0", "PageCount":'50',
					 "PageIndex":"0", "PaperID":paperId,"UserID":userId,"Version":_this.user.getVersion()},					 
					 storage:600,
					 force:_this.force,
					 showLoading:true
				}).then(res => {
					if(res.data.Code == 0){
						_this.paperList = res.data.Data
						if(_this.paperList == null || _this.paperList.length == 0){
							_this.dataStatus = _this.common.DataStatus.NoData
						}else{
							_this.dataStatus = _this.common.DataStatus.Normal
						}			
					}else{
						if(_this.paperList == null || _this.paperList.length == 0){
							_this.dataStatus = _this.common.LoadError
						}
					}
				}).catch(reason => {
					if(_this.paperList == null || _this.paperList.length == 0){
						_this.dataStatus = _this.common.LoadError
					}
				})				
				
			}
		}
	}
</script>

<style>

.content{
	width: 100%;
	height: 100%;
	margin-top: 0px;
	/* overflow: hidden; */
}

.scroll{
	position: absolute;
	width: 100%;
	height: calc(100vh - 65px);
	margin-top: 0px;
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
.top-img{
	position: relative;
	width: 100%;	
	margin-top: 0px;
	/* background-color: #08B6F2; */
}
.top-bag{
	width: 100%;
	height: auto;
	background-color: #4CD964;
}
.mask{
	position: absolute;
	width: 100%;	
	top: 0px;
	background-color: rgba(0,0,0,.3);
	z-index: 1;
}
.groupName{
	position: absolute;
	top: 40px;
	text-align: center;
	width: calc(100% - 36px);	
	z-index: 2;
	font-size: 17px;
	color: #FFFFFF;
}
.remark{
	position: absolute;
	top: 70px;
	left: 18px;
	width: calc(100% - 36px);	
	z-index: 2;	
	color: #FFFFFF;
	font-size: 15px;
	overflow: hidden;
	display: -webkit-box;  
	-webkit-box-orient: vertical;   

}
/deep/.uni-list-item__container{
	padding: 0px 0px 0px 0px !important;
}
</style>
