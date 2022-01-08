<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="item.PaperName" @navi-Back = "back()"></sknavigate>
		<!-- #endif -->
		
		<scroll-view>
			<image class="topImg" :src="item.PaperContentURL" mode="aspectFill"></image>
			<view class="paper-base-info">
				<!-- <view class="paper-recommend font-size-title">{{item.PaperRecommend}}</view> -->
				<!-- <view class="paperName font-size-subtitle">{{item.PaperName}}</view> -->
				<!-- <view v-show="config.charge == true" class="price" :style="{'text-decoration': user.getVersion() == '0'?'line-through':'none'}">{{formatPrice(item.Money)}}</view> -->
			</view>
			
			<!-- <view class="question-info"> -->
				<!-- <view class="question-info-item">·{{item.QuestionCount}}道精选题目</view> -->
				<!-- <view class="question-info-item">·约4分钟</view> -->
				<!-- <view class="question-info-item">·{{item.TestCount}}人测过</view> -->
			<!-- </view> -->
			<view class="paper-introduction">
				<view class="paper-introduction-top">
					<!-- <image class="paper-introduction-img" src="../../static/img/evaluation/introduct.png" mode=""></image> -->
					<view class="paper-introduction-title">量表介绍</view>
				</view>
				<!-- <view v-show="item.Introduction.length>0" class="paper-introduction-detail">{{item.Introduction.replace(/<\/?[^>]*>/g, '')}}</view> -->
			</view>
			<view class="paper-introduction" style="padding-bottom: 55px;">
				<view class="paper-introduction-top">
					<!-- <image class="paper-introduction-img" src="../../static/img/evaluation/guide.png" mode=""></image> -->
					<view class="paper-introduction-title">测试指导</view>
				</view>
				<!-- <view v-show="item.Remark.length>0" class="paper-introduction-detail">{{item.Remark.replace(/<\/?[^>]*>/g, '')}}</view> -->
			</view>
			<button class="start-button" type="default" @tap="toTesting()">{{getStartTitle()}}</button>
			
		</scroll-view>
		<loginModule ref="login" @success="loginSuccess"></loginModule>
		<payModule ref="pay" :content="item.PaperName" :money="formatPrice(item.Money)" :link="pay.mweb_url"></payModule>
	</view>
	
</template>

<script>
	import payModule from '../../components/pay-module/pay-module.vue'
	
	export default{
		components:{
			payModule
		},
		data (){
			return{
				title:'',
				item:{"PaperID":"","PaperCode":"","PaperName":"","LineNumber":"","Remark":"","Introduction":"","Money":"",
				"TestCount":"","PaperCoverURL":"","PaperContentURL":"","PaperRecommend":"","TestState":"","QuestionCount":"","FavoriteState":"","CreatedDate":"","PaperResultID":"",
				"IsTest":"","IsCanTest":"","PublishID":"","BannerTitle":"","CanTestState":"","State":"","PaperState":"",
				"Out_trade_no":"","Nonce_str":"","prepay_id":"","Sign":"","timestamp":"","MCHID":"","invalidtime":"","PaperReportURL":"","IsReport":"","IsShowReport":"","ShareURL":""},
				testTime:0,
				PublishID:0,
				PaperID:'',
				id:'',
				pay:{"return_code":"SUCCESS",
				"return_msg":"OK",
				"appid":"",
				"mch_id":"",
				"nonce_str":"",
				"sign":"",
				"prepay_id":"",
				"out_trade_no":"",
				"trade_type":"APP",
				"timestamp":"",
				"mweb_url":""},
				"return_url":''
				
							
			}
		},
		
		onLoad(option) {			
			// #ifdef H5
				if(option.id != null){
					this.id = option.id
					try {
						const info = uni.getStorageSync(this.id)
						console.log(JSON.stringify(info))
						this.item = info.item
						this.PaperID = info.item.PaperID;
						this.PublishID = info.publishId
						this.return_url = info.href
						uni.setNavigationBarTitle({
							title:info.item.PaperName							
						})						
					} catch (e){
						console.log(e)
					}		

				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.PaperID = info.item.PaperID;
					this.PublishID = info.publishId
					this.return_url = info.href
					uni.setNavigationBarTitle({
						title:info.item.PaperName							
					})	
				}
			// #endif
				
				// console.log(info)
		
		},
		onUnload() {
				
		},
		
		onShow() {
			// this.$refs.pay.hideInfo()
			this.getData()			
		},
		// onBackPress() {
		// 	let _this = this
			// let canBack = getCurrentPages();
			// if(canBack && canBack.length > 1){
			// 	uni.navigateBack({
			// 		delta:1
			// 	});
			// }else{
				// uni.redirectTo({
				// 	url:_this.return_url
				// })
				// uni.reLaunch({
				// 	url:"./evaluation"
				// })
			// }
			
		// 	return true
		// },
		
		methods:{
			back:function(){
					
			},
			
			loginSuccess:function(){
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
			getData: function(){
				// console.log(this.utils.getUserId(),this.PublishID,this.PaperID)
				let _this = this;
				this.request.startRequest({
					url:_this.api.PostPaperState,
					data: {
						'UserID':_this.user.getUserId(),
						'PublishID':"0",//_this.PublishID,
						'PaperID':_this.PaperID,
						'Version':_this.user.getVersion()
					},
					showLoading:true
				}).then(res =>{
					// console.log(JSON.stringify(res))
					if(res.data.Code == 0){
						_this.item = res.data.Data[0];
						// console.log(JSON.stringify(_this.item))
						
					}else{
						uni.showToast({
							title:'系统错误，请稍后再试',
							icon:"none"
						})
						// #ifdef H5
							setTimeout(function(){
								// _this.navigate.navigateBack(1)
							},500)
						// #endif
						// #ifndef H5
							setTimeout(function(){
								uni.navigateBack({
									delta:1
								})
							},500)
						// #endif
						
					}
				}).catch(reason =>{
					uni.showToast({
						title:'系统错误，请稍后再试'
					})
					// setTimeout(function(){
					// 	uni.navigateBack({
					// 		delta:1
					// 	})
					// },500)
				})
				
			},
			formatPrice:function(price){
				if(parseInt(price) == 0){
					return "免费"
				}else{
					return '¥' + parseInt(price)/100 + '.00'
				}				
			},
			getStartTitle:function(){
				if(this.config.charge != true || this.user.getVersion() == 0 || this.item.PaperState == 2 || this.item.Money == 0){
					return "开始测试"
				}else if(this.item.PaperState == 3){
					return "退款审核中"
				}else{
					return "立即购买"
				}
			},
			toTesting: function(){			
				let _this = this
				let info = {"item":this.item,"PublishID":"0","userId":this.user.getUserId()}
				_this.navigate.navigateTo({
					url:"./evaluation_testing?tmp=0&name="+_this.item.PaperName,
					data:info
				})
				// if(this.user.getLoginState() != true){
				// 	this.login()
				// 	return
				// }
				// let userInfo = this.user.getUserData()
				// if(userInfo == null){
				// 	alert("系统错误")
				// 	return
				// }
				// if(this.PublishID.length > 2){
				// 	if(this.CanTestState != 0){
				// 		let title = ""
				// 		if(this.item.CanTestState == 1){
				// 			title = "发布不存在"
				// 		}else if(this.item.CanTestState == 2){
				// 			title = "发布已失效"
				// 		}else if(this.item.CanTestState == 3){
				// 			title = "发布为未开始"
				// 		}else if(this.item.CanTestState == 4){
				// 			title = "发布已过期"
				// 		}else if(this.item.CanTestState == 5){
				// 			title = "您已完成该测试，请不要重复测试"
				// 		}
				// 		uni.showToast({
				// 					title:title,
				// 					icon:"none"
				// 				})
				// 				return
				// 	}
					// if(this.item.IsCanTest == 0){
					// 	if(this.item.IsTest == 0){
					// 		uni.showToast({
					// 			title:"该发布未开始或已过期，请在发布规定时间内完成测试",
					// 			icon:"none"
					// 		})
					// 	}else{
					// 		uni.showToast({
					// 			title:"您已完成该测试，请不要重复测试",
					// 			icon:"none"
					// 		})
					// 	}
					// 	return
					// }
				// }
				
				// if(this.config.charge != true || this.user.getUserData().Version == 0 || this.item.PaperState == 2  || this.item.Money == 0){
				// 	let info = {"PaperID":this.PaperID,"PublishID":this.PublishID,"userId":userInfo.UserID}
				// 	// let id = this.utils.createUUID()
					
				// 	if(this.item.TestState != '0'){	
										
				// 		uni.showActionSheet({						
				// 			itemList:['继续测试','重新开始'],
				// 			success(res) {		
				// 				try {
				// 					// uni.setStorageSync(id,info)								
									
				// 					if(res.tapIndex == 0){
				// 						_this.navigate.navigateTo({
				// 							url:"./evaluation_testing?tmp=1&name="+_this.item.PaperName,
				// 							data:info
				// 						})										
				// 					}else{
				// 						_this.navigate.navigateTo({
				// 							url:"./evaluation_testing?tmp=0&name="+_this.item.PaperName,
				// 							data:info
				// 						})											
				// 					}
									 
				// 				} catch (e){
				// 					console.log(e)
				// 				}	
							
															
				// 			}
				// 		})
				// 	}else{
					
				// 		try {
				// 			// uni.setStorageSync(id,info)
				// 				_this.navigate.navigateTo({
				// 					url:"./evaluation_testing?tmp=0&name="+_this.item.PaperName,
				// 					data:info
				// 				})								
							
				// 		} catch (e){
				// 			console.log(e)
				// 		}	
				// 	}	
				// }else{
				// 	let _this = this
				// 	if(this.pay.mweb_url && this.pay.mweb_url.length>5){
				// 		_this.toPay()
				// 	}else{
				// 		//去下单--暂时省略判断
				// 		let data = {"UserID":this.user.getUserId(),
				// 					"PaperID":this.PaperID,
				// 					"PublishID":this.PublishID,
				// 					"Trade_type":"MWEB"
				// 						}
				// 		this.request.startRequest({
				// 			url:this.api.PostUnitOrder,
				// 			data:data,
				// 			showLoading:true
				// 		}).then(res =>{
				// 			if(res.data.Code == 0){
				// 				let info = res.data.Data[0]
				// 				// console.log(info)
				// 				if(info.return_code == 'SUCCESS'){
				// 					_this.pay = info
				// 					_this.pay.mweb_url = _this.pay.mweb_url + "&redirect_url="+ _this.api.baseUrl +"/h5/pages/evaluation/evaluation_detail?id="+_this.id
				// 					_this.toPay()
				// 				}
				// 				// console.log(JSON.stringify(res.data.Data[0]))
				// 			}else{
				// 				uni.showToast({
				// 					title:res.data.Message
				// 				})
				// 			}
				// 		}).catch(reason =>{
				// 			uni.showToast({
				// 				title:'系统异常，请稍后再试'
				// 			})
				// 		})
				// 	}										
				// }								
			},
			toPay:function(){
				this.$refs.pay.showInfo()
				if(this.pay.prepay_id && this.pay.prepay_id.length > 5){
					this.$refs.pay.showInfo()
				}
			}
			
		}
	}
</script>

<style>
	.content{
		width: 100vw;
		height: calc(100vh - 44px - 45px);
		background-color: rgba(0,0,0,0.03);
	}
	.topImg{
		width: 100%;
		height: 187.5px;
		
	}
	.paper-base-info{
		background-color: #FFFFFF;
		width: 100%;
		/* height: 200rpx; */
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.paper-recommend{
		width: 100%;
		text-align: center;
		}
	.paperName{
		width: 100%;
		text-align: center;
		margin-top: 10px;
		font-size: 12px;
	}
	.question-info{
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 40px;
		background-color: #FFFFFF;
		margin-top:2.5px;
	}
	.question-info-item{
		width: 33%;
		text-align: center;
		font-size: 12px;
		height: 15px;
		margin-top: 12.5px;
		opacity: .6;
	}
	
	.paper-introduction{
		margin-top: 15px;
	}
	.paper-introduction-top{
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		width: 100%;
		height: 40px;
		align-items: center;
		justify-content: center;
	}
	.paper-introduction-img{
		/* margin-top: 22rpx; */
		width: 18px;
		height: 18px;
	}
	.paper-introduction-title{
		margin-left: 7.5px;
		font-size: 18px;
		line-height: 18px;
	}
	.paper-introduction-detail{
		margin-top: 2.5px;		
		background-color: #FFFFFF;
		font-size: 14px;
		padding: 5px 10px 15px 10px;
		/* line-height: 32rpx; */
	}
	.start-button{
		position: fixed;
		bottom: 0px;
		width: 100%;
		background-color: #2fe670;
		color: #FFFFFF;
		height: 45px;
		line-height: 45px;		
	}
	.price{
		width: 100%;
		font-size: 16px;
		text-align: center;
		margin-top: 5px;
		color: #FF0000;
	}
</style>
