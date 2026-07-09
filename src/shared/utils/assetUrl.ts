// The backend occasionally stores/returns attachment URLs with a missing
// slash before the "v/" path segment (e.g. "...or.idv/<id>-blob" instead of
// "...or.id/v/<id>-blob"), which breaks next/image's hostname matching.
// This patches that specific corruption so already-stored bad URLs still load.
const CORRUPTED_HOST_PATTERN = /^(https?:\/\/cdn\.codelabspace\.or\.id)v\//i;

export function fixAttachmentUrl(url: string): string {
  return url.replace(CORRUPTED_HOST_PATTERN, '$1/v/');
}
