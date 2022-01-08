
let userInfo = {}
let loginState = false

const userInfoKey = "userInfo"
const loginStateKey = "loginState"
const first = "first"

export default{
	isFirst(){
		try{
			let fis = uni.getStorageSync(first)
			if(fis != "first"){
				uni.setStorageSync(first,"first")
				return true
			}return false	
		}catch(e){
			uni.setStorageSync(first,"first")
			return true
		}
		
			
	},
	setUserData(info){
		let _this = this
		userInfo = info		
		loginState = true
		try{
			uni.setStorageSync(userInfoKey,JSON.stringify(info))						
		}catch(e){
			return false
		}		
		return true
	},
	setLoginState(state){
		if(state == false){			
			uni.setStorageSync(userInfoKey,"")				
			userInfo = {}
			loginState = false
		}
		let _this = this 
		loginState = state		
		try{
			uni.setStorageSync(loginStateKey,state)
		}catch(e){
			return false
		}
		return true
		
	},	
	getUserData() {
		if(this.getLoginState() == false){
			return {}
		}
		
		if(userInfo.UserID && userInfo.UserID.length > 2){
			return userInfo
		}else{
			try {
				let value = uni.getStorageSync(userInfoKey);
				if (value) {
					userInfo = JSON.parse(value)					
					return userInfo
				}
			} catch (e) {
				return e
			}	
		}					
	},
	getVersion(){
		return "0"
		if(this.getLoginState() == true){
			return this.getUserData().Version				
		}else{
			return "0"
		}
	},
	
	
	getLoginState() {
		
			try {
				return uni.getStorageSync(loginStateKey);				
			} catch (e) {
				return false
			}				
	},
	getUserId(){		
		if(this.getLoginState() == false){
			return "0"
		}else{
			return this.getUserData().UserID
			
		}
	},
	getHeaderPhoto(){
		return this.getUserData().HeadPhotoURL
	}
}

// getUserData返回结果
	/**
	        [{"UserID":"700c4dc7-addc-40b1-a87d-a67e95cc87db",
	        "Account":"13122350212",
	        "RealName":"姓名",
	        "Sex":"女",
	        "BirthDate":"1990-01-01",
	        "Mobile":"13122350212",
	        "eMail":"",
	        "DeptName":"软件部",
	        "DeptID":"Dept1316",
	        "Version":"0",
	        "HeadPhotoURL":"https://www.bcxl.cn:9224/ImageFolder/HeadPhotos/700c4dc7-addc-40b1-a87d-a67e95cc87db_20200603133327.jpg",
	        "BodyHeight":"165cm",
	        "BodyWeight":"50kg",
	        "MarriageState":"1002",
	        "MarriageStateValue":"未婚",
	        "AppCheckState":"0",
	        "AppCheckStateModify":"0",
	        "SelfIntroduction":"",
	        "YearsOfWorking":"",
	        "ResidenceAddress":"",
	        "Profession":"",
	        "PsyVocaQualification":"",
	        "VirtualName":"呵呵",
	        "UserType":"RegUT0102", // RegUT0101 内部来访者 RegUT0102 外部来访者 RegUT0201 内部咨询师 RegUT0202 外部咨询师
	        "State":"1",
	        "Org":"https://www.bcxl.cn:9225",
	        "OrgCode":"PoleStar",
	        "OrgName":"上海北辰软件股份有限公司",
	        "OrgLogo":"https://www.bcxl.cn:9224/Theme/TGreen/images/logo.png",
	        "JPTags":"0,Dept1269,Dept1316,Sg_Dept1316",
	        "Http":"https://www.bcxl.cn:9224",
	        "ConsultNum":"0",
	        "CommentScore":"10.0",
	        "HasPublish":"0"}]
	         */