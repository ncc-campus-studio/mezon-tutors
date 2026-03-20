import { YOUTUBE_EMBED_BASE_URL } from '../constants/urls';

/**
 * Extracts a YouTube video ID and returns a standard embed URL.
 * Supports:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 * - youtu.be/VIDEO_ID
 */
export function getYoutubeEmbedUrl(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null;

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();
    let videoId: string | undefined = undefined;

    if (host.includes('youtube.com')) {
      videoId =
        url.searchParams.get('v') || // watch?v=
        url.pathname.split('/')[2]; // embed/ or shorts/
    }

    if (host.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    }

    return videoId ? `${YOUTUBE_EMBED_BASE_URL}/${videoId}` : null;
  } catch {
    return null;
  }
}
