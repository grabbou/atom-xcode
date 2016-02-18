'use babel';

const path = require('path');
const fs = require('fs');

/**
 * Gets first root folder opened in Atom
 *
 * @todo Support multiple root folders etc.
 */
exports.getRootFolder = () => atom.project.getPaths()[0];

/**
 * Returns true if current project is RN
 */
exports.isRNProject = () => {
  const rootFolder = exports.getRootFolder();
  return fs.existsSync(path.join(rootFolder, 'node_modules', 'react-native'));
};
