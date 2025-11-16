import { describe, expect, it } from 'bun:test';
import { createDateVariables, createTemplateVariables, parseTemplate } from './template';

describe('Template Parser', () => {
	describe('parseTemplate', () => {
		it('should replace simple variables', () => {
			const result = parseTemplate('icon-{{width}}x{{height}}', {
				width: 192,
				height: 192,
			});
			expect(result).toBe('icon-192x192');
		});

		it('should replace nested variables', () => {
			const result = parseTemplate('icon-{{date.year}}-{{date.month}}', {
				date: { year: '2024', month: '10' },
			} as Parameters<typeof parseTemplate>[1]);
			expect(result).toBe('icon-2024-10');
		});

		it('should handle missing variables', () => {
			const result = parseTemplate('icon-{{missing}}', {});
			expect(result).toBe('icon-{{missing}}');
		});

		it('should handle multiple same variables', () => {
			const result = parseTemplate('{{width}}-{{width}}', { width: 16 });
			expect(result).toBe('16-16');
		});
	});

	describe('createDateVariables', () => {
		it('should create date variables', () => {
			const date = new Date('2024-10-13T12:30:45.123Z');
			const vars = createDateVariables(date);

			expect(vars.year).toBe('2024');
			expect(vars.month).toBe('10');
			expect(vars.day).toBe('13');
			expect(vars.iso).toBe(date.toISOString());
			expect(vars.timestamp).toBe(date.getTime());
		});

		it('should pad single digits', () => {
			const date = new Date('2024-01-05T09:05:05.005Z');
			const vars = createDateVariables(date);

			expect(vars.month).toBe('01');
			expect(vars.day).toBe('05');
			expect(vars.millisecond).toBe('005');
		});
	});

	describe('createTemplateVariables', () => {
		it('should create variables for number size', () => {
			const vars = createTemplateVariables(192, 5);

			expect(vars.width).toBe(192);
			expect(vars.height).toBe(192);
			expect(vars.dims).toBe('192x192');
			expect(vars.size).toBe(192);
			expect(vars.counter).toBe(5);
			expect(vars.date).toBeDefined();
		});

		it('should create variables for string size', () => {
			const vars = createTemplateVariables('512x256', 1);

			expect(vars.width).toBe(512);
			expect(vars.height).toBe(256);
			expect(vars.dims).toBe('512x256');
			expect(vars.size).toBe('512x256');
		});
	});
});
