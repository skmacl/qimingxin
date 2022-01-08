<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="选择机构"></sknavigate>
		<!-- #endif -->
		<uni-list v-for="(item,index) in temp" :key="index">
			<uni-list-item>
				<view  slot="body" class="list-item"  @tap="itemClick(item,index)">{{item.DeptName}}</view>
			</uni-list-item>			
		</uni-list>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data :[],
				temp:[]
			}
		},
		onLoad:function(option){
			// #ifdef H5
				if (option.id != null) {
					let _this = this;	
					let id = option.id
					let item = uni.getStorageSync(id).item;
					this.data = item;
					this.temp = this.data
					console.log("详情页数据： " +JSON.stringify(this.data))
					
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.data = info.item;
					this.temp = this.data
				}
			// #endif
			
		},
		methods: {
			itemClick:function(item,index){
				let children = item.Children 
				if(children && children.length > 0){
					// let id = this.utils.createUUID();
					let info = {
						"item":children
					}
					// uni.setStorageSync(id,info)
					this.navigate.navigateTo({
						url:"/pages/mine/system/mine_dept",
						data:info
					})				
				}else{
					uni.setStorageSync("dep",item.DeptName)
					uni.setStorageSync("dpId",item.DeptID)
					// #ifdef H5
						this.navigate.naviBack(-2)
					// #endif
					// #ifndef H5
						uni.reLaunch({
							url:"/pages/mine/system/mine_information"
						})
					// #endif
				}
				// console.log("itemClick")
			},
			itemSelect:function(){
				console.log("itemSelect")
			}
		}
	}
</script>

<style>
	.content{		
		width: 100%;
		height: 100%;
	}
.list-item{
	width: 100%;
	height: 20px;
}
</style>
