import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: true });
    setAlerts((data as Alert[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, fetchAlerts)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAlerts]);

  const createAlert = async (data: Omit<Alert, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('alerts').insert(data);
    if (error) throw error;
    await fetchAlerts();
  };

  const updateAlert = async (id: string, data: Partial<Omit<Alert, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('alerts').update(data).eq('id', id);
    if (error) throw error;
    await fetchAlerts();
  };

  const deleteAlert = async (id: string) => {
    const { error } = await supabase.from('alerts').delete().eq('id', id);
    if (error) throw error;
    await fetchAlerts();
  };

  return { alerts, loading, createAlert, updateAlert, deleteAlert };
}
