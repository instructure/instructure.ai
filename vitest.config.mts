import baseConfig from '@instructure.ai/shared-configs/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(baseConfig, {
	test: {
			coverage: {
				include: ['scripts/**/*.{ts,tsx,js,cjs,mjs,mts}'],
				exclude: [
					'packages/*/**',
					'apps/*/**',
					'.template/*/**',
					'.vscode/*/**'
				]
			}
		}
});
