const scanner = require('sonarqube-scanner');
const { version } = require('./package.json');

scanner(
  {
    serverUrl: 'http://localhost:9001',
    token: '24a14ec4b700cf7b458876d70e3cb4be3f06406f',
    options: {
      'sonar.projectKey': 'br.blog.studium:studium-backend',
      'sonar.projectName': 'MyStudiumBackend',
      'sonar.projectVersion': version,
      'sonar.projectBaseDir': './',
      'sonar.sources': './src',
      'sonar.tests': './tests',
      'sonar.language': 'ts',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.exclusions': './node_modules/**,strykers.conf.js',
      'sonar.typescript.lcov.reportPaths': './coverage/lcov.info',
    },
  },
  () => process.exit(),
);
