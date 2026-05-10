import { z } from 'zod';
import { supabase } from './supabase';

const BackupSchema = z.object({
  version: z.literal(1),
  exported_at: z.string(),
  categories: z.array(z.any()),
  points: z.array(z.any()),
  alerts: z.array(z.any()),
  zones: z.array(z.any()),
});

export type Backup = z.infer<typeof BackupSchema>;

export async function exportBackup(): Promise<Backup> {
  const [cats, pts, alts, zns] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('points').select('*'),
    supabase.from('alerts').select('*'),
    supabase.from('zones').select('*'),
  ]);
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    categories: cats.data ?? [],
    points: pts.data ?? [],
    alerts: alts.data ?? [],
    zones: zns.data ?? [],
  };
}

export function downloadBackup(backup: Backup): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mapa-san-pedro-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(raw: unknown, mode: 'replace' | 'merge'): Promise<void> {
  const data = BackupSchema.parse(raw);

  if (mode === 'replace') {
    await supabase.from('zones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('points').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  const remap: Record<string, string> = {};
  const remapId = (oldId: string) =>
    (remap[oldId] ??= mode === 'merge' ? crypto.randomUUID() : oldId);

  const roots = (data.categories as Array<Record<string, unknown>>).filter((c) => !c.parent_id);
  const children = (data.categories as Array<Record<string, unknown>>).filter((c) => c.parent_id);

  if (roots.length) {
    const rootsRemapped = roots.map((c) => ({ ...c, id: remapId(c.id as string) }));
    await supabase.from('categories').insert(rootsRemapped);
  }

  if (children.length) {
    const childrenRemapped = children.map((c) => ({
      ...c,
      id: remapId(c.id as string),
      parent_id: remap[c.parent_id as string] ?? c.parent_id,
    }));
    await supabase.from('categories').insert(childrenRemapped);
  }

  const pointsRemapped = (data.points as Array<Record<string, unknown>>).map((p) => ({
    ...p,
    id: remapId(p.id as string),
    category_id: p.category_id ? (remap[p.category_id as string] ?? p.category_id) : null,
    subcategory_id: p.subcategory_id ? (remap[p.subcategory_id as string] ?? p.subcategory_id) : null,
  }));
  if (pointsRemapped.length) await supabase.from('points').insert(pointsRemapped);

  const alertsRemapped = (data.alerts as Array<Record<string, unknown>>).map((a) => ({
    ...a,
    id: remapId(a.id as string),
  }));
  if (alertsRemapped.length) await supabase.from('alerts').insert(alertsRemapped);

  const zonesRemapped = (data.zones as Array<Record<string, unknown>>).map((z) => ({
    ...z,
    id: remapId(z.id as string),
  }));
  if (zonesRemapped.length) await supabase.from('zones').insert(zonesRemapped);
}
