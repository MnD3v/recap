'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

type StudentWatchSession = {
  userId: string;
  tutorialId: string;
  tutorialTitle: string;
  totalMinutesWatched: number;
  lastUpdated: Date;
  userEmail: string;
};

type TutorialAnalytics = {
  tutorialId: string;
  tutorialTitle: string;
  totalViewers: number;
  averageWatchTime: number;
  totalViewMinutes: number;
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [studentSessions, setStudentSessions] = useState<StudentWatchSession[]>([]);
  const [tutorialAnalytics, setTutorialAnalytics] = useState<TutorialAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'tutorials'>('tutorials');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Fetch all watch sessions for the current user as admin
        const watchSessionsRef = collection(db, 'users');
        const allUsers = await getDocs(watchSessionsRef);

        const allSessions: StudentWatchSession[] = [];

        for (const userDoc of allUsers.docs) {
          const watchSessionsCollection = collection(userDoc.ref, 'watchSessions');
          const snapshot = await getDocs(watchSessionsCollection);

          for (const sessionDoc of snapshot.docs) {
            const data = sessionDoc.data();
            allSessions.push({
              userId: userDoc.id,
              tutorialId: sessionDoc.id,
              tutorialTitle: data.tutorialTitle || 'Tutoriel sans titre',
              totalMinutesWatched: data.totalMinutesWatched || 0,
              lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
              userEmail: userDoc.id,
            });
          }
        }

        setStudentSessions(allSessions);

        // Calculate tutorial analytics
        const tutorialMap = new Map<string, TutorialAnalytics>();

        allSessions.forEach((session) => {
          const key = session.tutorialId;
          if (!tutorialMap.has(key)) {
            tutorialMap.set(key, {
              tutorialId: session.tutorialId,
              tutorialTitle: session.tutorialTitle,
              totalViewers: 0,
              averageWatchTime: 0,
              totalViewMinutes: 0,
            });
          }

          const analytics = tutorialMap.get(key)!;
          analytics.totalViewers += 1;
          analytics.totalViewMinutes += session.totalMinutesWatched;
        });

        // Calculate averages
        const tutorialsArray = Array.from(tutorialMap.values());
        tutorialsArray.forEach((t) => {
          if (t.totalViewers > 0) {
            t.averageWatchTime = Math.round(t.totalViewMinutes / t.totalViewers);
          }
        });

        // Sort by total view minutes descending
        tutorialsArray.sort((a, b) => b.totalViewMinutes - a.totalViewMinutes);

        setTutorialAnalytics(tutorialsArray);
      } catch (error) {
        console.error('Erreur lors du chargement des analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-lg font-semibold text-slate-900">
            Chargement des analyses...
          </p>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Tableau de bord d&apos;engagement
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Suivi du temps de visionnage par tutoriel et étudiant
            </p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            Administration
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6">
          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'tutorials'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analyseur tutoriels
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'students'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suivi étudiants
            </button>
          </div>

          {/* Tutorials Tab */}
          {activeTab === 'tutorials' && (
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Performance par tutoriel
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Vue d&apos;ensemble du temps moyen de visionnage par ressource
              </p>

              {tutorialAnalytics.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center text-sm text-slate-500">
                  Aucune données d&apos;engagement pour le moment. Les tutoriels
                  apparaîtront ici lorsque les étudiants commenceront à les
                  visionner.
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                          Tutoriel
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          Visualisations
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          Temps moyen
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          Total minutes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutorialAnalytics.map((tutorial) => (
                        <tr
                          key={tutorial.tutorialId}
                          className="border-b border-slate-200 transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-slate-900">
                            {tutorial.tutorialTitle}
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">
                            {tutorial.totalViewers}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold text-indigo-600">
                            {tutorial.averageWatchTime} min
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">
                            {tutorial.totalViewMinutes} min
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Suivi par étudiant
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Temps de visionnage enregistré pour chaque tutoriel par étudiant
              </p>

              {studentSessions.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center text-sm text-slate-500">
                  Aucune session de visionnage enregistrée pour le moment.
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                          ID Étudiant
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                          Tutoriel
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          Minutes visionnées
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          Dernière mise à jour
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSessions.map((session) => (
                        <tr
                          key={`${session.userId}-${session.tutorialId}`}
                          className="border-b border-slate-200 transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4 text-sm font-mono text-slate-600">
                            {session.userId.substring(0, 8)}...
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-900">
                            {session.tutorialTitle}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold text-indigo-600">
                            {session.totalMinutesWatched} min
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">
                            {session.lastUpdated.toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}

