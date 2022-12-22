const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


 
module.exports = {
    mode: "development",
    watch: true,
    entry: './src/client/index.tsx',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist/client')
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, 'dist/client')
                ],
                loader: "handlebars-loader"
            },
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
            {
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
        ]
    },
    plugins: [
		new HtmlWebpackPlugin({
			template: './src/client/index.html',
		}),
		new MiniCssExtractPlugin(),
	],
};