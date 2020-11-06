const path = require('path');

module.exports = {
	mode: 'development',

	entry: {
		'bundle_retrieve': './assets/retrieve.js'
        // 'bundle_register': './assets/register.js'
	},

	output: {
		path: path.join(__dirname, 'assets'),
		filename: '[name].js'
	},

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.woff2$/,
        loader: 'file-loader'
      }
    ]
  }
};
