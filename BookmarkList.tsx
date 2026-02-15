'use client';

import { Bookmark } from '@/types';
import { BookmarkItem } from './BookmarkItem';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
  loading: boolean;
}

export const BookmarkList = ({ bookmarks, onDelete, deletingId, loading }: BookmarkListProps) => {
  // Loading state
  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks yet</h3>
        <p className="text-gray-500">Add your first bookmark to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          deleting={deletingId === bookmark.id}
        />
      ))}
    </div>
  );
};
