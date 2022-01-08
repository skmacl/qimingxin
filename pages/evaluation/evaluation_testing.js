const getLetterPath = function(number){
	let path = "../../static/img/evaluation/"
	let letter = String.fromCharCode(number + 65)
	return path + letter + '.png'
}
//量表是否支持临时保存
const paperCanSave = function(paperId){
	var list = ["e25d39c6-be4e-4e88-8d40-3a167f9153ad",//Marks恐怖强迫量表 父子题
                "c5bacd6f-6bff-426f-96bf-93d59b0b96d5",//心境障碍问卷 父子题
                "c26a5c12-3027-4e1e-a2bc-c48f6910591c",//父子题
                "045f81bc-caf1-49a5-b090-9c581c0c3c85",//生活事件量表 父子题、跳题
                "357f44a2-2772-4f95-ba28-96f36cec3185",//匹兹堡睡眠  //父子题，时间选择型填空
                "668ac6a1-55ff-446f-b15c-5bd5ca1a1e1e",//社会支持评定
				"4e33cfa3-e7fb-4587-886b-4c85e29120b3",//军人应对方式
				]
		return !list.includes(paperId)
}
//获取当前时间
const getCurrentTime = function(){
	var date = new Date();
	    let year = date.getFullYear().toString();
	    let month = (date.getMonth()+1).toString();
	    let day = date.getDate().toString();
	    let hour = date.getHours().toString();
	    let minutes = date.getMinutes().toString();
	    let seconds = date.getSeconds().toString();
	
	    return year + '-' + (month.length > 1 ? month : ('0' + month))+ '-' + (day.length > 1 ? day : ('0' + day)) + ' ' + (hour.length > 1 ? hour : ('0' + hour)) + ':' + (minutes.length > 1 ? minutes : ('0' + minutes)) + ':' + (seconds.length > 1 ? seconds : ('0' + seconds));
		
}
//计算时间差
const timeCalculate = function(StartDateTime){
	let currentTime = getCurrentTime();
	var start = new Date(StartDateTime)
	var current = new Date(currentTime)
	var dif = (current.getTime() - start.getTime())/1000
	return dif;
}
//时间格式化展示
const timeFormatter = function(interval){
	let hour = parseInt(interval / 3600).toString()
	let minute = parseInt((interval % 3600) / 60).toString()
	let seconds = parseInt(interval % 60).toString()
	
	hour = hour.length == 1?'0' + hour:hour
	minute = minute.length == 1?'0' + minute:minute
	seconds = seconds.length == 1?'0' + seconds:seconds
	return hour + ':' + minute + ':' + seconds
}
//特殊情况估算开始时间
const estimateStartTime = function(questionCount){
	let timeDif = questionCount * 3
	var current = new Date().getTime();
	let start = current - timeDif * 1000
	let date = new Date(start);
	let year = date.getFullYear().toString();
	let month = (date.getMonth()+1).toString();
	let day = date.getDate().toString();
	let hour = date.getHours().toString();
	let minutes = date.getMinutes().toString();
	let seconds = date.getSeconds().toString();		
	return year + '-' + (month.length > 1 ? month : ('0' + month))+ '-' + (day.length > 1 ? day : ('0' + day)) + ' ' + (hour.length > 1 ? hour : ('0' + hour)) + ':' + (minutes.length > 1 ? minutes : ('0' + minutes)) + ':' + (seconds.length > 1 ? seconds : ('0' + seconds));
}
	//当前题目是否已完成 20200822*
const IsDone = function(question) {			
	// var question = questionList[idx];				
	switch (parseInt(question.IsMultiSelect)) {					
		case 1: {						
			var isDone = false;
			var options = question.AnswerList;
			for(var i = 0; i < options.length; i++){
				var item = options[i]							
				if(item.AnswerChecked == true){
				  if(item.List != null && item.List.length > 0){
					  for(var j = 0; j < item.List.length;j++){
						  var child = item.List[j]
						  if(item.AnswerChecked == true){
							isDone = true;
						  }
					  }								
				  }else{								
					isDone = true;
				  }
				}
			}	
				// console.log(isDone)
			return isDone;
		}
			break;
		case 2: {
			return true;
		}
			break;
		case 3: {
			var isDone = false;
			var checkOption = question.AnswerList[0];
			var opId = checkOption.optionID;
			var optionValue = checkOption.AnswerResult;
			if (optionValue != null && optionValue.length > 0) {
				isDone = true;

			}
			return isDone;
		}
			break;
		case 6: {
			return true;
		}
			break;
		case 9: {
			var isDone = false;
			var checkOption = question.AnswerList[0];
			// var opId = checkOption.optionID;

			if (checkOption.AnswerResult != null && checkOption.AnswerResult.length == 8) {
				//时间格式要正确:20:20:00
				isDone = true;
			}
			return isDone;
		}
			break;
		
		default: { return false } break;
	}
}
//是否已完成
const IsFinish = function(questionList,fromIndex, toIndex) {
		      
	var isFinish = false;
	loop1: for (var i = fromIndex; i <= toIndex; i++) {
		if (!IsDone(questionList[i])) {
			return false;
		}
		if (i == toIndex) {
			return true;
		}
		// console.log(fromIndex,toIndex)
		// console.log("*1" + i);
		var question = questionList[i];
		
		loop2: for (var j = 0; j < question.AnswerList.length; j++) {
			let item = question.AnswerList[j];
			if (item.AnswerChecked == true) {
				
				if (item.SkipToQuestionId == "-1") {
					console.log('遇见-1')
					isFinish = true;
					break loop1;
				} else {
					if (item.SkipToQuestionNumber == 0) {
						isFinish = true;
						continue loop1;
					} else {
						i = item.SkipToQuestionNumber - 1-1;
						continue loop1;
					}
				}
			}
		}
	}
	return isFinish;
	
}

const dataExtraction = function (scale,questionList,publishId,index){
	
	var tmpResult = "";
	var questionList = questionList;
	if(scale.IsMissQuestion || scale.TimeLimit > 1){
	  for(var i=0;i<=index;i++){
		var item = questionList[i];
		var answerList = item.AnswerList;
		var isMiss = true;
		for(var j = 0; j < answerList.length; j++){
		  
		  var answer = answerList[j]
		  if(answer.AnswerChecked == true){
			isMiss = false;			
			tmpResult = tmpResult + ";";
			tmpResult = tmpResult + item.QuestionId;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + answer.AnswerId;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + item.StartDateTime;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + item.EndDateTime;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + answer.AnswerResult;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + "0";
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + item.PreQuestionNumber;
			
		  }
		}
		if(isMiss){
		  tmpResult = tmpResult + ";";
		  tmpResult = tmpResult + item.QuestionId;
		  tmpResult = tmpResult + "|";

		  tmpResult = tmpResult + "|";
		  tmpResult = tmpResult + "1900-01-01 00:01";
		  tmpResult = tmpResult + "|";
		  tmpResult = tmpResult + "1900-01-01 00:01";
		  tmpResult = tmpResult + "|";
		  tmpResult = tmpResult + "";
		  tmpResult = tmpResult + "|";
		  tmpResult = tmpResult + "0";
		  tmpResult = tmpResult + "|";
		  tmpResult = tmpResult + item.PreQuestionNumber;
		}
	  }
	}else{
	  for(var i=0;i<=index;i++){
		var item = questionList[i];
		var answerList = item.AnswerList;
		for(var answer of answerList){
		  // var AnswerChecked = answer.AnswerChecked.toString;
		  if(answer.AnswerChecked == true){
			isMiss = false;
			tmpResult = tmpResult + ";";
			tmpResult = tmpResult + item.QuestionId;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + answer.AnswerId;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + item.StartDateTime;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + item.EndDateTime;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + answer.AnswerResult;
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + "0";
			tmpResult = tmpResult + "|";
			tmpResult = tmpResult + item.PreQuestionNumber;
			
			var cAnswerList = answer.List;
			if(cAnswerList != null && cAnswerList.length>0){
			  for(var j = 0; j < cAnswerList.length; j++){
				let cAnswer = cAnswerList[j]			                
				if(cAnswer.AnswerChecked == true){              
				  tmpResult = tmpResult + ";";
				  tmpResult = tmpResult + item.QuestionId;
				  tmpResult = tmpResult + "|";
				  tmpResult = tmpResult + cAnswer.AnswerId;
				  tmpResult = tmpResult + "|";
				  tmpResult = tmpResult + item.StartDateTime;
				  tmpResult = tmpResult + "|";
				  tmpResult = tmpResult + item.EndDateTime;
				  tmpResult = tmpResult + "|";
				  tmpResult = tmpResult + answer.AnswerResult;
				  tmpResult = tmpResult + "|";   
				  tmpResult = tmpResult + answer.AnswerId;
				  tmpResult = tmpResult + "|";   
				}
			  }
			  
			}
		  }
		}
	  }
	}
	return{
	  // "ComTypCode":"001",
	  "EndDateTime":getCurrentTime(),
	  "IsSubmit":"1",
	  "ModuleId":"uni",
	  // "Out_trade_no":"",
	  "PaperId":scale.PaperId,
	  "PaperResultId":scale.PaperResultId,
	  "PaperTestProgress":scale.PaperTestProgress,
	  "PublishId":publishId,
	  "StartDateTime":scale.StartDateTime,
	  "TesterId":scale.TesterId,
	  "TmpResult":tmpResult,
	  // "TreatmentId":scale.TreatmentId,
	}
  }	

export default{
	getLetterPath,
	paperCanSave,
	getCurrentTime,
	timeCalculate,
	timeFormatter,
	dataExtraction,
	IsFinish,
	IsDone,
	estimateStartTime
}