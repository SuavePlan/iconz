import { describe, expect, it } from 'bun:test';
import { isIconSize, parseDimensions } from './types';

describe('Type Utilities', () => {
	describe('isIconSize', () => {
		it('should validate number sizes', () => {
			expect(isIconSize(16)).toBe(true);
			expect(isIconSize(512)).toBe(true);
			expect(isIconSize(0)).toBe(false);
			expect(isIconSize(-16)).toBe(false);
		});

		it('should validate string sizes', () => {
			expect(isIconSize('16x16')).toBe(true);
			expect(isIconSize('512x256')).toBe(true);
			expect(isIconSize('invalid')).toBe(false);
			expect(isIconSize('16')).toBe(false);
			expect(isIconSize('16x')).toBe(false);
		});

		it('should reject invalid types', () => {
			expect(isIconSize(null)).toBe(false);
			expect(isIconSize(undefined)).toBe(false);
			expect(isIconSize({})).toBe(false);
			expect(isIconSize([])).toBe(false);
		});
	});

	describe('parseDimensions', () => {
		it('should parse number sizes', () => {
			expect(parseDimensions(16)).toEqual({ width: 16, height: 16 });
			expect(parseDimensions(512)).toEqual({ width: 512, height: 512 });
		});

		it('should parse string sizes', () => {
			expect(parseDimensions('16x16')).toEqual({ width: 16, height: 16 });
			expect(parseDimensions('512x256')).toEqual({ width: 512, height: 256 });
			expect(parseDimensions('1024x768')).toEqual({ width: 1024, height: 768 });
		});
	});
});
