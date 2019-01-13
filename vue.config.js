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

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    background: {
      entry: 'src/background/background.js',
      chunks: ['background']
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
    }
  }
}