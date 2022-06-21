import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.ts$': '@swc/jest',
	},
	collectCoverageFrom: ['src/**/*.ts'],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	moduleNameMapper: {
		'^@test/(.*)$': '<rootDir>/test/$1',
	},
};

export default config;
