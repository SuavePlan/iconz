/// <reference types="node" />
import path from 'path';
import sharp from 'sharp';
/** direct references to sharp library */
export declare type IconzInputOptions = sharp.SharpOptions;
export declare type IconzResizeOptions = sharp.ResizeOptions;
export declare type IconzPngOptions = sharp.PngOptions;
export declare type IconzJpegOptions = sharp.JpegOptions;
export declare type IconzImage = sharp.Sharp;
export declare type IconzColour = sharp.Color;
/** list of valid icon types */
export declare const IconzTypes: readonly ["ico", "icns", "png", "jpeg"];
export declare type IconzType = typeof IconzTypes[number];
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
export interface IconzOptionsHook {
}
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
export declare const IconzOutputTypes: readonly ["png", "jpeg"];
export declare type IconzOutputType = typeof IconzOutputTypes[number];
/** main config options / hooks */
export declare type IconzOptions = {
    input: IconzInputOptions | IconzInputOptionsHook;
    resize: IconzResizeOptions | IconzResizeOptionsHook;
    output: IconzOutputOptions | IconzOutputOptionsHook;
};
export declare type IconzOutputFormats = {
    png: IconzPngOptions;
    jpeg: IconzJpegOptions;
};
/** current available output options */
export declare type IconzOutputOptions = {
    formats: IconzOutputFormats;
    /**  default output format */
    format: keyof IconzOutputFormats;
};
export declare type IconzIconConfig = {
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
export declare type IconzResizeHook = (
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
imageReport: IconzReport) => Promise<IconzImage | undefined>;
/**
 * These are the current hooks available
 */
export interface IconzHooks {
    preResize?: IconzResizeHook;
    postResize?: IconzResizeHook;
}
/** valid method names from sharp library */
export declare type IconzImageActionName = keyof sharp.Sharp;
declare type IconzImageAction = {
    cmd: IconzImageActionName;
    args: any[];
};
declare type IconzImageActions = IconzImageAction[];
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
/**
 * This is the default icon configuration
 */
export declare const defaultConfig: IconzConfigCollection;
/**
 * Iconz - Icon Generator for the Web
 *
 * See README.md for further information
 *
 */
declare class Iconz {
    /**
     * Configuration data
     */
    protected _config: IconzConfigCollection;
    /**
     * these are the variables which can be used when parsing the filename
     */
    protected _parserValues: Record<string, any>;
    /**
     * Iconz Constructor
     *
     * @param {IconzConfigCollection} config - Main configuration object
     */
    constructor(config: IconzConfigCollection);
    /**
     * Deep Object Cloner
     *
     * @param {object} object - object to clone
     * @returns {object} - clone of object
     */
    clone<T extends {
        [prop: string]: any;
    }>(object: T): T;
    /**
     * Returns all the variables to be used with filename parser
     *
     * @param {Record<string, any>} extraData - extra data to merge into parser values
     * @param {boolean} freezeCounter - only to be used to get a static snapshot of parser values
     * @returns {Record<string, any>} - Object containing available parser values
     */
    getParserValues(extraData: Record<string, any>, freezeCounter?: boolean): Record<string, any>;
    /**
     * Get Configuration
     *
     * @param {boolean} clone - Should the returned object be a clone
     * @returns {IconzConfigCollection} - Icon Configuration object
     */
    getConfig(clone?: boolean): IconzConfigCollection;
    /**
     * Convert ARGB to RGBA
     *
     * @param {Buffer} xInOut - Buffer to convert
     */
    argb2rgba(xInOut: Buffer): void;
    /**
     * Convert RGBA to ARGB
     *
     * @param {Buffer} xInOut - Buffer to convert
     */
    rgba2argb(xInOut: Buffer): void;
    /**
     * Merge Configurations
     *
     * @param {Record<any, any>} target - Target Object
     * @param {Record<any, any>} sources - Source Object
     * @returns {Record<any, any>} - merged object
     */
    mergeConfig(target: Record<any, any>, ...sources: Record<any, any>[]): Record<any, any>;
    /**
     * Validate configuration
     *
     * @param {IconzConfigCollection} config - main configuration object
     */
    validateConfig(config: IconzConfigCollection): void;
    /**
     * Check if path is absolute
     *
     * @param {string} str - path to check
     * @returns {boolean} - if path is absolute
     */
    isAbsolutePath(str: string): boolean;
    /**
     * Check if path is relative
     *
     * @param {string} str - path to check
     * @returns {boolean} - if path is relative
     */
    isRelativePath(str: string): boolean;
    /**
     * returns appropriate path based upon platform
     *
     * @returns {path.Platform} - platform
     */
    path(): path.PlatformPath;
    /**
     * returns appropriate path based upon platform
     *
     * @returns {path.PlatformPath} - platform
     */
    static path(): path.PlatformPath;
    /**
     * Add Icon configuration
     *
     * @param {string} key - name of icon configuration
     * @param {IconzConfig} config - Iconz Config object
     */
    addIconConfig(key: string, config: IconzConfig): void;
    /**
     * Add action for source image
     *
     * @see https://sharp.pixelplumbing.com/api-operation for all operations
     * @param {IconzImageActionName} cmd - The command to be run
     * @param {any[]} args - optional arguments
     * @returns {this} - Iconz class
     */
    addAction(cmd: IconzImageActionName, ...args: any[]): this;
    /**
     * Convert hex string into colour object
     *
     * @param {string} hex - input hex string
     * @returns {IconzColour} - Colour object
     */
    bgHexToObj(hex: string): IconzColour;
    /**
     * Convert colour object into hex string
     *
     * @param {IconzColour} obj - Colour object to convert
     * @returns {string} - Hex string in the format #RRGGBBAA
     */
    bgObjToHex(obj: IconzColour): string;
    /**
     * Generate width and height string from size
     *
     * @param {string|number} size - input size as single or two dimensions
     * @returns {number[]} - returns an array containing with and height
     */
    generateWidthAndHeightFromSize(size: string | number): number[];
    /**
     * Prepare target path from options
     *
     * @param {Record<string, any>} options - target path options
     * @returns {string} - target filepath
     */
    generateTargetFilepathFromOptions(options: Record<string, any>): string;
    /**
     * create a hash to be used as folder name based upon data
     *
     * @param {string} data - the data string to be hashed
     * @param {number} len - length of hash (in bytes)
     * @returns {string} - output hash
     */
    createHash(data: string, len?: number): string;
    /**
     * Get options for image processor
     *
     * @param {keyof IconzOptions} name - key of the IconzOptions object
     * @param {boolean} clone - if the options are to be cloned
     * @returns {Promise<IconzInputOptions|IconzResizeOptions|IconzOutputOptions|undefined>} - returns IconzOptions object
     */
    getOptions<T>(name: keyof IconzOptions, clone?: boolean): Promise<T | undefined>;
    /**
     * Get Input options for sharp
     *
     * @param {boolean} clone - if the options are to be cloned
     * @returns {Promise<IconzInputOptions|undefined>} - IconzInputOptions object
     */
    getInputOptions<T extends IconzInputOptions>(clone?: boolean): Promise<T | undefined>;
    /**
     * Get Output options for sharp
     *
     * @param {boolean} clone - if the options are to be cloned
     * @returns {Promise<IconzOutputOptions|undefined>} - IconzOutputOptions object
     */
    getOutputOptions<T extends IconzOutputOptions>(clone?: boolean): Promise<T | undefined>;
    /**
     * Get Resize options for sharp
     *
     * @param {boolean} clone - if the options are to be cloned
     * @returns {Promise<IconzResizeOptions|undefined>} - IconzResizeOptions object
     */
    getResizeOptions<T extends IconzResizeOptions>(clone?: boolean): Promise<T | undefined>;
    /**
     * prepare absolute path
     *
     * @param {string} folder - input path
     * @returns {string} - resulting absolute path
     */
    absoluteFolderPath(folder: string): string;
    /**
     * Convert date to a date object to be used with parser
     *
     * @param {Date} date - date to convert to object
     * @returns {Record<string,any>} - date object
     */
    static dateToObject(date?: Date): Record<string, any>;
    /**
     * Prepare all images ready for icons
     *
     * @returns {Promise<IconzReport>} - Iconz Report
     */
    prepareAllSizedImages(): Promise<IconzReport>;
    /**
     * convert configuration into options and target folder name for temp folder
     *
     * @param {IconzConfig} config - Configuration Object
     * @param {string} basePath - base path
     * @param {Record<string, any>} additionalArgs - additional arguments
     * @yields {{target: string, options: IconzResizeOptions}} - object of options
     */
    configToOptions(config: IconzConfig, basePath?: string, additionalArgs?: Record<string, any>): AsyncGenerator<{
        target: string;
        options: IconzResizeOptions;
    }>;
    /**
     * This is used to find relative file paths
     *
     * @param {string} substr - substring to search for
     * @param {string[]} arr - this is an array of strings to search in
     * @returns {string[]} - a list of strings that have substring in them
     */
    searchArrayForSubstring(substr: string, arr: string[]): string[];
    /**
     * returns nested value by path
     *
     * @param {Record<any, any>} nestedObject - object to be searched
     * @param {string} pathString - path to search
     * @returns {*} - returns any type
     */
    static getNestedByPath(nestedObject: Record<any, any>, pathString: string): any;
    /**
     * generate a blank report
     *
     * @returns {IconzReport} - empty report
     */
    static newReport(): IconzReport;
    /**
     * to check if dot based object path is valid
     *
     * @param {string} path - dot based object path
     * @returns {boolean} - if path is valid
     */
    static isValidPath(path: string): boolean;
    /**
     * parse template with {{variable}} handlebars
     *
     * @param {string} template - template to parse
     * @param {Record<string, any>} values - object containing key value pairs
     * @param {Record<string, any>} removeUndefined - to remove handlebars if not found
     * @returns {string} - parsed string
     */
    parseTemplate(template: string, values: Record<string, any>, removeUndefined?: boolean): string;
    /**
     * returns the largest size as an object. To be used when parsing output filename
     *
     * @param {(string|number)[]} sizes - Array of sizes
     * @returns {{ size: string, width: string, height: string, dims: string }} - object containing the dimensions
     */
    getLargestSize(sizes: (string | number)[]): {
        size: string;
        width: string;
        height: string;
        dims: string;
    };
    /**
     * Pulls the appropriate files from the report
     *
     * @param {IconzConfig} config - Iconz Configuration
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<{outputDir: string, chosenFiles: string[]}>} - Promise with output directory and chosen files
     */
    getChosenFilesForIcon(config: IconzConfig, report: IconzReport): Promise<{
        outputDir: string;
        chosenFiles: string[];
    }>;
    /**
     * Generate ico files
     *
     * @param {IconzConfig} config - Iconz Configuration
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<string>} - Promise with new filename
     */
    icoGenerator(config: IconzConfig, report: IconzReport): Promise<string>;
    /**
     * Icns Generator (MacOS)
     *
     * @param {IconzConfig} config - Iconz Configuration
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<string>} - Promise with new filename
     */
    icnsGenerator(config: IconzConfig, report: IconzReport): Promise<string>;
    /**
     * PNG Generator
     *
     * @param {IconzConfig} config - Iconz Configuration
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<string[]>} - Promise with new filenames
     */
    pngGenerator(config: IconzConfig, report: IconzReport): Promise<string[]>;
    /**
     * JPEG Generator
     *
     * @param {IconzConfig} config - Iconz Configuration
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<string[]>} - Promise with new filenames
     */
    jpegGenerator(config: IconzConfig, report: IconzReport): Promise<string[]>;
    /**
     * Generate all icons based upon report results
     *
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<IconzReport>} - Iconz Report
     */
    generateIcons(report: IconzReport): Promise<IconzReport>;
    /**
     * Remove temporary folders which were generated to separate same sized images but different config options
     *
     * @param {IconzReport} report - Iconz Report
     * @returns {Promise<IconzReport>} - Iconz Report
     */
    removeTemporaryFolders(report: IconzReport): Promise<IconzReport>;
    /**
     * Generate all icons
     *
     * @returns {Promise<IconzReport>} - returns promise with report
     */
    run(): Promise<IconzReport>;
}
export { Iconz };
export default Iconz;
