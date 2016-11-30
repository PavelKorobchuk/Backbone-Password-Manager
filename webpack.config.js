var webpack = require('webpack');
module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname,
        filename: "build.js",
        library: "app"
    },
   watch: true,
  devtool: "source-map",

  module: {
      loaders:[{
          test: /\.js$/,
          loader: 'babel?presets[]=es2015',
      }]

  },
  resolve: {
        root: ['/node_modules']
    },
  plugins: [
  new webpack.ProvidePlugin({
    $: "jquery/dist/jquery.js",
    jQuery: "jquery/dist/jquery.js",
    Backbone: "backbone/backbone.js",
    _: "underscore/underscore.js"
  })
],
};