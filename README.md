# Ease Task Runner CSS Minifier Plugin

This is a plugin for the [Ease task runner](https://github.com/chisel/ease). It uses the [clean-css](https://www.npmjs.com/package/clean-css) module to minify CSS files.

# Installation

```
npm install ease-task-minify-css --save-dev
```

**easeconfig.js:**
```js
const minifyCss = require('ease-task-minify-css');

module.exports = ease => {

  ease.install('minify-css', minifyCss, {});

};
```

# Configuration

This plugin takes a config object similar to [Clean CSS Options](https://www.npmjs.com/package/clean-css#constructor-options) while ignoring the property `returnPromise` and adding the following properties:
  - `dir`: Path to a directory containing all the SASS files, relative to `easeconfig.js`
  - `outDir`: Path to the output directory where the CSS files should be written, relative to `easeconfig.js`
  - `clearOutDir`: Boolean indicating if the output directory should be emptied first

# Example

**easeconfig.js:**
```js
const minifyCss = require('ease-task-minify-css');

module.exports = ease => {

  ease.install('minify-css', minifyCss, {
    dir: 'css',
    outDir: 'css',
    clearOutDir: false,
    compatibility: 'ie8',
    sourceMap: true
  });

  ease.job('minify-css-files', ['minify-css']);

};
```

**CLI:**
```
ease minify-css-files
```
