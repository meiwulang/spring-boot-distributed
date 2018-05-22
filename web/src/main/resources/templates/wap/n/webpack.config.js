var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var entrys = function(){
	var entryFiles = glob.sync(__dirname + '/assets/js/develop/*.js');
	var map = {};
	entryFiles.forEach(function(filePath){
		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
		map[filename] = filePath
	})
	return map;
}

module.exports = {
	entry : entrys(),
	output: {
		path: __dirname + '/assets/js/build',
		filename: '[name].build.js'
	},
	resolve: {
		alias: {
			'@' : __dirname,
			'jquery' : '@/assets/js/lib/jquery.2.1.4.js',
			'template' : '@/assets/js/lib/artTemplate.js',
			'echarts' : '@/assets/js/lib/echarts.js'
		}
	},
	module: {
		loaders: [
			{ 
				test: /\.less$/, 
				loader: process.env.NODE_ENV === 'production' ?
				ExtractTextPlugin.extract('style-loader','css-loader!less-loader') : 'style-loader!css-loader!less-loader'
			},
			{ test: /\.html$/, loader: 'html' },
			{ test: require.resolve(__dirname + '/assets/js/lib/jquery.2.1.4.js'), loader: "expose-loader?jQuery" },
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			},
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    useRelativePath: true,
                    context:path.resolve(__dirname, 'assets'),
                    // outputPath: path.resolve(__dirname, 'dist'),
                    name: '[name].[ext]'
                }
            }
		]
	},
	// 配置babel转化成es5的语法
	babel: {
		presets: ['env', 'stage-1'],
		plugins: ['transform-runtime']
	},
	plugins: (function() {
		var configDev = [
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			// 用于提取 !"多个入口文件"! 的公共部分
			new webpack.optimize.CommonsChunkPlugin('common.build.js'),			
		]

		process.env.NODE_ENV === 'production' && configDev.push(
			new ExtractTextPlugin( '../../css/[name].css', {
				publicPath: '/assets/css',
				allChunks: true,	//所有css是否合并成一个文件
			})
		)

		return configDev
	})(),
	devServer: {
		stats: 'minimal',
		disableHostCheck: true,
		hot: true,
		inline: true,
		open: true,
		host: '127.0.0.1',
		port: 3002,
		publicPath: '/assets/js/build'
	}
}