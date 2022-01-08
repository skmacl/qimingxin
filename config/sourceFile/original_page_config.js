const config = require('../config.js')

//预约
module.exports = {
	baseUrl: '',
	children: [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
		  "path": "pages/home/home",
		  "style": {
		    "navigationStyle": "custom",
		    "navigationBarTitleText": "主页",
		    "enablePullDownRefresh": true
		  }
		},
		{
		  "path": "pages/evaluation/evaluation",
		  "style": {
		    "navigationBarTitleText": "测评",
		    "navigationStyle": "custom",
		    "enablePullDownRefresh": true,
		    "rightWindow": true
		  }
		},
		{
		  "path": "pages/consult/consult",
		  "style": {
		    "navigationBarTitleText": "咨询",
		    "navigationStyle": "custom",
		    "enablePullDownRefresh": true
		  }
		},
		{
		  "path": "pages/science/science",
		  "style": {
		    "navigationStyle": "custom",
		    "navigationBarTitleText": "科普",
		    "enablePullDownRefresh": true
		  }
		},
		{
		  "path": "pages/mine/mine",
		  "style": {
		    "navigationStyle": "custom",
		    "navigationBarTitleText": "我的",
		    "app-plus": {
		      "bounce": "none"
		    }
		  }
		},
		 {
		   "path": "pages/mine/system/login",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "登录页"
		   }
		 },
		 {
		   "path": "pages/mine/system/agreement",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/system/register",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "注册"
		   }
		 },
		 {
		   "path": "pages/mine/system/mine_add_information",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "完善个人信息"
		   }
		 },
		 {
		   "path": "pages/mine/system/forget-pwd",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "忘记密码"
		   }
		 },
		 {
		   "path": "pages/consult/consult_detail",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 
		 {
		   "path": "pages/consult/consult_scheduling_list",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/consult/order_form",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/consult/order_state",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/evaluation/evaluation_detail",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/evaluation/evaluation_testing",
		   "style": {
		     "navigationStyle": "custom",
		     "app-plus": {
		       "bounce": "none",
		       "titleNView": {
		         "buttons": [
		           {
		             "text": "保存",
		             "fontSize": "17px"
		           }
		         ]
		       }
		     },
		     "h5": {
		       "titleNView": {
		         "buttons": [
		           {
		             "text": "保存",
		             "fontSize": "17px"
		           }
		         ]
		       }
		     }
		   }
		 },
		 {
		   "path": "pages/evaluation/evaluation_group",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "量表分类",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/evaluation/evaluation_list",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/evaluation/evaluation_quick",
		   "style": {
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_group",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_art_detail",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/science/science_music_detail",
		   "style": {
		     "navigationStyle": "custom",
		     "app-plus": {
		       "titleNView": false
		     }
		   }
		 },
		 {
		   "path": "pages/science/science_video_detail",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/science/science_art_group_list",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_video_type",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_video_group_list",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_all_art_list",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_all_music_list",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/science/science_all_video_list",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/mine/mine_appointment",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/myOrder/my_order",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/mine/myOrder/my_order_detail",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/myOrder/my_order_item",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/myOrder/submit_comments",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/mine_news",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "消息",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/mine/mine_collection",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "我的收藏",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/mine/mine_evaluation",
		   "style": {
		     "navigationStyle": "custom",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/mine/mine_report",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/system/mine_feedback",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/mine_abort",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/system/mine_system_setting",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/system/mine_change_pwd",
		   "style": {
		     "navigationStyle": "custom"
		   }
		 },
		 {
		   "path": "pages/mine/system/mine_information",
		   "style": {
		     "app-plus": {
		       "bounce": "none",
		       "titleNView": {
		         "buttons": [
		           {
		             "text": "保存",
		             "fontSize": "30rpx"
		           }
		         ]
		       }
		     }
		   }
		 },
		 {
		   "path": "pages/science/webCommonView",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "",
		     "enablePullDownRefresh": false
		   }
		 },
		 {
		   "path": "pages/consult/consult_similar_item",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "",
		     "enablePullDownRefresh": false
		   }
		 },
		 {
		   "path": "pages/consult/consult_comment_list",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/consult/schedule_list_item",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "",
		     "enablePullDownRefresh": false
		   }
		 },
		 {
		   "path": "pages/consult/order_information",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": ""
		   }
		 },
		 {
		   "path": "pages/home/xdt_list/xdt_list",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "心动态",
		     "enablePullDownRefresh": true
		   }
		 },
		 {
		   "path": "pages/consult/organization_item",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "",
		     "enablePullDownRefresh": false
		   }
		 },
		 {
		   "path": "pages/consult/organization_detail",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "",
		     "enablePullDownRefresh": false
		   }
		 },
		 {
		   "path": "pages/mine/system/mine_dept",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "机构",
		     "enablePullDownRefresh": false
		   }
		 },
		 {
		   "path": "pages/home/morning_list",
		   "style": {
		     "navigationStyle": "custom",
		     "navigationBarTitleText": "每日早安",
		     "enablePullDownRefresh": true
		   }
		 }
	]
}
