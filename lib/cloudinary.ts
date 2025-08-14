export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    quality?: number | 'auto';
    format?: string | 'auto';
  } = {}
): string {
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width,
    quality = 'auto',
    format = 'auto'
  } = options;

  // Extract the base URL and resource path
  const [baseUrl, resourcePath] = url.split('/upload/');
  if (!baseUrl || !resourcePath) {
    return url;
  }

  // Build transformation string
  const transformations = [
    quality !== undefined ? `q_${quality}` : null,
    format !== undefined ? `f_${format}` : null,
    width ? `w_${width}` : null,
    'fl_progressive', // Progressive JPEG loading
  ].filter(Boolean).join(',');

  return `${baseUrl}/upload/${transformations}/${resourcePath}`;
}

export function getCloudinaryBlurDataUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 10,
    quality: 10,
    format: 'webp'
  });
}