export default {
  default: {
    require: [
      'ts-node/register',
      'web/tests/e2e/steps/**/*.ts'
    ],
    paths: ['web/tests/e2e/**/*.feature'],
    publishQuiet: true,
    format: ['progress'],
    parallel: 0
  }
};