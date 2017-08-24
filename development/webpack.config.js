const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const PATHS = {
    app: path.join(__dirname, 'app'),
    'node_modules': path.join(__dirname, 'node_modules'),
    build: path.join(__dirname, '../'),
};

const commonConfig = merge([
    {
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        entry: {
            app: PATHS.app,
        },
        output: {
            path: PATHS.build,
            filename: '[name].js',
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Game of Life App',
                template: path.join(__dirname, 'public/index.html'),
            }),
        ],
    },
    {
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: PATHS.app,
                    exclude(path) {
                        return path.match(/node_modules/);
                    },

                    use: ['babel-loader', 'eslint-loader'],
                },
            ],
        },
    },

    {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include: PATHS['node_modules'],

                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.css$/,
                    include: PATHS.app,

                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: true,
                            },
                        },
                    ],
                },
            ],
        },
    },

]);

const productionConfig = merge([
    {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true,
                },
                compress: {
                    screw_ie8: true,
                },
                comments: false,
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
        ],
    },
]);

const developmentConfig = merge([
    {
        devServer: {
            historyApiFallback: true,
            stats: 'errors-only',

            host: null,
            port: null,

            overlay: {
                errors: true,
                warnings: true,
            },
        },
    },
]);

module.exports = (env) => {
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    }

    return merge(commonConfig, developmentConfig);
};
