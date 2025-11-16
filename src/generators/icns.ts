/**
 * ICNS Generator Module
 *
 * Generates Apple ICNS files for macOS applications.
 * Supports Retina displays and modern macOS icon requirements.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Icns, IcnsImage } from '@fiahfy/icns';
import type { OSType } from '@fiahfy/icns/dist';
import type { GeneratedIcon, IconConfig, IconSize } from '../types/types';
import { parseDimensions } from '../types/types';
import { ensureDir } from '../utils/paths';
import { createTemplateVariables, parseTemplate } from '../utils/template';

export interface IcnsGeneratorOptions {
	outputDir: string;
	counter?: number;
}

/**
 * Mapping of ICNS OSType to dimensions
 */
const ICNS_TYPE_MAP: Record<string, OSType> = {
	'16x16': 'ic04',
	'16x16@2x': 'ic05',
	'32x32': 'ic05',
	'32x32@2x': 'ic11',
	'64x64': 'ic11',
	'128x128': 'ic07',
	'128x128@2x': 'ic13',
	'256x256': 'ic08',
	'256x256@2x': 'ic14',
	'512x512': 'ic09',
	'512x512@2x': 'ic10',
	'1024x1024': 'ic10',
};

/**
 * Generate ICNS file from PNG buffers
 */
export async function generateIcnsIcon(
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: IcnsGeneratorOptions,
): Promise<GeneratedIcon> {
	const outputDir = config.folder ? join(options.outputDir, config.folder) : options.outputDir;

	await ensureDir(outputDir);

	const icns = new Icns();

	// Add each PNG buffer to ICNS with appropriate OSType
	for (const [size, buffer] of buffers) {
		const { width, height } = parseDimensions(size);
		const key = `${width}x${height}`;
		const osType = ICNS_TYPE_MAP[key];

		if (osType) {
			try {
				const image = IcnsImage.fromPNG(buffer, osType);
				icns.append(image);
			} catch (error) {
				console.warn(`Failed to add ${key} to ICNS: ${error}`);
			}
		}
	}

	// Get largest size for template variables
	const sizes = Array.from(buffers.keys());
	const largestSize = sizes.reduce((max, size) => {
		const maxDims = parseDimensions(max);
		const sizeDims = parseDimensions(size);
		const maxArea = maxDims.width * maxDims.height;
		const sizeArea = sizeDims.width * sizeDims.height;
		return sizeArea > maxArea ? size : max;
	});

	const counter = options.counter ?? 1;
	const vars = createTemplateVariables(largestSize, counter);
	const filename = `${parseTemplate(config.name, vars)}.icns`;
	const path = join(outputDir, filename);

	await writeFile(path, icns.data as Uint8Array);

	const dimensions = parseDimensions(largestSize);

	return {
		path,
		format: 'icns',
		dimensions,
		size: icns.data.length,
	};
}

/**
 * Validate ICNS icon sizes (must be square)
 */
export function validateIcnsSizes(sizes: IconSize[]): boolean {
	for (const size of sizes) {
		const { width, height } = parseDimensions(size);
		if (width !== height) {
			return false;
		}
	}
	return true;
}

/**
 * Get recommended ICNS sizes based on Retina option
 */
export function getRecommendedIcnsSizes(retina = true): number[] {
	if (retina) {
		// Include @2x sizes for Retina displays
		return [16, 32, 64, 128, 256, 512, 1024];
	}
	// Basic sizes without Retina
	return [16, 32, 128, 256, 512];
}
