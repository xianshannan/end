var webpack = require('webpack')
var path = require('path')
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

/**
 * 开发环境开react热替换
 */
var entry,leb;
var NODE_ENV = 'development';
//entry = ['webpack-dev-server/client?http://localhost:8000','webpack/hot/only-dev-server','./src/index.jsx']; 
entry = [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/index.jsx'
]
module.exports = {
	devtool: 'inline-source-map',
	entry: {
		app : entry,
		libs : ['react','antd'], 
	}, 
    output: {
		publicPath: '/js/',
		path: __dirname + '/public/js/',
        filename: 'bundle.js',
		libraryTarget: "umd",
		chunkFilename: '[name].chunk.js?random='+new Date().getTime()
    },
	module: {
        loaders: [
			{ test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'},
			{ 
            	test: /\.js[x]?$/, 
            	loader: 'babel',
				exclude: /node_modules/,//解析node_modules的es6语法 
            },
            { test: /\.css$/, loader: "style!css" },
        ]
    },
	resolve: {
		alias: {
			'.fr': __dirname + '/.fr/',
			'r2': path.resolve(__dirname,'src/libs/r2'),
			'frontend': __dirname + '/.fr/generator/frontend',
			'css': __dirname + '/style/css/',
			'img': __dirname + '/style/img/',
			'src': __dirname + '/src/',
			'page': __dirname + '/src/page/',
			'libs': __dirname + '/src/libs/',
			'JSONP': __dirname + '/src/libs/jsonp.js',
			'function': __dirname + '/src/libs/function.js',
			'validate': path.resolve(__dirname,'src/libs/antd-form-validate'),
			'common': __dirname + '/src/libs/temp',
		}, 
		extensions: ['', '.js', '.jsx']
	},
	externals : [
		{
		}
	],
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin("vendor","vendor.bundle.js",['app']),
		new webpack.optimize.CommonsChunkPlugin("libs","libs.bundle.js",['vendor','chunk']),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(NODE_ENV)  //定义开发和生产环境
		}),
    ]
};
