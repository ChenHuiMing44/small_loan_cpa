
const path = require('path');

module.exports = {
	entry: "./lib/rongshu/rongshu1.js",
	output: {
		path: path.resolve(__dirname , 'dist'),
		filename: "rongshu1.js"
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
