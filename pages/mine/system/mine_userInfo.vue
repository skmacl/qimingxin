<template>

	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" title="个人信息" :rightStyle="navigate.RightStyle.StyleSave" @rightClick="saveInfo"></sknavigate>
		<!-- #endif -->
		<uni-list scroll-y="true">
			<view class="avatar" v-on:click="setMyAvatar()">
				<view class="avatar-text">
					<text class="avatar-text-content">头像</text>
				</view>
				<view class="avatar-url">
					<image class="avatar-img-url" :src="myheaderUrl">
					</image>
				</view>
			</view>
			<view style="height: 0.5px;background-color:#CFCFCF;"> </view>
			<view class="item">
				<uni-list-item v-for="(item,index) in list" :show-extra-icon="false" :title="item"
					:showArrow="index ==2 ?false :true" :rightText="mydata[index]" @click.native="linkPage(item,index)">
				</uni-list-item>
			</view>

		</uni-list>

		<view>
			<!-- 信息输入弹窗 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog id="nameDialog" ref="inputClose" mode="input" :title="list[index]" :beforeClose="true"
					:placeholder="'请输入'+ list[index]=='请输入所属部门'?'请输入部门代码':list[index]" @confirm="dialogInputConfirm" @close="dialogClose">
				</uni-popup-dialog>
			</uni-popup>

			<!-- 日期弹窗 -->
			<uni-datetime-picker ref="picker" returnType="date" type="date" @change="dateChange"
				start="1900-06-01 06:30:30" end="2030-6-1" return-type="timestamp"
				style="width: 0;height: 0;"
				
				></uni-datetime-picker>

			<!-- //性别弹窗 -->
			<uni-popup ref="sex">
				<popup :data="sexItems" @confirm="sexConfirm" :title="list[index]"></popup>
			</uni-popup>

			<!-- //婚姻状态弹窗 -->
			<uni-popup ref="marry">
				<popup :data="marryItems" @confirm="marryConfirm" :title="list[index]"></popup>
			</uni-popup>
			<tki-tree ref="tkitree" :range="depts" rangeKey = "OrgName"  :selectParent = 'true' idKey = "OrgID" @confirm="deptSelect" confirmColor="#4e8af7" />
		</view>

	</view>
</template>

<script>
	import popup from '@/components/choose-dialog/choose-dialog.vue';
	import tkiTree from "components/tki-tree/tki-tree.vue"
	export default {
		components: {
			popup,
			tkiTree
		},

		data() {
			return {
				list: ['姓名', '性别','部门', '出生日期', '婚姻状况', '联系方式'],
				mydata: [],
				myheaderUrl: '',
				index: 0,
				deptName:"",
				dept:{},
				depts:[],
				sexItems: [{
						DicKey: '0',
						DicValue: '男',
					},
					{
						DicKey: '1',
						DicValue: '女',
					},

				],
				marryItems: [],
				current: 0,
				marryIndex:0,
				marry:{}
			}
		},

		onLoad: function() {
			let _this = this
			uni.setNavigationBarTitle({
				title: "个人信息"
			})
		
			
			this.getMarryState()
			// _this.getDeptName()
		},
		onShow() {
			// let dp = uni.getStorageSync("dep")
			// let dpId = uni.getStorageSync("dpId")
			// if(dp){
			// 	this.deptName = dp
			// }
			// if(dpId){
			// 	this.deptID = dpId
			// }
			
			// uni.setStorageSync("dpt","")
			// uni.setStorageSync("dpid","")			
			this.initMyData()
			
		},
		onNavigationBarButtonTap: function(e) {

			// e的返回格式为json对象：{"text":"测试","index":0}
			this.saveInfo()
		},
		
		methods: {
			isFireFox:function(){
				let u = navigator.userAgent.toLocaleLowerCase()
				return u.indexOf('gecko') > -1 && u.indexOf('KHTML') == -1
			},
			deptClick:function(){
				if(this.depts.length == 0){
					this.getDeptName()					
				}else{
					this.$refs.tkitree._show()
					// console.log(JSON.stringify(this.depts))
				}				
			},
			setDepts:function(deptsData){
				let json = JSON.stringify(deptsData)			
				let jsRes = json.replace(new RegExp('ChildList','g'),"children")
				this.depts = JSON.parse(jsRes)				
				this.$refs.tkitree._show()
			},
			deptSelect:function(e){
				if(e.length > 0){
					this.dept = e[0]
					
					this.mydata.splice(2,1,this.dept.OrgName)
				}			
				
			},
			saveInfo:function(){				
				let _this = this
				var data = _this.user.getUserData()
				// data["RealName"] = _this.mydata[0]
				data["OrgName"] = this.dept.OrgName
				data["OrgID"]   = this.dept.OrgID
				data["Name"] = _this.mydata[0]
				data["Gerder"] = _this.mydata[1]
				data["Birthday"] = _this.mydata[3]
				data["MarriageStateID"] = this.marry.MarriageStateID;//_this.marryItems[_this.marryIndex].DicKey
				// data["MarriageState"] = this.marry.MarriageState
				data["Phone"] = _this.mydata[5]
				data["HeadImgUrl"] = _this.myheaderUrl,
				data["UserID"] = _this.user.getUserId()
				// data["pwdtype"]= "1"
				console.log("data数据" + JSON.stringify(data));
				console.log("mydata数据" + JSON.stringify(_this.mydata));
				var  request = JSON.stringify(data);
				this.request.startRequest({
					url: _this.api.SetUserInfo,
					data: data,
				}).then(res =>{
					if (res.data.Code == 0) {
							
						// var data = JSON.parse(_this.utils.decrypt(res.data.Data))
						// console.log("Code=" + JSON.stringify(data) )
						try {
							_this.user.setUserData(data)
							uni.showToast({
								title: "保存成功",
								icon:"none"
							})
						
						} catch (e) {
							console.log(e)
						}
					
					} else {
						uni.showToast({
							title: "保存失败"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title: "保存失败"
					})
				})				
			},
			setMyAvatar: function() {
				let _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						uni.uploadFile({
							url:_this.api.PostSaveImage,
							filePath:res.tempFilePaths[0],
							name:"userHead",
							formData:{
								"UserID":_this.user.getUserId()
							},
							success:(res) =>{
								let data = JSON.parse(res.data)
								if(data.Code == 0){
									let url = data.Data
										_this.myheaderUrl = url
										_this.saveInfo()
								}
															
							},
							fail:(error) =>{
								console.log(error)
							}
						})
					
					}
				});
			},
			linkPage: function(obj, index) {
				let _this = this;
				switch (index) {
					case 0: {
						_this.index = index;
						_this.$refs.inputDialog.open();
					}
					break;
				case 1: {
					_this.index = index;
					_this.$refs.sex.open();
					// _this.index = index;
					// _this.$refs.inputDialog.open();
					// uni.showToast({
					// 	title:"暂未开放"
					// })
				}
				break;				
				case 2: {
					_this.index = index;
					_this.$refs.inputDialog.open();
				}
				break;
				case 3: {
					_this.index = index;
					_this.$refs.picker.show()
				}
				break;
				case 4: {
					_this.index = index;
					_this.$refs.marry.open();
				}
				break;
				case 5: {
					_this.index = index;
					_this.$refs.inputDialog.open();
				}
				break;
				case 6: {
					
				}
				break;
				}

			},

			dialogInputConfirm: function(value) {
				
				if(this.index == 2){
					// this.getDeptName(value)
					this.deptClick()
				}else if(this.index == 0){
					if(value.length > 20){
						uni.showToast({
							title:"名字过长"
						})
					}else{
						this.mydata.splice(this.index, 1, value);
					}
					
				}else if(this.index == 5){
					if(value.length != 11){
						uni.showToast({
							title:"手机格式不正确"
						})
					}else{
						this.mydata.splice(this.index, 1, value);
					}
				}
				this.$refs.inputDialog.close();
				console.log("dialogInputConfirm： " + JSON.stringify(this.mydata));

			},
			dialogClose: function() {
				this.$refs.inputDialog.close();
			},

			dateChange: function(e) {
				console.log("返回值" + e);
				this.mydata.splice(this.index, 1, e)
			},

			sexConfirm(res) {
				this.mydata.splice(1, 1, this.sexItems[res].DicValue)
				console.log("sexConfirm： " + JSON.stringify(this.mydata));

			},
			marryConfirm(res) {
				console.log("marry" +res);
				this.marryIndex = res
				this.mydata.splice(4, 1, this.marryItems[res].DicValue)
				this.marry = {"MarriageState": this.marryItems[res].DicValue,"MarriageStateID":this.marryItems[res].DicKey}
			},
			
			// 获取婚姻字典值
			getMarryState(){
				let _this = this
				this.request.startRequest({
					url: _this.api.PostDictionaryClass,
					data: JSON.stringify("MarriageState"),
				}).then(res =>{
					if (res.data.Code == 0) {
						_this.marryItems = []
						for(let i = 0; i < res.data.Data.length; i++){
							let item = res.data.Data[i]
							let m = {'DicKey': item.ItemID,'DicValue': item.Value}
							
							_this.marryItems = _this.marryItems.concat(m)
						}
							
					} else {
						uni.showToast({
							title: "获取字典失败"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title: "获取字典失败"
					})
				})				
			},
			// 获取机构
			getDeptName(DeptCode){
				let _this = this
				this.request.startRequest({
					url: _this.api.PostDepartmentByDeptCode,
					data: JSON.stringify(_this.config.deptId),
					showLoading:true
				}).then(res =>{
					if (res.data.Code == 0) {
						if(res.data.Data){
							_this.setDepts([res.data.Data])
							// let id = this.utils.createUUID();
							// let info = {
							// 	"item":res.data.Data
							// }
							// uni.setStorageSync(id,info)
							// _this.navigate.navigateTo({
							// 	url:"/pages/mine/system/mine_dept?id="+ id
							// })
						}else{
							uni.showToast({
								title: "请输入正确的机构码",
								icon:"none"
							})
						}
												
					} else {
						uni.showToast({
							title: "获取机构失败",
							icon:"none"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title: "获取机构失败"
					})
				})				
			},
			initMyData(){
				
				if (this.user.getUserData() != null) {
					var data = this.user.getUserData()
					 this.dept = {"OrgName":data.OrgName,"OrgID":data.OrgID};	
					this.marry = {"MarriageState":data.MarriageState,"MarriageStateID":data.MarriageStateID}
					this.mydata.push(data.Name)
					this.mydata.push(data.Gender==true?'男':'女')
					if(this.deptName){
						this.mydata.push(this.OrgName)
					}else{
						this.mydata.push(data.OrgName)
					}
					// this.mydata.push("")
					// this.mydata.push(data.Name)
					
					this.mydata.push(data.Birthday)
					this.mydata.push(data.MarriageState)
					this.mydata.push(data.Phone)
					this.myheaderUrl = data.HeadImgUrl
					console.log(JSON.stringify(this.mydata))
				}
			},

		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
		margin-top: 0px;
		/* #ifdef H5 */
			margin-top: 44px;
		/* #endif */
	}

	.avatar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 10px;
		align-items: center;
	}

	.avater-text {
		padding-left: 10px;
		margin-left: 15px;
	}

	.avatar-text-content {
		font-size: 17.5px;
		margin-left: 2.5px;
	}

	.avatar-url {
		width: 40px;
		height: 40px;
		margin-right: 25px;
	}

	.avatar-img-url {
		width: 40px;
		height: 40px;
		border-radius: 20px;
	}

	.save-btn {
		width: 80%;
		height: 25px;
		align-items: center;
		background-color: #007AFF;
	}

	.mylist {
		width: 250px;
		background: #FFFFFF;
		padding: 15px;
		border-radius: 15px;
	}

	.mylable {
		margin-bottom: 15px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.btn {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.btn-left {
		width: 100%;
		background: #FFFFFF;
		margin: 0px;
	}
	/deep/.uni-date-editor--logo{
		width: 0px !important;
		height: 0px !important;
	}
	/deep/.uni-calendar{
		width: 90vw;
		margin-left: 10vw;
	}
</style>
