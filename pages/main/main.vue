<template>
	<view class="content">
		<view class="header-back">
			<uni-search-bar placeholder="输入开始搜索"  @confirm="searchBarBegin" @input="searchInput" />
			<view class="top-card">
				<view class="top-card-top">
					<image class="top-card-icon" src="../../static/img/main/psychological_icon.png" mode="scaleToFill"></image>
					<view class="top-card-title">专属心理档案</view>
					<view class="top-card-push" v-on:click="toPublish()">团体测评</view>
				</view>
				<view class="top-card-bottom">
					<view class="top-card-bottom-card" v-for="(item,index) in top_info" :key="index">
						<view class="top-group-top">
							<image class="top-group-icon" src="../../static/img/main/evaluation_icon.png" mode="scaleToFill"></image>
							<view class="top-group-title">{{item.name}}</view>
						</view>
						<view class="top-group-bottom">
							<view class="top-bottom-tip"></view>
							<view v-if="index == 0" class="top-bottom-count">{{homeInfo.TestCount}}次</view>
							<view v-if="index == 1" class="top-bottom-count">{{homeInfo.CriWarCount}}次</view>
							<view v-if="index == 2" class="top-bottom-count">{{homeInfo.PsySelfHelpCount}}次</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="dyn-card">
			<view class="middle-card-item" v-for="(item,index) in homeInfo.CategoryList" v-if="index <= 9" :key = "index" v-on:click="toPaper(item,index)">
				<image class="middle-card-item-icon" :src='item.CategoryIcon' mode="scaleToFill"></image>
				<view class="middle-card-item-title">{{item.CategoryName}}</view>
			</view>
		</view>
		<!-- <view class="section-title">咨询预约</view>
		<view class="consult-card">
			<view class="counselor-item" v-for="(item,index) in homeInfo.Consultants" :key="index" v-on:click="toDetail()">
				<view class="consult-card-top">
					<image class="consult-header" :src="item.HeadImgUrl" mode="scaleToFill"></image>
					<view class="consult-name">{{item.Name}}</view>
					<view class="consult-leave">{{item.Positioin}}</view>
				</view>
				<view class="line"></view>
				<view style="font-size: 8px;margin-top: 2px;margin-left: 5px;-webkit-transform:scale(0.67);-webkit-transform-origin-x: 0; ">擅长:</view>
				<view class="gootAt">{{item.SkillField}}</view>
			</view>
		</view> -->
		<view class="section-title">心理科普</view>
		<!-- <view class="science-card">
			<view class="science-item" v-for="(item,index) in science" :key="index">
				<image class="science-bg" :src="item" mode="scaleToFill"></image>
			</view>
		</view> -->
		<view style="height: 10px;"></view>
		<view class="evaluation-card" v-for="(item,index) in homeInfo.MaterialList" :key="index + 100"  v-on:click="tapItem(item,index)">
			<view class="evaluation-info">
				<view class="evaluation-recomment-title">{{item.MaterialName}}</view>
				<!-- <view class="line"></view> -->
				<!-- <view class="evaluation-name">{{item}}</view> -->
				<view class="evaluation-count-section">
					<image class="evaluation-count-icon" :src="item.MaterialCover" mode="scaleToFill"></image>
					<view class="evaluation-count-info">{{item.Hits}}浏览</view>
				</view>
			</view>
			<image class="evaluation-img" :src="item.MaterialCover" mode="scaleToFill"></image>
		</view>
		<loginModule ref="login" @success="loginSuccess"></loginModule>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				homeInfo:{},
				counselor: [],
				science: [],
				top_info:[{"icon":"../../static/img/main/evaluation.png","name":"心理测评","count":"55"},
				{"icon":"../../static/img/main/warning.png","name":"危机预警","count":"68"},
				{"icon":"../../static/img/main/science.png","name":"心里自助","count":"6"}],
				evaluation:[]
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {

		},
		methods: {
			loginSuccess:function(){
				
			},
			login:function(){
				let _this = this
					uni.showModal({
						title:"用户未登录",
						content:"检测到您尚未登录，是否去登录？",
						success(e) {
							if(e.confirm == true){							
								_this.$refs.login.showLogin()						
							}
						}
					})				
			},
			getData:function(){
				let url = this.api.PostMain
				let _this = this
				this.request.startRequest({
					url:url,
					data:JSON.stringify(_this.user.getUserId()),
					showLoading:true
				}).then(res=>{
					if(res.data.Code == 0){
						_this.homeInfo = res.data.Data
						console.log(JSON.stringify(res))
					}
				}).catch(reson =>{
					console.log("dd")
				})
			},
			searchBarBegin: function(e) {
				console.log(JSON.stringify(e))
			},
			searchInput: function(e) {
				console.log(JSON.stringify(e))
			},
			tapItem(item,index){
				
				if(item.MaterialType == "01"){
					let info = {
						item: item
					};								
						this.navigate.navigateTo({
							url: './self-service-art?src='+item.MaterialPath+'&title='+item.ItemName,
							data:info
						})	
				}else if(item.MaterialType == "03"){
					let ite = {"HitsCount":item.Hits,"InfoID":item.MaterialID,"InfoTitle":item.ItemName,"InfoCover":item.MaterialCoverPath,"InfoOrigin":item.MaterialPath}
					let info = {
						"item":ite
					}
					let id = this.utils.createUUID()
					uni.setStorageSync(id,info)							
					uni.setStorageSync('musicAcachePosition',0)
					uni.setStorageSync('musicAcacheList',[ite])
					this.navigate.navigateTo({
						url: './self-service-music?id=' +id
					})	
				}else if(item.MaterialType == "04"){
					let info = {
						"item":item
					}				
					this.navigate.navigateTo({
						url: './self-service-video',
						data:info
					})	
				}
			},
			toDetail:function(){
				
				this.navigate.navigateTo({
					url:"../evaluation/evaluation_detail"
				})
			},
			toPublish:function(){
				if(this.user.getLoginState() == true){
					this.navigate.navigateTo({
						url:"../evaluation/evaluation_publish"
					})
				}else{
					this.login()
				}
				
			},
			toPaper:function(item,index){
				let _this = this
				this.navigate.navigateTo({
					url:'../evaluation/evalaution_allList?index='+index,
					data:_this.homeInfo.CategoryList
				})
			}
		}

	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		margin-top: 0px;
		background-color: rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
	}

	.header-back {
		top: 0px;
		width: 100%;
		height: 130px;
		background: linear-gradient(#0175FE, #84BFFE);
	}

	.top-card {
		display: flex;
		flex-direction: column;
		margin-left: 4%;
		width: 92vw;
		height: 80px;
		background-image: url(../../static/img/main/psychological_back.png);
		background-size: 100%;
		background-color: #FFFFFF;
		margin-top: 5px;
		border-radius: 10px;
	}

	.dyn-card {
		display: flex;		
		margin-left: 4%;
		width: 92vw;
		height: 160px;
		background-color: #FFFFFF;
		margin-top: 20px;
		border-radius: 10px;
		/* justify-content: space-between; */
		flex-flow: row wrap;
	}

	.section-title {
		padding-left: 5%;
		width: 100%;
		height: 30px;
		line-height: 30px;
		background-color: #FFFFFF;
		color: #020200;
		font-size: 16px;
		margin-top: 24px;
	}

	.consult-card {
		display: flex;
		flex-direction: row;
		margin-left: 3%;
		width: 94%;
		height: 200px;
		margin-top: 10px;		
	}

	.counselor-item {
		display: flex;
		flex-direction: column;
		width: 120px;
		height: 190px;
		margin-left: 1%;
		border: 4px;
		background-color: #FFFFFF;
		/* align-items: center; */
	}

	.science-card {
		display: flex;
		flex-direction: row;
		margin-left: 3%;
		width: 94%;
		height: 120px;
		margin-top: 10px;
		bottom: 20px;
	}

	.science-item {
		width: 120px;
		height: 120px;
		margin-left: 1%;
		border: 4px;
		background-color: #FFFFFF;
	}

	.science-bg {
		width: 100%;
		height: 100%;
	}
	.top-card-top{
		display: flex;
		flex-direction: row;
		margin-left: 10px;
		margin-top: 10px;
	}
	.top-card-icon{
		width: 10px;
		height: 14px;
	}
	.top-card-title{
		margin-left: 5px;
		font-size: 15px;
		line-height: 16px;
	}
	.top-card-push{
		width: 65px;
		height: 16px;
		margin-left: 5px;
		margin-top: 2px;
		font-size: 8px; /*-webkit-transform:scale(0.67);*/
		color: #FFFFFF;
		text-align: center;
		/* line-height: 16px; */
		background-image: url(../../static/img/main/push.png);
		background-size: 100%;
	}
	.top-card-bottom{
		display: flex;
		flex-direction: row;
		margin-left: 10px;
	}
	.top-card-bottom-card{
		width: 70px;
		margin-top: 10px;		
	}
	.top-group-top{
		display: flex;
		flex-direction: row;
		
	}
	.top-group-icon{
		width: 10px;
		height: 10px;
		
	}
	.top-group-title{
		font-size: 12px; 
		margin-left: 5px;
		line-height: 10px;
	}
	.top-group-bottom{
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 5px;
		justify-content: center;
		align-items: center;
	}
	.top-bottom-tip{
		width: 3px;
		height: 3px;
		background-color: #F0AD4E;		
		
		
	}
	.top-bottom-count{
		font-size: 8px;
		margin-left: 5px;		
	}
	
	
	.middle-card-item{
		display: flex;
		flex-direction: column;
		width: 20%;	
		height: 50%;	
		align-items: center;

		/* justify-content: center; */
	}
	
	.middle-card-item-icon{
		width: 26px;
		height: 26px;
		margin-top: 12px;
	}
	.middle-card-item-title{
		font-size: 12px;
		margin-top: 12px;
	}
	.consult-card-top{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.consult-header{
		width: 66px;
		height: 66px;
		border-radius: 33px;
		margin-top: 10px;
	}
	.consult-name{
		font-size: 14px;
		margin-top: 6px;
	}
	.line{
		width: 90%;
		height: 1px;
		border-bottom:dotted;
		margin-left: 5%;
		color: #aaaaaa;
	}
	.consult-leave{
		font-size: 8px;	
	}
	.gootAt{
		display: flex;
		font-size: 8px; 
		
		/* overflow: hidden; */
		margin-left: 5px;
		/* align-self:flex-start; */
	}
	.science-top{
	}
	.science-top-left{
		
	}
	.science-
	.science-top-right{
		
	}
	.science-bottom{
		
	}
	
	.evaluation-card{
		display: flex;
		width: 100%;
		height: 90px;
		background-color: #FFFFFF;
		margin-top: 5px;
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
		height: 20px;
		line-height: 20px;
		font-size: 14px;
	}
	.line{
		width: 90%;
		border-bottom: dotted;
		border-width: 1px;
		border-color: #979797 ;
		margin-top: 5px;
	}	
	.evaluation-name{
		margin-top: 5px;
		font-size: 13px;
		height: 18px;
		line-height: 18px;
		color: rgba(0,0,0,.5);
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
	/deep/.uni-input-input{
		font-size: 14px;
	}
	/deep/.uni-searchbar__text-placeholder{
		font-size: 14px;
	}
</style>
