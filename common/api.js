
/*
**example 'this.api.baseUrl'
*/
// const baseUrl = 'http://localhost/'

const baseUrl = "http://212.129.236.55:9005"

/*
**首页数据
*/
const PostMain = baseUrl + "/api/Home/QueryHomeIndex"

/*
**首页新动态
*/
const PostInfoForXDT = baseUrl + "/api/CMS/PostInfoForXDT"
/*
**早安图列表
*/
const PostMorningList = baseUrl + "/api/CMS/PostMorningList"
/*
**自助首页
*/
const PostZZPage = baseUrl + "/api/CMS/GetCMSIndex"
/*
**所有音乐
*/
const PostAllMusicInfo = baseUrl + "/api/CMS/PostAllMusicInfoForBCDoctor"
/*
**所有文章
*/
const PostAllBookInfo = baseUrl + "/api/CMS/PostAllBookInfoForBCDoctor"
/*
**自助栏目分类
*/
const GetItemList = baseUrl + "/api/CMS/GetItemListByMaterialType"
/*
**音乐信息
*/
const PostMusicInfo = baseUrl + "/api/CMS/PostMusicInfoForBCDoctor"
/*
**新闻分页
*/
const PostInfo = baseUrl + "/api/CMS/PostInfo"
/*
**测评首页
*/
const PostInfoByID = baseUrl + "/api/CMS/PostInfoByID"
/*
**收藏
*/
const PostFavorite = baseUrl + "/api/CMS/PostFavorite"
/*
**取消收藏
*/
const PostCancelFavorite = baseUrl + "/api/CMS/PostCancelFavorite"
/*
**获取测评页
*/
const PostHomePaperList = baseUrl + "/api/Paper/GetPaperIndex"
/*
**获取量表信息
*/
const PostPaperInfo = baseUrl + "/api/Paper/GetPaperInfoByID"
/*
**获取未完成量表
*/
const PostPaperReportTmpList = baseUrl + "/api/Paper/PostPaperReportTmpList"
/*
**根据配置获取已完成量表
*/
const GetMyTestResultList = baseUrl + "/api/Paper/GetMyTestResultList"
/*
**获取量表状态
*/
const PostPaperState = baseUrl + "/api/Paper/GetPaperDetail"
/*
**获取发布量表
*/
const GetReleasePaperList = baseUrl + "/api/Paper/GetReleasePaperList"
/*
**获取测评首页
*/
const PostHomeList = baseUrl + "/api/Paper/PostHomeList"
/*
**获取分页量表
*/
const PostPaperList = baseUrl + "/api/Paper/PostPaperList"
/*
**量表临时保存
*/
const PostPaperSave = baseUrl +"/api/Paper/PostSaveForBC"
/*
**提交量表
*/
const PostPaperSubmit = baseUrl + "/api/Paper/SubmitPaperResult"
/*
**获取报告详情
*/
const GetAppReport = baseUrl + "/api/Paper/GetAppReport"
/*
**统一下单api
*/
const PostUnitOrder = baseUrl + "/api/WxPay/PostUnitOrder"
/*
**获取咨询室列表
*/
const PostCounselor = baseUrl + "/api/Consultation/PostCounselorForBC"
/*
**获取咨询价格
*/
const PostPriceStand = baseUrl + "/api/Consultation/PostPriceStand"
/*
**获取字典分类
*/
const PostDictionaryClass = baseUrl + "/api/User/GetDictionaryByKey"
/*
**h获取咨询师详情
*/
const PostCounselorDetail = baseUrl + "/api/Consultation/PostCounselorDetailForBC"
/*
**获取更多评论
*/
const PostMoreComment = baseUrl + "/api/Consultation/PostMoreComment"
/*
**获取咨询室排班
*/
const PostScheduleList = baseUrl + "/api/Consultation/PostScheduleListForBCDoctor"
/*
**提交预约
*/
const PostSubmitConsult = baseUrl + "/api/Consultation/PostSubmitConsultForBCDoctor"
/*
**获取咨询机构
*/
const PostOrganization = baseUrl + "/api/Consultation/PostOrganization/"
/*
**获取咨询机构信息
*/
const PostOrganizationDetail = baseUrl + "/api/Consultation/PostOrganizationDetail"
/*
**用户信息修改
*/
const SetUserInfo = baseUrl + "/api/User/SaveUserInfo"
/*
**上传用户头像
*/
const PostSaveImage = baseUrl + "/api/User/UploadImg"
/*
**退款
*/
const PostBackstageRefundOrder = baseUrl + "/api/WxPay/PostBackstageRefundOrder"
/*
**获取我的收藏
*/
const PostGetMyFavorite = baseUrl + "/api/User/PostGetMyFavoriteForBCDoctor"
/*
**获取我的消息
*/
const PostMessage = baseUrl + "/api/Message/PostMessage"

/**
 * 获取我的咨询订单
 */
const PostMyConsultOrderForBCDoctor = baseUrl + "/api/Consultation/PostMyConsultOrderForBCDoctor"
/**
 * 修改我的咨询订单
 */
const PostModifyMyConsultOrderForBCDoctor = baseUrl + "/api/Consultation/PostModifyMyConsultOrderForBCDoctor"
/**
 * 删除我的咨询订单
 */
const PostDelMyConsultOrder = baseUrl + "/api/Consultation/PostDelMyConsultOrder"
/**
 * 上传评论
 */
const PostComment = baseUrl + "/api/CMS/PostComment"
/**

 * 获取我的咨询订单详情
 */
const PostMyConsultOrderDetailForBCDoctor = baseUrl + "/api/Consultation/PostMyConsultOrderDetailForBCDoctor"
/**
 * 登录
 */
const PostLogin  = baseUrl + "/api/User/Login"
/**
 * 注册
 */
const PostRegister  = baseUrl + "/api/User/Register"
/**
 *通用注册
 */
const PostRegisterForCommon  = baseUrl + "/api/User/Register"
/**
 * 验证码
 */
const PostSendSMSForPrint  = baseUrl + "/api/User/PostSendSMSForPrint"

/**
 * 修改密码
 */
const PostUpdatePWDForBC  = baseUrl + "/api/User/PostUpdatePWDForBC"

/**
 * 用户协议 隐私政策
 */
const PostAgreementManagement  = baseUrl + "/api/User/PostAgreementManagement"
/**
 * 反馈
 */
const PostFeedback = baseUrl + "/api/User/PostFeedback"
/**
 * 获取机构
 */
const PostDepartmentByDeptCode = baseUrl + "/api/User/GetOrgAndChildNode"
/**
 * 获取注册单位列表
 */
const getDep = baseUrl + "/api/User/GetOrgAndChildNode"
/**
 * 获取媒体信息
 */
const PostMusicInfoByID = baseUrl + "/api/CMS/PostMusicInfoForBCDoctorByID"

/**
 *  注销
 */
const PostCancelUser = baseUrl + "/api/User/PostCancelUser"
/**
 * 因子
 */
const getFactorInfo = baseUrl + "/api/Paper/PostFactor"

const GetPaperListByCategoryID = baseUrl + "/api/Paper/GetPaperListByCategoryID"
const GetMaterialByMaterialID = baseUrl + "/api/CMS/GetMaterialByMaterialID"
const GetMaterialByItemID = baseUrl + "/api/CMS/GetMaterialByItemID"
export default {	
	baseUrl,
	PostMain,//首页数据
	PostInfoForXDT,//首页新动态
	PostMorningList,//安图列表
	PostZZPage,//自助首页
	PostAllMusicInfo,//所有音乐
	PostAllBookInfo,//所有文章
	GetItemList,//自助栏目分类
	PostMusicInfo,//音乐信息
	PostInfo,//新闻分页
	PostInfoByID,	
	PostFavorite,//收藏
	PostCancelFavorite,//取消收藏
	PostHomePaperList,//获取测评页
	PostPaperInfo,//获取量表信息
	PostPaperReportTmpList,//获取未完成量表
	PostPaperSave,//量表临时保存
	PostPaperSubmit,//提交量表
	GetMyTestResultList,//获取已完成量表
	PostPaperState,//获取量表状态
	GetReleasePaperList,//获取发布量表
	PostHomeList,//获取测评首页
	PostPaperList,//获取分页量表
	PostUnitOrder,//统一下单api
	PostCounselor,//获取咨询师列表
	PostPriceStand,//获取咨询价格
	PostDictionaryClass,//获取字典分类
	PostCounselorDetail,//获取咨询室详情
	PostMoreComment,//获取更多评论
	PostScheduleList,//获取咨询室排班
	PostSubmitConsult,//提交预约
	PostOrganization,//获取机构
	PostOrganizationDetail,//机构信息	
	SetUserInfo,//用户信息修改
	PostSaveImage,//上传用户头像
	PostBackstageRefundOrder,//退款
	PostGetMyFavorite,//获取我的收藏
	PostMessage,//获取我的消息
	PostMyConsultOrderForBCDoctor,//获取我的咨询订单
    GetAppReport,//获取报告
	PostModifyMyConsultOrderForBCDoctor,//修改我的咨询订单
	PostDelMyConsultOrder,//删除我的咨询订单
	PostComment,//上传评论
	PostMyConsultOrderDetailForBCDoctor,//获取我的咨询订单详情
	PostLogin,//登录
	PostRegister,//注册
	PostSendSMSForPrint,//发送验证码
	PostUpdatePWDForBC,//修改密码
	PostAgreementManagement,//用户协议 隐私政策
	PostFeedback,//反馈
	PostDepartmentByDeptCode,//获取机构
	PostMusicInfoByID,
	PostCancelUser,
	PostRegisterForCommon,
	getFactorInfo,
	getDep,
	GetPaperListByCategoryID,
	GetMaterialByItemID,//根据分类id获取分类下列表
	GetMaterialByMaterialID
}