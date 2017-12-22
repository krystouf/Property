module.exports = {
	entry: "./src/index.tsx",
	output: {
		filename: "./dist/bundle.js"
	},

	devtool: "source-map",

    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".json"]
    },

	module:{
		loaders: [
			{ 
				test: /\.tsx?$/, 
				loader: "ts-loader" 
			},
			{
				test: /\.json$/, 
				loader: 'json-loader'
			}
		]
	}
};