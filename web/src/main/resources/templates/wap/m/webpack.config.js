var webpack = require('webpack'),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

var Path = {
	Js : {
		Dev : './assets/js/develop/',
		Build : './assets/js/build/'
	},
	Css : './assets/css/',
	Img : '.../img/'
}

module.exports = {
	entry : {
		// userinfo : './assets/js/common/userinfo.js',

		login : Path.Js.Dev + 'login.js',
		index : Path.Js.Dev + 'index.js',
		list : Path.Js.Dev + 'list.js',
		detail : Path.Js.Dev + 'detail.js',
		schedule : Path.Js.Dev + 'schedule.js',
		order : Path.Js.Dev + 'order.js',
		order_success : Path.Js.Dev + 'order_success.js',
		pay : Path.Js.Dev + 'pay.js',
		wechat : Path.Js.Dev + 'wechat.js',
		pay_success : Path.Js.Dev + 'pay_success.js',
		
		order_list : Path.Js.Dev + 'order_list.js',
		order_list_buyer : Path.Js.Dev + 'order_list_buyer.js',
		order_detail : Path.Js.Dev + 'order_detail.js',
		order_search : Path.Js.Dev + 'order_search.js',
		order_touristinfo : Path.Js.Dev + 'order_touristinfo.js',
		order_payproof : Path.Js.Dev + 'order_payproof.js',
		center : Path.Js.Dev + 'center.js',
		order_refundApply : Path.Js.Dev + 'order_refundApply.js',
		order_refundRecord : Path.Js.Dev + 'order_refundRecord.js',	
		order_endorse :	Path.Js.Dev + 'order_endorse.js',
		order_endorseDate :	Path.Js.Dev + 'order_endorseDate.js',

		bills_detail : Path.Js.Dev + 'bills_detail.js',
		plan_list : Path.Js.Dev + 'plan_list.js',
		plan_detail : Path.Js.Dev + 'plan_detail.js',
		credit : Path.Js.Dev + 'credit.js',
		
		guide_index : Path.Js.Dev + 'guide_index',
		guide_tour : Path.Js.Dev + 'guide_tour',
		guide_stay : Path.Js.Dev + 'guide_stay',
		guide_proof : Path.Js.Dev + 'guide_proof',
		guide_team : Path.Js.Dev + 'guide_team',
		guide_write : Path.Js.Dev + 'guide_write',
		guide_mation : Path.Js.Dev + 'guide_mation',
		guide_user : Path.Js.Dev + 'guide_user',
		guide_list : Path.Js.Dev + 'guide_list',
		download_check : Path.Js.Dev + 'download_check',
		pact_success : Path.Js.Dev + 'pact_success',
		made_success : Path.Js.Dev + 'made_success',
		made_message : Path.Js.Dev + 'made_message',

		made_list : Path.Js.Dev + 'made_list',
		made_plan : Path.Js.Dev + 'made_plan',
		made_detail : Path.Js.Dev + 'made_detail',
		made_noright : Path.Js.Dev + 'made_noright',
		made_lookup : Path.Js.Dev + 'made_lookup',
		login_register : Path.Js.Dev + 'login_register'
	},
	output: {
		filename: Path.Js.Build + '[name].build.js'
	},
	module: {
		loaders: [
			{ 
				test: /\.less$/, 
				loader: ExtractTextPlugin.extract('style-loader','css-loader!less-loader')
			},
			{ test: /\.html$/, loader: 'html' },
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			}
		]
	},
	// 配置babel转化成es5的语法
	babel: {
		presets: ['es2015'],
		plugins: ['transform-runtime']
	},
	plugins: [
    	// 用于提取 !"多个入口文件"! 的公共部分
		new webpack.optimize.CommonsChunkPlugin( Path.Js.Build + 'common.build.js' ),
		// css文件独立插件
		new ExtractTextPlugin( Path.Css + '[name].css', {
			allChunks: true,
		})
	]
}