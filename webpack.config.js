module.exports = {
    mode : 'development',

    entry: './src/application.js',

    output: {
        path: __dirname + '/dist',
        filename: 'dtms-bundle.js'
    },

    node: {
        fs: "empty"
    },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        //plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    }

};