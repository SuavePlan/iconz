/**
 * Optimization Plugin Types
 */

export interface OptimizationConfig {
	/** Enable aggressive optimization (slower but better) */
	aggressive?: boolean;
	/** Target quality (1-100, default: 90) */
	quality?: number;
	/** Enable progressive encoding for JPEG */
	progressive?: boolean;
	/** Enable lossless optimization */
	lossless?: boolean;
	/** Strip metadata (EXIF, etc.) */
	stripMetadata?: boolean;
}
