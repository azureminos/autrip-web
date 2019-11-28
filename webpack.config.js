/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = [
	{
		context: path.join(__dirname),
		entry: 'index',
		output: {
			path: path.join(__dirname, 'public'),
			filename: 'bundle.js',
		},
		optimization: {
			minimize: false,
		},
		module: {
			rules: [
				{ test: /\.css$/, loader: 'style-loader!css-loader?-svgo' },
				{
					test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
					loader: 'url-loader',
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
			],
		},
		resolve: {
			extensions: ['.js', '.jsx'],
			modules: [path.join(__dirname, 'client'), 'node_modules'],
		},
	},
];
