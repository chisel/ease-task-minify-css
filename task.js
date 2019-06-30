const CleanCSS = require('clean-css');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const glob = require('glob');

module.exports = (logger, dirname, config) => {

  return () => {

    return new Promise((resolve, reject) => {

      // Validate config
      if ( ! config.dir || ! config.outDir ) return reject(new Error('Minify CSS plugin misconfiguration! dir and outDir must be present.'));

      // Empty outDir if necessary
      if ( config.cleanOutDir ) {

        fs.emptyDirSync(path.join(dirname, config.outDir));

      }

      const minifier = new CleanCSS(_.assign(_.cloneDeep(config), {
        dir: undefined,
        outDir: undefined,
        cleanOutDir: undefined,
        returnPromise: false
      }));

      // Search `config.dir` for `.css` files
      glob('**/*.css', { cwd: path.join(dirname, config.dir) }, (error, files) => {

        if ( error ) return reject(error);

        const promises = [];

        logger(`Minifying ${files.length} files...`);

        for ( const file of files ) {

          promises.push(new Promise((resolve, reject) => {

            // Read file
            fs.readFile(path.join(dirname, config.dir, file), { encoding: 'utf8' }, (error, data) => {

              if ( error ) return reject(error);

              // Minify CSS
              const result = minifier.minify(data);

              // Throw errors
              if ( result.errors.length ) return reject(new Error(`CSS minifier threw the following errors:\n${result.errors.reduce((a, b) => `${a}\n${b}`)}`));

              // Log warnings
              if ( result.warnings.length ) logger(`CSS minifier threw the following warnings:\n${result.warnings.reduce((a, b) => `${a}\n${b}`)}`);

              // Write to file
              fs.writeFile(path.join(dirname, config.outDir, file), result.styles, error => {

                if ( error ) return reject(error);

                // Write sourcemaps
                if ( result.sourceMap && config.sourceMap ) {

                  fs.writeFile(path.join(dirname, config.outDir, file + '.map'), result.sourceMap, error => {

                    if ( error ) return reject(error);
                    resolve();

                  });

                }
                else resolve();

              });

            });

          }));

        }

        Promise.all(promises)
        .then(() => {

          logger(`All ${files.length} files were minified.`);
          resolve();

        })
        .catch(error);

      });

    });

  };

};
