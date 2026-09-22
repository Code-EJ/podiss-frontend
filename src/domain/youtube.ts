/** Provider identifiers are distinct from database UUIDs. @author oEnzoRibas */
export function isYouTubeId(value: string): boolean { return /^[A-Za-z0-9_-]{11}$/.test(value); }
/** Only validated identifiers can become embedded content URLs. @author oEnzoRibas */
export function youtubeEmbedUrl(id: string): string {
  if (!isYouTubeId(id)) throw new Error('Episódio inválido.');
  return `https://www.youtube.com/embed/${id}`;
}
/** Central provider thumbnail URL, with the same validation as the player. @author oEnzoRibas */
export function youtubeThumbnailUrl(id: string): string {
  if (!isYouTubeId(id)) throw new Error('Episódio inválido.');
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
