import { promisify } from 'util';
import cpy from 'cpy';
import isObject from 'lodash.isobject';
import chalk from 'chalk';
import mkdirpCb from 'mkdirp';

var name = "rollup-plugin-cpy";

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

var mkdirp = promisify(mkdirpCb);

function successMessage(files, dest) {
  console.log(((chalk.green('Successfully copied')) + " " + files + "  ->  " + dest));
}

function errorMessage(files, dest, err) {
  console.log(((chalk.red('Error copying')) + " " + files + "  ->  " + dest + "\n" + err + "\n"));
}

async function copyFiles(params) {
  var files = params.files;
  var dest = params.dest;
  var options = params.options;
  if (options && !isObject(options)) {
    throw new Error('options param (3rd param after files and dest) should be an object.')
  }

  var ref = options || {};
  var verbose = ref.verbose; if ( verbose === void 0 ) verbose = false;
  var rest = objectWithoutProperties( ref, ["verbose"] );
  var restOptions = rest;

  await mkdirp(dest);

  try {
    await cpy(files, dest, restOptions);
  } catch (err) {
    throw new Error(errorMessage(files, dest, err))
  }

  if (verbose) {
    successMessage(files, dest);
  }
}

function index(options) {
  return {
    name: name,
    writeBundle: async function writeBundle() {
      if (Array.isArray(options)) {
        for (var option of options) {
          await copyFiles(option);
        }
      } else {
        await copyFiles(options);
      }
    },
  }
}

export { index as default };
