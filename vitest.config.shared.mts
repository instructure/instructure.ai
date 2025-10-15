import { defineConfig, defineProject } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
			projects: [
				defineProject({
					test: {
						name: '@instructure.ai/shared-configs',
						include: ['tests/**/*.{test,spec}.{ts,tsx,js,cjs,mjs}'],
					}
				}),
				'apps/*/vitest.config.mts',
				'packages/*/vitest.config.mts',
			],
			coverage: {
				provider: 'istanbul',
      reporter: [
        'text',
				[
					path.resolve(
						process.cwd(),
						'plugins/vitest.plugin.coverageReporter.cjs'
					),
					{ file: path.resolve(__dirname, 'coverage.yml' )}
				],
      ],
			}
		}
});
