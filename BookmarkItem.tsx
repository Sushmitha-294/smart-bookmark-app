'use client';

import { Bookmark } from '@/types';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<void>;
  deleting: boolean;
}

export const BookmarkItem = ({ bookmark, onDelete, deleting }: BookmarkItemProps) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      await onDelete(bookmark.id);
    }
  };

  // Format date
  const formattedDate = new Date(bookmark.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
          >
            {bookmark.url}
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Added on {formattedDate}
          </p>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Delete bookmark"
        >
          {deleting ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
