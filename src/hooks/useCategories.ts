import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();

    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchCategories)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchCategories]);

  const createCategory = async (data: Omit<Category, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('categories').insert(data);
    if (error) throw error;
    await fetchCategories();
  };

  const updateCategory = async (id: string, data: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (error) throw error;
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    await fetchCategories();
  };

  const rootCategories = categories.filter((c) => !c.parent_id);
  const subcategoriesOf = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  return { categories, rootCategories, subcategoriesOf, loading, createCategory, updateCategory, deleteCategory };
}
