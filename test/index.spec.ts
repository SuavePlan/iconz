import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import sinon, { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.use(sinonChai);
const { expect, assert } = chai;
import sharp, { ResizeOptions } from 'sharp';
import dummyData from './data/dummyData';
import {
  Iconz,
  IconzConfig,
  IconzImage,
  IconzReport,
  IconzResizeOptions,
  defaultConfig,
  IconzInputOptions,
} from '../src';

const validImagePath = path.join(__dirname, 'images', 'icon.svg');
const validIcoPath = path.join(__dirname, 'images', 'icon.ico');

const randomHex = () => crypto.randomBytes(16).toString('hex');
const randomFolder = () => Iconz.path().join(os.tmpdir(), randomHex());

const folderName = randomFolder();
const tempFolderName = randomFolder();

// set density lower for tests
(<IconzInputOptions>defaultConfig.options.input).density = 72;

// main tests
describe('Iconz', () => {
  describe('new Iconz()', () => {
    it('no config', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz();
      }, 'config is missing');
    });

    it('invalid file path', () => {
      assert.throws(() => {
        new Iconz({ src: './test.png' });
      }, 'Source image not found');
    });

    it('should pass with valid path', () => {
      assert.equal(
        new Iconz({ src: validImagePath }) instanceof Iconz,
        true,
        'Instantiation with valid path should pass',
      );
    });

    it('invalid folder', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ src: validImagePath, folder: {} });
      }, 'Invalid folder name');
    });

    it('icons config as string', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ src: validImagePath, icons: 'string' });
      }, 'Icon configuration is invalid');
    });

    it('icons config as number', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ src: validImagePath, icons: 1 });
      }, 'Icon configuration is invalid');
    });

    it('icons config as empty object', () => {
      assert.throws(() => {
        new Iconz({ src: validImagePath, icons: {} });
      }, 'Icon configuration not set');
    });

    it('temp folder as null', () => {
      assert.throws(() => {
        new Iconz({ src: validImagePath, tmpFolder: null });
      }, 'Invalid temp folder');
    });

    it('temp folder as number', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ src: validImagePath, tmpFolder: 1 });
      }, 'Invalid temp folder');
    });

    it('temp folder as empty object', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ src: validImagePath, tmpFolder: {} });
      }, 'Invalid temp folder');
    });

    it('temp folder as empty string', () => {
      assert.doesNotThrow(() => {
        new Iconz({ src: validImagePath, tmpFolder: '' });
      }, 'Instantiation with invalid temp folder should fail');
    });
  });

  describe('validateConfig()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('validateConfig(null)', () => {
      assert.throws(() => {
        iconz.validateConfig(null);
      }, 'Invalid configuration');
    });

    it('validateConfig with invalid src', () => {
      const testStub = stub(fs, <any>'existsSync');
      testStub.returns(false);

      assert.throws(() => {
        iconz.validateConfig({ src: validImagePath });
      }, 'Source image not found');

      testStub.restore();
    });

    it('validateConfig (unable to mkdirSync)', () => {
      const testStub = stub(fs, <any>'mkdirSync');
      testStub.throws(new Error());

      expect(() => {
        iconz.validateConfig({ src: validImagePath, folder: folderName });
      }, 'should throw error').to.not.throw('Invalid configuration');
      testStub.restore();
    });

    it('validateConfig tmpFolder (unable to mkdirSync)', () => {
      const testStub = stub(fs, <any>'mkdirSync');
      testStub.throws(new Error());

      expect(() => {
        iconz.validateConfig({ src: validImagePath, folder: folderName, tmpFolder: tempFolderName });
      }, 'should throw error').to.not.throw('Invalid configuration');
      testStub.restore();
    });

    it('validateConfig icons not an object', () => {
      const testStub = stub(fs, <any>'mkdirSync');
      testStub.returns(true);

      expect(() => {
        // @ts-ignore
        iconz.validateConfig({ src: validImagePath, folder: folderName, tmpFolder: tempFolderName, icons: 'test' });
      }, 'should throw error').to.throw('Icon configuration is invalid');
      testStub.restore();
    });

    it('validateConfig icons empty', () => {
      const testStub = stub(fs, <any>'mkdirSync');
      testStub.returns(true);
      expect(() => {
        iconz.validateConfig({ src: validImagePath, folder: folderName, tmpFolder: tempFolderName, icons: {} });
      }, 'should throw error').to.throw('Icon configuration not set');
      testStub.restore();
    });

    it('validateConfig not relative or absolute path', () => {
      const testStubs = [
        stub(iconz, <any>'isAbsolutePath').returns(false),
        stub(iconz, <any>'isRelativePath').returns(false),
      ];
      expect(() => {
        iconz.validateConfig({ src: validImagePath, folder: folderName, tmpFolder: tempFolderName, icons: {} });
      }, 'should throw error').to.throw('Invalid temp folder name');

      for (const testStub of testStubs) testStub.restore();
    });

    it('validateConfig mkdirSync error', () => {
      const testStubs = [stub(fs, <any>'existsSync'), stub(fs, <any>'mkdirSync').throws(new Error())];
      testStubs[0].withArgs(folderName).returns(false).withArgs(validImagePath).returns(true);

      expect(() => {
        iconz.validateConfig({ src: validImagePath, folder: folderName, tmpFolder: tempFolderName, icons: {} });
      }, 'should throw error').to.throw(/^Unable to create folder/);

      for (const testStub of testStubs) testStub.restore();
    });
  });

  describe('addIconConfig()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('with no parameters passed', () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.addIconConfig();
      }, 'Invalid config name');
    });

    it('with invalid name passed ( object )', () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.addIconConfig({});
      }, 'Invalid config name');
    });

    it('with invalid name passed (empty string)', () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.addIconConfig('');
      }, 'Invalid config name');
    });

    it('with valid name passed, but no config', () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.addIconConfig('test');
      }, 'Config is invalid');
    });

    it('with valid name passed, empty config', () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.addIconConfig('test', {});
      }, 'Config is invalid');
    });

    it('with valid name passed, valid config', () => {
      assert.doesNotThrow(() => {
        iconz.addIconConfig('test', {
          enabled: true,
          folder: './',
          name: 'favicon-{{size}}',
          sizes: [32, 57, 72, 96, 120, 128, 144, 152, 195, 228],
          type: 'png',
        });
      }, 'Config is invalid');
    });
  });

  describe('mergeConfig()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('single level', async () => {
      assert.deepStrictEqual(iconz.mergeConfig({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
    });

    it('two levels', async () => {
      assert.deepStrictEqual(iconz.mergeConfig({ a: 1, c: { d: 4 } }, { b: 2, c: { e: 5 } }), {
        a: 1,
        b: 2,
        c: { d: 4, e: 5 },
      });
    });

    it('two levels with arrays', async () => {
      assert.deepStrictEqual(
        iconz.mergeConfig(
          { a: 1, c: { d: 4, f: [1, 2, 3, 4] } },
          {
            b: 2,
            c: { e: 5, f: [5, 6, 7, 8] },
          },
        ),
        {
          a: 1,
          b: 2,
          c: { d: 4, e: 5, f: [1, 2, 3, 4, 5, 6, 7, 8] },
        },
      );
    });

    it('two levels with duplicates', async () => {
      assert.deepStrictEqual(
        iconz.mergeConfig(
          { a: 1, c: { d: 4, f: [1, 2, 3, 4, 5] } },
          {
            b: 2,
            c: { e: 5, f: [4, 5, 6, 7, 8] },
          },
        ),
        {
          a: 1,
          b: 2,
          c: { d: 4, e: 5, f: [1, 2, 3, 4, 5, 6, 7, 8] },
        },
      );
    });

    it('two levels empty object', async () => {
      assert.deepStrictEqual(iconz.mergeConfig({ a: 1, c: { d: 4, f: [1, 2, 3, 4, 5] } }, { b: 2, c: {} }), {
        a: 1,
        b: 2,
        c: {},
      });
    });
  });

  describe('getConfig()', () => {
    it('clone is false', () => {
      const iconz = new Iconz({ src: validImagePath });
      assert.equal(
        iconz.getConfig(false).src === validImagePath &&
          (iconz.getConfig(false).src = 'testing') &&
          iconz.getConfig(false).src === 'testing',
        true,
        'should return testing',
      );
    });
    it('no options', () => {
      const iconz = new Iconz({ src: validImagePath });
      assert.equal(
        iconz.getConfig().src === validImagePath &&
          (iconz.getConfig().src = 'testing') &&
          iconz.getConfig().src === validImagePath,
        true,
        `should return ${validImagePath}`,
      );
    });
  });

  describe('getInputOptions()', () => {
    it('clone is false', async () => {
      const iconz = new Iconz({ src: validImagePath });

      assert.equal(
        (await iconz.getInputOptions(false)).density === 72 &&
          ((await iconz.getInputOptions(false)).density = 300) &&
          (await iconz.getInputOptions(false)).density === 300,
        true,
        'should return 300',
      );
    });

    it('no options', async () => {
      const iconz = new Iconz({ src: validImagePath });

      assert.equal(
        (await iconz.getInputOptions()).density === 72 &&
          ((await iconz.getInputOptions()).density = 300) &&
          (await iconz.getInputOptions()).density === 72,
        true,
        'should return 72',
      );
    });
  });

  describe('absoluteFolderPath()', () => {
    // prepare new Iconz instance
    const iconz = new Iconz({ src: validImagePath });

    const absolutePath = iconz.path().join(iconz.path().dirname(validImagePath), 'test');

    it('using relative path', async () => {
      assert.equal(iconz.absoluteFolderPath('test'), absolutePath);
    });

    it('using relative path', async () => {
      assert.equal(iconz.absoluteFolderPath(path.join('.', 'test')), absolutePath);
    });

    it('using absolute path', async () => {
      assert.equal(iconz.absoluteFolderPath('./test'), absolutePath);
    });

    it('fixing relative path', async () => {
      const iconz = new Iconz({ src: validImagePath, folder: '.' });
      expect(iconz.absoluteFolderPath('./test') === iconz.path().join(process.cwd(), 'test'));
    });
  });

  describe('generateTargetFilepathFromOptions()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('using options', () => {
      expect(
        iconz.generateTargetFilepathFromOptions(
          <ResizeOptions>dummyData.defaultImageResponse[dummyData.defaultImageResponse.length - 1],
        ),
      ).to.eq('ba81e4e7/128x96');
    });
  });

  describe('generateWidthAndHeightFromSize()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('using integer', () => {
      assert.deepStrictEqual(iconz.generateWidthAndHeightFromSize(1), [1, 1], 'should be equal');
    });
  });

  describe('getChosenFilesForIcon()', () => {
    const iconz = new Iconz({ src: validImagePath });
    const config = <IconzConfig>dummyData.config.icons.icns;
    const report = <IconzReport>dummyData.report;

    it('no parameters', async () => {
      // @ts-ignore
      assert.equal(typeof (await iconz.getChosenFilesForIcon().catch((e) => e.message)), 'string', 'Promise reject');
    });

    it('with parameters', async () => {
      const chosen = await iconz.getChosenFilesForIcon(config, report);

      assert(typeof chosen === 'object', 'should return object');
      assert.deepStrictEqual(Object.keys(chosen), ['outputDir', 'chosenFiles'], 'returns object');
      assert.deepStrictEqual(typeof chosen.outputDir, 'string', 'returns object');
      assert(Array.isArray(chosen.chosenFiles), 'returns object');
    });

    it('with parameters (without folder)', async () => {
      const configWithoutFolder = <IconzConfig>iconz.clone(config);
      // remove folder for test
      delete configWithoutFolder.folder;

      const chosen = await iconz.getChosenFilesForIcon(configWithoutFolder, report);

      assert(typeof chosen === 'object', 'should return object');
      assert.deepStrictEqual(Object.keys(chosen), ['outputDir', 'chosenFiles'], 'returns object');
      assert.deepStrictEqual(typeof chosen.outputDir, 'string', 'returns object');
      assert(Array.isArray(chosen.chosenFiles), 'returns object');
    });
  });

  describe('getLargestSize()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('no parameters', async () => {
      // @ts-ignore
      expect(() => iconz.getLargestSize()).to.throw('sizes not defined');
    });
    it('empty array', async () => {
      expect(() => iconz.getLargestSize([])).to.throw('sizes is empty');
    });
    it('invalid parameter type', async () => {
      // @ts-ignore
      expect(() => iconz.getLargestSize('123')).to.throw('sizes must be an array');
    });
    it('0 as a size', async () => {
      expect(() => iconz.getLargestSize([0])).to.throw('no size found');
    });

    it('with 24 and 2', async () => {
      expect(iconz.getLargestSize(['24', '2'])).to.deep.eq({ size: '24', width: '24', height: '24', dims: '24x24' });
    });

    it('with 11x10 and 2x22', async () => {
      expect(iconz.getLargestSize(['11x10', '2x22'])).to.deep.eq({
        size: '11x10',
        width: '11',
        height: '10',
        dims: '11x10',
      });
    });

    it('with 1x10 and 2x22', async () => {
      expect(iconz.getLargestSize(['1x10', '2x22'])).to.deep.eq({
        size: '2x22',
        width: '2',
        height: '22',
        dims: '2x22',
      });
    });

    it('with 1x10, 2x22 and 50', async () => {
      expect(iconz.getLargestSize(['1x10', '2x22', '50'])).to.deep.eq({
        size: '50',
        width: '50',
        height: '50',
        dims: '50x50',
      });
    });
  });

  describe('bgHexToObj()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('with invalid hex (number)', async () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.bgHexToObj(0);
      }, 'Invalid hex, should be #AAFF00 (rgb) or #AAFF0022 (rgba) format');
    });
    it('with invalid hex ( object )', async () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.bgHexToObj({});
      }, 'Invalid hex, should be #AAFF00 (rgb) or #AAFF0022 (rgba) format');
    });

    it('with invalid hex (#F00)', async () => {
      assert.throws(() => {
        iconz.bgHexToObj('#F00');
      }, 'Invalid hex, should be #AAFF00 (rgb) or #AAFF0022 (rgba) format');
    });

    it('with invalid hex (#F00Z00)', async () => {
      assert.throws(() => {
        iconz.bgHexToObj('#F00Z00');
      }, 'Invalid hex, should be #AAFF00 (rgb) or #AAFF0022 (rgba) format');
    });

    it('with valid hex (#F00000)', async () => {
      assert.deepStrictEqual(iconz.bgHexToObj('#F00FFF'), { r: 240, g: 15, b: 255, alpha: 1 }, 'should return object');
    });

    it('with valid hex and alpha (#F0000070)', async () => {
      assert.deepStrictEqual(
        iconz.bgHexToObj('#F00FFF70'),
        {
          r: 240,
          g: 15,
          b: 255,
          alpha: 0.44,
        },
        'should return object',
      );
    });

    it('with valid hex and alpha (#F00FFFFF)', async () => {
      assert.deepStrictEqual(
        iconz.bgHexToObj('#F00FFFFF'),
        { r: 240, g: 15, b: 255, alpha: 1 },
        'should return object',
      );
    });

    it('with valid hex and alpha (#F00FFF00)', async () => {
      assert.deepStrictEqual(
        iconz.bgHexToObj('#F00FFF00'),
        { r: 240, g: 15, b: 255, alpha: 0 },
        'should return object',
      );
    });
  });

  describe('bgObjToHex()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('with invalid object (number)', () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.bgObjToHex(0);
      }, 'Invalid background object');
    });
    it('with invalid object (empty)', () => {
      assert.throws(() => {
        iconz.bgObjToHex({});
      }, 'Invalid background object');
    });

    it('with invalid object (missing alpha)', () => {
      assert.throws(() => {
        iconz.bgObjToHex({ r: 1, g: 1, b: 1 });
      }, 'Invalid background object');
    });

    it('with invalid object (missing red)', () => {
      assert.throws(() => {
        iconz.bgObjToHex({ g: 1, b: 1, alpha: 1 });
      }, 'Invalid background object');
    });

    it('with invalid object (missing green)', () => {
      assert.throws(() => {
        iconz.bgObjToHex({ r: 1, b: 1, alpha: 1 });
      }, 'Invalid background object');
    });

    it('with invalid object (missing blue)', () => {
      assert.throws(() => {
        iconz.bgObjToHex({ r: 1, g: 1, alpha: 1 });
      }, 'Invalid background object');
    });

    it('with valid object', () => {
      assert.equal(iconz.bgObjToHex({ r: 1, g: 2, b: 3, alpha: 1 }), '#010203FF', 'should convert to hex string');
    });
  });

  describe('argb2rgba()', () => {
    const before = Buffer.from([4, 1, 2, 3, 8, 5, 6, 7]);

    const after = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

    const iconz = new Iconz({ src: validImagePath });

    it('argb2rgba', async () => {
      iconz.argb2rgba(before);
      assert.deepStrictEqual(before, after);
    });
  });

  describe('rgba2argb()', () => {
    const before = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

    const after = Buffer.from([4, 1, 2, 3, 8, 5, 6, 7]);

    const iconz = new Iconz({ src: validImagePath });

    it('rgba2argb', async () => {
      iconz.rgba2argb(before);
      assert.deepStrictEqual(before, after);
    });
  });

  describe('getParserValues()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('getParserValues', async () => {
      const values = iconz.getParserValues({ test: 'value' }, true);
      assert.equal(typeof values, 'object', 'returns object');
      assert.equal(values.test, 'value', 'returns test value');
      assert.equal(values.counter, 0, 'returns counter');
      assert.equal(typeof values.date, 'object', 'returns date object');
      assert.deepStrictEqual(values.date, values.start, 'date should match start date when frozen');
    });
  });

  describe('parseTemplate()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('parseTemplate {{test.this}} value true', async () => {
      const result = iconz.parseTemplate('{{test.this}}', { test: { this: 'true' } });
      assert.equal(result, 'true', 'value matches');
    });

    it('parseTemplate {{test.this}} value undefined, removeUndefined undefined', async () => {
      const result = iconz.parseTemplate('{{test.this}}', { test: { this: undefined } });
      assert.equal(result, '{{test.this}}', 'value missing');
    });

    it('parseTemplate {{test.this}} value undefined, removeUndefined false', async () => {
      const result = iconz.parseTemplate('{{test.this}}', { test: { this: undefined } }, false);
      assert.equal(result, '{{test.this}}', 'value missing');
    });

    it('parseTemplate {{test.this}} value undefined, removeUndefined true', async () => {
      const result = iconz.parseTemplate('{{test.this}}', { test: { this: undefined } }, true);
      assert.equal(result, '', 'value missing');
    });
  });

  describe('getParserValues()', () => {
    const iconz = new Iconz({ src: validImagePath });
    const values = iconz.getParserValues({ test: 'value' }, true);

    it('getParserValues {{date.epoch}}', async () => {
      const date = new Date();
      const result = iconz.parseTemplate('{{date.epoch}}', values);
      const startResult = iconz.parseTemplate('{{start.epoch}}', values);
      assert.equal(typeof result, 'string', 'returns parsed string');
      assert.equal(date.toDateString(), new Date(Number(result)).toDateString(), 'date matches');
      assert.equal(result, startResult, 'both dates match');
    });

    it('getParserValues {{counter}}', async () => {
      const result = iconz.parseTemplate('{{counter}}', values);
      assert.equal(typeof result, 'string', 'returns parsed string');
      assert.equal(result, '0', 'counter is at 0');
    });
  });

  describe('addAction()', () => {
    let iconz: Iconz;

    beforeEach(() => {
      iconz = new Iconz({ src: validImagePath });
    });

    it('add action, no name, no args', async () => {
      assert.throws(() => {
        // @ts-ignore
        iconz.addAction();
      }, 'Invalid action name');
    });

    it('add action, no args', async () => {
      iconz.addAction('removeAlpha');
      assert.deepStrictEqual(iconz.getConfig().actions, [{ cmd: 'removeAlpha', args: [] }]);
    });

    it('add action, single arg', async () => {
      iconz.addAction('blur', 3);
      assert.deepStrictEqual(iconz.getConfig().actions, [{ cmd: 'blur', args: [3] }]);
    });

    it('add action multiple args', async () => {
      iconz.addAction('blur', null, 200);
      assert.deepStrictEqual(iconz.getConfig().actions, [{ cmd: 'blur', args: [null, 200] }]);
    });
  });

  describe('run()', () => {
    const iconz = new Iconz({ src: validImagePath });

    it('prepareAllSizedImages throws error', async () => {
      const testStub = stub(iconz, <any>'prepareAllSizedImages');
      testStub.throws(new Error());

      const result = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof result, 'string', 'promise should be reject response');
    });

    it('prepareAllSizedImages throws error', async () => {
      const testStub = stub(iconz, <any>'generateWidthAndHeightFromSize');
      testStub.returns(['M', 'X']);

      const result = await iconz.run().catch((e) => e.message);

      testStub.restore();
      assert.equal(typeof result, 'string', 'should throw error');
    });

    it('generateIcons disable all icon configs', async () => {
      const iconz = new Iconz({
        src: validImagePath,
        icons: { test: { enabled: false, type: 'ico', name: 'test', sizes: [12, 24, 36] } },
      });

      const result = await iconz.run().catch((e) => e.message);

      assert.deepStrictEqual(result, Iconz.newReport(), 'should return empty results');
    });

    it('generateIcons no sizes, uses defaults.', async () => {
      const iconz = new Iconz({
        src: validImagePath,
        icons: { test: { enabled: true, type: 'ico', name: 'test', sizes: [] } },
      });

      const result = await iconz.run().catch((e) => e.message);

      assert.equal(typeof result, 'object', 'should return object');
      assert.equal(typeof result.ico, 'object', 'should return object');
      assert.equal(Object.values(result.ico).length, 1, 'should return one icon result');
      /** remove test file */
      fs.unlinkSync(result.ico.test);
    });

    it('generateIcons multi sized without unique name field', async () => {
      const iconz = new Iconz({
        src: validImagePath,
        icons: { test: { enabled: true, type: 'png', name: 'test', sizes: [12, 24, 36] } },
      });

      const result = await iconz.run().catch((e) => e.message);

      assert(/^Icons\sconfig/.test(result), 'Should display error about icon config');
    });

    it('generateIcons throws error', async () => {
      const testStub = stub(iconz, <any>'generateIcons');
      testStub.throws(new Error());

      const result = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof result, 'string', 'should throw error');
    });

    it('generateIcons throws error with invalid dimensions', async () => {
      const iconz = new Iconz({
        src: validImagePath,
        icons: {
          favicon: {
            enabled: true,
            type: 'png',
            name: 'favicon-{{size}}',
            sizes: ['45m34'],
            folder: './',
          },
        },
      });

      const result = await iconz.run().catch((e) => e.message);

      expect(result, 'promise should be reject response').to.eq('Invalid size 45m34');
    });

    it('generateIcons throws error with invalid output format', async () => {
      const iconz = new Iconz({
        src: validImagePath,
        icons: {
          favicon: {
            enabled: true,
            type: 'png',
            name: 'favicon-{{size}}',
            sizes: [45],
            folder: './',
          },
        },
        options: {
          output: {
            // @ts-ignore
            format: 'hhh',
          },
        },
      });

      const result = await iconz.run().catch((e) => e.message);

      assert.equal(result, 'Output format is invalid', 'promise should be reject response');
    });

    it('generateIcons', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const report = await iconz.run().catch((e) => e.message);

      assert.notEqual(typeof report, 'string', 'generation should be successful');
      assert(typeof report === 'object', 'report should return an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('generateIcons with actions', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
        actions: [{ cmd: 'rotate', args: [180] }],
      });

      const report = await iconz.run().catch((e) => e.message);

      assert.notEqual(typeof report, 'string', 'generation should be successful');
      assert(typeof report === 'object', 'report should return an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('generateIcons from ico', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validIcoPath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const report = await iconz.run().catch((e) => e.message);

      assert.notEqual(typeof report, 'string', 'generation should be successful');
      assert(typeof report === 'object', 'report should return an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('pngGenerator fail', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const testStub = stub(iconz, <any>'parseTemplate');
      testStub
        .withArgs('favicon', sinon.match({ size: '32', width: '32', height: '32', dims: '32x32' }))
        .throws(new Error());

      const report = await iconz.run().catch((e) => e.message);
      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icnsGenerator fail', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const testStub = stub(iconz, <any>'parseTemplate');
      testStub
        .withArgs(
          'app',
          sinon.match({
            size: '1024',
            width: '1024',
            height: '1024',
            dims: '1024x1024',
          }),
        )
        .throws(new Error());

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator fail', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const testStub = stub(iconz, <any>'parseTemplate');
      testStub
        .withArgs(
          'app',
          sinon.match({
            size: '256',
            width: '256',
            height: '256',
            dims: '256x256',
          }),
        )
        .throws(new Error());

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator (getChosenFilesForIcon returns empty chosenFiles)', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const testStub = stub(iconz, <any>'getChosenFilesForIcon');
      testStub.returns(Promise.resolve({ outputDir: '', chosenFiles: [] }));

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator (trigger Unable to create ico error)', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const testStub = stub(iconz, <any>'getChosenFilesForIcon');
      testStub.returns(Promise.resolve({ outputDir: '', chosenFiles: [] }));

      const report = await iconz
        .icoGenerator(
          {
            type: 'png',
            name: 'favicon',
            sizes: [512],
            folder: '.',
          },
          Iconz.newReport(),
        )
        .catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator (getChosenFilesForIcon throws exception)', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      const testStub = stub(iconz, <any>'getChosenFilesForIcon');
      testStub.returns(new Error('fail'));

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('jpgGenerator (getChosenFilesForIcon throws exception)', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
        icons: {
          thumbs: {
            type: 'jpeg',
            name: 'thumb-{{dims}}',
            sizes: [300, 600, 900, '1024x768'],
          },
        },
      });

      const testStub = stub(sharp.prototype, <any>'toFormat');
      testStub.withArgs('jpeg', sinon.match.any).returns(new Error('fail'));

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('jpgGenerator', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
        icons: {
          thumbs: {
            type: 'jpeg',
            name: 'thumb-{{dims}}',
            sizes: [300, 600, 900, '1024x768'],
          },
        },
      });

      const report = await iconz.run().catch((e) => e.message);

      assert.equal(typeof report, 'object', 'generation should fail');
    });

    it('generateIcons', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
        icons: {
          rgb: {
            type: 'png',
            name: 'rgb-{{dims}}',
            sizes: [128, 256, 512, 1024],
            hooks: {
              preResize: (
                self: Iconz,
                image: IconzImage,
              ): Promise<IconzImage> => Promise.resolve(image),
              postResize: (
                self: Iconz,
                image: IconzImage,
                options: IconzResizeOptions,
                targetFilename: string,
                imageReport: IconzReport,
              ): Promise<IconzImage> => {
                return new Promise((resolve, reject) => {
                  (async () => {
                    try {
                      // get folder for output
                      const dir = self.getConfig().folder;

                      // colourSpaces to test
                      const colourSpace = {
                        cmyk: <string[]>[],
                        'b-w': <string[]>[],
                        srgb: <string[]>[],
                        hsv: <string[]>[],
                        lab: <string[]>[],
                        xyz: <string[]>[],
                      };

                      // loop through each colourSpace type and create images
                      for (const type of Object.keys(colourSpace)) {
                        // new filename with dimensions
                        const filename = `${type}-${options.width}x${options.height}.jpg`;

                        // directory based upon colourSpace type
                        const dirname = iconz.path().join(dir, type);

                        // set target path
                        const target = iconz.path().join(dirname, filename);

                        // prepare image
                        await image
                          .clone() // image is cloned to ensure original is left untouched
                          .toColorspace(type)
                          .jpeg({ chromaSubsampling: '4:4:4', quality: 100 })
                          .toBuffer()
                          .then((data) => {
                            // make directory
                            fs.mkdirSync(dirname, { recursive: true });
                            // write image
                            fs.writeFileSync(target, data);
                            // add filename to report results
                            imageReport.jpg ??= colourSpace;
                            imageReport.jpg[type].push(target);
                          })
                          .catch(() => {
                            // if image failed, add it to the report
                            imageReport.failed[target] = `${type} jpeg failed`;
                          });
                      }
                      // promise resolves image
                      resolve(image);
                    } catch (error) {
                      // promise rejects error
                      reject(error);
                    }
                  })();
                });
              },
            },
          },
        },
      });

      const report = await iconz.run().catch((e) => e.message);

      assert(typeof report === 'object', 'report should be an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('generateIcons bufferFailure', async () => {
      const testStub = stub(fs, <any>'writeFileSync');
      testStub.throws(new Error());

      const iconz = new Iconz({
        src: validImagePath,
        icons: {
          favicon: {
            enabled: true,
            type: 'png',
            name: 'favicon-{{size}}',
            sizes: [45, 45],
            folder: './',
          },
        },
      });

      let result;
      await iconz
        .run()
        .then((data) => {
          result = data;
        })
        .catch((e) => {
          result = e;
        })
        .finally(() => {
          testStub.restore();
        });

      assert.equal(typeof result, 'object', 'should throw error');
    });

    it('getOptions throws error', async () => {
      const testStub = stub(iconz, <any>'clone');
      testStub.throws(new Error());

      const result = await iconz.getOptions('input').catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof result, 'string', 'should throw error');
    });

    it('getChosenFilesForIcon (missing data throws exception)', async () => {
      const folder = randomFolder();
      const iconz = new Iconz({
        src: validImagePath,
        // use temporary folder for testing purposes
        folder: folder,
        tmpFolder: folder,
      });

      // @ts-ignore
      const report = await iconz.getChosenFilesForIcon().catch((e) => e.message);

      assert.equal(typeof report, 'string', 'generation should fail');
      assert.equal(report, 'parameters are missing', 'no parameters');
    });
  });

  describe('removeTemporaryFolders()', () => {
    // create file in temp directory and in subdirectory
    const join = Iconz.path().join;
    const filename = randomHex();
    const dirname = randomHex();
    const dir = join(os.tmpdir(), dirname);
    const reportFile = join(dir, filename);
    const duplicateFile = join(os.tmpdir(), filename);
    const modifiedFile = join(os.tmpdir(), dirname + '_' + filename);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(reportFile, 'test');
    fs.copyFileSync(reportFile, duplicateFile);

    const iconz = new Iconz({ src: validImagePath });

    const report: IconzReport = Iconz.newReport();
    report.tmp[reportFile] = {};

    it('duplicate filename exists', async () => {
      await iconz.removeTemporaryFolders(report);
      assert.equal(report.tmp[modifiedFile], 'complete', 'report should mark duplicate as complete');
    });
  });
});

describe('Iconz (static methods)', () => {
  describe('getNestedByPath', () => {
    const testObject = { test: { this: { works: [1, 2, 3] } } };

    it('nest level 0', async () => {
      assert.deepStrictEqual(Iconz.getNestedByPath(testObject, 'test'), testObject.test);
    });

    it('nest level 1', async () => {
      assert.deepStrictEqual(Iconz.getNestedByPath(testObject, 'test.this'), testObject.test.this);
    });

    it('nest level 2', async () => {
      assert.deepStrictEqual(Iconz.getNestedByPath(testObject, 'test.this.works'), testObject.test.this.works);
    });
  });

  describe('dateToObject', () => {
    it('convert date to object', async () => {
      const date = new Date(1041480306123);
      const obj = Iconz.dateToObject(date);
      assert.deepStrictEqual(obj, {
        date: '20030102',
        datemtime: '20030102040506123',
        datetime: '20030102040506',
        day: '02',
        dow: '5',
        epoch: '1041480306123',
        hour: '04',
        millisecond: '123',
        minute: '05',
        month: '01',
        mtime: '040506123',
        offset: '0',
        second: '06',
        time: '040506',
        year: '2003',
      });
    });
  });
});
