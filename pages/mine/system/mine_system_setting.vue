<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="系统设置"></sknavigate>
		<!-- #endif -->
		<uni-list v-for="(item,index) in list" :key="index">
			<uni-list-item :clickable="true" @click="linkPage(item)">
				<view slot="header">
					<view class="list-item">{{item}}</view>
				</view>
			</uni-list-item>
			
		</uni-list>
	</view>
</template>

<script>
export default {
	data(){
		return{
			title: '',
			list:['意见反馈','关于我们','修改密码','注销账户']
		}
	},
	 onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数	
	
    },
	methods:{
		cancellation:function(){
			let _this = this
			this.request.startRequest({
				url:_this.api.PostCancelUser,
				data:{"UserID":_this.user.getUserId()},
				showLoading:true
			}).then(res =>{
				if(res.data.Code == 0){
					uni.showToast({
						title:"注销完成",
						icon:"none"
					})
					_this.user.setLoginState(false)
					// setTimeout(function(){	
						
						
						_this.navigate.naviBack(-1)
					// },500)
				}else{
					uni.showToast({
						title:res.data.Message
					})
				}
			}).catch(reason =>{
				uni.showToast({
					title:"系统错误，请稍后再试！"
				})
			})
		},
		
		linkPage:function(obj){
			let _this = this
			if(obj=='意见反馈'){
				this.navigate.navigateTo({
					url: '/pages/mine/system/mine_feedback',
				})				
			}
			if(obj=='修改密码'){
				this.navigate.navigateTo({
					url: '/pages/mine/system/mine_change_pwd',
				})				
			}
			if(obj=='关于我们'){
				this.navigate.navigateTo({
					url: '/pages/mine/mine_abort',
				})					
			}
			if(obj=='注销账户'){
				uni.showModal({
					title:"警告",
					content:"注销账户后账户下所有信息将被删除且无法找回！确定要注销账户吗？",
					cancelText:"取消",
					confirmText:"确定注销",
					confirmColor:"#FF0000",
					success(e) {
						if(e.confirm === true){
							_this.cancellation()							
						}						
					}
				})
			}
			
		}
	}
}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		/* margin-top: 10px; */
	
	}

	.list-item{
		font-size: 16px;
		height: 50px;
		line-height: 50px;
		margin-left: 6px;
	}
	/deep/.uni-list-item__container{
			padding: 0rpx 0rpx 0rpx 0rpx !important;
		}
</style>

