import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Point } from '../types';
import { deleteAllPointPhotos } from '../lib/storage';

export function usePoints() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    const { data } = await supabase
      .from('points')
      .select('*')
      .order('created_at', { ascending: true });
    setPoints((data as Point[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPoints();

    const channel = supabase
      .channel('points-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'points' }, fetchPoints)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPoints]);

  const createPoint = async (data: Omit<Point, 'id' | 'created_at'>, id?: string): Promise<Point> => {
    const { data: created, error } = await supabase
      .from('points')
      .insert({ ...data, ...(id ? { id } : {}) })
      .select()
      .single();
    if (error) throw error;
    await fetchPoints();
    return created as Point;
  };

  const updatePoint = async (id: string, data: Partial<Omit<Point, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('points').update(data).eq('id', id);
    if (error) throw error;
    await fetchPoints();
  };

  const deletePoint = async (id: string) => {
    await deleteAllPointPhotos(id);
    const { error } = await supabase.from('points').delete().eq('id', id);
    if (error) throw error;
    await fetchPoints();
  };

  return { points, loading, createPoint, updatePoint, deletePoint };
}
