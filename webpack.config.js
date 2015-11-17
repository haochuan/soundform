module.exports = {
    context: __dirname + '/src',
    entry: {
        javascript: './main',
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
                loaders: ['babel-loader']
            },
            {
                test: /\.jsx$/,
                loaders: ['babel-loader']
            },
            {
              test: /\.css$/, // Only .css files
              loader: 'style!css' // Run both loaders
            }

        ]
    }
};