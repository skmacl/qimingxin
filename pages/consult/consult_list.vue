<!-- //咨询师列表 -->
<template>
	<view class="content" :style="{'margin-top':top + 'px'}">
		<!-- #ifdef H5 -->
			<view class="sl_style" :style="{'top':top + 44 + 'px'}">
		<!-- #endif -->
		<!-- #ifdef APP-PLUS ||MP-WEIXIN -->
			<view class="sl_style" :style="{'top':top + 'px'}">
		<!-- #endif -->
			<sl-filter ref="slf" :independence="true" color="#000000" themeColor="#3399FF" :menuList.sync="menuList"
				@result="result" :topFixed="false">
			</sl-filter>
		</view>
		<uni-list v-show="dataStatus == 1 || dataStatus == 5" class="list">
			<view class="list-item" v-for="(item,index) in Counselor" :key="index">
				<uni-list-item direction="row" @click="tapItem(item)"
					:clickable="true" class="uni-list-item__container">
					<view slot="body">
						<consulorItem :value="item" defaultImage="../../static/img/consult/order_profle.png"
							style="height: auto;width: 100%;"></consulorItem>
					</view>
				</uni-list-item>
			</view>
		</uni-list>
		<view v-show="dataStatus != 0 && dataStatus != 1">
			<emptyStatus :emptyType = dataStatus @refresh="getData()"></emptyStatus>
		</view>
	</view>
</template>

<script>
	import consulorItem from "./consult_item.vue"; //咨询师列表item
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	export default {
		components: {
			consulorItem,
			slFilter
		},
		data() {
			return {
				dataStatus:this.common.DataStatus.Unload,
				force:false,
				listShow: true,				
				Counselor: [],
				ConsultPage: 0,
				top:0,
				holderText:"",
				filterResult: '',
				//"OwnerShow_Order"综合排序,"ConsultNum"按咨询数排序,"CommentScore"按评分排序,
				orderParam: 'OwnerShow_Order',
				query: [{
					'QueryKey': 'Profession',
					'QueryValue': [

					]
				}, {
					'QueryKey': 'ResidenceAddress',
					'QueryValue': [

					]
				}, {
					'QueryKey': 'PriceStandard',
					'QueryValue': [

					]
				}],
				menuList: [{
						'title': '全部分类',
						'detailTitle': '全部分类',
						'isMutiple': true,
						'key': 'PsyProfession',
						'detailList': [{
							'title': '不限',
							'value': ''
						}]
					},
					{
						'title': '地区',
						'detailTitle': '地区',
						'isMutiple': true,
						'key': 'HotCity',
						'detailList': [{
							'title': '不限',
							'value': ''
						}]
					},
					{
						'title': '价格',
						'detailTitle': '价格',
						'isMutiple': false,
						'key': 'PriceLevels',
						'detailList': [{
							'title': '不限',
							'value': ''
						}]
					},
					{
						'title': '排序',
						'isMutiple': false,
						'isSort': true,
						'key': 'OrderParam',
						'detailList': [{
								'title': '综合排序',
								'value': 'OwnerShow_Order',
							},
							{
								'title': '咨询数',
								'value': 'ConsultNum',
							},
							{
								'title': '评分',
								'value': 'CommentScore',
							},
						],
					}

				],
			}
		},
		mounted() {			
			this.getData();
			this.getDictionaryData("PsyProfession");
			this.getDictionaryData("HotCity");
			this.getDictionaryData("PriceLevels");
			let info = uni.getSystemInfoSync()
			// #ifdef H5 
				this.top = info.safeArea.top
			// #endif
			 // #ifdef APP-PLUS
				this.top = info.safeArea.top + 44		
			// #endif
				
		},
		unmounted() {
			
		},
		methods: {
			result(val) {
				let _this = this;
				_this.filterResult = JSON.stringify(val, null, 2);
				if (val.PsyProfession != null && val.PsyProfession != []) {
					_this.query[0].QueryValue = [];
					for (var i = 0; i < val.PsyProfession.length; i++) {
						_this.query[0].QueryValue.push({
							'DicKey': val.PsyProfession[i].toString()
						})
					}
				}
				if (val.PsyProfession == "") {
					_this.query[0].QueryValue = [];
				}
				if (val.HotCity != null && val.HotCity != []) {
					_this.query[1].QueryValue = [];
					for (var i = 0; i < val.HotCity.length; i++) {
						_this.query[1].QueryValue.push({
							'DicKey': val.HotCity[i].toString()
						})
					}
				}
				if (val.HotCity == "") {
					_this.query[1].QueryValue = [];
				}
				if (val.PriceLevels != null && val.PriceLevels != "") {
					console.log("val.PriceLevels:" + val.PriceLevels)
					_this.query[2].QueryValue = [];
					_this.query[2].QueryValue.push({
						'DicKey': val.PriceLevels
					})
				}
				if (val.PriceLevels == "") {
					_this.query[2].QueryValue = [];
				}
				if (val.OrderParam != null || val.OrderParam != "") {
					_this.orderParam = val.OrderParam
				}
				_this.getData()
			},
			getDictionaryData: function(dicTypCode) {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostDictionaryClass,
					data: {
						'DicTypCode': dicTypCode.toString()
					},
					showLoading:false,
					storage:6000
				}).then(res =>{
					var j = dicTypCode == "PsyProfession" ? 0 : (dicTypCode == "HotCity" ? 1 : 2);
					let newdata = res.data.Data;
					if (res.data.Code == 0) {
						let length = newdata.length;
						for (var i = 0; i < length; i++) {
							if (dicTypCode == "HotCity") {
								_this.menuList[j].detailList.push({
									'title': newdata[i].DicValue,
									'value': newdata[i].DicValue
								});
							} else {
								_this.menuList[j].detailList.push({
									'title': newdata[i].DicValue,
									'value': newdata[i].DicKey
								});
							}
						}
						_this.$refs.slf.resetMenuList(_this.menuList);
					} else {
						uni.showToast({
							title: request.data.Message,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(reason =>{
					
				})				
			},
			getData: function() {
				let _this = this;
				this.request.startRequest({
					url: _this.api.PostCounselor,
					data: {
						'Order': 'DESC',
						'OrderParam': _this.orderParam,
						'PageCount': '10',
						'PageIndex': '0',
						'Query': _this.query
					},
					showLoading:true,
					storage:600,
					force:_this.force
				}).then(res =>{
					if(res.data.Code == 0){
						_this.Counselor = res.data.Data
						if(_this.Counselor.length >= 10){
														
								_this.dataStatus = _this.common.DataStatus.Normal
							}else{
							
								if(_this.Counselor.length == 0){
									_this.dataStatus = _this.common.DataStatus.NoData
								}else{
									_this.dataStatus = _this.common.DataStatus.NoMoreData
								}
							}
						_this.currentPage = 0						
						res.data.Data.forEach(function(item) {
						
							if (item.InfoType == "02") {
								_this.musicAcacheList.push(item)
							}
						})
					}else{
						if(_this.Counselor == null || _this.Counselor.length == 0){
							_this.dataStatus = _this.common.DataStatus.LoadError
						}
					}
					_this.force = true
				}).catch(reson =>{
					_this.force = true
					if(_this.list == null || _this.list.length == 0){
						_this.dataStatus = _this.common.DataStatus.LoadError
					}
				})		
			},
			loadMore: function() {
				
				if(this.dataStatus != this.common.DataStatus.Normal){
					if(this.dataStatus == this.common.DataStatus.NoMoreData){
						uni.showToast({
							title:'没有更多数据了'
						});
					}					
					return;
				}
				console.log('加载更多222');
				//获取数据
				
				let _this = this;				
				this.currentPage += 1;
				
				this.request.startRequest({
					url: _this.api.PostCounselor,
					data: {
						'Order': 'DESC',
						'OrderParam': _this.orderParam,
						'PageCount': '10',
						'PageIndex': _this.currentPage.toString(),
						'Query': _this.query
					},
					showLoading:true,
					storage:600,
					force:_this.force
				})
				.then(res =>{
					if (res.data.Code == 0) {
						let newPapers = res.data.Data;
						if(newPapers == null){								
							_this.dataStatus = _this.common.DataStatus.NoMoreData
						}else{
							_this.Counselor = _this.Counselor.concat(newPapers);
							if(newPapers.length < 10){									
								_this.dataStatus = _this.common.DataStatus.NoMoreData
							}else{									
								_this.dataStatus = _this.common.DataStatus.Normal
							}
						}						
						
					}
				})
				.catch(reson => {
					
				});	
				
			
				
			},		
			
			tapItem: function(item) {
				let _this = this;
				let info = {
					'publish': '0',
					'item': item
				};
				// let id = _this.utils.createUUID();
				try {
					// uni.setStorageSync(id, info);
					_this.navigate.navigateTo({
						url: './consult_detail',
						data:info
					})					
				} catch (e) {
					console.log(e.message)
				}
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		min-height: auto;
		/* display: flex;
		flex-direction: column; */
		background-color: #FFFFFF;
		/* margin-top: 0px; */
	}

	.sl_style {
		position: fixed;		
		display: flex;
		flex-direction: row;
		width: 100%;
		height: auto;
		z-index: 1;		
		height: 40px;
	}

	.list {
		/* margin-top: 40px; */
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		background-color: #f3f3f3;
		margin-top: 40px;
	}
	.list-item{
		margin-top: 10px;
		width: 100%;
		background-color: #E5E5E5;
	}

	/deep/.uni-list-item__container{
	 padding: 0rpx 0rpx 0rpx 0rpx !important;
	}
</style>
