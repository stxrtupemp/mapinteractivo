import { supabase } from './supabase';

const BUCKET = 'point-photos';

export async function uploadPointPhoto(pointId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `points/${pointId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePointPhoto(publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.substring(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function deleteAllPointPhotos(pointId: string): Promise<void> {
  const { data } = await supabase.storage.from(BUCKET).list(`points/${pointId}`);
  if (!data?.length) return;
  const paths = data.map((f) => `points/${pointId}/${f.name}`);
  await supabase.storage.from(BUCKET).remove(paths);
}
