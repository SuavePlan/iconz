# Iconz - Icon Generator for the Web

Convert a single image (.jpg, .png, .webp, .avif, .gif, .svg, .tiff) or icon (.ico) into various sized png, ico and icns
files automatically.

* [Installation](#Installation)
* [How to Use](#How to Use)
  * [Minimal Setup](#Minimal Setup)
  * [Custom Sizes](#Custom Sizes)
  * [Using Actions](#Using Actions)
  * [Advanced](#Advanced)
* [Configuration Layout](#Configuration Layout)
  * [Default Configuration](#Default Configuration)
* [Icon Configuration](#Icon Configuration)
  * [Hooks](#Hooks)
* [Output Filename parsing](#Output Filename parsing)
  * [Filename examples](#Filename examples)
# Installation

Node Package Manager (NPM)

    npm install iconz

Yarn

    yarn add iconz

# How to Use

## Minimal Setup

### import of class

```typescript
import {Iconz} from 'iconz';
```

or

```typescript
const {Iconz} = require('iconz');
```

### generates pre-determined default icon set

```javascript
/** Instantiate a new Iconz class */
const iconz = new Iconz({src: 'your-image.svg'});

(async () => {
  /** generate your icons */
  const report = await iconz.run();
  /** output the report */
  console.log(`Report: ${JSON.stringify(report, undefined, 2)}`);
})();
```

## Custom Sizes

### Using custom sizes instead of defaults

```javascript
const myIcons = {
  appIco: {
    type: 'ico',
    name: 'app',
    sizes: [16, 24, 32, 48, 64, 128, 256],
    folder: '.',
  },
  appIcns: {
    type: 'icns',
    name: 'app',
    sizes: [16, 32, 64, 128, 256, 512, 1024],
    folder: '.',
  },
  androidIcons: {
    type: 'png',
    name: 'android-chrome-{{dims}}',
    sizes: [36, 48, 72, 96, 144, 192, 256, 384, 512],
    folder: 'icons',
  }
}

const iconz = new Iconz({src: 'your-image.svg', icons: myIcons});

(async () => {
  /** generate your icons */
  const report = await iconz.run();
  /** output the report */
  console.log(`Report: ${JSON.stringify(report, undefined, 2)}`);
})();
```

## Using Actions

### See https://sharp.pixelplumbing.com/api-operation for more actions

```javascript
const iconz = new Iconz({src: 'your-image.svg'});

/** daisy-chain the actions to be applied to your import image */
iconz.addAction('blur', 3)
  .addAction('negate', true)
  .addAction('flip');

(async () => {
  /** generate your icons */
  const report = await iconz.run();
  /** output the report */
  console.log(`Report: ${JSON.stringify(report, undefined, 2)}`);
})();
```

## Advanced

### Generating multiple colourSpace jpg files alongside png icons

```javascript
const iconz = new Iconz({
  src: validImagePath,
  /** use temporary folder for testing purposes */
  folder: folder,
  tmpFolder: folder,
  icons: {
    rgb: {
      type: 'png',
      name: 'rgb-{{dims}}',
      sizes: [128, 256, 512, 1024],
      hooks: {
        /** apply hook before resize */
        postResize: (
          self,
          image,
          options,
          targetFilename,
          imageReport
        ) => {
          return new Promise((resolve, reject) => {
            (async () => {
              try {
                /** get folder for output */
                const dir = self.getConfig().folder;

                /** colourSpaces to test */
                const colourSpace = {
                  cmyk: [],
                  'b-w': [],
                  srgb: [],
                  hsv: [],
                  lab: [],
                  xyz: [],
                };

                /** loop through each colourSpace type and create images */
                for (const type of Object.keys(colourSpace)) {
                  /** new filename with dimensions */
                  const filename = `${type}-${options.width}x${options.height}.jpg`;

                  /** directory based upon colourSpace type */
                  const dirname = iconz.path().join(dir, type);

                  /** set target path */
                  const target = iconz.path().join(dirname, filename);

                  /** prepare image */
                  await image
                    .clone() /** image is cloned to ensure original is left untouched */
                    .toColorspace(type)
                    .jpeg({
                      chromaSubsampling: '4:4:4', quality: 100
                    })
                    .toBuffer()
                    .then((data) => {
                      /** make directory */
                      fs.mkdirSync(dirname, {recursive: true});
                      /** write image */
                      fs.writeFileSync(target, data);
                      /** generate report results */
                      imageReport.jpg ??= colourSpace;
                      imageReport.jpg[type].push(target);
                    })
                    .catch(() => {
                      /** if image failed, add it to the report */
                      imageReport.failed[target] = `${type} jpeg failed`;
                    });
                }
                /** promise resolves image */
                resolve(image);
              } catch (error) {
                /** promise rejects error */
                reject(error);
              }
            })();
          });
        },
      },
    },
  },
});

(async () => {
  /** generate report */
  const report = await iconz.run().catch((e) => e.message);
  console.log(`Report: ${JSON.stringify(report, undefined, 2)}`);
})();
```

## Configuration Layout

```typescript
interface IconzConfigCollection {
  /**
   * This is the image you wish to use as a template
   * @var src
   */
  src?: string;

  /**
   * This is the base folder for all generated icons
   *
   * If left blank, it will use the directory of your
   * source image
   *
   * @var folder
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
   * @var tmpFolder
   */
  tmpFolder?: string;

  /**
   * These options are based upon the sharp library parameter 'options'
   * For Input See: https://sharp.pixelplumbing.com/api-constructor#parameters
   * For Resizing See: https://sharp.pixelplumbing.com/api-resize#parameters
   * For Output See: https://sharp.pixelplumbing.com/api-output#png
   *
   * @var options
   */
  options?: IconzOptions;

  /**
   * This is an optional object containing the configuration
   * for each type of icon set you wish to generate.
   *
   * If left blank, the defaults will be used
   *
   * @var icons
   */
  icons?: IconzIconConfig;
}
```

## Default Configuration

### This is the default configuration to generate icons

```typescript
const defaultConfig: IconzConfigCollection = {
  options: {
    input: <IconzInputOptions>{
      density: 150,
    },
    resize: <IconzResizeOptions>{
      fit: 'cover',
      background: {r: 0, g: 0, b: 0, alpha: 0},
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
    faviconpng: {
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
        background: {r: 0, g: 0, b: 0, alpha: 1},
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

```

## Icon Configuration

###               

```typescript

/**
 * These are the valid icon types for the configuration
 */
type IconzType = 'png' | 'ico' | 'icns';

/**
 * This is the icon configuration layout
 */
interface IconzConfig {
  /**
   * This is the type of icon you wish to use
   * it must be either png, ico or icns
   * @var type
   */
  type: IconzType;

  /**
   * This is the name of the file you wish to use
   * it is parsed using the handlebars syntax.
   *
   * for an image with the size '24x18' the name
   * would be as follows:
   * @example 'icon-{{size}}' resolves to 'icon-24x18'
   * @example 'icon-{{dims}}' resolves to 'icon-24x18'
   * @example 'icon-{{width}}' resolves to 'icon-24'
   * @example 'icon-{{height}}' resolves to 'icon-18'
   *
   * If the size is set as a single number,
   * e.g 24, the {{dims}} variable returns 24x24,
   * however, the {{size}} variable would just return 24.
   *
   * @example 'icon-{{size}}' resolves to 'icon-24'
   * @example 'icon-{{dims}}' resolves to 'icon-24x24'
   * @example 'icon-{{width}}' resolves to 'icon-24'
   * @example 'icon-{{height}}' resolves to 'icon-24'
   *
   * @var name
   */
  name: string;

  /**
   * This is an array of sizes, whether as an integer
   * or a string.
   *
   * As a string you can either just use a single number
   * @example '56' - which will be both the width and height
   *
   * Or if the width differs from the height, use the following format
   * @example '120x80' which means the width 120 and height of 80.
   *
   * @var sizes
   */
  sizes: (string | number)[];

  /**
   * This is the folder you wish to store the images
   * generated from this configuration.
   *
   * If left blank, it will use the default folder
   * from the main configuration.
   *
   * @var folder
   */
  folder?: string;

  /**
   * These resizing options are ones from the sharp library,
   * and are applied when resizing the icons.
   *
   * If left blank, defaults will be chosen
   *
   * @see https://sharp.pixelplumbing.com/api-resize
   *
   * @example
   * {
   *   position: 'centre', fit: 'contain', kernel: 'mitchell',
   *   background: { r: 255, g: 127, b: 0, alpha: 0.5 }
   * }
   *
   * @var options
   */
  options?: IconzResizeOptions;

  /**
   * The hooks section is optional, but should you wish
   * to alter any of the icons during generation, the following
   * hooks can be used.
   *
   * @hook preResize - This runs just before the image
   * is resized and converted to png
   *
   * @hook postResize - This is after the conversion,
   * but before conversion to a buffer and saved to a file
   *
   * If you wish for the system to stop processing the image
   * after your hook, you must use
   * resolve(undefined) instead of resolve(image) within the promise
   *
   * @hooks
   */
  hooks?: IconzHooks;

  /**
   * should you wish to temporarily disable a single configuration
   * set the enabled var to false
   * @example enabled: false
   *
   * @var enabled
   */
  enabled?: boolean;
}
```

## Hooks

### For use with Icon Configuration

```typescript
/**
 * These are the available hooks
 */
export interface IconzHooks {
  preResize?: IconzResizeHook;
  postResize?: IconzResizeHook;
}

/**
 *
 * This is for the pre and post resizing hook methods
 *
 * PLEASE NOTE!!! resolve(image) MUST be called within your promise
 * for the system to continue processing it.
 *
 * @example
 *
 * const myHook = (self,image,options,targetFilename,imageReport) => {
 *   image.modulate({ brightness: 2 });
 *   Promise.resolve(image);
 * }
 *
 * HOWEVER!!! resolve(undefined) will ensure the system
 * does NOT process the image further.
 *
 * @example
 *
 * const myHook = (self,image,options,targetFilename,imageReport) => {
 *  image.blur(4).jpeg().toBuffer()
 *    .then((data) => fs.writeFileSync('myFile.jpg', data));
 *  Promise.resolve(undefined);
 * }
 *
 */

type IconzResizeHook = (
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
```

## Output Filename parsing

### use handlebar variables on your output filenames.

#### Below are some available to use and examples of their values

Global Counter

```text
{{counter}} - result is an incremental counter (global)
```

Image Dimensions

```text
{{dims}} - returns dimensions such as 180x50 or 1024x768 or 50x50
{{size}} - this is whatever you placed in your sizes array, such as 48 or 96 or 150x30
{{width}} - the width of the icon
{{height}} - the height of the icon
```

Configuration of the current image being created 

```text
{{config.type}} - Type of icon being generated (png, ico, icns or jpeg)
{{config.name}} - The unparsed name of the file e.g. icon-{{size}}
{{config.sizes.0}} - First image in sizes
{{config.folder}} - Folder specified as output folder
```
(See: [Sharp Image Processor Resize Options](https://sharp.pixelplumbing.com/api-resize#metadata))
```text
{{config.options.fit}} - Resize fit type
{{config.options.position}} - Resize position type
{{config.options.kernel}} - Resize kernel
...
For more, see link above.
```

Date per image creation

```text
{{date.epoch}} - Seconds since epoch
{{date.date}} - YYYYMMDD format
{{date.datemtime}} - YYYYMMDDHHmmSSMIL format
{{date.datetime}} - YYYYMMDDHHmmSS format
{{date.mtime}} - HHmmSSMIL (MIL = Milliseconds) format
{{date.time}} - HHmmSS format
{{date.offset}} - Timezone Offset
{{date.year}} - Year (4 digit)
{{date.month}} - Month (2 digit)
{{date.day}} - Day of the month (2 digit)
{{date.dow}} - (Day of the week 0 - 6)
{{date.hour}} - Hour (2 digit)
{{date.minute}} - Minute (2 digit)
{{date.second}} - Seconds (2 digit)
{{date.millisecond}} - Milliseconds (3 digit 000-999)
```

Start date before all images created

```text
{{start.epoch}} - Seconds since epoch
{{start.date}} - YYYYMMDD format
{{start.datemtime}} - YYYYMMDDHHmmSSMIL format
{{start.datetime}} - YYYYMMDDHHmmSS format
{{start.mtime}} - HHmmSSMIL (MIL = Milliseconds) format
{{start.time}} - HHmmSS format
{{start.offset}} - Timezone Offset
{{start.year}} - Year (4 digit)
{{start.month}} - Month (2 digit)
{{start.day}} - Day of the month (2 digit)
{{start.dow}} - (Day of the week 0 - 6)
{{start.hour}} - Hour (2 digit)
{{start.minute}} - Minute (2 digit)
{{start.second}} - Seconds (2 digit)
{{start.millisecond}} - Milliseconds (3 digit 000-999)
```

Environment variables from process.env
(See: [NodeJS process.env](https://nodejs.org/dist/latest-v16.x/docs/api/process.html#process_process_env))

```text
{{env.USER}} - Current user
{{env.PATH}} - Environment Path
...
For more, see link above.
```

Meta Information from original image
(See: [Sharp Image Processor Metadata](https://sharp.pixelplumbing.com/api-input#metadata))

```text
{{meta.format}} - Name of decoder used to decompress image data e.g. jpeg, png, webp, gif, svg
{{meta.pages}} - Number of pages/frames contained within the image, with support for TIFF, HEIF, PDF, animated GIF and animated WebP
...
For more, see link above.
```

Stats Information from original image
(See: [Sharp Image Processor Stats](https://sharp.pixelplumbing.com/api-input#stats))

```text
{{stats.isOpaque}} - Is the image fully opaque? Will be true if the image has no alpha channel or if every pixel is fully opaque.
{{stats.channels.sum}} - Sum of all values in a channel
...
For more, see link above.
```

### Filename examples

```text
my-icon-{{dims}} -> my-icon-48x54.png
```
```text
icon-{{counter}} -> icon-0.png
```
```text
favicon-{{env.USER}}-{{date.date}}_{{date.time}} -> favicon-admin-20210718_233500.png
```
```text
favicon-{{env.USER}}-{{date.date}}_{{date.time}} -> favicon-admin-20210718_233500.png
```
```text
icon-{{config.options.fit}}-{{counter}} -> icon-cover-0.png
```
