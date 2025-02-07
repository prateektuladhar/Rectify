const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.extraNodeModules = {
  'timers': require.resolve('timers-browserify'),
};

module.exports = defaultConfig;
