import { getSupabaseBrowserClient } from './supabaseClient';
import { Bookmark } from '@/types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const supabase = getSupabaseBrowserClient();

export const bookmarkService = {
  async getBookmarks(): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createBookmark(title: string, url: string, userId: string): Promise<Bookmark> {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: userId, title, url })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteBookmark(id: string): Promise<void> {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) throw error;
  },

  subscribeToBookmarks(onInsert: (b: Bookmark) => void, onDelete: (id: string) => void) {
    const channel = supabase
      .channel('realtime_v1') // Unique channel name
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookmarks' },
        (payload: RealtimePostgresChangesPayload<Bookmark>) => {
          console.log('INSERT EVENT DETECTED:', payload.new);
          if (payload.new) onInsert(payload.new as Bookmark);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookmarks' },
        (payload: RealtimePostgresChangesPayload<Bookmark>) => {
          if (payload.old && 'id' in payload.old) onDelete(payload.old.id as string);
        }
      )
      .subscribe((status: string) => {
        console.log('REALTIME_STATUS:', status); 
      });
    return channel;
  },

  unsubscribeFromBookmarks(channel: any) {
    supabase.removeChannel(channel);
  }
};