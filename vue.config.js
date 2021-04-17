module.exports = {
	transpileDependencies: [
		'vuetify'
	],

	/*
	configureWebpack: {
		node: {
			fs: 'empty',
		}
	}*/


	/*chainWebpack: config =>
	{
		config.module
			.rule('webm')
			.test(/webm-writer[\\/]/)
			.use('string-replace-loader')
			.loader('string-replace-loader')
			.options(
				{
					search: 'require(\'fs\')',
					//replace: 'null',
					replace: (match, p1, offset, string) =>
					{
						console.log("HERE WE ARE")
						return "null";
					}
				})


	}*/
}
