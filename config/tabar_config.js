const config = require('./config.js')

module.exports = {
	"globalStyle": {
			"navigationBarTextStyle": "white",
			"navigationBarTitleText": "北辰心理",
			"navigationBarBackgroundColor": "#3399FF",
			"backgroundColor": "#3399FF",
			"rpxCalcMaxDeviceWidth": 750, // rpx 计算所支持的最大设备宽度，单位 px，默认值为 960
			"rpxCalcBaseDeviceWidth": 960, // rpx 计算使用的基准设备宽度，设备实际宽度超出 rpx 计算所支持的最大设备宽度时将按基准宽度计算，单位 px，默认值为 375
			"rpxCalcIncludeWidth": 750 // rpx 计算特殊处理的值，始终按实际的设备宽度计算，单位 rpx，默认值为 750
		},
		// "rightWindow": {
		// "path": "pages/index/index.vue", // 指定 rightWindow 页面文件
		// "style": {
		//   "width": "300px" // 页面宽度	  
		// 	}
		// },
	"tabBar": {
		"color":"#808080",
		"selectedColor":"#3399FF",
		"backgroundColor":"#EEEEEE",
		"list": [
			{
			  "pagePath": "pages/home/home",
			  "text": "主页",
				"invisiable":config.home,
			  "iconPath": "static/img/tabBar/home_nomal.png",
			  "selectedIconPath": "static/img/tabBar/home_selected.png"
			},
			{
			  "pagePath": "pages/science/science",
			  "text": "科普",
				"invisiable":config.science,
			  "iconPath": "static/img/tabBar/science_nomal.png",
			  "selectedIconPath": "static/img/tabBar/science_selected.png"
			},
			{
			  "pagePath": "pages/evaluation/evaluation",
			  "text": "测评",
			  "invisiable":config.evaluation,
			  "iconPath": "static/img/tabBar/evaluation_nomal.png",
			  "selectedIconPath": "static/img/tabBar/evaluation_selected.png"
			},
			{
			  "pagePath": "pages/consult/consult",
			  "text": "咨询",
				"invisiable":config.consult,
			  "iconPath": "static/img/tabBar/consult_nomal.png",
			  "selectedIconPath": "static/img/tabBar/consult_selected.png"
			},
			{
			  "pagePath": "pages/mine/mine",
			  "text": "我的",
				"invisiable":config.mine,
			  "iconPath": "static/img/tabBar/mine_nomal.png",
			  "selectedIconPath": "static/img/tabBar/mine_selected.png"
			}
		]
	}
}
