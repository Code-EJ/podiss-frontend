/** Response tags are a CSV string; request tags are an array. @author oEnzoRibas */
export function parseTags(value: string): string[] {
  return [...new Set(value.split(',').map(tag => tag.trim()).filter(Boolean))];
}
/**
 * Builds the multipart creation payload; the browser supplies its boundary.
 * @param title - Required title, trimmed before transmission.
 * @param description - Required editorial text.
 * @param tags - Individual tags; an empty array sends no tag fields.
 * @param image - Optional JPEG, PNG, GIF or WebP up to 5 MiB; the server validates bytes.
 * @returns A new form without a manually assigned Content-Type header.
 * @throws Error when client-side image size/type checks fail.
 * @author oEnzoRibas
 */
export function postForm(title: string, description: string, tags: string[], image?: File): FormData {
  const form = new FormData();
  form.append('title', title.trim()); form.append('description', description.trim());
  for (const tag of tags) form.append('tags', tag);
  if (image) {
    if (image.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5 MB.');
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(image.type))
      throw new Error('Use imagem JPEG, PNG, GIF ou WebP.');
    form.append('image', image);
  }
  return form;
}
