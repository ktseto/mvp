/**
 * These rules enforce the Hack Reactor Style Guide
 *
 * Visit this repo for more information:
 *   https://github.com/reactorcore/eslint-config-hackreactor
 */

 module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb-base", 'plugin:react/recommended'],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
  },
};
