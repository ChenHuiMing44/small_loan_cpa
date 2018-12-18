
const path = require('path');
let timestamp = (new Date()).valueOf();
const buildPath = require("./webpack.config/path");

module.exports = {
	entry: buildPath,
	output: {
		path: path.resolve(__dirname , 'dist'),
		filename: "[name]" + ".js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
			},
		]
	},
	mode: 'production'
}
