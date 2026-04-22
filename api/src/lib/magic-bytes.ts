/**
 * Magic bytes validation for uploaded files.
 * Validates actual file content instead of relying on Content-Type header (which can be spoofed).
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Detect image MIME type from buffer magic bytes.
 * Returns null if the buffer does not match any known image format.
 */
function detectMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 &&
    buffer[2] === 0x4E && buffer[3] === 0x47 &&
    buffer[4] === 0x0D && buffer[5] === 0x0A &&
    buffer[6] === 0x1A && buffer[7] === 0x0A
  ) {
    return 'image/png';
  }

  // WebP: RIFF....WEBP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  // GIF: GIF87a or GIF89a
  const gifHeader = buffer.toString('ascii', 0, 6);
  if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
    return 'image/gif';
  }

  return null;
}

/**
 * Validate that a buffer contains an allowed image format by inspecting magic bytes.
 * Returns the detected MIME type or throws if invalid.
 */
export function validateImageMagicBytes(buffer: Buffer): string {
  const detectedMime = detectMimeFromBuffer(buffer);
  if (!detectedMime || !ALLOWED_MIME_TYPES.includes(detectedMime)) {
    throw new Error('Invalid file content. Only JPEG, PNG, WebP, GIF images are allowed.');
  }
  return detectedMime;
}
