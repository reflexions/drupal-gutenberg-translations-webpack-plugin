const { resolve } = require('path');
const { spawn } = require('child_process');

class DrupalGutenbergTranslationsPlugin {
	bin = null;
	path = null;

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
		compiler.hooks.afterEmit.tapAsync('DrupalGutenbergTranslationsPlugin', () => {
			console.log('Running drupal-gutenberg-translations...');

			const process = spawn(this.bin, [ this.path ]);

			process.stdout.on('data', (data) => {
				console.log('drupal-gutenberg-translations:', data);
			});

			process.stderr.on('data', (data) => {
				console.error('drupal-gutenberg-translations:', data);
			});

			process.on('close', (code) => {
				console.log('drupal-gutenberg-translations:', `Finished with code '${code}'`);
			});
		});
	}
}

module.exports = DrupalGutenbergTranslationsPlugin;
