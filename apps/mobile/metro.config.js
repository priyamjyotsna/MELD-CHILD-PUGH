const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the monorepo root so Metro can resolve the local package
config.watchFolders = [workspaceRoot];

// Resolve @livertracker/clinical-scores from the local packages directory
// Point to the compiled dist so Metro doesn't need to transpile it separately
config.resolver.extraNodeModules = {
  '@livertracker/clinical-scores': path.resolve(
    workspaceRoot,
    'packages/clinical-scores'
  ),
};

module.exports = config;
