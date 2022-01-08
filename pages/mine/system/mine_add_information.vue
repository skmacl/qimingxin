<template>
	<view class="content">
		<sknavigate class="navigate" title="信息完善"></sknavigate>
		<view class="sex">
			<text class="sex-content"> 请选择您的性别</text>
			<view class="sex-photo">
				<image class="sex-img" src="../../../static/img/mine/header_boy.png" mode=""></image>
				<image class="sex-img" src="../../../static/img/mine/header_girl.png" mode=""></image>
			</view>

			<view>
				<radio-group @change="radioChange" class="sex-photo">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
		</view>

		<view class="birthday">
			<text class="birthday-content">出生日期</text>
			<view class="uni-list-cell-db">
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="birthday-date">{{date}}</view>
				</picker>
			</view>
		</view>

		<button class="btn-save" @click="saveMsg()"> 保存</button>
	</view>
</template>

<script>
	import AES from "@/common/utils.js"
	export default {
		data() {
			return {
				date: "1990-01-01",
				items: [{
						value: "0",
						name: "男"
					},
					{
						value: "1",
						name: "女"
					},
				],
				current: 0,
				myMsg: []
			}
		},

		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},

		onLoad: function() {
			let _this = this
			try {
				const value = uni.getStorageSync('userData');
				if (value) {
					_this.myMsg = JSON.parse(value)
					// console.log("_this.myMsg:  + " + _this.myMsg);

				}
			} catch (e) {
				// error
				console.log("nanme: error + " + e.message);

			}

		},
		methods: {

			saveMsg: function() {
				let _this = this
				var requestData = _this.myMsg[0]
				requestData.Sex = _this.items[_this.current].value
				requestData.BirthDate = _this.date
				this.request.startRequest({
					url: _this.api.SetUserInfo,
					data: requestData,
				}).then(res =>{
					
				}).catch(reason =>{
					
				})
				// uni.request({
				// 	url: _this.api.SetUserInfo,
				// 	method: 'POST',
				// 	header: {
				// 		'Content-Type': "application/json;charset=utf-8",
				// 	},
				// 	timeout: 60000,
				// 	data: requestData,
				// 	success: (response) => {
				// 		console.log("请求成功=" +response.data.Code)
				// 		console.log("data=" +
				// 			JSON.parse(AES.decrypt(response.data.Data))
				// 		);
				// 		// uni.reLaunch({
				// 		// 	url: '/pages/mine/login',
				// 		// });
				// 	},
				// 	fail: function(response) {
				// 		console.log("failresponse=")
				// 	}
				// })


			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					// year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.detail.value) {
						this.current = i;
						break;
					}
				}
			}
		}



	}
</script>

<style>
	.content {
		width: 100%;
		height: 100vh;
	}

	.sex {
		width: 100%;
		height: auto;
		margin-top: 65px;
	}

	.sex-content {
		margin-top: 25px;
		padding: 10px;

	}

	.sex-photo {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-top: 10px;
	}

	.sex-img {
		width: 50px;
		height: 50px;
	}

	.birthday {
		margin-top: 25px;		
	}

	.birthday-content {
		margin-left: 10px;
		
	}

	.birthday-date {
		padding-left: 25px;
		margin-top: 15px;
		background-color: #B9B9B9;
		/* border-style:solid;
		border-width: .5px; */
	}

	.btn-save {
		margin-top: 35%;
		width: 80vw;
		background-color: #007AFF;
		color: #D8D8D8;
	}
</style>
