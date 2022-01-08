<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="userInfo[0].RealName"></sknavigate>
		<!-- #endif -->
		<scroll-view class="scroll" @refresherrefresh="commentRefresh" :scroll-y="true" :show-scrollbar="false"
			scroll-top="0" @scroll="scroll" :scroll-top="scrollTop" :scroll-into-view="viewId">
			<view>
				<!-- 头像+性别+地址 -->
				<view class="user_info">
					<image :src="headPhoto||defaultIcon" class="headPhoto"></image>
					<view class="intruction">
						<view class="info_list">
							<text class="info_list_text">{{userInfo[0].Sex}}</text>
							<text class="info_list_text">{{userInfo[0].Age+"岁"}}</text>
							<text class="info_list_text">{{userInfo[0].PsyVocaQualification}}</text>
						</view>
						<text class="text">{{userInfo[0].ResidenceAddress}}</text>
					</view>
				</view>
				<!-- 从业年限+咨询次数+用户评分 -->
				<view class="consult_overall">
					<view class="consult_intro">
						<view>
							<text class="consult_age">{{userInfo[0].YearsOfWorking||'0'}}</text>
							<text class="consult_age_unit">年</text>
						</view>
						<text class="consult_age_intro">从业年限</text>
					</view>
					<view class="line_vertical"></view>
					<view class="consult_intro">
						<view>
							<text class="consult_age">{{userInfo[0].ConsultNum||'0'}}</text>
							<text class="consult_age_unit">次</text>
						</view>
						<text class="consult_age_intro">咨询次数</text>
					</view>
					<view class="line_vertical"></view>
					<view class="consult_intro">
						<view>
							<text class="consult_age">{{userInfo[0].CommentScore||'10.0'}}</text>
							<text class="consult_age_unit">分</text>
						</view>
						<text class="consult_age_intro">用户评分</text>
					</view>
				</view>
				<view class="renzheng">
					<image class="icon" src="../../static/img/consult/renzheng.png"></image>
					<text>平台交易担保</text>
					<image class="icon" src="../../static/img/consult/renzheng.png"></image>
					<text>资质认证</text>
				</view>
				<view class="kong" id="jieshao"></view>
				<view class="topbar" scroll-x="true">
					<view @click="goToPosition('jieshao')">
						<view class="intro">介绍</view>
						<view v-show="jieshaoShow" class="bottom_line_blue"></view>
					</view>
					<view @click="goToPosition('pingjia')">
						<view class="intro">评价</view>
						<view v-show="pingjiaShow" class="bottom_line_blue"></view>
					</view>
					<view @click="goToPosition('xuzhi')">
						<view class="intro">须知</view>
						<view v-show="xuzhiShow" class="bottom_line_blue"></view>
					</view>
					<view @click="goToPosition('wenzhang')">
						<view class="intro">文章</view>
						<view v-show="wenzhangShow" class="bottom_line_blue"></view>
					</view>
					<view @click="goToPosition('xiangsizixunshi')">
						<view class="intro">相似咨询师</view>
						<view v-show="xiangsizixunshiShow" class="bottom_line_blue"></view>
					</view>
				</view>
				<!-- 介绍 -->
				<view class="common_unit">
					<view class="common_horizontal">
						<view class="consult_age">擅长</view>
						<view class="common_text">{{userInfo[0].Profession}}</view>
					</view>
					<view class="line_horizontal"></view>
					<view class="common_horizontal">
						<view class="consult_age">认证称号</view>
						<view class="common_text">{{userInfo[0].PsyVocaQualification}}</view>
					</view>
					<view class="line_horizontal"></view>
					<view class="common_horizontal">
						<view class="consult_age">简介</view>
						<view :class="[isOpen==true?'common_text':'close_intro']">
						{{userInfo[0].SelfIntroduction}}
						</view>
						<view class="open_tips_text" @click="openTheIntro">{{isOpenText}}</view>
					</view>
				</view>
				<view class="kong" id="pingjia"></view>
				<!-- 评价 -->
				<view id="pingjia" class="common_unit">
					<view class="common_unit_title">
						<text class="title_2">评价（{{commentNum[0].CommentNum}}）</text>
						<text class="consult_age_intro" @click="getMoreComment(userInfo)">更多</text>
					</view>
					<view class="line_horizontal"></view>
					<view class="empty_comment" v-show="comment.length==0">暂时还有没评价哦~</view>
					<view v-for="(item,index) in comment" :key="index">
						<evaluationItem :value="item" style="height: auto;"></evaluationItem>
					</view>
				</view>
				<!-- 须知 -->
				<view id="xuzhi" class="common_unit">
					<view class="common_unit_title"><text class="title_2">预约须知</text></view>
					<view class="line_horizontal"></view>
					<view style="width: 100%;">
						<ul class="common_text" style="list-style-type: disc;width: 85%;">
							<li class="common_text">{{agreement[0].AgreeName}}</li>
							<text class="text_1"
								style="text-indent: 25px;">{{(agreement[0].AgreeContent).replace(/<\/?[^>]*>/g,'') }}</text>
						</ul>
					</view>
				</view>
				<!-- 文章 -->
				<view id="wenzhang" class="common_unit">
					<view class="common_unit_title" style="display: flex;justify-content: space-between;">
						<text class="title_2">文章</text>
						<text class="consult_age_intro" @click="getMoreArtical()">更多</text>
					</view>
					<view class="line_horizontal"></view>
					<view class="article_empty"  v-show="paper.length==0">
						<image src="../../static/img/consult/photo_coubselor_details_article_empty.png" mode="aspectFit" class="article_empty_image"></image>
						<view>该咨询师还未发表文章哦</view>
					</view>
					<view v-for="(item,index) in paper" :key='index' @click="toPaperDetail(item)">
						<paperItem :value="item" style="height: auto;"></paperItem>
					</view>
				</view>
				<!-- 相似咨询师 -->
				<view id="xiangsizixunshi" class="common_unit">
					<view class="common_unit_title"><text class="title_2">相似咨询师</text></view>
					<view class="line_horizontal"></view>
					<view class="xszxs">
						<view v-for="(item,index) in similar" :key='index' @tap="similarConsultDetail(item)"
							style="width: 25%;">
							
							<consultSimilarItem :value="item" style="height: auto;width: auto;"></consultSimilarItem>
						</view>
					</view>
				</view>
			</view>
			<view class="bottombar">
				<view v-show="config.collection == true" :class="[isFavoriteStatus?'focus_style_attion':'focus_no_attion']" @click="addAttention()">{{isFavoriteStatusText}}</view>
				<!-- <view v-show=" true" class="focus_style" @tap="toChat">
						<image :src="chatIcon" class="liaotian"></image>
						<text class="title_2" style="color: #3399FF;">私聊</text>
				</view> -->
				<view @tap="order()" class="focus_style" :style="{'width':config.collection == true?'65%':'100%'}">预约咨询	</view>
			</view>
		</scroll-view>
		<uni-popup ref="popup" type="dialog">
			<view class="dialog_content">
				<view class="dialog_title">{{agreement[0].AgreeName}}</view>
				<view class="line_horizontal"></view>
				<scroll-view class="dialog_text" :scroll-y="true">
					{{(agreement[0].AgreeContent).replace(/<\/?[^>]*>/g,'')}}
				</scroll-view>
				<view class="line_horizontal"></view>
				<view class="dialog_button_group">
					<view class="button_left" @tap="dialogButtonClick(false)">取消</view>
					<view class="line_vertical"></view>
					<view class="button_right" @tap="dialogButtonClick(true)">确定</view>
				</view>
			</view>
		</uni-popup>
		<loginModule ref="login" @success="loginSuccess"></loginModule>
	</view>
</template>

<script>
	import evaluationItem from "./consult_evaluation_item.vue"
	import paperItem from "./consult_paper_item.vue"
	import consultSimilarItem from "./consult_similar_item.vue"
	export default {
		components: {
			evaluationItem,
			paperItem,
			consultSimilarItem,
		},
		data() {
			return {
				id:'',
				defaultIcon: '../../static/img/consult/order_profle.png',
				chatIcon: '../../static/img/consult/icon_counselor_details_liaotian.png',
				patientID:"",
				viewId: "",
				scrollTop: 0,
				jieshaoToTop: 100000,
				pingjiaToTop: 100000,
				xuzhiToTop: 100000,
				wenzhangToTop: 100000,
				xiangsizixunshiToTop: 100000,
				jieshaoShow: true,
				pingjiaShow: false,
				xuzhiShow: false,
				wenzhangShow: false,
				xiangsizixunshiShow: false,
				comments: [],
				evaluation: 7,
				title: '',
				userId: '', //咨询师ID
				headPhoto: '',
				isOpen: false,
				isOpenText: "点击展开详情",
				isFavoriteStatus: true,
				isFavoriteStatusText: "＋关注",
				userInfo: [{
					"Sex": "男",
					"Age": "0",
					"RealName": "",
					"HeadPhotoURL": "",
					"Degree": "",
					"PsyVocaQualification": "",
					"skill": "",
					"WorkLevel": "",
					"Profession": "",
					"SelfIntroduction": "",
					"FavoriteStatus": "0",
					"ConsultNum": "",
					"CommentScore": "",
					"YearsOfWorking": "",
					"PriceStandard": "",
					"ResidenceAddress": ""
				}], //咨询师信息
				commentNum: [{
					"CommentNum": "0"
				}], //评论数
				comment: [], //评论内容
				agreement: [{
					"AgreeName": "",
					"AgreeContent": ""
				}], //同意书
				paper: [], //文章
				similar: [], //相似的咨询师
				defaultIcon: '../../static/img/consult/order_profle.png',
			}
		},
		onLoad(option) {
			// #ifdef H5
				if (option.id != null) {
					let thisid = option.id;
					this.id = thisid
					try {
						let info = uni.getStorageSync(thisid);
						this.userId = info.item.UserID;
						this.headPhoto = info.item.HeadPhotoURL;
						uni.setNavigationBarTitle({
							title: info.item.RealName
						});
					} catch (e) {
						console.log(e.message)
					}
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.userId = info.item.UserID;
					this.headPhoto = info.item.HeadPhotoURL;
					uni.setNavigationBarTitle({
						title: info.item.RealName
					});
				}
			// #endif
			
		},
		onUnload() {
			
		},
		mounted() {
			uni.showLoading({
				title:"数据加载中..."
			});
			this.$nextTick(function() {
				this.getTop();
			})
			this.patientID =  this.user.getUserId();
			this.getData();
		},
		methods: {
			loginSuccess:function(){
				this.patientID = this.user.getLoginState() ? this.user.getUserId() : "";
				this.getData()
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
			scroll: function(e) {
				console.log("滑动");
				// this.viewId = "";
				this.getTop();
			},
			openTheIntro: function() {
				if (this.isOpen) {
					this.isOpen = false;
					this.isOpenText = "点击展开详情";
				} else {
					this.isOpen = true;
					this.isOpenText = "点击收起";
				}
			},
			getData: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostCounselorDetail,
					data: {
						'UserID': _this.userId, //咨询师ID
						'PatientID': _this.patientID //来访者ID
					},
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						let data = res.data.Data[0]
						_this.userInfo = data.UserInfo;
						_this.commentNum = data.CommentNum;
						_this.comment = data.Comment;
						_this.agreement = data.Agreement;
						_this.paper = data.Paper;
						_this.similar = data.Similar;
						// console.log("我的收藏：" + _this.userInfo[0].FavoriteStatus)
						// console.log("我的收藏：" + _this.isFavoriteStatus)
						if (_this.userInfo[0].FavoriteStatus == 0) {
							_this.isFavoriteStatus = true;
							_this.isFavoriteStatusText = "＋关注";
						} else {
							_this.isFavoriteStatus = false;
							_this.isFavoriteStatusText = "已关注";
						}
					} else {
						
					}
				}).catch(reason =>{
					
				})				
			},
			getMoreComment: function() { //更多评论
			let _this = this
				let info = {					
					'id':this.userId
				};
				// let id = this.utils.createUUID();
				try{
					// uni.setStorageSync(id,info);
					_this.navigate.navigateTo({
						url: 'consult_comment_list',
						data:info
					})					
				}catch(e){
					console.log(e.message)
				}
			},
			getMoreArtical: function() { //更多文章
			let _this = this
				if (this.paper.length == 0) {
					uni.showToast({
						title: "该咨询师尚未发表文章哦~",
						icon: 'none',
						duration: 1500
					})
				} else {
					let item = {
						"ItemName": this.userInfo.RealName, //标题名
						"ItemID": 'CMSItem2017112100002',
						"Query": this.userId,
					};
					let info = {
						"item":item
					}
					let id = this.utils.createUUID()
					uni.setStorageSync(id,info)
					_this.navigate.navigateTo({
						url: '../science/science_art_group_list?id=' + id
					})					
				}
			},
			similarConsultDetail: function(item) { //相似咨询师详情页面
				let info = {					
					'item': item
				};
				let _this = this
				let id = this.utils.createUUID();
				try {
					uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: './consult_detail?id=' + id
					})					
				} catch (e) {
					console.log(e.message)
				}
			},
			commentRefresh: function() { //刷新
				if (this._freshing) return;
				this._freshing = true;
				this.getData();
			},
			addAttention: function() { //将该咨询师添加关注
				let _this = this;
				if(!_this.user.getLoginState()){
					this.login()
					return;
				}
				if (_this.isFavoriteStatus) {
					this.request.startRequest({
						url: _this.api.PostFavorite,
						data: [{
							'ObjectID': _this.userId,
							'UserID': _this.user.getUserId()
						}],
						showLoading:true
					}).then(res =>{
						if (res.data.Code == 0) {
							_this.isFavoriteStatus = false;
							_this.isFavoriteStatusText = "已关注";
							uni.$emit("collectionStateChange",{})
						}else{
							uni.showToast({
								title:request.data.Message,
								icon:'none',
								duration:1500
							});
						}
					}).catch(reason =>{
						
					})
					
				} else {
					this.request.startRequest({
						url: _this.api.PostCancelFavorite,
						data: [{
							'ObjectID': _this.userId,
							'UserID': _this.user.getUserId()
						}],
						showLoading:true
					}).then(res =>{
						if (res.data.Code == 0) {
							_this.isFavoriteStatus = true;
							_this.isFavoriteStatusText = "+关注";
							uni.$emit("collectionStateChange",{})
						}else{
							uni.showToast({
								title:res.data.Message,
								icon:'none',
								duration:1500
							});
						}
					}).catch(reason =>{
						
					})					
				}
			},
			toChat: function() {
				uni.showToast({
					title: '敬请期待',
					icon: 'none',
					duration: 1500
				})
			},
			order: function() { //点击预约
				let _this = this;
				if (!_this.user.getLoginState()||_this.patientID=="") {
					this.login()
				} else _this.$refs.popup.open('')
			},
			dialogButtonClick: function(blooean) { //弹窗点击事件
				if (blooean) {
					let info = {
						'publish': '0',
						'item': this.userInfo
					}
					let id = this.utils.createUUID();
					let _this = this
					try {
						uni.setStorageSync(id, info);
						_this.navigate.navigateTo({
							url: './consult_scheduling_list?id=' + id
						})						
					} catch (e) {
						console.log(e.message)
					}
					this.$refs.popup.close();
				} else {
					this.$refs.popup.close();
				}
			},
			getTop: function() {
				 let _this = this;
				    uni.createSelectorQuery().in(_this).select('#jieshao').boundingClientRect(data => {
				     _this.jieshaoToTop = data.top;
				    }).exec()
				    uni.createSelectorQuery().in(_this).select('#pingjia').boundingClientRect(data => {
				     _this.pingjiaToTop = data.top;
				    }).exec()
				    uni.createSelectorQuery().in(_this).select('#xuzhi').boundingClientRect(data => {
				     _this.xuzhiToTop = data.top;
				    }).exec()
				    uni.createSelectorQuery().in(_this).select('#wenzhang').boundingClientRect(data => {
				     _this.wenzhangToTop = data.top;
				    }).exec()
				    uni.createSelectorQuery().in(_this).select('#xiangsizixunshi').boundingClientRect(data => {
				     _this.xiangsizixunshiToTop = data.top;
				    }).exec()
					
						_this.$forceUpdate();
					
				    
				    _this.show();
				    _this.$nextTick(function() {
				     _this.show();
				     console.log("viewID:"+_this.viewId);
				     _this.showById(_this.viewId);
				     _this.viewId = "";
				     })
				   },
				   goToPosition: function(id) {
				    console.log("goToPosition")
				    this.viewId = id;
				    this.showById(id);

			},
			show: function() {
			    let _this = this;
			    if (_this.jieshaoToTop < 0 && _this.pingjiaToTop - 100 < 0) _this.jieshaoShow = false;
			    else _this.jieshaoShow = true;
			    if (_this.pingjiaToTop - 100 <= 0 && _this.xuzhiToTop - 100 > 0) _this.pingjiaShow = true;
			    else _this.pingjiaShow = false;
			    if (_this.xuzhiToTop - 100 <= 0 && _this.wenzhangToTop - 100 > 0) _this.xuzhiShow = true;
			    else _this.xuzhiShow = false;
			    if (_this.wenzhangToTop - 100 <= 0 && _this.xiangsizixunshiToTop - 100 > 0) _this
			     .wenzhangShow = true;
			    else _this.wenzhangShow = false;
			    if (_this.xiangsizixunshiToTop - 100 < 0) _this.xiangsizixunshiShow = true;
			    else _this.xiangsizixunshiShow = false;
			   },
			   showById:function(id){
			    if(id=="") return;
			    let _this = this;
			    _this.jieshaoShow = (id=="jieshao")?true:false;
			    _this.pingjiaShow = (id=="pingjia")?true:false;
			    _this.xuzhiShow = (id=="xuzhi")?true:false;
			    _this.wenzhangShow = (id=="wenzhang")?true:false;
			    _this.xiangsizixunshiShow = (id=="xiangsizixunshi")?true:false;
			   },
			goToPosition: function(id) {
				this.viewId = id;
				this.showById(id);

			},
			toPaperDetail: function(item) {
				let _this = this
				let info = {
					"item":item
				}
				let id = this.utils.createUUID()
				uni.setStorageSync(id,info)
				_this.navigate.navigateTo({
					url: '../science/science_art_detail?id=' + id
				})				
			}
		}
	}
</script>
<style>
	.content {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: calc(100vh - var(--window-top));
		font-size: 15px;
	}

	.scroll {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100% - 50px);
		background-color: #e7e7e7;
	
	}

	.user_info {
		display: flex;
		flex-direction: row;
		background-color: #3399FF;
		color: #FFFFFF;
		font-size: 15px;
	}

	.info_list {
		margin-top: 15px;
		margin-bottom: 10px;
	}

	.info_list_text {
		margin-right: 10px;
	}

	.consult_overall {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		margin-top: 10px;
		text-align: center;
		width: calc(100% - 20px);
		height: 60px;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-left: 10px;
		padding-right: 10px;
	}

	.consult_intro {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: calc(33% - 5px);
		padding-top: 10px;
		padding-bottom: 10px;
		height: calc(100% - 20px);
	}

	.common_vertical {
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
	}

	.common_horizontal {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.common_text {
		width: 100%;
		height: auto;
		min-height: 40px;
		word-break: break-all;
		word-wrap: break-word;
		line-height: 20px;
		font-size: 15px;
		color: #000000;
	}

	.common_unit {
		width: calc(100% - 20px);
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 0px;
		margin-bottom: 60px;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #f9f9f9;
	}

	.common_unit_title {
		width: calc(100% - 10px);
		height: 50px;
		padding-left: 15px;
		padding-right: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.empty_comment{
		width: 100%;
		height: 25px;
		padding-top: 20px;
		padding-bottom: 10px;
		font-size: 15px;
		line-height: 20px;
		color: #8c8c8c;
	}
	.article_empty{
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #8c8c8c;
		font-size: 15px;
		padding-top: 5px;
		padding-bottom: 10px;
	}
	.article_empty_image{
		height: 90px;
	}
	.headPhoto {
		width: 75px;
		height: 75px;
		border-radius: 37.5px;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 15px;
		margin-right: 20px;
	}

	.intruction {
		width: calc(100% - 100px - 15px - 20px);
		height: auto;
	}

	.text {
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 12px;
	}

	.text_1 {
		width: 100%;
		height: auto;
		font-size: 12px;
		word-wrap: break-word;
		word-break: break-all;
		color: #717171;
	}

	.line_vertical {
		height: 100%;
		width: .5px;
		margin-top: 1.5px;
		margin-bottom: 1.5px;
		margin-left: 5px;
		margin-right: 5px;
		background-color: #cfcfcf;
		border-radius: 5px;
	}

	.line_horizontal {
		height: .5px;
		width: 100%;
		margin-top: 5px;
		margin-bottom: 5px;
		background-color: #d3d3d3;
	}


	.consult_age {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 15px;
		margin-left: 5px;
		margin-right: 5px;
		color: #000000;
	}

	.consult_age_unit {
		font-size: 15px;
		font-weight: 550;
		color: #000000;
	}

	.consult_age_intro {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 15px;
		padding-right: 5px;
		font-size: 12px;
		color: #8b8b8b;
	}

	.renzheng {
		margin-top: 10px;
		width: 100%;
		height: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		font-size: 15px;
		color: #000000;
		justify-content: flex-start;
		background-color: #FFFFFF;
	}

	.topbar {
		position: sticky;
		top: 0;
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #FFFFFF;
		margin-top: 10px;
		z-index: 10;
	}

	.intro {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		justify-content: center;
		height: 95%;
		width: auto;
		color: #000000;
		font-size: 15px;
		padding-left: 15px;
		padding-right: 15px;
	}

	.intro_blue {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 95%;
		width: auto;
		color: #3399FF;
		font-size: 15px;
		padding-left: 15px;
		padding-right: 15px;
	}

	.bottom_line_blue {
		width: 100%;
		height: 2.5px;
		background-color: #277ccb;
		border-radius: 5px;
		margin-bottom: 0px;
	}

	.icon {
		width: 17.5px;
		height: 17.5px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 4px;
		margin-left: 15px;
		margin-right: 5px;
	}

	.liaotian {
		width: 14px;
		height: 11px;
		margin-top: auto;
		margin-bottom: auto;
		border-radius: 4px;
		margin-left: 5px;
		margin-right: 5px;
	}


	.title_2 {
		font-size: 17px;
		color: #000000;
	}

	.open_tips_text {
		width: 100%;
		height: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		margin-top: 10px;
		color: #949494;
	}

	.close_intro {
		width: 100%;
		height: 40px;
		line-height: 20px;
		word-break: break-all;
		word-wrap: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 15px;
		line-height: 20px;
		color: #000000;
	}

	.bottombar {
		width: 100vw;
		height: 50px;
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		background-color: #FFFFFF;
	}

	.focus_style {
		/* width: 100px; */
		height: 100%;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 17px;
		color: #000000;
		margin-left: 0px;
		margin-right: 0px;
		color: #FFFFFF;
		background-color:#3399FF ;
	}

	.focus_style_attion {
		width: 35%;
		height: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 17px;
		color: #3399FF;
		background-color:rgba(0,0,0,0);
	}

	.focus_no_attion {
		width: 35%;
		height: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 17px;
		color: #999999;
		background-color:rgba(0,0,0,0);
	}

	.favorite {
		width: 100px;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #3399FF;

		background-color: #4CD964;
	}

	.favorite_no {
		width: 100px;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #999999;

		background-color: #DD524D;
	}

	.kong {
		width: 0px;
		height: 0px;
	}

	.dialog_content {
		width: 80vw;
		height: auto;
		background-color: #FFFFFF;
		border-radius: 10px;
	}

	.dialog_title {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-top: 10px;
		font-size: 17px;
		line-height: 20px;
		text-align: center;
		color: #3399FF;
	}

	.dialog_text {
		width: calc(100% - 30px);
		height: auto;
		max-height: 50vh;
		font-size: 12px;
		color: #323232;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		padding-left: 15px;
		padding-right: 15px;
		word-wrap: break-word;
		word-break: break-all;
		line-height: 20px;
	}

	.dialog_button_group {
		width: 100%;
		height: 45px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		/* background-color: #007AFF; */
	}

	.button_left {
		width: 49%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #737373;
	}

	.button_right {
		width: 49%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #3399FF;
	}
	.xszxs{
		width: 100%; 
		display: flex; 
		/* flex-wrap: nowrap; */		
		/* justify-content: space-between; */
	}
</style>
