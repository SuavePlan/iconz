"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Iconz = exports.defaultConfig = exports.IconzOutputTypes = exports.IconzTypes = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _sharp = _interopRequireDefault(require("sharp"));

var _crypto = _interopRequireDefault(require("crypto"));

var _pngToIco = _interopRequireDefault(require("png-to-ico"));

var _icoToPng = _interopRequireDefault(require("ico-to-png"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _icns = require("@fiahfy/icns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

_AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; };

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) method = iterable[Symbol.asyncIterator]; if (method == null && Symbol.iterator) method = iterable[Symbol.iterator]; } if (method == null) method = iterable["@@asyncIterator"]; if (method == null) method = iterable["@@iterator"]; if (method == null) throw new TypeError("Object is not async iterable"); return method.call(iterable); }

/** list of valid icon types */
const IconzTypes = ['ico', 'icns', 'png', 'jpeg'];
exports.IconzTypes = IconzTypes;
const IconzOutputTypes = ['png', 'jpeg'];
exports.IconzOutputTypes = IconzOutputTypes;

/**
 * This is the default icon configuration
 */
const defaultConfig = {
  options: {
    input: {
      density: 150
    },
    resize: {
      fit: 'contain',
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 0
      },
      kernel: 'mitchell',
      position: 'centre',
      withoutEnlargement: false,
      fastShrinkOnLoad: true,
      width: 1024,
      height: 1024
    },
    output: {
      formats: {
        png: {
          compressionLevel: 9,
          quality: 100
        },
        jpeg: {
          quality: 100,
          chromaSubsampling: '4:4:4'
        }
      },
      format: 'png'
    }
  },
  icons: {
    icns: {
      type: 'icns',
      name: 'app',
      sizes: [16, 32, 64, 128, 256, 512, 1024],
      folder: '.'
    },
    ico: {
      type: 'ico',
      name: 'app',
      sizes: [16, 24, 32, 48, 64, 128, 256],
      folder: '.'
    },
    favico: {
      type: 'ico',
      name: 'favicon',
      sizes: [16, 24, 32, 48, 64],
      folder: '.'
    },
    faviconPng: {
      type: 'png',
      name: 'favicon',
      sizes: [32],
      folder: '.'
    },
    favicon: {
      type: 'png',
      name: 'favicon-{{dims}}',
      sizes: [32, 57, 72, 96, 120, 128, 144, 152, 195, 228],
      folder: 'icons'
    },
    msTile: {
      type: 'png',
      name: 'mstile-{{dims}}',
      sizes: [70, 144, 150, 270, 310, '310x150'],
      folder: 'icons',
      options: {
        background: {
          r: 0,
          g: 0,
          b: 0,
          alpha: 1
        }
      }
    },
    android: {
      type: 'png',
      name: 'android-chrome-{{dims}}',
      sizes: [36, 48, 72, 96, 144, 192, 256, 384, 512],
      folder: 'icons'
    },
    appleTouch: {
      type: 'png',
      name: 'apple-touch-{{dims}}',
      sizes: [16, 32, 76, 96, 114, 120, 144, 152, 167, 180],
      folder: 'icons'
    }
  }
};
/**
 * Iconz - Icon Generator for the Web
 *
 * See README.md for further information
 *
 */

exports.defaultConfig = defaultConfig;

class Iconz {
  /**
   * Configuration data
   */

  /**
   * these are the variables which can be used when parsing the filename
   */

  /**
   * Iconz Constructor
   *
   * @param {IconzConfigCollection} config - Main configuration object
   */
  constructor(config) {
    _defineProperty(this, "_config", {});

    _defineProperty(this, "_parserValues", {});

    if (typeof config !== 'object') {
      throw new Error('config is missing');
    }

    this._config = this.mergeConfig(this.clone(defaultConfig), config);
    /** if icons have been chosen, overwrite defaults */

    if (typeof config.icons === 'object') {
      this._config.icons = this.clone(config.icons);
    }

    this.validateConfig(this._config);
  }
  /**
   * Deep Object Cloner
   *
   * @param {object} object - object to clone
   * @returns {object} - clone of object
   */


  clone(object) {
    /**  cloning output */
    const cloning = {};
    Object.keys(object).map(prop => {
      if (Array.isArray(object[prop])) {
        cloning[prop] = [].concat(object[prop]);
      } else if (typeof object[prop] === 'object') {
        cloning[prop] = this.clone(object[prop]);
      } else cloning[prop] = object[prop];
    });
    return cloning;
  }
  /**
   * Returns all the variables to be used with filename parser
   *
   * @param {Record<string, any>} extraData - extra data to merge into parser values
   * @param {boolean} freezeCounter - only to be used to get a static snapshot of parser values
   * @returns {Record<string, any>} - Object containing available parser values
   */


  getParserValues(extraData, freezeCounter) {
    // record start date
    if (typeof this._parserValues.start === 'undefined') {
      this._parserValues.start = Iconz.dateToObject();
    }

    return { ...this.clone(this._parserValues),
      ...{
        env: this.clone(process.env),
        counter: typeof this._parserValues.counter === 'number' ? freezeCounter === true ? this._parserValues.counter : ++this._parserValues.counter : freezeCounter === true ? 0 : this._parserValues.counter = 1,
        // get latest date every call
        date: freezeCounter === true ? this._parserValues.start : Iconz.dateToObject()
      },
      ...this.clone(extraData)
    };
  }
  /**
   * Get Configuration
   *
   * @param {boolean} clone - Should the returned object be a clone
   * @returns {IconzConfigCollection} - Icon Configuration object
   */


  getConfig(clone) {
    /**  default to returning cloned config */
    if (clone === false) {
      return this._config;
    }

    return this.clone(this._config);
  }
  /**
   * Convert ARGB to RGBA
   *
   * @param {Buffer} xInOut - Buffer to convert
   */


  argb2rgba(xInOut) {
    for (let i = 0; i < xInOut.length; i += 4) {
      const x0 = xInOut[i];
      xInOut[i] = xInOut[i + 1];
      xInOut[i + 1] = xInOut[i + 2];
      xInOut[i + 2] = xInOut[i + 3];
      xInOut[i + 3] = x0;
    }
  }
  /**
   * Convert RGBA to ARGB
   *
   * @param {Buffer} xInOut - Buffer to convert
   */


  rgba2argb(xInOut) {
    for (let i = 0; i < xInOut.length; i += 4) {
      const x0 = xInOut[i + 3];
      xInOut[i + 3] = xInOut[i + 2];
      xInOut[i + 2] = xInOut[i + 1];
      xInOut[i + 1] = xInOut[i];
      xInOut[i] = x0;
    }
  }
  /**
   * Merge Configurations
   *
   * @param {Record<any, any>} target - Target Object
   * @param {Record<any, any>} sources - Source Object
   * @returns {Record<any, any>} - merged object
   */


  mergeConfig(target, ...sources) {
    const isObject = item => {
      return item && typeof item === 'object' && !Array.isArray(item);
    };

    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          /**  ensure that if the source object is intentionally empty, set the target as empty too. */
          if (!target[key] || Object.keys(source[key]).length === 0) Object.assign(target, {
            [key]: {}
          });
          this.mergeConfig(target[key], source[key]);
        } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
          target[key] = [...new Set([...target[key], ...source[key]])];
        } else {
          Object.assign(target, {
            [key]: source[key]
          });
        }
      }
    }

    return this.mergeConfig(target, ...sources);
  }
  /**
   * Validate configuration
   *
   * @param {IconzConfigCollection} config - main configuration object
   */


  validateConfig(config) {
    if (typeof config !== 'object' || config === null) {
      throw new TypeError('Invalid configuration');
    }
    /**  try to read image file */


    if (typeof config.src !== 'string' || !_fs.default.existsSync(config.src)) {
      throw new Error('Source image not found');
    }
    /**  create base folder if it doesn't exist */


    if (typeof config.folder === 'string') {
      if (!_fs.default.existsSync(config.folder)) {
        try {
          _fs.default.mkdirSync(config.folder, {
            recursive: true
          });
        } catch (_unused) {
          /**  folder wasn't created */
          throw new Error(`Unable to create folder ${config.folder}`);
        }
      }
    } else if (typeof config.folder === 'undefined') {
      /**  set base output folder same as input folder */
      config.folder = this.path().dirname(config.src);
    } else {
      throw new Error('Invalid folder name');
    }

    if (typeof config.tmpFolder !== 'undefined') {
      if (typeof config.tmpFolder !== 'string') {
        throw new Error('Invalid temp folder');
      }

      if (!this.isAbsolutePath(config.tmpFolder) && !this.isRelativePath(config.tmpFolder)) {
        throw new Error('Invalid temp folder name');
      }
    } else {
      config.tmpFolder = _fs.default.mkdtempSync(this.path().join(_os.default.tmpdir(), 'iconz-'));
    }
    /**  if temp folder is selected, ensure it exists. This will be used to store all sized png files */


    if (!_fs.default.existsSync(config.tmpFolder)) {
      try {
        _fs.default.mkdirSync(this.isRelativePath(config.tmpFolder) ? this.path().join(config.folder, config.tmpFolder) : config.tmpFolder, {
          recursive: true
        });
      } catch (_unused2) {}
    }

    if (typeof config.icons !== 'undefined' && typeof config.icons !== 'object') {
      throw new Error('Icon configuration is invalid');
    }

    if (typeof config.icons === 'object' && Object.keys(config.icons).length === 0) {
      throw new Error('Icon configuration not set');
    }
  }
  /**
   * Check if path is absolute
   *
   * @param {string} str - path to check
   * @returns {boolean} - if path is absolute
   */


  isAbsolutePath(str) {
    return this.path().isAbsolute(str);
  }
  /**
   * Check if path is relative
   *
   * @param {string} str - path to check
   * @returns {boolean} - if path is relative
   */


  isRelativePath(str) {
    return !this.isAbsolutePath(str);
  }
  /**
   * returns appropriate path based upon platform
   *
   * @returns {path.Platform} - platform
   */


  path() {
    return Iconz.path();
  }
  /**
   * returns appropriate path based upon platform
   *
   * @returns {path.PlatformPath} - platform
   */


  static path() {
    return _path.default[process.platform === 'win32' ? 'win32' : 'posix'];
  }
  /**
   * Add Icon configuration
   *
   * @param {string} key - name of icon configuration
   * @param {IconzConfig} config - Iconz Config object
   */


  addIconConfig(key, config) {
    var _this$_config, _this$_config$icons;

    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Invalid config name');
    }

    if (typeof config !== 'object' || Object.keys(config).length === 0) {
      throw new TypeError('Config is invalid');
    }

    (_this$_config$icons = (_this$_config = this._config).icons) !== null && _this$_config$icons !== void 0 ? _this$_config$icons : _this$_config.icons = {};
    this._config.icons[key] = config;
  }
  /**
   * Add action for source image
   *
   * @see https://sharp.pixelplumbing.com/api-operation for all operations
   * @param {IconzImageActionName} cmd - The command to be run
   * @param {any[]} args - optional arguments
   * @returns {this} - Iconz class
   */


  addAction(cmd, ...args) {
    var _this$_config2, _this$_config2$action;

    if (typeof cmd !== 'string' || cmd.length === 0) {
      throw new TypeError('Invalid action name');
    }
    /** add action to list */


    (_this$_config2$action = (_this$_config2 = this._config).actions) !== null && _this$_config2$action !== void 0 ? _this$_config2$action : _this$_config2.actions = [];

    this._config.actions.push({
      cmd,
      args: args.length === 1 && Array.isArray(args[0]) ? [...args[0]] : args
    });

    return this;
  }
  /**
   * Convert hex string into colour object
   *
   * @param {string} hex - input hex string
   * @returns {IconzColour} - Colour object
   */


  bgHexToObj(hex) {
    if (!/^#?([0-9A-F]{6}|[0-9A-F]{8})/i.test(hex)) {
      throw new Error('Invalid hex, should be #AAFF00 (rgb) or #AAFF0022 (rgba) format');
    }
    /**  remove hash from start of string */


    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }

    const round = (x, n = 2) => {
      const precision = Math.pow(10, n);
      return Math.round((x + Number.EPSILON) * precision) / precision;
    };
    /**  convert to object */


    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
      alpha: hex.length === 6 ? 1 : parseInt(hex.substr(6, 2), 16) === 0 ? 0 : round(parseInt(hex.substr(6, 2), 16) / 255)
    };
  }
  /**
   * Convert colour object into hex string
   *
   * @param {IconzColour} obj - Colour object to convert
   * @returns {string} - Hex string in the format #RRGGBBAA
   */


  bgObjToHex(obj) {
    if (typeof obj !== 'object' || typeof obj.r !== 'number' || typeof obj.g !== 'number' || typeof obj.b !== 'number' || typeof obj.alpha !== 'number') {
      throw new Error('Invalid background object');
    }

    return ('#' + obj.r.toString(16).padStart(2, '0') + obj.g.toString(16).padStart(2, '0') + obj.b.toString(16).padStart(2, '0') + Math.floor(obj.alpha * 255).toString(16).padStart(2, '0')).toUpperCase();
  }
  /**
   * Generate width and height string from size
   *
   * @param {string|number} size - input size as single or two dimensions
   * @returns {number[]} - returns an array containing with and height
   */


  generateWidthAndHeightFromSize(size) {
    /**  convert single dimension into width x height */
    if (Number.isInteger(size) || typeof size === 'string' && /^[0-9]+$/.test(size)) {
      size = String(`${size}x${size}`);
    }
    /**  if the value is multidimensional, add to sizes */


    if (typeof size === 'string' && /^[0-9]+x[0-9]+$/.test(size)) {
      return size.split('x').map(v => Number(v));
    }

    throw new Error(`Invalid size ${size}`);
  }
  /**
   * Prepare target path from options
   *
   * @param {Record<string, any>} options - target path options
   * @returns {string} - target filepath
   */


  generateTargetFilepathFromOptions(options) {
    const tempOptions = this.clone(options || {});
    const width = tempOptions.width;
    const height = tempOptions.height;
    delete tempOptions.width;
    delete tempOptions.height;
    delete tempOptions.hooks;
    delete tempOptions.name;
    /** change hashes to ensure changed images are saved in separate hashed folders */

    if (typeof options.hooks === 'object') {
      if (options.hooks.postResize) {
        tempOptions.postResize = options.name;
      }

      if (options.hooks.preResize) {
        tempOptions.preResize = options.name;
      }
    }

    const dirname = JSON.stringify(tempOptions);
    /**  hash is created based upon the options supplied (excluding width and height) */

    return this.path().join(this.createHash(dirname), `${width}x${height}`);
  }
  /**
   * create a hash to be used as folder name based upon data
   *
   * @param {string} data - the data string to be hashed
   * @param {number} len - length of hash (in bytes)
   * @returns {string} - output hash
   */


  createHash(data, len = 4) {
    return _crypto.default.createHash('shake256', {
      outputLength: len
    }).update(data).digest('hex');
  }
  /**
   * Get options for image processor
   *
   * @param {keyof IconzOptions} name - key of the IconzOptions object
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzInputOptions|IconzResizeOptions|IconzOutputOptions|undefined>} - returns IconzOptions object
   */


  getOptions(name, clone) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          /**  get options or callback */
          const options = this._config.options && this._config.options[name] ? this._config.options[name] : undefined;
          /**  get options or callback results */

          const result = typeof options === 'function' ? await options : options;
          resolve(clone === false ? result : result ? this.clone(result) : undefined);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * Get Input options for sharp
   *
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzInputOptions|undefined>} - IconzInputOptions object
   */


  getInputOptions(clone) {
    return this.getOptions('input', clone);
  }
  /**
   * Get Output options for sharp
   *
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzOutputOptions|undefined>} - IconzOutputOptions object
   */


  getOutputOptions(clone) {
    return this.getOptions('output', clone);
  }
  /**
   * Get Resize options for sharp
   *
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzResizeOptions|undefined>} - IconzResizeOptions object
   */


  getResizeOptions(clone) {
    return this.getOptions('resize', clone);
  }
  /**
   * prepare absolute path
   *
   * @param {string} folder - input path
   * @returns {string} - resulting absolute path
   */


  absoluteFolderPath(folder) {
    const parts = [];

    if (this.isRelativePath(folder)) {
      if (this.isRelativePath(this._config.folder)) {
        parts.push(process.cwd());
      }

      parts.push(this._config.folder);
    }

    parts.push(folder);
    return this.path().resolve(this.path().join(...parts));
  }
  /**
   * Convert date to a date object to be used with parser
   *
   * @param {Date} date - date to convert to object
   * @returns {Record<string,any>} - date object
   */


  static dateToObject(date) {
    var _date;

    (_date = date) !== null && _date !== void 0 ? _date : date = new Date();
    const dateParts = {
      year: String(date.getFullYear()),
      month: ('0' + (date.getMonth() + 1)).slice(-2),
      day: ('0' + date.getDate()).slice(-2),
      hour: ('0' + date.getHours()).slice(-2),
      minute: ('0' + date.getMinutes()).slice(-2),
      second: ('0' + date.getSeconds()).slice(-2),
      millisecond: ('00' + date.getMilliseconds()).slice(-3),
      epoch: String(date.getTime()),
      offset: String(date.getTimezoneOffset()),
      dow: String(date.getDay() + 1)
    };
    dateParts.date = `${dateParts.year}${dateParts.month}${dateParts.day}`;
    dateParts.time = `${dateParts.hour}${dateParts.minute}${dateParts.second}`;
    dateParts.mtime = `${dateParts.time}${dateParts.millisecond}`;
    dateParts.datemtime = `${dateParts.date}${dateParts.mtime}`;
    dateParts.datetime = `${dateParts.date}${dateParts.time}`;
    return dateParts;
  }
  /**
   * Prepare all images ready for icons
   *
   * @returns {Promise<IconzReport>} - Iconz Report
   */


  async prepareAllSizedImages() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          /**  read source image */
          let img = (0, _sharp.default)(
          /** if it's an icon, use icoToPng to convert into a buffer before passing to sharp */
          this.path().extname(this._config.src) === '.ico' ? await (0, _icoToPng.default)(_fs.default.readFileSync(this._config.src), 1024) : this._config.src, await this.getInputOptions());
          /** prepare parser variables from original image, along with date/time */

          this._parserValues = {
            meta: await img.metadata(),
            stats: await img.stats()
          };
          /** loop through all actions before cloning */

          if (Array.isArray(this._config.actions)) {
            for (const key in this._config.actions) {
              const action = this._config.actions[key]; // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore

              img = img[action.cmd](...action.args);
            }
          }
          /**  create temporary folder if needed */


          const tempFolder = this.absoluteFolderPath(this._config.tmpFolder || _fs.default.mkdtempSync(this.path().join(_os.default.tmpdir(), 'iconz-')));
          /**  instantiate report */

          const imageReport = {
            tmp: {},
            ico: {},
            icns: {},
            png: {},
            jpeg: {},
            failed: {}
          };
          const outputOptions = await this.getOutputOptions();
          /** get file output type */

          const outputFormat = outputOptions && outputOptions.format || undefined;

          if (IconzOutputTypes.indexOf(outputFormat) === -1) {
            throw new TypeError('Output format is invalid');
          }

          const chosenOptions = outputOptions.formats[outputFormat];
          /**  merge all sizes from configuration */

          for (const [name, config] of Object.entries(this._config.icons)) {
            /**  skip if the config has been disabled */
            if (config.enabled === false) {
              continue;
            }
            /** if there are multiple sizes, and it's a static image, it must have a dynamic field */


            if (config.sizes.length > 1 && !['icns', 'ico'].includes(config.type) &&
            /** check if one of the key variables are being used */
            !['dims', 'width', 'height', 'size', 'datetime', 'datemtime', 'mtime', 'counter', 'millisecond'].some(v => config.name.includes(`{{${v}}}`))) {
              throw new Error(`Icons config '${name}' has more than one size. Try changing it to ${name}-{{dims}} or ${name}-{{counter}}.`);
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;

            var _iteratorError;

            try {
              for (var _iterator = _asyncIterator(this.configToOptions(config, tempFolder, {
                name
              })), _step, _value; _step = await _iterator.next(), _iteratorNormalCompletion = _step.done, _value = await _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
                const response = _value;

                /**  check for invalid icon dimensions */
                if (['ico', 'icns'].includes(config.type) && response.options.width !== response.options.height) {
                  throw new Error(`Invalid config for ${name}, icon dimensions must have a 1:1 ratio`);
                }
                /**  if image hasn't been created before, generate it. */


                if (typeof imageReport.tmp[response.target] === 'undefined') {
                  /**  create folder first */
                  const dirname = this.path().dirname(response.target);

                  if (!_fs.default.existsSync(dirname)) {
                    _fs.default.mkdirSync(dirname);
                  }
                  /**  clone the image */


                  let clone = img.clone();
                  /**  pre-resize hook */

                  if (config.hooks && config.hooks.preResize) {
                    clone = await config.hooks.preResize(this, clone, response.options, response.target, imageReport);
                  }
                  /**  resize and set as chosen format */


                  clone.resize(response.options)[outputFormat](chosenOptions);
                  /**  post-resize hook */

                  if (config.hooks && config.hooks.postResize) {
                    clone = await config.hooks.postResize(this, clone, response.options, response.target, imageReport);
                  }
                  /**  convert to buffer, then output */


                  await clone.toBuffer().then(data => {
                    _fs.default.writeFileSync(response.target, data);
                    /**  store image path with settings to report */


                    imageReport.tmp[response.target] = response.options;
                    return response.target;
                  }).catch(err => {
                    /**  write error to report */
                    imageReport.failed[response.target] = err.message || 'unknown error';
                  });
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  await _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
          /**  return image report with settings applied */


          resolve(imageReport);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * convert configuration into options and target folder name for temp folder
   *
   * @param {IconzConfig} config - Configuration Object
   * @param {string} basePath - base path
   * @param {Record<string, any>} additionalArgs - additional arguments
   * @yields {{target: string, options: IconzResizeOptions}} - object of options
   */


  configToOptions(config, basePath, additionalArgs) {
    var _this = this;

    return _wrapAsyncGenerator(function* () {
      /**  ensure specific settings are set by default */

      /**  prepare default settings for image resize */
      const defaultOptions = yield _awaitAsyncGenerator(_this.getResizeOptions());
      const outputOptions = yield _awaitAsyncGenerator(_this.getOutputOptions());
      /**  loop through images and prepare png files */

      for (const size of config.sizes) {
        /**  get dimensions */
        const [width, height] = _this.generateWidthAndHeightFromSize(size);
        /**  generate settings for image resize */


        const options = { ...defaultOptions,
          ...{
            width: Number(width),
            height: Number(height)
          }
        };
        /**  create unique image name based upon settings */

        const imagePath = _this.generateTargetFilepathFromOptions({ ...options,
          ...(additionalArgs !== null && additionalArgs !== void 0 ? additionalArgs : {}),
          ...{
            /** if hooks exist, allow hashes to change to reflect change. */
            hooks: config.hooks
          }
        });
        /**  target image name */


        const target = `${basePath ? _this.path().join(basePath, imagePath) : imagePath}.${outputOptions.format === 'jpeg' ? 'jpg' : outputOptions.format}`;
        yield {
          target,
          options
        };
      }
    })();
  }
  /**
   * This is used to find relative file paths
   *
   * @param {string} substr - substring to search for
   * @param {string[]} arr - this is an array of strings to search in
   * @returns {string[]} - a list of strings that have substring in them
   */


  searchArrayForSubstring(substr, arr) {
    const results = [];

    for (const item of arr) {
      if (item.lastIndexOf(substr) === item.length - substr.length) {
        results.push(item);
      }
    }

    return results;
  }
  /**
   * returns nested value by path
   *
   * @param {Record<any, any>} nestedObject - object to be searched
   * @param {string} pathString - path to search
   * @returns {*} - returns any type
   */


  static getNestedByPath(nestedObject, pathString) {
    const pathArray = this.isValidPath(pathString) ? pathString.split('.') : [];
    return pathArray.reduce((object, key) => object && object[key] !== 'undefined' ? object[key] : undefined, nestedObject);
  }
  /**
   * generate a blank report
   *
   * @returns {IconzReport} - empty report
   */


  static newReport() {
    return {
      tmp: {},
      ico: {},
      icns: {},
      png: {},
      jpeg: {},
      failed: {}
    };
  }
  /**
   * to check if dot based object path is valid
   *
   * @param {string} path - dot based object path
   * @returns {boolean} - if path is valid
   */


  static isValidPath(path) {
    return /([A-Z_a-z]\w*)(\.[A-Z_a-z]\w*)*/.test(path);
  }
  /**
   * parse template with {{variable}} handlebars
   *
   * @param {string} template - template to parse
   * @param {Record<string, any>} values - object containing key value pairs
   * @param {Record<string, any>} removeUndefined - to remove handlebars if not found
   * @returns {string} - parsed string
   */


  parseTemplate(template, values, removeUndefined = false) {
    /** copy template to output */
    let output = template;
    /** Regex for handlebars */

    const r = new RegExp('{{([^}]*)}}', 'gm');

    for (let a; (a = r.exec(template)) !== null;) {
      /** retrieve nested value based upon content of handlebars */
      const val = Iconz.getNestedByPath(values, a[1]);
      /** if no value has been found, then remove if chosen */

      if (val === undefined && removeUndefined) {
        output = output.replace(a[0], '');
      } else {
        /** if the item isn't a number, string or boolean, either leave the handlebars, or leave blank */
        output = output.replace(String(a[0]), ['bigint', 'number', 'string', 'boolean'].includes(typeof val) ? String(val) : removeUndefined ? '' : String(a[0]));
      }
    }

    return output;
  }
  /**
   * returns the largest size as an object. To be used when parsing output filename
   *
   * @param {(string|number)[]} sizes - Array of sizes
   * @returns {{ size: string, width: string, height: string, dims: string }} - object containing the dimensions
   */


  getLargestSize(sizes) {
    let px = 0;
    let dims;

    if (typeof sizes === 'undefined') {
      throw new Error('sizes not defined');
    }

    if (!Array.isArray(sizes)) {
      throw new Error('sizes must be an array');
    }

    if (sizes.length === 0) {
      throw new Error('sizes is empty');
    }
    /**  loop through sizes and prepare dimensional output */


    for (const size of sizes) {
      const tmp = typeof size === 'number' || typeof size === 'string' && size.indexOf('x') === -1 ? [String(size), String(size)] : size.split('x');
      const width = Number(tmp[0]);
      const height = Number(tmp[1]);

      if (width * height > px) {
        px = width * height;
        dims = {
          size: `${size}`,
          width: `${width}`,
          height: `${height}`,
          dims: `${width}x${height}`
        };
      }
    }

    if (typeof dims === 'undefined') {
      throw new Error('no size found');
    }

    return dims;
  }
  /**
   * Pulls the appropriate files from the report
   *
   * @param {IconzConfig} config - Iconz Configuration
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<{outputDir: string, chosenFiles: string[]}>} - Promise with output directory and chosen files
   */


  async getChosenFilesForIcon(config, report) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (typeof config !== 'object' || typeof report !== 'object') {
            throw new Error('parameters are missing');
          }
          /**  output directory */


          let outputDir;

          if (config.folder) {
            outputDir = this.isRelativePath(config.folder) ? this.path().join(this._config.folder, config.folder) : config.folder;
          } else {
            outputDir = this.absoluteFolderPath(this._config.folder);
          }
          /**  get all successfully generated images */


          const availableFiles = Object.keys(report.tmp);
          let chosenFiles = [];
          /**  loop through each configuration (size) and get all the relevant images */

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;

          var _iteratorError2;

          try {
            for (var _iterator2 = _asyncIterator(this.configToOptions(config, outputDir)), _step2, _value2; _step2 = await _iterator2.next(), _iteratorNormalCompletion2 = _step2.done, _value2 = await _step2.value, !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
              const response = _value2;
              const {
                target
              } = response;
              /**  get last two segments of path ( hash + filename ) */

              const [hash, filename] = target.split(this.path().sep).slice(-2);
              const file = this.path().join(hash, filename);
              /**  get all relevant files to merge into ico file */

              chosenFiles = [...chosenFiles, ...this.searchArrayForSubstring(file, availableFiles)];
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                await _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          resolve({
            outputDir,
            chosenFiles
          });
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * Generate ico files
   *
   * @param {IconzConfig} config - Iconz Configuration
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<string>} - Promise with new filename
   */


  async icoGenerator(config, report) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const {
            outputDir,
            chosenFiles
          } = await this.getChosenFilesForIcon(config, report);
          /**  if images are found, prepare ico file */

          if (chosenFiles.length) {
            /** get parser variables for name parser */
            const parserValues = this.getParserValues({ ...this.getLargestSize(config.sizes),
              config
            });
            /** parse filename */

            const name = this.parseTemplate(config.name, parserValues);
            /**  create new filename */

            const newFilename = this.path().join(outputDir, `${name}.ico`);
            /** convert png to ico */

            return resolve((0, _pngToIco.default)(chosenFiles).then(buf => {
              _fs.default.mkdirSync(this.path().dirname(newFilename), {
                recursive: true
              });

              _fs.default.writeFileSync(newFilename, buf);

              return newFilename;
            }));
          }

          throw new Error('Unable to create ico');
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * Icns Generator (MacOS)
   *
   * @param {IconzConfig} config - Iconz Configuration
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<string>} - Promise with new filename
   */


  async icnsGenerator(config, report) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const {
            outputDir,
            chosenFiles
          } = await this.getChosenFilesForIcon(config, report);
          /**  if images are found, prepare ico file */

          if (chosenFiles.length) {
            const conversionMap = {
              ic07: '128x128',
              ic08: '256x256',
              ic09: '512x512',
              ic10: '1024x1024',
              ic11: '32x32',
              ic12: '64x64',
              ic13: '256x256',
              ic14: '512x512'
            };
            const icns = new _icns.Icns();
            let buf, image;

            for (const [osType, size] of Object.entries(conversionMap)) {
              for (const file of chosenFiles) {
                if (this.path().basename(file, '.png') === size) {
                  buf = _fs.default.readFileSync(file);
                  image = _icns.IcnsImage.fromPNG(buf, osType);
                  icns.append(image);
                }
              }
            }
            /** get parser variables for name parser */


            const parserValues = this.getParserValues({ ...this.getLargestSize(config.sizes),
              config
            });
            /** parse filename */

            const name = this.parseTemplate(config.name, parserValues);
            /**  create new filename */

            const newFilename = this.path().join(outputDir, `${name}.icns`);

            _fs.default.mkdirSync(this.path().dirname(newFilename), {
              recursive: true
            });

            _fs.default.writeFileSync(newFilename, icns.data);

            return resolve(newFilename);
          }

          throw new Error('Unable to create icns');
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * PNG Generator
   *
   * @param {IconzConfig} config - Iconz Configuration
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<string[]>} - Promise with new filenames
   */


  async pngGenerator(config, report) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const outputFiles = [];
          const {
            outputDir,
            chosenFiles
          } = await this.getChosenFilesForIcon(config, report);

          for (const file of chosenFiles) {
            /**  original file consists of dimensions */
            const filename = this.path().basename(file, '.png');
            const dimensions = filename.split('x');
            /**  returns dimensions object for parser */

            const parserValues = this.getParserValues({ ...this.getLargestSize([dimensions[0] === dimensions[1] ? dimensions[0] : filename]),
              config
            });
            const name = this.parseTemplate(config.name, parserValues);
            /**  create new filename */

            const newFilename = this.path().join(outputDir, `${name}.png`);
            /**  make directory for icon */

            _fs.default.mkdirSync(this.path().dirname(newFilename), {
              recursive: true
            });
            /**  copy icon from temporary images */


            _fs.default.copyFileSync(file, newFilename);

            outputFiles.push(newFilename);
          }

          resolve(outputFiles);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * JPEG Generator
   *
   * @param {IconzConfig} config - Iconz Configuration
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<string[]>} - Promise with new filenames
   */


  async jpegGenerator(config, report) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const outputFiles = [];
          const {
            outputDir,
            chosenFiles
          } = await this.getChosenFilesForIcon(config, report);

          for (const file of chosenFiles) {
            /**  original file consists of dimensions */
            const filename = this.path().basename(file, '.png');
            const dimensions = filename.split('x');
            /**  returns dimensions object for parser */

            const parserValues = this.getParserValues({ ...this.getLargestSize([dimensions[0] === dimensions[1] ? dimensions[0] : filename]),
              config
            });
            /** parse filename */

            const name = this.parseTemplate(config.name, parserValues);
            /**  create new filename */

            const newFilename = this.path().join(outputDir, `${name}.jpg`);
            /**  make directory for icon */

            _fs.default.mkdirSync(this.path().dirname(newFilename), {
              recursive: true
            });
            /** generate jpeg image */


            await (0, _sharp.default)(file).toFormat('jpeg', (await this.getOutputOptions()).formats.jpeg).toFile(newFilename);
            /** add filename to output files */

            outputFiles.push(newFilename);
          }

          resolve(outputFiles);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * Generate all icons based upon report results
   *
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<IconzReport>} - Iconz Report
   */


  async generateIcons(report) {
    return new Promise((resolve, reject) => {
      (async () => {
        /**  reference to icons configurations */
        const icons = this._config.icons;

        try {
          /**  loop through each icon config */
          for (const key in icons) {
            /**  if not enabled, skip */
            if (icons[key].enabled === false) {
              continue;
            }

            switch (icons[key].type) {
              case 'jpeg':
                report.jpeg[key] = await this.jpegGenerator(icons[key], report);
                break;

              case 'png':
                report.png[key] = await this.pngGenerator(icons[key], report);
                break;

              case 'ico':
                report.ico[key] = await this.icoGenerator(icons[key], report);
                break;

              case 'icns':
                report.icns[key] = await this.icnsGenerator(icons[key], report);
                break;
            }
          }

          resolve(report);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  /**
   * Remove temporary folders which were generated to separate same sized images but different config options
   *
   * @param {IconzReport} report - Iconz Report
   * @returns {Promise<IconzReport>} - Iconz Report
   */


  async removeTemporaryFolders(report) {
    return new Promise(resolve => {
      (async () => {
        const directories = [];

        for (const file in report.tmp) {
          try {
            const fileDir = this.path().dirname(file);
            const dir = this.path().dirname(fileDir);
            let newFile = this.path().join(dir, this.path().basename(file));

            try {
              /** if there is a duplicate named file, just prefix with previous hash */
              if (_fs.default.existsSync(newFile)) {
                newFile = this.path().join(dir, this.path().basename(fileDir) + '_' + this.path().basename(file));
              }

              _fs.default.renameSync(file, newFile);

              delete report.tmp[file];
              report.tmp[newFile] = 'complete';
            } catch (_unused3) {}

            directories.push(fileDir);
          } catch (_unused4) {}
        }
        /**  loop through chosen directories */


        for (const directory of directories) {
          try {
            _rimraf.default.sync(directory);
          } catch (_unused5) {}
        }

        resolve(report);
      })();
    });
  }
  /**
   * Generate all icons
   *
   * @returns {Promise<IconzReport>} - returns promise with report
   */


  async run() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const report = await this.prepareAllSizedImages();
          await this.generateIcons(report);
          await this.removeTemporaryFolders(report);
          resolve(report);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

}

exports.Iconz = Iconz;
var _default = Iconz;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJJY29uelR5cGVzIiwiSWNvbnpPdXRwdXRUeXBlcyIsImRlZmF1bHRDb25maWciLCJvcHRpb25zIiwiaW5wdXQiLCJkZW5zaXR5IiwicmVzaXplIiwiZml0IiwiYmFja2dyb3VuZCIsInIiLCJnIiwiYiIsImFscGhhIiwia2VybmVsIiwicG9zaXRpb24iLCJ3aXRob3V0RW5sYXJnZW1lbnQiLCJmYXN0U2hyaW5rT25Mb2FkIiwid2lkdGgiLCJoZWlnaHQiLCJvdXRwdXQiLCJmb3JtYXRzIiwicG5nIiwiY29tcHJlc3Npb25MZXZlbCIsInF1YWxpdHkiLCJqcGVnIiwiY2hyb21hU3Vic2FtcGxpbmciLCJmb3JtYXQiLCJpY29ucyIsImljbnMiLCJ0eXBlIiwibmFtZSIsInNpemVzIiwiZm9sZGVyIiwiaWNvIiwiZmF2aWNvIiwiZmF2aWNvblBuZyIsImZhdmljb24iLCJtc1RpbGUiLCJhbmRyb2lkIiwiYXBwbGVUb3VjaCIsIkljb256IiwiY29uc3RydWN0b3IiLCJjb25maWciLCJFcnJvciIsIl9jb25maWciLCJtZXJnZUNvbmZpZyIsImNsb25lIiwidmFsaWRhdGVDb25maWciLCJvYmplY3QiLCJjbG9uaW5nIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsInByb3AiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJnZXRQYXJzZXJWYWx1ZXMiLCJleHRyYURhdGEiLCJmcmVlemVDb3VudGVyIiwiX3BhcnNlclZhbHVlcyIsInN0YXJ0IiwiZGF0ZVRvT2JqZWN0IiwiZW52IiwicHJvY2VzcyIsImNvdW50ZXIiLCJkYXRlIiwiZ2V0Q29uZmlnIiwiYXJnYjJyZ2JhIiwieEluT3V0IiwiaSIsImxlbmd0aCIsIngwIiwicmdiYTJhcmdiIiwidGFyZ2V0Iiwic291cmNlcyIsImlzT2JqZWN0IiwiaXRlbSIsInNvdXJjZSIsInNoaWZ0Iiwia2V5IiwiYXNzaWduIiwiU2V0IiwiVHlwZUVycm9yIiwic3JjIiwiZnMiLCJleGlzdHNTeW5jIiwibWtkaXJTeW5jIiwicmVjdXJzaXZlIiwicGF0aCIsImRpcm5hbWUiLCJ0bXBGb2xkZXIiLCJpc0Fic29sdXRlUGF0aCIsImlzUmVsYXRpdmVQYXRoIiwibWtkdGVtcFN5bmMiLCJqb2luIiwib3MiLCJ0bXBkaXIiLCJzdHIiLCJpc0Fic29sdXRlIiwicGxhdGZvcm0iLCJhZGRJY29uQ29uZmlnIiwiYWRkQWN0aW9uIiwiY21kIiwiYXJncyIsImFjdGlvbnMiLCJwdXNoIiwiYmdIZXhUb09iaiIsImhleCIsInRlc3QiLCJpbmRleE9mIiwic2xpY2UiLCJyb3VuZCIsIngiLCJuIiwicHJlY2lzaW9uIiwiTWF0aCIsInBvdyIsIk51bWJlciIsIkVQU0lMT04iLCJwYXJzZUludCIsInN1YnN0ciIsImJnT2JqVG9IZXgiLCJvYmoiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwiZmxvb3IiLCJ0b1VwcGVyQ2FzZSIsImdlbmVyYXRlV2lkdGhBbmRIZWlnaHRGcm9tU2l6ZSIsInNpemUiLCJpc0ludGVnZXIiLCJTdHJpbmciLCJzcGxpdCIsInYiLCJnZW5lcmF0ZVRhcmdldEZpbGVwYXRoRnJvbU9wdGlvbnMiLCJ0ZW1wT3B0aW9ucyIsImhvb2tzIiwicG9zdFJlc2l6ZSIsInByZVJlc2l6ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjcmVhdGVIYXNoIiwiZGF0YSIsImxlbiIsImNyeXB0byIsIm91dHB1dExlbmd0aCIsInVwZGF0ZSIsImRpZ2VzdCIsImdldE9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInVuZGVmaW5lZCIsInJlc3VsdCIsImVycm9yIiwiZ2V0SW5wdXRPcHRpb25zIiwiZ2V0T3V0cHV0T3B0aW9ucyIsImdldFJlc2l6ZU9wdGlvbnMiLCJhYnNvbHV0ZUZvbGRlclBhdGgiLCJwYXJ0cyIsImN3ZCIsIkRhdGUiLCJkYXRlUGFydHMiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF5IiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbnV0ZSIsImdldE1pbnV0ZXMiLCJzZWNvbmQiLCJnZXRTZWNvbmRzIiwibWlsbGlzZWNvbmQiLCJnZXRNaWxsaXNlY29uZHMiLCJlcG9jaCIsImdldFRpbWUiLCJvZmZzZXQiLCJnZXRUaW1lem9uZU9mZnNldCIsImRvdyIsImdldERheSIsInRpbWUiLCJtdGltZSIsImRhdGVtdGltZSIsImRhdGV0aW1lIiwicHJlcGFyZUFsbFNpemVkSW1hZ2VzIiwiaW1nIiwiZXh0bmFtZSIsInJlYWRGaWxlU3luYyIsIm1ldGEiLCJtZXRhZGF0YSIsInN0YXRzIiwiYWN0aW9uIiwidGVtcEZvbGRlciIsImltYWdlUmVwb3J0IiwidG1wIiwiZmFpbGVkIiwib3V0cHV0T3B0aW9ucyIsIm91dHB1dEZvcm1hdCIsImNob3Nlbk9wdGlvbnMiLCJlbnRyaWVzIiwiZW5hYmxlZCIsImluY2x1ZGVzIiwic29tZSIsImNvbmZpZ1RvT3B0aW9ucyIsInJlc3BvbnNlIiwidG9CdWZmZXIiLCJ0aGVuIiwid3JpdGVGaWxlU3luYyIsImNhdGNoIiwiZXJyIiwibWVzc2FnZSIsImJhc2VQYXRoIiwiYWRkaXRpb25hbEFyZ3MiLCJkZWZhdWx0T3B0aW9ucyIsImltYWdlUGF0aCIsInNlYXJjaEFycmF5Rm9yU3Vic3RyaW5nIiwiYXJyIiwicmVzdWx0cyIsImxhc3RJbmRleE9mIiwiZ2V0TmVzdGVkQnlQYXRoIiwibmVzdGVkT2JqZWN0IiwicGF0aFN0cmluZyIsInBhdGhBcnJheSIsImlzVmFsaWRQYXRoIiwicmVkdWNlIiwibmV3UmVwb3J0IiwicGFyc2VUZW1wbGF0ZSIsInRlbXBsYXRlIiwidmFsdWVzIiwicmVtb3ZlVW5kZWZpbmVkIiwiUmVnRXhwIiwiYSIsImV4ZWMiLCJ2YWwiLCJyZXBsYWNlIiwiZ2V0TGFyZ2VzdFNpemUiLCJweCIsImRpbXMiLCJnZXRDaG9zZW5GaWxlc0Zvckljb24iLCJyZXBvcnQiLCJvdXRwdXREaXIiLCJhdmFpbGFibGVGaWxlcyIsImNob3NlbkZpbGVzIiwiaGFzaCIsImZpbGVuYW1lIiwic2VwIiwiZmlsZSIsImljb0dlbmVyYXRvciIsInBhcnNlclZhbHVlcyIsIm5ld0ZpbGVuYW1lIiwiYnVmIiwiaWNuc0dlbmVyYXRvciIsImNvbnZlcnNpb25NYXAiLCJpYzA3IiwiaWMwOCIsImljMDkiLCJpYzEwIiwiaWMxMSIsImljMTIiLCJpYzEzIiwiaWMxNCIsIkljbnMiLCJpbWFnZSIsIm9zVHlwZSIsImJhc2VuYW1lIiwiSWNuc0ltYWdlIiwiZnJvbVBORyIsImFwcGVuZCIsInBuZ0dlbmVyYXRvciIsIm91dHB1dEZpbGVzIiwiZGltZW5zaW9ucyIsImNvcHlGaWxlU3luYyIsImpwZWdHZW5lcmF0b3IiLCJ0b0Zvcm1hdCIsInRvRmlsZSIsImdlbmVyYXRlSWNvbnMiLCJyZW1vdmVUZW1wb3JhcnlGb2xkZXJzIiwiZGlyZWN0b3JpZXMiLCJmaWxlRGlyIiwiZGlyIiwibmV3RmlsZSIsInJlbmFtZVN5bmMiLCJkaXJlY3RvcnkiLCJyaW1yYWYiLCJzeW5jIiwicnVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWFBO0FBQ08sTUFBTUEsVUFBVSxHQUFHLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFBdUIsTUFBdkIsQ0FBbkI7O0FBcUNBLE1BQU1DLGdCQUFnQixHQUFHLENBQUMsS0FBRCxFQUFRLE1BQVIsQ0FBekI7OztBQTZQUDtBQUNBO0FBQ0E7QUFDTyxNQUFNQyxhQUFvQyxHQUFHO0FBQ2xEQyxFQUFBQSxPQUFPLEVBQUU7QUFDUEMsSUFBQUEsS0FBSyxFQUFxQjtBQUN4QkMsTUFBQUEsT0FBTyxFQUFFO0FBRGUsS0FEbkI7QUFJUEMsSUFBQUEsTUFBTSxFQUFzQjtBQUMxQkMsTUFBQUEsR0FBRyxFQUFFLFNBRHFCO0FBRTFCQyxNQUFBQSxVQUFVLEVBQUU7QUFBRUMsUUFBQUEsQ0FBQyxFQUFFLENBQUw7QUFBUUMsUUFB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V0FoQkQsQ0FnQkUsaUJBQU0sQ0FBRTtBQUNYO0FBRUQ7OztBQUNBLGFBQUssTUFBTUksU0FBWCxJQUF3QkwsV0FBeEIsRUFBcUM7QUFDbkMsY0FBSTtBQUNGTSw0QkFBT0MsSUFBUCxDQUFZRixTQUFaO0FBQ0QsV0FGRCxDQUVFLGlCQUFNLENBQUU7QUFDWDs7QUFFRHZJLFFBQUFBLE9BQU8sQ0FBQzRGLE1BQUQsQ0FBUDtBQUNELE9BL0JEO0FBZ0NELEtBakNNLENBQVA7QUFrQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7QUFDVyxRQUFIOEMsR0FBRyxHQUF5QjtBQUNoQyxXQUFPLElBQUkzSSxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDLE9BQUMsWUFBWTtBQUNYLFlBQUk7QUFDRixnQkFBTTJGLE1BQU0sR0FBRyxNQUFNLEtBQUt2RCxxQkFBTCxFQUFyQjtBQUNBLGdCQUFNLEtBQUsyRixhQUFMLENBQW1CcEMsTUFBbkIsQ0FBTjtBQUNBLGdCQUFNLEtBQUtxQyxzQkFBTCxDQUE0QnJDLE1BQTVCLENBQU47QUFDQTVGLFVBQUFBLE9BQU8sQ0FBQzRGLE1BQUQsQ0FBUDtBQUNELFNBTEQsQ0FLRSxPQUFPeEYsS0FBUCxFQUFjO0FBQ2RILFVBQUFBLE1BQU0sQ0FBQ0csS0FBRCxDQUFOO0FBQ0Q7QUFDRixPQVREO0FBVUQsS0FYTSxDQUFQO0FBWUQ7O0FBcnNDUzs7O2VBMHNDR2xILEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHNoYXJwIGZyb20gJ3NoYXJwJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBwbmdUb0ljbyBmcm9tICdwbmctdG8taWNvJztcbmltcG9ydCBpY29Ub1BuZyBmcm9tICdpY28tdG8tcG5nJztcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJztcbmltcG9ydCB7IEljbnMsIEljbnNJbWFnZSB9IGZyb20gJ0BmaWFoZnkvaWNucyc7XG5pbXBvcnQgeyBPU1R5cGUgfSBmcm9tICdAZmlhaGZ5L2ljbnMvZGlzdCc7XG5pbXBvcnQgQnVmZmVyIGZyb20gJ2J1ZmZlcic7XG5cbi8qKiBkaXJlY3QgcmVmZXJlbmNlcyB0byBzaGFycCBsaWJyYXJ5ICovXG5leHBvcnQgdHlwZSBJY29ueklucHV0T3B0aW9ucyA9IHNoYXJwLlNoYXJwT3B0aW9ucztcbmV4cG9ydCB0eXBlIEljb256UmVzaXplT3B0aW9ucyA9IHNoYXJwLlJlc2l6ZU9wdGlvbnM7XG5leHBvcnQgdHlwZSBJY29uelBuZ09wdGlvbnMgPSBzaGFycC5QbmdPcHRpb25zO1xuZXhwb3J0IHR5cGUgSWNvbnpKcGVnT3B0aW9ucyA9IHNoYXJwLkpwZWdPcHRpb25zO1xuXG5leHBvcnQgdHlwZSBJY29uekltYWdlID0gc2hhcnAuU2hhcnA7XG5leHBvcnQgdHlwZSBJY29uekNvbG91ciA9IHNoYXJwLkNvbG9yO1xuXG4vKiogbGlzdCBvZiB2YWxpZCBpY29uIHR5cGVzICovXG5leHBvcnQgY29uc3QgSWNvbnpUeXBlcyA9IFsnaWNvJywgJ2ljbnMnLCAncG5nJywgJ2pwZWcnXSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgSWNvbnpUeXBlID0gdHlwZW9mIEljb256VHlwZXNbbnVtYmVyXTtcblxuZXhwb3J0IGludGVyZmFjZSBJY29uelJlcG9ydCB7XG4gIC8qKiB0ZW1wb3JhcnkgaW1hZ2VzICovXG4gIHRtcDogUmVjb3JkPHN0cmluZywgSWNvbnpSZXNpemVPcHRpb25zIHwgc3RyaW5nPjtcbiAgLyoqIGljbyBpbWFnZXMgKi9cbiAgaWNvOiBhbnk7XG4gIC8qKiBpY25zIGltYWdlcyAqL1xuICBpY25zOiBhbnk7XG4gIC8qKiBwbmcgaW1hZ2VzICovXG4gIHBuZzogYW55O1xuICAvKioganBlZyBpbWFnZXMgKi9cbiAganBlZzogYW55O1xuICAvKiogZmFpbGVkIGltYWdlcyAqL1xuICBmYWlsZWQ6IGFueTtcblxuICAvKiogZm9yIGN1c3RvbSBpdGVtcyBjcmVhdGVkIGluIGhvb2tzICovXG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJY29uek9wdGlvbnNIb29rIHt9XG5cbi8qKiBvcHRpb24gaG9va3MgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSWNvbnpJbnB1dE9wdGlvbnNIb29rIGV4dGVuZHMgSWNvbnpPcHRpb25zSG9vayB7XG4gIChvcHRpb25zOiBJY29ueklucHV0T3B0aW9ucyk6IFByb21pc2U8SWNvbnpJbnB1dE9wdGlvbnM+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEljb256UmVzaXplT3B0aW9uc0hvb2sgZXh0ZW5kcyBJY29uek9wdGlvbnNIb29rIHtcbiAgKG9wdGlvbnM6IEljb256UmVzaXplT3B0aW9ucyk6IFByb21pc2U8SWNvbnpSZXNpemVPcHRpb25zPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJY29uek91dHB1dE9wdGlvbnNIb29rIGV4dGVuZHMgSWNvbnpPcHRpb25zSG9vayB7XG4gIChvcHRpb25zOiBJY29uek91dHB1dE9wdGlvbnMpOiBQcm9taXNlPEljb256T3V0cHV0T3B0aW9ucz47XG59XG5cbmV4cG9ydCBjb25zdCBJY29uek91dHB1dFR5cGVzID0gWydwbmcnLCAnanBlZyddIGFzIGNvbnN0O1xuZXhwb3J0IHR5cGUgSWNvbnpPdXRwdXRUeXBlID0gdHlwZW9mIEljb256T3V0cHV0VHlwZXNbbnVtYmVyXTtcblxuLyoqIG1haW4gY29uZmlnIG9wdGlvbnMgLyBob29rcyAqL1xuZXhwb3J0IHR5cGUgSWNvbnpPcHRpb25zID0ge1xuICBpbnB1dDogSWNvbnpJbnB1dE9wdGlvbnMgfCBJY29ueklucHV0T3B0aW9uc0hvb2s7XG4gIHJlc2l6ZTogSWNvbnpSZXNpemVPcHRpb25zIHwgSWNvbnpSZXNpemVPcHRpb25zSG9vaztcbiAgb3V0cHV0OiBJY29uek91dHB1dE9wdGlvbnMgfCBJY29uek91dHB1dE9wdGlvbnNIb29rO1xufTtcblxuZXhwb3J0IHR5cGUgSWNvbnpPdXRwdXRGb3JtYXRzID0ge1xuICBwbmc6IEljb256UG5nT3B0aW9ucztcbiAganBlZzogSWNvbnpKcGVnT3B0aW9ucztcbn07XG4vKiogY3VycmVudCBhdmFpbGFibGUgb3V0cHV0IG9wdGlvbnMgKi9cbmV4cG9ydCB0eXBlIEljb256T3V0cHV0T3B0aW9ucyA9IHtcbiAgZm9ybWF0czogSWNvbnpPdXRwdXRGb3JtYXRzO1xuICAvKiogIGRlZmF1bHQgb3V0cHV0IGZvcm1hdCAqL1xuICBmb3JtYXQ6IGtleW9mIEljb256T3V0cHV0Rm9ybWF0cztcbn07XG5cbmV4cG9ydCB0eXBlIEljb256SWNvbkNvbmZpZyA9IHtcbiAgW2tleTogc3RyaW5nXTogSWNvbnpDb25maWc7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEljb256Q29uZmlnQ29sbGVjdGlvbiB7XG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBpbWFnZSB5b3Ugd2lzaCB0byB1c2UgYXMgYSB0ZW1wbGF0ZVxuICAgKlxuICAgKi9cbiAgc3JjPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBiYXNlIGZvbGRlciBmb3IgYWxsIGdlbmVyYXRlZCBpY29uc1xuICAgKlxuICAgKiBJZiBsZWZ0IGJsYW5rLCBpdCB3aWxsIHVzZSB0aGUgZGlyZWN0b3J5IG9mIHlvdXJcbiAgICogc291cmNlIGltYWdlXG4gICAqXG4gICAqL1xuICBmb2xkZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgd2hlcmUgdGhlIHRlbXBvcmFyeSBwbmcgaW1hZ2VzIGFyZSBnZW5lcmF0ZWRcbiAgICpcbiAgICogaWYgbGVmdCBibGFuaywgaXQgd2lsbCBnZW5lcmF0ZSBhIHRlbXBvcmFyeSBmb2xkZXJcbiAgICogaW5zaWRlIHlvdXIgb3BlcmF0aW5nIHN5c3RlbSdzIHRlbXAgZm9sZGVyLlxuICAgKlxuICAgKiBJZiB5b3UgZW50ZXIgYSBkaXJlY3RvcnksIGl0IHdpbGwgZ2VuZXJhdGUgdGhlIGljb25zXG4gICAqIHdpdGhpbiB0aGF0IGRpcmVjdG9yeSwgYW5kIGl0IHdpbGwgcmVtYWluIHVudGlsIHlvdVxuICAgKiBkZWxldGUgaXQuXG4gICAqXG4gICAqIE5PVEU6IGltYWdlcyBhcmUgZ2VuZXJhdGVkIGFzIHt7d2lkdGh9fXh7e2hlaWdodH19LnBuZ1xuICAgKiBlLmc6IDE2eDE2LnBuZyAsIDMyeDMyLnBuZyAuLi4uIDEwMjR4MTAyNC5wbmdcbiAgICpcbiAgICovXG4gIHRtcEZvbGRlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlc2Ugb3B0aW9ucyBhcmUgYmFzZWQgdXBvbiB0aGUgc2hhcnAgbGlicmFyeSBwYXJhbWV0ZXIgJ29wdGlvbnMnXG4gICAqIEZvciBJbnB1dCBTZWU6IGh0dHBzOi8vc2hhcnAucGl4ZWxwbHVtYmluZy5jb20vYXBpLWNvbnN0cnVjdG9yI3BhcmFtZXRlcnNcbiAgICogRm9yIFJlc2l6aW5nIFNlZTogaHR0cHM6Ly9zaGFycC5waXhlbHBsdW1iaW5nLmNvbS9hcGktcmVzaXplI3BhcmFtZXRlcnNcbiAgICogRm9yIE91dHB1dCBTZWU6IGh0dHBzOi8vc2hhcnAucGl4ZWxwbHVtYmluZy5jb20vYXBpLW91dHB1dCNwbmdcbiAgICpcbiAgICovXG4gIG9wdGlvbnM/OiBJY29uek9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEEgY29sbGVjdGlvbiBvZiBhY3Rpb25zIHRvIGJlIHJ1biBvbiBvcmlnaW5hbCBpbWFnZSBiZWZvcmUgY2xvbmluZ1xuICAgKlxuICAgKi9cbiAgYWN0aW9ucz86IEljb256SW1hZ2VBY3Rpb25zO1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGFuIG9wdGlvbmFsIG9iamVjdCBjb250YWluaW5nIHRoZSBjb25maWd1cmF0aW9uXG4gICAqIGZvciBlYWNoIHR5cGUgb2YgaWNvbiBzZXQgeW91IHdpc2ggdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIElmIGxlZnQgYmxhbmssIHRoZSBkZWZhdWx0cyB3aWxsIGJlIHVzZWRcbiAgICpcbiAgICovXG4gIGljb25zPzogSWNvbnpJY29uQ29uZmlnO1xufVxuXG4vKipcbiAqXG4gKiBUaGlzIGlzIGZvciB0aGUgcHJlIGFuZCBwb3N0IHJlc2l6aW5nIGhvb2sgbWV0aG9kc1xuICpcbiAqIFBMRUFTRSBOT1RFISEhIHJlc29sdmUoaW1hZ2UpIE1VU1QgYmUgY2FsbGVkIHdpdGhpbiB5b3VyIHByb21pc2VcbiAqIGZvciB0aGUgc3lzdGVtIHRvIGNvbnRpbnVlIHByb2Nlc3NpbmcgaXQuXG4gKlxuICogSE9XRVZFUiEhISByZXNvbHZlKHVuZGVmaW5lZCkgd2lsbCBlbnN1cmUgdGhlIHN5c3RlbVxuICogZG9lcyBOT1QgcHJvY2VzcyB0aGUgaW1hZ2UgZnVydGhlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbXlIb29rID0gKHNlbGYsaW1hZ2Usb3B0aW9ucyx0YXJnZXRGaWxlbmFtZSxpbWFnZVJlcG9ydCkgPT4ge1xuICogICBpbWFnZS5tb2R1bGF0ZSh7IGJyaWdodG5lc3M6IDIgfSk7XG4gKiAgIFByb21pc2UucmVzb2x2ZShpbWFnZSk7IC8vIGFsbG93IHN5c3RlbSB0byBjb250aW51ZSBub3JtYWxseVxuICogfVxuICogYGBgXG4gKiBAZXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbXlIb29rID0gKHNlbGYsaW1hZ2Usb3B0aW9ucyx0YXJnZXRGaWxlbmFtZSxpbWFnZVJlcG9ydCkgPT4ge1xuICogIGltYWdlLmJsdXIoNCkuanBlZygpLnRvQnVmZmVyKClcbiAqICAgIC50aGVuKChkYXRhKSA9PiBmcy53cml0ZUZpbGVTeW5jKCdteUZpbGUuanBnJywgZGF0YSkpO1xuICogIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpOyAvLyBoYWx0IHByb2Nlc3Npbmcgb2YgdGhlIGltYWdlIGFueSBmdXJ0aGVyXG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IHR5cGUgSWNvbnpSZXNpemVIb29rID0gKFxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgaW5zdGFudGlhdGVkIEljb256IGNsYXNzIHlvdSBjcmVhdGVkXG4gICAqL1xuICBzZWxmOiBJY29ueixcbiAgLyoqIFRoaXMgaXMgdGhlIGltYWdlIGdlbmVyYXRlZCBhbmQgcHJvY2Vzc2VkIGp1c3QgYmVmb3JlIGhvb2sgaXMgY2FsbGVkICovXG4gIGltYWdlOiBJY29uekltYWdlLFxuICAvKipcbiAgICogVGhlc2UgYXJlIHRoZSByZXNpemluZyBvcHRpb25zIGZyb20gd2l0aGluIHlvdXIgaWNvbiBjb25maWd1cmF0aW9uXG4gICAqIGl0IGFsc28gaW5jbHVkZXMgdGhlIHdpZHRoIChvcHRpb25zLndpZHRoKSBhbmQgaGVpZ2h0IChvcHRpb25zLmhlaWdodClcbiAgICogb2YgdGhlIGltYWdlIHRoYXQgaXMgYmVpbmcgZ2VuZXJhdGVkLlxuICAgKi9cbiAgb3B0aW9uczogSWNvbnpSZXNpemVPcHRpb25zLFxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgdGFyZ2V0IGZpbGVuYW1lIG9mIHRoZSBpbnRlbmRlZCBpY29uIHRvIGJlIGdlbmVyYXRlZC5cbiAgICovXG4gIHRhcmdldEZpbGVuYW1lOiBzdHJpbmcsXG4gIC8qKlxuICAgKiBUaGlzIHJldHVybnMgYSByZXBvcnQgb2JqZWN0IGNvbnRhaW5pbmcgYSBsaXN0IG9mIGFsbCB0aGUgaWNvbnMgZ2VuZXJhdGVkXG4gICAqIFlvdSBtYXkgYWRkIHRvIHRoZSBvYmplY3QsIGFuZCBpdCB3aWxsIGJlIHJldHVybmVkIGF0IHRoZSBlbmQuXG4gICAqL1xuICBpbWFnZVJlcG9ydDogSWNvbnpSZXBvcnQsXG4pID0+IFByb21pc2U8SWNvbnpJbWFnZSB8IHVuZGVmaW5lZD47XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBjdXJyZW50IGhvb2tzIGF2YWlsYWJsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEljb256SG9va3Mge1xuICBwcmVSZXNpemU/OiBJY29uelJlc2l6ZUhvb2s7XG4gIHBvc3RSZXNpemU/OiBJY29uelJlc2l6ZUhvb2s7XG59XG5cbi8qKiB2YWxpZCBtZXRob2QgbmFtZXMgZnJvbSBzaGFycCBsaWJyYXJ5ICovXG5leHBvcnQgdHlwZSBJY29uekltYWdlQWN0aW9uTmFtZSA9IGtleW9mIHNoYXJwLlNoYXJwO1xuXG50eXBlIEljb256SW1hZ2VBY3Rpb24gPSB7XG4gIGNtZDogSWNvbnpJbWFnZUFjdGlvbk5hbWU7XG4gIGFyZ3M6IGFueVtdO1xufTtcblxudHlwZSBJY29uekltYWdlQWN0aW9ucyA9IEljb256SW1hZ2VBY3Rpb25bXTtcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBpY29uIGNvbmZpZ3VyYXRpb24gbGF5b3V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSWNvbnpDb25maWcge1xuICAvKipcbiAgICogVGhpcyBpcyB0aGUgdHlwZSBvZiBpY29uIHlvdSB3aXNoIHRvIHVzZVxuICAgKiBpdCBtdXN0IGJlIGVpdGhlciBwbmcsIGljbyBvciBpY25zXG4gICAqXG4gICAqL1xuICB0eXBlOiBJY29uelR5cGU7XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgeW91IHdpc2ggdG8gdXNlXG4gICAqIGl0IGlzIHBhcnNlZCB1c2luZyB0aGUgaGFuZGxlYmFycyBzeW50YXguXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYHRleHRcbiAgICogZm9yIGFuIGltYWdlIHdpdGggdGhlIHNpemUgJzI0eDE4JyB0aGUgbmFtZVxuICAgKiB3b3VsZCBiZSBhcyBmb2xsb3dzOlxuICAgKiAnaWNvbi17e3NpemV9fScgcmVzb2x2ZXMgdG8gJ2ljb24tMjR4MTgnXG4gICAqICdpY29uLXt7ZGltc319JyByZXNvbHZlcyB0byAnaWNvbi0yNHgxOCdcbiAgICogJ2ljb24te3t3aWR0aH19JyByZXNvbHZlcyB0byAnaWNvbi0yNCdcbiAgICogJ2ljb24te3toZWlnaHR9fScgcmVzb2x2ZXMgdG8gJ2ljb24tMTgnXG4gICAqXG4gICAqIElmIHRoZSBzaXplIGlzIHNldCBhcyBhIHNpbmdsZSBudW1iZXIsXG4gICAqIGUuZyAyNCwgdGhlIHt7ZGltc319IHZhcmlhYmxlIHJldHVybnMgMjR4MjQsXG4gICAqIGhvd2V2ZXIsIHRoZSB7e3NpemV9fSB2YXJpYWJsZSB3b3VsZCBqdXN0IHJldHVybiAyNC5cbiAgICpcbiAgICogJ2ljb24te3tzaXplfX0nIHJlc29sdmVzIHRvICdpY29uLTI0J1xuICAgKiAnaWNvbi17e2RpbXN9fScgcmVzb2x2ZXMgdG8gJ2ljb24tMjR4MjQnXG4gICAqICdpY29uLXt7d2lkdGh9fScgcmVzb2x2ZXMgdG8gJ2ljb24tMjQnXG4gICAqICdpY29uLXt7aGVpZ2h0fX0nIHJlc29sdmVzIHRvICdpY29uLTI0J1xuICAgKiBgYGBcbiAgICovXG4gIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBpcyBhbiBhcnJheSBvZiBzaXplcywgd2hldGhlciBhcyBhbiBpbnRlZ2VyXG4gICAqIG9yIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0ZXh0XG4gICAqIEFzIGEgc3RyaW5nIHlvdSBjYW4gZWl0aGVyIGp1c3QgdXNlIGEgc2luZ2xlIG51bWJlclxuICAgKiAnNTYnIC0gd2hpY2ggd2lsbCBiZSBib3RoIHRoZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAqIGBgYFxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0ZXh0XG4gICAqIElmIHRoZSB3aWR0aCBkaWZmZXJzIGZyb20gdGhlIGhlaWdodCwgdXNlIHRoZSBmb2xsb3dpbmcgZm9ybWF0XG4gICAqICcxMjB4ODAnIHdoaWNoIG1lYW5zIHRoZSB3aWR0aCAxMjAgYW5kIGhlaWdodCBvZiA4MC5cbiAgICogYGBgXG4gICAqL1xuICBzaXplczogKHN0cmluZyB8IG51bWJlcilbXTtcblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgZm9sZGVyIHlvdSB3aXNoIHRvIHN0b3JlIHRoZSBpbWFnZXNcbiAgICogZ2VuZXJhdGVkIGZyb20gdGhpcyBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBJZiBsZWZ0IGJsYW5rLCBpdCB3aWxsIHVzZSB0aGUgZGVmYXVsdCBmb2xkZXJcbiAgICogZnJvbSB0aGUgbWFpbiBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKi9cbiAgZm9sZGVyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGVzZSByZXNpemluZyBvcHRpb25zIGFyZSBvbmVzIGZyb20gdGhlIHNoYXJwIGxpYnJhcnksXG4gICAqIGFuZCBhcmUgYXBwbGllZCB3aGVuIHJlc2l6aW5nIHRoZSBpY29ucy5cbiAgICpcbiAgICogSWYgbGVmdCBibGFuaywgZGVmYXVsdHMgd2lsbCBiZSBjaG9zZW5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3NoYXJwLnBpeGVscGx1bWJpbmcuY29tL2FwaS1yZXNpemVcbiAgICogQGV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiB7XG4gICAqICAgcG9zaXRpb246ICdjZW50cmUnLCBmaXQ6ICdjb250YWluJywga2VybmVsOiAnbWl0Y2hlbGwnLFxuICAgKiAgIGJhY2tncm91bmQ6IHsgcjogMjU1LCBnOiAxMjcsIGI6IDAsIGFscGhhOiAwLjUgfVxuICAgKiB9XG4gICAqIGBgYFxuICAgKi9cbiAgb3B0aW9ucz86IEljb256UmVzaXplT3B0aW9ucztcblxuICAvKipcbiAgICogVGhlIGhvb2tzIHNlY3Rpb24gaXMgb3B0aW9uYWwsIGJ1dCBzaG91bGQgeW91IHdpc2hcbiAgICogdG8gYWx0ZXIgYW55IG9mIHRoZSBpY29ucyBkdXJpbmcgZ2VuZXJhdGlvbiwgdGhlIGZvbGxvd2luZ1xuICAgKiBob29rcyBjYW4gYmUgdXNlZC5cbiAgICpcbiAgICogSWYgeW91IHdpc2ggZm9yIHRoZSBzeXN0ZW0gdG8gc3RvcCBwcm9jZXNzaW5nIHRoZSBpbWFnZVxuICAgKiBhZnRlciB5b3VyIGhvb2ssIHlvdSBtdXN0IHVzZVxuICAgKiByZXNvbHZlKHVuZGVmaW5lZCkgaW5zdGVhZCBvZiByZXNvbHZlKGltYWdlKSB3aXRoaW4gdGhlIHByb21pc2VcbiAgICpcbiAgICogQGZ1bmN0aW9uIHByZVJlc2l6ZSAtIFRoaXMgcnVucyBqdXN0IGJlZm9yZSB0aGUgaW1hZ2UgaXMgcmVzaXplZCBhbmQgY29udmVydGVkIHRvIHBuZ1xuICAgKiBAZnVuY3Rpb24gcG9zdFJlc2l6ZSAtIFRoaXMgaXMgYWZ0ZXIgdGhlIGNvbnZlcnNpb24sIGJ1dCBiZWZvcmUgY29udmVyc2lvbiB0byBhIGJ1ZmZlciBhbmQgc2F2ZWQgdG8gYSBmaWxlXG4gICAqL1xuICBob29rcz86IEljb256SG9va3M7XG5cbiAgLyoqXG4gICAqIHNob3VsZCB5b3Ugd2lzaCB0byB0ZW1wb3JhcmlseSBkaXNhYmxlIGEgc2luZ2xlIGNvbmZpZ3VyYXRpb25cbiAgICogc2V0IHRoZSBlbmFibGVkIHZhciB0byBmYWxzZVxuICAgKlxuICAgKiBAZXhhbXBsZSBlbmFibGVkOiBmYWxzZVxuICAgKi9cbiAgZW5hYmxlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgZGVmYXVsdCBpY29uIGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IEljb256Q29uZmlnQ29sbGVjdGlvbiA9IHtcbiAgb3B0aW9uczoge1xuICAgIGlucHV0OiA8SWNvbnpJbnB1dE9wdGlvbnM+e1xuICAgICAgZGVuc2l0eTogMTUwLFxuICAgIH0sXG4gICAgcmVzaXplOiA8SWNvbnpSZXNpemVPcHRpb25zPntcbiAgICAgIGZpdDogJ2NvbnRhaW4nLFxuICAgICAgYmFja2dyb3VuZDogeyByOiAwLCBnOiAwLCBiOiAwLCBhbHBoYTogMCB9LFxuICAgICAga2VybmVsOiAnbWl0Y2hlbGwnLFxuICAgICAgcG9zaXRpb246ICdjZW50cmUnLFxuICAgICAgd2l0aG91dEVubGFyZ2VtZW50OiBmYWxzZSxcbiAgICAgIGZhc3RTaHJpbmtPbkxvYWQ6IHRydWUsXG4gICAgICB3aWR0aDogMTAyNCxcbiAgICAgIGhlaWdodDogMTAyNCxcbiAgICB9LFxuICAgIG91dHB1dDogPEljb256T3V0cHV0T3B0aW9ucz57XG4gICAgICBmb3JtYXRzOiA8SWNvbnpPdXRwdXRGb3JtYXRzPntcbiAgICAgICAgcG5nOiB7XG4gICAgICAgICAgY29tcHJlc3Npb25MZXZlbDogOSxcbiAgICAgICAgICBxdWFsaXR5OiAxMDAsXG4gICAgICAgIH0sXG4gICAgICAgIGpwZWc6IHtcbiAgICAgICAgICBxdWFsaXR5OiAxMDAsXG4gICAgICAgICAgY2hyb21hU3Vic2FtcGxpbmc6ICc0OjQ6NCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZm9ybWF0OiAncG5nJyxcbiAgICB9LFxuICB9LFxuICBpY29uczoge1xuICAgIGljbnM6IHtcbiAgICAgIHR5cGU6ICdpY25zJyxcbiAgICAgIG5hbWU6ICdhcHAnLFxuICAgICAgc2l6ZXM6IFsxNiwgMzIsIDY0LCAxMjgsIDI1NiwgNTEyLCAxMDI0XSxcbiAgICAgIGZvbGRlcjogJy4nLFxuICAgIH0sXG4gICAgaWNvOiB7XG4gICAgICB0eXBlOiAnaWNvJyxcbiAgICAgIG5hbWU6ICdhcHAnLFxuICAgICAgc2l6ZXM6IFsxNiwgMjQsIDMyLCA0OCwgNjQsIDEyOCwgMjU2XSxcbiAgICAgIGZvbGRlcjogJy4nLFxuICAgIH0sXG4gICAgZmF2aWNvOiB7XG4gICAgICB0eXBlOiAnaWNvJyxcbiAgICAgIG5hbWU6ICdmYXZpY29uJyxcbiAgICAgIHNpemVzOiBbMTYsIDI0LCAzMiwgNDgsIDY0XSxcbiAgICAgIGZvbGRlcjogJy4nLFxuICAgIH0sXG4gICAgZmF2aWNvblBuZzoge1xuICAgICAgdHlwZTogJ3BuZycsXG4gICAgICBuYW1lOiAnZmF2aWNvbicsXG4gICAgICBzaXplczogWzMyXSxcbiAgICAgIGZvbGRlcjogJy4nLFxuICAgIH0sXG4gICAgZmF2aWNvbjoge1xuICAgICAgdHlwZTogJ3BuZycsXG4gICAgICBuYW1lOiAnZmF2aWNvbi17e2RpbXN9fScsXG4gICAgICBzaXplczogWzMyLCA1NywgNzIsIDk2LCAxMjAsIDEyOCwgMTQ0LCAxNTIsIDE5NSwgMjI4XSxcbiAgICAgIGZvbGRlcjogJ2ljb25zJyxcbiAgICB9LFxuICAgIG1zVGlsZToge1xuICAgICAgdHlwZTogJ3BuZycsXG4gICAgICBuYW1lOiAnbXN0aWxlLXt7ZGltc319JyxcbiAgICAgIHNpemVzOiBbNzAsIDE0NCwgMTUwLCAyNzAsIDMxMCwgJzMxMHgxNTAnXSxcbiAgICAgIGZvbGRlcjogJ2ljb25zJyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYmFja2dyb3VuZDogeyByOiAwLCBnOiAwLCBiOiAwLCBhbHBoYTogMSB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGFuZHJvaWQ6IHtcbiAgICAgIHR5cGU6ICdwbmcnLFxuICAgICAgbmFtZTogJ2FuZHJvaWQtY2hyb21lLXt7ZGltc319JyxcbiAgICAgIHNpemVzOiBbMzYsIDQ4LCA3MiwgOTYsIDE0NCwgMTkyLCAyNTYsIDM4NCwgNTEyXSxcbiAgICAgIGZvbGRlcjogJ2ljb25zJyxcbiAgICB9LFxuICAgIGFwcGxlVG91Y2g6IHtcbiAgICAgIHR5cGU6ICdwbmcnLFxuICAgICAgbmFtZTogJ2FwcGxlLXRvdWNoLXt7ZGltc319JyxcbiAgICAgIHNpemVzOiBbMTYsIDMyLCA3NiwgOTYsIDExNCwgMTIwLCAxNDQsIDE1MiwgMTY3LCAxODBdLFxuICAgICAgZm9sZGVyOiAnaWNvbnMnLFxuICAgIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIEljb256IC0gSWNvbiBHZW5lcmF0b3IgZm9yIHRoZSBXZWJcbiAqXG4gKiBTZWUgUkVBRE1FLm1kIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uXG4gKlxuICovXG5jbGFzcyBJY29ueiB7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGRhdGFcbiAgICovXG4gIHByb3RlY3RlZCBfY29uZmlnOiBJY29uekNvbmZpZ0NvbGxlY3Rpb24gPSB7fTtcblxuICAvKipcbiAgICogdGhlc2UgYXJlIHRoZSB2YXJpYWJsZXMgd2hpY2ggY2FuIGJlIHVzZWQgd2hlbiBwYXJzaW5nIHRoZSBmaWxlbmFtZVxuICAgKi9cbiAgcHJvdGVjdGVkIF9wYXJzZXJWYWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAvKipcbiAgICogSWNvbnogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtJY29uekNvbmZpZ0NvbGxlY3Rpb259IGNvbmZpZyAtIE1haW4gY29uZmlndXJhdGlvbiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogSWNvbnpDb25maWdDb2xsZWN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbmZpZyBpcyBtaXNzaW5nJyk7XG4gICAgfVxuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcodGhpcy5jbG9uZShkZWZhdWx0Q29uZmlnKSwgY29uZmlnKTtcblxuICAgIC8qKiBpZiBpY29ucyBoYXZlIGJlZW4gY2hvc2VuLCBvdmVyd3JpdGUgZGVmYXVsdHMgKi9cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5pY29ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5pY29ucyA9IHRoaXMuY2xvbmUoY29uZmlnLmljb25zKTtcbiAgICB9XG4gICAgdGhpcy52YWxpZGF0ZUNvbmZpZyh0aGlzLl9jb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZXAgT2JqZWN0IENsb25lclxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IC0gb2JqZWN0IHRvIGNsb25lXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gY2xvbmUgb2Ygb2JqZWN0XG4gICAqL1xuICBjbG9uZTxUIGV4dGVuZHMgeyBbcHJvcDogc3RyaW5nXTogYW55IH0+KG9iamVjdDogVCk6IFQge1xuICAgIC8qKiAgY2xvbmluZyBvdXRwdXQgKi9cbiAgICBjb25zdCBjbG9uaW5nOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhvYmplY3QpLm1hcCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3RbcHJvcF0pKSB7XG4gICAgICAgIGNsb25pbmdbcHJvcF0gPSBbXS5jb25jYXQob2JqZWN0W3Byb3BdKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9iamVjdFtwcm9wXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY2xvbmluZ1twcm9wXSA9IHRoaXMuY2xvbmUob2JqZWN0W3Byb3BdKTtcbiAgICAgIH0gZWxzZSBjbG9uaW5nW3Byb3BdID0gb2JqZWN0W3Byb3BdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIDxUPmNsb25pbmc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgdGhlIHZhcmlhYmxlcyB0byBiZSB1c2VkIHdpdGggZmlsZW5hbWUgcGFyc2VyXG4gICAqXG4gICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gZXh0cmFEYXRhIC0gZXh0cmEgZGF0YSB0byBtZXJnZSBpbnRvIHBhcnNlciB2YWx1ZXNcbiAgICogQHBhcmFtIHtib29sZWFufSBmcmVlemVDb3VudGVyIC0gb25seSB0byBiZSB1c2VkIHRvIGdldCBhIHN0YXRpYyBzbmFwc2hvdCBvZiBwYXJzZXIgdmFsdWVzXG4gICAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSAtIE9iamVjdCBjb250YWluaW5nIGF2YWlsYWJsZSBwYXJzZXIgdmFsdWVzXG4gICAqL1xuICBnZXRQYXJzZXJWYWx1ZXMoZXh0cmFEYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBmcmVlemVDb3VudGVyPzogYm9vbGVhbik6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIC8vIHJlY29yZCBzdGFydCBkYXRlXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJzZXJWYWx1ZXMuc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9wYXJzZXJWYWx1ZXMuc3RhcnQgPSBJY29uei5kYXRlVG9PYmplY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5jbG9uZSh0aGlzLl9wYXJzZXJWYWx1ZXMpLFxuICAgICAgLi4ue1xuICAgICAgICBlbnY6IHRoaXMuY2xvbmUocHJvY2Vzcy5lbnYpLFxuICAgICAgICBjb3VudGVyOlxuICAgICAgICAgIHR5cGVvZiB0aGlzLl9wYXJzZXJWYWx1ZXMuY291bnRlciA9PT0gJ251bWJlcidcbiAgICAgICAgICAgID8gZnJlZXplQ291bnRlciA9PT0gdHJ1ZVxuICAgICAgICAgICAgICA/IHRoaXMuX3BhcnNlclZhbHVlcy5jb3VudGVyXG4gICAgICAgICAgICAgIDogKyt0aGlzLl9wYXJzZXJWYWx1ZXMuY291bnRlclxuICAgICAgICAgICAgOiBmcmVlemVDb3VudGVyID09PSB0cnVlXG4gICAgICAgICAgICA/IDBcbiAgICAgICAgICAgIDogKHRoaXMuX3BhcnNlclZhbHVlcy5jb3VudGVyID0gMSksXG4gICAgICAgIC8vIGdldCBsYXRlc3QgZGF0ZSBldmVyeSBjYWxsXG4gICAgICAgIGRhdGU6IGZyZWV6ZUNvdW50ZXIgPT09IHRydWUgPyB0aGlzLl9wYXJzZXJWYWx1ZXMuc3RhcnQgOiBJY29uei5kYXRlVG9PYmplY3QoKSxcbiAgICAgIH0sXG4gICAgICAuLi50aGlzLmNsb25lKGV4dHJhRGF0YSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgQ29uZmlndXJhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNsb25lIC0gU2hvdWxkIHRoZSByZXR1cm5lZCBvYmplY3QgYmUgYSBjbG9uZVxuICAgKiBAcmV0dXJucyB7SWNvbnpDb25maWdDb2xsZWN0aW9ufSAtIEljb24gQ29uZmlndXJhdGlvbiBvYmplY3RcbiAgICovXG4gIGdldENvbmZpZyhjbG9uZT86IGJvb2xlYW4pOiBJY29uekNvbmZpZ0NvbGxlY3Rpb24ge1xuICAgIC8qKiAgZGVmYXVsdCB0byByZXR1cm5pbmcgY2xvbmVkIGNvbmZpZyAqL1xuICAgIGlmIChjbG9uZSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNsb25lKHRoaXMuX2NvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBBUkdCIHRvIFJHQkFcbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IHhJbk91dCAtIEJ1ZmZlciB0byBjb252ZXJ0XG4gICAqL1xuICBhcmdiMnJnYmEoeEluT3V0OiBCdWZmZXIpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHhJbk91dC5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgY29uc3QgeDAgPSB4SW5PdXRbaV07XG4gICAgICB4SW5PdXRbaV0gPSB4SW5PdXRbaSArIDFdO1xuICAgICAgeEluT3V0W2kgKyAxXSA9IHhJbk91dFtpICsgMl07XG4gICAgICB4SW5PdXRbaSArIDJdID0geEluT3V0W2kgKyAzXTtcbiAgICAgIHhJbk91dFtpICsgM10gPSB4MDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBSR0JBIHRvIEFSR0JcbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IHhJbk91dCAtIEJ1ZmZlciB0byBjb252ZXJ0XG4gICAqL1xuICByZ2JhMmFyZ2IoeEluT3V0OiBCdWZmZXIpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHhJbk91dC5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgY29uc3QgeDAgPSB4SW5PdXRbaSArIDNdO1xuICAgICAgeEluT3V0W2kgKyAzXSA9IHhJbk91dFtpICsgMl07XG4gICAgICB4SW5PdXRbaSArIDJdID0geEluT3V0W2kgKyAxXTtcbiAgICAgIHhJbk91dFtpICsgMV0gPSB4SW5PdXRbaV07XG4gICAgICB4SW5PdXRbaV0gPSB4MDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2UgQ29uZmlndXJhdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtSZWNvcmQ8YW55LCBhbnk+fSB0YXJnZXQgLSBUYXJnZXQgT2JqZWN0XG4gICAqIEBwYXJhbSB7UmVjb3JkPGFueSwgYW55Pn0gc291cmNlcyAtIFNvdXJjZSBPYmplY3RcbiAgICogQHJldHVybnMge1JlY29yZDxhbnksIGFueT59IC0gbWVyZ2VkIG9iamVjdFxuICAgKi9cbiAgbWVyZ2VDb25maWcodGFyZ2V0OiBSZWNvcmQ8YW55LCBhbnk+LCAuLi5zb3VyY2VzOiBSZWNvcmQ8YW55LCBhbnk+W10pOiBSZWNvcmQ8YW55LCBhbnk+IHtcbiAgICBjb25zdCBpc09iamVjdCA9IChpdGVtOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKTtcbiAgICB9O1xuXG4gICAgaWYgKCFzb3VyY2VzLmxlbmd0aCkgcmV0dXJuIHRhcmdldDtcbiAgICBjb25zdCBzb3VyY2UgPSBzb3VyY2VzLnNoaWZ0KCk7XG5cbiAgICBpZiAoaXNPYmplY3QodGFyZ2V0KSAmJiBpc09iamVjdChzb3VyY2UpKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgIC8qKiAgZW5zdXJlIHRoYXQgaWYgdGhlIHNvdXJjZSBvYmplY3QgaXMgaW50ZW50aW9uYWxseSBlbXB0eSwgc2V0IHRoZSB0YXJnZXQgYXMgZW1wdHkgdG9vLiAqL1xuICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0gfHwgT2JqZWN0LmtleXMoc291cmNlW2tleV0pLmxlbmd0aCA9PT0gMCkgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHsgW2tleV06IHt9IH0pO1xuICAgICAgICAgIHRoaXMubWVyZ2VDb25maWcodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZVtrZXldKSAmJiBBcnJheS5pc0FycmF5KHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gWy4uLm5ldyBTZXQoWy4uLnRhcmdldFtrZXldLCAuLi5zb3VyY2Vba2V5XV0pXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHRhcmdldCwgeyBba2V5XTogc291cmNlW2tleV0gfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tZXJnZUNvbmZpZyh0YXJnZXQsIC4uLnNvdXJjZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGNvbmZpZ3VyYXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtJY29uekNvbmZpZ0NvbGxlY3Rpb259IGNvbmZpZyAtIG1haW4gY29uZmlndXJhdGlvbiBvYmplY3RcbiAgICovXG4gIHZhbGlkYXRlQ29uZmlnKGNvbmZpZzogSWNvbnpDb25maWdDb2xsZWN0aW9uKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICdvYmplY3QnIHx8IGNvbmZpZyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjb25maWd1cmF0aW9uJyk7XG4gICAgfVxuXG4gICAgLyoqICB0cnkgdG8gcmVhZCBpbWFnZSBmaWxlICovXG4gICAgaWYgKHR5cGVvZiBjb25maWcuc3JjICE9PSAnc3RyaW5nJyB8fCAhZnMuZXhpc3RzU3luYyhjb25maWcuc3JjKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb3VyY2UgaW1hZ2Ugbm90IGZvdW5kJyk7XG4gICAgfVxuXG4gICAgLyoqICBjcmVhdGUgYmFzZSBmb2xkZXIgaWYgaXQgZG9lc24ndCBleGlzdCAqL1xuICAgIGlmICh0eXBlb2YgY29uZmlnLmZvbGRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhjb25maWcuZm9sZGVyKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLm1rZGlyU3luYyhjb25maWcuZm9sZGVyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLyoqICBmb2xkZXIgd2Fzbid0IGNyZWF0ZWQgKi9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBjcmVhdGUgZm9sZGVyICR7Y29uZmlnLmZvbGRlcn1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5mb2xkZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvKiogIHNldCBiYXNlIG91dHB1dCBmb2xkZXIgc2FtZSBhcyBpbnB1dCBmb2xkZXIgKi9cbiAgICAgIGNvbmZpZy5mb2xkZXIgPSB0aGlzLnBhdGgoKS5kaXJuYW1lKGNvbmZpZy5zcmMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZm9sZGVyIG5hbWUnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy50bXBGb2xkZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbmZpZy50bXBGb2xkZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0ZW1wIGZvbGRlcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNBYnNvbHV0ZVBhdGgoY29uZmlnLnRtcEZvbGRlcikgJiYgIXRoaXMuaXNSZWxhdGl2ZVBhdGgoY29uZmlnLnRtcEZvbGRlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRlbXAgZm9sZGVyIG5hbWUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnLnRtcEZvbGRlciA9IGZzLm1rZHRlbXBTeW5jKHRoaXMucGF0aCgpLmpvaW4ob3MudG1wZGlyKCksICdpY29uei0nKSk7XG4gICAgfVxuXG4gICAgLyoqICBpZiB0ZW1wIGZvbGRlciBpcyBzZWxlY3RlZCwgZW5zdXJlIGl0IGV4aXN0cy4gVGhpcyB3aWxsIGJlIHVzZWQgdG8gc3RvcmUgYWxsIHNpemVkIHBuZyBmaWxlcyAqL1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhjb25maWcudG1wRm9sZGVyKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZnMubWtkaXJTeW5jKFxuICAgICAgICAgIHRoaXMuaXNSZWxhdGl2ZVBhdGgoY29uZmlnLnRtcEZvbGRlcikgPyB0aGlzLnBhdGgoKS5qb2luKGNvbmZpZy5mb2xkZXIsIGNvbmZpZy50bXBGb2xkZXIpIDogY29uZmlnLnRtcEZvbGRlcixcbiAgICAgICAgICB7IHJlY3Vyc2l2ZTogdHJ1ZSB9LFxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29uZmlnLmljb25zICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uZmlnLmljb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJY29uIGNvbmZpZ3VyYXRpb24gaXMgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29uZmlnLmljb25zID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhjb25maWcuaWNvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJY29uIGNvbmZpZ3VyYXRpb24gbm90IHNldCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBwYXRoIGlzIGFic29sdXRlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBwYXRoIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIGlmIHBhdGggaXMgYWJzb2x1dGVcbiAgICovXG4gIGlzQWJzb2x1dGVQYXRoKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGF0aCgpLmlzQWJzb2x1dGUoc3RyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBwYXRoIGlzIHJlbGF0aXZlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBwYXRoIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIGlmIHBhdGggaXMgcmVsYXRpdmVcbiAgICovXG4gIGlzUmVsYXRpdmVQYXRoKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzQWJzb2x1dGVQYXRoKHN0cik7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhcHByb3ByaWF0ZSBwYXRoIGJhc2VkIHVwb24gcGxhdGZvcm1cbiAgICpcbiAgICogQHJldHVybnMge3BhdGguUGxhdGZvcm19IC0gcGxhdGZvcm1cbiAgICovXG4gIHBhdGgoKTogcGF0aC5QbGF0Zm9ybVBhdGgge1xuICAgIHJldHVybiBJY29uei5wYXRoKCk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhcHByb3ByaWF0ZSBwYXRoIGJhc2VkIHVwb24gcGxhdGZvcm1cbiAgICpcbiAgICogQHJldHVybnMge3BhdGguUGxhdGZvcm1QYXRofSAtIHBsYXRmb3JtXG4gICAqL1xuICBzdGF0aWMgcGF0aCgpOiBwYXRoLlBsYXRmb3JtUGF0aCB7XG4gICAgcmV0dXJuIHBhdGhbcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICd3aW4zMicgOiAncG9zaXgnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgSWNvbiBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBuYW1lIG9mIGljb24gY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0ge0ljb256Q29uZmlnfSBjb25maWcgLSBJY29ueiBDb25maWcgb2JqZWN0XG4gICAqL1xuICBhZGRJY29uQ29uZmlnKGtleTogc3RyaW5nLCBjb25maWc6IEljb256Q29uZmlnKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnIHx8IGtleS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY29uZmlnIG5hbWUnKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICdvYmplY3QnIHx8IE9iamVjdC5rZXlzKGNvbmZpZykubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb25maWcgaXMgaW52YWxpZCcpO1xuICAgIH1cbiAgICB0aGlzLl9jb25maWcuaWNvbnMgPz89IHt9O1xuICAgIHRoaXMuX2NvbmZpZy5pY29uc1trZXldID0gY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhY3Rpb24gZm9yIHNvdXJjZSBpbWFnZVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vc2hhcnAucGl4ZWxwbHVtYmluZy5jb20vYXBpLW9wZXJhdGlvbiBmb3IgYWxsIG9wZXJhdGlvbnNcbiAgICogQHBhcmFtIHtJY29uekltYWdlQWN0aW9uTmFtZX0gY21kIC0gVGhlIGNvbW1hbmQgdG8gYmUgcnVuXG4gICAqIEBwYXJhbSB7YW55W119IGFyZ3MgLSBvcHRpb25hbCBhcmd1bWVudHNcbiAgICogQHJldHVybnMge3RoaXN9IC0gSWNvbnogY2xhc3NcbiAgICovXG4gIGFkZEFjdGlvbihjbWQ6IEljb256SW1hZ2VBY3Rpb25OYW1lLCAuLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xuICAgIGlmICh0eXBlb2YgY21kICE9PSAnc3RyaW5nJyB8fCBjbWQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFjdGlvbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLyoqIGFkZCBhY3Rpb24gdG8gbGlzdCAqL1xuICAgIHRoaXMuX2NvbmZpZy5hY3Rpb25zID8/PSBbXTtcbiAgICB0aGlzLl9jb25maWcuYWN0aW9ucy5wdXNoKHsgY21kLCBhcmdzOiBhcmdzLmxlbmd0aCA9PT0gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3NbMF0pID8gWy4uLmFyZ3NbMF1dIDogYXJncyB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgaGV4IHN0cmluZyBpbnRvIGNvbG91ciBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhleCAtIGlucHV0IGhleCBzdHJpbmdcbiAgICogQHJldHVybnMge0ljb256Q29sb3VyfSAtIENvbG91ciBvYmplY3RcbiAgICovXG4gIGJnSGV4VG9PYmooaGV4OiBzdHJpbmcpOiBJY29uekNvbG91ciB7XG4gICAgaWYgKCEvXiM/KFswLTlBLUZdezZ9fFswLTlBLUZdezh9KS9pLnRlc3QoaGV4KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCwgc2hvdWxkIGJlICNBQUZGMDAgKHJnYikgb3IgI0FBRkYwMDIyIChyZ2JhKSBmb3JtYXQnKTtcbiAgICB9XG5cbiAgICAvKiogIHJlbW92ZSBoYXNoIGZyb20gc3RhcnQgb2Ygc3RyaW5nICovXG4gICAgaWYgKGhleC5pbmRleE9mKCcjJykgPT09IDApIHtcbiAgICAgIGhleCA9IGhleC5zbGljZSgxKTtcbiAgICB9XG5cbiAgICBjb25zdCByb3VuZCA9ICh4OiBudW1iZXIsIG4gPSAyKSA9PiB7XG4gICAgICBjb25zdCBwcmVjaXNpb24gPSBNYXRoLnBvdygxMCwgbik7XG4gICAgICByZXR1cm4gTWF0aC5yb3VuZCgoeCArIE51bWJlci5FUFNJTE9OKSAqIHByZWNpc2lvbikgLyBwcmVjaXNpb247XG4gICAgfTtcblxuICAgIC8qKiAgY29udmVydCB0byBvYmplY3QgKi9cbiAgICByZXR1cm4ge1xuICAgICAgcjogcGFyc2VJbnQoaGV4LnN1YnN0cigwLCAyKSwgMTYpLFxuICAgICAgZzogcGFyc2VJbnQoaGV4LnN1YnN0cigyLCAyKSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQoaGV4LnN1YnN0cig0LCAyKSwgMTYpLFxuICAgICAgYWxwaGE6XG4gICAgICAgIGhleC5sZW5ndGggPT09IDYgPyAxIDogcGFyc2VJbnQoaGV4LnN1YnN0cig2LCAyKSwgMTYpID09PSAwID8gMCA6IHJvdW5kKHBhcnNlSW50KGhleC5zdWJzdHIoNiwgMiksIDE2KSAvIDI1NSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGNvbG91ciBvYmplY3QgaW50byBoZXggc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7SWNvbnpDb2xvdXJ9IG9iaiAtIENvbG91ciBvYmplY3QgdG8gY29udmVydFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIEhleCBzdHJpbmcgaW4gdGhlIGZvcm1hdCAjUlJHR0JCQUFcbiAgICovXG4gIGJnT2JqVG9IZXgob2JqOiBJY29uekNvbG91cik6IHN0cmluZyB7XG4gICAgaWYgKFxuICAgICAgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHxcbiAgICAgIHR5cGVvZiBvYmouciAhPT0gJ251bWJlcicgfHxcbiAgICAgIHR5cGVvZiBvYmouZyAhPT0gJ251bWJlcicgfHxcbiAgICAgIHR5cGVvZiBvYmouYiAhPT0gJ251bWJlcicgfHxcbiAgICAgIHR5cGVvZiBvYmouYWxwaGEgIT09ICdudW1iZXInXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYmFja2dyb3VuZCBvYmplY3QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgJyMnICtcbiAgICAgIG9iai5yLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpICtcbiAgICAgIG9iai5nLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpICtcbiAgICAgIG9iai5iLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpICtcbiAgICAgIE1hdGguZmxvb3Iob2JqLmFscGhhICogMjU1KVxuICAgICAgICAudG9TdHJpbmcoMTYpXG4gICAgICAgIC5wYWRTdGFydCgyLCAnMCcpXG4gICAgKS50b1VwcGVyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHdpZHRoIGFuZCBoZWlnaHQgc3RyaW5nIGZyb20gc2l6ZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHNpemUgLSBpbnB1dCBzaXplIGFzIHNpbmdsZSBvciB0d28gZGltZW5zaW9uc1xuICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gcmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHdpdGggYW5kIGhlaWdodFxuICAgKi9cbiAgZ2VuZXJhdGVXaWR0aEFuZEhlaWdodEZyb21TaXplKHNpemU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlcltdIHtcbiAgICAvKiogIGNvbnZlcnQgc2luZ2xlIGRpbWVuc2lvbiBpbnRvIHdpZHRoIHggaGVpZ2h0ICovXG5cbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihzaXplKSB8fCAodHlwZW9mIHNpemUgPT09ICdzdHJpbmcnICYmIC9eWzAtOV0rJC8udGVzdChzaXplKSkpIHtcbiAgICAgIHNpemUgPSBTdHJpbmcoYCR7c2l6ZX14JHtzaXplfWApO1xuICAgIH1cblxuICAgIC8qKiAgaWYgdGhlIHZhbHVlIGlzIG11bHRpZGltZW5zaW9uYWwsIGFkZCB0byBzaXplcyAqL1xuICAgIGlmICh0eXBlb2Ygc2l6ZSA9PT0gJ3N0cmluZycgJiYgL15bMC05XSt4WzAtOV0rJC8udGVzdChzaXplKSkge1xuICAgICAgcmV0dXJuIHNpemUuc3BsaXQoJ3gnKS5tYXAoKHYpID0+IE51bWJlcih2KSk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNpemUgJHtzaXplfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmUgdGFyZ2V0IHBhdGggZnJvbSBvcHRpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gb3B0aW9ucyAtIHRhcmdldCBwYXRoIG9wdGlvbnNcbiAgICogQHJldHVybnMge3N0cmluZ30gLSB0YXJnZXQgZmlsZXBhdGhcbiAgICovXG4gIGdlbmVyYXRlVGFyZ2V0RmlsZXBhdGhGcm9tT3B0aW9ucyhvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgICBjb25zdCB0ZW1wT3B0aW9ucyA9IHRoaXMuY2xvbmUob3B0aW9ucyB8fCB7fSk7XG4gICAgY29uc3Qgd2lkdGggPSB0ZW1wT3B0aW9ucy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0ZW1wT3B0aW9ucy5oZWlnaHQ7XG5cbiAgICBkZWxldGUgdGVtcE9wdGlvbnMud2lkdGg7XG4gICAgZGVsZXRlIHRlbXBPcHRpb25zLmhlaWdodDtcbiAgICBkZWxldGUgdGVtcE9wdGlvbnMuaG9va3M7XG4gICAgZGVsZXRlIHRlbXBPcHRpb25zLm5hbWU7XG5cbiAgICAvKiogY2hhbmdlIGhhc2hlcyB0byBlbnN1cmUgY2hhbmdlZCBpbWFnZXMgYXJlIHNhdmVkIGluIHNlcGFyYXRlIGhhc2hlZCBmb2xkZXJzICovXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmhvb2tzID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKG9wdGlvbnMuaG9va3MucG9zdFJlc2l6ZSkge1xuICAgICAgICB0ZW1wT3B0aW9ucy5wb3N0UmVzaXplID0gb3B0aW9ucy5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuaG9va3MucHJlUmVzaXplKSB7XG4gICAgICAgIHRlbXBPcHRpb25zLnByZVJlc2l6ZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkaXJuYW1lID0gSlNPTi5zdHJpbmdpZnkodGVtcE9wdGlvbnMpO1xuXG4gICAgLyoqICBoYXNoIGlzIGNyZWF0ZWQgYmFzZWQgdXBvbiB0aGUgb3B0aW9ucyBzdXBwbGllZCAoZXhjbHVkaW5nIHdpZHRoIGFuZCBoZWlnaHQpICovXG4gICAgcmV0dXJuIHRoaXMucGF0aCgpLmpvaW4odGhpcy5jcmVhdGVIYXNoKGRpcm5hbWUpLCBgJHt3aWR0aH14JHtoZWlnaHR9YCk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGEgaGFzaCB0byBiZSB1c2VkIGFzIGZvbGRlciBuYW1lIGJhc2VkIHVwb24gZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YSAtIHRoZSBkYXRhIHN0cmluZyB0byBiZSBoYXNoZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiBoYXNoIChpbiBieXRlcylcbiAgICogQHJldHVybnMge3N0cmluZ30gLSBvdXRwdXQgaGFzaFxuICAgKi9cbiAgY3JlYXRlSGFzaChkYXRhOiBzdHJpbmcsIGxlbiA9IDQpOiBzdHJpbmcge1xuICAgIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hha2UyNTYnLCB7IG91dHB1dExlbmd0aDogbGVuIH0pLnVwZGF0ZShkYXRhKS5kaWdlc3QoJ2hleCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvcHRpb25zIGZvciBpbWFnZSBwcm9jZXNzb3JcbiAgICpcbiAgICogQHBhcmFtIHtrZXlvZiBJY29uek9wdGlvbnN9IG5hbWUgLSBrZXkgb2YgdGhlIEljb256T3B0aW9ucyBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIGlmIHRoZSBvcHRpb25zIGFyZSB0byBiZSBjbG9uZWRcbiAgICogQHJldHVybnMge1Byb21pc2U8SWNvbnpJbnB1dE9wdGlvbnN8SWNvbnpSZXNpemVPcHRpb25zfEljb256T3V0cHV0T3B0aW9uc3x1bmRlZmluZWQ+fSAtIHJldHVybnMgSWNvbnpPcHRpb25zIG9iamVjdFxuICAgKi9cbiAgZ2V0T3B0aW9uczxUPihuYW1lOiBrZXlvZiBJY29uek9wdGlvbnMsIGNsb25lPzogYm9vbGVhbik6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8qKiAgZ2V0IG9wdGlvbnMgb3IgY2FsbGJhY2sgKi9cbiAgICAgICAgICBjb25zdCBvcHRpb25zID0gPFQgfCB1bmRlZmluZWQ+KFxuICAgICAgICAgICAgKHRoaXMuX2NvbmZpZy5vcHRpb25zICYmIHRoaXMuX2NvbmZpZy5vcHRpb25zW25hbWVdID8gdGhpcy5fY29uZmlnLm9wdGlvbnNbbmFtZV0gOiB1bmRlZmluZWQpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8qKiAgZ2V0IG9wdGlvbnMgb3IgY2FsbGJhY2sgcmVzdWx0cyAqL1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nID8gYXdhaXQgb3B0aW9ucyA6IG9wdGlvbnM7XG5cbiAgICAgICAgICByZXNvbHZlKGNsb25lID09PSBmYWxzZSA/IHJlc3VsdCA6IHJlc3VsdCA/IHRoaXMuY2xvbmU8VD4ocmVzdWx0KSA6IHVuZGVmaW5lZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgSW5wdXQgb3B0aW9ucyBmb3Igc2hhcnBcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIGlmIHRoZSBvcHRpb25zIGFyZSB0byBiZSBjbG9uZWRcbiAgICogQHJldHVybnMge1Byb21pc2U8SWNvbnpJbnB1dE9wdGlvbnN8dW5kZWZpbmVkPn0gLSBJY29ueklucHV0T3B0aW9ucyBvYmplY3RcbiAgICovXG4gIGdldElucHV0T3B0aW9uczxUIGV4dGVuZHMgSWNvbnpJbnB1dE9wdGlvbnM+KGNsb25lPzogYm9vbGVhbik6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmdldE9wdGlvbnM8VD4oJ2lucHV0JywgY2xvbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBPdXRwdXQgb3B0aW9ucyBmb3Igc2hhcnBcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjbG9uZSAtIGlmIHRoZSBvcHRpb25zIGFyZSB0byBiZSBjbG9uZWRcbiAgICogQHJldHVybnMge1Byb21pc2U8SWNvbnpPdXRwdXRPcHRpb25zfHVuZGVmaW5lZD59IC0gSWNvbnpPdXRwdXRPcHRpb25zIG9iamVjdFxuICAgKi9cbiAgZ2V0T3V0cHV0T3B0aW9uczxUIGV4dGVuZHMgSWNvbnpPdXRwdXRPcHRpb25zPihjbG9uZT86IGJvb2xlYW4pOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRPcHRpb25zPFQ+KCdvdXRwdXQnLCBjbG9uZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IFJlc2l6ZSBvcHRpb25zIGZvciBzaGFycFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNsb25lIC0gaWYgdGhlIG9wdGlvbnMgYXJlIHRvIGJlIGNsb25lZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxJY29uelJlc2l6ZU9wdGlvbnN8dW5kZWZpbmVkPn0gLSBJY29uelJlc2l6ZU9wdGlvbnMgb2JqZWN0XG4gICAqL1xuICBnZXRSZXNpemVPcHRpb25zPFQgZXh0ZW5kcyBJY29uelJlc2l6ZU9wdGlvbnM+KGNsb25lPzogYm9vbGVhbik6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmdldE9wdGlvbnM8VD4oJ3Jlc2l6ZScsIGNsb25lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwcmVwYXJlIGFic29sdXRlIHBhdGhcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvbGRlciAtIGlucHV0IHBhdGhcbiAgICogQHJldHVybnMge3N0cmluZ30gLSByZXN1bHRpbmcgYWJzb2x1dGUgcGF0aFxuICAgKi9cbiAgYWJzb2x1dGVGb2xkZXJQYXRoKGZvbGRlcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcblxuICAgIGlmICh0aGlzLmlzUmVsYXRpdmVQYXRoKGZvbGRlcikpIHtcbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpdmVQYXRoKHRoaXMuX2NvbmZpZy5mb2xkZXIpKSB7XG4gICAgICAgIHBhcnRzLnB1c2gocHJvY2Vzcy5jd2QoKSk7XG4gICAgICB9XG4gICAgICBwYXJ0cy5wdXNoKHRoaXMuX2NvbmZpZy5mb2xkZXIpO1xuICAgIH1cblxuICAgIHBhcnRzLnB1c2goZm9sZGVyKTtcblxuICAgIHJldHVybiB0aGlzLnBhdGgoKS5yZXNvbHZlKHRoaXMucGF0aCgpLmpvaW4oLi4ucGFydHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGRhdGUgdG8gYSBkYXRlIG9iamVjdCB0byBiZSB1c2VkIHdpdGggcGFyc2VyXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSAtIGRhdGUgdG8gY29udmVydCB0byBvYmplY3RcbiAgICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsYW55Pn0gLSBkYXRlIG9iamVjdFxuICAgKi9cbiAgc3RhdGljIGRhdGVUb09iamVjdChkYXRlPzogRGF0ZSk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGRhdGUgPz89IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZGF0ZVBhcnRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgeWVhcjogU3RyaW5nKGRhdGUuZ2V0RnVsbFllYXIoKSksXG4gICAgICBtb250aDogKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpLFxuICAgICAgZGF5OiAoJzAnICsgZGF0ZS5nZXREYXRlKCkpLnNsaWNlKC0yKSxcbiAgICAgIGhvdXI6ICgnMCcgKyBkYXRlLmdldEhvdXJzKCkpLnNsaWNlKC0yKSxcbiAgICAgIG1pbnV0ZTogKCcwJyArIGRhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMiksXG4gICAgICBzZWNvbmQ6ICgnMCcgKyBkYXRlLmdldFNlY29uZHMoKSkuc2xpY2UoLTIpLFxuICAgICAgbWlsbGlzZWNvbmQ6ICgnMDAnICsgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSkuc2xpY2UoLTMpLFxuICAgICAgZXBvY2g6IFN0cmluZyhkYXRlLmdldFRpbWUoKSksXG4gICAgICBvZmZzZXQ6IFN0cmluZyhkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkpLFxuICAgICAgZG93OiBTdHJpbmcoZGF0ZS5nZXREYXkoKSArIDEpLFxuICAgIH07XG4gICAgZGF0ZVBhcnRzLmRhdGUgPSBgJHtkYXRlUGFydHMueWVhcn0ke2RhdGVQYXJ0cy5tb250aH0ke2RhdGVQYXJ0cy5kYXl9YDtcbiAgICBkYXRlUGFydHMudGltZSA9IGAke2RhdGVQYXJ0cy5ob3VyfSR7ZGF0ZVBhcnRzLm1pbnV0ZX0ke2RhdGVQYXJ0cy5zZWNvbmR9YDtcbiAgICBkYXRlUGFydHMubXRpbWUgPSBgJHtkYXRlUGFydHMudGltZX0ke2RhdGVQYXJ0cy5taWxsaXNlY29uZH1gO1xuICAgIGRhdGVQYXJ0cy5kYXRlbXRpbWUgPSBgJHtkYXRlUGFydHMuZGF0ZX0ke2RhdGVQYXJ0cy5tdGltZX1gO1xuICAgIGRhdGVQYXJ0cy5kYXRldGltZSA9IGAke2RhdGVQYXJ0cy5kYXRlfSR7ZGF0ZVBhcnRzLnRpbWV9YDtcbiAgICByZXR1cm4gZGF0ZVBhcnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmUgYWxsIGltYWdlcyByZWFkeSBmb3IgaWNvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8SWNvbnpSZXBvcnQ+fSAtIEljb256IFJlcG9ydFxuICAgKi9cbiAgYXN5bmMgcHJlcGFyZUFsbFNpemVkSW1hZ2VzKCk6IFByb21pc2U8SWNvbnpSZXBvcnQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvKiogIHJlYWQgc291cmNlIGltYWdlICovXG4gICAgICAgICAgbGV0IGltZyA9IHNoYXJwKFxuICAgICAgICAgICAgLyoqIGlmIGl0J3MgYW4gaWNvbiwgdXNlIGljb1RvUG5nIHRvIGNvbnZlcnQgaW50byBhIGJ1ZmZlciBiZWZvcmUgcGFzc2luZyB0byBzaGFycCAqL1xuICAgICAgICAgICAgdGhpcy5wYXRoKCkuZXh0bmFtZSh0aGlzLl9jb25maWcuc3JjKSA9PT0gJy5pY28nXG4gICAgICAgICAgICAgID8gYXdhaXQgaWNvVG9QbmcoZnMucmVhZEZpbGVTeW5jKHRoaXMuX2NvbmZpZy5zcmMpLCAxMDI0KVxuICAgICAgICAgICAgICA6IHRoaXMuX2NvbmZpZy5zcmMsXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdldElucHV0T3B0aW9ucygpLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvKiogcHJlcGFyZSBwYXJzZXIgdmFyaWFibGVzIGZyb20gb3JpZ2luYWwgaW1hZ2UsIGFsb25nIHdpdGggZGF0ZS90aW1lICovXG4gICAgICAgICAgdGhpcy5fcGFyc2VyVmFsdWVzID0ge1xuICAgICAgICAgICAgbWV0YTogYXdhaXQgaW1nLm1ldGFkYXRhKCksXG4gICAgICAgICAgICBzdGF0czogYXdhaXQgaW1nLnN0YXRzKCksXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8qKiBsb29wIHRocm91Z2ggYWxsIGFjdGlvbnMgYmVmb3JlIGNsb25pbmcgKi9cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl9jb25maWcuYWN0aW9ucykpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2NvbmZpZy5hY3Rpb25zKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFjdGlvbjogSWNvbnpJbWFnZUFjdGlvbiA9IHRoaXMuX2NvbmZpZy5hY3Rpb25zW2tleV07XG4gICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBpbWcgPSBpbWdbYWN0aW9uLmNtZF0oLi4uYWN0aW9uLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qKiAgY3JlYXRlIHRlbXBvcmFyeSBmb2xkZXIgaWYgbmVlZGVkICovXG4gICAgICAgICAgY29uc3QgdGVtcEZvbGRlciA9IHRoaXMuYWJzb2x1dGVGb2xkZXJQYXRoKFxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRtcEZvbGRlciB8fCBmcy5ta2R0ZW1wU3luYyh0aGlzLnBhdGgoKS5qb2luKG9zLnRtcGRpcigpLCAnaWNvbnotJykpLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvKiogIGluc3RhbnRpYXRlIHJlcG9ydCAqL1xuICAgICAgICAgIGNvbnN0IGltYWdlUmVwb3J0OiBJY29uelJlcG9ydCA9IHtcbiAgICAgICAgICAgIHRtcDoge30sXG4gICAgICAgICAgICBpY286IHt9LFxuICAgICAgICAgICAgaWNuczoge30sXG4gICAgICAgICAgICBwbmc6IHt9LFxuICAgICAgICAgICAganBlZzoge30sXG4gICAgICAgICAgICBmYWlsZWQ6IHt9LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBvdXRwdXRPcHRpb25zID0gYXdhaXQgdGhpcy5nZXRPdXRwdXRPcHRpb25zKCk7XG5cbiAgICAgICAgICAvKiogZ2V0IGZpbGUgb3V0cHV0IHR5cGUgKi9cbiAgICAgICAgICBjb25zdCBvdXRwdXRGb3JtYXQgPSAob3V0cHV0T3B0aW9ucyAmJiBvdXRwdXRPcHRpb25zLmZvcm1hdCkgfHwgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKEljb256T3V0cHV0VHlwZXMuaW5kZXhPZihvdXRwdXRGb3JtYXQpID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT3V0cHV0IGZvcm1hdCBpcyBpbnZhbGlkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgY2hvc2VuT3B0aW9ucyA9IDxJY29uelBuZ09wdGlvbnMgfCBJY29uekpwZWdPcHRpb25zPm91dHB1dE9wdGlvbnMuZm9ybWF0c1tvdXRwdXRGb3JtYXRdO1xuXG4gICAgICAgICAgLyoqICBtZXJnZSBhbGwgc2l6ZXMgZnJvbSBjb25maWd1cmF0aW9uICovXG4gICAgICAgICAgZm9yIChjb25zdCBbbmFtZSwgY29uZmlnXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLl9jb25maWcuaWNvbnMpKSB7XG4gICAgICAgICAgICAvKiogIHNraXAgaWYgdGhlIGNvbmZpZyBoYXMgYmVlbiBkaXNhYmxlZCAqL1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBzaXplcywgYW5kIGl0J3MgYSBzdGF0aWMgaW1hZ2UsIGl0IG11c3QgaGF2ZSBhIGR5bmFtaWMgZmllbGQgKi9cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY29uZmlnLnNpemVzLmxlbmd0aCA+IDEgJiZcbiAgICAgICAgICAgICAgIVsnaWNucycsICdpY28nXS5pbmNsdWRlcyhjb25maWcudHlwZSkgJiZcbiAgICAgICAgICAgICAgLyoqIGNoZWNrIGlmIG9uZSBvZiB0aGUga2V5IHZhcmlhYmxlcyBhcmUgYmVpbmcgdXNlZCAqL1xuICAgICAgICAgICAgICAhWydkaW1zJywgJ3dpZHRoJywgJ2hlaWdodCcsICdzaXplJywgJ2RhdGV0aW1lJywgJ2RhdGVtdGltZScsICdtdGltZScsICdjb3VudGVyJywgJ21pbGxpc2Vjb25kJ10uc29tZShcbiAgICAgICAgICAgICAgICAodikgPT4gY29uZmlnLm5hbWUuaW5jbHVkZXMoYHt7JHt2fX19YCksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYEljb25zIGNvbmZpZyAnJHtuYW1lfScgaGFzIG1vcmUgdGhhbiBvbmUgc2l6ZS4gVHJ5IGNoYW5naW5nIGl0IHRvICR7bmFtZX0te3tkaW1zfX0gb3IgJHtuYW1lfS17e2NvdW50ZXJ9fS5gLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHJlc3BvbnNlIG9mIHRoaXMuY29uZmlnVG9PcHRpb25zKGNvbmZpZywgdGVtcEZvbGRlciwgeyBuYW1lIH0pKSB7XG4gICAgICAgICAgICAgIC8qKiAgY2hlY2sgZm9yIGludmFsaWQgaWNvbiBkaW1lbnNpb25zICovXG4gICAgICAgICAgICAgIGlmIChbJ2ljbycsICdpY25zJ10uaW5jbHVkZXMoY29uZmlnLnR5cGUpICYmIHJlc3BvbnNlLm9wdGlvbnMud2lkdGggIT09IHJlc3BvbnNlLm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbmZpZyBmb3IgJHtuYW1lfSwgaWNvbiBkaW1lbnNpb25zIG11c3QgaGF2ZSBhIDE6MSByYXRpb2ApO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLyoqICBpZiBpbWFnZSBoYXNuJ3QgYmVlbiBjcmVhdGVkIGJlZm9yZSwgZ2VuZXJhdGUgaXQuICovXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgaW1hZ2VSZXBvcnQudG1wW3Jlc3BvbnNlLnRhcmdldF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLyoqICBjcmVhdGUgZm9sZGVyIGZpcnN0ICovXG4gICAgICAgICAgICAgICAgY29uc3QgZGlybmFtZSA9IHRoaXMucGF0aCgpLmRpcm5hbWUocmVzcG9uc2UudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlybmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhkaXJuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiogIGNsb25lIHRoZSBpbWFnZSAqL1xuICAgICAgICAgICAgICAgIGxldCBjbG9uZSA9IGltZy5jbG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgLyoqICBwcmUtcmVzaXplIGhvb2sgKi9cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmhvb2tzICYmIGNvbmZpZy5ob29rcy5wcmVSZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgIGNsb25lID0gYXdhaXQgY29uZmlnLmhvb2tzLnByZVJlc2l6ZSh0aGlzLCBjbG9uZSwgcmVzcG9uc2Uub3B0aW9ucywgcmVzcG9uc2UudGFyZ2V0LCBpbWFnZVJlcG9ydCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqICByZXNpemUgYW5kIHNldCBhcyBjaG9zZW4gZm9ybWF0ICovXG4gICAgICAgICAgICAgICAgY2xvbmUucmVzaXplKHJlc3BvbnNlLm9wdGlvbnMpW291dHB1dEZvcm1hdF0oY2hvc2VuT3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvKiogIHBvc3QtcmVzaXplIGhvb2sgKi9cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmhvb2tzICYmIGNvbmZpZy5ob29rcy5wb3N0UmVzaXplKSB7XG4gICAgICAgICAgICAgICAgICBjbG9uZSA9IGF3YWl0IGNvbmZpZy5ob29rcy5wb3N0UmVzaXplKHRoaXMsIGNsb25lLCByZXNwb25zZS5vcHRpb25zLCByZXNwb25zZS50YXJnZXQsIGltYWdlUmVwb3J0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiogIGNvbnZlcnQgdG8gYnVmZmVyLCB0aGVuIG91dHB1dCAqL1xuICAgICAgICAgICAgICAgIGF3YWl0IGNsb25lXG4gICAgICAgICAgICAgICAgICAudG9CdWZmZXIoKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oKGRhdGE6IEJ1ZmZlci5CdWZmZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhyZXNwb25zZS50YXJnZXQsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvKiogIHN0b3JlIGltYWdlIHBhdGggd2l0aCBzZXR0aW5ncyB0byByZXBvcnQgKi9cbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VSZXBvcnQudG1wW3Jlc3BvbnNlLnRhcmdldF0gPSByZXNwb25zZS5vcHRpb25zO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8qKiAgd3JpdGUgZXJyb3IgdG8gcmVwb3J0ICovXG4gICAgICAgICAgICAgICAgICAgIGltYWdlUmVwb3J0LmZhaWxlZFtyZXNwb25zZS50YXJnZXRdID0gZXJyLm1lc3NhZ2UgfHwgJ3Vua25vd24gZXJyb3InO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLyoqICByZXR1cm4gaW1hZ2UgcmVwb3J0IHdpdGggc2V0dGluZ3MgYXBwbGllZCAqL1xuICAgICAgICAgIHJlc29sdmUoaW1hZ2VSZXBvcnQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY29udmVydCBjb25maWd1cmF0aW9uIGludG8gb3B0aW9ucyBhbmQgdGFyZ2V0IGZvbGRlciBuYW1lIGZvciB0ZW1wIGZvbGRlclxuICAgKlxuICAgKiBAcGFyYW0ge0ljb256Q29uZmlnfSBjb25maWcgLSBDb25maWd1cmF0aW9uIE9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVBhdGggLSBiYXNlIHBhdGhcbiAgICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBhZGRpdGlvbmFsQXJncyAtIGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gICAqIEB5aWVsZHMge3t0YXJnZXQ6IHN0cmluZywgb3B0aW9uczogSWNvbnpSZXNpemVPcHRpb25zfX0gLSBvYmplY3Qgb2Ygb3B0aW9uc1xuICAgKi9cbiAgYXN5bmMgKmNvbmZpZ1RvT3B0aW9ucyhcbiAgICBjb25maWc6IEljb256Q29uZmlnLFxuICAgIGJhc2VQYXRoPzogc3RyaW5nLFxuICAgIGFkZGl0aW9uYWxBcmdzPzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgKTogQXN5bmNHZW5lcmF0b3I8eyB0YXJnZXQ6IHN0cmluZzsgb3B0aW9uczogSWNvbnpSZXNpemVPcHRpb25zIH0+IHtcbiAgICAvKiogIGVuc3VyZSBzcGVjaWZpYyBzZXR0aW5ncyBhcmUgc2V0IGJ5IGRlZmF1bHQgKi9cblxuICAgIC8qKiAgcHJlcGFyZSBkZWZhdWx0IHNldHRpbmdzIGZvciBpbWFnZSByZXNpemUgKi9cbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogSWNvbnpSZXNpemVPcHRpb25zID0gYXdhaXQgdGhpcy5nZXRSZXNpemVPcHRpb25zKCk7XG5cbiAgICBjb25zdCBvdXRwdXRPcHRpb25zOiBJY29uek91dHB1dE9wdGlvbnMgPSBhd2FpdCB0aGlzLmdldE91dHB1dE9wdGlvbnMoKTtcblxuICAgIC8qKiAgbG9vcCB0aHJvdWdoIGltYWdlcyBhbmQgcHJlcGFyZSBwbmcgZmlsZXMgKi9cbiAgICBmb3IgKGNvbnN0IHNpemUgb2YgY29uZmlnLnNpemVzKSB7XG4gICAgICAvKiogIGdldCBkaW1lbnNpb25zICovXG4gICAgICBjb25zdCBbd2lkdGgsIGhlaWdodF0gPSB0aGlzLmdlbmVyYXRlV2lkdGhBbmRIZWlnaHRGcm9tU2l6ZShzaXplKTtcblxuICAgICAgLyoqICBnZW5lcmF0ZSBzZXR0aW5ncyBmb3IgaW1hZ2UgcmVzaXplICovXG4gICAgICBjb25zdCBvcHRpb25zOiBJY29uelJlc2l6ZU9wdGlvbnMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAuLi57XG4gICAgICAgICAgd2lkdGg6IE51bWJlcih3aWR0aCksXG4gICAgICAgICAgaGVpZ2h0OiBOdW1iZXIoaGVpZ2h0KSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIC8qKiAgY3JlYXRlIHVuaXF1ZSBpbWFnZSBuYW1lIGJhc2VkIHVwb24gc2V0dGluZ3MgKi9cbiAgICAgIGNvbnN0IGltYWdlUGF0aCA9IHRoaXMuZ2VuZXJhdGVUYXJnZXRGaWxlcGF0aEZyb21PcHRpb25zKHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgLi4uKGFkZGl0aW9uYWxBcmdzID8/IHt9KSxcbiAgICAgICAgLi4ue1xuICAgICAgICAgIC8qKiBpZiBob29rcyBleGlzdCwgYWxsb3cgaGFzaGVzIHRvIGNoYW5nZSB0byByZWZsZWN0IGNoYW5nZS4gKi9cbiAgICAgICAgICBob29rczogY29uZmlnLmhvb2tzLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8qKiAgdGFyZ2V0IGltYWdlIG5hbWUgKi9cbiAgICAgIGNvbnN0IHRhcmdldCA9IGAke2Jhc2VQYXRoID8gdGhpcy5wYXRoKCkuam9pbihiYXNlUGF0aCwgaW1hZ2VQYXRoKSA6IGltYWdlUGF0aH0uJHtcbiAgICAgICAgb3V0cHV0T3B0aW9ucy5mb3JtYXQgPT09ICdqcGVnJyA/ICdqcGcnIDogb3V0cHV0T3B0aW9ucy5mb3JtYXRcbiAgICAgIH1gO1xuXG4gICAgICB5aWVsZCB7XG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdXNlZCB0byBmaW5kIHJlbGF0aXZlIGZpbGUgcGF0aHNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1YnN0ciAtIHN1YnN0cmluZyB0byBzZWFyY2ggZm9yXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFyciAtIHRoaXMgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0byBzZWFyY2ggaW5cbiAgICogQHJldHVybnMge3N0cmluZ1tdfSAtIGEgbGlzdCBvZiBzdHJpbmdzIHRoYXQgaGF2ZSBzdWJzdHJpbmcgaW4gdGhlbVxuICAgKi9cbiAgc2VhcmNoQXJyYXlGb3JTdWJzdHJpbmcoc3Vic3RyOiBzdHJpbmcsIGFycjogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGFycikge1xuICAgICAgaWYgKGl0ZW0ubGFzdEluZGV4T2Yoc3Vic3RyKSA9PT0gaXRlbS5sZW5ndGggLSBzdWJzdHIubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIG5lc3RlZCB2YWx1ZSBieSBwYXRoXG4gICAqXG4gICAqIEBwYXJhbSB7UmVjb3JkPGFueSwgYW55Pn0gbmVzdGVkT2JqZWN0IC0gb2JqZWN0IHRvIGJlIHNlYXJjaGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoU3RyaW5nIC0gcGF0aCB0byBzZWFyY2hcbiAgICogQHJldHVybnMgeyp9IC0gcmV0dXJucyBhbnkgdHlwZVxuICAgKi9cbiAgc3RhdGljIGdldE5lc3RlZEJ5UGF0aChuZXN0ZWRPYmplY3Q6IFJlY29yZDxhbnksIGFueT4sIHBhdGhTdHJpbmc6IHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgcGF0aEFycmF5ID0gdGhpcy5pc1ZhbGlkUGF0aChwYXRoU3RyaW5nKSA/IHBhdGhTdHJpbmcuc3BsaXQoJy4nKSA6IFtdO1xuICAgIHJldHVybiBwYXRoQXJyYXkucmVkdWNlKFxuICAgICAgKG9iamVjdDogYW55LCBrZXk6IGFueSkgPT4gKG9iamVjdCAmJiBvYmplY3Rba2V5XSAhPT0gJ3VuZGVmaW5lZCcgPyBvYmplY3Rba2V5XSA6IHVuZGVmaW5lZCksXG4gICAgICBuZXN0ZWRPYmplY3QsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZW5lcmF0ZSBhIGJsYW5rIHJlcG9ydFxuICAgKlxuICAgKiBAcmV0dXJucyB7SWNvbnpSZXBvcnR9IC0gZW1wdHkgcmVwb3J0XG4gICAqL1xuICBzdGF0aWMgbmV3UmVwb3J0KCk6IEljb256UmVwb3J0IHtcbiAgICByZXR1cm4ge1xuICAgICAgdG1wOiB7fSxcbiAgICAgIGljbzoge30sXG4gICAgICBpY25zOiB7fSxcbiAgICAgIHBuZzoge30sXG4gICAgICBqcGVnOiB7fSxcbiAgICAgIGZhaWxlZDoge30sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0byBjaGVjayBpZiBkb3QgYmFzZWQgb2JqZWN0IHBhdGggaXMgdmFsaWRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBkb3QgYmFzZWQgb2JqZWN0IHBhdGhcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gaWYgcGF0aCBpcyB2YWxpZFxuICAgKi9cbiAgc3RhdGljIGlzVmFsaWRQYXRoKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvKFtBLVpfYS16XVxcdyopKFxcLltBLVpfYS16XVxcdyopKi8udGVzdChwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJzZSB0ZW1wbGF0ZSB3aXRoIHt7dmFyaWFibGV9fSBoYW5kbGViYXJzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZSAtIHRlbXBsYXRlIHRvIHBhcnNlXG4gICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gdmFsdWVzIC0gb2JqZWN0IGNvbnRhaW5pbmcga2V5IHZhbHVlIHBhaXJzXG4gICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gcmVtb3ZlVW5kZWZpbmVkIC0gdG8gcmVtb3ZlIGhhbmRsZWJhcnMgaWYgbm90IGZvdW5kXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gcGFyc2VkIHN0cmluZ1xuICAgKi9cbiAgcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZTogc3RyaW5nLCB2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIHJlbW92ZVVuZGVmaW5lZCA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICAvKiogY29weSB0ZW1wbGF0ZSB0byBvdXRwdXQgKi9cbiAgICBsZXQgb3V0cHV0ID0gdGVtcGxhdGU7XG5cbiAgICAvKiogUmVnZXggZm9yIGhhbmRsZWJhcnMgKi9cbiAgICBjb25zdCByID0gbmV3IFJlZ0V4cCgne3soW159XSopfX0nLCAnZ20nKTtcbiAgICBmb3IgKGxldCBhOyAoYSA9IHIuZXhlYyh0ZW1wbGF0ZSkpICE9PSBudWxsOyApIHtcbiAgICAgIC8qKiByZXRyaWV2ZSBuZXN0ZWQgdmFsdWUgYmFzZWQgdXBvbiBjb250ZW50IG9mIGhhbmRsZWJhcnMgKi9cbiAgICAgIGNvbnN0IHZhbCA9IEljb256LmdldE5lc3RlZEJ5UGF0aCh2YWx1ZXMsIGFbMV0pO1xuXG4gICAgICAvKiogaWYgbm8gdmFsdWUgaGFzIGJlZW4gZm91bmQsIHRoZW4gcmVtb3ZlIGlmIGNob3NlbiAqL1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkICYmIHJlbW92ZVVuZGVmaW5lZCkge1xuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShhWzBdLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiogaWYgdGhlIGl0ZW0gaXNuJ3QgYSBudW1iZXIsIHN0cmluZyBvciBib29sZWFuLCBlaXRoZXIgbGVhdmUgdGhlIGhhbmRsZWJhcnMsIG9yIGxlYXZlIGJsYW5rICovXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKFxuICAgICAgICAgIFN0cmluZyhhWzBdKSxcbiAgICAgICAgICBbJ2JpZ2ludCcsICdudW1iZXInLCAnc3RyaW5nJywgJ2Jvb2xlYW4nXS5pbmNsdWRlcyh0eXBlb2YgdmFsKVxuICAgICAgICAgICAgPyBTdHJpbmcodmFsKVxuICAgICAgICAgICAgOiByZW1vdmVVbmRlZmluZWRcbiAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgIDogU3RyaW5nKGFbMF0pLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIGxhcmdlc3Qgc2l6ZSBhcyBhbiBvYmplY3QuIFRvIGJlIHVzZWQgd2hlbiBwYXJzaW5nIG91dHB1dCBmaWxlbmFtZVxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKVtdfSBzaXplcyAtIEFycmF5IG9mIHNpemVzXG4gICAqIEByZXR1cm5zIHt7IHNpemU6IHN0cmluZywgd2lkdGg6IHN0cmluZywgaGVpZ2h0OiBzdHJpbmcsIGRpbXM6IHN0cmluZyB9fSAtIG9iamVjdCBjb250YWluaW5nIHRoZSBkaW1lbnNpb25zXG4gICAqL1xuICBnZXRMYXJnZXN0U2l6ZShzaXplczogKHN0cmluZyB8IG51bWJlcilbXSk6IHsgc2l6ZTogc3RyaW5nOyB3aWR0aDogc3RyaW5nOyBoZWlnaHQ6IHN0cmluZzsgZGltczogc3RyaW5nIH0ge1xuICAgIGxldCBweCA9IDA7XG4gICAgbGV0IGRpbXM7XG5cbiAgICBpZiAodHlwZW9mIHNpemVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzaXplcyBub3QgZGVmaW5lZCcpO1xuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShzaXplcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2l6ZXMgbXVzdCBiZSBhbiBhcnJheScpO1xuICAgIH1cblxuICAgIGlmIChzaXplcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2l6ZXMgaXMgZW1wdHknKTtcbiAgICB9XG5cbiAgICAvKiogIGxvb3AgdGhyb3VnaCBzaXplcyBhbmQgcHJlcGFyZSBkaW1lbnNpb25hbCBvdXRwdXQgKi9cbiAgICBmb3IgKGNvbnN0IHNpemUgb2Ygc2l6ZXMpIHtcbiAgICAgIGNvbnN0IHRtcCA9XG4gICAgICAgIHR5cGVvZiBzaXplID09PSAnbnVtYmVyJyB8fCAodHlwZW9mIHNpemUgPT09ICdzdHJpbmcnICYmIHNpemUuaW5kZXhPZigneCcpID09PSAtMSlcbiAgICAgICAgICA/IFtTdHJpbmcoc2l6ZSksIFN0cmluZyhzaXplKV1cbiAgICAgICAgICA6IHNpemUuc3BsaXQoJ3gnKTtcbiAgICAgIGNvbnN0IHdpZHRoID0gTnVtYmVyKHRtcFswXSk7XG4gICAgICBjb25zdCBoZWlnaHQgPSBOdW1iZXIodG1wWzFdKTtcbiAgICAgIGlmICh3aWR0aCAqIGhlaWdodCA+IHB4KSB7XG4gICAgICAgIHB4ID0gd2lkdGggKiBoZWlnaHQ7XG4gICAgICAgIGRpbXMgPSB7XG4gICAgICAgICAgc2l6ZTogYCR7c2l6ZX1gLFxuICAgICAgICAgIHdpZHRoOiBgJHt3aWR0aH1gLFxuICAgICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fWAsXG4gICAgICAgICAgZGltczogYCR7d2lkdGh9eCR7aGVpZ2h0fWAsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkaW1zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzaXplIGZvdW5kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpbXM7XG4gIH1cblxuICAvKipcbiAgICogUHVsbHMgdGhlIGFwcHJvcHJpYXRlIGZpbGVzIGZyb20gdGhlIHJlcG9ydFxuICAgKlxuICAgKiBAcGFyYW0ge0ljb256Q29uZmlnfSBjb25maWcgLSBJY29ueiBDb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSB7SWNvbnpSZXBvcnR9IHJlcG9ydCAtIEljb256IFJlcG9ydFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx7b3V0cHV0RGlyOiBzdHJpbmcsIGNob3NlbkZpbGVzOiBzdHJpbmdbXX0+fSAtIFByb21pc2Ugd2l0aCBvdXRwdXQgZGlyZWN0b3J5IGFuZCBjaG9zZW4gZmlsZXNcbiAgICovXG4gIGFzeW5jIGdldENob3NlbkZpbGVzRm9ySWNvbihcbiAgICBjb25maWc6IEljb256Q29uZmlnLFxuICAgIHJlcG9ydDogSWNvbnpSZXBvcnQsXG4gICk6IFByb21pc2U8eyBvdXRwdXREaXI6IHN0cmluZzsgY2hvc2VuRmlsZXM6IHN0cmluZ1tdIH0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHJlcG9ydCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncGFyYW1ldGVycyBhcmUgbWlzc2luZycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qKiAgb3V0cHV0IGRpcmVjdG9yeSAqL1xuICAgICAgICAgIGxldCBvdXRwdXREaXI6IHN0cmluZztcblxuICAgICAgICAgIGlmIChjb25maWcuZm9sZGVyKSB7XG4gICAgICAgICAgICBvdXRwdXREaXIgPSB0aGlzLmlzUmVsYXRpdmVQYXRoKGNvbmZpZy5mb2xkZXIpXG4gICAgICAgICAgICAgID8gdGhpcy5wYXRoKCkuam9pbih0aGlzLl9jb25maWcuZm9sZGVyLCBjb25maWcuZm9sZGVyKVxuICAgICAgICAgICAgICA6IGNvbmZpZy5mb2xkZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dERpciA9IHRoaXMuYWJzb2x1dGVGb2xkZXJQYXRoKHRoaXMuX2NvbmZpZy5mb2xkZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qKiAgZ2V0IGFsbCBzdWNjZXNzZnVsbHkgZ2VuZXJhdGVkIGltYWdlcyAqL1xuICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZUZpbGVzID0gT2JqZWN0LmtleXMocmVwb3J0LnRtcCk7XG5cbiAgICAgICAgICBsZXQgY2hvc2VuRmlsZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAvKiogIGxvb3AgdGhyb3VnaCBlYWNoIGNvbmZpZ3VyYXRpb24gKHNpemUpIGFuZCBnZXQgYWxsIHRoZSByZWxldmFudCBpbWFnZXMgKi9cbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHJlc3BvbnNlIG9mIHRoaXMuY29uZmlnVG9PcHRpb25zKGNvbmZpZywgb3V0cHV0RGlyKSkge1xuICAgICAgICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IHJlc3BvbnNlO1xuXG4gICAgICAgICAgICAvKiogIGdldCBsYXN0IHR3byBzZWdtZW50cyBvZiBwYXRoICggaGFzaCArIGZpbGVuYW1lICkgKi9cbiAgICAgICAgICAgIGNvbnN0IFtoYXNoLCBmaWxlbmFtZV0gPSB0YXJnZXQuc3BsaXQodGhpcy5wYXRoKCkuc2VwKS5zbGljZSgtMik7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5wYXRoKCkuam9pbihoYXNoLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgICAgIC8qKiAgZ2V0IGFsbCByZWxldmFudCBmaWxlcyB0byBtZXJnZSBpbnRvIGljbyBmaWxlICovXG4gICAgICAgICAgICBjaG9zZW5GaWxlcyA9IFsuLi5jaG9zZW5GaWxlcywgLi4udGhpcy5zZWFyY2hBcnJheUZvclN1YnN0cmluZyhmaWxlLCBhdmFpbGFibGVGaWxlcyldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoeyBvdXRwdXREaXIsIGNob3NlbkZpbGVzIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgaWNvIGZpbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7SWNvbnpDb25maWd9IGNvbmZpZyAtIEljb256IENvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIHtJY29uelJlcG9ydH0gcmVwb3J0IC0gSWNvbnogUmVwb3J0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59IC0gUHJvbWlzZSB3aXRoIG5ldyBmaWxlbmFtZVxuICAgKi9cbiAgYXN5bmMgaWNvR2VuZXJhdG9yKGNvbmZpZzogSWNvbnpDb25maWcsIHJlcG9ydDogSWNvbnpSZXBvcnQpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHsgb3V0cHV0RGlyLCBjaG9zZW5GaWxlcyB9ID0gYXdhaXQgdGhpcy5nZXRDaG9zZW5GaWxlc0Zvckljb24oY29uZmlnLCByZXBvcnQpO1xuXG4gICAgICAgICAgLyoqICBpZiBpbWFnZXMgYXJlIGZvdW5kLCBwcmVwYXJlIGljbyBmaWxlICovXG4gICAgICAgICAgaWYgKGNob3NlbkZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLyoqIGdldCBwYXJzZXIgdmFyaWFibGVzIGZvciBuYW1lIHBhcnNlciAqL1xuICAgICAgICAgICAgY29uc3QgcGFyc2VyVmFsdWVzID0gdGhpcy5nZXRQYXJzZXJWYWx1ZXMoe1xuICAgICAgICAgICAgICAuLi50aGlzLmdldExhcmdlc3RTaXplKDxzdHJpbmdbXT5jb25maWcuc2l6ZXMpLFxuICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIHBhcnNlIGZpbGVuYW1lICovXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5wYXJzZVRlbXBsYXRlKGNvbmZpZy5uYW1lLCBwYXJzZXJWYWx1ZXMpO1xuXG4gICAgICAgICAgICAvKiogIGNyZWF0ZSBuZXcgZmlsZW5hbWUgKi9cbiAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGVuYW1lID0gdGhpcy5wYXRoKCkuam9pbihvdXRwdXREaXIsIGAke25hbWV9Lmljb2ApO1xuXG4gICAgICAgICAgICAvKiogY29udmVydCBwbmcgdG8gaWNvICovXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShcbiAgICAgICAgICAgICAgcG5nVG9JY28oY2hvc2VuRmlsZXMpLnRoZW4oKGJ1ZjogQnVmZmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZnMubWtkaXJTeW5jKHRoaXMucGF0aCgpLmRpcm5hbWUobmV3RmlsZW5hbWUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld0ZpbGVuYW1lLCBidWYpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdGaWxlbmFtZTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSBpY28nKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEljbnMgR2VuZXJhdG9yIChNYWNPUylcbiAgICpcbiAgICogQHBhcmFtIHtJY29uekNvbmZpZ30gY29uZmlnIC0gSWNvbnogQ29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0ge0ljb256UmVwb3J0fSByZXBvcnQgLSBJY29ueiBSZXBvcnRcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gLSBQcm9taXNlIHdpdGggbmV3IGZpbGVuYW1lXG4gICAqL1xuICBhc3luYyBpY25zR2VuZXJhdG9yKGNvbmZpZzogSWNvbnpDb25maWcsIHJlcG9ydDogSWNvbnpSZXBvcnQpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHsgb3V0cHV0RGlyLCBjaG9zZW5GaWxlcyB9ID0gYXdhaXQgdGhpcy5nZXRDaG9zZW5GaWxlc0Zvckljb24oY29uZmlnLCByZXBvcnQpO1xuICAgICAgICAgIC8qKiAgaWYgaW1hZ2VzIGFyZSBmb3VuZCwgcHJlcGFyZSBpY28gZmlsZSAqL1xuICAgICAgICAgIGlmIChjaG9zZW5GaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnNpb25NYXAgPSB7XG4gICAgICAgICAgICAgIGljMDc6ICcxMjh4MTI4JyxcbiAgICAgICAgICAgICAgaWMwODogJzI1NngyNTYnLFxuICAgICAgICAgICAgICBpYzA5OiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIGljMTA6ICcxMDI0eDEwMjQnLFxuICAgICAgICAgICAgICBpYzExOiAnMzJ4MzInLFxuICAgICAgICAgICAgICBpYzEyOiAnNjR4NjQnLFxuICAgICAgICAgICAgICBpYzEzOiAnMjU2eDI1NicsXG4gICAgICAgICAgICAgIGljMTQ6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBpY25zID0gbmV3IEljbnMoKTtcbiAgICAgICAgICAgIGxldCBidWYsIGltYWdlO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtvc1R5cGUsIHNpemVdIG9mIE9iamVjdC5lbnRyaWVzKGNvbnZlcnNpb25NYXApKSB7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBjaG9zZW5GaWxlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhdGgoKS5iYXNlbmFtZShmaWxlLCAnLnBuZycpID09PSBzaXplKSB7XG4gICAgICAgICAgICAgICAgICBidWYgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSk7XG4gICAgICAgICAgICAgICAgICBpbWFnZSA9IEljbnNJbWFnZS5mcm9tUE5HKGJ1ZiwgPE9TVHlwZT5vc1R5cGUpO1xuICAgICAgICAgICAgICAgICAgaWNucy5hcHBlbmQoaW1hZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiogZ2V0IHBhcnNlciB2YXJpYWJsZXMgZm9yIG5hbWUgcGFyc2VyICovXG4gICAgICAgICAgICBjb25zdCBwYXJzZXJWYWx1ZXMgPSB0aGlzLmdldFBhcnNlclZhbHVlcyh7XG4gICAgICAgICAgICAgIC4uLnRoaXMuZ2V0TGFyZ2VzdFNpemUoPHN0cmluZ1tdPmNvbmZpZy5zaXplcyksXG4gICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiogcGFyc2UgZmlsZW5hbWUgKi9cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnBhcnNlVGVtcGxhdGUoY29uZmlnLm5hbWUsIHBhcnNlclZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8qKiAgY3JlYXRlIG5ldyBmaWxlbmFtZSAqL1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsZW5hbWUgPSB0aGlzLnBhdGgoKS5qb2luKG91dHB1dERpciwgYCR7bmFtZX0uaWNuc2ApO1xuXG4gICAgICAgICAgICBmcy5ta2RpclN5bmModGhpcy5wYXRoKCkuZGlybmFtZShuZXdGaWxlbmFtZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhuZXdGaWxlbmFtZSwgaWNucy5kYXRhKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobmV3RmlsZW5hbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNyZWF0ZSBpY25zJyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQTkcgR2VuZXJhdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7SWNvbnpDb25maWd9IGNvbmZpZyAtIEljb256IENvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIHtJY29uelJlcG9ydH0gcmVwb3J0IC0gSWNvbnogUmVwb3J0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZ1tdPn0gLSBQcm9taXNlIHdpdGggbmV3IGZpbGVuYW1lc1xuICAgKi9cbiAgYXN5bmMgcG5nR2VuZXJhdG9yKGNvbmZpZzogSWNvbnpDb25maWcsIHJlcG9ydDogSWNvbnpSZXBvcnQpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgb3V0cHV0RmlsZXMgPSBbXTtcblxuICAgICAgICAgIGNvbnN0IHsgb3V0cHV0RGlyLCBjaG9zZW5GaWxlcyB9ID0gYXdhaXQgdGhpcy5nZXRDaG9zZW5GaWxlc0Zvckljb24oY29uZmlnLCByZXBvcnQpO1xuXG4gICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGNob3NlbkZpbGVzKSB7XG4gICAgICAgICAgICAvKiogIG9yaWdpbmFsIGZpbGUgY29uc2lzdHMgb2YgZGltZW5zaW9ucyAqL1xuICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSB0aGlzLnBhdGgoKS5iYXNlbmFtZShmaWxlLCAnLnBuZycpO1xuICAgICAgICAgICAgY29uc3QgZGltZW5zaW9ucyA9IGZpbGVuYW1lLnNwbGl0KCd4Jyk7XG5cbiAgICAgICAgICAgIC8qKiAgcmV0dXJucyBkaW1lbnNpb25zIG9iamVjdCBmb3IgcGFyc2VyICovXG4gICAgICAgICAgICBjb25zdCBwYXJzZXJWYWx1ZXMgPSB0aGlzLmdldFBhcnNlclZhbHVlcyh7XG4gICAgICAgICAgICAgIC4uLnRoaXMuZ2V0TGFyZ2VzdFNpemUoW2RpbWVuc2lvbnNbMF0gPT09IGRpbWVuc2lvbnNbMV0gPyBkaW1lbnNpb25zWzBdIDogZmlsZW5hbWVdKSxcbiAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnBhcnNlVGVtcGxhdGUoY29uZmlnLm5hbWUsIHBhcnNlclZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8qKiAgY3JlYXRlIG5ldyBmaWxlbmFtZSAqL1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsZW5hbWUgPSB0aGlzLnBhdGgoKS5qb2luKG91dHB1dERpciwgYCR7bmFtZX0ucG5nYCk7XG4gICAgICAgICAgICAvKiogIG1ha2UgZGlyZWN0b3J5IGZvciBpY29uICovXG4gICAgICAgICAgICBmcy5ta2RpclN5bmModGhpcy5wYXRoKCkuZGlybmFtZShuZXdGaWxlbmFtZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgLyoqICBjb3B5IGljb24gZnJvbSB0ZW1wb3JhcnkgaW1hZ2VzICovXG4gICAgICAgICAgICBmcy5jb3B5RmlsZVN5bmMoZmlsZSwgbmV3RmlsZW5hbWUpO1xuICAgICAgICAgICAgb3V0cHV0RmlsZXMucHVzaChuZXdGaWxlbmFtZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShvdXRwdXRGaWxlcyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKUEVHIEdlbmVyYXRvclxuICAgKlxuICAgKiBAcGFyYW0ge0ljb256Q29uZmlnfSBjb25maWcgLSBJY29ueiBDb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSB7SWNvbnpSZXBvcnR9IHJlcG9ydCAtIEljb256IFJlcG9ydFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmdbXT59IC0gUHJvbWlzZSB3aXRoIG5ldyBmaWxlbmFtZXNcbiAgICovXG4gIGFzeW5jIGpwZWdHZW5lcmF0b3IoY29uZmlnOiBJY29uekNvbmZpZywgcmVwb3J0OiBJY29uelJlcG9ydCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBvdXRwdXRGaWxlcyA9IFtdO1xuXG4gICAgICAgICAgY29uc3QgeyBvdXRwdXREaXIsIGNob3NlbkZpbGVzIH0gPSBhd2FpdCB0aGlzLmdldENob3NlbkZpbGVzRm9ySWNvbihjb25maWcsIHJlcG9ydCk7XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgY2hvc2VuRmlsZXMpIHtcbiAgICAgICAgICAgIC8qKiAgb3JpZ2luYWwgZmlsZSBjb25zaXN0cyBvZiBkaW1lbnNpb25zICovXG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHRoaXMucGF0aCgpLmJhc2VuYW1lKGZpbGUsICcucG5nJyk7XG4gICAgICAgICAgICBjb25zdCBkaW1lbnNpb25zID0gZmlsZW5hbWUuc3BsaXQoJ3gnKTtcblxuICAgICAgICAgICAgLyoqICByZXR1cm5zIGRpbWVuc2lvbnMgb2JqZWN0IGZvciBwYXJzZXIgKi9cbiAgICAgICAgICAgIGNvbnN0IHBhcnNlclZhbHVlcyA9IHRoaXMuZ2V0UGFyc2VyVmFsdWVzKHtcbiAgICAgICAgICAgICAgLi4udGhpcy5nZXRMYXJnZXN0U2l6ZShbZGltZW5zaW9uc1swXSA9PT0gZGltZW5zaW9uc1sxXSA/IGRpbWVuc2lvbnNbMF0gOiBmaWxlbmFtZV0pLFxuICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqIHBhcnNlIGZpbGVuYW1lICovXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5wYXJzZVRlbXBsYXRlKGNvbmZpZy5uYW1lLCBwYXJzZXJWYWx1ZXMpO1xuXG4gICAgICAgICAgICAvKiogIGNyZWF0ZSBuZXcgZmlsZW5hbWUgKi9cbiAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGVuYW1lID0gdGhpcy5wYXRoKCkuam9pbihvdXRwdXREaXIsIGAke25hbWV9LmpwZ2ApO1xuICAgICAgICAgICAgLyoqICBtYWtlIGRpcmVjdG9yeSBmb3IgaWNvbiAqL1xuICAgICAgICAgICAgZnMubWtkaXJTeW5jKHRoaXMucGF0aCgpLmRpcm5hbWUobmV3RmlsZW5hbWUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIC8qKiBnZW5lcmF0ZSBqcGVnIGltYWdlICovXG4gICAgICAgICAgICBhd2FpdCBzaGFycChmaWxlKVxuICAgICAgICAgICAgICAudG9Gb3JtYXQoJ2pwZWcnLCAoYXdhaXQgdGhpcy5nZXRPdXRwdXRPcHRpb25zKCkpLmZvcm1hdHMuanBlZylcbiAgICAgICAgICAgICAgLnRvRmlsZShuZXdGaWxlbmFtZSk7XG4gICAgICAgICAgICAvKiogYWRkIGZpbGVuYW1lIHRvIG91dHB1dCBmaWxlcyAqL1xuICAgICAgICAgICAgb3V0cHV0RmlsZXMucHVzaChuZXdGaWxlbmFtZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShvdXRwdXRGaWxlcyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhbGwgaWNvbnMgYmFzZWQgdXBvbiByZXBvcnQgcmVzdWx0c1xuICAgKlxuICAgKiBAcGFyYW0ge0ljb256UmVwb3J0fSByZXBvcnQgLSBJY29ueiBSZXBvcnRcbiAgICogQHJldHVybnMge1Byb21pc2U8SWNvbnpSZXBvcnQ+fSAtIEljb256IFJlcG9ydFxuICAgKi9cbiAgYXN5bmMgZ2VuZXJhdGVJY29ucyhyZXBvcnQ6IEljb256UmVwb3J0KTogUHJvbWlzZTxJY29uelJlcG9ydD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAvKiogIHJlZmVyZW5jZSB0byBpY29ucyBjb25maWd1cmF0aW9ucyAqL1xuICAgICAgICBjb25zdCBpY29ucyA9IHRoaXMuX2NvbmZpZy5pY29ucztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8qKiAgbG9vcCB0aHJvdWdoIGVhY2ggaWNvbiBjb25maWcgKi9cbiAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBpY29ucykge1xuICAgICAgICAgICAgLyoqICBpZiBub3QgZW5hYmxlZCwgc2tpcCAqL1xuICAgICAgICAgICAgaWYgKGljb25zW2tleV0uZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN3aXRjaCAoaWNvbnNba2V5XS50eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2pwZWcnOlxuICAgICAgICAgICAgICAgIHJlcG9ydC5qcGVnW2tleV0gPSBhd2FpdCB0aGlzLmpwZWdHZW5lcmF0b3IoaWNvbnNba2V5XSwgcmVwb3J0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAncG5nJzpcbiAgICAgICAgICAgICAgICByZXBvcnQucG5nW2tleV0gPSBhd2FpdCB0aGlzLnBuZ0dlbmVyYXRvcihpY29uc1trZXldLCByZXBvcnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdpY28nOlxuICAgICAgICAgICAgICAgIHJlcG9ydC5pY29ba2V5XSA9IGF3YWl0IHRoaXMuaWNvR2VuZXJhdG9yKGljb25zW2tleV0sIHJlcG9ydCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2ljbnMnOlxuICAgICAgICAgICAgICAgIHJlcG9ydC5pY25zW2tleV0gPSBhd2FpdCB0aGlzLmljbnNHZW5lcmF0b3IoaWNvbnNba2V5XSwgcmVwb3J0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShyZXBvcnQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRlbXBvcmFyeSBmb2xkZXJzIHdoaWNoIHdlcmUgZ2VuZXJhdGVkIHRvIHNlcGFyYXRlIHNhbWUgc2l6ZWQgaW1hZ2VzIGJ1dCBkaWZmZXJlbnQgY29uZmlnIG9wdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtJY29uelJlcG9ydH0gcmVwb3J0IC0gSWNvbnogUmVwb3J0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEljb256UmVwb3J0Pn0gLSBJY29ueiBSZXBvcnRcbiAgICovXG4gIGFzeW5jIHJlbW92ZVRlbXBvcmFyeUZvbGRlcnMocmVwb3J0OiBJY29uelJlcG9ydCk6IFByb21pc2U8SWNvbnpSZXBvcnQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpcmVjdG9yaWVzID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWxlIGluIHJlcG9ydC50bXApIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZmlsZURpciA9IHRoaXMucGF0aCgpLmRpcm5hbWUoZmlsZSk7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSB0aGlzLnBhdGgoKS5kaXJuYW1lKGZpbGVEaXIpO1xuICAgICAgICAgICAgbGV0IG5ld0ZpbGUgPSB0aGlzLnBhdGgoKS5qb2luKGRpciwgdGhpcy5wYXRoKCkuYmFzZW5hbWUoZmlsZSkpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgLyoqIGlmIHRoZXJlIGlzIGEgZHVwbGljYXRlIG5hbWVkIGZpbGUsIGp1c3QgcHJlZml4IHdpdGggcHJldmlvdXMgaGFzaCAqL1xuICAgICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhuZXdGaWxlKSkge1xuICAgICAgICAgICAgICAgIG5ld0ZpbGUgPSB0aGlzLnBhdGgoKS5qb2luKGRpciwgdGhpcy5wYXRoKCkuYmFzZW5hbWUoZmlsZURpcikgKyAnXycgKyB0aGlzLnBhdGgoKS5iYXNlbmFtZShmaWxlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZnMucmVuYW1lU3luYyhmaWxlLCBuZXdGaWxlKTtcblxuICAgICAgICAgICAgICBkZWxldGUgcmVwb3J0LnRtcFtmaWxlXTtcbiAgICAgICAgICAgICAgcmVwb3J0LnRtcFtuZXdGaWxlXSA9ICdjb21wbGV0ZSc7XG4gICAgICAgICAgICB9IGNhdGNoIHt9XG5cbiAgICAgICAgICAgIGRpcmVjdG9yaWVzLnB1c2goZmlsZURpcik7XG4gICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqICBsb29wIHRocm91Z2ggY2hvc2VuIGRpcmVjdG9yaWVzICovXG4gICAgICAgIGZvciAoY29uc3QgZGlyZWN0b3J5IG9mIGRpcmVjdG9yaWVzKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJpbXJhZi5zeW5jKGRpcmVjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShyZXBvcnQpO1xuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhbGwgaWNvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8SWNvbnpSZXBvcnQ+fSAtIHJldHVybnMgcHJvbWlzZSB3aXRoIHJlcG9ydFxuICAgKi9cbiAgYXN5bmMgcnVuKCk6IFByb21pc2U8SWNvbnpSZXBvcnQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXBvcnQgPSBhd2FpdCB0aGlzLnByZXBhcmVBbGxTaXplZEltYWdlcygpO1xuICAgICAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVJY29ucyhyZXBvcnQpO1xuICAgICAgICAgIGF3YWl0IHRoaXMucmVtb3ZlVGVtcG9yYXJ5Rm9sZGVycyhyZXBvcnQpO1xuICAgICAgICAgIHJlc29sdmUocmVwb3J0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IEljb256IH07XG5cbmV4cG9ydCBkZWZhdWx0IEljb256O1xuIl19