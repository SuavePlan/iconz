import path from 'path';
import fs from 'fs';
import os from 'os';
import sharp from 'sharp';
import crypto from 'crypto';
import pngToIco from 'png-to-ico';
import icoToPng from 'ico-to-png';
import rimraf from 'rimraf';
import { Icns, IcnsImage } from '@fiahfy/icns';
import { OSType } from '@fiahfy/icns/dist';
import Buffer from 'buffer';

/** direct references to sharp library */
export type IconzInputOptions = sharp.SharpOptions;
export type IconzResizeOptions = sharp.ResizeOptions;
export type IconzPngOptions = sharp.PngOptions;
export type IconzJpegOptions = sharp.JpegOptions;

export type IconzImage = sharp.Sharp;
export type IconzColour = sharp.Color;

/** list of valid icon types */
export const IconzTypes = ['ico', 'icns', 'png', 'jpeg'] as const;

export type IconzType = typeof IconzTypes[number];

export interface IconzReport {
  /** temporary images */
  tmp: Record<string, IconzResizeOptions | string>;
  /** ico images */
  ico: any;
  /** icns images */
  icns: any;
  /** png images */
  png: any;
  /** jpeg images */
  jpeg: any;
  /** failed images */
  failed: any;

  /** for custom items created in hooks */
  [key: string]: any;
}

export interface IconzOptionsHook {}

/** option hooks */
export interface IconzInputOptionsHook extends IconzOptionsHook {
  (options: IconzInputOptions): Promise<IconzInputOptions>;
}

export interface IconzResizeOptionsHook extends IconzOptionsHook {
  (options: IconzResizeOptions): Promise<IconzResizeOptions>;
}

export interface IconzOutputOptionsHook extends IconzOptionsHook {
  (options: IconzOutputOptions): Promise<IconzOutputOptions>;
}

export const IconzOutputTypes = ['png', 'jpeg'] as const;
export type IconzOutputType = typeof IconzOutputTypes[number];

/** main config options / hooks */
export type IconzOptions = {
  input: IconzInputOptions | IconzInputOptionsHook;
  resize: IconzResizeOptions | IconzResizeOptionsHook;
  output: IconzOutputOptions | IconzOutputOptionsHook;
};

export type IconzOutputFormats = {
  png: IconzPngOptions;
  jpeg: IconzJpegOptions;
};
/** current available output options */
export type IconzOutputOptions = {
  formats: IconzOutputFormats;
  /**  default output format */
  format: keyof IconzOutputFormats;
};

export type IconzIconConfig = {
  [key: string]: IconzConfig;
};

export interface IconzConfigCollection {
  /**
   * This is the image you wish to use as a template
   *
   */
  src?: string;

  /**
   * This is the base folder for all generated icons
   *
   * If left blank, it will use the directory of your
   * source image
   *
   */
  folder?: string;

  /**
   * This is where the temporary png images are generated
   *
   * if left blank, it will generate a temporary folder
   * inside your operating system's temp folder.
   *
   * If you enter a directory, it will generate the icons
   * within that directory, and it will remain until you
   * delete it.
   *
   * NOTE: images are generated as {{width}}x{{height}}.png
   * e.g: 16x16.png , 32x32.png .... 1024x1024.png
   *
   */
  tmpFolder?: string;

  /**
   * These options are based upon the sharp library parameter 'options'
   * For Input See: https://sharp.pixelplumbing.com/api-constructor#parameters
   * For Resizing See: https://sharp.pixelplumbing.com/api-resize#parameters
   * For Output See: https://sharp.pixelplumbing.com/api-output#png
   *
   */
  options?: IconzOptions;

  /**
   * A collection of actions to be run on original image before cloning
   *
   */
  actions?: IconzImageActions;

  /**
   * This is an optional object containing the configuration
   * for each type of icon set you wish to generate.
   *
   * If left blank, the defaults will be used
   *
   */
  icons?: IconzIconConfig;
}

/**
 *
 * This is for the pre and post resizing hook methods
 *
 * PLEASE NOTE!!! resolve(image) MUST be called within your promise
 * for the system to continue processing it.
 *
 * HOWEVER!!! resolve(undefined) will ensure the system
 * does NOT process the image further.
 *
 * @example
 * ```javascript
 * const myHook = (self,image,options,targetFilename,imageReport) => {
 *   image.modulate({ brightness: 2 });
 *   Promise.resolve(image); // allow system to continue normally
 * }
 * ```
 * @example
 * ```javascript
 * const myHook = (self,image,options,targetFilename,imageReport) => {
 *  image.blur(4).jpeg().toBuffer()
 *    .then((data) => fs.writeFileSync('myFile.jpg', data));
 *  Promise.resolve(undefined); // halt processing of the image any further
 * }
 * ```
 */
export type IconzResizeHook = (
  /**
   * This is the instantiated Iconz class you created
   */
  self: Iconz,
  /** This is the image generated and processed just before hook is called */
  image: IconzImage,
  /**
   * These are the resizing options from within your icon configuration
   * it also includes the width (options.width) and height (options.height)
   * of the image that is being generated.
   */
  options: IconzResizeOptions,
  /**
   * This is the target filename of the intended icon to be generated.
   */
  targetFilename: string,
  /**
   * This returns a report object containing a list of all the icons generated
   * You may add to the object, and it will be returned at the end.
   */
  imageReport: IconzReport,
) => Promise<IconzImage | undefined>;

/**
 * These are the current hooks available
 */
export interface IconzHooks {
  preResize?: IconzResizeHook;
  postResize?: IconzResizeHook;
}

/** valid method names from sharp library */
export type IconzImageActionName = keyof sharp.Sharp;

type IconzImageAction = {
  cmd: IconzImageActionName;
  args: any[];
};

type IconzImageActions = IconzImageAction[];

/**
 * This is the icon configuration layout
 */
export interface IconzConfig {
  /**
   * This is the type of icon you wish to use
   * it must be either png, ico or icns
   *
   */
  type: IconzType;

  /**
   * This is the name of the file you wish to use
   * it is parsed using the handlebars syntax.
   *
   * @example
   * ```text
   * for an image with the size '24x18' the name
   * would be as follows:
   * 'icon-{{size}}' resolves to 'icon-24x18'
   * 'icon-{{dims}}' resolves to 'icon-24x18'
   * 'icon-{{width}}' resolves to 'icon-24'
   * 'icon-{{height}}' resolves to 'icon-18'
   *
   * If the size is set as a single number,
   * e.g 24, the {{dims}} variable returns 24x24,
   * however, the {{size}} variable would just return 24.
   *
   * 'icon-{{size}}' resolves to 'icon-24'
   * 'icon-{{dims}}' resolves to 'icon-24x24'
   * 'icon-{{width}}' resolves to 'icon-24'
   * 'icon-{{height}}' resolves to 'icon-24'
   * ```
   */
  name: string;

  /**
   * This is an array of sizes, whether as an integer
   * or a string.
   *
   * @example
   * ```text
   * As a string you can either just use a single number
   * '56' - which will be both the width and height
   * ```
   * @example
   * ```text
   * If the width differs from the height, use the following format
   * '120x80' which means the width 120 and height of 80.
   * ```
   */
  sizes: (string | number)[];

  /**
   * This is the folder you wish to store the images
   * generated from this configuration.
   *
   * If left blank, it will use the default folder
   * from the main configuration.
   *
   */
  folder?: string;

  /**
   * These resizing options are ones from the sharp library,
   * and are applied when resizing the icons.
   *
   * If left blank, defaults will be chosen
   *
   * @see https://sharp.pixelplumbing.com/api-resize
   * @example
   * ```javascript
   * {
   *   position: 'centre', fit: 'contain', kernel: 'mitchell',
   *   background: { r: 255, g: 127, b: 0, alpha: 0.5 }
   * }
   * ```
   */
  options?: IconzResizeOptions;

  /**
   * The hooks section is optional, but should you wish
   * to alter any of the icons during generation, the following
   * hooks can be used.
   *
   * If you wish for the system to stop processing the image
   * after your hook, you must use
   * resolve(undefined) instead of resolve(image) within the promise
   *
   * @function preResize - This runs just before the image is resized and converted to png
   * @function postResize - This is after the conversion, but before conversion to a buffer and saved to a file
   */
  hooks?: IconzHooks;

  /**
   * should you wish to temporarily disable a single configuration
   * set the enabled var to false
   *
   * @example enabled: false
   */
  enabled?: boolean;
}

export const defaultSizes: Record<string, (string | number)[]> = {
  ico: [16, 24, 32, 48, 64, 128, 256],
  icns: [16, 32, 64, 128, 256, 512, 1024],
  png: [16, 32, 64, 128, 256, 512, 1024],
  jpeg: [16, 32, 64, 128, 256, 512, 1024],
};

/**
 * This is the default icon configuration
 */
export const defaultConfig: IconzConfigCollection = {
  options: {
    input: <IconzInputOptions>{
      density: 150,
    },
    resize: <IconzResizeOptions>{
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'mitchell',
      position: 'centre',
      withoutEnlargement: false,
      fastShrinkOnLoad: true,
      width: 1024,
      height: 1024,
    },
    output: <IconzOutputOptions>{
      formats: <IconzOutputFormats>{
        png: {
          compressionLevel: 9,
          quality: 100,
        },
        jpeg: {
          quality: 100,
          chromaSubsampling: '4:4:4',
        },
      },
      format: 'png',
    },
  },
  icons: {
    icns: {
      type: 'icns',
      name: 'app',
      sizes: [16, 32, 64, 128, 256, 512, 1024],
      folder: '.',
    },
    ico: {
      type: 'ico',
      name: 'app',
      sizes: [16, 24, 32, 48, 64, 128, 256],
      folder: '.',
    },
    favico: {
      type: 'ico',
      name: 'favicon',
      sizes: [16, 24, 32, 48, 64],
      folder: '.',
    },
    faviconPng: {
      type: 'png',
      name: 'favicon',
      sizes: [32],
      folder: '.',
    },
    favicon: {
      type: 'png',
      name: 'favicon-{{dims}}',
      sizes: [32, 57, 72, 96, 120, 128, 144, 152, 195, 228],
      folder: 'icons',
    },
    msTile: {
      type: 'png',
      name: 'mstile-{{dims}}',
      sizes: [70, 144, 150, 270, 310, '310x150'],
      folder: 'icons',
      options: {
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    },
    android: {
      type: 'png',
      name: 'android-chrome-{{dims}}',
      sizes: [36, 48, 72, 96, 144, 192, 256, 384, 512],
      folder: 'icons',
    },
    appleTouch: {
      type: 'png',
      name: 'apple-touch-{{dims}}',
      sizes: [16, 32, 76, 96, 114, 120, 144, 152, 167, 180],
      folder: 'icons',
    },
  },
};

/**
 * Iconz - Icon Generator for the Web
 *
 * See README.md for further information
 *
 */
class Iconz {
  /**
   * Configuration data
   */
  protected _config: IconzConfigCollection = {};

  /**
   * these are the variables which can be used when parsing the filename
   */
  protected _parserValues: Record<string, any> = {};

  /**
   * Iconz Constructor
   *
   * @param {IconzConfigCollection} config - Main configuration object
   */
  constructor(config: IconzConfigCollection) {
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
  clone<T extends { [prop: string]: any }>(object: T): T {
    /**  cloning output */
    const cloning: Record<string, any> = {};

    Object.keys(object).map((prop: string) => {
      if (Array.isArray(object[prop])) {
        cloning[prop] = [].concat(object[prop]);
      } else if (typeof object[prop] === 'object') {
        cloning[prop] = this.clone(object[prop]);
      } else cloning[prop] = object[prop];
    });

    return <T>cloning;
  }

  /**
   * Returns all the variables to be used with filename parser
   *
   * @param {Record<string, any>} extraData - extra data to merge into parser values
   * @param {boolean} freezeCounter - only to be used to get a static snapshot of parser values
   * @returns {Record<string, any>} - Object containing available parser values
   */
  getParserValues(extraData: Record<string, any>, freezeCounter?: boolean): Record<string, any> {
    // record start date
    if (typeof this._parserValues.start === 'undefined') {
      this._parserValues.start = Iconz.dateToObject();
    }

    return {
      ...this.clone(this._parserValues),
      ...{
        env: this.clone(process.env),
        counter:
          typeof this._parserValues.counter === 'number'
            ? freezeCounter === true
              ? this._parserValues.counter
              : ++this._parserValues.counter
            : freezeCounter === true
            ? 0
            : (this._parserValues.counter = 1),
        // get latest date every call
        date: freezeCounter === true ? this._parserValues.start : Iconz.dateToObject(),
      },
      ...this.clone(extraData),
    };
  }

  /**
   * Get Configuration
   *
   * @param {boolean} clone - Should the returned object be a clone
   * @returns {IconzConfigCollection} - Icon Configuration object
   */
  getConfig(clone?: boolean): IconzConfigCollection {
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
  argb2rgba(xInOut: Buffer): void {
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
  rgba2argb(xInOut: Buffer): void {
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
  mergeConfig(target: Record<any, any>, ...sources: Record<any, any>[]): Record<any, any> {
    const isObject = (item: any) => {
      return item && typeof item === 'object' && !Array.isArray(item);
    };

    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          /**  ensure that if the source object is intentionally empty, set the target as empty too. */
          if (!target[key] || Object.keys(source[key]).length === 0) Object.assign(target, { [key]: {} });
          this.mergeConfig(target[key], source[key]);
        } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
          target[key] = [...new Set([...target[key], ...source[key]])];
        } else {
          Object.assign(target, { [key]: source[key] });
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
  validateConfig(config: IconzConfigCollection): void {
    if (typeof config !== 'object' || config === null) {
      throw new TypeError('Invalid configuration');
    }

    /**  try to read image file */
    if (typeof config.src !== 'string' || !fs.existsSync(config.src)) {
      throw new Error('Source image not found');
    }

    /**  create base folder if it doesn't exist */
    if (typeof config.folder === 'string') {
      if (!fs.existsSync(config.folder)) {
        try {
          fs.mkdirSync(config.folder, { recursive: true });
        } catch {
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
      config.tmpFolder = fs.mkdtempSync(this.path().join(os.tmpdir(), 'iconz-'));
    }

    /**  if temp folder is selected, ensure it exists. This will be used to store all sized png files */
    if (!fs.existsSync(config.tmpFolder)) {
      try {
        fs.mkdirSync(
          this.isRelativePath(config.tmpFolder) ? this.path().join(config.folder, config.tmpFolder) : config.tmpFolder,
          { recursive: true },
        );
      } catch {}
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
  isAbsolutePath(str: string): boolean {
    return this.path().isAbsolute(str);
  }

  /**
   * Check if path is relative
   *
   * @param {string} str - path to check
   * @returns {boolean} - if path is relative
   */
  isRelativePath(str: string): boolean {
    return !this.isAbsolutePath(str);
  }

  /**
   * returns appropriate path based upon platform
   *
   * @returns {path.Platform} - platform
   */
  path(): path.PlatformPath {
    return Iconz.path();
  }

  /**
   * returns appropriate path based upon platform
   *
   * @returns {path.PlatformPath} - platform
   */
  static path(): path.PlatformPath {
    return path[process.platform === 'win32' ? 'win32' : 'posix'];
  }

  /**
   * Add Icon configuration
   *
   * @param {string} key - name of icon configuration
   * @param {IconzConfig} config - Iconz Config object
   */
  addIconConfig(key: string, config: IconzConfig): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Invalid config name');
    }
    if (typeof config !== 'object' || Object.keys(config).length === 0) {
      throw new TypeError('Config is invalid');
    }
    this._config.icons ??= {};
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
  addAction(cmd: IconzImageActionName, ...args: any[]): this {
    if (typeof cmd !== 'string' || cmd.length === 0) {
      throw new TypeError('Invalid action name');
    }

    /** add action to list */
    this._config.actions ??= [];
    this._config.actions.push({ cmd, args: args.length === 1 && Array.isArray(args[0]) ? [...args[0]] : args });

    return this;
  }

  /**
   * Convert hex string into colour object
   *
   * @param {string} hex - input hex string
   * @returns {IconzColour} - Colour object
   */
  static bgHexToObj(hex: string): IconzColour {
    if (!/^#?([0-9A-F]{6}|[0-9A-F]{8})/i.test(hex)) {
      throw new Error('Invalid hex, should be #AAFF00 (rgb) or #AAFF0022 (rgba) format');
    }

    /**  remove hash from start of string */
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }

    const round = (x: number, n = 2) => {
      const precision = Math.pow(10, n);
      return Math.round((x + Number.EPSILON) * precision) / precision;
    };

    /**  convert to object */
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
      alpha:
        hex.length === 6 ? 1 : parseInt(hex.substr(6, 2), 16) === 0 ? 0 : round(parseInt(hex.substr(6, 2), 16) / 255),
    };
  }

  /**
   * Convert hex string into colour object
   *
   * @param {string} hex - input hex string
   * @returns {IconzColour} - Colour object
   */

  bgHexToObj(hex: string): IconzColour {
    return Iconz.bgHexToObj(hex);
  }

  /**
   * Convert colour object into hex string
   *
   * @param {IconzColour} obj - Colour object to convert
   * @returns {string} - Hex string in the format #RRGGBBAA
   */
  static bgObjToHex(obj: IconzColour): string {
    if (
      typeof obj !== 'object' ||
      typeof obj.r !== 'number' ||
      typeof obj.g !== 'number' ||
      typeof obj.b !== 'number' ||
      typeof obj.alpha !== 'number'
    ) {
      throw new Error('Invalid background object');
    }

    return (
      '#' +
      obj.r.toString(16).padStart(2, '0') +
      obj.g.toString(16).padStart(2, '0') +
      obj.b.toString(16).padStart(2, '0') +
      Math.floor(obj.alpha * 255)
        .toString(16)
        .padStart(2, '0')
    ).toUpperCase();
  }

  /**
   * Convert colour object into hex string
   *
   * @param {IconzColour} obj - Colour object to convert
   * @returns {string} - Hex string in the format #RRGGBBAA
   */
  bgObjToHex(obj: IconzColour): string {
    return Iconz.bgObjToHex(obj);
  }

  /**
   * Generate width and height string from size
   *
   * @param {string|number} size - input size as single or two dimensions
   * @returns {number[]} - returns an array containing with and height
   */
  generateWidthAndHeightFromSize(size: string | number): number[] {
    /**  convert single dimension into width x height */

    if (Number.isInteger(size) || (typeof size === 'string' && /^[0-9]+$/.test(size))) {
      size = String(`${size}x${size}`);
    }

    /**  if the value is multidimensional, add to sizes */
    if (typeof size === 'string' && /^[0-9]+x[0-9]+$/.test(size)) {
      return size.split('x').map((v) => Number(v));
    }

    throw new Error(`Invalid size ${size}`);
  }

  /**
   * Prepare target path from options
   *
   * @param {Record<string, any>} options - target path options
   * @returns {string} - target filepath
   */
  generateTargetFilepathFromOptions(options: Record<string, any>): string {
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
  createHash(data: string, len = 4): string {
    return crypto.createHash('shake256', { outputLength: len }).update(data).digest('hex');
  }

  /**
   * Get options for image processor
   *
   * @param {keyof IconzOptions} name - key of the IconzOptions object
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzInputOptions|IconzResizeOptions|IconzOutputOptions|undefined>} - returns IconzOptions object
   */
  getOptions<T>(name: keyof IconzOptions, clone?: boolean): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          /**  get options or callback */
          const options = <T | undefined>(
            (this._config.options && this._config.options[name] ? this._config.options[name] : undefined)
          );

          /**  get options or callback results */
          const result = typeof options === 'function' ? await options : options;

          resolve(clone === false ? result : result ? this.clone<T>(result) : undefined);
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
  getInputOptions<T extends IconzInputOptions>(clone?: boolean): Promise<T | undefined> {
    return this.getOptions<T>('input', clone);
  }

  /**
   * Get Output options for sharp
   *
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzOutputOptions|undefined>} - IconzOutputOptions object
   */
  getOutputOptions<T extends IconzOutputOptions>(clone?: boolean): Promise<T | undefined> {
    return this.getOptions<T>('output', clone);
  }

  /**
   * Get Resize options for sharp
   *
   * @param {boolean} clone - if the options are to be cloned
   * @returns {Promise<IconzResizeOptions|undefined>} - IconzResizeOptions object
   */
  getResizeOptions<T extends IconzResizeOptions>(clone?: boolean): Promise<T | undefined> {
    return this.getOptions<T>('resize', clone);
  }

  /**
   * prepare absolute path
   *
   * @param {string} folder - input path
   * @returns {string} - resulting absolute path
   */
  absoluteFolderPath(folder: string): string {
    const parts: string[] = [];

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
  static dateToObject(date?: Date): Record<string, any> {
    date ??= new Date();
    const dateParts: Record<string, any> = {
      year: String(date.getFullYear()),
      month: ('0' + (date.getMonth() + 1)).slice(-2),
      day: ('0' + date.getDate()).slice(-2),
      hour: ('0' + date.getHours()).slice(-2),
      minute: ('0' + date.getMinutes()).slice(-2),
      second: ('0' + date.getSeconds()).slice(-2),
      millisecond: ('00' + date.getMilliseconds()).slice(-3),
      epoch: String(date.getTime()),
      offset: String(date.getTimezoneOffset()),
      dow: String(date.getDay() + 1),
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
  async prepareAllSizedImages(): Promise<IconzReport> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          /**  read source image */
          let img = sharp(
            /** if it's an icon, use icoToPng to convert into a buffer before passing to sharp */
            this.path().extname(this._config.src) === '.ico'
              ? await icoToPng(fs.readFileSync(this._config.src), 1024)
              : this._config.src,
            await this.getInputOptions(),
          );

          /** prepare parser variables from original image, along with date/time */
          this._parserValues = {
            meta: await img.metadata(),
            stats: await img.stats(),
          };

          /** loop through all actions before cloning */
          if (Array.isArray(this._config.actions)) {
            for (const key in this._config.actions) {
              const action: IconzImageAction = this._config.actions[key];
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              img = img[action.cmd](...action.args);
            }
          }

          /**  create temporary folder if needed */
          const tempFolder = this.absoluteFolderPath(
            this._config.tmpFolder || fs.mkdtempSync(this.path().join(os.tmpdir(), 'iconz-')),
          );

          /**  instantiate report */
          const imageReport: IconzReport = {
            tmp: {},
            ico: {},
            icns: {},
            png: {},
            jpeg: {},
            failed: {},
          };

          const outputOptions = await this.getOutputOptions();

          /** get file output type */
          const outputFormat = (outputOptions && outputOptions.format) || undefined;

          if (IconzOutputTypes.indexOf(outputFormat) === -1) {
            throw new TypeError('Output format is invalid');
          }

          const chosenOptions = <IconzPngOptions | IconzJpegOptions>outputOptions.formats[outputFormat];

          /**  merge all sizes from configuration */
          for (const [name, config] of Object.entries(this._config.icons)) {
            /**  skip if the config has been disabled */
            if (config.enabled === false) {
              continue;
            }

            /** if there are no sizes, try and use defaults */
            if (config.sizes.length === 0 && Array.isArray(defaultSizes[config.type])) {
              config.sizes = [...defaultSizes[config.type]];
            }

            /** if there are multiple sizes, and it's a static image, it must have a dynamic field */
            if (
              config.sizes.length > 1 &&
              !['icns', 'ico'].includes(config.type) &&
              /** check if one of the key variables are being used */
              !['dims', 'width', 'height', 'size', 'datetime', 'datemtime', 'mtime', 'counter', 'millisecond'].some(
                (v) => config.name.includes(`{{${v}}}`),
              )
            ) {
              throw new Error(
                `Icons config '${name}' has more than one size. Try changing it to ${name}-{{dims}} or ${name}-{{counter}}.`,
              );
            }

            for await (const response of this.configToOptions(config, tempFolder, { name })) {
              /**  check for invalid icon dimensions */
              if (['ico', 'icns'].includes(config.type) && response.options.width !== response.options.height) {
                throw new Error(`Invalid config for ${name}, icon dimensions must have a 1:1 ratio`);
              }

              /**  if image hasn't been created before, generate it. */
              if (typeof imageReport.tmp[response.target] === 'undefined') {
                /**  create folder first */
                const dirname = this.path().dirname(response.target);
                if (!fs.existsSync(dirname)) {
                  fs.mkdirSync(dirname);
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
                await clone
                  .toBuffer()
                  .then((data: Buffer.Buffer) => {
                    fs.writeFileSync(response.target, data);
                    /**  store image path with settings to report */
                    imageReport.tmp[response.target] = response.options;
                    return response.target;
                  })
                  .catch((err) => {
                    /**  write error to report */
                    imageReport.failed[response.target] = err.message || 'unknown error';
                  });
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
  async *configToOptions(
    config: IconzConfig,
    basePath?: string,
    additionalArgs?: Record<string, any>,
  ): AsyncGenerator<{ target: string; options: IconzResizeOptions }> {
    /**  ensure specific settings are set by default */

    /**  prepare default settings for image resize */
    const defaultOptions: IconzResizeOptions = await this.getResizeOptions();

    const outputOptions: IconzOutputOptions = await this.getOutputOptions();

    /**  loop through images and prepare png files */
    for (const size of config.sizes) {
      /**  get dimensions */
      const [width, height] = this.generateWidthAndHeightFromSize(size);

      /**  generate settings for image resize */
      const options: IconzResizeOptions = {
        ...defaultOptions,
        ...{
          width: Number(width),
          height: Number(height),
        },
      };

      /**  create unique image name based upon settings */
      const imagePath = this.generateTargetFilepathFromOptions({
        ...options,
        ...(additionalArgs ?? {}),
        ...{
          /** if hooks exist, allow hashes to change to reflect change. */
          hooks: config.hooks,
        },
      });

      /**  target image name */
      const target = `${basePath ? this.path().join(basePath, imagePath) : imagePath}.${
        outputOptions.format === 'jpeg' ? 'jpg' : outputOptions.format
      }`;

      yield {
        target,
        options,
      };
    }
  }

  /**
   * This is used to find relative file paths
   *
   * @param {string} substr - substring to search for
   * @param {string[]} arr - this is an array of strings to search in
   * @returns {string[]} - a list of strings that have substring in them
   */
  searchArrayForSubstring(substr: string, arr: string[]): string[] {
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
  static getNestedByPath(nestedObject: Record<any, any>, pathString: string): any {
    const pathArray = this.isValidPath(pathString) ? pathString.split('.') : [];
    return pathArray.reduce(
      (object: any, key: any) => (object && object[key] !== 'undefined' ? object[key] : undefined),
      nestedObject,
    );
  }

  /**
   * generate a blank report
   *
   * @returns {IconzReport} - empty report
   */
  static newReport(): IconzReport {
    return {
      tmp: {},
      ico: {},
      icns: {},
      png: {},
      jpeg: {},
      failed: {},
    };
  }

  /**
   * to check if dot based object path is valid
   *
   * @param {string} path - dot based object path
   * @returns {boolean} - if path is valid
   */
  static isValidPath(path: string): boolean {
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
  parseTemplate(template: string, values: Record<string, any>, removeUndefined = false): string {
    /** copy template to output */
    let output = template;

    /** Regex for handlebars */
    const r = new RegExp('{{([^}]*)}}', 'gm');
    for (let a; (a = r.exec(template)) !== null; ) {
      /** retrieve nested value based upon content of handlebars */
      const val = Iconz.getNestedByPath(values, a[1]);

      /** if no value has been found, then remove if chosen */
      if (val === undefined && removeUndefined) {
        output = output.replace(a[0], '');
      } else {
        /** if the item isn't a number, string or boolean, either leave the handlebars, or leave blank */
        output = output.replace(
          String(a[0]),
          ['bigint', 'number', 'string', 'boolean'].includes(typeof val)
            ? String(val)
            : removeUndefined
            ? ''
            : String(a[0]),
        );
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
  getLargestSize(sizes: (string | number)[]): { size: string; width: string; height: string; dims: string } {
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
      const tmp =
        typeof size === 'number' || (typeof size === 'string' && size.indexOf('x') === -1)
          ? [String(size), String(size)]
          : size.split('x');
      const width = Number(tmp[0]);
      const height = Number(tmp[1]);
      if (width * height > px) {
        px = width * height;
        dims = {
          size: `${size}`,
          width: `${width}`,
          height: `${height}`,
          dims: `${width}x${height}`,
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
  async getChosenFilesForIcon(
    config: IconzConfig,
    report: IconzReport,
  ): Promise<{ outputDir: string; chosenFiles: string[] }> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (typeof config !== 'object' || typeof report !== 'object') {
            throw new Error('parameters are missing');
          }

          /**  output directory */
          let outputDir: string;

          if (config.folder) {
            outputDir = this.isRelativePath(config.folder)
              ? this.path().join(this._config.folder, config.folder)
              : config.folder;
          } else {
            outputDir = this.absoluteFolderPath(this._config.folder);
          }

          /**  get all successfully generated images */
          const availableFiles = Object.keys(report.tmp);

          let chosenFiles: string[] = [];

          /**  loop through each configuration (size) and get all the relevant images */
          for await (const response of this.configToOptions(config, outputDir)) {
            const { target } = response;

            /**  get last two segments of path ( hash + filename ) */
            const [hash, filename] = target.split(this.path().sep).slice(-2);
            const file = this.path().join(hash, filename);

            /**  get all relevant files to merge into ico file */
            chosenFiles = [...chosenFiles, ...this.searchArrayForSubstring(file, availableFiles)];
          }

          resolve({ outputDir, chosenFiles });
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
  async icoGenerator(config: IconzConfig, report: IconzReport): Promise<string> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { outputDir, chosenFiles } = await this.getChosenFilesForIcon(config, report);

          /**  if images are found, prepare ico file */
          if (chosenFiles.length) {
            /** get parser variables for name parser */
            const parserValues = this.getParserValues({
              ...this.getLargestSize(<string[]>config.sizes),
              config,
            });

            /** parse filename */
            const name = this.parseTemplate(config.name, parserValues);

            /**  create new filename */
            const newFilename = this.path().join(outputDir, `${name}.ico`);

            /** convert png to ico */
            return resolve(
              pngToIco(chosenFiles).then((buf: Buffer) => {
                fs.mkdirSync(this.path().dirname(newFilename), { recursive: true });
                fs.writeFileSync(newFilename, buf);
                return newFilename;
              }),
            );
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
  async icnsGenerator(config: IconzConfig, report: IconzReport): Promise<string> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { outputDir, chosenFiles } = await this.getChosenFilesForIcon(config, report);
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
              ic14: '512x512',
            };
            const icns = new Icns();
            let buf, image;

            for (const [osType, size] of Object.entries(conversionMap)) {
              for (const file of chosenFiles) {
                if (this.path().basename(file, '.png') === size) {
                  buf = fs.readFileSync(file);
                  image = IcnsImage.fromPNG(buf, <OSType>osType);
                  icns.append(image);
                }
              }
            }

            /** get parser variables for name parser */
            const parserValues = this.getParserValues({
              ...this.getLargestSize(<string[]>config.sizes),
              config,
            });

            /** parse filename */
            const name = this.parseTemplate(config.name, parserValues);

            /**  create new filename */
            const newFilename = this.path().join(outputDir, `${name}.icns`);

            fs.mkdirSync(this.path().dirname(newFilename), { recursive: true });
            fs.writeFileSync(newFilename, icns.data);

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
  async pngGenerator(config: IconzConfig, report: IconzReport): Promise<string[]> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const outputFiles = [];

          const { outputDir, chosenFiles } = await this.getChosenFilesForIcon(config, report);

          for (const file of chosenFiles) {
            /**  original file consists of dimensions */
            const filename = this.path().basename(file, '.png');
            const dimensions = filename.split('x');

            /**  returns dimensions object for parser */
            const parserValues = this.getParserValues({
              ...this.getLargestSize([dimensions[0] === dimensions[1] ? dimensions[0] : filename]),
              config,
            });

            const name = this.parseTemplate(config.name, parserValues);

            /**  create new filename */
            const newFilename = this.path().join(outputDir, `${name}.png`);
            /**  make directory for icon */
            fs.mkdirSync(this.path().dirname(newFilename), { recursive: true });
            /**  copy icon from temporary images */
            fs.copyFileSync(file, newFilename);
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
  async jpegGenerator(config: IconzConfig, report: IconzReport): Promise<string[]> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const outputFiles = [];

          const { outputDir, chosenFiles } = await this.getChosenFilesForIcon(config, report);

          for (const file of chosenFiles) {
            /**  original file consists of dimensions */
            const filename = this.path().basename(file, '.png');
            const dimensions = filename.split('x');

            /**  returns dimensions object for parser */
            const parserValues = this.getParserValues({
              ...this.getLargestSize([dimensions[0] === dimensions[1] ? dimensions[0] : filename]),
              config,
            });

            /** parse filename */
            const name = this.parseTemplate(config.name, parserValues);

            /**  create new filename */
            const newFilename = this.path().join(outputDir, `${name}.jpg`);
            /**  make directory for icon */
            fs.mkdirSync(this.path().dirname(newFilename), { recursive: true });
            /** generate jpeg image */
            await sharp(file)
              .toFormat('jpeg', (await this.getOutputOptions()).formats.jpeg)
              .toFile(newFilename);
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
  async generateIcons(report: IconzReport): Promise<IconzReport> {
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
  async removeTemporaryFolders(report: IconzReport): Promise<IconzReport> {
    return new Promise((resolve) => {
      (async () => {
        const directories = [];

        for (const file in report.tmp) {
          try {
            const fileDir = this.path().dirname(file);
            const dir = this.path().dirname(fileDir);
            let newFile = this.path().join(dir, this.path().basename(file));
            try {
              /** if there is a duplicate named file, just prefix with previous hash */
              if (fs.existsSync(newFile)) {
                newFile = this.path().join(dir, this.path().basename(fileDir) + '_' + this.path().basename(file));
              }
              fs.renameSync(file, newFile);

              delete report.tmp[file];
              report.tmp[newFile] = 'complete';
            } catch {}

            directories.push(fileDir);
          } catch {}
        }

        /**  loop through chosen directories */
        for (const directory of directories) {
          try {
            rimraf.sync(directory);
          } catch {}
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
  async run(): Promise<IconzReport> {
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

export { Iconz };

export default Iconz;
