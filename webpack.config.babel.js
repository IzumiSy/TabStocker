import 'babel-polyfill';
import webpack from 'webpack';
import copyWebpackPlugin from 'copy-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = !process.argv.includes('--verbose');

export default {
  cache: DEBUG,
  debug: DEBUG,

  stats: {
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    cached: VERBOSE
  },

  devtool: DEBUG && 'inline-source-map',

  entry: {
    background: __dirname + '/src/background.js',
    options: __dirname + '/src/options.js',
    popup: __dirname + '/src/popup.js'
  },

  output: {
    path: __dirname + '/dists',
    filename: '[name].js'
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],

    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime', 'transform-async-to-generator']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.(png|jpg)(\?.*)?$/,
      loader: 'file?name=/assets/[name].[ext]'
    }]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: DEBUG
      }
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),

    new copyWebpackPlugin([
      { from: 'src/popup.html', to: '../dists/' },
      { from: 'src/options.html', to: '../dists/' }
    ])
  ]
}
