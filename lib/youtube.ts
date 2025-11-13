/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtu.be/xxx, youtube.com/watch?v=xxx, youtube.com/embed/xxx
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // youtu.be/xxxxx format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=xxxxx format
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtube.com/embed/xxxxx format
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

/**
 * Get embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}


