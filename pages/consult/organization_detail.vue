<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="organization.DeptName" @navi-Back="back()"></sknavigate>
		<!-- #endif -->
		<scroll-view class="scroll" :scroll-y="true">
			<image class="top_image" mode="aspectFill" :draggable="false" :src="organization.DeptPicture||defaultDeptImage"></image>
			<view class="score_group">
				<view class="score_content">
					<view class="score">{{organization.CounselorNum||"0"}}</view>
					<view class="score_text">咨询师人数</view>
				</view>
				<view line_vertical></view>
				<view class="score_content">
					<view class="score">{{organization.ConsultNum||"0"}}</view>
					<view class="score_text">咨询人次</view>
				</view>
				<view line_vertical></view>
				<view class="score_content">
					<view class="score">{{organization.CommentScore||"10.0"}}</view>
					<view class="score_text">用户评分</view>
				</view>
			</view>
			<view class="line_horizontal"></view>
			<view class="organization_info">
				<view class="info_title">咨询中心介绍</view>
				<view :class="[isOpen?'info_content_open':'info_content_close']">{{organization.Remark}}</view>
				<view class="open" @tap="open">{{zhankai}}</view>
			</view>
			<view class="line_horizontal"></view>
			<view class="address_info">
				<view class="address"  @tap="openDialog('address')">
					<image class="icon" src="../../static/img/consult/icon_my_order_address.png"></image>
					<view class="address_text">{{organization.DeptAddress}}</view>
				</view>
				<view class="line_vertical"></view>
				<view class="phone" @tap="openDialog('phone')">
					<image class="icon" src="../../static/img/consult/icon_organization_phone.png"></image>
				</view>
			</view>
			<!-- 咨询师列表 -->
			<view v-for="(item,index) in consultList" :key="index" @tap="toConsultDetail(item)" style="margin-bottom: 10px;">
				<consulorItem :value="item" defaultImage="../../static/img/consult/order_profle.png" style="height: auto;"></consulorItem>
			</view>
			<uni-popup ref="popup" type="dialog">
				<view class="dialog_main">
					<view class="dialog_title">{{Dtitle}}</view>
					<view class="line_horizontal"></view>
					<view class="dialog_content">{{Dcontent}}</view>
					<view class="line_horizontal"></view>
					<view class="dialog_button" @tap="ensureDialog">确定</view>
				</view>
			</uni-popup>
		</scroll-view>
	</view>
</template>

<script>
	import consulorItem from "./consult_item.vue"; //咨询师列表item
	export default {
		
		onLoad(option) {
			// #ifdef H5
				if (option.id != null) {
					let thisid = option.id;
					this.id = thisid
					try {
						let info = uni.getStorageSync(thisid);
						this.deptID = info.item.DeptID;
						this.deptName = info.item.DeptName;
					} catch (e) {
						console.log(e.message)
					}
				}
			// #endif
			// #ifndef H5
			
				if(option.data){
					let info = JSON.parse(option.data)
						this.deptID = info.item.DeptID;
						this.deptName = info.item.DeptName;
					}
				
			// #endif
		},
		onUnload() {
			
		},
		components: {
			consulorItem,
		},
		data() {
			return {		
				id:'',
				defaultDeptImage:"../../static/img/placeholder/1_1.3.png",
				consultList: [],
				organization:{},
				deptID: "",
				deptName:"",
				isOpen:false,
				zhankai:"展开",
				Dtitle:"",
				Dcontent:"",
			}
		},
		mounted() {			
			uni.setNavigationBarTitle({
				title:this.deptName
			});
			this.getOrganizationDetail();
		},
		methods: {
			back(){
					// uni.reLaunch({
					// 	url:"../consult"
					// })
			},
			getOrganizationDetail: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostOrganizationDetail,
					data: {
						"DeptID": _this.deptID
					},
					showLoading:true,
					storage:600
				}).then(res =>{
					if (res.data.Code == 0) {
						_this.consultList = res.data.Data[0].Counselor;
						_this.organization = res.data.Data[0].Organization[0];
						// console.log(JSON.stringify(_this.organization))
					} else {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(reason =>{
					
				})				
			},
			toConsultDetail: function(item) {
				let info = {
					'publish': '0',
					'item': item
				};
				// let id = this.utils.createUUID();
				let _this = this
				try {
					// uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: 'consult_detail',
						data:info
					})
					
				} catch (e) {
					console.log(e.message)
				}
			},
			open:function(){
				let _this = this;
				if(_this.isOpen){
					_this.isOpen = false;
					_this.zhankai = "展开";
				}else{
					_this.isOpen = true;
					_this.zhankai = "收起";
				}
			},
			openDialog:function(type){
				let _this = this;
				if(type=="phone"){
					if(_this.organization[0].ManagePhone==""||_this.organization[0].ManagePhone==null){
						uni.showToast({
							title:"暂无联系电话",
							icon:'none',
							duration:1500
						});
					}else{
						_this.Dtitle = "联系人："+_this.organization[0].ManageName;
						_this.Dcontent = "联系电话："+_this.organization[0].ManagePhone;
						_this.$refs.popup.open();
					}
				}
				if(type=="address"){
					if(_this.organization[0].DeptAddress==""||_this.organization[0].DeptAddress==null){
						uni.showToast({
							title:"暂未设置地址",
							icon:'none',
							duration:1500
						});
					}else{
						_this.Dtitle = "公司地址";
						_this.Dcontent = _this.organization[0].DeptAddress;
						_this.$refs.popup.open();
					}
				}
			},
			ensureDialog:function(){
				this.$refs.popup.close();
			},
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: calc(100vh - var(--window-top));
	}

	.scroll {
		width: 100%;
		height: 100%;
		background-color: #dedede;
	}
	.top_image{
		width: 100%;
		height: 200px;
	}
	.score_group{
		width: 100%;
		height: 75px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		background-color: #FFFFFF;
	}
	.score_content{
		width: 32%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;justify-content: center;
		
		/* background-color: #08B6F2; */
	}
	.score{
		font-size: 19px;
		font-weight: bold;
		color: #000000;
	}
	.score_text{
		font-size: 14px;
		color: #868686;
		margin-top: 5px;
	}
	.organization_info{
		width: 100%;
		height: auto;
		
		background-color: #FFFFFF;
		/* background-color: #4CD964; */
	}
	.info_title{
		width: calc(100% - 10px);
		height: 35px;
		padding-left: 10px;
		font-size: 14px;
		color: #6d6d6d;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.info_content_close{
		width: calc(100% - 20px);
		height: 40px;
		padding-left: 10px;
		padding-right: 10px;
		font-size: 15px;
		line-height: 20px;
		color: #000000;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		
	}
	.info_content_open{
		width: calc(100% - 20px);
		height: auto;
		min-height: 40px;
		padding-left: 10px;
		padding-right: 10px;
		min-height: 40px;
		font-size: 15px;
		line-height: 20px;
		color: #000000;
		word-wrap: break-word;
		word-break: break-all;
	}
	.open{
		width: calc(100% - 10px);
		height: 35px;
		padding-left: 10px;
		font-size: 15px;
		color:#6d6d6d;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.line_horizontal {
		width: 100%;
		height: .5px;
		background-color: #d1d1d1;
	}

	.line_vertical {
		width: .5px;
		height: 80%;
		margin-top: auto;
		margin-bottom: auto;
	}

	.address_info {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10px;
		background-color: #FFFFFF;

		/* background-color: #ffaaff; */
	}

	.address {
		width: calc(100% - 51px);
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 10px;
	}

	.address_text {
		width: calc(100% - 50px);
		height: auto;
		padding-left: 15px;
		padding-right: 10px;
		/* background-color: #ffff00; */
		font-size: 14px;
		white-space: nowrap;
		word-break: break-all;
		word-wrap: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #000000;

	}

	.phone {
		width: 50px;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		/* background-color: #4CD964; */
	}

	.icon {
		width: 20px;
		height: 20px;

		/* background-color: #000000; */
	}
	.dialog_main{
		width: calc(80vw - 20px);
		height: auto;
		padding-left: 10px;
		padding-right: 10px;
		min-height: 150px;
		max-height: 60vh;
		border-radius: 10px;
		background-color: #FFFFFF;
	}
	.dialog_title{
		width: 100%;
		height: 50px;
		font-size: 17px;
		color: #5093ff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-top: 5px;
		font-weight: bold;
	}
	.dialog_content{
		width: 100%;
		height: auto;
		padding-top: 7.5px;
		padding-bottom: 7.5px;
		font-size: 15px;
		color: #000000;
		line-height: 20px;
		text-indent: 30px;
		word-wrap: break-word;
		word-break: break-all;
	}
	.dialog_button{
		width: 100%;
		height: 40px;
		font-size: 15px;
		margin-top: 7.5px;
		color: #5093ff;
		font-weight: bold;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
