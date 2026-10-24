/**
 * Converts an SVG data URI or SVG string to a genuine Base64 JPEG data URL
 * using an HTML5 offscreen canvas in the browser.
 */
export function svgToJpegBase64(svgDataUriOrString: string, width = 400, height = 300): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(svgDataUriOrString);
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#292524';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const jpegUri = canvas.toDataURL('image/jpeg', 0.85);
            resolve(jpegUri);
            return;
          }
        } catch {
          // fallback
        }
        resolve(svgDataUriOrString);
      };

      img.onerror = () => {
        resolve(svgDataUriOrString);
      };

      let src = svgDataUriOrString;
      if (!src.startsWith('data:image/svg+xml')) {
        src = `data:image/svg+xml;utf8,${encodeURIComponent(svgDataUriOrString)}`;
      }
      img.src = src;
    } catch {
      resolve(svgDataUriOrString);
    }
  });
}

/**
 * Converts an image URL (including local relative paths like /images/crops/*.jpg)
 * or SVG data URI to a Base64 JPEG data URL suitable for API transport and Gemini vision inference.
 */
export async function urlToJpegBase64(urlOrDataUri: string, maxWidth = 1024, maxHeight = 1024): Promise<string> {
  if (!urlOrDataUri) return '';

  // If already a raster JPEG/PNG/WebP data URI
  if (urlOrDataUri.startsWith('data:image/jpeg') || urlOrDataUri.startsWith('data:image/png') || urlOrDataUri.startsWith('data:image/webp')) {
    return urlOrDataUri;
  }

  // If SVG data URI
  if (urlOrDataUri.startsWith('data:image/svg') || urlOrDataUri.includes('<svg')) {
    return svgToJpegBase64(urlOrDataUri);
  }

  // If relative path (e.g. /images/crops/...) or full URL
  try {
    const res = await fetch(urlOrDataUri);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(urlOrDataUri);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Failed to convert image url to base64:', err);
    return urlOrDataUri;
  }
}
