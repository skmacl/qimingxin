const fs = require('fs')
const path = require('path')
const router = require('./tabar_config.js')
const config = require('./config.js')

// 执行 node router/build.js
// 将子路由模块配置文件转化为 uniapp 配置文件格式
const buildRouter = route => {
	const res = []
	const {
		baseUrl,
		children
	} = route

	function builder(baseUrl, children) {
		children.forEach(i => {
			if (i.children) {
				builder(baseUrl + i.path + '/', i.children)
			} else {
				const obj = {
					path: baseUrl + i.path,
					style: {

					}
				}
				if (!i.invisiable) {
					if (i.style) {
						Object.keys(i.style).forEach(ii => {
							// console.log("isShow:  "+ JSON.stringify(i.invisiable)  );
							// console.log(i.style[ii])
							if(ii == 'navigationStyle'){
								if(config.platform == "H5" || i.path == "pages/evaluation/evaluation" || i.path == "pages/consult/consult"){
									i.style[ii] = "custom"
								}else{									
									i.style[ii] = "default"										
								}							
							}							
							!['path', 'style'].includes(ii) && (obj.style[ii] = i.style[ii])
						})
						res.push(obj)
					}
				}

			}
		})
	}
	builder(baseUrl, children)
	return res
}

// 自动加载 './modules' 目录子路由配置文件
const getRouter = () => {
	const srcPath = path.resolve(__dirname, './sourceFile')
	const result = fs.readdirSync(srcPath)
	let router = []

	result.forEach(r => {
		const route = require('./sourceFile/' + r)
		router = [...router, ...buildRouter(route)]
	})
	return router
}

// 大模块是否显示逻辑判断
const getStartRouter = () => {
	let result = []
	router.tabBar.list.forEach(r => {
		console.log("invisiable开始: " + JSON.stringify(r.invisiable))
		if (r.invisiable) {
			delete r.invisiable
			result.push(r)
		}
	})
	router.tabBar.list = result
	return result
}

// 构建 pages 并写入 pages.json 文件
getStartRouter()

router.pages = getRouter()
fs.writeFile(
	__dirname + '/../pages.json',
	// 我这边是用两个空格来缩进 pages.json，如果喜欢制表符，第三个参数更换你为 \t 即可
	JSON.stringify(router, null, '  '),
	e => e ? console.error(e) : console.log('pages.json 配置文件更新成功')
)
