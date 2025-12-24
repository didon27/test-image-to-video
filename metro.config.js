const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver for ffmpeg-kit-react-native alias
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ffmpeg-kit-react-native') {
    return context.resolveRequest(context, 'kroog-ffmpeg-kit-react-native', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
