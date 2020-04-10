const { resolve } = require('path');
const { spawn } = require('child_process');

class DrupalGutenbergTranslationsPlugin {
	constructor({ bin, path }) {
		this.path = path;

		if (!this.path) {
			throw new Error("`path` configuration option is required for DrupalGutenbergTranslationsPlugin");
		}

		this.bin = bin || resolve(
			__dirname,
			'node_modules',
			'.bin',
			'drupal-gutenberg-translations'
		);
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync('DrupalGutenbergTranslationsPlugin',
			(compilation, callback) => {
				console.log('Running drupal-gutenberg-translations...');

				const process = spawn(this.bin, [ this.path ]);

				process.stdout.on('data', (data) => {
					console.log('drupal-gutenberg-translations:', data.toString());
				});

				process.stderr.on('data', (data) => {
					console.error('drupal-gutenberg-translations:', data.toString());
				});

				process.on('close', (code) => {
					if (code === 0) {
						console.log('drupal-gutenberg-translations:', `Finished drupal-gutenberg-translations`);
					}
					else {
						console.error(`drupal-gutenberg-translations failed with code "${code}"`);
					}
				});

				callback();
			}
		);
	}
}

module.exports = DrupalGutenbergTranslationsPlugin;
