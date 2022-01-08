<template>
	<view class="content">
		<!-- #ifdef H5 -->
			<sknavigate class="navigate" :title="title" 
			@navi-Back="back()" :rightStyle="navigate.RightStyle.StyleSave"
			@rightClick="rightClick()" :canBack="false"></sknavigate>
		<!-- #endif -->
		
		<scroll-view class="content" scroll-y="true" v-show="isLoad == true">
			<!-- <view class="scale-title">{{scale.PaperName}}</view> -->
			<view class="scale-progress">
				<text class="scale-progress-title">{{(currentIndex+1)+"/"+questionList.length}}</text>
				<progress class="scale-progress-p" 
				:percent="progress"
				stroke-width='6'
				border-radius="2"/>
			</view>		
			<view class="question">
				
				<view v-if="currentQuestion.PQuestionName" class="question-title">{{currentQuestion.PQuestionName}}</view>
				<view class="question-title">{{currentQuestion.QuestionNumber+'. '+currentQuestion.QuestionName}}</view>
				<view v-if="currentQuestion.QuestionImgPath && currentQuestion.QuestionImgPath.length > 0">
					<view class='question-img-back' :style="{'height':imageHeight+'px'}">
						<image class="question-img" :draggable="false" :src="currentQuestion.QuestionImgPath" 
						:style="{'width':imageWidth+'px','height':imageHeight+'px'}" 
						bindtap="imgTap" :data-url="currentQuestion.QuestionImgPath"/>
					</view>				
				</view>
				<!-- 单选 -->
				<view v-if="currentQuestion.IsMultiSelect==1 || currentQuestion.IsMultiSelect==2">
					<view class="options" v-for="(answer, index) in currentQuestion.AnswerList" :key = index>
						<view :class="[currentQuestion.AnswerList[index].AnswerChecked == true?'option-select':'option']" v-on:click = "selectOption(answer,index)">
<!-- 							<image class="option-icon" :src="currentQuestion.AnswerList[index].AnswerChecked == true?selectImage[0]:letterPath(index)" 
							mode="scaleToFill"></image> -->
							<image class="option-icon" :src="letterPath(index)"
							mode="scaleToFill"></image>
							<view class="option-title">{{answer.AnswerName}}</view>  
						</view>
						<view v-if="answer.AnswerChecked == true && answer.List && answer.List.length > 0">
							<!-- 选中，展开子选项 -->
							<scroll-view class="chilOptions" scroll-y="true" :style="{'height':answer.List.length < 4?answer.List.length*45:180 + 'px'}">
								<view v-for="(childAnswer,idx) in answer.List" :key=idx>
									<view :class= "[childAnswer.AnswerChecked == true?'chilOption-select':'chilOption']" v-on:click="selectChildOption(childAnswer,idx,index)">
										<!-- <image class="child-option-icon" :src="childAnswer.AnswerChecked == true?selectImage[0]:letterPath(idx)" mode="scaleToFill"></image> -->
										<image class="child-option-icon" :src="letterPath(idx)" mode="scaleToFill"></image>
										<view class="option-title">{{childAnswer.AnswerName}}</view>
									</view>
								</view>
							</scroll-view>
						</view>
						
					</view>
				</view>	
				<view v-else-if="currentQuestion.IsMultiSelect==3||currentQuestion.IsMultiSelect==6">
					<textarea class="textInput" auto-blur = 'true' 
					@blur="bindTextAreaBlur"
					@input="textAreaInput"
					@confirm="textAreaConfirm"
					@keyboardheightchange = "keyboardheightchange"></textarea>
				</view>
				<view v-else-if="currentQuestion.IsMultiSelect==9">
					<!-- 匹兹堡 -->
					<view class="options" v-for="(answer, index) in currentQuestion.AnswerList" :key = index>
						<view class="option" v-on:click="selectOption(answer,index)">
							<image class="option-icon" :src="answer.AnswerChecked == true?selectImage[0]:letterPath(index)" mode="scaleToFill"></image>
							<picker mode="time" @change="timestampChange">							
								<view class="option-time">{{time}}</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
			<view class="button">
				<button class="left-button" :disabled="currentIndex == 0" size="mini" type="default" v-on:click="left_button()">上一题</button>
				<button class="right-button" size="mini" type="default" v-on:click="right_button()">{{nextBtn}}</button>
			</view>
		</scroll-view>
		<!-- <loginModule ref="login" @success="loginSuccess"></loginModule> -->
	</view>
	
</template>

<script>
	
	import Tools from './evaluation_testing.js'
	import factor from './scale_calculate.js'
	
	export default{		
		data() {
			return {
				userId:"",
				tmp:'0',
				PublishID:'0',
				PaperID:'',
				scale:{},				
				questionList:[],
				currentQuestion:{},
				currentIndex:0,
				currentProgress:0,
				currentProgressTitle:'0/0',
				
				selectImage:['../../static/img/evaluation/select.png'],
					total: 0,					    
					fromeIndex:0,
					maxIndex:0,
					progress:0.0,
					paper:{},
					factor:{},
					questions:[],					
					// next:"下一题",
					upBtn_state:'0',
					nextBrn_state:'0',
					hasImg:false,
					timePickerShow:true,
					currentSelectTime:'20:30',
					//btn 状态
				 //    btnColor:["#cccccc","#cccccc"],
				 //    btnTitle:["上一题","下一题"],
					nextBtn:'下一题',
				 //    btnEnble:[false,false],
					//css
					imageLeft:0,
					imageWidth:10,
					imageHeight:10,
					screenWidth:750,
					screenHeight:1342,	
							
					time:'',						
					questionCount:0,
					timer:null,
					interval:0,
					backPress:true,
					id:'',
					isLoad:false,
					timeRecordTmp:"1990-01-01 00:00:01",
					title:"",
					submitShow:false,					
					canTap:true
			}
		},
	
		onLoad(option) {
			let paperId_90 = "3B01C731-7EED-4D42-902C-E5231715B462"//90
			let paperId_ruiwen = "ddfc712a-7e17-4cdd-8d87-7d277c44ce08"//瑞文
			let paperId_pzb = "357f44a2-2772-4f95-ba28-96f36cec3185"//匹兹堡
			let paperId_shsj = "045f81bc-caf1-49a5-b090-9c581c0c3c85"//生活事件
			let paperId_shzcpd = "884e790-1546-470e-a46e-6b2c11a07063"//社会支持评定
			let paperId_mnsd = "87c1f779-b0a2-49c8-a69b-df05a95455f6" //明尼苏达
			let paperId_yqwj = "13e007cf-cd7d-4159-ac94-a759f8fa867e" //疫情问卷			
			// #ifdef H5
				if(option.id != null){
					this.id = option.id					
					try {
						let info = uni.getStorageSync(this.id)
						let item = info.item
						this.PaperID = item.PaperID;
						this.PublishID = info.PublishID
						this.userId = info.userId
						this.tmp = option.tmp						
						this.title = option.name						
						
						this.getData()
					}catch (e){
						
					}
				}
			// #endif
			// #ifndef H5
				if(option.data){
					let info = JSON.parse(option.data)
					this.PaperID = info.PaperID;
					this.PublishID = info.PublishID
					this.userId = info.userId
					this.tmp = option.tmp
					uni.setNavigationBarTitle({
						title:option.name							
					})
					this.getData()
				}
			// #endif
			
				
			// if(option != null){
			// 	this.PublishID = option.publishId
			// 	this.PaperID = option.paperId
			// 	this.tmp = option.tmp
				this.screenWidth = this.utils.getWindowInfo().width
				this.screenHeight = this.utils.getWindowInfo().height	
			// console.log("dd")
			// 	console.log(JSON.stringify(option))
			// 	this.getData()			
					
			// }else{				

			// }
		},
		onUnload() {
				
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				if(this.maxIndex > 2){
					if(Tools.paperCanSave(this.PaperID) == true){
						this.save()
						}else{
							uni.showToast({
								title:'该类型量表不支持临时保存',
								icon:'none'
							})
						}			
				}				
			}
				
		},
		
		onBackPress() {
			
			if(this.maxIndex <= 2 || this.backPress == false || Tools.paperCanSave(this.PaperID) == false){
				if(this.timer) {
						clearTimeout(this.timer);  
						
					}  
					this.timer = null;  
				return false
			}
			if(this.backPress == true){
				let _this = this
				uni.showModal({
					title:"是否保存测试进度?",
					confirmText:"保存",
					cancelText:"不保存",
					success(e) {
						if(e.confirm == true){
							_this.save()
						}else{
							_this.backPress = false
							_this.navigate.naviBack(1)							
						}
					},
					fail() {
						
					}
				})
			}
			
			return true
		},
		onUnload() {
			console.log("dfdfdfdf")
			if(this.timer) {  
					clearTimeout(this.timer);  
					this.timer = null;  
				}  
				this.timer = null; 
		},
		methods:{	
			//#ifdef H5
				back:function(){
					let is = Tools.paperCanSave(this.PaperID)
					if(this.maxIndex <= 2 || this.backPress == false || Tools.paperCanSave(this.PaperID) == false){
						if(this.timer) {
								clearTimeout(this.timer);  
								this.timer = null;  
							} 
							this.navigate.naviBack(1)
						return
					}
					if(this.backPress == true){
						let _this = this
						
						uni.showModal({
							title:"是否保存测试进度?",
							confirmText:"保存",
							cancelText:"不保存",
							success(e) {
								if(e.confirm == true){
									_this.save()
								}else{
									_this.backPress = false
									_this.navigate.naviBack(1)							
								}
							},
							fail() {
								
							}
						})
					}
					
					return
					
				},
				rightClick:function(){
					if(this.maxIndex > 2){
						if(Tools.paperCanSave(this.PaperID) == true){
							this.save()
							}else{
								uni.showToast({
									title:'该类型量表不支持临时保存'
								})
							}			
					}				
				},
			//#endif
			letterPath:function(index){
				let st =  Tools.getLetterPath(index)
				return st
			},
			timestampChange:function(e){		
				this.time = e.detail.value+':00'				
				this.currentQuestion.AnswerList[0].AnswerResult = this.time 
				this.currentQuestion.AnswerList[0].AnswerChecked = true
				this.setMaxIndex(this.currentIndex)
				//下一题
				// console.log(JSON.stringify(this.questionList))
				this.questionJump(this.currentQuestion,0,100)//暂时一个时间填空
				
			},
			
			dataAnalysis: function(data){
				this.scale = data
				if(this.tmp == 0){
					this.scale.StartDateTime = Tools.getCurrentTime()
				}				
				this.timeRecordTmp = Tools.getCurrentTime()
				this.questionList = this.scale.QuestionList
				if(this.tmp == '1'){
					this.currentIndex = this.scale.PaperTestProgress
					this.maxIndex = this.currentIndex
					this.progress = this.maxIndex/this.questionList.length *100
					
				}
				this.currentQuestion = this.questionList[this.currentIndex]
				this.setQuestionInfo()
				this.changeBtnState()
				
				let _this = this
				if(parseInt(this.scale.TimeLimit) >0){
					if(this.tmp == 0){
						this.interval = parseInt(this.scale.TimeLimit)
						this.timer = setInterval(() => {
							if(_this.interval > 0){
								_this.interval--
								uni.setNavigationBarTitle({
									title:Tools.timeFormatter(_this.interval)
								})
								// #ifdef H5
									this.title = Tools.timeFormatter(_this.interval)
								// #endif
							}else{
								_this.submit()
							}						
						},1000)
					}else{
						let time = parseInt(parseInt(this.scale.TimeLimit) - Tools.timeCalculate(this.scale.StartDateTime))
						if(time > 0){
							this.interval = time
							this.timer = setInterval(() => {
								if(_this.interval > 0){
									_this.interval--
									uni.setNavigationBarTitle({
										title:Tools.timeFormatter(_this.interval)
									})
								}else{
									_this.submit()
								}						
							},1000)
						}else{
							this.interval = 0;
							this.submit()
						}
						
					}
					
					
				}
			},
			setQuestionInfo: function(){
				// let count = this.questionList.length
				// this.currentProgress = this.currentIndex/count *100
				// this.currentProgressTitle = (this.currentIndex+1).toString()+'/'+count.toString()
				// this.currentQuestion = this.questionList[this.currentIndex]
				// this.currentQuestionTitle = (this.currentIndex+1).toString()+'、'+this.currentQuestion.QuestionName
				if(this.currentQuestion.QuestionImgPath != null){
					this.getImageSize(this.currentQuestion.QuestionImgPath)
				}
				
			},
			getData: function(){
				
				let _this = this;
				let info = {
						"PaperID":_this.PaperID,
						"PublishId":_this.PublishID == null?"0":_this.PublishID,
						"UserID":_this.userId,
						"IsTemp":_this.tmp == null?'0':_this.tmp
					}
				this.request.startRequest({
					url:_this.api.PostPaperInfo,
					showLoading:true,
					data: info,
				}).then(res =>{
					console.log(JSON.stringify(res))
					if(res.data.Code == 0){
						_this.dataAnalysis(res.data.Data[0])						
						_this.isLoad = true
					}
				}).catch(reason =>{
					
				})		
				// this.factor = factor.getFactorInfo(this.PaperID)
			},
			
			//触发事件
			selectOption:function(sAnswer, index){
				if(this.canTap == false){
					return
				}
				
				this.canTap = false
				console.log(this.canTap)
				let _this = this
				setTimeout(function(){
					_this.canTap = true
				},300)
				//1单选，记录答案，清空其他
				//2多选，记录或取消选中答案
				//3记录跳转
				//4跳转
				//if 限时
				if(parseInt(this.scale.TimeLimit) > 0 && this.interval <= 0){
					uni.showModal({
						title:"时间已到，请提交！",
						confirmText:"提交",
						showCancel:false,
						success(e) {
							if(e.index == 0){
								this.submit()
							}else{
								
							}
						},
						fail() {
							 
						}
					})
				}else{
					if(this.currentQuestion.IsMultiSelect == '1'){
						this.setMaxIndex(this.currentIndex)
						this.recordAnswer(index)
						this.recordTime(index)
						let answer = this.currentQuestion.AnswerList[index]
						if(answer.AnsOptionType != 2 && answer.AnsOptionType != 1 || answer.List.length == 0){						
							this.questionJump(this.currentQuestion,index, 100)
						}
							
						
					}else if(this.currentQuestion.IsMultiSelect == '2'){		//目前没有该题型			
						this.setMaxIndex(this.currentIndex)
						this.recordAnswer(index)
						this.recordTime(index)
					}
				}
				
				
			},
			selectChildOption: function(childAnswer,chilOptionIndex,optionIndex){
				var answer = this.currentQuestion.AnswerList[optionIndex]
				var list = answer.List
				if(list != null && list.length >0){
					for(var i = 0; i < list.length;i++){
						var childAnswer = answer.List[i]
						if(answer.AnsOptionType == 2){	
							if(i == chilOptionIndex){
								childAnswer.AnswerChecked = !childAnswer.AnswerChecked	
							}												
						}else{
							if(i == chilOptionIndex){
								childAnswer.AnswerChecked = true
							}else{
								childAnswer.AnswerChecked = false
							}
						}
					}
				}
				
			},
			//输入框失去焦点
			bindTextAreaBlur: function(e){
				this.currentQuestion.EndDateTime = Tools.getCurrentTime()
				console.log(JSON.stringify(e.detail))
			},
			textAreaInput: function(e){
				let value = e.detail.value
				var answer = this.currentQuestion.AnswerList[0]
				answer.AnswerResult = value
				if(value && value.length > 0){
					answer.AnswerChecked = true
				}else{
					answer.AnswerChecked = false
				}
				console.log(JSON.stringify(e.detail.value))
			},
			textAreaConfirm: function(e){
				console.log(JSON.stringify(e.detail))
			},
			keyboardheightchange: function(e){
				console.log(JSON.stringify(e.detail))
			},
			//设置最大索引
			setMaxIndex:function(index){
				this.maxIndex = this.maxIndex>index?this.maxIndex:index
			},
			//记录答案
			recordAnswer: function(selectOptionIdx){
					var answerList = this.currentQuestion.AnswerList;
					let isMu = this.currentQuestion.IsMultiSelect//题型
					for(var i = 0; i < answerList.length; i++){
						var answer = answerList[i]
						if(i == selectOptionIdx){
							if(isMu == 2){//多选
								answer.AnswerChecked = !answer.AnswerChecked
							}else{
								answer.AnswerChecked = true
							}						
						}else{	
							if(isMu == 2){
								
							}else{
								answer.AnswerChecked = false;
								if(answer.List && answer.List.length >0){
									for(var j = 0;j< answer.List.length; j++){
										var child = answer.List[j]
										child.AnswerChecked = false
										child.AnswerResult = ''
									}								
								}								
							}
							
						}
					}
					//匹兹堡
					// if(isMu == '9'){
					// 	answerList[idx].AnswerResult = this.time
					// }
			},
			recordTime: function(idx){
				this.currentQuestion.StartDateTime = this.timeRecordTmp
				this.currentQuestion.EndDateTime = Tools.getCurrentTime()
			},
			setSelectTime:function(){
				if(this.currentQuestion.IsMultiSelect == 9){
					let answer = this.currentQuestion.AnswerList[0]
					this.time = answer.AnswerResult
				}
			},
			
			questionJump: function(question,selectOptionIdx,delay){		
				// console.log(JSON.stringify(question))
				let tempIdx = this.currentIndex
				let _this = this
				// console.log('#####')
				if(this.currentIndex < this.questionList.length-1){
					var answers = question.AnswerList
					var answer = answers[selectOptionIdx]
					var skipTo = answer.SkipToQuestionId
					// console.log('*******')
					// console.log(skipTo)
					if(skipTo && skipTo.length > 2){						
						// console.log(skipTo)				
						
						this.currentIndex = answer.SkipToQuestionNumber-1
						
						setTimeout(function(){
							_this.currentQuestion = _this.questionList[_this.currentIndex] 		
							if(tempIdx != _this.currentIndex){
								_this.questionList[_this.currentIndex].PreQuestionNumber = tempIdx+1//跳题来源
								_this.setSelectTime()
								_this.setQuestionInfo()
								_this.timeRecordTmp = Tools.getCurrentTime()
							}	
						},delay)
					}else{
						if(skipTo != null && skipTo == '-1'){							
							this.maxIndex = this.currentIndex
							this.changeBtnState()
							this.showSubmit()
							//结束测评
						}else{						
							
							this.currentIndex++
							
							setTimeout(function(){
								_this.currentQuestion = _this.questionList[_this.currentIndex] 
								if(tempIdx != _this.currentIndex){
									_this.questionList[_this.currentIndex].PreQuestionNumber = tempIdx+1//跳题来源
									_this.setSelectTime()
									_this.setQuestionInfo()
									_this.timeRecordTmp = Tools.getCurrentTime()
									_this.setMaxIndex(_this.currentIndex)
								}	
							},delay)
						}
					}
				};
				setTimeout(function(){
					_this.changeBtnState()
					
				},delay);
				this.progress = this.maxIndex/this.questionList.length *100
			},
			left_button: function(){				
				var pre = this.currentQuestion.PreQuestionNumber
				// console.log(this.currentIndex,pre)
				if(this.currentIndex == 0){
					this.showSubmit()
				}else{
					if(pre){
						this.currentIndex = parseInt(pre-1)
						
					}else{
						this.currentIndex--
						
					}						
 				}				
				this.currentQuestion = this.questionList[this.currentIndex]
				this.setQuestionInfo()
			},
			right_button: function(){
				if(parseInt(this.scale.TimeLimit) > 0 && this.interval <= 0){
					uni.showModal({
						title:"时间已到，请提交！",
						confirmText:"提交",
						showCancel:false,
						success(e) {
							if(e.index == 0){
								this.submit()
							}else{
								
							}
						},
						fail() {
							
						}
					})
				}else{
					// console.log(JSON.stringify(this.questionList))
					if(Tools.IsFinish(this.questionList,0, this.questionList.length - 1)){//完成提交
						this.showSubmit()
					}else{
						//找出当前选中项
						var answers = this.currentQuestion.AnswerList
						let selectIdx = 100;
						for(var i = 0; i < answers.length;i++){
							let answer = answers[i]
							if(answer.AnswerChecked == true){
								let list = answer.List
								if(list && list.length > 0){
									for(var j = 0; j < list.length;j++){
										let chilAnswer = list[j]
										if(chilAnswer.AnswerChecked == true){
											selectIdx = i
										}
									}
								}else{
									selectIdx = i
								}							
							}
						}	
						if(this.scale.IsMissQuestion == false){
							if(selectIdx != 100){
								this.questionJump(this.currentQuestion, selectIdx, 1)
							}else{
								uni.showToast({
									title:'当前题目未做'
								})
								//没做
							}						
						}else{
							if(this.currentIndex < this.questionList.length - 1){
								this.currentIndex++
								this.currentQuestion = this.questionList[this.currentIndex]
								this.currentQuestion.PreQuestionNumber = this.currentIndex
								this.changeBtnState()
								this.setQuestionInfo()
							}else{
								this.showSubmit()
							}
						}
					}
				}							
					
			},
			
			showSubmit: function(){
				// console.log("弹窗")
				let _this = this;
				if(this.submitShow == false){
					this.submitShow = true
					uni.showModal({
						title:'已经做完了，确定要提交么？',
						confirmText:'提交',
						cancelText:'先不提交',
						success:function(res){
							_this.submitShow = false
							if(res.confirm == true){
								_this.submit()
							}						
						},
						fail:function(error){
							
						}
					});
				}
			},
			
			changeBtnState: function(){
				if(this.currentIndex == this.questionList.length - 1){
					if(this.scale.IsMissQuestion == true){
						if(Tools.IsDone(this.currentQuestion) == true){
							this.nextBtn = "提交"
							this.showSubmit()
						}else{
							this.nextBtn = "提交"	
						}
					}else{
						if(Tools.IsFinish(this.questionList,0,this.questionList.length - 1) == true){
							this.nextBtn = "提交"
							this.showSubmit()
						}else{
							this.nextBtn = "下一题"
						}
					}					
				}else{
					if(Tools.IsFinish(this.questionList,0,this.questionList.length - 1) == true){
						this.nextBtn = "提交"
						this.showSubmit()
					}else{
						this.nextBtn = "下一题"
					}
				}
				
			},
		
			//记录跳题来源
			recordFromIndex: function(skipTo, isRecord){
				if(isRecord){
					// console.log('############')
					this.questionList[skipTo-1].PreQuestionNumber = this.currentIndex
				}
				
				//若重选，则重置不需做的选项 先MARK一下				
				// for(var i = this.currentIndex+1; i < skipTo-1; i++){
				// 	var question = this.questionList[i]
				// 	for(var j = 0; j < question.AnswerList.length; j++){
				// 		var answer = question.AnswerList[j]
				// 		answer.AnswerChecked = false
				// 	}
				// }
			},
			
		            
	
			getImageSize:function(src){
				let eee = src
			    let _this = this	
				if(src == null){return}
				uni.getImageInfo({
					src:src,
					success(res) {						
						_this.setImageSize(res.width, res.height)
					},
					fail(e) {
						// console.log(e)
					}
				})			    
			
			  },
			setImageSize:function(w,h){
			  // let screenWidth = wx.getSystemInfoSync().windowWidth*2
			  let standard= 350
			  var height = h
			  var width = w
			  if(width>standard*0.94){
				  width = standard*0.94
				  height = width/w * h
			  }
			  this.imageWidth = width
			  this.imageHeight = height			     
		  
			},
			//检查时间格式
			checkTime:function(){
				if(this.scale.StartDateTime == "19900101000100"){
					this.scale.StartDateTime = Tools.estimateStartTime(this.scale.QuestionList.length)
				}
			},
			//临时保存
			save: function(){	
				if(this.user.getLoginState() == false){
					let _this = this
						uni.showModal({
							title:"登录信息过期",
							content:"登录信息过期，请重新登录？",
							success(e) {
								if(e.confirm == true){							
									_this.$refs.login.showLogin()						
								}
							}
						})	
						return
				}
					this.scale.PaperTestProgress = this.maxIndex.toString()					
					let testerId = this.userId
					this.scale.TesterId = testerId
					var result = Tools.dataExtraction(this.scale,this.questionList,this.PublishID,this.maxIndex)
					result.IsSubmit = "0"
					this.checkTime()
					let _this = this
					this.request.startRequest({
						url:_this.api.PostPaperSubmit,
						timeout:60000,
						data:result,
						showLoading:true
					}).then(res =>{
						if(res.data.Code == 0){
							uni.showModal({
								title:'量表保存成功',
								confirmText:'退出',
								cancelText:'继续做题',
								success:function(res){
									if(res.confirm == true){
										_this.backPress = false
										_this.navigate.naviBack(2)										
									}else{
										_this.backPress = true
									}
								},
								
							})	
						}else{
							uni.showToast({
								title:"保存失败，请稍后再试!"
							})
						}
					}).catch(reason =>{
						uni.showToast({
							title:"保存失败，请稍后再试!"
						})
					})						
			},
			//提交
			submit: function(){
				// factor.setDataWithAnswer(this.scale,this.factor,this.questionList)
				// factor.calculate(this.factor, this.scale, this.questionList)
				// return
				console.log('提交')
				if(this.user.getLoginState() == false){
					let _this = this
						uni.showModal({
							title:"登录信息过期",
							content:"登录信息过期，请重新登录？",
							success(e) {
								if(e.confirm == true){							
									_this.$refs.login.showLogin()						
								}
							}
						})	
						// return
				}				
				this.scale.PaperTestProgress = '0'
				let testerId = this.userId
				this.scale.TesterId = testerId
				var result = Tools.dataExtraction(this.scale,this.questionList,this.PublishID,this.maxIndex)
				this.checkTime()
				console.log(JSON.stringify(result))
				let _this = this
				this.request.startRequest({
					url:_this.api.PostPaperSubmit,
					timeout:60000,
					data:result,
					showLoading:true
				}).then(res =>{
					if(res.data.Code == 0){
						_this.backPress = false
						if(this.timer) {
								clearTimeout(this.timer);  
								this.timer = null;  
							}  
						uni.showModal({
							title:'量表提交成功',
							confirmText:'确定',	
							showCancel:false,
							success:function(res){
								if(res.confirm){
									uni.$emit('paperFinish')
									_this.navigate.naviBack(2)									
								}
							},
							
						})						
					}else{
						uni.showToast({
							title:"量表提交失败，请稍后再试！"
						})
					}
				}).catch(reason =>{
					uni.showToast({
						title:"量表提交失败，请稍后再试！"
					})
				})				
			}	
		}
	}
	
</script>

<style>
	.content{
		/* display: flex;
		flex-direction: column; */
		width: 100vw;
		height: calc(100vh - 44px);
		background-color: rgba(0,0,0,.03);
	}
	.scale-title{
		text-align: center;
		margin-top: 8px;
		font-size: 14px;
		opacity: .6;
		padding-bottom: 8px;		
	}
	.scale-progress{
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
	}
	.scale-progress-title{
		font-size: 13px;
		opacity: .6;
		/* width: 20%; */
	}
	.scale-progress-p{
		margin-left: 5px;
		width: 75%;
	}
	.question{
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.question-title{
		margin-top: 25px;
		margin-left: 16px;
		margin-right: 16px;
		font-size: 17px;
		padding-bottom: 8px;
	}
	
	.options{
		display: flex;
		flex-direction: column;
		
	}
	.option{
		display: flex;
		flex-direction: row;
		/* align-items: center;		 */
		background-color: #FFFFFF;
		border-radius: 2.5px;
		min-height: 40px;		
		margin-top:5px;
		margin-left: 16px;
		margin-right: 16px;
	}
	.option-select{
		display: flex;
		flex-direction: row;
		/* align-items: center;		 */
		background-color: #6AB3F9;
		border-radius: 2.5px;
		min-height: 40px;		
		margin-top:5px;
		margin-left: 16px;
		margin-right: 16px;
	}
	.option-icon{
		width: 18px;
		height: 18px;
		margin-left: 10px;
		margin-top: 11px;
		
	}
	.child-option-icon{
		width: 18px;
		height: 18px;
		margin-left: 30px;
	}
	.option-time{
		margin-left: 10px;
		border-style:none none solid none;
		border-color: #666666;
		border-bottom-width: .25px;
		min-width: 150px;
		margin-top: 11px;
		min-height: 18px;
	}
	.option-title{
		line-height: 18px;
		font-size: 15px;
		margin-left: 10px;
		margin-top: 11px;
		margin-bottom: 11px;
		margin-right: 10px;
		width: calc(100% - 50px);
	}
	.question-img-back{
	  /* position: absolute; */
	  display: flex;
	  background-color:#FFFFFF;
	  width: 94vw;
	  margin-left: 3%;
	  margin-top: 5px;
	  align-content: center;
	  justify-content: center;
	  align-items: center;
	 
	}
	.question-img{
	/* margin: 0 auto; */
	  /* position: relative; */
	  /* margin-top: 10rpx; */
	  
	}
	.chilOptions{
	  display: flex;
	  flex-direction: column;
	  /* height: 360rpx; */
		
	}
	.chilOption{
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 2.5px;
		min-height: 40px;		
		margin-top:5px;
		margin-left: 16px;
		margin-right: 16px;
	}
	.chilOption-select{
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: #6AB3F9;
		border-radius: 2.5px;
		min-height: 40px;		
		margin-top:5px;
		margin-left: 16px;
		margin-right: 16px;
	}
	.button{
		display: flex;
		flex-direction: row;
		margin-top: 30px;
		/* height: 80rpx; */
	}
	.left-button{
		width: 30vw;
		background-color: #2FE670;		
		margin-bottom: 15px;
	}
	.right-button{
		width: 30vw;
		background-color: #2FE670;	
		margin-bottom: 15px;
	}
	.textInput{
		background-color: #FFFFFF;
		width: calc(100% - 32px);
		height: 225px;
		margin-left: 16px;
		margin-top: 13px;
		border-radius: 5px;
		padding: 5px 5px 5px 5px;
	}
</style>
