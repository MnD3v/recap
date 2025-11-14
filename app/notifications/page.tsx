'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';

type Notification = {
  id: string;
  userId: string;
  type: 'response' | 'mention' | 'faq';
  title: string;
  message: string;
  questionId?: string;
  tutorialId?: string;
  tutorialTitle?: string;
  responderId?: string;
  responderName?: string;
  isRead: boolean;
  createdAt: any;
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const notificationsQuery = query(
      collection(db, `users/${user.uid}/notifications`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifs: Notification[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            questionId: data.questionId,
            tutorialId: data.tutorialId,
            tutorialTitle: data.tutorialTitle,
            responderId: data.responderId,
            responderName: data.responderName,
            isRead: data.isRead,
            createdAt: data.createdAt,
          };
        });

        setNotifications(notifs);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const notificationRef = doc(db, `users/${user.uid}/notifications`, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const notificationRef = doc(db, `users/${user.uid}/notifications`, notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate to the tutorial
    if (notification.tutorialId) {
      router.push(`/watch/${notification.tutorialId}`);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      for (const notification of unreadNotifications) {
        const notificationRef = doc(db, `users/${user.uid}/notifications`, notification.id);
        await updateDoc(notificationRef, {
          isRead: true,
        });
      }
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="text-center">
            <div className="loader mx-auto mb-4"></div>
            <p className="text-sm text-gray-400">Chargement des notifications...</p>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black">
        <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-8 animate-fade-in">
          <div className="animate-slide-in-left">
            <h1 className="text-3xl font-semibold text-white">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {unreadCount > 0 
                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                : 'Aucune notification non lue'}
            </p>
          </div>
          <div className="flex gap-3 animate-slide-in-right">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-full border border-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
              >
                Tout marquer comme lu
              </button>
            )}
            <button
              onClick={() => router.back()}
              className="rounded-full border border-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
            >
              ← Retour
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-6 pb-24">
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-12 text-center animate-scale-in">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                <svg
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">
                Aucune notification
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Vous n&apos;avez pas encore de notifications. Elles apparaîtront ici quand quelqu&apos;un répondra à vos questions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <article
                  key={notification.id}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover-lift cursor-pointer animate-fade-in ${
                    notification.isRead
                      ? 'border-gray-800 bg-gray-950'
                      : 'border-indigo-900/50 bg-indigo-950/20'
                  }`}
                  style={{ animationDelay: `${0.05 + index * 0.03}s`, opacity: 0, animationFillMode: 'forwards' }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.isRead && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                      notification.isRead ? 'bg-gray-800' : 'bg-indigo-600'
                    }`}>
                      {notification.type === 'response' && (
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-300">
                            {notification.message}
                          </p>
                          {notification.tutorialTitle && (
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-1">
                              <span className="text-xs text-gray-400">📚</span>
                              <span className="text-xs text-gray-300">{notification.tutorialTitle}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-red-400"
                          title="Supprimer"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {notification.createdAt?.toDate?.().toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {!notification.isRead && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-indigo-400">Nouveau</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}

