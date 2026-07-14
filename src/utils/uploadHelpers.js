export const MAX_UPLOAD_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

export function formatFileSizeMb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1);
}

/**
 * Map raw fetch/API errors to clear copy for users (esp. mobile camera uploads).
 */
export function getFriendlyUploadError(err, { context = 'upload' } = {}) {
  const status = err?.status ?? err?.response?.status;
  const raw = String(err?.message || err || '').trim();
  const lower = raw.toLowerCase();

  if (status === 413 || lower.includes('413') || lower.includes('too large') || lower.includes('8 mb') || lower.includes('entity too large')) {
    return {
      title: 'File too large',
      message: 'One or more photos are too large (max 8 MB each). Please retake the photo at a lower resolution, or compress the image and try again.',
    };
  }

  if (status === 401 || lower.includes('unauthorized') || lower.includes('invalid token') || lower.includes('jwt expired')) {
    return {
      title: 'Session expired',
      message: 'Your session has expired. Please log in again and resubmit your documents.',
    };
  }

  if (status === 400 || status === 422) {
    return {
      title: 'Could not submit documents',
      message: raw && !/^http error/i.test(raw)
        ? raw
        : 'Some document details look invalid. Please check your uploads and try again.',
    };
  }

  if (status >= 500) {
    return {
      title: 'Server temporarily unavailable',
      message: 'We could not process your documents right now. Please wait a moment and try again.',
    };
  }

  // Browser network failures (common with large phone-camera uploads on weak mobile data)
  const isNetworkFailure =
    err?.name === 'TypeError' ||
    err?.name === 'AbortError' ||
    lower === 'failed to fetch' ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('load failed') ||
    lower.includes('err_network') ||
    lower.includes('err_internet_disconnected') ||
    lower.includes('err_connection') ||
    lower.includes('timeout') ||
    lower.includes('aborted');

  if (isNetworkFailure) {
    return {
      title: context === 'kyc' ? 'Upload interrupted' : 'Connection problem',
      message:
        'Upload could not complete. Phone camera photos are often large and may fail on a weak connection. Please check your internet, try Wi‑Fi, retake the photo closer/clearer (smaller file), then submit again.',
    };
  }

  if (raw && !/^http error! status:/i.test(raw) && lower !== 'failed to fetch') {
    return {
      title: context === 'kyc' ? 'KYC submission failed' : 'Upload failed',
      message: raw,
    };
  }

  return {
    title: context === 'kyc' ? 'KYC submission failed' : 'Upload failed',
    message: 'Something went wrong while uploading. Please check your connection and try again.',
  };
}

/**
 * Compress camera / large images to JPEG under a target size for reliable mobile uploads.
 * PDFs and already-small images are returned unchanged.
 */
export async function compressImageForUpload(file, {
  maxBytes = 1.8 * 1024 * 1024,
  maxDimension = 1920,
  quality = 0.82,
} = {}) {
  if (!file || file.type === 'application/pdf') return file;
  if (!file.type.startsWith('image/') && !/\.(heic|heif|jpe?g|png|webp)$/i.test(file.name || '')) {
    return file;
  }
  // Skip tiny files
  if (file.size <= maxBytes && !/heic|heif/i.test(file.type || file.name || '')) {
    return file;
  }

  // HEIC often can't be drawn to canvas in browsers — leave as-is for server handling,
  // but still try if the browser can decode it.
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const { width, height } = fitWithin(img.naturalWidth || img.width, img.naturalHeight || img.height, maxDimension);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    let q = quality;
    let blob = await canvasToBlob(canvas, 'image/jpeg', q);
    while (blob && blob.size > maxBytes && q > 0.45) {
      q -= 0.1;
      blob = await canvasToBlob(canvas, 'image/jpeg', q);
    }
    if (!blob) return file;

    const baseName = (file.name || 'document').replace(/\.[^.]+$/, '') || 'document';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function fitWithin(w, h, maxDim) {
  if (!w || !h) return { width: maxDim, height: maxDim };
  if (w <= maxDim && h <= maxDim) return { width: w, height: h };
  const scale = Math.min(maxDim / w, maxDim / h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image. Please try another photo or format (JPG/PNG).'));
    img.src = src;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
