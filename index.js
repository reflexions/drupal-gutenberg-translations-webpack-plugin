const { rename, stat } = require('fs');
const { resolve } = require('path');
const { spawn } = require('child_process');

class DrupalGutenbergTranslationsPlugin {
	constructor({ bin, path, output }) {
		this.path = path;
		this.output = output;

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
		compiler.hooks.afterEmit.tapAsync('DrupalGutenbergTranslationsPlugin', (compilation, callback) => {
			log('Running drupal-gutenberg-translations...');

			const process = spawn(this.bin, [ this.path ]);

			process.stdout.on('data', (data) => {
				log(data.toString());
			});

			process.stderr.on('data', (data) => {
				displayError(data.toString());
			});

			process.on('close', (code) => {
				log(`Finished with code '${code}'`);

				if (this.output) {
					moveFile(this.path, this.output);
				}
			});

			callback();
		});
	}
}

function moveFile(input, output) {
	const filename = 'drupal-gutenberg-translations.js';
	const translationFile = resolve(input, filename);
	const destination = resolve(output, filename);

	stat(translationFile, (err, stats) => {
		if (err) {
			displayError(err);
			return;
		}

		if (!stats.isFile()) {
			displayError('could not find translation file to copy.');
			return;
		}

		rename(translationFile, destination, (err) => {
			if (err) {
				displayError(err);
			}
			else {
				log(`Successfully moved ${filename}`);
			}
		});
	});
}

function log(msg) {
	console.log('drupal-gutenberg-translations: ', msg);
}

function displayError(err) {
	console.error('drupal-gutenberg-translations: ', err);
}

module.exports = DrupalGutenbergTranslationsPlugin;
