const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

let blocks = [];

if (process.env.VENDOR == 'chrome') {
  blocks.push({
    block: 'is-firefox',
    start: '<!--',
    end: '-->'
  }, {
    block: 'is-firefox',
    start: '/*',
    end: '*/'
  });
} else if (process.env.VENDOR == 'firefox') {
  blocks.push({
    block: 'is-chrome',
    start: '<!--',
    end: '-->'
  }, {
    block: 'is-chrome',
    start: '/*',
    end: '*/'
  });
}

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      title: 'Publisher Dashboard for Unity'
    },
    background: {
      entry: 'src/background/background.js',
      chunks: ['background']
    },
    'trend-analysis': {
      entry: 'src/trend-analysis/trend-main.js',
      title: 'Trend Analysis',
      chunks: ['chunk-vendors', 'trend-analysis']
    }
  },
  configureWebpack: {
    module: {
      rules: [{
          test: /\.vue$/,
          enforce: 'pre',
          exclude: /(node_modules|bower_components|\.spec\.js)/,
          use: [{
            loader: 'webpack-remove-blocks',
            options: {
              blocks
            }
          }]
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /(node_modules|bower_components|\.spec\.js)/,
          use: [{
            loader: 'webpack-remove-blocks',
            options: {
              blocks
            }
          }]
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: 'node_modules/x2js/dist/x2js.min.js',
        to: 'vendor/x2js',
        toType: 'dir'
      }]),
      new VuetifyLoaderPlugin()
    ]
  },
  chainWebpack: config => {
    config.plugins.delete('preload-index');
    config.plugins.delete('prefetch-index');
    config.plugins.delete('preload-background');
    config.plugins.delete('prefetch-background');
    config.plugins.delete('preload-trend-analysis');
    config.plugins.delete('prefetch-trend-analysis');
  }
}