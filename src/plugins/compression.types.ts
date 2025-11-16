/**
 * Compression Plugin Types
 */

export interface CompressionConfig {
	/** Compression level (0-9, default: 9) */
	level?: number;
	/** Target file size reduction (0-1, default: 0.7 = 70% of original) */
	targetReduction?: number;
	/** Enable adaptive compression */
	adaptive?: boolean;
	/** Format-specific options */
	format?: {
		png?: {
			compressionLevel?: number;
			palette?: boolean;
			effort?: number;
		};
		jpeg?: {
			quality?: number;
			progressive?: boolean;
			chromaSubsampling?: string;
		};
		webp?: {
			quality?: number;
			lossless?: boolean;
			effort?: number;
		};
	};
}
