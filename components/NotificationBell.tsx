'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthProvider';

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const notificationsQuery = query(
      collection(db, `users/${user.uid}/notifications`),
      where('isRead', '==', false)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        setUnreadCount(snapshot.docs.length);
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleClick = () => {
    router.push('/notifications');
  };

  return (
    <button
      onClick={handleClick}
      className="relative rounded-full border border-gray-700 p-2.5 text-gray-300 transition-smooth hover:border-gray-600 hover:bg-gray-900 hover:text-white hover:scale-110"
      title="Notifications"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white animate-scale-in">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

