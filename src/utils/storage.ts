import { supabaseClient } from "../supabaseClient";

const BUCKET = "media";

export function extractMediaStoragePath(publicUrl?: string | null): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function removeMediaFile(publicUrl?: string | null): Promise<void> {
  const path = extractMediaStoragePath(publicUrl);
  if (!path) return;
  await supabaseClient.storage.from(BUCKET).remove([path]);
}
