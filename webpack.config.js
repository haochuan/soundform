module.exports = {
    context: __dirname + '/src',
    entry: {
        javascript: './main.js',
        html: './index.html'
    },

    output: {
        filename: 'main.js',
        path: __dirname + '/dist'
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loaders: ["react-hot", "babel-loader"],
            },
            {
              test: /\.css$/, // Only .css files
              loader: 'style!css' // Run both loaders
            }

        ]
    }
}