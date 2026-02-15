'use client';
import { useState, useEffect, useCallback } from 'react';
import { bookmarkService } from '@/services/bookmarkService';
import { Bookmark } from '@/types';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookmarkService.getBookmarks();
      setBookmarks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const handleInsert = useCallback((newB: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.find(b => b.id === newB.id)) return prev;
      return [newB, ...prev];
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    const channel = bookmarkService.subscribeToBookmarks(handleInsert, handleDelete);
    return () => { bookmarkService.unsubscribeFromBookmarks(channel); };
  }, [handleInsert, handleDelete]);

  const createBookmark = async (title: string, url: string) => {
    const { authService } = await import('@/services/authService');
    const user = await authService.getUser();
    if (!user) return;
    
    const newBookmark = await bookmarkService.createBookmark(title, url, user.id);
    // Optimistic Update: Update this tab immediately
    handleInsert(newBookmark); 
  };

  const deleteBookmark = async (id: string) => {
    // Optimistic Update: Update this tab immediately
    handleDelete(id);
    await bookmarkService.deleteBookmark(id);
  };

  return { bookmarks, loading, createBookmark, deleteBookmark };
};