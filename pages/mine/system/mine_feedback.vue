<template>
<view class="content">
	<!-- #ifdef H5 -->
		<sknavigate class="navigate" title="意见反馈"></sknavigate>
	<!-- #endif -->
	<textarea class="feed-info" id="reson" @input="textAreaInput" v-model="reason" maxlength="100" placeholder="请输入遇到的问题或者建议..." />
	<input class="phone" id="phone" maxlength="11" type="number" placeholder="请输入联系电话" :value="phone" />
	<button class="submit" type="primary" v-on:click="submit()">提交</button>
</view>
</template>

<script>
export default {
	data(){
		return{
			reason:"",
			phone:"",
			count:0
		
		}
	},
	 onLoad: function (option) { 
	
	
    },

	methods:{
		textAreaInput(e){
			this.reason = e.detail.value
		},
		submit:function(){
			if(this.reason.length == 0){
				uni.showToast({
					title: "请输入反馈内容",
					icon:"none"
				})
			
				return
			}
			// if(this.phone.length == 0){
			// 	uni.showToast({
			// 		title: "请正确输入联系电话"
			// 	})			
			// 	return
			// }			
					
			let _this = this
			this.request.startRequest({
				url: _this.api.PostFeedback,
				data: {
					"Account": "17602196691",
					"Feed": _this.reason
				},
				showLoading:true
			}).then(res =>{
				if(res.data.Code == 0){
					uni.showToast({
						title: "反馈已提交，谢谢支持！",
						icon:"none"
					})
					setTimeout(function(){
						// #ifdef H5
							_this.navigate.naviBack(1)
						// #endif
						// #ifndef H5
							uni.navigateBack()
						// #endif
						
					},500)
					
				}else{
					uni.showToast({
						title: "服务器错误，请稍后再试！",
						icon:"none"
					})
				}
			}).catch(reason =>{
				uni.showToast({
					title: "服务器错误，请稍后再试！"
				})
			})
		}
	}
}
</script>

<style>
	.content{
		width: 100%;
		height: 100vh;  		
		background-color:rgba(0,0,0,.05);
	}
	.feed-info{
		width: 100%;
		height: 150px;
		background-color: #FFFFFF;
		font-size: 14px;
		padding: 5px 5px 5px 5px;
	}
	.phone{
		width: 100%;
		height: 35px;
		margin-top: 15px;
		background-color: #FFFFFF;
		font-size: 14px;
		padding-left: 5px;
	}
	.submit{
		width: 90%;
		height: 35x;
		line-height: 35px;
		margin-top: 25px;
	}
	
</style>
