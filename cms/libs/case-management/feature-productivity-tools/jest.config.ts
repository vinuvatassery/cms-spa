/* eslint-disable */
export default {
<<<<<<<< HEAD:cms/libs/case-management/feature-financial-vendor/jest.config.ts
  displayName: 'case-management-feature-financial-vendor',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory:
    '../../../coverage/libs/case-management/feature-financial-vendor',
========
  displayName: 'feature-productivity-tools',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory:
    '../../../coverage/libs/case-management/feature-productivity-tools',
>>>>>>>> origin/release/v3.1.0(01-09-2024):cms/libs/case-management/feature-productivity-tools/jest.config.ts
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
