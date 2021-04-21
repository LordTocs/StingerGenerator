const path = require('path');

module.exports = {

	//Set the output dir to be in /stingers for Netlify proxying.
	//outputDir: path.resolve(__dirname, "./dist/stingers/"),

	transpileDependencies: [
		'vuetify'
	],


	configureWebpack: {
		devServer: {
			headers: {
				'Cross-Origin-Opener-Policy': 'same-origin',
				'Cross-Origin-Embedder-Policy': 'require-corp'
			}
		}
	},
}
