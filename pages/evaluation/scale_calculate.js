let age = '15'
let sex = '男'
let education = '博士'
let selectArray = []

export default{
	getFactorInfo: function(paperId){
		this.request.startRequest({
			url:_this.api.getFactorInfo,
			showLoading:false,
			data: {
				"PaperID":paperId,
				
			},
		}).then(res =>{
			// console.log(JSON.stringify(res))
			if(res.data.Code == 0){
				return res.data.Data[0]
			}
		}).catch(reason =>{
			
		})				
	},
	calculate:function(factor,scale,questionList){
		
	},
	setDataWithAnswer:function(scale,factor,questionList){
		let array = [];
		
	}
}