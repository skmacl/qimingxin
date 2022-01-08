<template>
	<view class="content">
		<view class="title">
			<view>咨询评价</view>
			<view @click="submitComments()">提交</view>
		</view>
		<view class="line_horizontal"></view>
		<view class="input">
			<textarea @input="getCommentContent" class="input_text" placeholder="本次咨询是否解决了你的困扰？说说你对本次咨询以及咨询师的看法!"
				placeholder-class="input_placeholder" maxlength="500"></textarea>
		</view>
		<view class="score_group">
			<uni-rate :touchable="true" :isFill="false" :value="3" size="30" :max="5" :margin="5" color="#eec45a"
				@change="getScore"></uni-rate>
			<view class="comments_text">{{commentsText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				score: 6,
				commentsText: '一般',
				commentContent: '',
				starSelected: '',
				starUnselected: '',
				appointInfoID: '',
				patientID:"",
			}
		},
		onLoad(option) {
			// #ifdef H5
				if(option.id){
					let thisid = option.id;
					if(thisid!=null){
						try{
							let info = uni.getStorageSync(thisid);
							this.appointInfoID = info.item.AppointInfoID;
						}catch(e){
							console.log(e.message)
						}
					}
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.appointInfoID = info.item.AppointInfoID;
				}
			// #endif
		},
		mounted() {
			uni.setNavigationBarTitle({
				title: "咨询评价"
			});
			this.patientID = this.user.getLoginState() ? this.user.getUserId():"";
		},
		methods: {
			getScore: function(e) {
				this.score = e.value * 2
				switch (e.value) {
					case 1: {
						this.commentsText = "非常不满意";
						break;
					}
					case 2: {
						this.commentsText = "不满意";
						break;
					}
					case 3: {
						this.commentsText = "一般";
						break;
					}
					case 4: {
						this.commentsText = "满意";
						break;
					}
					case 5: {
						this.commentsText = "非常满意";
						break;
					}
				}
			},
			getCommentContent: function(e) {
				this.commentContent = e.detail.value.trim();
			},
			checkComments: function() {
				return this.commentContent == "" ? false: true;
			},
			submitComments: function() {
				let _this = this;
				if(!_this.user.getLoginState()){
					uni.showToast({
						title:"请先登录",
						icon:'none',
						duration:1500
					});
					return;
				}
				if (this.checkComments()) {
					this.request.startRequest({
						url: _this.api.PostComment,
						data: {
							"ObjectID": _this.appointInfoID,
							"UserID": _this.patientID,
							"CommentContent": _this.commentContent,
							"CommentScore": _this.score
						},
						showLoading:true
					}).then(res =>{
						if (res.data.Code == 0) {
							uni.showToast({
								title: "评论提交成功！",
								icon: 'none',
								duration: 1500
							});
							// #ifdef H5
								setTimeout(function(){
									this.navigate.naviBack(1)
								},500)	
							// #endif
							// #ifndef H5
								setTimeout(function(){
									uni.navigateBack();
								},500)	
							// #endif
													
						}else{
							uni.showToast({
								title:request.data.Message,
								icon:'none',
								duration:1500
							});
						}
					}).catch(reason =>{
						uni.showToast({
							title:"提交失败",
							icon:'none',
							duration:1500
						});
					})					
				} else {
					uni.showToast({
						title: "评论不可为空！",
						icon: 'none',
						duration: 1500
					})
				}
			},
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: calc(100vh - var(--window-top));
		display: flex;
		flex-direction: column;
	}

	.title {
		width: calc(100% - 20px);
		height: 40px;
		padding-top: 10px;
		padding-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
		font-size: 17px;
		line-height: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		color: #313131;
	}

	.line_horizontal {
		width: 100%;
		height: .5px;
		background-color: #cecece;
	}

	.input {
		width: calc(100% - 20px);
		height: auto;
		padding: 10px;
		font-size: 15px;
		line-height: 20px;
		color: #8c8c8c;
	}

	.input_text {
		width: 100%;
		height: 150px;
		font-size: 15px;
		line-height: 20px;
		word-wrap: break-word;
		word-break: break-all;
		color: #000000;
		/* background-color: #4CD964; */
	}

	.input_placeholder {
		font-size: 15px;
		line-height: 20px;
		color: #818181;
	}

	.score_group {
		width: calc(100% - 20px);
		height: 50px;
		padding: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;


		/* background-color: #00aaff; */
	}

	.icon {
		width: 30px;
		height: 30px;
		margin-right: 7.5px;

		background-color: #000000;
	}

	.comments_text {
		font-size: 15px;
		line-height: 0px;
		color: #818181;
		margin-left: 15px;
		/* background-color: #f8bc5a; */
	}
</style>
