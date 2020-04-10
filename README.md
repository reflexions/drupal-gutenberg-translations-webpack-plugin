# DrupalGutenbergTranslationsPlugin

A Webpack plugin for generating Drupal translations for Gutenberg modules.

## Setup
```
```

If your code optimizer is mangling variable names, you may need to prevent that in order for the translation tool to find translations.
Add the following code to your webpack config to prevent the translation var from being mangled:
```
// A similar option is also available for the UglifyPlugin if you choose to use that instead
const TerserPlugin = require('terser-webpack-plugin');
...
optimization: {
	minimize: process.env.NODE_ENV === 'production',
	minimizer: [new TerserPlugin({
		terserOptions: {
			mangle: {
				reserved: [ '__' ],
			},
		},
	})],
},
```
