import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Zone } from '../types';

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = useCallback(async () => {
    const { data } = await supabase
      .from('zones')
      .select('*')
      .order('created_at', { ascending: true });
    setZones((data as Zone[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchZones();

    const channel = supabase
      .channel('zones-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'zones' }, fetchZones)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchZones]);

  const createZone = async (data: Omit<Zone, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('zones').insert(data);
    if (error) throw error;
    await fetchZones();
  };

  const updateZone = async (id: string, data: Partial<Omit<Zone, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('zones').update(data).eq('id', id);
    if (error) throw error;
    await fetchZones();
  };

  const deleteZone = async (id: string) => {
    const { error } = await supabase.from('zones').delete().eq('id', id);
    if (error) throw error;
    await fetchZones();
  };

  return { zones, loading, createZone, updateZone, deleteZone };
}
