#!/usr/bin/env node

const { Iconz } = require('../dist');
const fs = require('fs');

/** convert command line arguments to object */
const argv = require('minimist')(process.argv.slice(2));

const usage = () => `
Iconz - Icon Generator for the Web

Minimum Usage: 
  iconz -i <input_filename>               This will generate the default icons. See README.md for further information.
  
Example:

  iconz -i my-image.jpg --ico=favicon     Generates favicon.ico in the same folder as my-image.jpg
  iconz -i icon.svg -t ./icons            Generates all the default icons, also keeps the temporary pngs in icons folder 
                                            (relative to my image.jpg) formatted WxH.png (e.g 32x32.png)

Input Options:

  --help,                                 Help
                                          
  -i <input_filename>                     Input image (.jpg, .png, .webp, .avif, .gif, .svg, .tiff) or icon (.ico)
                                          
  --fit=<fit_type>                        Fit type (contain is default) options are cover, contain, fill, inside, outside
  --position=<position>                   Position (default is centre) options are top, right_top, right, right_bottom, 
                                            bottom, left_bottom, left, left_top, centre
  --kernel=<kernel_type>                  Resizing Interpolation kernel (default is mitchell) options are nearest, cubic,
                                            mitchell, lanczos2, lanczos3     
  --no-enlargement                        Disable Enlarging images that are smaller than specified output dimensions  
  --no-fast-shrink                        Disable Fast shrink (useful if output images have slight moire pattern)
  --bg=<RRGGBB or RRGGBBAA>               Sets the background colour (Hexadecimal)
  --action=<action_name>[,<parameters>]   Adds an action to be applied to the input image along with optional
                                            PLEASE NOTE, DO NOT ADD SPACES ANYWHERE IN ACTION!!
                                            Examples : 
                                              --action=flip
                                              --action=sharpen,2,1.0,2.0 
                                              --action=convolve,{width:3,height:3,kernel:[-1,0,1,-2,0,2,-1,0,1]} 
                                              --action=modulate,{brightness:2,hue:180,saturation:0.5}                      
                                          
Output Options: 

  -f <output_folder>                      Base output folder (if not specified, will use the same folder as the input image
  -t <temp_folder>                        Temp folder (if not specified, will use system temp directory). If specified,
                                            will generate a folder of all the image sizes as pngs in format WxH.png
                                          
                                          <output_filename> can use the handlebars variables (e.g icon-{{dims}} 
                                            produces a filename like icon-128x96.png)
                                          
  --png=<output_filename>,24,48,128x96    Creates png icons (24x24, 48x48 and 128x96) (Overrides defaults)
  --ico=<output_filename>,16,32,64        Creates single ico file containing multiple size (Overrides defaults)
  --icns=<output_filename>,24,48,96       Creates single icns file containing multiple size (Overrides defaults)
  --jpeg=<output_filename>,64,96,120x80   Creates jpeg icons (64x64, 96x96 and 120x80) (Overrides defaults) 
                                          
  --report=<output_filename>              Outputs report to a file

`;

(async () => {
  try {
    const keys = Object.keys(argv);

    if (keys.length < 2 || keys.includes('help')) {
      /** If no arguments were given, display usage guide, then exit. */
      console.log(usage());
      process.exit(keys.includes('help') ? 0 : 1);
    }

    /** if there is a misconfiguration, warn */
    if (Object.keys(argv._.length) > 0) {
      console.log('The following items are misconfigurations, please fix!', { items: argv._ });
      process.exit(1);
    }

    /** create source folder */
    if (typeof argv.i !== 'string' || !fs.existsSync(argv.i)) {
      throw new Error('Invalid input filename');
    }

    /** set folder as src image folder by default */
    let folder = Iconz.path().dirname(argv.i);

    /** create target folder */
    if (keys.includes('f') && !(await fs.existsSync(argv.f))) {
      fs.mkdirSync(argv.f, { recursive: true });
      /** update folder */
      folder = argv.f;
    }

    /** starter configuration */
    const config = {
      src: argv.i,
      folder,
      options: {
        resize: {},
      },
    };

    /** add temp folder if specified */
    if (typeof argv.t === 'string') {
      config.tmpFolder = argv.t;
    }

    /** change fit type */
    if (keys.includes('fit')) {
      if (['cover', 'contain', 'fill', 'inside', 'outside'].includes(argv.fit)) {
        config.resize.fit = argv.fit;
      } else {
        throw new Error(`Invalid fit type ${argv.fit}`);
      }
    }

    /** change position */
    if (keys.includes('position')) {
      if (
        ['top', 'right_top', 'right', 'right_bottom', 'bottom', 'left_bottom', 'left', 'left_top', 'centre'].includes(
          argv.position,
        )
      ) {
        config.resize.position = argv.position.replace('_', ' ');
      } else {
        throw new Error(`Invalid position type ${argv.position}`);
      }
    }

    /** change kernel */
    if (keys.includes('kernel')) {
      if (['nearest', 'cubic', 'mitchell', 'lanczos2', 'lanczos3'].includes(argv.kernel)) {
        config.resize.kernel = argv.kernel;
      } else {
        throw new Error(`Invalid kernel type ${argv.kernel}`);
      }
    }

    /** if no enlargement has been chosen */
    if (keys.includes('no-enlargement')) {
      config.options.resize.withoutEnlargement = true;
    }

    /** if no enlargement has been chosen */
    if (keys.includes('no-fast-shrink')) {
      config.options.resize.fastShrinkOnLoad = false;
    }

    /** change background colour */
    if (keys.includes('bg')) {
      if (/^([0-9A-F]{6}|[0-9A-F]{8})/i.test(argv.bg)) {
        config.options.resize.background = Iconz.bgHexToObj(argv.bg);
      }
    }

    /** add all icon configurations */
    for (const type of ['jpeg', 'png', 'ico', 'icns']) {
      let count = 0;
      if (keys.includes(type)) {
        /** change to array if only one instance */
        if (typeof argv[type] === 'string') {
          argv[type] = [argv[type]];
        } else if (typeof argv[type] === 'boolean') {
          /** if boolean, Iconz will use default sizes */
          argv[type] = ['{{dims}}'];
        }

        /** loop through array and extract icon configurations */
        for (const key in argv[type]) {
          const icon = argv[type][key];
          const sizes = icon.split(',');
          const name = sizes.shift();
          config.icons ??= {};
          config.icons[`${type}_${count++}`] = {
            type,
            name,
            sizes,
            folder,
          };
        }
      }
    }

    /** add all actions */
    if (keys.includes('action')) {
      /** change to array if only one instance */
      if (typeof argv.action === 'string') {
        argv.action = [argv.action];
      }

      /** loop through actions */
      for (const action of argv.action) {
        /** split action into parts */
        const [cmd, argsString] = action.split(',', 2);
        /** split args and wrap in an array */
        const args = JSON.parse(`[${argsString}]`);
        config.actions ??= [];
        /** add action to queue */
        config.actions.push({ cmd, args });
      }
    }

    /** instantiate Iconz class */
    const iconz = new Iconz(config);

    /** generate icons */
    const report = await iconz.run();

    /** write report at end if requested */
    if (keys.includes('report')) {
      fs.mkdirSync(iconz.path().dirname(argv.report), { recursive: true });
      fs.writeFileSync(argv.report, JSON.stringify(report, null, 2));
    }
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
