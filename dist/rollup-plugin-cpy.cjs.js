'use strict';

var util = require('util');
var cpy = require('cpy');
var isObject = require('lodash.isobject');
var chalk = require('chalk');
var mkdirpCb = require('mkdirp');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cpy__default = /*#__PURE__*/_interopDefaultLegacy(cpy);
var isObject__default = /*#__PURE__*/_interopDefaultLegacy(isObject);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var mkdirpCb__default = /*#__PURE__*/_interopDefaultLegacy(mkdirpCb);

var name = "rollup-plugin-cpy";

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

var mkdirp = util.promisify(mkdirpCb__default["default"]);

function successMessage(files, dest) {
  console.log(((chalk__default["default"].green('Successfully copied')) + " " + files + "  ->  " + dest));
}

function errorMessage(files, dest, err) {
  console.log(((chalk__default["default"].red('Error copying')) + " " + files + "  ->  " + dest + "\n" + err + "\n"));
}

async function copyFiles(params) {
  var files = params.files;
  var dest = params.dest;
  var options = params.options;
  if (options && !isObject__default["default"](options)) {
    throw new Error('options param (3rd param after files and dest) should be an object.')
  }

  var ref = options || {};
  var verbose = ref.verbose; if ( verbose === void 0 ) verbose = false;
  var rest = objectWithoutProperties( ref, ["verbose"] );
  var restOptions = rest;

  await mkdirp(dest);

  try {
    await cpy__default["default"](files, dest, restOptions);
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

module.exports = index;
