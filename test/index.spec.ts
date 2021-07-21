import fs from 'fs';
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
  //  IconzIconConfig,
} from '../src';

const validImageDir = Iconz.path().join(__dirname, 'images');
const validImagePath = Iconz.path().join(validImageDir, 'icon.svg');
const validIcoDir = Iconz.path().join(__dirname, 'images');
const validIcoPath = Iconz.path().join(validIcoDir, 'icon.ico');

const randomHex = (bytes?: number) => crypto.randomBytes(Number.isInteger(bytes) ? bytes : 4).toString('hex');
const randomOSTempDir = (bytes?: number) => Iconz.path().join(os.tmpdir(), randomHex(bytes));

const outputName = randomOSTempDir();
// const tempFolderName = randomFolder();

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

    it('empty config', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({});
      }, 'input image not found');
    });

    it('should pass with valid path', () => {
      assert.equal(
        new Iconz({ input: validImagePath }) instanceof Iconz,
        true,
        'Instantiation with valid path should pass',
      );
    });

    it('should fail with unreadable file', () => {
      const testStub = stub(fs, <any>'readFileSync').returns(false);

      assert.throws(() => {
        // @ts-ignore
        new Iconz({ input: validImagePath });
      }, 'input image is unreadable');

      testStub.restore();
    });

    it('invalid output', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ input: validImagePath, output: {} });
      }, 'Invalid output name');
    });

    it('icons config as string', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ input: validImagePath, icons: 'string' });
      }, 'Icon configuration is invalid');
    });

    it('icons config as number', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ input: validImagePath, icons: 1 });
      }, 'Icon configuration is invalid');
    });

    it('icons config as empty object', () => {
      assert.throws(() => {
        new Iconz({ input: validImagePath, icons: {} });
      }, 'Icon configuration not set');
    });

    it('temp output as null', () => {
      assert.throws(() => {
        new Iconz({ input: validImagePath, temp: null });
      }, 'Invalid temp output');
    });

    it('temp output as number', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ input: validImagePath, temp: 1 });
      }, 'Invalid temp output');
    });

    it('temp output as empty object', () => {
      assert.throws(() => {
        // @ts-ignore
        new Iconz({ input: validImagePath, temp: {} });
      }, 'Invalid temp output');
    });

    it('temp output as empty string', () => {
      assert.doesNotThrow(() => {
        new Iconz({ input: validImagePath, temp: '' });
      }, 'Instantiation with invalid temp output should fail');
    });
  });

  describe('validateConfig()', () => {
    const iconz = new Iconz({ input: validImagePath });

    it('validateConfig not relative or absolute path', () => {
      const testStubs = [stub(iconz, <any>'isAbsolutePath').returns(false)];
      expect(() => {
        // @ts-ignore
        iconz.validateConfig(0);
      }, 'should throw error').to.throw('Invalid configuration');

      expect(() => {
        iconz.validateConfig({ input: null });
      }, 'should throw error').to.throw('input image not found');
      expect(() => {
        iconz.validateConfig({ input: '.' });
      }, 'should throw error').to.throw('input image not found');

      expect(() => {
        // @ts-ignore
        iconz.validateConfig({ input: validImagePath, output: 0 });
      }, 'should throw error').to.throw('Invalid output name');

      expect(() => {
        // @ts-ignore
        iconz.validateConfig({ input: validImagePath, output: outputName, temp: 0 });
      }, 'should throw error').to.throw('Invalid temp output name');

      expect(() => {
        // @ts-ignore
        iconz.validateConfig({ input: validImagePath, output: outputName, icons: 0 });
      }, 'should throw error').to.throw('Icon configuration is invalid');

      expect(() => {
        iconz.validateConfig({ input: validImagePath, output: outputName, icons: {} });
      }, 'should throw error').to.throw('Icon configuration not set');

      for (const testStub of testStubs) testStub.restore();
    });
  });

  describe('addIconConfig()', () => {
    const iconz = new Iconz({ input: validImagePath });

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
    const iconz = new Iconz({ input: validImagePath });

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
      const iconz = new Iconz({ input: validImagePath });
      assert.equal(
        iconz.getConfig(false).input === validImagePath &&
          (iconz.getConfig(false).input = 'testing') &&
          iconz.getConfig(false).input === 'testing',
        true,
        'should return testing',
      );
    });
    it('no options', () => {
      const iconz = new Iconz({ input: validImagePath });
      assert.equal(
        iconz.getConfig().input === validImagePath &&
          (iconz.getConfig().input = 'testing') &&
          iconz.getConfig().input === validImagePath,
        true,
        `should return ${validImagePath}`,
      );
    });

    it('with buffer', () => {
      const iconz = new Iconz({ buffer: Buffer.from([]), output: '.' });
      assert.equal(
        iconz.getConfig().buffer === undefined,
        true,
        `should return undefined, as it is now being stored internally`,
      );
    });
  });

  describe('getInputOptions()', () => {
    it('clone is false', async () => {
      const iconz = new Iconz({ input: validImagePath });

      assert.equal(
        (await iconz.getInputOptions(false)).density === 72 &&
          ((await iconz.getInputOptions(false)).density = 300) &&
          (await iconz.getInputOptions(false)).density === 300,
        true,
        'should return 300',
      );
    });

    it('no options', async () => {
      const iconz = new Iconz({ input: validImagePath });

      assert.equal(
        (await iconz.getInputOptions()).density === 72 &&
          ((await iconz.getInputOptions()).density = 300) &&
          (await iconz.getInputOptions()).density === 72,
        true,
        'should return 72',
      );
    });
  });

  describe('generateTargetFilepathFromOptions()', () => {
    const iconz = new Iconz({ input: validImagePath });

    it('using options', () => {
      expect(
        iconz.generateTargetFilepathFromOptions(
          <ResizeOptions>dummyData.defaultImageResponse[dummyData.defaultImageResponse.length - 1],
        ),
      ).to.eq('ba81e4e7/128x96');
    });
  });

  describe('getChosenFilesForIcon()', () => {
    const iconz = new Iconz({ input: validImagePath });
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

    it('with parameters (without output)', async () => {
      const configWithoutFolder = <IconzConfig>iconz.clone(config);
      // remove output for test
      delete configWithoutFolder.folder;

      const chosen = await iconz.getChosenFilesForIcon(configWithoutFolder, report);

      assert(typeof chosen === 'object', 'should return object');
      assert.deepStrictEqual(Object.keys(chosen), ['outputDir', 'chosenFiles'], 'returns object');
      assert.deepStrictEqual(typeof chosen.outputDir, 'string', 'returns object');
      assert(Array.isArray(chosen.chosenFiles), 'returns object');
    });
  });

  describe('getLargestSize()', () => {
    const iconz = new Iconz({ input: validImagePath });

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
    const iconz = new Iconz({ input: validImagePath });

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
    const iconz = new Iconz({ input: validImagePath });

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

    const iconz = new Iconz({ input: validImagePath });

    it('argb2rgba', async () => {
      iconz.argb2rgba(before);
      assert.deepStrictEqual(before, after);
    });
  });

  describe('rgba2argb()', () => {
    const before = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

    const after = Buffer.from([4, 1, 2, 3, 8, 5, 6, 7]);

    const iconz = new Iconz({ input: validImagePath });

    it('rgba2argb', async () => {
      iconz.rgba2argb(before);
      assert.deepStrictEqual(before, after);
    });
  });

  describe('getParserValues()', () => {
    const iconz = new Iconz({ input: validImagePath });

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
    const iconz = new Iconz({ input: validImagePath });

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
    const iconz = new Iconz({ input: validImagePath });
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
      iconz = new Iconz({ input: validImagePath });
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
    const iconz = new Iconz({ input: validImagePath });

    it('prepareAllSizedImages throws error', async () => {
      const testStub = stub(iconz, <any>'prepareAllSizedImages');
      testStub.throws(new Error());

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'promise should be reject response');
    });

    it('prepareAllSizedImages throws error', async () => {
      const testStub = stub(Iconz, <any>'generateWidthAndHeightFromSize');
      testStub.returns(['M', 'X']);

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'should throw error');
    });

    it('generateIcons disable all icon configs', async () => {
      const iconz = new Iconz({
        input: validImagePath,
        icons: { test: { enabled: false, type: 'ico', name: 'test', sizes: [12, 24, 36] } },
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.deepStrictEqual(report, Iconz.newReport(), 'should return empty results');
    });

    it('generateIcons (png) no sizes, uses defaults.', async () => {
      const iconz = new Iconz({
        input: validImagePath,
        icons: { test: { enabled: true, type: 'png', name: 'test', sizes: [] } },
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(
        typeof report,
        'string',
        'should fail, as there are multiple defaults, name must be unique (e.g test-{{counter}})',
      );
    });

    it('generateIcons (ico) no sizes, uses defaults.', async () => {
      const iconz = new Iconz({
        input: validImagePath,
        icons: { test: { enabled: true, type: 'ico', name: 'test', sizes: [] } },
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'object', 'should return object');
      assert.equal(typeof report.ico, 'object', 'should return object');
      assert.equal(Object.values(report.ico).length, 1, 'should return one icon result');
    });

    it('generateIcons (png) multi sized without unique name field', async () => {
      const iconz = new Iconz({
        input: validImagePath,
        icons: { test: { enabled: true, type: 'png', name: 'test', sizes: [12, 24, 36] } },
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert(/^Icons\sconfig/.test(report), 'Should display error about icon config');
    });

    it('generateIcons throws error', async () => {
      const testStub = stub(iconz, <any>'generateIcons');
      testStub.throws(new Error());

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'should throw error');
    });

    it('generateIcons throws error with invalid dimensions', async () => {
      const iconz = new Iconz({
        input: validImagePath,
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

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      expect(report, 'promise should be reject response').to.eq('Invalid size 45m34');
    });

    it('generateIcons throws error with invalid output format', async () => {
      const iconz = new Iconz({
        input: validImagePath,
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

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(report, 'Output format is invalid', 'promise should be reject response');
    });

    it('generateIcons', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.notEqual(typeof report, 'string', 'generation should be successful');
      assert(typeof report === 'object', 'report should return an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('generateIcons with actions', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
        actions: [{ cmd: 'rotate', args: [180] }],
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.notEqual(typeof report, 'string', 'generation should be successful');
      assert(typeof report === 'object', 'report should return an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('generateIcons from ico', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validIcoPath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.notEqual(typeof report, 'string', 'generation should be successful');
      assert(typeof report === 'object', 'report should return an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('pngGenerator fail', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
      });

      const testStub = stub(iconz, <any>'parseTemplate');
      testStub
        .withArgs('favicon', sinon.match({ size: '32', width: '32', height: '32', dims: '32x32' }))
        .throws(new Error());

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icnsGenerator fail', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
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

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator fail', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
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

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator (getChosenFilesForIcon returns empty chosenFiles)', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
      });

      const testStub = stub(iconz, <any>'getChosenFilesForIcon');
      testStub.returns(Promise.resolve({ outputDir: '', chosenFiles: [] }));

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('icoGenerator (trigger Unable to create ico error)', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
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
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
      });

      const testStub = stub(iconz, <any>'getChosenFilesForIcon');
      testStub.returns(new Error('fail'));

      const report = await iconz.run().catch((e) => e.message);

      testStub.restore();

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('jpgGenerator (getChosenFilesForIcon throws exception)', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
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

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'string', 'generation should fail');
    });

    it('jpgGenerator', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
        icons: {
          thumbs: {
            type: 'jpeg',
            name: 'thumb-{{dims}}',
            sizes: [300, 600, 900, '1024x768'],
          },
        },
      });

      const report = await iconz.run().catch((e) => e.message);

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert.equal(typeof report, 'object', 'generation should fail');
    });

    it('generateIcons', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
        icons: {
          rgb: {
            type: 'png',
            name: 'rgb-{{dims}}',
            sizes: [128, 256, 512, 1024],
            hooks: {
              preResize: (self: Iconz, image: IconzImage): Promise<IconzImage> => Promise.resolve(image),
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
                      // get output for output
                      const dir = self.getConfig().output;

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

      if (typeof report === 'object') await iconz.removeAllGeneratedImages(report, true);

      assert(typeof report === 'object', 'report should be an object');
      assert.equal(typeof report.failed, 'object', 'report failed should be an object');
      assert.equal(Object.keys(report.failed).length, 0, 'nothing should have failed');
    });

    it('generateIcons bufferFailure', async () => {
      const testStub = stub(fs, <any>'writeFileSync');
      testStub.throws(new Error());

      const iconz = new Iconz({
        input: validImagePath,
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

      let report;

      await iconz
        .run()
        .then((data) => {
          return (report = data);
        })
        .then((report) => iconz.removeAllGeneratedImages(report, true))
        .catch((e) => {
          report = e;
        })
        .finally(() => {
          testStub.restore();
        });

      assert.equal(typeof report, 'object', 'should throw error');
    });

    it('getOptions throws error', async () => {
      const testStub = stub(iconz, <any>'clone');
      testStub.throws(new Error());

      const result = await iconz.getOptions('input').catch((e) => e.message);

      testStub.restore();

      assert.equal(typeof result, 'string', 'should throw error');
    });

    it('getChosenFilesForIcon (missing data throws exception)', async () => {
      const output = randomOSTempDir();
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: output,
        temp: output,
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

    // temporary dir
    const dir = join(os.tmpdir(), dirname);

    // temporary dir file
    const reportFile = join(dir, filename);

    // filename
    const duplicateFile = join(os.tmpdir(), filename);

    // modified file
    const modifiedFile = join(os.tmpdir(), dirname + '_' + filename);

    // make temporary dir
    fs.mkdirSync(dir, { recursive: true });

    // write file to temporary dir
    fs.writeFileSync(reportFile, 'test');

    // copy file to parent of temporary dir
    fs.copyFileSync(reportFile, duplicateFile);

    const iconz = new Iconz({ input: validImagePath });

    // get blank report
    const report: IconzReport = Iconz.newReport();
    report.temp[reportFile] = {};

    it('duplicate filename exists', async () => {
      const newReport = await iconz.removeTemporaryFolders(report);
      assert.equal(newReport.temp[modifiedFile], 'complete', 'report should mark duplicate as complete');
    });
  });

  describe('fullPath()', () => {
    const fullPath = randomOSTempDir();
    const absolutetempPath = randomOSTempDir();
    const relativeFolderPath = Iconz.path().basename(fullPath);
    const relativetempPath = Iconz.path().basename(absolutetempPath);

    it('temp and output absolute outputs specified', async () => {
      const iconz = new Iconz({
        input: validImagePath,
        // use temporary output for testing purposes
        output: fullPath,
        temp: absolutetempPath,
      });

      for (const key of [fullPath, absolutetempPath]) {
        assert.equal(iconz.fullPath(key), key, 'absolute paths should not change');
      }
      for (const key of [relativeFolderPath, relativetempPath]) {
        assert.notEqual(iconz.fullPath(key), key, 'relative paths should return difference');
      }
    });
  });

  describe('fullPath()', () => {
    const cwd = process.cwd();

    const config: Record<string, any> = {
      image: 'icon.svg',
      relative: {
        image: '',
        dir: '',
        output: '',
        temp: '',
      },
      absolute: {
        image: '',
        dir: '',
        output: '',
        temp: '',
      },
    };

    const p = Iconz.path();
    const j = p.join;

    // prepare relative paths
    config.relative.dir = j('test', 'images');
    config.relative.image = j(config.relative.dir, config.image);
    config.relative.output = 'output';
    config.relative.temp = 'temp';

    // prepare calculated absolute paths
    config.absolute.dir = p.dirname(j(cwd, config.relative.dir));
    config.absolute.image = j(cwd, config.relative.image);
    config.absolute.output = j(cwd, config.relative.dir, config.relative.output);
    config.absolute.temp = j(cwd, config.relative.dir, config.relative.output, config.relative.temp);

    describe('output test', () => {
      describe('input is absolute path', () => {
        // prepare new Iconz instance
        const iconz = new Iconz({ input: config.absolute.image });

        it('using relative output_path', async () => {
          assert.equal(iconz.fullPath(config.relative.output), iconz.path().join(config.absolute.output));
        });

        it('using relative ./output_path', async () => {
          assert.equal(iconz.fullPath(iconz.path().join('.', config.relative.output)), config.absolute.output);
        });

        it('using absolute output_path', async () => {
          assert.equal(iconz.fullPath(config.absolute.output), config.absolute.output);
        });
      });

      describe('input is relative path', () => {
        const iconz = new Iconz({ input: config.relative.image });

        it('using relative output_path', async () => {
          assert.equal(iconz.fullPath(config.relative.output), iconz.path().join(config.absolute.output));
        });

        it('using relative ./output_path', async () => {
          assert.equal(iconz.fullPath(iconz.path().join('.', config.relative.output)), config.absolute.output);
        });

        it('using absolute output_path', async () => {
          assert.equal(iconz.fullPath(config.absolute.output), config.absolute.output);
        });
      });
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

  describe('generateWidthAndHeightFromSize()', () => {
    it('using integer', () => {
      assert.deepStrictEqual(Iconz.generateWidthAndHeightFromSize(1), [1, 1], 'should be equal');
    });
  });

  describe('makeDirectory()', () => {
    it('random os temp dir', async () => {
      const tmpDir = randomOSTempDir();

      assert.equal(await Iconz.makeDirectory(tmpDir), true, 'should be equal');
    });
  });
});
