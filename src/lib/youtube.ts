export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.substring(1);
    }
    if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com') {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }
      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.pathname.substring('/embed/'.length);
      }
      if (parsedUrl.pathname.startsWith('/v/')) {
        return parsedUrl.pathname.substring('/v/'.length);
      }
    }
  } catch (error) {
    // Invalid URL format, try regex as a fallback
  }
  
  // Regex fallback for other URL variations
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
